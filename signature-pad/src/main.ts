// ===== 签名板核心逻辑 =====

const canvas = document.getElementById('signCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const hint = document.getElementById('hint')!;

// 状态
let isDrawing = false;
let penColor = '#1a1a1a';
let penSize = 3;
let bgMode: 'white' | 'transparent' = 'white';
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let lastSpeed = 0;
let hasDrawn = false;

// 撤销历史
const history: ImageData[] = [];
const MAX_HISTORY = 30;

function saveState(): void {
    if (history.length >= MAX_HISTORY) history.shift();
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undo(): void {
    if (history.length === 0) return;
    const state = history.pop()!;
    ctx.putImageData(state, 0, 0);
    // 检查画布是否为空
    checkEmpty();
}

// ===== 绘制 =====

function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e instanceof TouchEvent) {
        const touch = e.touches[0];
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
        };
    }
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
    };
}

function startDraw(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    isDrawing = true;
    saveState();

    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
    lastTime = Date.now();
    lastSpeed = 0;

    // 画一个点（应对点击不拖动的情况）
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, penSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = penColor;
    ctx.fill();

    if (!hasDrawn) {
        hasDrawn = true;
        hint.classList.add('hidden');
    }
}

function draw(e: MouseEvent | TouchEvent): void {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getPos(e);
    const now = Date.now();
    const dt = Math.max(1, now - lastTime);
    const dist = Math.sqrt((pos.x - lastX) ** 2 + (pos.y - lastY) ** 2);
    const speed = dist / dt;

    // 平滑速度
    const smoothSpeed = lastSpeed * 0.6 + speed * 0.4;

    // 根据速度调整线宽（快→细，慢→粗），模拟钢笔效果
    const minSize = penSize * 0.4;
    const maxSize = penSize * 1.3;
    const dynamicSize = maxSize - (maxSize - minSize) * Math.min(1, smoothSpeed / 2);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    // 使用二次贝塞尔曲线平滑
    const midX = (lastX + pos.x) / 2;
    const midY = (lastY + pos.y) / 2;
    ctx.quadraticCurveTo(lastX, lastY, midX, midY);

    ctx.strokeStyle = penColor;
    ctx.lineWidth = dynamicSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
    lastTime = now;
    lastSpeed = smoothSpeed;
}

function endDraw(): void {
    if (!isDrawing) return;
    isDrawing = false;
}

// ===== 事件绑定 =====

// 鼠标
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);

// 触屏
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', endDraw);
canvas.addEventListener('touchcancel', endDraw);

// ===== 工具栏 =====

// 颜色选择
const colorOptions = document.getElementById('colorOptions')!;
const colorDots = colorOptions.querySelectorAll('.color-dot') as NodeListOf<HTMLElement>;

colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        penColor = dot.dataset.color!;
    });
});

// 粗细
const sizeSlider = document.getElementById('sizeSlider') as HTMLInputElement;
const sizeDot = document.getElementById('sizeDot') as HTMLDivElement;

function updateSizePreview(): void {
    penSize = parseInt(sizeSlider.value);
    const displaySize = Math.max(4, penSize * 2.5);
    sizeDot.style.width = displaySize + 'px';
    sizeDot.style.height = displaySize + 'px';
}

sizeSlider.addEventListener('input', updateSizePreview);
updateSizePreview();

// 背景
const btnBgWhite = document.getElementById('btnBgWhite')!;
const btnBgTrans = document.getElementById('btnBgTrans')!;

btnBgWhite.addEventListener('click', () => {
    bgMode = 'white';
    redrawBackground();
    btnBgWhite.style.opacity = '1';
    btnBgTrans.style.opacity = '0.5';
});

btnBgTrans.addEventListener('click', () => {
    bgMode = 'transparent';
    redrawBackground();
    btnBgTrans.style.opacity = '1';
    btnBgWhite.style.opacity = '0.5';
});

// 初始状态
btnBgTrans.style.opacity = '0.5';

function redrawBackground(): void {
    // 保存当前绘制内容
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 重新绘制背景
    if (bgMode === 'white') {
        // 擦掉透明棋盘格，换白色
        canvas.style.background = '#fff';
        // 把透明像素替换为白色
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    } else {
        canvas.style.background = 'repeating-conic-gradient(#e0e0e0 0% 25%, #fff 0% 50%) 0 0 / 20px 20px';
    }
}

// 撤销
document.getElementById('btnUndo')!.addEventListener('click', undo);

// 清空
document.getElementById('btnClear')!.addEventListener('click', () => {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn = false;
    hint.classList.remove('hidden');
    if (bgMode === 'white') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
});

// 保存
document.getElementById('btnSave')!.addEventListener('click', () => {
    const link = document.createElement('a');

    if (bgMode === 'transparent') {
        // 保存为 PNG（保留透明）
        link.download = '合同签名.png';
        link.href = canvas.toDataURL('image/png');
    } else {
        // 白色背景，先创建带白底的临时画布
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        const tmpCtx = tmpCanvas.getContext('2d')!;
        tmpCtx.fillStyle = '#fff';
        tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpCtx.drawImage(canvas, 0, 0);
        link.download = '合同签名.png';
        link.href = tmpCanvas.toDataURL('image/png');
    }

    link.click();
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
    }
});

// 检查画布是否为空
function checkEmpty(): void {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let empty = true;
    if (bgMode === 'white') {
        // 白色背景时，检查是否有非白色像素
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
                empty = false;
                break;
            }
        }
    } else {
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) {
                empty = false;
                break;
            }
        }
    }

    if (empty) {
        hasDrawn = false;
        hint.classList.remove('hidden');
    }
}

// 初始化：白色背景
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
