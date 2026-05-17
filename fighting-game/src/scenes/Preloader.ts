import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

const HEAD_SIZE = 28;  // 头像直径

export class Preloader extends Phaser.Scene {
    private maleHeadKey = 'male_head_img';
    private femaleHeadKey = 'female_head_img';

    constructor() {
        super('Preloader');
    }

    preload(): void {
        // 加载进度条
        const barWidth = 400;
        const barHeight = 30;
        const barX = (GAME_WIDTH - barWidth) / 2;
        const barY = GAME_HEIGHT / 2;

        const bgBar = this.add.graphics();
        bgBar.fillStyle(0x333333, 1);
        bgBar.fillRoundedRect(barX, barY, barWidth, barHeight, 5);

        const progressBar = this.add.graphics();

        const loadingText = this.add.text(GAME_WIDTH / 2, barY - 30, '加载中...', {
            fontSize: '20px', color: '#ffffff', fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xff4444, 1);
            progressBar.fillRoundedRect(barX + 2, barY + 2, (barWidth - 4) * value, barHeight - 4, 3);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            bgBar.destroy();
            loadingText.destroy();
        });

        // 加载头像图片
        this.load.image(this.maleHeadKey, 'assets/male_head.png');
        this.load.image(this.femaleHeadKey, 'assets/female_head.png');

        // 生成非角色的纹理（背景、特效、UI）
        this.createBackgroundTexture();
        this.createEffectTextures();
        this.createUITextures();
    }

    create(): void {
        // 图片加载完成后，用 Canvas API 合成角色纹理
        this.createMaleFighterTextures();
        this.createFemaleFighterTextures();

        this.scene.start('MainMenu');
    }

    // ========== 合成纹理（Canvas 2D clip 裁切头像） ==========
    private createCompositeTexture(
        key: string, width: number, height: number,
        headKey: string, headX: number, headY: number,
        drawBody: (gfx: Phaser.GameObjects.Graphics) => void
    ): void {
        // 1. 用 Graphics 生成身体纹理
        const gfx = this.add.graphics();
        drawBody(gfx);
        gfx.generateTexture(key + '_body_temp', width, height);
        gfx.destroy();

        // 2. 获取身体和头像的图像数据
        const bodyTex = this.textures.get(key + '_body_temp');
        const bodyImg = bodyTex.getSourceImage() as HTMLImageElement;
        const headTex = this.textures.get(headKey);
        const headImg = headTex.getSourceImage() as HTMLImageElement;

        // 3. 用原生 Canvas 合成
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        // 画身体
        ctx.drawImage(bodyImg, 0, 0);

        // 画头像（圆形 clip）
        const size = HEAD_SIZE;
        const cx = headX;
        const cy = headY + size / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const scale = size / Math.max(headImg.width, headImg.height);
        const drawW = headImg.width * scale;
        const drawH = headImg.height * scale;
        ctx.drawImage(headImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        ctx.restore();

        // 4. 注册为 Phaser 纹理
        this.textures.addCanvas(key, canvas);

        // 清理临时纹理
        this.textures.remove(key + '_body_temp');
    }

    // ========== 男生角色纹理 ==========
    private createMaleFighterTextures(): void {
        const w = 64, h = 80;
        const hk = this.maleHeadKey;

        this.createCompositeTexture('male_idle', w, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 25, 28, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 50, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(20, 55, 11, 20);
            gfx.fillRect(33, 55, 11, 20);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(18, 73, 14, 6);
            gfx.fillRect(32, 73, 14, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(8, 28, 10, 8);
            gfx.fillRect(46, 28, 10, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(13, 36, 5);
            gfx.fillCircle(51, 36, 5);
        });

        this.createCompositeTexture('male_punch', 80, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 25, 28, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 50, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(20, 55, 11, 20);
            gfx.fillRect(33, 55, 11, 20);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(18, 73, 14, 6);
            gfx.fillRect(32, 73, 14, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(8, 28, 10, 8);
            gfx.fillRect(46, 26, 24, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(13, 36, 5);
            gfx.fillCircle(72, 30, 6);
            gfx.fillStyle(0xffff00, 0.6);
            gfx.fillRect(66, 24, 4, 12);
        });

        this.createCompositeTexture('male_kick', 80, h, hk, 28, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(14, 25, 28, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(14, 50, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(16, 55, 11, 20);
            gfx.fillRect(40, 58, 30, 10);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(14, 73, 14, 6);
            gfx.fillRect(68, 56, 12, 8);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(4, 28, 10, 8);
            gfx.fillRect(42, 28, 10, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(9, 36, 5);
            gfx.fillCircle(47, 36, 5);
        });

        this.createCompositeTexture('male_crouch_kick', 80, 64, hk, 30, -6, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(16, 15, 28, 25, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(16, 36, 28, 3);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(8, 38, 16, 14);
            gfx.fillRect(34, 38, 12, 14);
            gfx.fillRect(44, 48, 30, 8);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(72, 46, 10, 7);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(6, 18, 10, 7);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(11, 25, 4);
        });

        this.createCompositeTexture('male_special', 96, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 25, 28, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 50, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(12, 55, 14, 20);
            gfx.fillRect(38, 55, 14, 20);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(10, 73, 16, 6);
            gfx.fillRect(36, 73, 16, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(46, 24, 20, 8);
            gfx.fillRect(46, 40, 20, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(66, 28, 5);
            gfx.fillCircle(66, 44, 5);
            gfx.fillStyle(0x00bfff, 0.8);
            gfx.fillCircle(82, 36, 14);
            gfx.fillStyle(0xffffff, 0.6);
            gfx.fillCircle(82, 36, 8);
        });

        this.createCompositeTexture('male_jump', w, h, hk, 32, -4, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 20, 28, 30, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 46, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(18, 50, 12, 14);
            gfx.fillRect(34, 50, 12, 14);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(16, 62, 14, 6);
            gfx.fillRect(34, 62, 14, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(4, 22, 14, 8);
            gfx.fillRect(46, 22, 14, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(8, 30, 5);
            gfx.fillCircle(56, 30, 5);
        });

        this.createCompositeTexture('male_hurt', w, h, hk, 28, 4, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(14, 28, 28, 30, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(14, 54, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(16, 58, 11, 16);
            gfx.fillRect(29, 58, 11, 16);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(14, 72, 14, 6);
            gfx.fillRect(28, 72, 14, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(4, 30, 10, 8);
            gfx.fillRect(42, 32, 10, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(7, 38, 5);
            gfx.fillCircle(47, 40, 5);
        });

        this.createCompositeTexture('male_block', w, h, hk, 34, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(20, 25, 26, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(20, 50, 26, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(22, 55, 10, 20);
            gfx.fillRect(34, 55, 10, 20);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(20, 73, 12, 6);
            gfx.fillRect(32, 73, 12, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(26, 14, 16, 6);
            gfx.fillRect(28, 20, 14, 6);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(28, 17, 4);
            gfx.fillCircle(42, 23, 4);
        });

        this.createCompositeTexture('male_crouch', 64, 60, hk, 32, -4, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 12, 28, 22, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 30, 28, 3);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(14, 33, 16, 14);
            gfx.fillRect(34, 33, 16, 14);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(12, 45, 18, 6);
            gfx.fillRect(32, 45, 18, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(8, 14, 10, 7);
            gfx.fillRect(46, 14, 10, 7);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(12, 21, 4);
            gfx.fillCircle(51, 21, 4);
        });

        this.createCompositeTexture('male_win', w, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 25, 28, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 50, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(20, 55, 11, 20);
            gfx.fillRect(33, 55, 11, 20);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(18, 73, 14, 6);
            gfx.fillRect(32, 73, 14, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(10, 6, 8, 22);
            gfx.fillRect(46, 10, 8, 18);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(14, 4, 5);
            gfx.fillCircle(50, 8, 5);
        });

        this.createCompositeTexture('male_walk', w, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0x2563eb);
            gfx.fillRoundedRect(18, 25, 28, 32, 3);
            gfx.fillStyle(0x000000);
            gfx.fillRect(18, 50, 28, 4);
            gfx.fillStyle(0x1e3a5f);
            gfx.fillRect(16, 55, 11, 16);
            gfx.fillRect(37, 55, 11, 10);
            gfx.fillRect(33, 65, 11, 10);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(14, 69, 14, 6);
            gfx.fillRect(31, 73, 14, 6);
            gfx.fillStyle(0x2563eb);
            gfx.fillRect(8, 28, 10, 8);
            gfx.fillRect(46, 28, 10, 8);
            gfx.fillStyle(0xf5d0a9);
            gfx.fillCircle(13, 36, 5);
            gfx.fillCircle(51, 36, 5);
        });
    }

    // ========== 女生角色纹理 ==========
    private createFemaleFighterTextures(): void {
        const w = 64, h = 80;
        const hk = this.femaleHeadKey;

        this.createCompositeTexture('female_idle', w, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 25, 28, 30, 3);
            gfx.fillTriangle(18, 55, 46, 55, 32, 65);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 48, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(22, 62, 8, 12);
            gfx.fillRect(34, 62, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(20, 72, 12, 7);
            gfx.fillRect(32, 72, 12, 7);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(8, 28, 10, 7);
            gfx.fillRect(46, 28, 10, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(13, 35, 4);
            gfx.fillCircle(51, 35, 4);
        });

        this.createCompositeTexture('female_punch', 80, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 25, 28, 30, 3);
            gfx.fillTriangle(18, 55, 46, 55, 32, 65);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 48, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(22, 62, 8, 12);
            gfx.fillRect(34, 62, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(20, 72, 12, 7);
            gfx.fillRect(32, 72, 7);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(8, 28, 10, 7);
            gfx.fillRect(46, 26, 22, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(13, 35, 4);
            gfx.fillCircle(70, 30, 5);
            gfx.fillStyle(0xff69b4, 0.6);
            gfx.fillRect(64, 24, 4, 12);
        });

        this.createCompositeTexture('female_kick', 80, h, hk, 28, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(14, 25, 28, 28, 3);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(14, 48, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(16, 52, 8, 20);
            gfx.fillRect(40, 55, 28, 8);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(14, 70, 12, 7);
            gfx.fillRect(66, 53, 12, 8);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(4, 28, 10, 7);
            gfx.fillRect(42, 28, 10, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(9, 35, 4);
            gfx.fillCircle(47, 35, 4);
        });

        this.createCompositeTexture('female_crouch_kick', 80, 64, hk, 30, -4, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(16, 12, 28, 22, 3);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(16, 32, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(10, 35, 12, 12);
            gfx.fillRect(32, 35, 10, 10);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(42, 46, 30, 7);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(70, 44, 10, 7);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(6, 14, 10, 6);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(10, 20, 4);
        });

        this.createCompositeTexture('female_special', 96, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 25, 28, 30, 3);
            gfx.fillTriangle(18, 55, 46, 55, 32, 65);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 48, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(22, 62, 8, 12);
            gfx.fillRect(34, 62, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(20, 72, 12, 7);
            gfx.fillRect(32, 72, 12, 7);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(46, 22, 18, 7);
            gfx.fillRect(46, 38, 18, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(66, 26, 5);
            gfx.fillCircle(66, 42, 5);
            gfx.fillStyle(0xff4500, 0.9);
            gfx.fillCircle(80, 34, 14);
            gfx.fillStyle(0xffd700, 0.7);
            gfx.fillCircle(80, 34, 9);
            gfx.fillStyle(0xffffff, 0.5);
            gfx.fillCircle(80, 34, 5);
        });

        this.createCompositeTexture('female_jump', w, h, hk, 32, -6, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 18, 28, 28, 3);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 42, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(20, 48, 8, 12);
            gfx.fillRect(36, 48, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(18, 58, 12, 6);
            gfx.fillRect(34, 58, 12, 6);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(4, 20, 14, 7);
            gfx.fillRect(46, 20, 14, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(7, 27, 4);
            gfx.fillCircle(56, 27, 4);
        });

        this.createCompositeTexture('female_hurt', w, h, hk, 28, 4, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(14, 28, 28, 28, 3);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(14, 52, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(18, 58, 8, 14);
            gfx.fillRect(30, 58, 8, 14);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(16, 70, 12, 6);
            gfx.fillRect(28, 70, 12, 6);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(4, 30, 10, 7);
            gfx.fillRect(42, 32, 10, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(7, 37, 4);
            gfx.fillCircle(47, 39, 4);
        });

        this.createCompositeTexture('female_block', w, h, hk, 34, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(20, 25, 26, 30, 3);
            gfx.fillTriangle(20, 55, 46, 55, 33, 63);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(20, 48, 26, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(24, 62, 8, 12);
            gfx.fillRect(36, 62, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(22, 72, 12, 6);
            gfx.fillRect(34, 72, 12, 6);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(26, 14, 16, 5);
            gfx.fillRect(28, 19, 14, 5);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(28, 16, 4);
            gfx.fillCircle(42, 22, 4);
        });

        this.createCompositeTexture('female_crouch', 64, 60, hk, 32, -2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 10, 28, 22, 3);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 28, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(14, 31, 14, 12);
            gfx.fillRect(34, 31, 14, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(12, 41, 16, 6);
            gfx.fillRect(32, 41, 16, 6);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(8, 12, 10, 6);
            gfx.fillRect(46, 12, 10, 6);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(12, 18, 4);
            gfx.fillCircle(51, 18, 4);
        });

        this.createCompositeTexture('female_win', w, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 25, 28, 30, 3);
            gfx.fillTriangle(18, 55, 46, 55, 32, 65);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 48, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(22, 62, 8, 12);
            gfx.fillRect(34, 62, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(20, 72, 12, 7);
            gfx.fillRect(32, 72, 12, 7);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(10, 6, 8, 20);
            gfx.fillRect(46, 10, 8, 16);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(14, 4, 4);
            gfx.fillCircle(50, 8, 4);
        });

        this.createCompositeTexture('female_walk', w, h, hk, 32, 2, (gfx) => {
            gfx.fillStyle(0xe11d48);
            gfx.fillRoundedRect(18, 25, 28, 30, 3);
            gfx.fillTriangle(18, 55, 46, 55, 32, 63);
            gfx.fillStyle(0xffd700);
            gfx.fillRect(18, 48, 28, 3);
            gfx.fillStyle(0xfde8d0);
            gfx.fillRect(20, 60, 8, 12);
            gfx.fillRect(36, 60, 8, 12);
            gfx.fillStyle(0x8b0000);
            gfx.fillRect(18, 70, 12, 7);
            gfx.fillRect(34, 70, 12, 7);
            gfx.fillStyle(0xe11d48);
            gfx.fillRect(8, 28, 10, 7);
            gfx.fillRect(46, 28, 10, 7);
            gfx.fillStyle(0xfde8d0);
            gfx.fillCircle(13, 35, 4);
            gfx.fillCircle(51, 35, 4);
        });
    }

    // ========== 背景纹理 ==========
    private createBackgroundTexture(): void {
        this.createTexture('bg_arena', 960, 540, (gfx) => {
            for (let y = 0; y < 300; y++) {
                const r = Math.floor(20 + (y / 300) * 30);
                const g = Math.floor(10 + (y / 300) * 20);
                const b = Math.floor(60 + (y / 300) * 40);
                gfx.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
                gfx.fillRect(0, y, 960, 1);
            }
            gfx.fillStyle(0x2d1b4e);
            gfx.fillTriangle(0, 300, 160, 180, 320, 300);
            gfx.fillTriangle(200, 300, 400, 150, 600, 300);
            gfx.fillTriangle(500, 300, 720, 170, 960, 300);
            gfx.fillStyle(0xffeedd);
            gfx.fillCircle(800, 80, 35);
            gfx.fillStyle(0x2d1b4e);
            gfx.fillCircle(812, 72, 30);
            gfx.fillStyle(0x1a0e33);
            gfx.fillRect(50, 230, 60, 70);
            gfx.fillRect(130, 250, 40, 50);
            gfx.fillRect(700, 240, 50, 60);
            gfx.fillRect(780, 220, 70, 80);
            gfx.fillRect(870, 250, 50, 50);
            gfx.fillStyle(0xffcc44, 0.7);
            gfx.fillRect(60, 245, 8, 8);
            gfx.fillRect(80, 260, 8, 8);
            gfx.fillRect(95, 245, 8, 8);
            gfx.fillRect(790, 235, 8, 8);
            gfx.fillRect(820, 255, 8, 8);
            gfx.fillStyle(0x3d2b1f);
            gfx.fillRect(0, 300, 960, 240);
            gfx.fillStyle(0x4a3728);
            for (let x = 0; x < 960; x += 48) {
                gfx.fillRect(x, 300, 24, 240);
            }
            gfx.fillStyle(0x5c4033);
            gfx.fillRect(60, 420, 840, 8);
            gfx.fillRect(60, 440, 840, 4);
            gfx.fillStyle(0xffcc00, 0.4);
            gfx.fillRect(60, 428, 840, 2);
            gfx.fillStyle(0xffcc00, 0.2);
            gfx.fillRect(478, 410, 4, 30);
            gfx.fillStyle(0xff2200);
            gfx.fillCircle(200, 310, 12);
            gfx.fillCircle(760, 310, 12);
            gfx.fillStyle(0xffcc00, 0.6);
            gfx.fillCircle(200, 310, 6);
            gfx.fillCircle(760, 310, 6);
            gfx.fillStyle(0x8b4513);
            gfx.fillRect(198, 296, 4, 14);
            gfx.fillRect(758, 296, 4, 14);
            gfx.fillStyle(0xffffff, 0.8);
            gfx.fillCircle(100, 50, 2);
            gfx.fillCircle(250, 30, 1.5);
            gfx.fillCircle(400, 60, 2);
            gfx.fillCircle(550, 40, 1.5);
            gfx.fillCircle(650, 70, 2);
            gfx.fillCircle(150, 100, 1.5);
            gfx.fillCircle(350, 90, 1.5);
            gfx.fillCircle(900, 50, 2);
        });
    }

    // ========== 特效纹理 ==========
    private createEffectTextures(): void {
        this.createTexture('hit_spark', 48, 48, (gfx) => {
            gfx.fillStyle(0xffffff);
            gfx.fillCircle(24, 24, 6);
            gfx.fillStyle(0xffff00, 0.8);
            gfx.fillCircle(24, 24, 12);
            gfx.fillStyle(0xff6600, 0.5);
            gfx.fillCircle(24, 24, 18);
            gfx.fillStyle(0xff0000, 0.3);
            gfx.fillCircle(24, 24, 24);
        });

        this.createTexture('block_flash', 40, 40, (gfx) => {
            gfx.fillStyle(0x4488ff, 0.3);
            gfx.fillCircle(20, 20, 20);
            gfx.fillStyle(0x88bbff, 0.5);
            gfx.fillCircle(20, 20, 12);
            gfx.fillStyle(0xccddff, 0.8);
            gfx.fillCircle(20, 20, 5);
        });

        this.createTexture('energy_wave', 64, 32, (gfx) => {
            gfx.fillStyle(0x00bfff, 0.4);
            gfx.fillCircle(48, 16, 16);
            gfx.fillStyle(0x00bfff, 0.6);
            gfx.fillCircle(48, 16, 10);
            gfx.fillStyle(0xffffff, 0.8);
            gfx.fillCircle(48, 16, 4);
            gfx.fillStyle(0x00bfff, 0.3);
            gfx.fillRect(0, 12, 40, 8);
            gfx.fillStyle(0x00bfff, 0.5);
            gfx.fillRect(10, 14, 30, 4);
        });

        this.createTexture('phoenix_flame', 64, 32, (gfx) => {
            gfx.fillStyle(0xff4500, 0.4);
            gfx.fillCircle(48, 16, 16);
            gfx.fillStyle(0xff6600, 0.6);
            gfx.fillCircle(48, 16, 10);
            gfx.fillStyle(0xffd700, 0.8);
            gfx.fillCircle(48, 16, 4);
            gfx.fillStyle(0xff4500, 0.3);
            gfx.fillRect(0, 10, 40, 12);
            gfx.fillStyle(0xff6600, 0.5);
            gfx.fillRect(10, 13, 30, 6);
        });
    }

    // ========== UI 纹理 ==========
    private createUITextures(): void {
        this.createTexture('hp_bar_bg', 350, 30, (gfx) => {
            gfx.fillStyle(0x333333);
            gfx.fillRoundedRect(0, 0, 350, 30, 4);
            gfx.fillStyle(0x1a1a1a);
            gfx.fillRoundedRect(2, 2, 346, 26, 3);
        });

        this.createTexture('hp_bar_blue', 346, 26, (gfx) => {
            gfx.fillStyle(0x22c55e);
            gfx.fillRoundedRect(0, 0, 346, 26, 3);
            for (let y = 0; y < 13; y++) {
                gfx.fillStyle(0xffffff, 0.1 - y * 0.007);
                gfx.fillRect(0, y, 346, 1);
            }
        });

        this.createTexture('hp_bar_red', 346, 26, (gfx) => {
            gfx.fillStyle(0xef4444);
            gfx.fillRoundedRect(0, 0, 346, 26, 3);
            for (let y = 0; y < 13; y++) {
                gfx.fillStyle(0xffffff, 0.1 - y * 0.007);
                gfx.fillRect(0, y, 346, 1);
            }
        });

        this.createTexture('hp_bar_low', 346, 26, (gfx) => {
            gfx.fillStyle(0xfbbf24);
            gfx.fillRoundedRect(0, 0, 346, 26, 3);
            for (let y = 0; y < 13; y++) {
                gfx.fillStyle(0xffffff, 0.1 - y * 0.007);
                gfx.fillRect(0, y, 346, 1);
            }
        });

        this.createTexture('sp_bar_bg', 350, 12, (gfx) => {
            gfx.fillStyle(0x333333);
            gfx.fillRoundedRect(0, 0, 350, 12, 3);
            gfx.fillStyle(0x1a1a1a);
            gfx.fillRoundedRect(1, 1, 348, 10, 2);
        });

        this.createTexture('sp_bar_blue', 348, 10, (gfx) => {
            gfx.fillStyle(0x3b82f6);
            gfx.fillRoundedRect(0, 0, 348, 10, 2);
        });

        this.createTexture('sp_bar_red', 348, 10, (gfx) => {
            gfx.fillStyle(0xf43f5e);
            gfx.fillRoundedRect(0, 0, 348, 10, 2);
        });

        this.createTexture('timer_bg', 70, 50, (gfx) => {
            gfx.fillStyle(0x1a1a1a);
            gfx.fillRoundedRect(0, 0, 70, 50, 6);
            gfx.fillStyle(0x333333, 0.8);
            gfx.fillRoundedRect(2, 2, 66, 46, 5);
        });

        this.createTexture('vs_icon', 60, 40, (gfx) => {
            gfx.fillStyle(0xff4444);
            gfx.fillRect(12, 5, 8, 30);
            gfx.fillRect(28, 5, 8, 30);
            gfx.fillTriangle(8, 5, 40, 5, 24, 18);
            gfx.fillTriangle(8, 35, 40, 35, 24, 22);
        });
    }

    private createTexture(key: string, width: number, height: number, draw: (gfx: Phaser.GameObjects.Graphics) => void): void {
        const gfx = this.add.graphics();
        draw(gfx);
        gfx.generateTexture(key, width, height);
        gfx.destroy();
    }
}
