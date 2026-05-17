export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 680;

// 棋盘参数
export const COLS = 8;        // 列数（必须是偶数）
export const ROWS = 6;        // 行数
export const TILE_SIZE = 72;  // 每个格子大小
export const TILE_GAP = 6;    // 格子间距

// 计算棋盘偏移，使棋盘居中
export const BOARD_WIDTH = COLS * (TILE_SIZE + TILE_GAP) - TILE_GAP;
export const BOARD_HEIGHT = ROWS * (TILE_SIZE + TILE_GAP) - TILE_GAP;
export const BOARD_OFFSET_X = (GAME_WIDTH - BOARD_WIDTH) / 2;
export const BOARD_OFFSET_Y = (GAME_HEIGHT - BOARD_HEIGHT) / 2 + 30;

// 美食类型
export interface FoodItem {
    key: string;
    name: string;
}

export const FOODS: FoodItem[] = [
    { key: 'guobaorou',   name: '锅包肉' },
    { key: 'jianbinguozi', name: '煎饼果子' },
    { key: 'paomian',     name: '泡面' },
    { key: 'shutiao',     name: '薯条' },
    { key: 'tanghulu',    name: '糖葫芦' },
];
