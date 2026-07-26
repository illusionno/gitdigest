type LoadingStateProps = {
    mode?: "single" | "compare";
  };
  
  export function LoadingState({ mode = "single" }: LoadingStateProps) {
    const message =
      mode === "compare"
        ? "正在阅读两个 README，并生成并排对比结果…"
        : "正在阅读 README 并生成个性化分析…";
  
    return (
      <div className="state-box loading" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>{message}</p>
      </div>
    );
  }