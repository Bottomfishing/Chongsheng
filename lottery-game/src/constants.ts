export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// 奖品定义 - 水瓶是最终大奖
export interface Prize {
    name: string;
    icon: string;       // emoji 或文字
    color: number;      // 扇区颜色
    weight: number;     // 权重（越大越容易抽中，水瓶最小）
}

export const PRIZES: Prize[] = [
    { name: '金币×10',    icon: '🪙', color: 0xFFD700, weight: 25 },
    { name: '小星星',     icon: '⭐', color: 0xFF69B4, weight: 20 },
    { name: '棒棒糖',     icon: '🍭', color: 0x87CEEB, weight: 18 },
    { name: '钻石×1',     icon: '💎', color: 0x9B59B6, weight: 12 },
    { name: '红包',       icon: '🧧', color: 0xE74C3C, weight: 10 },
    { name: '水瓶',       icon: '🫗', color: 0x2ECC71, weight: 5  },
    { name: '谢谢参与',   icon: '😅', color: 0x95A5A6, weight: 7  },
    { name: '再来一次',   icon: '🔄', color: 0xF39C12, weight: 3  },
];

// 转盘参数
export const WHEEL_RADIUS = 200;
export const WHEEL_CENTER_X = GAME_WIDTH / 2;
export const WHEEL_CENTER_Y = 280;
export const POINTER_X = GAME_WIDTH / 2;
export const POINTER_Y = WHEEL_CENTER_Y - WHEEL_RADIUS - 20;

// 旋转参数
export const MIN_SPIN_DURATION = 4000;  // 最少旋转4秒
export const MAX_SPIN_DURATION = 7000;  // 最多旋转7秒
export const MIN_ROTATIONS = 5;         // 最少转5圈
export const MAX_ROTATIONS = 8;         // 最多转8圈
