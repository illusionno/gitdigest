import type { AiSettings } from "../config/aiSettings";
import type { CompareDigestResult, DigestResult, GithubRepoResponse } from "../types/digest";
import { generateComparisonWithAi, generateDigestWithAi } from "./ai";
import { fetchReadme } from "./readme";

export function parseGithubUrl(url: string): { owner: string; repo: string } {
  const parsed = new URL(url.trim());
  const [owner, repo] = parsed.pathname.split("/").filter(Boolean);

  if (parsed.hostname !== "github.com" || !owner || !repo) {
    throw new Error("URL 格式不正确，请输入类似 https://github.com/owner/repo 的地址");
  }

  return { owner, repo };
}

export async function fetchRepo(owner: string, repo: string): Promise<GithubRepoResponse> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status === 404) {
    throw new Error("仓库不存在或为私有仓库，请换一个公开仓库试试");
  }

  if (response.status === 403) {
    throw new Error("GitHub API 请求受限（未登录约 60 次/小时），请稍后再试");
  }

  if (!response.ok) {
    throw new Error(`GitHub API 返回错误 (${response.status})`);
  }

  return response.json() as Promise<GithubRepoResponse>;
}

async function fetchRepoBundle(url: string): Promise<{ repoData: GithubRepoResponse; readme: string }> {
  const { owner, repo } = parseGithubUrl(url);
  const [repoData, readme] = await Promise.all([fetchRepo(owner, repo), fetchReadme(owner, repo)]);
  return { repoData, readme };
}

/** v0.2：GitHub 元数据 + README → AI 生成个性化 Digest */
export async function analyzeRepo(url: string, aiSettings?: AiSettings): Promise<DigestResult> {
  const { repoData, readme } = await fetchRepoBundle(url);
  const aiDigest = await generateDigestWithAi(repoData, readme, aiSettings);

  return {
    repoName: repoData.full_name,
    repoUrl: repoData.html_url,
    stars: repoData.stargazers_count,
    language: repoData.language,
    ...aiDigest,
  };
}

export async function analyzeReposForComparison(
  leftUrl: string,
  rightUrl: string,
  aiSettings?: AiSettings,
): Promise<CompareDigestResult> {
  const [leftBundle, rightBundle] = await Promise.all([fetchRepoBundle(leftUrl), fetchRepoBundle(rightUrl)]);
  const aiComparison = await generateComparisonWithAi(
    leftBundle.repoData,
    leftBundle.readme,
    rightBundle.repoData,
    rightBundle.readme,
    aiSettings,
  );

  return {
    left: {
      repoName: leftBundle.repoData.full_name,
      repoUrl: leftBundle.repoData.html_url,
      stars: leftBundle.repoData.stargazers_count,
      language: leftBundle.repoData.language,
      ...aiComparison.left,
    },
    right: {
      repoName: rightBundle.repoData.full_name,
      repoUrl: rightBundle.repoData.html_url,
      stars: rightBundle.repoData.stargazers_count,
      language: rightBundle.repoData.language,
      ...aiComparison.right,
    },
    comparisonConclusion: aiComparison.comparisonConclusion,
  };
}