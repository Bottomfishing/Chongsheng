import Phaser from "phaser";

const GAME_DURATION_MS = 45_000;
const SPAWN_INTERVAL_MS = 700;
const CATCHER_DISPLAY_HEIGHT = 108;
const DROP_DISPLAY_HEIGHT = 64;

type FinishPayload = {
  score: number;
  bestScore: number;
};

export class StreamRushScene extends Phaser.Scene {
  private catcher!: Phaser.GameObjects.Image;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private score = 0;
  private remainingMs = GAME_DURATION_MS;
  private spawnAccumulator = 0;
  private bestScore = 0;
  private isFinished = false;
  private readonly fallItems: Array<{
    body: Phaser.GameObjects.Image;
    speed: number;
    value: number;
  }> = [];

  constructor() {
    super("stream-rush");
  }

  preload() {
    this.load.image("stream-rush-catcher", "/images/stream-rush-catcher.png");
    this.load.image("stream-rush-drop", "/images/stream-rush-drop.png");
  }

  create() {
    const { width, height } = this.scale;

    this.bestScore = this.readBestScore();

    this.add.rectangle(width / 2, height / 2, width, height, 0xf8f2e8, 1);
    this.add
      .rectangle(width / 2, 74, width - 48, 96, 0xfffcf7, 0.92)
      .setStrokeStyle(2, 0xc9a96e, 0.7);

    this.add
      .text(width / 2, 52, "直播冲榜", {
        color: "#8b4513",
        fontFamily: '"Georgia", "Noto Serif SC", "Songti SC", serif',
        fontSize: "34px",
      })
      .setOrigin(0.5);

    this.hintText = this.add
      .text(width / 2, 88, `左右移动接住"赞"和"礼"，45 秒内尽量冲高分。`, {
        color: "#8b7355",
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: "18px",
      })
      .setOrigin(0.5);

    this.scoreText = this.add.text(36, 148, "得分：0", {
      color: "#5c4033",
      fontFamily: '"Noto Serif SC", "Songti SC", serif',
      fontSize: "24px",
    });

    this.timerText = this.add.text(width - 36, 148, "剩余：45s", {
      color: "#5c4033",
      fontFamily: '"Noto Serif SC", "Songti SC", serif',
      fontSize: "24px",
    });
    this.timerText.setOrigin(1, 0);

    this.add
      .text(width - 36, 180, `历史最高：${this.bestScore}`, {
        color: "#9a7a59",
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: "18px",
      })
      .setOrigin(1, 0);

    this.add
      .rectangle(width / 2, height - 56, width - 80, 24, 0xdec8a0, 0.45)
      .setStrokeStyle(1, 0xc9a96e, 0.35);

    this.catcher = this.add.image(width / 2, height - 78, "stream-rush-catcher");
    const catcherRatio = this.catcher.width / this.catcher.height;
    this.catcher.setDisplaySize(CATCHER_DISPLAY_HEIGHT * catcherRatio, CATCHER_DISPLAY_HEIGHT);
    this.catcher.setOrigin(0.5);

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isFinished) {
        return;
      }

      const halfWidth = this.catcher.displayWidth / 2;
      this.catcher.x = Phaser.Math.Clamp(pointer.x, halfWidth + 16, width - halfWidth - 16);
    });
  }

  update(_: number, delta: number) {
    if (this.isFinished) {
      return;
    }

    this.remainingMs = Math.max(this.remainingMs - delta, 0);
    this.timerText.setText(`剩余：${Math.ceil(this.remainingMs / 1000)}s`);

    this.spawnAccumulator += delta;
    if (this.spawnAccumulator >= SPAWN_INTERVAL_MS) {
      this.spawnAccumulator = 0;
      this.spawnItem();
    }

    for (let i = this.fallItems.length - 1; i >= 0; i -= 1) {
      const item = this.fallItems[i];
      const step = item.speed * (delta / 1000);

      item.body.y += step;

      if (this.checkCatch(item)) {
        this.score += item.value;
        this.scoreText.setText(`得分：${this.score}`);
        this.removeItem(i);
        continue;
      }

      if (item.body.y > this.scale.height + 32) {
        this.removeItem(i);
      }
    }

    if (this.remainingMs <= 0) {
      this.finishGame();
    }
  }

  private spawnItem() {
    const { width } = this.scale;
    const isGift = Math.random() > 0.65;
    const x = Phaser.Math.Between(72, width - 72);
    const speed = Phaser.Math.Between(180, 280);
    const value = isGift ? 3 : 1;

    const body = this.add.image(x, 210, "stream-rush-drop");
    const dropRatio = body.width / body.height;
    body.setDisplaySize(DROP_DISPLAY_HEIGHT * dropRatio, DROP_DISPLAY_HEIGHT);
    body.setOrigin(0.5);

    this.fallItems.push({ body, speed, value });
  }

  private checkCatch(item: { body: Phaser.GameObjects.Image }) {
    const catcherTop = this.catcher.y - this.catcher.displayHeight / 2;
    const catcherBottom = this.catcher.y + this.catcher.displayHeight / 2;
    const catcherLeft = this.catcher.x - this.catcher.displayWidth / 2;
    const catcherRight = this.catcher.x + this.catcher.displayWidth / 2;

    const itemTop = item.body.y - item.body.displayHeight / 2;
    const itemBottom = item.body.y + item.body.displayHeight / 2;
    const itemLeft = item.body.x - item.body.displayWidth / 2;
    const itemRight = item.body.x + item.body.displayWidth / 2;

    return (
      itemRight >= catcherLeft &&
      itemLeft <= catcherRight &&
      itemBottom >= catcherTop &&
      itemTop <= catcherBottom
    );
  }

  private removeItem(index: number) {
    const item = this.fallItems[index];
    item.body.destroy();
    this.fallItems.splice(index, 1);
  }

  private finishGame() {
    this.isFinished = true;

    for (let i = this.fallItems.length - 1; i >= 0; i -= 1) {
      this.removeItem(i);
    }

    this.bestScore = Math.max(this.bestScore, this.score);
    this.writeBestScore(this.bestScore);

    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x2a1a0d, 0.58);
    this.add
      .rectangle(width / 2, height / 2, 420, 240, 0xfffcf7, 0.97)
      .setStrokeStyle(2, 0xc9a96e, 0.72);

    this.add
      .text(width / 2, height / 2 - 58, "冲榜结束", {
        color: "#8b4513",
        fontFamily: '"Georgia", "Noto Serif SC", "Songti SC", serif',
        fontSize: "32px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 8, `本局得分：${this.score}`, {
        color: "#5c4033",
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: "26px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 32, `历史最高：${this.bestScore}`, {
        color: "#8b7355",
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: "20px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, `刷新页面或点击"再来一次"可重新挑战。`, {
        color: "#9a7a59",
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: "16px",
      })
      .setOrigin(0.5);

    this.events.emit("stream-rush-finished", {
      score: this.score,
      bestScore: this.bestScore,
    } satisfies FinishPayload);
  }

  private readBestScore() {
    if (typeof window === "undefined") {
      return 0;
    }

    const raw = window.localStorage.getItem("stream-rush-best-score");
    const score = Number(raw);
    return Number.isFinite(score) ? score : 0;
  }

  private writeBestScore(score: number) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("stream-rush-best-score", String(score));
  }
}
