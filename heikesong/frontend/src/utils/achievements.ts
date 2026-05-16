/**
 * 成就系统
 * 使用 localStorage 存储已解锁成就
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "smash_tv",
    name: "暴力倾向",
    description: "在加载页面砸碎那台老电视",
    icon: "📺",
  },
];

const STORAGE_KEY = "chongsheng_achievements";

export function loadUnlockedAchievements(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function unlockAchievement(id: string): boolean {
  const unlocked = loadUnlockedAchievements();
  if (unlocked.includes(id)) {
    return false;
  }
  unlocked.push(id);
  saveUnlockedAchievements(unlocked);
  return true;
}

export function isAchievementUnlocked(id: string): boolean {
  return loadUnlockedAchievements().includes(id);
}

export function getUnlockedCount(): number {
  return loadUnlockedAchievements().length;
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getAllAchievements(): Achievement[] {
  const unlocked = new Set(loadUnlockedAchievements());
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlockedAt: unlocked.has(a.id) ? Date.now() : undefined,
  }));
}
