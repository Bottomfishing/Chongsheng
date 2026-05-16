<template>
  <div class="home-flow">
    <Transition name="fade">
      <section v-if="stage === 'landing'" class="landing-page">
        <div class="paper-bg" />
        <div class="grain-overlay" />

        <div class="frame-corner tl" />
        <div class="frame-corner tr" />
        <div class="frame-corner bl" />
        <div class="frame-corner br" />

        <div class="content">
          <div class="stamp">
            <div class="stamp-circle">
              <span class="stamp-text">重生认证</span>
            </div>
          </div>

          <div class="title-area">
            <div class="deco-line top">
              <span class="ornament">&#10022;</span>
            </div>
            <h1 class="main-title">
              <span class="title-line">重生之</span>
              <span class="title-line accent">回到九十年代</span>
              <span class="title-line">玩抖音</span>
            </h1>
            <div class="deco-line bottom">
              <span class="ornament">&#10022;</span>
            </div>
          </div>

          <p class="tagline">"如果九十年代的你，突然拥有了抖音......"</p>

          <div class="desc-box">
            <p class="typewriter">
              {{ displayedText }}<span v-if="showCursor" class="cursor">|</span>
            </p>
          </div>

          <div class="action-area">
            <button class="start-btn" type="button" :disabled="!typewriterDone" @click="enterIntro">
              <span class="btn-border">
                <span class="btn-inner">
                  <span class="btn-icon">&#9654;</span>
                  <span>{{ typewriterDone ? "开始重生" : "系统加载中..." }}</span>
                </span>
              </span>
            </button>
          </div>

          <div class="bottom-menu">
            <button class="menu-link" type="button" @click="resumeGame">
              <span class="link-dot" />
              读取存档
            </button>
            <span class="link-sep">&#10022;</span>
            <button class="menu-link" type="button" @click="showAbout = true">
              <span class="link-dot" />
              关于重生
            </button>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="showAbout" class="modal-overlay" @click.self="showAbout = false">
            <div class="modal-panel">
              <div class="modal-header">
                <h3>关于重生</h3>
                <button class="modal-close" type="button" @click="showAbout = false">&times;</button>
              </div>
              <div class="modal-body">
                <p>这是一段荒诞又上头的穿越体验。</p>
                <p>你重生回了九十年代，却发现口袋里的手机还能刷抖音。</p>
                <p>在没有流量、没有直播带货、没有短视频平台规则的年代，你准备怎么玩？</p>
                <p>每一个选择，都会把你带向完全不同的命运分支。</p>
              </div>
              <div class="modal-footer">
                <button class="modal-btn" type="button" @click="showAbout = false">知道了</button>
              </div>
            </div>
          </div>
        </Transition>
      </section>
    </Transition>

    <Transition name="fade">
      <section v-if="stage === 'intro'" class="intro-video">
        <div v-if="scene === 'static'" class="tv-static">
          <div class="tv-frame">
            <div class="tv-brand">重生牌</div>
            <div class="tv-screen-bezel">
              <canvas ref="staticCanvas" class="static-canvas" />
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

        <div v-if="scene === 'title'" class="title-scene">
          <div class="vhs-overlay">
            <div class="vhs-line" />
            <div class="vhs-line" />
            <div class="vhs-track">PLAY &#9654; 1995.05.16 00:00:00</div>
          </div>
          <div class="title-content">
            <div class="title-label">本节目由</div>
            <h2 class="intro-main-title">重生之回到九十年代玩抖音</h2>
            <div class="title-label">独家赞助播出</div>
            <div class="rec-badge">
              <span class="rec-dot" />
              <span>REC</span>
            </div>
          </div>
          <div class="film-grain" />
        </div>

        <div v-if="scene === 'countdown'" class="countdown-scene">
          <div class="countdown-circle">
            <span class="countdown-num">{{ countdownNum }}</span>
          </div>
          <p class="countdown-hint">即将进入九十年代...</p>
        </div>

        <Transition name="fade">
          <button v-if="canSkip" class="skip-btn" type="button" @click="enterHome">
            跳过 &#9654;&#9654;
          </button>
        </Transition>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
        </div>
      </section>
    </Transition>

    <Transition name="fade">
      <section v-if="stage === 'home'" class="home-page">
        <div class="paper-bg" />
        <div class="grain-overlay" />

        <div class="frame-corner tl" />
        <div class="frame-corner tr" />
        <div class="frame-corner bl" />
        <div class="frame-corner br" />

        <header class="top-bar">
          <div class="logo">
            <span class="logo-icon">&#10022;</span>
            <span class="logo-text">重生小卖部</span>
          </div>
          <div class="date-display">1995年5月16日</div>
        </header>

        <main class="main-content">
          <div class="welcome-section">
            <h2 class="welcome-title">欢迎回来，重生者</h2>
            <p class="welcome-sub">今天是你在九十年代的第 1 天</p>
          </div>

          <div class="card-grid">
            <button class="feature-card primary" type="button" @click="startGame">
              <div class="card-icon">&#9654;</div>
              <h3 class="card-title">剧情模式</h3>
              <p class="card-desc">继续你的重生之旅，每一次选择都会改写这场九十年代实验。</p>
              <div class="card-status">
                <span class="status-dot active" />
                <span>主线入口：短视频主剧情</span>
              </div>
            </button>

            <button class="feature-card" type="button" @click="showComingSoon('时光相册')">
              <div class="card-icon">&#10022;</div>
              <h3 class="card-title">时光相册</h3>
              <p class="card-desc">记录你在九十年代刷抖音、拍短视频、搅动时代的精彩瞬间。</p>
              <div class="card-tag">即将开放</div>
            </button>

            <button class="feature-card" type="button" @click="showComingSoon('重生商店')">
              <div class="card-icon">&#9733;</div>
              <h3 class="card-title">重生商店</h3>
              <p class="card-desc">用你的选择结果兑换时代 Buff，让下一次重生更离谱一点。</p>
              <div class="card-tag">即将开放</div>
            </button>

            <button class="feature-card" type="button" @click="showComingSoon('成就墙')">
              <div class="card-icon">&#9670;</div>
              <h3 class="card-title">成就墙</h3>
              <p class="card-desc">解锁“村口第一网红”“录像厅顶流”“县城直播先驱”等时代成就。</p>
              <div class="card-tag">即将开放</div>
            </button>
          </div>

          <div class="bottom-info">
            <div class="info-item">
              <span class="info-label">重生积分</span>
              <span class="info-value">0</span>
            </div>
            <div class="info-divider" />
            <div class="info-item">
              <span class="info-label">已解锁结局</span>
              <span class="info-value">0/6</span>
            </div>
            <div class="info-divider" />
            <div class="info-item">
              <span class="info-label">探索度</span>
              <span class="info-value">0%</span>
            </div>
          </div>
        </main>

        <footer class="footer-menu">
          <button class="footer-btn" type="button" @click="resumeGame">
            <span class="btn-label">读取存档</span>
          </button>
          <button class="footer-btn" type="button" @click="backToLanding">
            <span class="btn-label">返回封面</span>
          </button>
          <button class="footer-btn" type="button" @click="showComingSoon('系统设置')">
            <span class="btn-label">系统设置</span>
          </button>
        </footer>

        <Transition name="fade">
          <div v-if="comingSoonVisible" class="toast-overlay" @click.self="comingSoonVisible = false">
            <div class="toast-panel">
              <div class="toast-icon">&#10022;</div>
              <p class="toast-text">“{{ comingSoonName }}”功能还在穿越时空的路上...</p>
              <p class="toast-sub">敬请期待！</p>
              <button class="toast-btn" type="button" @click="comingSoonVisible = false">好的</button>
            </div>
          </div>
        </Transition>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { clearRuntimeState, loadRuntimeState } from "@/engine/storage";

type Stage = "landing" | "intro" | "home";
type IntroScene = "static" | "title" | "countdown";

const router = useRouter();

const stage = ref<Stage>("landing");
const scene = ref<IntroScene>("static");
const showAbout = ref(false);
const comingSoonVisible = ref(false);
const comingSoonName = ref("");

const fullText =
  "你睁开眼，发现自己躺在一张硬板床上。窗外传来自行车铃声，墙上的日历赫然写着：1995年。你下意识摸向口袋，手机竟然还在，而且......抖音居然能打开？！";
const displayedText = ref("");
const showCursor = ref(true);
const typewriterDone = ref(false);

const progress = ref(0);
const canSkip = ref(false);
const countdownNum = ref(3);
const staticCanvas = ref<HTMLCanvasElement | null>(null);

let typewriterInterval: ReturnType<typeof setInterval> | null = null;
let introStaticInterval: ReturnType<typeof setInterval> | null = null;
let introProgressInterval: ReturnType<typeof setInterval> | null = null;
let introTimers: Array<ReturnType<typeof setTimeout>> = [];

const TOTAL_DURATION = 8000;
const SKIP_TIME = 2000;

onMounted(() => {
  startTypewriter();
});

onBeforeUnmount(() => {
  clearTypewriter();
  clearIntroSequence();
});

function startTypewriter() {
  let index = 0;
  typewriterInterval = setInterval(() => {
    if (index < fullText.length) {
      displayedText.value += fullText[index];
      index += 1;
      return;
    }

    clearTypewriter();
    typewriterDone.value = true;
    window.setTimeout(() => {
      showCursor.value = false;
    }, 3000);
  }, 40);
}

function clearTypewriter() {
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  }
}

async function enterIntro() {
  stage.value = "intro";
  scene.value = "static";
  await nextTick();
  startIntroSequence();
}

function startIntroSequence() {
  clearIntroSequence();
  progress.value = 0;
  canSkip.value = false;
  countdownNum.value = 3;

  startStaticNoise();

  const startedAt = Date.now();
  introProgressInterval = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    progress.value = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

    if (elapsed >= SKIP_TIME) {
      canSkip.value = true;
    }

    if (scene.value === "countdown") {
      const remaining = Math.ceil((TOTAL_DURATION - elapsed) / 1000);
      countdownNum.value = Math.max(remaining, 1);
    }

    if (elapsed >= TOTAL_DURATION) {
      enterHome();
    }
  }, 100);

  introTimers = [
    window.setTimeout(() => {
      scene.value = "title";
    }, 2500),
    window.setTimeout(() => {
      scene.value = "countdown";
    }, 5500),
  ];
}

function clearIntroSequence() {
  if (introStaticInterval) {
    clearInterval(introStaticInterval);
    introStaticInterval = null;
  }

  if (introProgressInterval) {
    clearInterval(introProgressInterval);
    introProgressInterval = null;
  }

  introTimers.forEach((timer) => clearTimeout(timer));
  introTimers = [];
}

function startStaticNoise() {
  const canvas = staticCanvas.value;
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  canvas.width = 320;
  canvas.height = 240;

  introStaticInterval = setInterval(() => {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, 50);
}

function enterHome() {
  clearIntroSequence();
  stage.value = "home";
}

function startGame() {
  router.push("/play");
}

function resumeGame() {
  const savedState = loadRuntimeState();
  router.push(savedState?.nodeId ? "/play?resume=1" : "/play");
}

function backToLanding() {
  clearIntroSequence();
  stage.value = "landing";
}

function showComingSoon(name: string) {
  comingSoonName.value = name;
  comingSoonVisible.value = true;
}

function resetRuntimeAndStart() {
  clearRuntimeState();
  router.push("/play?restart=1");
}

defineExpose({
  resetRuntimeAndStart,
});
</script>

<style scoped>
.home-flow {
  width: 100%;
  min-height: 100vh;
  font-family: "Georgia", "Times New Roman", "Noto Serif SC", "Songti SC", "SimSun", serif;
}

.landing-page,
.intro-video,
.home-page {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.landing-page {
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf8f5;
}

.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(139, 69, 19, 0.04) 0%, transparent 50%),
    #faf8f5;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid #c9a96e;
}

.frame-corner.tl {
  top: 24px;
  left: 24px;
  border-right: none;
  border-bottom: none;
}

.frame-corner.tr {
  top: 24px;
  right: 24px;
  border-left: none;
  border-bottom: none;
}

.frame-corner.bl {
  bottom: 24px;
  left: 24px;
  border-right: none;
  border-top: none;
}

.frame-corner.br {
  bottom: 24px;
  right: 24px;
  border-left: none;
  border-top: none;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  max-width: 640px;
  padding: 2rem 2rem 5rem;
  text-align: center;
}

.stamp {
  margin-bottom: 0.5rem;
}

.stamp-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 3px double #c9a96e;
  border-radius: 50%;
  transform: rotate(-12deg);
  opacity: 0.7;
}

.stamp-text {
  color: #c9a96e;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.deco-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.deco-line::before,
.deco-line::after {
  content: "";
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a96e, transparent);
}

.ornament {
  color: #c9a96e;
  font-size: 1.2rem;
}

.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.title-line {
  color: #3d2914;
  font-size: clamp(1.5rem, 4vw, 2.8rem);
  font-weight: 400;
  letter-spacing: 6px;
  line-height: 1.3;
}

.title-line.accent {
  color: #8b4513;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  letter-spacing: 8px;
}

.tagline {
  margin: 0;
  color: #8b7355;
  font-size: 1rem;
  font-style: italic;
  letter-spacing: 2px;
}

.desc-box {
  max-width: 500px;
  min-height: 80px;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 4px;
}

.typewriter {
  margin: 0;
  color: #5c4033;
  font-size: 0.95rem;
  line-height: 1.8;
  text-align: left;
}

.cursor {
  color: #8b4513;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.action-area {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.start-btn {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.start-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-border {
  display: inline-block;
  padding: 3px;
  border: 1px solid #c9a96e;
}

.btn-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 2.5rem;
  color: #faf8f5;
  font-size: 1rem;
  letter-spacing: 4px;
  background: #3d2914;
  transition: all 0.3s ease;
}

.start-btn:hover:not(:disabled) .btn-inner {
  background: #5c4033;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 41, 20, 0.3);
}

.btn-icon {
  font-size: 0.8rem;
}

.bottom-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #8b7355;
  font-size: 0.85rem;
  letter-spacing: 1px;
  background: none;
  border: none;
  transition: color 0.3s;
}

.menu-link:hover {
  color: #3d2914;
}

.link-dot {
  width: 5px;
  height: 5px;
  background: currentColor;
  border-radius: 50%;
}

.link-sep {
  color: #c9a96e;
  font-size: 0.7rem;
  opacity: 0.6;
}

.modal-overlay,
.toast-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  background: rgba(250, 248, 245, 0.85);
  backdrop-filter: blur(4px);
}

.modal-panel,
.toast-panel {
  width: 90%;
  background: #faf8f5;
  border: 1px solid #c9a96e;
  box-shadow: 0 8px 32px rgba(61, 41, 20, 0.15);
}

.modal-panel {
  max-width: 420px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
}

.modal-header h3 {
  margin: 0;
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 2px;
}

.modal-close {
  color: #8b7355;
  font-size: 1.5rem;
  line-height: 1;
  background: none;
  border: none;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 0.75rem;
  color: #5c4033;
  font-size: 0.9rem;
  line-height: 1.8;
}

.modal-body p:last-child {
  margin-bottom: 0;
}

.modal-footer {
  padding: 1rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(201, 169, 110, 0.3);
}

.modal-btn,
.toast-btn {
  padding: 0.6rem 2rem;
  color: #faf8f5;
  font-size: 0.9rem;
  letter-spacing: 2px;
  background: #3d2914;
  border: none;
  transition: background 0.3s;
}

.modal-btn:hover,
.toast-btn:hover {
  background: #5c4033;
}

.intro-video {
  z-index: 25;
  background: #0a0a0a;
}

.tv-static,
.title-scene,
.countdown-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tv-static,
.countdown-scene {
  flex-direction: column;
  gap: 1.5rem;
}

.static-canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.tv-frame {
  position: relative;
  padding: 20px 20px 30px;
  background: #8b7355;
  border-radius: 12px;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 10px 40px rgba(0, 0, 0, 0.5);
}

.tv-brand {
  position: absolute;
  bottom: 6px;
  left: 50%;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.6rem;
  letter-spacing: 4px;
  transform: translateX(-50%);
}

.tv-screen-bezel {
  position: relative;
  width: 320px;
  height: 240px;
  overflow: hidden;
  background: #1a1a1a;
  border-radius: 40px / 20px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.scanlines {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
}

.screen-glow {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
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
  background: #6b5a45;
  border: 2px solid #5a4a35;
  border-radius: 50%;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
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
  50% {
    opacity: 0.3;
  }
}

.title-scene {
  background: #0a0a0a;
}

.vhs-overlay {
  position: absolute;
  top: 2rem;
  right: 2rem;
  left: 2rem;
}

.vhs-line {
  height: 1px;
  margin-bottom: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.vhs-track {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
  letter-spacing: 1px;
  font-family: monospace;
}

.title-content {
  text-align: center;
}

.title-label {
  margin-bottom: 1rem;
  color: #c9a96e;
  font-size: 0.9rem;
  letter-spacing: 6px;
}

.intro-main-title {
  margin: 0 0 1rem;
  color: #faf8f5;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 400;
  letter-spacing: 4px;
  line-height: 1.3;
  font-family: "Georgia", "Times New Roman", "Noto Serif SC", "Songti SC", "SimSun", serif;
  text-shadow: 0 0 20px rgba(201, 169, 110, 0.3);
}

.rec-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  color: #e74c3c;
  font-size: 0.8rem;
  letter-spacing: 2px;
}

.rec-dot {
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  animation: rec-blink 1s step-end infinite;
}

@keyframes rec-blink {
  50% {
    opacity: 0;
  }
}

.film-grain {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E");
}

.countdown-scene {
  gap: 2rem;
  background: #0a0a0a;
}

.countdown-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 3px solid #c9a96e;
  border-radius: 50%;
  animation: pulse-circle 1s ease-in-out infinite;
}

@keyframes pulse-circle {
  0%,
  100% {
    transform: scale(1);
    border-color: #c9a96e;
  }

  50% {
    transform: scale(1.05);
    border-color: #e74c3c;
  }
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

.skip-btn {
  position: absolute;
  right: 2rem;
  bottom: 3rem;
  z-index: 10;
  padding: 0.5rem 1.2rem;
  color: #faf8f5;
  font-size: 0.85rem;
  letter-spacing: 1px;
  background: rgba(250, 248, 245, 0.1);
  border: 1px solid rgba(250, 248, 245, 0.25);
  border-radius: 2px;
}

.skip-btn:hover {
  background: rgba(250, 248, 245, 0.25);
}

.progress-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: #c9a96e;
  transition: width 0.1s linear;
}

.home-page {
  z-index: 20;
  display: flex;
  flex-direction: column;
  background: #faf8f5;
}

.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  color: #c9a96e;
  font-size: 1rem;
}

.logo-text {
  color: #3d2914;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 3px;
}

.date-display {
  color: #8b7355;
  font-size: 0.85rem;
  letter-spacing: 1px;
  font-family: monospace;
}

.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  overflow-y: auto;
}

.welcome-section {
  text-align: center;
}

.welcome-title {
  margin: 0 0 0.5rem;
  color: #3d2914;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 4px;
}

.welcome-sub {
  margin: 0;
  color: #8b7355;
  font-size: 0.9rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 700px;
}

.feature-card {
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #c9a96e;
  box-shadow: 0 8px 24px rgba(61, 41, 20, 0.1);
}

.feature-card.primary {
  background: rgba(201, 169, 110, 0.08);
  border-color: #c9a96e;
}

.feature-card.primary:hover {
  background: rgba(201, 169, 110, 0.15);
}

.card-icon {
  margin-bottom: 0.75rem;
  color: #c9a96e;
  font-size: 1.5rem;
}

.feature-card.primary .card-icon {
  color: #8b4513;
  font-size: 1.8rem;
}

.card-title {
  margin: 0 0 0.5rem;
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 2px;
}

.card-desc {
  margin: 0 0 0.75rem;
  color: #8b7355;
  font-size: 0.8rem;
  line-height: 1.6;
}

.card-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #5c4033;
  font-size: 0.75rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #c9a96e;
  border-radius: 50%;
}

.status-dot.active {
  background: #2e8b57;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.card-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  color: #8b7355;
  font-size: 0.7rem;
  letter-spacing: 1px;
  background: rgba(139, 115, 85, 0.1);
  border-radius: 2px;
}

.bottom-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  border-top: 1px solid rgba(201, 169, 110, 0.2);
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.info-label {
  color: #8b7355;
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.info-value {
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 500;
}

.info-divider {
  width: 1px;
  height: 30px;
  background: rgba(201, 169, 110, 0.3);
}

.footer-menu {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(201, 169, 110, 0.3);
}

.footer-btn {
  flex: 1;
  padding: 1rem;
  color: #8b7355;
  font-size: 0.85rem;
  letter-spacing: 2px;
  background: none;
  border: none;
  border-right: 1px solid rgba(201, 169, 110, 0.2);
  transition: all 0.3s;
}

.footer-btn:last-child {
  border-right: none;
}

.footer-btn:hover {
  color: #3d2914;
  background: rgba(201, 169, 110, 0.08);
}

.toast-overlay {
  background: rgba(250, 248, 245, 0.7);
}

.toast-panel {
  max-width: 340px;
  padding: 2rem;
  text-align: center;
}

.toast-icon {
  margin-bottom: 1rem;
  color: #c9a96e;
  font-size: 2rem;
}

.toast-text {
  margin: 0 0 0.5rem;
  color: #3d2914;
  font-size: 0.95rem;
  line-height: 1.6;
}

.toast-sub {
  margin: 0 0 1.5rem;
  color: #8b7355;
  font-size: 0.85rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .bottom-info {
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .info-value {
    font-size: 0.9rem;
  }
}
</style>
