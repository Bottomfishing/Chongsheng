// 常量定义
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const GROUND_Y = 440;
export const ROUND_TIME = 60;

// 角色动作枚举
export enum FighterAction {
    IDLE = 'idle',
    WALK = 'walk',
    JUMP = 'jump',
    PUNCH = 'punch',
    KICK = 'kick',
    SPECIAL = 'special',
    HURT = 'hurt',
    BLOCK = 'block',
    CROUCH = 'crouch',
    CROUCH_KICK = 'crouch_kick',
    WIN = 'win',
    LOSE = 'lose'
}

// 角色数据
export interface FighterData {
    name: string;
    maxHp: number;
    speed: number;
    jumpForce: number;
    punchDamage: number;
    kickDamage: number;
    specialDamage: number;
    crouchKickDamage: number;
    color: number;
    hairColor: number;
}

export const MALE_FIGHTER: FighterData = {
    name: '龙拳',
    maxHp: 1000,
    speed: 200,
    jumpForce: -500,
    punchDamage: 50,
    kickDamage: 70,
    specialDamage: 120,
    crouchKickDamage: 60,
    color: 0x2563eb,      // 蓝色衣服
    hairColor: 0x1a1a2e    // 黑色头发
};

export const FEMALE_FIGHTER: FighterData = {
    name: '凤舞',
    maxHp: 900,
    speed: 260,
    jumpForce: -550,
    punchDamage: 40,
    kickDamage: 60,
    specialDamage: 150,
    crouchKickDamage: 55,
    color: 0xe11d48,      // 红色衣服
    hairColor: 0xfbbf24   // 金色头发
};

// 攻击判定框配置
export interface HitboxConfig {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    activeFrames: number;  // 攻击判定的持续帧数
    damage: number;
    knockback: number;
}

export const PUNCH_HITBOX: HitboxConfig = {
    offsetX: 30, offsetY: -20, width: 40, height: 30,
    activeFrames: 6, damage: 0, knockback: 150
};

export const KICK_HITBOX: HitboxConfig = {
    offsetX: 25, offsetY: 10, width: 50, height: 35,
    activeFrames: 8, damage: 0, knockback: 200
};

export const SPECIAL_HITBOX: HitboxConfig = {
    offsetX: 20, offsetY: -10, width: 70, height: 50,
    activeFrames: 10, damage: 0, knockback: 300
};

export const CROUCH_KICK_HITBOX: HitboxConfig = {
    offsetX: 25, offsetY: 25, width: 55, height: 25,
    activeFrames: 7, damage: 0, knockback: 180
};
