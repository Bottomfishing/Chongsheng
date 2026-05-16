import { ref } from "vue";

export interface AppSettings {
  /** 全局复古底图浓度 0–0.6 */
  vintageOpacity: number;
  /** 首页 CRT 扫描线 */
  scanlines: boolean;
  /** 首页飘尘 / 光斑等动效 */
  ambience: boolean;
}

const STORAGE_KEY = "chongsheng_settings";

export const DEFAULT_SETTINGS: AppSettings = {
  vintageOpacity: 0.3,
  scanlines: true,
  ambience: true,
};

export const appSettings = ref<AppSettings>(loadSettings());

function clampOpacity(value: number): number {
  return Math.min(0.6, Math.max(0, value));
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      vintageOpacity: clampOpacity(
        typeof parsed.vintageOpacity === "number"
          ? parsed.vintageOpacity
          : DEFAULT_SETTINGS.vintageOpacity,
      ),
      scanlines:
        typeof parsed.scanlines === "boolean"
          ? parsed.scanlines
          : DEFAULT_SETTINGS.scanlines,
      ambience:
        typeof parsed.ambience === "boolean"
          ? parsed.ambience
          : DEFAULT_SETTINGS.ambience,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function applySettings(settings: AppSettings) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty(
    "--bg-vintage-opacity",
    String(clampOpacity(settings.vintageOpacity)),
  );
  root.style.setProperty(
    "--hub-vintage-overlay",
    String(clampOpacity(settings.vintageOpacity * 1.25)),
  );
  root.classList.toggle("settings-no-scanlines", !settings.scanlines);
  root.classList.toggle("settings-no-ambience", !settings.ambience);
}

export function saveSettings(settings: AppSettings) {
  const normalized: AppSettings = {
    vintageOpacity: clampOpacity(settings.vintageOpacity),
    scanlines: settings.scanlines,
    ambience: settings.ambience,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  appSettings.value = normalized;
  applySettings(normalized);
}

export function patchSettings(partial: Partial<AppSettings>) {
  saveSettings({ ...appSettings.value, ...partial });
}

export function initAppSettings() {
  const settings = loadSettings();
  appSettings.value = settings;
  applySettings(settings);
}
