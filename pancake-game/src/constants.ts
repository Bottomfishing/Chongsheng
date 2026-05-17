export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// 游戏状态
export enum GameState {
    IDLE,           // 等待倒面糊
    POURING,        // 倒面糊中
    COOKING_SIDE1,  // 第一面煎
    READY_FLIP,     // 可以翻面
    COOKING_SIDE2,  // 第二面煎
    READY_SERVE,    // 可以出锅
    FLIPPING,       // 翻面动画
    SERVING,        // 出锅动画
}

// 煎饼烤制程度
export enum CookLevel {
    RAW = 0,        // 生
    LIGHT = 1,      // 微黄
    PERFECT = 2,    // 完美
    DARK = 3,       // 过火
    BURNT = 4,      // 焦了
}

// 配料
export interface Topping {
    key: string;
    name: string;
    color: number;
}

export const TOPPINGS: Topping[] = [
    { key: 'egg',      name: '鸡蛋', color: 0xFFD700 },
    { key: 'scallion', name: '葱花', color: 0x66BB6A },
    { key: 'sauce',    name: '酱料', color: 0x8B4513 },
    { key: 'cilantro', name: '香菜', color: 0x4CAF50 },
    { key: 'lettuce',  name: '生菜', color: 0x8BC34A },
];

// 计时参数（毫秒）
export const POUR_DURATION = 1200;
export const FLIP_DURATION = 600;
export const SERVE_DURATION = 500;

// 烤制时间阈值（毫秒）
export const COOK_TIMES = {
    [CookLevel.RAW]:    0,
    [CookLevel.LIGHT]:  2000,
    [CookLevel.PERFECT]: 4000,
    [CookLevel.DARK]:   6000,
    [CookLevel.BURNT]:  8000,
};
