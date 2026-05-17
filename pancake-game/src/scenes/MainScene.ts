import Phaser from 'phaser';
import {
    GAME_WIDTH, GAME_HEIGHT,
    GameState, CookLevel,
    TOPPINGS,
    POUR_DURATION, FLIP_DURATION, SERVE_DURATION,
    COOK_TIMES,
} from '../constants';

export class MainScene extends Phaser.Scene {
    private state: GameState = GameState.IDLE;
    private griddle!: Phaser.GameObjects.Image;
    private pancake!: Phaser.GameObjects.Image;
    private spatula!: Phaser.GameObjects.Image;
    private steamEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private scoreText!: Phaser.GameObjects.Text;
    private orderText!: Phaser.GameObjects.Text;
    private statusText!: Phaser.GameObjects.Text;
    private actionBtn!: Phaser.GameObjects.Container;
    private actionBtnBg!: Phaser.GameObjects.Rectangle;
    private actionBtnText!: Phaser.GameObjects.Text;
    private toppingBtns: Phaser.GameObjects.Container[] = [];
    private orderToppings: string[] = [];
    private addedToppings: string[] = [];
    private toppingSprites: Phaser.GameObjects.Image[] = [];
    private side1CookTime = 0;
    private side2CookTime = 0;
    private side1Level: CookLevel = CookLevel.RAW;
    private side2Level: CookLevel = CookLevel.RAW;
    private score = 0;
    private pancakeScale = 0;
    private combo = 0;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // 背景 - 厨房台面
        this.createBackground();

        // 铁板
        this.griddle = this.add.image(GAME_WIDTH / 2, 300, 'griddle');
        this.griddle.setDepth(5);

        // 蒸汽粒子
        this.steamEmitter = this.add.particles(GAME_WIDTH / 2, 280, 'steam', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.3, end: 0 },
            lifespan: 1500,
            frequency: 300,
            blendMode: 'ADD',
        }).setDepth(15);

        // 煎饼
        this.pancake = this.add.image(GAME_WIDTH / 2, 300, 'pancake_s3');
        this.pancake.setDepth(10);
        this.pancake.setVisible(false);

        // 铲子
        this.spatula = this.add.image(GAME_WIDTH / 2 + 160, 250, 'spatula');
        this.spatula.setDepth(20);
        this.spatula.setAngle(-30);
        this.spatula.setAlpha(0.7);

        // 铲子跟随鼠标
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const sx = Phaser.Math.Clamp(pointer.x, 100, GAME_WIDTH - 100);
            const sy = Phaser.Math.Clamp(pointer.y, 100, GAME_HEIGHT - 100);
            this.spatula.setPosition(sx + 40, sy - 40);
        });

        // 点击铁板区域交互
        this.griddle.setInteractive({ useHandCursor: true });
        this.griddle.on('pointerdown', () => this.onGriddleClick());

        // 分数
        this.scoreText = this.add.text(20, 16, '💰 0', {
            fontSize: '22px', color: '#FFD700', fontFamily: 'Arial', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3,
        });

        // 订单
        this.orderText = this.add.text(GAME_WIDTH - 20, 16, '', {
            fontSize: '16px', color: '#FFF', fontFamily: 'Arial',
            stroke: '#000', strokeThickness: 2,
        }).setOrigin(1, 0);

        // 状态提示
        this.statusText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 90, '', {
            fontSize: '20px', color: '#FFD700', fontFamily: 'Arial', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(30);

        // 操作按钮
        this.createActionButton();

        // 配料按钮
        this.createToppingButtons();

        // 生成第一个订单
        this.generateOrder();
        this.updateStatus();
    }

    private createBackground(): void {
        // 厨房台面
        const bg = this.add.graphics();
        // 木纹台面
        bg.fillStyle(0x5D3A1A);
        bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        // 木纹纹理
        bg.lineStyle(1, 0x4A2E14, 0.3);
        for (let y = 0; y < GAME_HEIGHT; y += 8) {
            bg.beginPath();
            bg.moveTo(0, y);
            for (let x = 0; x < GAME_WIDTH; x += 20) {
                bg.lineTo(x + 20, y + Math.sin(x * 0.05 + y * 0.02) * 2);
            }
            bg.strokePath();
        }
        // 铁板底座阴影
        bg.fillStyle(0x000000, 0.2);
        bg.fillEllipse(GAME_WIDTH / 2, 320, 340, 200);
    }

    private createActionButton(): void {
        this.actionBtnBg = this.add.rectangle(0, 0, 160, 50, 0xE74C3C, 0.9);
        this.actionBtnBg.setStrokeStyle(3, 0xFFFFFF);
        this.actionBtnText = this.add.text(0, 0, '倒面糊', {
            fontSize: '20px', color: '#FFFFFF', fontFamily: 'Arial', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.actionBtn = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 85, [this.actionBtnBg, this.actionBtnText]);
        this.actionBtn.setDepth(25);
        this.actionBtnBg.setInteractive({ useHandCursor: true });
        this.actionBtnBg.on('pointerdown', () => this.onActionClick());
        this.actionBtnBg.on('pointerover', () => this.actionBtnBg.setFillStyle(0xFF5555, 0.9));
        this.actionBtnBg.on('pointerout', () => this.actionBtnBg.setFillStyle(0xE74C3C, 0.9));
    }

    private createToppingButtons(): void {
        const startX = 80;
        const y = GAME_HEIGHT - 40;

        TOPPINGS.forEach((topping, i) => {
            const bg = this.add.rectangle(0, 0, 80, 36, topping.color, 0.85);
            bg.setStrokeStyle(2, 0xFFFFFF);
            const text = this.add.text(0, 0, topping.name, {
                fontSize: '14px', color: '#FFF', fontFamily: 'Arial', fontStyle: 'bold',
            }).setOrigin(0.5);

            const btn = this.add.container(startX + i * 90, y, [bg, text]);
            btn.setDepth(25);
            bg.setInteractive({ useHandCursor: true });

            bg.on('pointerdown', () => {
                if (this.state === GameState.COOKING_SIDE1 || this.state === GameState.READY_FLIP ||
                    this.state === GameState.COOKING_SIDE2 || this.state === GameState.READY_SERVE) {
                    this.addTopping(topping.key);
                }
            });

            bg.on('pointerover', () => bg.setFillStyle(topping.color, 1));
            bg.on('pointerout', () => bg.setFillStyle(topping.color, 0.85));

            this.toppingBtns.push(btn);
        });
    }

    private generateOrder(): void {
        this.orderToppings = [];
        const count = Phaser.Math.Between(2, 4);
        const available = [...TOPPINGS];
        for (let i = 0; i < count; i++) {
            const idx = Phaser.Math.Between(0, available.length - 1);
            this.orderToppings.push(available[idx].key);
            available.splice(idx, 1);
        }
        this.updateOrderDisplay();
    }

    private updateOrderDisplay(): void {
        const names = this.orderToppings.map(key => {
            const t = TOPPINGS.find(t => t.key === key);
            return t ? t.name : key;
        });
        this.orderText.setText(`📋 订单：${names.join(' + ')}`);
    }

    private addTopping(key: string): void {
        if (this.addedToppings.includes(key)) return;
        this.addedToppings.push(key);

        const topping = TOPPINGS.find(t => t.key === key);
        if (!topping) return;

        // 在煎饼上放置配料
        const offsetX = (this.addedToppings.length - 1) * 15 - 10;
        const offsetY = -5 + (key === 'egg' ? -10 : 0);
        const sprite = this.add.image(GAME_WIDTH / 2 + offsetX, 300 + offsetY, 'top_' + key);
        sprite.setDepth(12);
        sprite.setScale(0.8);
        sprite.setAlpha(0);

        this.tweens.add({
            targets: sprite,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut',
        });

        this.toppingSprites.push(sprite);
    }

    private onActionClick(): void {
        switch (this.state) {
            case GameState.IDLE:
                this.startPouring();
                break;
            case GameState.READY_FLIP:
                this.doFlip();
                break;
            case GameState.READY_SERVE:
                this.doServe();
                break;
        }
    }

    private onGriddleClick(): void {
        // 点击铁板也触发当前操作
        this.onActionClick();
    }

    private startPouring(): void {
        this.state = GameState.POURING;
        this.side1CookTime = 0;
        this.side2CookTime = 0;
        this.side1Level = CookLevel.RAW;
        this.side2Level = CookLevel.RAW;
        this.addedToppings = [];
        this.toppingSprites.forEach(s => s.destroy());
        this.toppingSprites = [];
        this.pancakeScale = 0;

        // 显示面糊，从小变大
        this.pancake.setVisible(true);
        this.pancake.setTexture('batter');
        this.pancake.setScale(0.1);

        this.tweens.add({
            targets: this,
            pancakeScale: 1,
            duration: POUR_DURATION,
            ease: 'Sine.easeOut',
            onUpdate: () => {
                const s = this.pancakeScale;
                if (s < 0.3) {
                    this.pancake.setTexture('batter');
                } else if (s < 0.5) {
                    this.pancake.setTexture('pancake_s1');
                } else if (s < 0.75) {
                    this.pancake.setTexture('pancake_s2');
                } else {
                    this.pancake.setTexture('pancake_s3');
                }
                this.pancake.setScale(s);
            },
            onComplete: () => {
                this.pancake.setScale(1);
                this.pancake.setTexture('pancake_s3');
                this.state = GameState.COOKING_SIDE1;
                this.updateStatus();
            },
        });

        this.updateStatus();
    }

    private doFlip(): void {
        this.state = GameState.FLIPPING;

        // 翻面动画
        this.tweens.add({
            targets: this.pancake,
            scaleX: 0,
            duration: FLIP_DURATION / 2,
            ease: 'Sine.easeIn',
            onComplete: () => {
                // 换成底面纹理
                this.pancake.setTexture(this.getFlippedTexture());
                this.toppingSprites.forEach(s => s.setVisible(false));

                this.tweens.add({
                    targets: this.pancake,
                    scaleX: 1,
                    duration: FLIP_DURATION / 2,
                    ease: 'Sine.easeOut',
                    onComplete: () => {
                        this.state = GameState.COOKING_SIDE2;
                        this.updateStatus();
                    },
                });
            },
        });

        // 铲子动画
        this.tweens.add({
            targets: this.spatula,
            y: 280,
            angle: 0,
            duration: 200,
            yoyo: true,
        });

        this.updateStatus();
    }

    private doServe(): void {
        this.state = GameState.SERVING;

        // 出锅动画
        this.tweens.add({
            targets: [this.pancake, ...this.toppingSprites],
            y: -100,
            angle: { from: 0, to: Phaser.Math.Between(-15, 15) },
            duration: SERVE_DURATION,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.calculateScore();
                this.resetRound();
            },
        });

        this.updateStatus();
    }

    private calculateScore(): void {
        let points = 0;
        const s1 = this.side1Level;
        const s2 = this.side2Level;

        // 烤制评分
        if (s1 === CookLevel.PERFECT && s2 === CookLevel.PERFECT) {
            points += 50;
            this.combo++;
        } else if (s1 === CookLevel.LIGHT && s2 === CookLevel.PERFECT ||
                   s1 === CookLevel.PERFECT && s2 === CookLevel.LIGHT) {
            points += 35;
            this.combo++;
        } else if (s1 <= CookLevel.DARK && s2 <= CookLevel.DARK) {
            points += 15;
            this.combo = 0;
        } else {
            points += 0;
            this.combo = 0;
        }

        // 配料评分
        let toppingScore = 0;
        this.orderToppings.forEach(req => {
            if (this.addedToppings.includes(req)) toppingScore += 10;
        });
        // 多余配料扣分
        this.addedToppings.forEach(add => {
            if (!this.orderToppings.includes(add)) toppingScore -= 5;
        });
        points += Math.max(0, toppingScore);

        // 连击加分
        if (this.combo > 1) points += this.combo * 5;

        this.score += points;

        // 评语
        let comment = '';
        if (points >= 80) comment = '🥇 完美！';
        else if (points >= 50) comment = '👍 不错！';
        else if (points >= 30) comment = '😊 还行';
        else if (points > 0) comment = '😐 凑合';
        else comment = '🤮 糊了！';

        this.showFloatText(`${comment} +${points}`, GAME_WIDTH / 2, 200);
        if (this.combo > 1) {
            this.showFloatText(`🔥 ${this.combo}连击！`, GAME_WIDTH / 2, 170);
        }

        this.scoreText.setText(`💰 ${this.score}`);
    }

    private showFloatText(text: string, x: number, y: number): void {
        const t = this.add.text(x, y, text, {
            fontSize: '28px', color: '#FFD700', fontFamily: 'Arial', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(40);

        this.tweens.add({
            targets: t,
            y: y - 60,
            alpha: 0,
            duration: 1200,
            ease: 'Cubic.easeOut',
            onComplete: () => t.destroy(),
        });
    }

    private resetRound(): void {
        this.pancake.setVisible(false);
        this.pancake.setScale(1);
        this.pancake.setAngle(0);
        this.toppingSprites.forEach(s => s.destroy());
        this.toppingSprites = [];
        this.addedToppings = [];
        this.side1CookTime = 0;
        this.side2CookTime = 0;
        this.state = GameState.IDLE;
        this.generateOrder();
        this.updateStatus();
    }

    private getFlippedTexture(): string {
        switch (this.side1Level) {
            case CookLevel.PERFECT: return 'pancake_f5';
            case CookLevel.DARK: return 'pancake_f6';
            case CookLevel.BURNT: return 'pancake_f7';
            default: return 'pancake_f5';
        }
    }

    private getCookingTexture(level: CookLevel): string {
        switch (level) {
            case CookLevel.RAW: return 'pancake_s3';
            case CookLevel.LIGHT: return 'pancake_s4';
            case CookLevel.PERFECT: return 'pancake_s5';
            case CookLevel.DARK: return 'pancake_s6';
            case CookLevel.BURNT: return 'pancake_s7';
            default: return 'pancake_s3';
        }
    }

    private updateStatus(): void {
        let text = '';
        let btnText = '';
        let btnColor = 0xE74C3C;

        switch (this.state) {
            case GameState.IDLE:
                text = '👆 点击铁板或按钮倒面糊';
                btnText = '倒面糊';
                btnColor = 0x3498DB;
                break;
            case GameState.POURING:
                text = '🫗 正在倒面糊...';
                btnText = '倒面糊';
                btnColor = 0x7F8C8D;
                break;
            case GameState.COOKING_SIDE1:
                text = '🍳 第一面煎制中... 变金黄时翻面！';
                btnText = '翻面';
                btnColor = 0xF39C12;
                break;
            case GameState.READY_FLIP:
                text = '✨ 快翻面！';
                btnText = '🔄 翻面！';
                btnColor = 0x2ECC71;
                break;
            case GameState.COOKING_SIDE2:
                text = '🍳 第二面煎制中... 差不多就出锅！';
                btnText = '出锅';
                btnColor = 0xF39C12;
                break;
            case GameState.READY_SERVE:
                text = '✨ 可以出锅了！';
                btnText = '🍽 出锅！';
                btnColor = 0x2ECC71;
                break;
            case GameState.FLIPPING:
            case GameState.SERVING:
                text = '';
                btnText = '...';
                btnColor = 0x7F8C8D;
                break;
        }

        this.statusText.setText(text);
        this.actionBtnText.setText(btnText);
        this.actionBtnBg.setFillStyle(btnColor, 0.9);
    }

    update(_time: number, delta: number): void {
        // 更新烤制
        if (this.state === GameState.COOKING_SIDE1) {
            this.side1CookTime += delta;
            this.side1Level = this.getCookLevel(this.side1CookTime);
            this.pancake.setTexture(this.getCookingTexture(this.side1Level));

            // 金黄时提示翻面
            if (this.side1Level >= CookLevel.PERFECT && this.state === GameState.COOKING_SIDE1) {
                this.state = GameState.READY_FLIP;
                this.updateStatus();
            }

            // 过火闪烁
            if (this.side1Level >= CookLevel.DARK) {
                this.pancake.setTint(0xFFAAAA);
                this.time.delayedCall(100, () => {
                    if (this.pancake.active) this.pancake.clearTint();
                });
            }
        }

        if (this.state === GameState.COOKING_SIDE2) {
            this.side2CookTime += delta;
            this.side2Level = this.getCookLevel(this.side2CookTime);

            // 翻面后也更新纹理（根据第二面烤制程度）
            if (this.side2Level >= CookLevel.LIGHT) {
                this.pancake.setTexture('pancake_f6');
            }

            if (this.side2Level >= CookLevel.LIGHT && this.state === GameState.COOKING_SIDE2) {
                this.state = GameState.READY_SERVE;
                this.updateStatus();
            }

            if (this.side2Level >= CookLevel.DARK) {
                this.pancake.setTint(0xFFAAAA);
                this.time.delayedCall(100, () => {
                    if (this.pancake.active) this.pancake.clearTint();
                });
            }
        }

        // 蒸汽强度随烤制变化
        const intensity = (this.state === GameState.COOKING_SIDE1 || this.state === GameState.COOKING_SIDE2) ? 150 : 400;
        this.steamEmitter.setFrequency(intensity);
    }

    private getCookLevel(time: number): CookLevel {
        if (time >= COOK_TIMES[CookLevel.BURNT]) return CookLevel.BURNT;
        if (time >= COOK_TIMES[CookLevel.DARK]) return CookLevel.DARK;
        if (time >= COOK_TIMES[CookLevel.PERFECT]) return CookLevel.PERFECT;
        if (time >= COOK_TIMES[CookLevel.LIGHT]) return CookLevel.LIGHT;
        return CookLevel.RAW;
    }
}
