import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { CompareDigestBoard } from "./components/CompareDigestBoard";
import { DigestCard } from "./components/DigestCard";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { SpaceDecorations } from "./components/SpaceDecorations";
import { UrlInput } from "./components/UrlInput";
import { loadAiSettings, type AiSettings } from "./config/aiSettings";
import { analyzeRepo, analyzeReposForComparison } from "./services/github";
import type { CompareDigestResult, DigestResult } from "./types/digest";
import "./App.css";

type ViewState = "idle" | "loading" | "success" | "error";
type AnalysisMode = "single" | "compare";
type AnalysisResult =
  | { kind: "single"; data: DigestResult }
  | { kind: "compare"; data: CompareDigestResult };

export default function App() {
  const [mode, setMode] = useState<AnalysisMode>("single");
  const [primaryUrl, setPrimaryUrl] = useState("");
  const [secondaryUrl, setSecondaryUrl] = useState("");
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiSettings, setAiSettings] = useState<AiSettings>(loadAiSettings);

  function handleModeChange(nextMode: AnalysisMode) {
    setMode(nextMode);
    setViewState("idle");
    setResult(null);
    setErrorMessage("");
  }

  async function handleAnalyze() {
    setViewState("loading");
    setResult(null);
    setErrorMessage("");

    try {
      if (mode === "compare") {
        const comparison = await analyzeReposForComparison(primaryUrl, secondaryUrl, aiSettings);
        setResult({ kind: "compare", data: comparison });
      } else {
        const digest = await analyzeRepo(primaryUrl, aiSettings);
        setResult({ kind: "single", data: digest });
      }

      setViewState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "未知错误");
      setViewState("error");
    }
  }

  return (
    <>
      <SpaceDecorations />
      <AppHeader onSettingsChange={setAiSettings} />
      <main className="app">
        <header className="hero">
          <span className="hero-badge">for curious devs</span>
          <h1>gitdigest</h1>
          <p className="hero-tagline">3 分钟，看懂一个仓库值不值得学</p>
          <p className="hero-sub">
            别再只看 star 数。现在既能做单仓分析，也能并排比较两个仓库，帮你判断应该先学哪一个。
          </p>
          <UrlInput
            mode={mode}
            primaryValue={primaryUrl}
            secondaryValue={secondaryUrl}
            onModeChange={handleModeChange}
            onPrimaryChange={setPrimaryUrl}
            onSecondaryChange={setSecondaryUrl}
            onSubmit={handleAnalyze}
            disabled={viewState === "loading"}
          />
        </header>

        <section className="results">
          {viewState === "loading" && <LoadingState mode={mode} />}
          {viewState === "error" && <ErrorState message={errorMessage} />}
          {viewState === "success" && result?.kind === "single" && <DigestCard result={result.data} />}
          {viewState === "success" && result?.kind === "compare" && <CompareDigestBoard result={result.data} />}
        </section>
      </main>
    </>
  );
}