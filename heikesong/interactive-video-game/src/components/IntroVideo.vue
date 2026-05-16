<template>
  <div class="intro-video">
    <!-- 场景1: 电视雪花屏 -->
    <div v-if="scene === 'static'" class="tv-static">
      <canvas ref="staticCanvas" class="static-canvas" />
      <div class="tv-frame">
        <div class="tv-brand">重生牌</div>
        <div class="tv-screen-bezel">
          <div class="scanlines" />
          <div class="screen-glow" />
        </div>
        <div class="tv-controls">
          <div class="knob" />
          <div class="knob" />
          <div class="speaker-grill">
            <span v-for="n in 6" :key="n" class="grill-line" />
          </div>
        </div>
      </div>
      <div class="status-text">信号接入中...</div>
    </div>

    <!-- 场景2: 标题显现 -->
    <div v-if="scene === 'title'" class="title-scene">
      <div class="vhs-overlay">
        <div class="vhs-line" />
        <div class="vhs-line" />
        <div class="vhs-track">PLAY ▶ 1995.05.16 00:00:00</div>
      </div>
      <div class="title-content">
        <div class="title-label">本节目由</div>
        <h1 class="main-title">重生之回到九十年代玩抖音</h1>
        <div class="title-label">独家赞助播出</div>
        <div class="rec-badge">
          <span class="rec-dot" />
          <span>REC</span>
        </div>
      </div>
      <div class="film-grain" />
    </div>

    <!-- 场景3: 倒计时 -->
    <div v-if="scene === 'countdown'" class="countdown-scene">
      <div class="countdown-circle">
        <span class="countdown-num">{{ countdownNum }}</span>
      </div>
      <p class="countdown-hint">即将进入九十年代...</p>
    </div>

    <!-- 跳过按钮 -->
    <Transition name="fade">
      <button v-if="canSkip" class="skip-btn" @click="skip">
        跳过 &#9654;&#9654;
      </button>
    </Transition>

    <!-- 进度条 -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  ended: []
}>()

const scene = ref<'static' | 'title' | 'countdown'>('static')
const progress = ref(0)
const canSkip = ref(false)
const countdownNum = ref(3)
const SKIP_TIME = 2 // 2秒后可跳过

let staticInterval: ReturnType<typeof setInterval> | null = null
let progressInterval: ReturnType<typeof setInterval> | null = null
const TOTAL_DURATION = 8000 // 总时长8秒

onMounted(() => {
  startStaticNoise()
  startProgress()

  // 场景切换时间线
  setTimeout(() => { scene.value = 'title' }, 2500)
  setTimeout(() => { scene.value = 'countdown' }, 5500)
  setTimeout(() => { emit('ended') }, TOTAL_DURATION)
})

onUnmounted(() => {
  if (staticInterval) clearInterval(staticInterval)
  if (progressInterval) clearInterval(progressInterval)
})

// 电视雪花屏动画
function startStaticNoise() {
  const canvas = document.querySelector('.static-canvas') as HTMLCanvasElement
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 320
  canvas.height = 240

  staticInterval = setInterval(() => {
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.random() * 255
      data[i] = val
      data[i + 1] = val
      data[i + 2] = val
      data[i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)
  }, 50)
}

// 进度条
function startProgress() {
  const startTime = Date.now()
  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    progress.value = Math.min((elapsed / TOTAL_DURATION) * 100, 100)

    if (elapsed >= SKIP_TIME * 1000 && !canSkip.value) {
      canSkip.value = true
    }

    // 倒计时数字
    if (scene.value === 'countdown') {
      const remaining = Math.ceil((TOTAL_DURATION - elapsed) / 1000)
      countdownNum.value = Math.max(remaining, 1)
    }

    if (elapsed >= TOTAL_DURATION && progressInterval) {
      clearInterval(progressInterval)
    }
  }, 100)
}

function skip() {
  if (staticInterval) clearInterval(staticInterval)
  if (progressInterval) clearInterval(progressInterval)
  emit('ended')
}
</script>

<style scoped>
.intro-video {
  position: absolute;
  inset: 0;
  background: #0a0a0a;
  z-index: 25;
  overflow: hidden;
}

/* ========== 雪花屏场景 ========== */
.tv-static {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}
.static-canvas {
  width: 320px;
  height: 240px;
  image-rendering: pixelated;
  border-radius: 8px;
}
.tv-frame {
  position: relative;
  padding: 20px 20px 30px;
  background: #8b7355;
  border-radius: 12px;
  box-shadow:
    inset 0 2px 4px rgba(255,255,255,0.2),
    0 10px 40px rgba(0,0,0,0.5);
}
.tv-brand {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 4px;
}
.tv-screen-bezel {
  position: relative;
  width: 320px;
  height: 240px;
  background: #1a1a1a;
  border-radius: 40px / 20px;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
}
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.15) 2px,
    rgba(0,0,0,0.15) 4px
  );
  pointer-events: none;
  z-index: 2;
}
.screen-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 3;
}
.tv-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 12px;
}
.knob {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6b5a45;
  border: 2px solid #5a4a35;
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.2);
}
.speaker-grill {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.grill-line {
  width: 40px;
  height: 2px;
  background: #6b5a45;
  border-radius: 1px;
}
.status-text {
  color: #c9a96e;
  font-size: 0.85rem;
  letter-spacing: 4px;
  animation: blink-text 1s step-end infinite;
}
@keyframes blink-text {
  50% { opacity: 0.3; }
}

/* ========== 标题场景 ========== */
.title-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  animation: fade-in 0.5s ease;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.vhs-overlay {
  position: absolute;
  top: 2rem;
  left: 2rem;
  right: 2rem;
}
.vhs-line {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin-bottom: 4px;
}
.vhs-track {
  color: rgba(255,255,255,0.3);
  font-size: 0.7rem;
  font-family: monospace;
  letter-spacing: 1px;
}
.title-content {
  text-align: center;
  animation: title-zoom 0.8s ease-out;
}
@keyframes title-zoom {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.title-label {
  color: #c9a96e;
  font-size: 0.9rem;
  letter-spacing: 6px;
  margin-bottom: 1rem;
}
.main-title {
  color: #faf8f5;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 400;
  letter-spacing: 4px;
  margin: 0 0 1rem;
  line-height: 1.3;
  text-shadow: 0 0 20px rgba(201, 169, 110, 0.3);
}
.rec-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #e74c3c;
  font-size: 0.8rem;
  letter-spacing: 2px;
  margin-top: 1rem;
}
.rec-dot {
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  animation: rec-blink 1s step-end infinite;
}
@keyframes rec-blink {
  50% { opacity: 0; }
}
.film-grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ========== 倒计时场景 ========== */
.countdown-scene {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: #0a0a0a;
  animation: fade-in 0.3s ease;
}
.countdown-circle {
  width: 120px;
  height: 120px;
  border: 3px solid #c9a96e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-circle 1s ease-in-out infinite;
}
@keyframes pulse-circle {
  0%, 100% { transform: scale(1); border-color: #c9a96e; }
  50% { transform: scale(1.05); border-color: #e74c3c; }
}
.countdown-num {
  color: #faf8f5;
  font-size: 3rem;
  font-weight: 300;
}
.countdown-hint {
  color: #8b7355;
  font-size: 1rem;
  letter-spacing: 3px;
}

/* ========== 跳过按钮 ========== */
.skip-btn {
  position: absolute;
  bottom: 3rem;
  right: 2rem;
  padding: 0.5rem 1.2rem;
  background: rgba(250, 248, 245, 0.1);
  border: 1px solid rgba(250, 248, 245, 0.25);
  color: #faf8f5;
  font-size: 0.85rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  border-radius: 2px;
  z-index: 10;
}
.skip-btn:hover {
  background: rgba(250, 248, 245, 0.25);
}

/* ========== 进度条 ========== */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
}
.progress-fill {
  height: 100%;
  background: #c9a96e;
  transition: width 0.1s linear;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
