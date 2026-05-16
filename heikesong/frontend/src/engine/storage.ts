import type { RuntimeState } from "./types";

export const RUNTIME_STORAGE_KEY = "interactive_story_runtime_v1";

export function loadRuntimeState(): RuntimeState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(RUNTIME_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as RuntimeState;
  } catch {
    window.localStorage.removeItem(RUNTIME_STORAGE_KEY);
    return null;
  }
}

export function saveRuntimeState(state: RuntimeState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(state));
}

export function clearRuntimeState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(RUNTIME_STORAGE_KEY);
}
