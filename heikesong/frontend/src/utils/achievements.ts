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
  {
    id: "first_choice",
    name: "命运的齿轮",
    description: "做出你的第一个选择",
    icon: "⚙️",
  },
  {
    id: "complete_story",
    name: "九十年代的过客",
    description: "完整体验一次重生之旅",
    icon: "🎬",
  },
  {
    id: "soul_talk_first",
    name: "心灵捕手",
    description: "与 SoulTalk 中的角色完成第一次对话",
    icon: "💬",
  },
  {
    id: "all_endings",
    name: "全知者",
    description: "解锁所有结局",
    icon: "🏆",
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
