export type AiSettings = {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  
  export type AiProviderId = "deepseek" | "openai" | "custom";
  
  export type AiProviderPreset = {
    id: AiProviderId;
    label: string;
    baseUrl: string;
    models: { value: string; label: string }[];
    defaultModel: string;
  };
  
  export const AI_PROVIDER_PRESETS: AiProviderPreset[] = [
    {
      id: "deepseek",
      label: "DeepSeek",
      baseUrl: "https://api.deepseek.com/v1",
      defaultModel: "deepseek-v4-pro",
      models: [
        { value: "deepseek-v4-pro", label: "deepseek-v4-pro（高质量）" },
        { value: "deepseek-v4-flash", label: "deepseek-v4-flash（更快更省）" },
        { value: "deepseek-chat", label: "deepseek-chat（兼容别名）" },
      ],
    },
    {
      id: "openai",
      label: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      defaultModel: "gpt-4o-mini",
      models: [
        { value: "gpt-4o-mini", label: "gpt-4o-mini" },
        { value: "gpt-4o", label: "gpt-4o" },
        { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
      ],
    },
    {
      id: "custom",
      label: "自定义",
      baseUrl: "",
      defaultModel: "",
      models: [],
    },
  ];
  
  const STORAGE_KEY = "gitdigest-ai-settings";
  const DEFAULT_BASE_URL = "https://api.openai.com/v1";
  const DEFAULT_MODEL = "gpt-4o-mini";
  
  function envFallback(): AiSettings {
    return {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY?.trim() ?? "",
      baseUrl: import.meta.env.VITE_OPENAI_BASE_URL?.trim() || DEFAULT_BASE_URL,
      model: import.meta.env.VITE_OPENAI_MODEL?.trim() || DEFAULT_MODEL,
    };
  }
  
  export function detectProvider(settings: AiSettings): AiProviderId {
    const baseUrl = settings.baseUrl.trim().toLowerCase();
  
    if (baseUrl.includes("deepseek.com")) return "deepseek";
    if (baseUrl.includes("openai.com")) return "openai";
    return "custom";
  }
  
  export function getProviderPreset(id: AiProviderId): AiProviderPreset {
    return AI_PROVIDER_PRESETS.find((p) => p.id === id) ?? AI_PROVIDER_PRESETS[2];
  }
  
  export function loadAiSettings(): AiSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return envFallback();
  
      const parsed = JSON.parse(raw) as Partial<AiSettings>;
      const fallback = envFallback();
  
      return {
        apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : fallback.apiKey,
        baseUrl: parsed.baseUrl?.trim() || fallback.baseUrl,
        model: parsed.model?.trim() || fallback.model,
      };
    } catch {
      return envFallback();
    }
  }
  
  export function saveAiSettings(settings: AiSettings): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        apiKey: settings.apiKey.trim(),
        baseUrl: settings.baseUrl.trim() || DEFAULT_BASE_URL,
        model: settings.model.trim() || DEFAULT_MODEL,
      }),
    );
  }
  
  export function clearAiSettings(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
  
  export function hasApiKey(settings: AiSettings): boolean {
    return settings.apiKey.trim().length > 0;
  }