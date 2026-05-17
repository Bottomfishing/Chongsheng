import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, MALE_FIGHTER, FEMALE_FIGHTER } from '../constants';

export class GameOver extends Phaser.Scene {
    private winnerIndex: number = 0;
    private p1Wins: number = 0;
    private p2Wins: number = 0;

    constructor() {
        super('GameOver');
    }

    create(data: { winner: number; p1Wins: number; p2Wins: number }): void {
        this.winnerIndex = data.winner;
        this.p1Wins = data.p1Wins;
        this.p2Wins = data.p2Wins;

        // 背景
        const bg = this.add.graphics();
        bg.fillStyle(0x0a0a1a);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // 装饰
        bg.fillStyle(0xff4444, 0.05);
        bg.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 300);

        // 胜利者名称
        const winnerName = this.winnerIndex === 1 ? MALE_FIGHTER.name : FEMALE_FIGHTER.name;
        const winnerColor = this.winnerIndex === 1 ? '#3b82f6' : '#f43f5e';

        const titleText = this.add.text(GAME_WIDTH / 2, 100, 'GAME OVER', {
            fontSize: '56px',
            fontFamily: 'Arial',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 10, fill: true }
        }).setOrigin(0.5);

        const winnerText = this.add.text(GAME_WIDTH / 2, 180, `${winnerName} 获胜！`, {
            fontSize: '40px',
            fontFamily: 'Arial',
            color: winnerColor,
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 胜利者展示
        const winnerKey = this.winnerIndex === 1 ? 'male_win' : 'female_win';
        const winnerSprite = this.add.image(GAME_WIDTH / 2, 340, winnerKey).setScale(5);

        // 比分
        const scoreText = this.add.text(GAME_WIDTH / 2, 420, `${MALE_FIGHTER.name}  ${this.p1Wins} : ${this.p2Wins}  ${FEMALE_FIGHTER.name}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // 重玩按钮
        const restartText = this.add.text(GAME_WIDTH / 2, 490, '按 ENTER 重新开始', {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // 返回菜单
        const menuText = this.add.text(GAME_WIDTH / 2, 520, '按 ESC 返回菜单', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#aaaaaa',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // 动画
        this.tweens.add({
            targets: titleText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: winnerSprite,
            y: 330,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: restartText,
            alpha: 0.4,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // 输入
        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('FightScene');
            });
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('MainMenu');
            });
        });

        // 粒子效果（简单的星星）
        for (let i = 0; i < 20; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, GAME_WIDTH),
                Phaser.Math.Between(0, GAME_HEIGHT),
                Phaser.Math.Between(1, 3),
                0xffd700,
                Math.random() * 0.5
            );

            this.tweens.add({
                targets: star,
                y: star.y - 30,
                alpha: 0,
                duration: Phaser.Math.Between(1500, 3000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
                onRepeat: (tween, target) => {
                    (target as Phaser.GameObjects.Arc).setY(Phaser.Math.Between(GAME_HEIGHT / 2, GAME_HEIGHT));
                    (target as Phaser.GameObjects.Arc).setAlpha(Math.random() * 0.5);
                }
            });
        }

        // 淡入
        this.cameras.main.fadeIn(500);
    }
}
