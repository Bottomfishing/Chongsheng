import Phaser from 'phaser';
import {
    FighterData, MALE_FIGHTER, FEMALE_FIGHTER,
    FighterAction, HitboxConfig,
    PUNCH_HITBOX, KICK_HITBOX, SPECIAL_HITBOX, CROUCH_KICK_HITBOX,
    GROUND_Y
} from '../constants';

export class Fighter extends Phaser.Physics.Arcade.Sprite {
    public data: FighterData;
    public hp: number;
    public maxHp: number;
    public sp: number = 0;
    public maxSp: number = 100;
    public isAttacking: boolean = false;
    public isBlocking: boolean = false;
    public isHurt: boolean = false;
    public isCrouching: boolean = false;
    public isOnGround: boolean = true;
    public currentAction: FighterAction = FighterAction.IDLE;
    public playerIndex: number;
    public comboCount: number = 0;
    public lastHitTime: number = 0;

    private actionTimer: number = 0;
    private hitbox: Phaser.GameObjects.Rectangle | null = null;
    private hitboxActive: boolean = false;
    private hitboxTimer: number = 0;
    private canHit: boolean = true;
    private hurtTimer: number = 0;
    private flashTimer: number = 0;
    private facingRight: boolean = true;

    private fightScene: Phaser.Scene;

    public keys!: {
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        punch: Phaser.Input.Keyboard.Key;
        kick: Phaser.Input.Keyboard.Key;
        special: Phaser.Input.Keyboard.Key;
        block: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Phaser.Scene, x: number, y: number, data: FighterData, playerIndex: number) {
        const textureKey = playerIndex === 1 ? 'male_idle' : 'female_idle';
        super(scene, x, y, textureKey);

        this.data = data;
        this.hp = data.maxHp;
        this.maxHp = data.maxHp;
        this.playerIndex = playerIndex;
        this.fightScene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.getBody();
        body.setBounce(0);
        body.setCollideWorldBounds(true);
        body.setSize(40, 75);
        this.setOrigin(0.5, 1);
        this.setScale(2.5);
        this.setDepth(10);

        this.refreshBody();
    }

    private getBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    public setupKeys(keyConfig: {
        left: string; right: string; up: string; down: string;
        punch: string; kick: string; special: string; block: string;
    }): void {
        const keyboard = this.scene.input.keyboard!;
        this.keys = {
            left: keyboard.addKey(keyConfig.left),
            right: keyboard.addKey(keyConfig.right),
            up: keyboard.addKey(keyConfig.up),
            down: keyboard.addKey(keyConfig.down),
            punch: keyboard.addKey(keyConfig.punch),
            kick: keyboard.addKey(keyConfig.kick),
            special: keyboard.addKey(keyConfig.special),
            block: keyboard.addKey(keyConfig.block)
        };
    }

    public setFacing(right: boolean): void {
        this.facingRight = right;
        this.setFlipX(!right);
    }

    update(time: number, delta: number, opponent: Fighter): void {
        if (this.hp <= 0) return;

        const dt = delta / 1000;

        // 自动面向对手
        if (!this.isAttacking && !this.isHurt) {
            this.setFacing(opponent.x > this.x);
        }

        // 地面检测
        this.isOnGround = this.y >= GROUND_Y - 2;

        // 受伤计时
        if (this.isHurt) {
            this.hurtTimer -= dt;
            if (this.hurtTimer <= 0) {
                this.isHurt = false;
            }
        }

        // 攻击计时
        if (this.isAttacking) {
            this.actionTimer -= dt;
            if (this.actionTimer <= 0) {
                this.isAttacking = false;
                this.canHit = true;
                this.removeHitbox();
            }
        }

        // 受伤闪烁
        if (this.isHurt) {
            this.flashTimer += dt;
            this.setAlpha(Math.sin(this.flashTimer * 20) > 0 ? 1 : 0.3);
        } else {
            this.setAlpha(1);
        }

        // 攻击判定框更新
        if (this.hitboxActive && this.hitbox) {
            this.hitboxTimer -= dt;
            if (this.hitboxTimer <= 0) {
                this.removeHitbox();
            }
        }

        // 处理输入（非攻击和非受伤时）
        if (!this.isAttacking && !this.isHurt) {
            this.handleInput(dt, opponent);
        }

        // 更新动画
        this.updateAnimation();

        // 连击计时
        if (time - this.lastHitTime > 1500) {
            this.comboCount = 0;
        }
    }

    private handleInput(dt: number, opponent: Fighter): void {
        const body = this.getBody();
        let vx = 0;

        // 格挡
        if (this.keys.block.isDown && this.isOnGround) {
            this.isBlocking = true;
            body.setVelocityX(0);
            this.isCrouching = false;
            return;
        } else {
            this.isBlocking = false;
        }

        // 蹲下
        if (this.keys.down.isDown && this.isOnGround) {
            this.isCrouching = true;
            body.setVelocityX(0);

            if (Phaser.Input.Keyboard.JustDown(this.keys.kick)) {
                this.performCrouchKick();
            }
            return;
        } else {
            this.isCrouching = false;
        }

        // 左右移动
        if (this.keys.left.isDown) {
            vx = -this.data.speed;
        } else if (this.keys.right.isDown) {
            vx = this.data.speed;
        }

        body.setVelocityX(vx);

        // 跳跃
        if (Phaser.Input.Keyboard.JustDown(this.keys.up) && this.isOnGround) {
            body.setVelocityY(this.data.jumpForce);
            this.isOnGround = false;
        }

        // 出拳
        if (Phaser.Input.Keyboard.JustDown(this.keys.punch)) {
            this.performPunch();
        }

        // 踢腿
        if (Phaser.Input.Keyboard.JustDown(this.keys.kick)) {
            this.performKick();
        }

        // 必杀技
        if (Phaser.Input.Keyboard.JustDown(this.keys.special) && this.sp >= this.maxSp) {
            this.performSpecial();
        }
    }

    // ========== 攻击动作 ==========
    private performPunch(): void {
        this.isAttacking = true;
        this.currentAction = FighterAction.PUNCH;
        this.actionTimer = 0.25;
        this.canHit = true;
        const hitboxCfg = { ...PUNCH_HITBOX, damage: this.data.punchDamage };
        this.createHitbox(hitboxCfg, 0.08, 0.12);
    }

    private performKick(): void {
        this.isAttacking = true;
        this.currentAction = FighterAction.KICK;
        this.actionTimer = 0.35;
        this.canHit = true;
        const hitboxCfg = { ...KICK_HITBOX, damage: this.data.kickDamage };
        this.createHitbox(hitboxCfg, 0.1, 0.15);
    }

    private performCrouchKick(): void {
        this.isAttacking = true;
        this.currentAction = FighterAction.CROUCH_KICK;
        this.actionTimer = 0.3;
        this.canHit = true;
        const hitboxCfg = { ...CROUCH_KICK_HITBOX, damage: this.data.crouchKickDamage };
        this.createHitbox(hitboxCfg, 0.08, 0.12);
    }

    private performSpecial(): void {
        this.isAttacking = true;
        this.currentAction = FighterAction.SPECIAL;
        this.actionTimer = 0.6;
        this.canHit = true;
        this.sp = 0;
        const hitboxCfg = { ...SPECIAL_HITBOX, damage: this.data.specialDamage };
        this.createHitbox(hitboxCfg, 0.15, 0.25);

        this.fireProjectile();
    }

    private createHitbox(cfg: HitboxConfig, startDelay: number, activeTime: number): void {
        this.removeHitbox();

        // 延迟出现判定框
        this.scene.time.delayedCall(startDelay * 1000, () => {
            if (!this.isAttacking || !this.active) return;

            try {
                const offsetX = this.facingRight ? cfg.offsetX : -cfg.offsetX - cfg.width;
                const offsetY = this.isCrouching ? cfg.offsetY + 15 : cfg.offsetY;

                this.hitbox = this.scene.add.rectangle(
                    this.x + offsetX * 2.5, this.y + offsetY * 2.5,
                    cfg.width * 2.5, cfg.height * 2.5,
                    0xff0000, 0
                );

                if (!this.hitbox) return;

                this.scene.physics.add.existing(this.hitbox, false);

                const hitboxBody = this.hitbox.body as Phaser.Physics.Arcade.Body;
                hitboxBody.setAllowGravity(false);
                hitboxBody.setImmovable(true);
                hitboxBody.setDebugShowBody(false);

                this.hitboxActive = true;
                this.hitboxTimer = activeTime;

                this.hitbox.setData('damage', cfg.damage);
                this.hitbox.setData('knockback', cfg.knockback);
                this.hitbox.setData('owner', this);
            } catch (e) {
                // 安全失败：如果 hitbox 创建失败，不崩溃
                this.hitbox = null;
                this.hitboxActive = false;
            }
        });
    }

    private removeHitbox(): void {
        if (this.hitbox) {
            try {
                this.hitbox.destroy();
            } catch (e) {
                // 忽略销毁错误
            }
            this.hitbox = null;
        }
        this.hitboxActive = false;
    }

    private fireProjectile(): void {
        const key = this.playerIndex === 1 ? 'energy_wave' : 'phoenix_flame';
        const dir = this.facingRight ? 1 : -1;

        try {
            const projectile = this.scene.physics.add.image(
                this.x + dir * 60, this.y - 50, key
            );
            projectile.setScale(2);
            projectile.setDepth(15);
            (projectile.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
            (projectile.body as Phaser.Physics.Arcade.Body).setVelocityX(dir * 500);
            projectile.setData('damage', this.data.specialDamage * 0.5);
            projectile.setData('knockback', 300);
            projectile.setData('owner', this);

            this.scene.time.delayedCall(1500, () => {
                if (projectile && projectile.active) projectile.destroy();
            });

            this.scene.events.emit('projectileCreated', projectile);
        } catch (e) {
            // 投射物创建失败不崩溃
        }
    }

    // ========== 受伤 ==========
    public takeDamage(damage: number, knockback: number, fromRight: boolean): void {
        if (this.isBlocking) {
            damage = Math.floor(damage * 0.15);
            knockback *= 0.3;
            this.showBlockEffect();
        } else {
            this.isHurt = true;
            this.hurtTimer = 0.3;
            this.flashTimer = 0;
            this.isAttacking = false;
            this.removeHitbox();
            this.showHitEffect();
        }

        this.hp = Math.max(0, this.hp - damage);

        const body = this.getBody();
        const knockDir = fromRight ? -1 : 1;
        body.setVelocityX(knockDir * knockback);
        body.setVelocityY(-100);

        this.lastHitTime = this.scene.time.now;
    }

    private showHitEffect(): void {
        try {
            const spark = this.scene.add.image(this.x, this.y - 40, 'hit_spark');
            spark.setScale(2);
            spark.setDepth(20);

            this.scene.tweens.add({
                targets: spark,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 200,
                onComplete: () => { if (spark.active) spark.destroy(); }
            });

            this.scene.cameras.main.shake(100, 0.005);
        } catch (e) { /* 忽略特效错误 */ }
    }

    private showBlockEffect(): void {
        try {
            const flash = this.scene.add.image(this.x, this.y - 40, 'block_flash');
            flash.setScale(2);
            flash.setDepth(20);

            this.scene.tweens.add({
                targets: flash,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 150,
                onComplete: () => { if (flash.active) flash.destroy(); }
            });
        } catch (e) { /* 忽略特效错误 */ }
    }

    // ========== 碰撞检测（简化版，不用物理引擎） ==========
    public checkHitOnOpponent(opponent: Fighter): boolean {
        if (!this.hitbox || !this.hitbox.active || !this.hitboxActive || !this.canHit) {
            return false;
        }

        // 简单矩形碰撞检测（不依赖物理引擎）
        const hitX = this.hitbox.x;
        const hitY = this.hitbox.y;
        const hitW = (this.hitbox.width * this.hitbox.scaleX) / 2;
        const hitH = (this.hitbox.height * this.hitbox.scaleY) / 2;

        const oppBody = opponent.getBody();
        const oppX = opponent.x;
        const oppY = opponent.y - oppBody.halfHeight;
        const oppW = oppBody.halfWidth;
        const oppH = oppBody.halfHeight;

        const overlap = !(
            hitX + hitW < oppX - oppW ||
            hitX - hitW > oppX + oppW ||
            hitY + hitH < oppY - oppH ||
            hitY - hitH > oppY + oppH
        );

        if (overlap) {
            const damage = this.hitbox.getData('damage') || 0;
            const knockback = this.hitbox.getData('knockback') || 0;
            const fromRight = this.x > opponent.x;

            let comboBonus = 1;
            if (this.comboCount > 0) {
                comboBonus = 1 + this.comboCount * 0.1;
            }

            const finalDamage = Math.floor(damage * comboBonus);
            opponent.takeDamage(finalDamage, knockback, fromRight);

            this.canHit = false;
            this.sp = Math.min(this.maxSp, this.sp + 15);
            this.comboCount++;
            this.lastHitTime = this.scene.time.now;

            return true;
        }

        return false;
    }

    // ========== 动画更新 ==========
    private updateAnimation(): void {
        const prefix = this.playerIndex === 1 ? 'male' : 'female';

        if (this.hp <= 0) {
            this.setTexture(`${prefix}_hurt`);
            return;
        }

        if (this.isHurt) {
            this.setTexture(`${prefix}_hurt`);
            return;
        }

        if (this.isBlocking) {
            this.setTexture(`${prefix}_block`);
            return;
        }

        if (this.isAttacking) {
            switch (this.currentAction) {
                case FighterAction.PUNCH:
                    this.setTexture(`${prefix}_punch`);
                    break;
                case FighterAction.KICK:
                    this.setTexture(`${prefix}_kick`);
                    break;
                case FighterAction.SPECIAL:
                    this.setTexture(`${prefix}_special`);
                    break;
                case FighterAction.CROUCH_KICK:
                    this.setTexture(`${prefix}_crouch_kick`);
                    break;
            }
            return;
        }

        if (!this.isOnGround) {
            this.setTexture(`${prefix}_jump`);
            return;
        }

        if (this.isCrouching) {
            this.setTexture(`${prefix}_crouch`);
            return;
        }

        const body = this.getBody();
        if (Math.abs(body.velocity.x) > 10) {
            this.setTexture(`${prefix}_walk`);
        } else {
            this.setTexture(`${prefix}_idle`);
        }
    }

    // ========== 胜利/失败 ==========
    public playWin(): void {
        const prefix = this.playerIndex === 1 ? 'male' : 'female';
        this.setTexture(`${prefix}_win`);
        this.isAttacking = false;
        this.isHurt = false;
        this.removeHitbox();

        this.scene.tweens.add({
            targets: this,
            y: this.y - 30,
            duration: 400,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeOut'
        });
    }

    public playLose(): void {
        const prefix = this.playerIndex === 1 ? 'male' : 'female';
        this.setTexture(`${prefix}_hurt`);
        this.removeHitbox();

        this.scene.tweens.add({
            targets: this,
            angle: this.facingRight ? 80 : -80,
            y: this.y + 20,
            alpha: 0.6,
            duration: 500,
            ease: 'Power2'
        });
    }

    public getHitbox(): Phaser.GameObjects.Rectangle | null {
        return this.hitbox;
    }

    public reset(x: number, y: number): void {
        this.hp = this.maxHp;
        this.sp = 0;
        this.isAttacking = false;
        this.isBlocking = false;
        this.isHurt = false;
        this.isCrouching = false;
        this.canHit = true;
        this.comboCount = 0;
        this.removeHitbox();
        this.setPosition(x, y);
        this.setAlpha(1);
        this.setAngle(0);
        this.getBody().setVelocity(0, 0);
        this.getBody().setAcceleration(0, 0);
    }
}
