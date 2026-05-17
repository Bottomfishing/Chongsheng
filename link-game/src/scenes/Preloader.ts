import Phaser from 'phaser';
import { FOODS } from '../constants';

export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload(): void {
        // 加载进度条
        const barBg = this.add.graphics();
        barBg.fillStyle(0x333366, 0.8);
        barBg.fillRect(250, 310, 400, 40);

        const bar = this.add.graphics();
        this.load.on('progress', (value: number) => {
            bar.clear();
            bar.fillStyle(0xFFD700, 1);
            bar.fillRect(255, 315, 390 * value, 30);
        });

        const loadingText = this.add.text(450, 290, '🍜 加载美食中...', {
            fontSize: '20px',
            color: '#FFD700',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // 加载5张美食图片
        FOODS.forEach(food => {
            this.load.image(food.key, `assets/${food.key}.jpg`);
        });
    }

    create(): void {
        // 为每张图片创建圆形裁切纹理
        FOODS.forEach(food => {
            this.createCircleTexture(food.key, food.key + '_circle', 32);
        });

        this.scene.start('MainScene');
    }

    private createCircleTexture(sourceKey: string, destKey: string, radius: number): void {
        const source = this.textures.get(sourceKey);
        const frame = source.get(0);
        const srcWidth = frame.width;
        const srcHeight = frame.height;

        const size = radius * 2;
        const canvas = this.textures.createCanvas(destKey, size, size);
        const ctx = canvas.getContext();

        // 圆形裁切
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // 等比缩放绘制图片
        const scale = Math.max(size / srcWidth, size / srcHeight);
        const drawW = srcWidth * scale;
        const drawH = srcHeight * scale;
        const dx = (size - drawW) / 2;
        const dy = (size - drawH) / 2;

        // 使用 drawImage 从源纹理获取像素
        const sourceCanvas = source.getSourceImage() as HTMLCanvasElement;
        ctx.drawImage(sourceCanvas, dx, dy, drawW, drawH);

        canvas.refresh();
    }
}
