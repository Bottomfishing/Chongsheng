import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload(): void {
        const barBg = this.add.graphics();
        barBg.fillStyle(0x553322, 0.8);
        barBg.fillRect(250, 280, 300, 40);

        const bar = this.add.graphics();
        this.load.on('progress', (value: number) => {
            bar.clear();
            bar.fillStyle(0xFFD700, 1);
            bar.fillRect(255, 285, 290 * value, 30);
        });

        this.add.text(400, 260, '🥞 准备食材中...', {
            fontSize: '20px', color: '#FFD700', fontFamily: 'Arial',
        }).setOrigin(0.5);
    }

    create(): void {
        this.generateGriddleTexture();
        this.generatePancakeTextures();
        this.generateSpatulaTexture();
        this.generateToppingTextures();
        this.generateParticleTexture();

        this.scene.start('MainScene');
    }

    private generateGriddleTexture(): void {
        // 铁板 300x300
        const canvas = this.textures.createCanvas('griddle', 300, 300);
        const ctx = canvas.getContext();

        // 外框
        ctx.beginPath();
        ctx.arc(150, 150, 148, 0, Math.PI * 2);
        ctx.fillStyle = '#3a3a3a';
        ctx.fill();

        // 内部铁板面
        const grad = ctx.createRadialGradient(150, 150, 20, 150, 150, 140);
        grad.addColorStop(0, '#4a4a4a');
        grad.addColorStop(0.7, '#3d3d3d');
        grad.addColorStop(1, '#2a2a2a');
        ctx.beginPath();
        ctx.arc(150, 150, 140, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // 高光
        ctx.beginPath();
        ctx.arc(120, 110, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fill();

        // 边缘
        ctx.beginPath();
        ctx.arc(150, 150, 148, 0, Math.PI * 2);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3;
        ctx.stroke();

        canvas.refresh();
    }

    private generatePancakeTextures(): void {
        const sizes = [
            { key: 'batter',     size: 20,  color: '#F5E6C8', label: '' },     // 面糊刚倒
            { key: 'pancake_s1', size: 60,  color: '#F5E6C8', label: '' },     // 小
            { key: 'pancake_s2', size: 90,  color: '#F0DEB4', label: '' },     // 中
            { key: 'pancake_s3', size: 120, color: '#EBD8A0', label: '' },     // 大（满）
            { key: 'pancake_s4', size: 120, color: '#E0C880', label: '' },     // 微黄
            { key: 'pancake_s5', size: 120, color: '#D4A840', label: '' },     // 金黄（完美）
            { key: 'pancake_s6', size: 120, color: '#B07828', label: '' },     // 过火
            { key: 'pancake_s7', size: 120, color: '#6B3A10', label: '' },     // 焦了
            // 翻面后（底面颜色更深）
            { key: 'pancake_f5', size: 120, color: '#C89A30', label: '' },     // 翻面金黄
            { key: 'pancake_f6', size: 120, color: '#A06820', label: '' },     // 翻面过火
            { key: 'pancake_f7', size: 120, color: '#5A2A08', label: '' },     // 翻面焦了
        ];

        sizes.forEach(s => {
            const canvas = this.textures.createCanvas(s.key, s.size, s.size);
            const ctx = canvas.getContext();
            const r = s.size / 2;

            // 不规则边缘
            ctx.beginPath();
            const points = 36;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const wobble = 1 + (Math.sin(i * 7.3) * 0.03 + Math.cos(i * 3.7) * 0.02);
                const x = r + (r - 2) * wobble * Math.cos(angle);
                const y = r + (r - 2) * wobble * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            const grad = ctx.createRadialGradient(r * 0.85, r * 0.85, r * 0.1, r, r, r);
            grad.addColorStop(0, this.lighten(s.color, 15));
            grad.addColorStop(1, s.color);
            ctx.fillStyle = grad;
            ctx.fill();

            // 小气泡
            if (s.size >= 60) {
                ctx.fillStyle = 'rgba(0,0,0,0.05)';
                for (let b = 0; b < 8; b++) {
                    const bx = r + (Math.random() - 0.5) * r * 1.2;
                    const by = r + (Math.random() - 0.5) * r * 1.2;
                    const br = Math.random() * 4 + 2;
                    ctx.beginPath();
                    ctx.arc(bx, by, br, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            canvas.refresh();
        });
    }

    private generateSpatulaTexture(): void {
        const canvas = this.textures.createCanvas('spatula', 100, 180);
        const ctx = canvas.getContext();

        // 手柄
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(42, 80, 16, 100);
        ctx.strokeStyle = '#6B3A10';
        ctx.lineWidth = 1;
        ctx.strokeRect(42, 80, 16, 100);

        // 手柄末端
        ctx.beginPath();
        ctx.arc(50, 175, 10, 0, Math.PI);
        ctx.fillStyle = '#6B3A10';
        ctx.fill();

        // 铲面
        ctx.beginPath();
        ctx.ellipse(50, 45, 35, 40, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#888';
        ctx.fill();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 铲面高光
        ctx.beginPath();
        ctx.ellipse(42, 35, 12, 18, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();

        // 铲面缝
        ctx.strokeStyle = '#777';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(25, 30 + i * 10);
            ctx.lineTo(75, 30 + i * 10);
            ctx.stroke();
        }

        canvas.refresh();
    }

    private generateToppingTextures(): void {
        // 鸡蛋
        this.makeCircle('top_egg', 40, '#FFD700', '#FFF8DC');
        // 葱花
        this.makeIrregular('top_scallion', 8, '#66BB6A', 12);
        // 酱料
        this.makeSmear('top_sauce', '#8B4513');
        // 香菜
        this.makeIrregular('top_cilantro', 7, '#4CAF50', 10);
        // 生菜
        this.makeLeaf('top_lettuce', '#8BC34A');
    }

    private makeCircle(key: string, size: number, color: string, innerColor: string): void {
        const canvas = this.textures.createCanvas(key, size * 2, size * 2);
        const ctx = canvas.getContext();
        // 蛋清
        ctx.beginPath();
        ctx.ellipse(size, size, size * 0.9, size * 0.75, 0, 0, Math.PI * 2);
        ctx.fillStyle = innerColor;
        ctx.fill();
        // 蛋黄
        ctx.beginPath();
        ctx.arc(size, size, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        canvas.refresh();
    }

    private makeIrregular(key: string, size: number, color: string, count: number): void {
        const canvas = this.textures.createCanvas(key, size * 2, size * 2);
        const ctx = canvas.getContext();
        for (let i = 0; i < count; i++) {
            const x = size + (Math.random() - 0.5) * size;
            const y = size + (Math.random() - 0.5) * size;
            ctx.beginPath();
            ctx.ellipse(x, y, size * 0.25, size * 0.12, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.8;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        canvas.refresh();
    }

    private makeSmear(key: string, color: string): void {
        const canvas = this.textures.createCanvas(key, 160, 30);
        const ctx = canvas.getContext();
        ctx.beginPath();
        ctx.moveTo(10, 15);
        ctx.bezierCurveTo(40, 5, 60, 25, 80, 15);
        ctx.bezierCurveTo(100, 5, 120, 25, 150, 15);
        ctx.lineWidth = 12;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
        canvas.refresh();
    }

    private makeLeaf(key: string, color: string): void {
        const canvas = this.textures.createCanvas(key, 60, 40);
        const ctx = canvas.getContext();
        ctx.beginPath();
        ctx.ellipse(30, 20, 28, 16, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        // 叶脉
        ctx.beginPath();
        ctx.moveTo(8, 20);
        ctx.lineTo(52, 18);
        ctx.strokeStyle = '#6B9F3A';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
        canvas.refresh();
    }

    private generateParticleTexture(): void {
        const canvas = this.textures.createCanvas('steam', 20, 20);
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(10, 10, 0, 10, 10, 10);
        grad.addColorStop(0, 'rgba(255,255,255,0.6)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 20, 20);
        canvas.refresh();

        // 火花粒子
        const canvas2 = this.textures.createCanvas('spark', 10, 10);
        const ctx2 = canvas2.getContext();
        const grad2 = ctx2.createRadialGradient(5, 5, 0, 5, 5, 5);
        grad2.addColorStop(0, 'rgba(255,200,50,0.9)');
        grad2.addColorStop(1, 'rgba(255,100,0,0)');
        ctx2.fillStyle = grad2;
        ctx2.fillRect(0, 0, 10, 10);
        canvas2.refresh();
    }

    private lighten(hex: string, amount: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
        const b = Math.min(255, (num & 0xFF) + amount);
        return `rgb(${r},${g},${b})`;
    }
}
