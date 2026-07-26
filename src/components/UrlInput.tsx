import type { KeyboardEvent } from "react";

type UrlInputProps = {
  mode: "single" | "compare";
  primaryValue: string;
  secondaryValue: string;
  onModeChange: (mode: "single" | "compare") => void;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function UrlInput({
  mode,
  primaryValue,
  secondaryValue,
  onModeChange,
  onPrimaryChange,
  onSecondaryChange,
  onSubmit,
  disabled,
}: UrlInputProps) {
  const canSubmit =
    mode === "compare"
      ? Boolean(primaryValue.trim() && secondaryValue.trim())
      : Boolean(primaryValue.trim());

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !disabled && canSubmit) {
      onSubmit();
    }
  }

  const submitLabel = mode === "compare" ? "开始对比" : "开始分析";

  return (
    <div className="url-composer">
      <div className="url-composer-card">
        <div className="url-composer-top">
          <span className="mode-switch-label">分析模式</span>
          <div className="mode-toggle" role="tablist" aria-label="分析模式">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "single"}
              className={mode === "single" ? "is-active" : ""}
              onClick={() => onModeChange("single")}
              disabled={disabled}
            >
              单仓分析
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "compare"}
              className={mode === "compare" ? "is-active" : ""}
              onClick={() => onModeChange("compare")}
              disabled={disabled}
            >
              对比模式
            </button>
          </div>
        </div>

        <div className={`url-composer-body ${mode === "compare" ? "is-compare" : "is-single"}`}>
          {mode === "single" ? (
            <div className="url-single-row">
              <input
                type="url"
                className="url-single-input"
                placeholder="https://github.com/owner/repo"
                value={primaryValue}
                onChange={(e) => onPrimaryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-label="仓库链接"
              />
              <button
                type="button"
                className="submit-btn"
                onClick={onSubmit}
                disabled={disabled || !canSubmit}
              >
                {submitLabel}
              </button>
            </div>
          ) : (
            <>
              <div className="url-compare-grid">
                <label className="url-field">
                  <span>仓库 A</span>
                  <input
                    type="url"
                    placeholder="https://github.com/owner/repo-a"
                    value={primaryValue}
                    onChange={(e) => onPrimaryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                  />
                </label>
                <label className="url-field">
                  <span>仓库 B</span>
                  <input
                    type="url"
                    placeholder="https://github.com/owner/repo-b"
                    value={secondaryValue}
                    onChange={(e) => onSecondaryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                  />
                </label>
              </div>
              <div className="url-composer-actions">
                <button
                  type="button"
                  className="submit-btn submit-btn-wide"
                  onClick={onSubmit}
                  disabled={disabled || !canSubmit}
                >
                  {submitLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}