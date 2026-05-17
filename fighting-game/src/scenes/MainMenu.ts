import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

export class MainMenu extends Phaser.Scene {
    private titleText!: Phaser.GameObjects.Text;
    private subtitleText!: Phaser.GameObjects.Text;
    private startBtn!: Phaser.GameObjects.Container;
    private controlsText!: Phaser.GameObjects.Text;
    private bgGraphics!: Phaser.GameObjects.Graphics;

    constructor() {
        super('MainMenu');
    }

    create(): void {
        // 背景动画
        this.bgGraphics = this.add.graphics();
        this.drawAnimatedBackground();

        // 标题
        this.titleText = this.add.text(GAME_WIDTH / 2, 100, '拳皇对战', {
            fontSize: '64px',
            fontFamily: 'Arial, sans-serif',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5);

        // 副标题
        this.subtitleText = this.add.text(GAME_WIDTH / 2, 165, '龙拳  VS  凤舞', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // 角色预览
        const malePreview = this.add.image(280, 320, 'male_idle').setScale(4);
        const femalePreview = this.add.image(680, 320, 'female_idle').setScale(4);

        // VS
        const vsText = this.add.text(GAME_WIDTH / 2, 310, 'VS', {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#ff4444',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 角色名字
        this.add.text(280, 400, '龙拳', {
            fontSize: '20px',
            color: '#3b82f6',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(680, 400, '凤舞', {
            fontSize: '20px',
            color: '#f43f5e',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // 开始按钮
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xff4444, 1);
        btnBg.fillRoundedRect(-120, -25, 240, 50, 10);
        btnBg.lineStyle(3, 0xffcc00, 1);
        btnBg.strokeRoundedRect(-120, -25, 240, 50, 10);

        const btnText = this.add.text(0, 0, '按 ENTER 开始', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.startBtn = this.add.container(GAME_WIDTH / 2, 470, [btnBg, btnText]);

        // 操作提示
        this.controlsText = this.add.text(GAME_WIDTH / 2, 510, 'P1: WASD移动 J拳 K踢 L必杀 U防御 | P2: 方向键移动 1拳 2踢 3必杀 4防御', {
            fontSize: '13px',
            fontFamily: 'Arial, sans-serif',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // 按钮闪烁
        this.tweens.add({
            targets: this.startBtn,
            alpha: 0.5,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 标题弹跳
        this.tweens.add({
            targets: this.titleText,
            y: 95,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 角色呼吸动画
        this.tweens.add({
            targets: malePreview,
            scaleX: 4.1,
            scaleY: 3.9,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: femalePreview,
            scaleX: 3.9,
            scaleY: 4.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // VS 闪烁
        this.tweens.add({
            targets: vsText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // 按键监听
        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('FightScene');
            });
        });
    }

    private drawAnimatedBackground(): void {
        const gfx = this.bgGraphics;
        // 深色背景
        gfx.fillStyle(0x0a0a1a);
        gfx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // 装饰线条
        gfx.lineStyle(2, 0xff4444, 0.3);
        for (let i = 0; i < 10; i++) {
            gfx.lineBetween(0, i * 60, GAME_WIDTH, i * 60);
        }

        // 中心光芒
        gfx.fillStyle(0xff4444, 0.05);
        gfx.fillCircle(GAME_WIDTH / 2, 200, 200);
        gfx.fillStyle(0xff4444, 0.03);
        gfx.fillCircle(GAME_WIDTH / 2, 200, 300);
    }
}
