import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, ROUND_TIME, MALE_FIGHTER, FEMALE_FIGHTER } from '../constants';
import { Fighter } from '../objects/Fighter';

export class FightScene extends Phaser.Scene {
    private player1!: Fighter;
    private player2!: Fighter;
    private timer!: number;
    private timerText!: Phaser.GameObjects.Text;
    private p1HpBar!: Phaser.GameObjects.Image;
    private p2HpBar!: Phaser.GameObjects.Image;
    private p1SpBar!: Phaser.GameObjects.Image;
    private p2SpBar!: Phaser.GameObjects.Image;
    private p1Name!: Phaser.GameObjects.Text;
    private p2Name!: Phaser.GameObjects.Text;
    private p1HpText!: Phaser.GameObjects.Text;
    private p2HpText!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;
    private comboCount: number = 0;
    private comboTimer: number = 0;
    private roundOver: boolean = false;
    private announceText!: Phaser.GameObjects.Text;
    private ground!: Phaser.Physics.Arcade.StaticGroup;
    private projectiles: Phaser.GameObjects.Image[] = [];
    private roundCount: number = 1;
    private p1Wins: number = 0;
    private p2Wins: number = 0;
    private p1WinIcons: Phaser.GameObjects.Arc[] = [];
    private p2WinIcons: Phaser.GameObjects.Arc[] = [];
    private controlsHint!: Phaser.GameObjects.Text;
    private hitStopTimer: number = 0;

    constructor() {
        super('FightScene');
    }

    create(): void {
        this.roundOver = false;
        this.projectiles = [];
        this.hitStopTimer = 0;

        // 背景
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg_arena');

        // 地面
        this.ground = this.physics.add.staticGroup();
        const groundRect = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 15, GAME_WIDTH, 30, 0x000000, 0);
        this.ground.add(groundRect);

        // 创建角色
        this.player1 = new Fighter(this, 250, GROUND_Y, MALE_FIGHTER, 1);
        this.player2 = new Fighter(this, 710, GROUND_Y, FEMALE_FIGHTER, 2);

        // 设置按键
        this.player1.setupKeys({
            left: 'A', right: 'D', up: 'W', down: 'S',
            punch: 'J', kick: 'K', special: 'L', block: 'U'
        });

        this.player2.setupKeys({
            left: 'LEFT', right: 'RIGHT', up: 'UP', down: 'DOWN',
            punch: 'ONE', kick: 'TWO', special: 'THREE', block: 'FOUR'
        });

        // 物理碰撞
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        // 角色互相推挤（防止重叠）
        this.physics.add.collider(this.player1, this.player2, this.pushApart, undefined, this);

        // 创建 UI
        this.createUI();

        // 投射物事件
        this.events.on('projectileCreated', this.onProjectileCreated, this);

        // 倒计时
        this.timer = ROUND_TIME;

        // 开场播报
        this.showAnnouncement('ROUND ' + this.roundCount, () => {
            this.showAnnouncement('FIGHT!', () => {}, 800);
        }, 1200);

        // 操作提示
        this.controlsHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 15,
            'P1: WASD移动 J拳K踢L必杀U防御 | P2: 方向键移动 1拳2踢3必杀4防御', {
                fontSize: '12px',
                color: '#888888',
                fontFamily: 'Arial'
            }).setOrigin(0.5).setDepth(30);

        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: this.controlsHint,
                alpha: 0,
                duration: 1000
            });
        });

        this.cameras.main.fadeIn(500);
    }

    update(time: number, delta: number): void {
        if (this.roundOver) return;

        // 顿帧倒计时（用逻辑暂停替代物理暂停）
        if (this.hitStopTimer > 0) {
            this.hitStopTimer -= delta;
            return; // 顿帧期间跳过更新
        }

        // 更新角色
        this.player1.update(time, delta, this.player2);
        this.player2.update(time, delta, this.player1);

        // 攻击碰撞检测（在主 update 中统一处理）
        this.checkAllHits();

        // 限制角色位置
        this.clampPositions();

        // 更新投射物碰撞
        this.updateProjectiles();

        // 更新倒计时
        this.timer -= delta / 1000;
        if (this.timer <= 0) {
            this.timer = 0;
            this.timeUp();
        }
        this.timerText.setText(Math.ceil(this.timer).toString());

        if (this.timer <= 10) {
            this.timerText.setColor('#ff4444');
        }

        // 更新血条
        this.updateHealthBars();

        // 更新能量条
        this.updateSpecialBars();

        // 更新连击计时
        if (this.comboCount > 0) {
            this.comboTimer -= delta / 1000;
            if (this.comboTimer <= 0) {
                this.comboCount = 0;
                this.comboText.setAlpha(0);
            }
        }

        // 检查胜负
        if (this.player1.hp <= 0) {
            this.roundWin(2);
        } else if (this.player2.hp <= 0) {
            this.roundWin(1);
        }

        // 能量自然恢复
        if (this.player1.hp > 0) this.player1.sp = Math.min(this.player1.maxSp, this.player1.sp + delta * 0.008);
        if (this.player2.hp > 0) this.player2.sp = Math.min(this.player2.maxSp, this.player2.sp + delta * 0.008);
    }

    // ========== 攻击检测（在主 update 中调用） ==========
    private checkAllHits(): void {
        const p1Hit = this.player1.checkHitOnOpponent(this.player2);
        const p2Hit = this.player2.checkHitOnOpponent(this.player1);

        if (p1Hit) {
            if (this.player1.comboCount >= 2) {
                this.showCombo(this.player1.comboCount, true);
            }
            // 顿帧效果（逻辑暂停，不用物理暂停）
            this.hitStopTimer = this.player1.currentAction === 'special' ? 80 : 40;
        }

        if (p2Hit) {
            if (this.player2.comboCount >= 2) {
                this.showCombo(this.player2.comboCount, false);
            }
            this.hitStopTimer = this.player2.currentAction === 'special' ? 80 : 40;
        }
    }

    // ========== 投射物碰撞检测 ==========
    private updateProjectiles(): void {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            if (!proj || !proj.active) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // 简单矩形碰撞检测
            const owner = proj.getData('owner') as Fighter;
            const damage = proj.getData('damage') || 0;
            const knockback = proj.getData('knockback') || 0;

            // 检测 P1
            if (owner !== this.player1 && this.player1.hp > 0) {
                const dist = Phaser.Math.Distance.Between(proj.x, proj.y, this.player1.x, this.player1.y - 40);
                if (dist < 50) {
                    const fromRight = proj.x > this.player1.x;
                    this.player1.takeDamage(damage, knockback, fromRight);
                    if (proj.active) proj.destroy();
                    this.projectiles.splice(i, 1);
                    continue;
                }
            }

            // 检测 P2
            if (owner !== this.player2 && this.player2.hp > 0) {
                const dist = Phaser.Math.Distance.Between(proj.x, proj.y, this.player2.x, this.player2.y - 40);
                if (dist < 50) {
                    const fromRight = proj.x > this.player2.x;
                    this.player2.takeDamage(damage, knockback, fromRight);
                    if (proj.active) proj.destroy();
                    this.projectiles.splice(i, 1);
                    continue;
                }
            }

            // 超出画面
            if (proj.x < -50 || proj.x > GAME_WIDTH + 50) {
                if (proj.active) proj.destroy();
                this.projectiles.splice(i, 1);
            }
        }
    }

    // ========== UI 创建 ==========
    private createUI(): void {
        const uiDepth = 25;

        this.add.image(200, 30, 'hp_bar_bg').setDepth(uiDepth);
        this.add.image(760, 30, 'hp_bar_bg').setDepth(uiDepth);

        this.p1HpBar = this.add.image(27, 17, 'hp_bar_blue').setOrigin(0, 0).setDepth(uiDepth + 1);
        this.p2HpBar = this.add.image(587, 17, 'hp_bar_red').setOrigin(0, 0).setDepth(uiDepth + 1).setFlipX(true);

        this.add.image(200, 55, 'sp_bar_bg').setDepth(uiDepth);
        this.add.image(760, 55, 'sp_bar_bg').setDepth(uiDepth);

        this.p1SpBar = this.add.image(27, 46, 'sp_bar_blue').setOrigin(0, 0).setDepth(uiDepth + 1);
        this.p2SpBar = this.add.image(587, 46, 'sp_bar_red').setOrigin(0, 0).setDepth(uiDepth + 1).setFlipX(true);

        this.p1Name = this.add.text(200, 4, MALE_FIGHTER.name, {
            fontSize: '14px', color: '#3b82f6', fontFamily: 'Arial',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(uiDepth + 2);

        this.p2Name = this.add.text(760, 4, FEMALE_FIGHTER.name, {
            fontSize: '14px', color: '#f43f5e', fontFamily: 'Arial',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(uiDepth + 2);

        this.p1HpText = this.add.text(55, 20, '', {
            fontSize: '14px', color: '#ffffff', fontFamily: 'Arial',
            stroke: '#000', strokeThickness: 2
        }).setDepth(uiDepth + 2);

        this.p2HpText = this.add.text(830, 20, '', {
            fontSize: '14px', color: '#ffffff', fontFamily: 'Arial',
            stroke: '#000', strokeThickness: 2
        }).setDepth(uiDepth + 2);

        this.add.image(GAME_WIDTH / 2, 30, 'timer_bg').setDepth(uiDepth);
        this.timerText = this.add.text(GAME_WIDTH / 2, 28, ROUND_TIME.toString(), {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(uiDepth + 1);

        this.add.image(GAME_WIDTH / 2, 30, 'vs_icon').setScale(0.5).setDepth(uiDepth + 2).setAlpha(0.5);

        this.comboText = this.add.text(GAME_WIDTH / 2, 120, '', {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(uiDepth + 5).setAlpha(0);

        this.updateWinIcons();
    }

    private updateWinIcons(): void {
        this.p1WinIcons.forEach(i => i.destroy());
        this.p2WinIcons.forEach(i => i.destroy());
        this.p1WinIcons = [];
        this.p2WinIcons = [];

        for (let i = 0; i < this.p1Wins; i++) {
            const icon = this.add.circle(55 + i * 25, 65, 8, 0xffd700).setDepth(25);
            this.p1WinIcons.push(icon);
        }
        for (let i = 0; i < this.p2Wins; i++) {
            const icon = this.add.circle(860 - i * 25, 65, 8, 0xffd700).setDepth(25);
            this.p2WinIcons.push(icon);
        }
    }

    // ========== 血条更新 ==========
    private updateHealthBars(): void {
        const p1Ratio = this.player1.hp / this.player1.maxHp;
        const p2Ratio = this.player2.hp / this.player2.maxHp;

        this.p1HpBar.setDisplaySize(346 * Math.max(0, p1Ratio), 26);
        this.p1HpBar.setTexture(p1Ratio <= 0.25 ? 'hp_bar_low' : 'hp_bar_blue');

        this.p2HpBar.setDisplaySize(346 * Math.max(0, p2Ratio), 26);
        this.p2HpBar.setTexture(p2Ratio <= 0.25 ? 'hp_bar_low' : 'hp_bar_red');

        this.p1HpText.setText(`${this.player1.hp}`);
        this.p2HpText.setText(`${this.player2.hp}`);
    }

    private updateSpecialBars(): void {
        const p1Ratio = this.player1.sp / this.player1.maxSp;
        const p2Ratio = this.player2.sp / this.player2.maxSp;

        this.p1SpBar.setDisplaySize(348 * Math.max(0, p1Ratio), 10);
        this.p2SpBar.setDisplaySize(348 * Math.max(0, p2Ratio), 10);

        this.p1SpBar.setAlpha(p1Ratio >= 1 ? (0.7 + Math.sin(this.time.now / 100) * 0.3) : 1);
        this.p2SpBar.setAlpha(p2Ratio >= 1 ? (0.7 + Math.sin(this.time.now / 100) * 0.3) : 1);
    }

    private showCombo(count: number, isP1: boolean): void {
        this.comboCount = count;
        this.comboTimer = 2;
        this.comboText.setText(`${count} HIT COMBO!`);
        this.comboText.setAlpha(1);
        this.comboText.setColor(isP1 ? '#3b82f6' : '#f43f5e');
        this.comboText.setScale(1);

        this.tweens.add({
            targets: this.comboText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 150,
            yoyo: true
        });

        this.tweens.add({
            targets: this.comboText,
            alpha: 0,
            duration: 1500,
            delay: 500
        });
    }

    // ========== 投射物 ==========
    private onProjectileCreated(projectile: Phaser.GameObjects.Image): void {
        this.projectiles.push(projectile);
    }

    // ========== 角色推挤 ==========
    private pushApart(p1: Phaser.Types.Physics.Arcade.GameObjectWithBody, p2: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        const fighter1 = p1 as Fighter;
        const fighter2 = p2 as Fighter;

        const overlap = 60 - Math.abs(fighter1.x - fighter2.x);
        if (overlap > 0 && Math.abs(fighter1.y - fighter2.y) < 60) {
            const push = overlap / 2;
            if (fighter1.x < fighter2.x) {
                fighter1.x -= push;
                fighter2.x += push;
            } else {
                fighter1.x += push;
                fighter2.x -= push;
            }
        }
    }

    // ========== 位置限制 ==========
    private clampPositions(): void {
        const minX = 50;
        const maxX = GAME_WIDTH - 50;

        if (this.player1.x < minX) this.player1.x = minX;
        if (this.player1.x > maxX) this.player1.x = maxX;
        if (this.player2.x < minX) this.player2.x = minX;
        if (this.player2.x > maxX) this.player2.x = maxX;
    }

    // ========== 播报 ==========
    private showAnnouncement(text: string, callback: () => void, duration: number = 1000): void {
        this.announceText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, text, {
            fontSize: '56px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 10, fill: true }
        }).setOrigin(0.5).setDepth(50).setScale(0);

        this.tweens.add({
            targets: this.announceText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (this.announceText && this.announceText.active) {
                    this.tweens.add({
                        targets: this.announceText,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100
                    });
                }
            }
        });

        this.time.delayedCall(duration, () => {
            if (this.announceText && this.announceText.active) {
                this.tweens.add({
                    targets: this.announceText,
                    alpha: 0,
                    scaleX: 2,
                    scaleY: 2,
                    duration: 300,
                    onComplete: () => {
                        if (this.announceText && this.announceText.active) {
                            this.announceText.destroy();
                        }
                        callback();
                    }
                });
            } else {
                callback();
            }
        });
    }

    // ========== 回合结束 ==========
    private roundWin(winner: number): void {
        if (this.roundOver) return;
        this.roundOver = true;

        if (winner === 1) {
            this.player1.playWin();
            this.player2.playLose();
            this.p1Wins++;
        } else {
            this.player2.playWin();
            this.player1.playLose();
            this.p2Wins++;
        }

        this.updateWinIcons();

        const winnerName = winner === 1 ? MALE_FIGHTER.name : FEMALE_FIGHTER.name;
        this.showAnnouncement(`${winnerName} WINS!`, () => {
            if (this.p1Wins >= 2 || this.p2Wins >= 2) {
                this.time.delayedCall(1500, () => {
                    this.scene.start('GameOver', {
                        winner: winner,
                        p1Wins: this.p1Wins,
                        p2Wins: this.p2Wins
                    });
                });
            } else {
                this.time.delayedCall(1500, () => {
                    this.nextRound();
                });
            }
        }, 2000);
    }

    private timeUp(): void {
        if (this.roundOver) return;

        if (this.player1.hp > this.player2.hp) {
            this.roundWin(1);
        } else if (this.player2.hp > this.player1.hp) {
            this.roundWin(2);
        } else {
            this.roundWin(1);
        }
    }

    private nextRound(): void {
        this.roundCount++;

        this.player1.reset(250, GROUND_Y);
        this.player2.reset(710, GROUND_Y);

        this.timer = ROUND_TIME;
        this.timerText.setColor('#ffffff');
        this.roundOver = false;
        this.hitStopTimer = 0;
        this.comboCount = 0;
        this.comboText.setAlpha(0);

        this.projectiles.forEach(p => { if (p && p.active) p.destroy(); });
        this.projectiles = [];

        this.showAnnouncement('ROUND ' + this.roundCount, () => {
            this.showAnnouncement('FIGHT!', () => {}, 800);
        }, 1200);
    }
}
