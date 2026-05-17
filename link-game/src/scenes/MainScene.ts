import Phaser from 'phaser';
import {
    GAME_WIDTH, GAME_HEIGHT,
    COLS, ROWS, TILE_SIZE, TILE_GAP,
    BOARD_OFFSET_X, BOARD_OFFSET_Y,
    FOODS, FoodItem,
} from '../constants';

// 扩展棋盘，外围加一圈空位用于路径绕行
const EXT_COLS = COLS + 2;
const EXT_ROWS = ROWS + 2;

interface TileData {
    row: number;
    col: number;
    foodIndex: number; // -1 表示空位
    sprite: Phaser.GameObjects.Container | null;
}

interface Point {
    row: number;
    col: number;
}

export class MainScene extends Phaser.Scene {
    private board: TileData[][] = [];        // 扩展棋盘 [extRow][extCol]
    private selectedTile: TileData | null = null;
    private selectBorder: Phaser.GameObjects.Graphics | null = null;
    private pathGraphics!: Phaser.GameObjects.Graphics;
    private score = 0;
    private pairsLeft = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private pairsText!: Phaser.GameObjects.Text;
    private hintBtn!: Phaser.GameObjects.Text;
    private shuffleBtn!: Phaser.GameObjects.Text;
    private canClick = true;

    constructor() {
        super({ key: 'MainScene' });
    }

    create(): void {
        // 标题
        this.add.text(GAME_WIDTH / 2, 22, '🍜 美食连连看 🍜', {
            fontSize: '28px',
            color: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);

        // 分数和剩余对数
        this.scoreText = this.add.text(20, 16, '得分：0', {
            fontSize: '18px', color: '#AABBFF', fontFamily: 'Arial',
        });
        this.pairsText = this.add.text(GAME_WIDTH - 20, 16, '剩余：0 对', {
            fontSize: '18px', color: '#AABBFF', fontFamily: 'Arial',
        }).setOrigin(1, 0);

        // 提示和洗牌按钮
        this.hintBtn = this.add.text(GAME_WIDTH / 2 - 80, GAME_HEIGHT - 28, '💡 提示', {
            fontSize: '18px', color: '#FFD700', fontFamily: 'Arial', backgroundColor: '#333355',
            padding: { x: 12, y: 4 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.hintBtn.on('pointerdown', () => this.showHint());

        this.shuffleBtn = this.add.text(GAME_WIDTH / 2 + 80, GAME_HEIGHT - 28, '🔀 洗牌', {
            fontSize: '18px', color: '#FFD700', fontFamily: 'Arial', backgroundColor: '#333355',
            padding: { x: 12, y: 4 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.shuffleBtn.on('pointerdown', () => this.shuffleBoard());

        // 路径绘制
        this.pathGraphics = this.add.graphics();
        this.pathGraphics.setDepth(50);

        // 初始化棋盘
        this.initBoard();
    }

    private initBoard(): void {
        // 生成配对的食物索引列表
        const totalTiles = COLS * ROWS;       // 48
        const pairsCount = totalTiles / 2;    // 24
        const foodIndices: number[] = [];

        for (let i = 0; i < pairsCount; i++) {
            const foodIdx = i % FOODS.length;
            foodIndices.push(foodIdx, foodIdx);
        }

        // 洗牌
        this.shuffleArray(foodIndices);

        // 创建扩展棋盘（外围一圈为空）
        this.board = [];
        let tileIdx = 0;

        for (let r = 0; r < EXT_ROWS; r++) {
            this.board[r] = [];
            for (let c = 0; c < EXT_COLS; c++) {
                if (r === 0 || r === EXT_ROWS - 1 || c === 0 || c === EXT_COLS - 1) {
                    // 外围空位
                    this.board[r][c] = { row: r, col: c, foodIndex: -1, sprite: null };
                } else {
                    const foodIdx = foodIndices[tileIdx++];
                    const tile = this.createTile(r, c, foodIdx);
                    this.board[r][c] = { row: r, col: c, foodIndex: foodIdx, sprite: tile };
                }
            }
        }

        this.pairsLeft = pairsCount;
        this.score = 0;
        this.selectedTile = null;
        this.updateUI();

        // 确保可解
        if (!this.hasValidMove()) {
            this.shuffleBoard();
        }
    }

    private createTile(extRow: number, extCol: number, foodIndex: number): Phaser.GameObjects.Container {
        const x = this.extColToX(extCol);
        const y = this.extRowToY(extRow);
        const food = FOODS[foodIndex];

        const container = this.add.container(x, y);

        // 背景方块
        const bg = this.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, 0x2d2d5e, 0.9);
        bg.setStrokeStyle(2, 0x5555aa);
        container.add(bg);

        // 食物图片（圆形裁切）
        const img = this.add.image(0, -4, food.key + '_circle');
        container.add(img);

        // 食物名称
        const label = this.add.text(0, TILE_SIZE / 2 - 12, food.name, {
            fontSize: '12px',
            color: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        container.add(label);

        // 交互
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => this.onTileClick(extRow, extCol));

        // 入场动画
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scale: 1,
            duration: 300,
            delay: (extRow * EXT_COLS + extCol) * 20,
            ease: 'Back.easeOut',
        });

        return container;
    }

    private onTileClick(extRow: number, extCol: number): void {
        if (!this.canClick) return;

        const tile = this.board[extRow][extCol];
        if (tile.foodIndex === -1 || !tile.sprite) return;

        if (this.selectedTile === null) {
            // 第一次选择
            this.selectedTile = tile;
            this.showSelectBorder(tile);
        } else if (this.selectedTile.row === extRow && this.selectedTile.col === extCol) {
            // 点击同一个，取消选择
            this.clearSelectBorder();
            this.selectedTile = null;
        } else {
            // 第二次选择
            const first = this.selectedTile;
            this.selectedTile = null;
            this.clearSelectBorder();

            if (first.foodIndex === tile.foodIndex) {
                // 同类型，尝试连线
                const path = this.findPath(first, tile);
                if (path) {
                    this.canClick = false;
                    this.drawPath(path);
                    this.time.delayedCall(350, () => {
                        this.removePair(first, tile);
                        this.pathGraphics.clear();
                        this.canClick = true;

                        // 检查是否胜利
                        if (this.pairsLeft === 0) {
                            this.showWin();
                        } else if (!this.hasValidMove()) {
                            this.shuffleBoard();
                        }
                    });
                    return;
                }
            }
            // 不匹配或无法连线，选择新的
            this.selectedTile = tile;
            this.showSelectBorder(tile);
        }
    }

    // ===== 连线路径查找 =====

    private findPath(t1: TileData, t2: TileData): Point[] | null {
        // 尝试 0 转、1 转、2 转的路径
        // 0 转：同行或同列直连
        if (this.canStraightConnect(t1, t2)) {
            return [
                { row: t1.row, col: t1.col },
                { row: t2.row, col: t2.col },
            ];
        }

        // 1 转：一个拐点
        const corner1 = { row: t1.row, col: t2.col };
        if (this.isEmpty(corner1.row, corner1.col) &&
            this.canStraightConnect(t1, this.getVirtualTile(corner1)) &&
            this.canStraightConnect(this.getVirtualTile(corner1), t2)) {
            return [
                { row: t1.row, col: t1.col },
                corner1,
                { row: t2.row, col: t2.col },
            ];
        }

        const corner2 = { row: t2.row, col: t1.col };
        if (this.isEmpty(corner2.row, corner2.col) &&
            this.canStraightConnect(t1, this.getVirtualTile(corner2)) &&
            this.canStraightConnect(this.getVirtualTile(corner2), t2)) {
            return [
                { row: t1.row, col: t1.col },
                corner2,
                { row: t2.row, col: t2.col },
            ];
        }

        // 2 转：两个拐点
        // 水平扫描线
        for (let r = 0; r < EXT_ROWS; r++) {
            const c1 = { row: r, col: t1.col };
            const c2 = { row: r, col: t2.col };
            if (this.isEmpty(c1.row, c1.col) && this.isEmpty(c2.row, c2.col) &&
                this.canStraightConnect(t1, this.getVirtualTile(c1)) &&
                this.canStraightConnect(this.getVirtualTile(c1), this.getVirtualTile(c2)) &&
                this.canStraightConnect(this.getVirtualTile(c2), t2)) {
                return [
                    { row: t1.row, col: t1.col },
                    c1, c2,
                    { row: t2.row, col: t2.col },
                ];
            }
        }

        // 垂直扫描线
        for (let c = 0; c < EXT_COLS; c++) {
            const c1 = { row: t1.row, col: c };
            const c2 = { row: t2.row, col: c };
            if (this.isEmpty(c1.row, c1.col) && this.isEmpty(c2.row, c2.col) &&
                this.canStraightConnect(t1, this.getVirtualTile(c1)) &&
                this.canStraightConnect(this.getVirtualTile(c1), this.getVirtualTile(c2)) &&
                this.canStraightConnect(this.getVirtualTile(c2), t2)) {
                return [
                    { row: t1.row, col: t1.col },
                    c1, c2,
                    { row: t2.row, col: t2.col },
                ];
            }
        }

        return null;
    }

    private canStraightConnect(t1: TileData, t2: TileData): boolean {
        if (t1.row === t2.row) {
            const minC = Math.min(t1.col, t2.col);
            const maxC = Math.max(t1.col, t2.col);
            for (let c = minC + 1; c < maxC; c++) {
                if (!this.isEmpty(t1.row, c)) return false;
            }
            return true;
        }
        if (t1.col === t2.col) {
            const minR = Math.min(t1.row, t2.row);
            const maxR = Math.max(t1.row, t2.row);
            for (let r = minR + 1; r < maxR; r++) {
                if (!this.isEmpty(r, t1.col)) return false;
            }
            return true;
        }
        return false;
    }

    private isEmpty(row: number, col: number): boolean {
        if (row < 0 || row >= EXT_ROWS || col < 0 || col >= EXT_COLS) return false;
        return this.board[row][col].foodIndex === -1;
    }

    private getVirtualTile(p: Point): TileData {
        return this.board[p.row][p.col];
    }

    // ===== 绘制连线 =====

    private drawPath(path: Point[]): void {
        this.pathGraphics.clear();
        this.pathGraphics.lineStyle(4, 0xFFD700, 0.9);

        this.pathGraphics.beginPath();
        for (let i = 0; i < path.length; i++) {
            const x = this.extColToX(path[i].col);
            const y = this.extRowToY(path[i].row);
            if (i === 0) {
                this.pathGraphics.moveTo(x, y);
            } else {
                this.pathGraphics.lineTo(x, y);
            }
        }
        this.pathGraphics.strokePath();

        // 拐点圆点
        this.pathGraphics.fillStyle(0xFF6347, 1);
        path.forEach(p => {
            this.pathGraphics.fillCircle(this.extColToX(p.col), this.extRowToY(p.row), 5);
        });
    }

    // ===== 消除 =====

    private removePair(t1: TileData, t2: TileData): void {
        // 消除动画
        [t1, t2].forEach(t => {
            if (t.sprite) {
                const spr = t.sprite;
                this.tweens.add({
                    targets: spr,
                    scale: 0,
                    alpha: 0,
                    duration: 250,
                    ease: 'Back.easeIn',
                    onComplete: () => spr.destroy(),
                });
            }
            t.foodIndex = -1;
            t.sprite = null;
        });

        this.pairsLeft--;
        this.score += 10;
        this.updateUI();
    }

    // ===== 选择边框 =====

    private showSelectBorder(tile: TileData): void {
        this.clearSelectBorder();
        if (!tile.sprite) return;
        const x = this.extColToX(tile.col);
        const y = this.extRowToY(tile.row);

        this.selectBorder = this.add.graphics();
        this.selectBorder.setDepth(40);
        this.selectBorder.lineStyle(3, 0x00FF88, 1);
        this.selectBorder.strokeRect(
            x - TILE_SIZE / 2 - 2,
            y - TILE_SIZE / 2 - 2,
            TILE_SIZE + 4,
            TILE_SIZE + 4
        );

        // 闪烁
        this.tweens.add({
            targets: this.selectBorder,
            alpha: 0.3,
            duration: 400,
            yoyo: true,
            repeat: -1,
        });
    }

    private clearSelectBorder(): void {
        if (this.selectBorder) {
            this.tweens.killTweensOf(this.selectBorder);
            this.selectBorder.destroy();
            this.selectBorder = null;
        }
    }

    // ===== 提示 =====

    private showHint(): void {
        const move = this.findValidMove();
        if (!move) {
            this.shuffleBoard();
            return;
        }

        // 高亮两个 tile
        [move[0], move[1]].forEach(tile => {
            if (tile.sprite) {
                const spr = tile.sprite;
                this.tweens.add({
                    targets: spr,
                    scale: 1.15,
                    duration: 300,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Sine.easeInOut',
                });
            }
        });

        this.score = Math.max(0, this.score - 3);
        this.updateUI();
    }

    // ===== 洗牌 =====

    private shuffleBoard(): void {
        // 收集剩余食物
        const remaining: number[] = [];
        for (let r = 1; r <= ROWS; r++) {
            for (let c = 1; c <= COLS; c++) {
                if (this.board[r][c].foodIndex !== -1) {
                    remaining.push(this.board[r][c].foodIndex);
                    if (this.board[r][c].sprite) {
                        this.board[r][c].sprite!.destroy();
                        this.board[r][c].sprite = null;
                    }
                }
            }
        }

        this.shuffleArray(remaining);

        let idx = 0;
        for (let r = 1; r <= ROWS; r++) {
            for (let c = 1; c <= COLS; c++) {
                if (this.board[r][c].foodIndex !== -1) {
                    const foodIdx = remaining[idx++];
                    this.board[r][c].foodIndex = foodIdx;
                    this.board[r][c].sprite = this.createTile(r, c, foodIdx);
                }
            }
        }

        this.clearSelectBorder();
        this.selectedTile = null;

        this.score = Math.max(0, this.score - 5);
        this.updateUI();

        // 如果洗牌后仍无解，再洗
        if (remaining.length > 0 && !this.hasValidMove()) {
            this.time.delayedCall(800, () => this.shuffleBoard());
        }
    }

    // ===== 是否有可消除的配对 =====

    private hasValidMove(): boolean {
        return this.findValidMove() !== null;
    }

    private findValidMove(): [TileData, TileData] | null {
        const tiles: TileData[] = [];
        for (let r = 1; r <= ROWS; r++) {
            for (let c = 1; c <= COLS; c++) {
                if (this.board[r][c].foodIndex !== -1) {
                    tiles.push(this.board[r][c]);
                }
            }
        }

        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i].foodIndex === tiles[j].foodIndex) {
                    const path = this.findPath(tiles[i], tiles[j]);
                    if (path) {
                        return [tiles[i], tiles[j]];
                    }
                }
            }
        }
        return null;
    }

    // ===== 胜利 =====

    private showWin(): void {
        const overlay = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0x000000, 0
        ).setDepth(80);

        this.tweens.add({
            targets: overlay,
            fillAlpha: 0.6,
            duration: 500,
        });

        const winText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, '🎉 恭喜通关！🎉', {
            fontSize: '42px',
            color: '#FFD700',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(81).setAlpha(0).setScale(0.3);

        const scoreText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, `最终得分：${this.score}`, {
            fontSize: '24px',
            color: '#AABBFF',
            fontFamily: 'Arial',
        }).setOrigin(0.5).setDepth(81).setAlpha(0);

        this.tweens.add({
            targets: [winText, scoreText],
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut',
        });

        const restartBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, '🔄 再来一局', {
            fontSize: '22px', color: '#FFFFFF', fontFamily: 'Arial',
            backgroundColor: '#E74C3C',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setDepth(81).setInteractive({ useHandCursor: true }).setAlpha(0);

        this.tweens.add({
            targets: restartBtn,
            alpha: 1,
            duration: 800,
            delay: 400,
        });

        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });

        // 礼花
        this.spawnConfetti();
    }

    private spawnConfetti(): void {
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFD700, 0xFF69B4, 0x00FFFF];
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(100, GAME_WIDTH - 100);
            const color = Phaser.Utils.Array.GetRandom(colors);
            const size = Phaser.Math.Between(4, 10);
            const confetti = this.add.rectangle(x, -20, size, size * 1.5, color).setDepth(90);
            this.tweens.add({
                targets: confetti,
                y: GAME_HEIGHT + 50,
                x: x + Phaser.Math.Between(-80, 80),
                angle: Phaser.Math.Between(0, 720),
                duration: Phaser.Math.Between(2000, 3500),
                ease: 'Cubic.easeIn',
                delay: Phaser.Math.Between(0, 500),
                onComplete: () => confetti.destroy(),
            });
        }
    }

    // ===== 工具方法 =====

    private extColToX(extCol: number): number {
        // extCol 1..COLS 对应棋盘实际列
        return BOARD_OFFSET_X + (extCol - 1) * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
    }

    private extRowToY(extRow: number): number {
        return BOARD_OFFSET_Y + (extRow - 1) * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
    }

    private updateUI(): void {
        this.scoreText.setText(`得分：${this.score}`);
        this.pairsText.setText(`剩余：${this.pairsLeft} 对`);
    }

    private shuffleArray<T>(arr: T[]): void {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Phaser.Math.Between(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}
