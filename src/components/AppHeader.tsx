import { useEffect, useRef, useState } from "react";
import {
  AI_PROVIDER_PRESETS,
  detectProvider,
  getProviderPreset,
  hasApiKey,
  loadAiSettings,
  saveAiSettings,
  type AiProviderId,
  type AiSettings,
} from "../config/aiSettings";
import { PROJECT_REPO_URL } from "../config/site";
import { GitHubIcon, SettingsIcon } from "./icons";
import "./AppHeader.css";

type AppHeaderProps = {
  onSettingsChange: (settings: AiSettings) => void;
};

export function AppHeader({ onSettingsChange }: AppHeaderProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AiSettings>(loadAiSettings);
  const [provider, setProvider] = useState<AiProviderId>(() => detectProvider(loadAiSettings()));
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const configured = hasApiKey(draft);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleOpenSettings() {
    const current = loadAiSettings();
    setDraft(current);
    setProvider(detectProvider(current));
    setShowKey(false);
    setSaved(false);
    setOpen((prev) => !prev);
  }

  function handleProviderChange(nextProvider: AiProviderId) {
    setProvider(nextProvider);
    const preset = getProviderPreset(nextProvider);

    if (nextProvider === "custom") {
      setDraft((prev) => ({ ...prev }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      baseUrl: preset.baseUrl,
      model: preset.models.some((m) => m.value === prev.model) ? prev.model : preset.defaultModel,
    }));
  }

  function handleSave() {
    saveAiSettings(draft);
    onSettingsChange(draft);
    setSaved(true);
    setTimeout(() => setOpen(false), 700);
  }

  return (
    <header className="app-header" ref={panelRef}>
      <div className="app-header-actions">
        <a
          href={PROJECT_REPO_URL || "#"}
          className={`header-icon-btn ${PROJECT_REPO_URL ? "" : "is-placeholder"}`}
          title={PROJECT_REPO_URL ? "查看项目仓库" : "项目仓库（待配置）"}
          aria-label={PROJECT_REPO_URL ? "查看项目仓库" : "项目仓库（待配置）"}
          onClick={PROJECT_REPO_URL ? undefined : (e) => e.preventDefault()}
          target={PROJECT_REPO_URL ? "_blank" : undefined}
          rel={PROJECT_REPO_URL ? "noreferrer" : undefined}
        >
          <GitHubIcon className="header-icon" />
        </a>

        <button
          type="button"
          className={`header-icon-btn ${configured ? "is-configured" : ""}`}
          onClick={handleOpenSettings}
          aria-label="AI 设置"
          aria-expanded={open}
          title={configured ? `已配置：${draft.model}` : "配置 API Key 与模型"}
        >
          <SettingsIcon className="header-icon" />
          {configured && <span className="config-dot" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="settings-panel" role="dialog" aria-label="AI 设置">
          <div className="settings-panel-header">
            <h2>AI 设置</h2>
            <p>在页面配置 API Key 与语言模型，保存在本机浏览器。</p>
          </div>

          <div className="settings-field">
            <span>服务商</span>
            <div className="provider-tabs">
              {AI_PROVIDER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={provider === preset.id ? "is-active" : ""}
                  onClick={() => handleProviderChange(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <label className="settings-field">
            <span className="settings-field-label">
              API Key
              <button type="button" className="settings-link-btn" onClick={() => setShowKey((v) => !v)}>
                {showKey ? "隐藏" : "显示"}
              </button>
            </span>
            <input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              autoComplete="off"
            />
          </label>

          <label className="settings-field">
            <span>API Base URL</span>
            <input
              type="url"
              placeholder="https://api.deepseek.com/v1"
              value={draft.baseUrl}
              onChange={(e) => {
                const next = { ...draft, baseUrl: e.target.value };
                setDraft(next);
                setProvider(detectProvider(next));
              }}
              disabled={provider !== "custom"}
            />
          </label>

          <label className="settings-field">
            <span>语言模型</span>
            <input
              type="text"
              placeholder={
                provider === "deepseek"
                  ? "deepseek-v4-pro"
                  : provider === "openai"
                    ? "gpt-4o-mini"
                    : "输入模型名称"
              }
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
            />
          </label>

          <p className="settings-hint">
            保存后立刻生效。DeepSeek 常用：<code>deepseek-v4-pro</code>、<code>deepseek-v4-flash</code>。
          </p>

          <button type="button" className="settings-save" onClick={handleSave}>
            {saved ? "已保存 ✓" : "保存设置"}
          </button>
        </div>
      )}
    </header>
  );
}