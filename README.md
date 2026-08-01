# GitDigest

**3 分钟，看懂一个仓库值不值得学。**

AI digest for GitHub repos — decide if a project is worth learning, or compare two side by side.

粘贴一个公开的 GitHub 仓库链接，GitDigest 会结合仓库元数据与 README，生成面向学习者的分析报告：值不值得学、为什么火、技术栈、学习路径、适用场景，以及什么情况可以跳过。也支持并排对比两个仓库，帮你判断先学哪一个。

<img width="2822" height="1462" alt="image" src="https://github.com/user-attachments/assets/c3f9e169-c2d4-4a27-a9f3-5df0c6d3ba2e" />

## 💡 为什么做这个

逛 GitHub 的时候，我常常会被一个仓库的 star 数、热榜位置，或者一句很酷的 slogan 吸引——点进去，却花半小时才发现：它并不适合我现在的阶段，或者其实和我要解决的问题差得很远。

README 很长，Issues 很热闹，但真正缺的是一个冷静一点、也更贴近学习者的问题：

> 这个仓库，值不值得我现在花时间学？

GitDigest 就是为这个问题而生的。

它不是又一个「仓库摘要工具」，而是想帮你在动手之前先想清楚：它解决什么痛点、技术栈长什么样、怎么学比较高效、什么人适合、什么情况可以直接跳过。如果你正在两个看起来都不错的仓库之间犹豫，也可以把它们放在一起比一比。

我希望它能省下那些「打开了很多 tab，最后却不知道该学哪个」的夜晚——把时间留给真正值得深入的项目。

<img width="2880" height="1462" alt="image" src="https://github.com/user-attachments/assets/7e4d265b-3b6b-4a67-87bb-236412c9460a" />

<img width="2880" height="1462" alt="image" src="https://github.com/user-attachments/assets/34eb3c67-2105-4094-adf9-948d41b58f63" />

## ✨ 功能

- 🔍 **单仓分析**：输入仓库 URL，一键生成结构化 digest
- ⚖️ **双仓对比**：并排分析两个仓库，并给出对比结论
- 🎯 **学习者视角**：重点回答「值不值得学」，而不是只堆 star 数
- 🤖 **多模型支持**：DeepSeek / OpenAI / 兼容 OpenAI API 的自定义服务
- 🔐 **本地配置**：API Key 保存在浏览器 localStorage，也可通过 `.env` 提供开发默认值

分析卡片包含：

| 板块 | 内容 |
|------|------|
| ✅ Verdict | 值不值得学 & 理由 |
| 💡 Insight | 为什么火 / 解决什么问题 |
| ⭐ Highlights | 核心亮点 |
| 🧱 Stack | 技术栈与架构 |
| 🗺️ Path | 如何学习与借鉴 |
| 🧩 Fit | 可用场景 |
| ⏭️ Skip | 什么情况可以跳过 |

## 🛠️ 技术栈

- ⚛️ React 19 + TypeScript
- ⚡ Vite 6
- 🐙 GitHub REST API（仓库信息 + README）
- 💬 OpenAI 兼容 Chat Completions API

## 🚀 快速开始

### 📋 环境要求

- Node.js 18+
- 一个可用的 LLM API Key（推荐 [DeepSeek](https://platform.deepseek.com/) 或 OpenAI）

### 📦 安装与运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（通常是 `http://localhost:5173`）。

### ⚙️ 配置 API

**方式一（推荐）：页面内配置**

1. 打开右上角设置
2. 选择服务商（DeepSeek / OpenAI / 自定义）
3. 填入 API Key（及模型名称）
4. 保存

配置会保存在本机浏览器，不会上传到本项目服务器。

**方式二：环境变量（开发默认值）**

```bash
cp .env.example .env
```

编辑 `.env`：

```env
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_OPENAI_BASE_URL=https://api.deepseek.com/v1
VITE_OPENAI_MODEL=deepseek-v4-pro
```

> ⚠️ 注意：以 `VITE_` 开头的变量会打进前端产物。公开部署时请优先让用户在页面自行填写 Key，或通过自己的后端代理调用模型。

### 🏗️ 构建

```bash
npm run build
npm run preview
```

## 📖 使用方式

1. 选择 **单仓分析** 或 **对比模式**
2. 粘贴公开仓库地址，例如：`https://github.com/hugohe3/ppt-master/`
3. 点击开始分析 / 开始对比
4. 阅读生成的 digest，再决定要不要深入这个仓库

## 📁 项目结构

```text
src/
  components/     # UI：输入、结果卡片、设置、装饰
  config/         # AI 设置、站点配置
  services/       # GitHub / README / AI 调用
  types/          # 类型定义
  App.tsx         # 页面主流程
```

## 🐳 Docker 部署（阿里云轻量等）

适合在已安装 Docker 的云服务器上运行。镜像内用 Nginx 提供静态文件，**不要**把 API Key 打进镜像。

```bash
# 在服务器上
git clone https://github.com/你的用户名/gitdigest.git
cd gitdigest
docker compose up -d --build
```

浏览器访问：`http://服务器公网IP`  
记得在云控制台防火墙放行 **80** 端口。

更新代码后：

```bash
cd gitdigest
git pull
docker compose up -d --build
```

可选清理无用镜像以节省磁盘：

```bash
docker image prune -f
docker builder prune -f
```

## ⚠️ 注意事项

- 仅支持 **公开** GitHub 仓库
- 未填写 GitHub Token 时，API 有速率限制（约 60 次/小时）；填写后约 5000 次/小时
- AI 分析依赖 README 与仓库元数据质量；空 README 时效果会变差
`.env` 已在 `.gitignore` 中忽略

## 📄 许可证

MIT
