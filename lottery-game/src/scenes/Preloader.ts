import Phaser from 'phaser';
import { PRIZES, WHEEL_RADIUS } from '../constants';

export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload(): void {
        // 显示加载进度
        const barBg = this.add.graphics();
        barBg.fillStyle(0x333366, 0.8);
        barBg.fillRect(250, 280, 300, 40);

        const bar = this.add.graphics();
        this.load.on('progress', (value: number) => {
            bar.clear();
            bar.fillStyle(0xFFD700, 1);
            bar.fillRect(255, 285, 290 * value, 30);
        });

        const loadingText = this.add.text(400, 260, '🎰 加载中...', {
            fontSize: '20px',
            color: '#FFD700',
            fontFamily: 'Arial',
        }).setOrigin(0.5);
    }

    create(): void {
        this.generateWheelTexture();
        this.generatePointerTexture();
        this.generateButtonTexture();
        this.generateParticleTexture();

        this.scene.start('MainScene');
    }

    private generateWheelTexture(): void {
        const size = WHEEL_RADIUS * 2 + 40;
        const center = size / 2;
        const sliceAngle = (2 * Math.PI) / PRIZES.length;

        // 创建 Canvas 纹理
        const canvas = this.textures.createCanvas('wheel', size, size);
        const ctx = canvas.getContext();

        // 画外圈装饰
        ctx.beginPath();
        ctx.arc(center, center, WHEEL_RADIUS + 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#8B4513';
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 画灯泡装饰
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * 2 * Math.PI;
            const bx = center + (WHEEL_RADIUS + 12) * Math.cos(angle);
            const by = center + (WHEEL_RADIUS + 12) * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(bx, by, 5, 0, 2 * Math.PI);
            ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FF6347';
            ctx.fill();
        }

        // 画每个扇区
        PRIZES.forEach((prize, i) => {
            const startAngle = i * sliceAngle - Math.PI / 2;
            const endAngle = startAngle + sliceAngle;

            // 扇区
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, WHEEL_RADIUS, startAngle, endAngle);
            ctx.closePath();

            // 渐变填充
            const gradient = ctx.createRadialGradient(center, center, 20, center, center, WHEEL_RADIUS);
            const baseColor = this.numberToHex(prize.color);
            gradient.addColorStop(0, this.lightenColor(baseColor, 40));
            gradient.addColorStop(1, baseColor);
            ctx.fillStyle = gradient;
            ctx.fill();

            // 扇区边线
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 画奖品图标和名称（保持水平，不旋转）
            const midAngle = startAngle + sliceAngle / 2;
            const textRadius = WHEEL_RADIUS * 0.55;
            const tx = center + textRadius * Math.cos(midAngle);
            const ty = center + textRadius * Math.sin(midAngle);

            ctx.save();
            ctx.translate(tx, ty);

            // 图标
            ctx.font = '28px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(prize.icon, 0, -16);

            // 名称（加大、去描边、加阴影）
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(prize.name, 0, 16);
            ctx.shadowColor = 'transparent';

            ctx.restore();
        });

        // 中心圆
        const centerGrad = ctx.createRadialGradient(center, center, 5, center, center, 35);
        centerGrad.addColorStop(0, '#FFD700');
        centerGrad.addColorStop(1, '#B8860B');
        ctx.beginPath();
        ctx.arc(center, center, 35, 0, 2 * Math.PI);
        ctx.fillStyle = centerGrad;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 中心文字
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GO!', center, center);

        canvas.refresh();
    }

    private generatePointerTexture(): void {
        const canvas = this.textures.createCanvas('pointer', 50, 50);
        const ctx = canvas.getContext();

        // 三角形指针
        ctx.beginPath();
        ctx.moveTo(25, 45);
        ctx.lineTo(10, 5);
        ctx.lineTo(25, 15);
        ctx.lineTo(40, 5);
        ctx.closePath();

        ctx.fillStyle = '#FF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 小圆点
        ctx.beginPath();
        ctx.arc(25, 10, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        canvas.refresh();
    }

    private generateButtonTexture(): void {
        // 正常状态 — 纯背景，文字由 Phaser Text 对象渲染
        const canvas1 = this.textures.createCanvas('btn_spin', 200, 60);
        const ctx1 = canvas1.getContext();
        this.drawButton(ctx1, 200, 60, '#E74C3C', '#C0392B');
        canvas1.refresh();

        // 悬停状态
        const canvas2 = this.textures.createCanvas('btn_spin_hover', 200, 60);
        const ctx2 = canvas2.getContext();
        this.drawButton(ctx2, 200, 60, '#FF5555', '#E74C3C');
        canvas2.refresh();

        // 禁用状态
        const canvas3 = this.textures.createCanvas('btn_spin_disabled', 200, 60);
        const ctx3 = canvas3.getContext();
        this.drawButton(ctx3, 200, 60, '#7F8C8D', '#6C7A7A');
        canvas3.refresh();
    }

    private drawButton(ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string): void {
        const r = 15;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    private generateParticleTexture(): void {
        const canvas = this.textures.createCanvas('particle', 16, 16);
        const ctx = canvas.getContext();

        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);

        canvas.refresh();
    }

    private numberToHex(n: number): string {
        return '#' + n.toString(16).padStart(6, '0');
    }

    private lightenColor(hex: string, percent: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + percent);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
        const b = Math.min(255, (num & 0x0000FF) + percent);
        return `rgb(${r},${g},${b})`;
    }
}
