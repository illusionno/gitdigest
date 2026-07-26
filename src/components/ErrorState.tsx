type ErrorStateProps = {
    message: string;
  };
  
  export function ErrorState({ message }: ErrorStateProps) {
    return (
      <div className="state-box error" role="alert">
        <p>
          <strong>这次没解析成功</strong>
          <br />
          {message}
        </p>
        <p className="hint">试试：检查 URL 格式 → 确认仓库是公开的 → 换个小仓库再分析一次</p>
      </div>
    );
  }