import Phaser from 'phaser';
import {
    PRIZES,
    GAME_WIDTH,
    GAME_HEIGHT,
    WHEEL_RADIUS,
    WHEEL_CENTER_X,
    WHEEL_CENTER_Y,
    POINTER_X,
    POINTER_Y,
    MIN_SPIN_DURATION,
    MAX_SPIN_DURATION,
    MIN_ROTATIONS,
    MAX_ROTATIONS,
} from '../constants';

export class MainScene extends Phaser.Scene {
    private wheel!: Phaser.GameObjects.Image;
    private spinButton!: Phaser.GameObjects.Image;
    private buttonText!: Phaser.GameObjects.Text;
    private titleText!: Phaser.GameObjects.Text;
    private resultText!: Phaser.GameObjects.Text;
    private subtitleText!: Phaser.GameObjects.Text;
    private pointer!: Phaser.GameObjects.Image;
    private lightBulbs: Phaser.GameObjects.Arc[] = [];
    private sparkles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
    private isSpinning = false;
    private currentRotation = 0;
    private spinCount = 0;
    private hasWonBottle = false;
    private confettiEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // 背景星星
        this.createStarfield();

        // 标题
        this.titleText = this.add.text(GAME_WIDTH / 2, 30, '🎰 幸运转盘 🎰', {
            fontSize: '36px',
            color: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // 转盘阴影
        this.add.circle(WHEEL_CENTER_X + 5, WHEEL_CENTER_Y + 5, WHEEL_RADIUS + 20, 0x000000, 0.3);

        // 转盘
        this.wheel = this.add.image(WHEEL_CENTER_X, WHEEL_CENTER_Y, 'wheel');

        // 指针
        this.pointer = this.add.image(POINTER_X, POINTER_Y + 15, 'pointer');
        this.pointer.setDepth(10);

        // 指针弹跳动画
        this.tweens.add({
            targets: this.pointer,
            y: POINTER_Y + 10,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // 抽奖按钮
        this.spinButton = this.add.image(GAME_WIDTH / 2, 530, 'btn_spin');
        this.spinButton.setInteractive({ useHandCursor: true });
        this.spinButton.setDepth(5);

        this.buttonText = this.add.text(GAME_WIDTH / 2, 530, '🎰 抽奖！', {
            fontSize: '22px',
            color: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(6);

        // 按钮交互
        this.spinButton.on('pointerover', () => {
            if (!this.isSpinning) {
                this.spinButton.setTexture('btn_spin_hover');
                this.spinButton.setScale(1.05);
            }
        });

        this.spinButton.on('pointerout', () => {
            if (!this.isSpinning) {
                this.spinButton.setTexture('btn_spin');
                this.spinButton.setScale(1);
            }
        });

        this.spinButton.on('pointerdown', () => {
            if (!this.isSpinning) {
                this.startSpin();
            }
        });

        // 装饰灯泡
        this.createLightBulbs();

        // 结果文字（初始隐藏）
        this.resultText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
            fontSize: '48px',
            color: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
        }).setOrigin(0.5).setDepth(20).setAlpha(0);

        // 抽奖次数提示
        this.updateSpinCountDisplay();
    }

    private createStarfield(): void {
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, GAME_WIDTH);
            const y = Phaser.Math.Between(0, GAME_HEIGHT);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.3, 1);
            const star = this.add.circle(x, y, size, 0xFFFFFF, alpha);

            this.tweens.add({
                targets: star,
                alpha: Phaser.Math.FloatBetween(0.1, 0.5),
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
            });
        }
    }

    private createLightBulbs(): void {
        const numBulbs = 24;
        const radius = WHEEL_RADIUS + 25;
        for (let i = 0; i < numBulbs; i++) {
            const angle = (i / numBulbs) * Math.PI * 2 - Math.PI / 2;
            const x = WHEEL_CENTER_X + radius * Math.cos(angle);
            const y = WHEEL_CENTER_Y + radius * Math.sin(angle);
            const color = i % 2 === 0 ? 0xFFD700 : 0xFF6347;
            const bulb = this.add.circle(x, y, 4, color, 1);
            bulb.setDepth(8);

            // 闪烁
            this.tweens.add({
                targets: bulb,
                alpha: 0.3,
                duration: 500 + (i % 3) * 200,
                yoyo: true,
                repeat: -1,
                delay: i * 80,
            });

            this.lightBulbs.push(bulb);
        }
    }

    private startSpin(): void {
        this.isSpinning = true;
        this.spinCount++;
        this.spinButton.setTexture('btn_spin_disabled');
        this.spinButton.setScale(1);

        // 隐藏之前的结果
        this.tweens.killAll();
        this.resultText.setAlpha(0);
        this.clearConfetti();

        // 决定抽中哪个奖品
        const prizeIndex = this.weightedRandom();

        // 计算目标角度：让指针指向目标扇区中心
        const sliceAngle = 360 / PRIZES.length;
        const targetSliceCenter = prizeIndex * sliceAngle + sliceAngle / 2;

        // 指针在顶部（12点位置），转盘需要旋转使目标扇区对准顶部
        // 加一些随机偏移让结果不总是正中间
        const randomOffset = Phaser.Math.FloatBetween(-sliceAngle * 0.3, sliceAngle * 0.3);
        const targetAngle = 360 - targetSliceCenter + randomOffset;

        const totalRotations = Phaser.Math.Between(MIN_ROTATIONS, MAX_ROTATIONS);
        const totalAngle = 360 * totalRotations + targetAngle;

        const duration = Phaser.Math.Between(MIN_SPIN_DURATION, MAX_SPIN_DURATION);

        // 旋转动画
        this.tweens.add({
            targets: this,
            currentRotation: totalAngle,
            duration: duration,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                this.wheel.setRotation(Phaser.Math.DegToRad(this.currentRotation));
            },
            onComplete: () => {
                this.onSpinComplete(prizeIndex);
            },
        });

        // 指针弹跳效果（经过扇区边界时）
        this.time.delayedCall(duration * 0.3, () => {
            this.tweens.add({
                targets: this.pointer,
                angle: { from: -5, to: 5 },
                duration: 100,
                yoyo: true,
                repeat: Math.floor(totalRotations * 1.5),
                ease: 'Sine.easeInOut',
            });
        });

        this.updateSpinCountDisplay();
    }

    private weightedRandom(): number {
        // 每次必中水瓶
        return PRIZES.findIndex(p => p.name === '水瓶');
    }

    private onSpinComplete(prizeIndex: number): void {
        const prize = PRIZES[prizeIndex];

        // 指针回正
        this.pointer.setAngle(0);

        // 如果是水瓶，标记已抽中
        if (prize.name === '水瓶') {
            this.hasWonBottle = true;
        }

        // 显示结果
        this.showResult(prize);

        this.isSpinning = false;
        this.spinButton.setTexture('btn_spin');
        this.updateSpinCountDisplay();
    }

    private showResult(prize: { name: string; icon: string; color: number }): void {
        const isWaterBottle = prize.name === '水瓶';

        // 结果文字
        this.resultText.setText(`${prize.icon}\n${prize.name}`);
        this.resultText.setStyle({
            fontSize: isWaterBottle ? '56px' : '48px',
            color: isWaterBottle ? '#2ECC71' : '#FFD700',
        });
        this.resultText.setAlpha(0);
        this.resultText.setDepth(30);

        // 背景
        const bgOverlay = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0x000000, 0.5
        ).setDepth(25).setAlpha(0);

        this.tweens.add({
            targets: bgOverlay,
            alpha: 0.6,
            duration: 300,
        });

        // 结果框
        const boxWidth = isWaterBottle ? 400 : 350;
        const boxHeight = isWaterBottle ? 250 : 200;
        const resultBox = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            boxWidth, boxHeight,
            isWaterBottle ? 0x1a4d2e : 0x2d1b4e,
            0.95
        ).setDepth(28).setAlpha(0);

        // 边框
        resultBox.setStrokeStyle(4, prize.color);

        this.tweens.add({
            targets: [this.resultText, resultBox],
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut',
        });

        // 从小到大弹出
        resultBox.setScale(0.3);
        this.resultText.setScale(0.3);
        this.tweens.add({
            targets: [resultBox, this.resultText],
            scale: 1,
            duration: 600,
            ease: 'Back.easeOut',
        });

        // 水瓶特殊效果
        if (isWaterBottle) {
            this.spawnConfetti();
            this.time.delayedCall(300, () => {
                this.cameras.main.shake(500, 0.01);
            });

            // 大标题
            const winTitle = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, '🎉 大奖来了！🎉', {
                fontSize: '28px',
                color: '#FFD700',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3,
            }).setOrigin(0.5).setDepth(31).setAlpha(0).setScale(0.5);

            this.tweens.add({
                targets: winTitle,
                alpha: 1,
                scale: 1,
                duration: 800,
                ease: 'Back.easeOut',
            });

            // 2秒后添加关闭按钮
            this.time.delayedCall(1000, () => {
                this.addCloseButton(resultBox, bgOverlay, winTitle);
            });
        } else {
            // 普通奖品，3秒后自动关闭
            this.time.delayedCall(2500, () => {
                this.tweens.add({
                    targets: [this.resultText, resultBox, bgOverlay],
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        resultBox.destroy();
                        bgOverlay.destroy();
                    },
                });
            });
        }
    }

    private addCloseButton(box: Phaser.GameObjects.Rectangle, overlay: Phaser.GameObjects.Rectangle, title: Phaser.GameObjects.Text): void {
        const closeBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, '✨ 收下水瓶 ✨', {
            fontSize: '22px',
            color: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            backgroundColor: '#2ECC71',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setScale(1.1));
        closeBtn.on('pointerout', () => closeBtn.setScale(1));

        closeBtn.on('pointerdown', () => {
            // 最终庆祝
            this.spawnConfetti();
            this.cameras.main.shake(300, 0.008);

            this.tweens.add({
                targets: [this.resultText, box, overlay, title, closeBtn],
                alpha: 0,
                duration: 800,
                onComplete: () => {
                    box.destroy();
                    overlay.destroy();
                    title.destroy();
                    closeBtn.destroy();

                    // 显示最终信息
                    this.showFinalMessage();
                },
            });
        });
    }

    private showFinalMessage(): void {
        const finalMsg = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '🫗 恭喜获得水瓶！🫗\n\n你是幸运儿！', {
            fontSize: '32px',
            color: '#2ECC71',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5).setDepth(30).setAlpha(0);

        this.tweens.add({
            targets: finalMsg,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 1000,
            ease: 'Back.easeOut',
        });

        // 持续礼花
        this.spawnConfetti();
        this.time.delayedCall(1500, () => this.spawnConfetti());
        this.time.delayedCall(3000, () => this.spawnConfetti());
    }

    private spawnConfetti(): void {
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFD700, 0xFF69B4, 0x00FFFF, 0xFF6347, 0x9B59B6];

        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(100, GAME_WIDTH - 100);
            const startY = Phaser.Math.Between(-50, 0);
            const endY = GAME_HEIGHT + 50;
            const color = Phaser.Utils.Array.GetRandom(colors);
            const size = Phaser.Math.Between(4, 10);

            const confetti = this.add.rectangle(x, startY, size, size * 1.5, color).setDepth(50);

            this.tweens.add({
                targets: confetti,
                y: endY,
                x: x + Phaser.Math.Between(-100, 100),
                angle: Phaser.Math.Between(0, 720),
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Cubic.easeIn',
                onComplete: () => confetti.destroy(),
            });
        }
    }

    private clearConfetti(): void {
        // 没法精确追踪，但我们通过 tween 管理的 confetti 会自行销毁
    }

    private updateSpinCountDisplay(): void {
        if (this.isSpinning) {
            this.buttonText.setText('旋转中...');
            this.buttonText.setColor('#BDC3C7');
        } else {
            this.buttonText.setText('🎰 抽奖！');
            this.buttonText.setColor('#FFFFFF');
        }
    }

    update(): void {
        // 灯泡颜色随时间变化
        const time = this.time.now / 1000;
        this.lightBulbs.forEach((bulb, i) => {
            const brightness = 0.5 + 0.5 * Math.sin(time * 3 + i * 0.5);
            bulb.setAlpha(brightness);
        });
    }
}
