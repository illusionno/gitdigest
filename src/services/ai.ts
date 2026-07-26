import { hasApiKey, loadAiSettings, type AiSettings } from "../config/aiSettings";
import type { DigestResult, GithubRepoResponse, WorthScore } from "../types/digest";

type AiDigestPayload = {
  worthScore: WorthScore;
  worthReason: string;
  whyTrending: string;
  keyHighlights: string[];
  techStack: string;
  howToLearn: string[];
  useCases: string;
  notFor: string;
};

type AiComparisonPayload = {
  left: AiDigestPayload;
  right: AiDigestPayload;
  comparisonConclusion: string;
};

const SYSTEM_PROMPT = `你是 GitDigest 的资深技术分析助手，读者是经常逛 GitHub 的开发者。

你的任务：根据仓库元数据和 README，输出深入、具体、有建设性的分析报告。

写作要求：
- 像有经验的同事在聊天，不要官话、套话、模板句
- 必须针对「这个仓库」分析，引用 README 中的真实信息（功能、架构、依赖、使用方式）
- 每个仓库的分析角度和措辞应有明显差异
- 内容要充实：宁可多给有价值的信息，不要几句话敷衍
- 学习路线是概念级 4-5 步，每步写清楚「看什么、为什么看、看完能懂什么」
- 如果仓库不适合大多数人深入，要诚实说明
- 全部用中文回答`;

const DIGEST_FORMAT_PROMPT = `{
  "worthScore": "high 或 medium 或 low，表示普通前端开发者是否值得深入学习",
  "worthReason": "2-3 句话：给出评分理由，要具体",
  "whyTrending": "5-8 句话：为什么受关注、解决什么痛点、和同类方案比有何差异、近期火的可能原因",
  "keyHighlights": ["亮点 1：具体功能或设计", "亮点 2", "亮点 3", "亮点 4（可选）"],
  "techStack": "3-5 句话：从 README 推断的核心技术栈、架构特点、关键依赖",
  "howToLearn": [
    "第 1 步：...（含看什么、为什么、预期收获）",
    "第 2 步：...",
    "第 3 步：...",
    "第 4 步：...",
    "第 5 步：...（可选，复杂项目可给）"
  ],
  "useCases": "4-6 句话：什么人值得学、能借鉴哪些具体思路或模式、可以怎么用在自己的项目里",
  "notFor": "2-4 句话：什么人不适合花时间、什么情况下可以跳过"
}`;

function truncateReadme(readme: string, maxChars = 12000): string {
  const trimmed = readme.trim();
  if (!trimmed) {
    return "（README 为空或无法获取）";
  }

  if (trimmed.length <= maxChars) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxChars)}\n\n（README 过长，以上为节选）`;
}

function buildRepoContext(repo: GithubRepoResponse, readme: string): string {
  const topics = repo.topics.length > 0 ? repo.topics.join("、") : "无";
  const readmeSection = truncateReadme(readme);

  return `仓库：${repo.full_name}
Stars：${repo.stargazers_count}
主语言：${repo.language ?? "未知"}
标签：${topics}
简介：${repo.description ?? "无"}

README（节选）：
${readmeSection}`;
}

function buildUserPrompt(repo: GithubRepoResponse, readme: string): string {
  return `请深入分析以下 GitHub 仓库：

${buildRepoContext(repo, readme)}

请严格以 JSON 返回：
${DIGEST_FORMAT_PROMPT}`;
}

function buildComparePrompt(
  leftRepo: GithubRepoResponse,
  leftReadme: string,
  rightRepo: GithubRepoResponse,
  rightReadme: string,
): string {
  return `请同时分析下面两个 GitHub 仓库，并帮我回答「学 A 还是学 B」。

左侧仓库：
${buildRepoContext(leftRepo, leftReadme)}

右侧仓库：
${buildRepoContext(rightRepo, rightReadme)}

要求：
- 左右两侧都要独立给出完整 digest，字段含义与单仓分析一致
- 对比结论要直接回答：先学哪个、分别适合什么目标、什么情况下换另一个
- 不要写空泛套话，尽量结合两个仓库的 README 与定位差异

请严格以 JSON 返回：
{
  "left": ${DIGEST_FORMAT_PROMPT},
  "right": ${DIGEST_FORMAT_PROMPT},
  "comparisonConclusion": "4-6 句话：直接给出学习建议，对比学习价值、迁移价值、适用场景"
}`;
}

function parseWorthScore(value: unknown): WorthScore {
  if (value === "high" || value === "medium" || value === "low") return value;
  return "medium";
}

function extractJson(content: string): string {
  const trimmed = content.trim();
  const jsonText = trimmed.startsWith("{") ? trimmed : trimmed.match(/\{[\s\S]*\}/)?.[0];

  if (!jsonText) {
    throw new Error("AI 返回格式异常，请重试");
  }

  return jsonText;
}

function parseDigestPayload(payload: Partial<AiDigestPayload> | undefined): AiDigestPayload {
  if (!payload) {
    throw new Error("AI 返回内容不完整，请重试");
  }

  if (
    !payload.whyTrending ||
    !Array.isArray(payload.keyHighlights) ||
    !payload.techStack ||
    !Array.isArray(payload.howToLearn) ||
    !payload.useCases ||
    !payload.notFor
  ) {
    throw new Error("AI 返回内容不完整，请重试");
  }

  if (payload.howToLearn.length < 4) {
    throw new Error("AI 学习路线不足 4 步，请重试");
  }

  return {
    worthScore: parseWorthScore(payload.worthScore),
    worthReason: (payload.worthReason ?? "请结合仓库特点自行判断").trim(),
    whyTrending: payload.whyTrending.trim(),
    keyHighlights: payload.keyHighlights.slice(0, 5).map((s) => s.trim()).filter(Boolean),
    techStack: payload.techStack.trim(),
    howToLearn: payload.howToLearn.slice(0, 5).map((s) => s.trim()),
    useCases: payload.useCases.trim(),
    notFor: payload.notFor.trim(),
  };
}

function parseAiJson(content: string): AiDigestPayload {
  const parsed = JSON.parse(extractJson(content)) as Partial<AiDigestPayload>;
  return parseDigestPayload(parsed);
}

function parseComparisonAiJson(content: string): AiComparisonPayload {
  const parsed = JSON.parse(extractJson(content)) as Partial<AiComparisonPayload>;

  if (!parsed.comparisonConclusion) {
    throw new Error("AI 未返回对比结论，请重试");
  }

  return {
    left: parseDigestPayload(parsed.left),
    right: parseDigestPayload(parsed.right),
    comparisonConclusion: parsed.comparisonConclusion.trim(),
  };
}

function resolveConfig(settings?: AiSettings) {
  const config = settings ?? loadAiSettings();
  const apiKey = config.apiKey.trim();

  if (!hasApiKey(config)) {
    throw new Error("未配置 AI API Key。请点击右上角设置图标填写并保存");
  }

  return {
    apiKey,
    baseUrl: (config.baseUrl.trim() || "https://api.openai.com/v1").replace(/\/$/, ""),
    model: config.model.trim() || "gpt-4o-mini",
  };
}

export async function generateDigestWithAi(
  repo: GithubRepoResponse,
  readme: string,
  settings?: AiSettings,
): Promise<Omit<DigestResult, "repoName" | "repoUrl" | "stars" | "language">> {
  const { apiKey, baseUrl, model } = resolveConfig(settings);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(repo, readme) },
      ],
    }),
  });

  if (response.status === 401) {
    throw new Error("AI API Key 无效，请检查右上角设置");
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI 服务请求失败 (${response.status})：${detail.slice(0, 120)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI 未返回有效内容，请重试");
  }

  return parseAiJson(content);
}

export async function generateComparisonWithAi(
  leftRepo: GithubRepoResponse,
  leftReadme: string,
  rightRepo: GithubRepoResponse,
  rightReadme: string,
  settings?: AiSettings,
): Promise<AiComparisonPayload> {
  const { apiKey, baseUrl, model } = resolveConfig(settings);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 4200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildComparePrompt(leftRepo, leftReadme, rightRepo, rightReadme) },
      ],
    }),
  });

  if (response.status === 401) {
    throw new Error("AI API Key 无效，请检查右上角设置");
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI 服务请求失败 (${response.status})：${detail.slice(0, 120)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI 未返回有效内容，请重试");
  }

  return parseComparisonAiJson(content);
}