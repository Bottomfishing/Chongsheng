import type { RuntimeState } from "./types";

export const SAVES_STORAGE_KEY = "interactive_story_saves_v1";
export const MAX_SAVES = 10;

export interface GameSave {
  id: string;
  timestamp: number;
  nodeId: string;
  choiceLog: Record<string, string>;
}

export function loadSaves(): GameSave[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(SAVES_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as GameSave[];
  } catch {
    window.localStorage.removeItem(SAVES_STORAGE_KEY);
    return [];
  }
}

export function saveGame(state: RuntimeState): GameSave {
  if (typeof window === "undefined") {
    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      nodeId: state.nodeId,
      choiceLog: { ...state.choiceLog },
    };
  }

  const saves = loadSaves();
  const save: GameSave = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    nodeId: state.nodeId,
    choiceLog: { ...state.choiceLog },
  };

  saves.unshift(save);
  if (saves.length > MAX_SAVES) {
    saves.pop();
  }

  window.localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(saves));
  return save;
}

export function loadGame(saveId: string): RuntimeState | null {
  const saves = loadSaves();
  const save = saves.find((s) => s.id === saveId);
  if (!save) {
    return null;
  }

  return {
    nodeId: save.nodeId,
    choiceLog: { ...save.choiceLog },
    updatedAt: Date.now(),
  };
}

export function deleteSave(saveId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const saves = loadSaves().filter((s) => s.id !== saveId);
  window.localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(saves));
}
