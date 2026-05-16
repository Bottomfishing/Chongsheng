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
            <button
              class="start-btn"
              type="button"
              :disabled="!typewriterDone"
              @click="enterIntro"
            >
              <span class="btn-border">
                <span class="btn-inner">
                  <span class="btn-icon">&#9654;</span>
                  <span>{{
                    typewriterDone ? "开始重生" : "系统加载中..."
                  }}</span>
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
          <div
            v-if="showAbout"
            class="modal-overlay"
            @click.self="showAbout = false"
          >
            <div class="modal-panel">
              <div class="modal-header">
                <h3>关于重生</h3>
                <button
                  class="modal-close"
                  type="button"
                  @click="showAbout = false"
                >
                  &times;
                </button>
              </div>
              <div class="modal-body">
                <p>这是一段荒诞又上头的穿越体验。</p>
                <p>你重生回了九十年代，却发现口袋里的手机还能刷抖音。</p>
                <p>
                  在没有流量、没有直播带货、没有短视频平台规则的年代，你准备怎么玩？
                </p>
                <p>每一个选择，都会把你带向完全不同的命运分支。</p>
              </div>
              <div class="modal-footer">
                <button
                  class="modal-btn"
                  type="button"
                  @click="showAbout = false"
                >
                  知道了
                </button>
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
            <div class="tv-antennas">
              <div class="antenna left">
                <div class="antenna-base" />
                <div class="antenna-rod" />
                <div class="antenna-coil" />
              </div>
              <div class="antenna right">
                <div class="antenna-base" />
                <div class="antenna-rod" />
                <div class="antenna-coil" />
              </div>
            </div>
            <div class="tv-brand">重生牌</div>
            <div class="tv-screen-bezel">
              <canvas ref="staticCanvas" class="static-canvas" />
              <div class="scanlines" />
              <div class="screen-glow" />
              <div class="screen-reflection" />
            </div>
            <div class="tv-controls">
              <div class="knob">
                <div class="knob-indicator" />
              </div>
              <div class="knob">
                <div class="knob-indicator" />
              </div>
              <div class="speaker-grill">
                <span v-for="n in 6" :key="n" class="grill-line" />
              </div>
            </div>
            <div class="tv-feet">
              <div class="foot left" />
              <div class="foot right" />
            </div>
          </div>
          <div class="status-text">信号接入中...</div>
          <div class="signal-indicator">
            <span
              v-for="n in 5"
              :key="n"
              class="signal-bar"
              :class="{ active: n <= signalStrength }"
            />
          </div>
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
          <button
            v-if="canSkip"
            class="skip-btn"
            type="button"
            @click="enterHome"
          >
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
            <span class="logo-text">重生者手册</span>
          </div>
          <div class="date-display">1995年5月16日</div>
        </header>

        <main class="main-content">
          <div class="hub-container">
            <header class="welcome-section">
              <p class="welcome-kicker">1995 · 重生档案已同步</p>
              <h2 class="welcome-title">欢迎回来，重生者</h2>
              <p class="welcome-sub">今天是你在九十年代的第 1 天</p>
            </header>

            <section class="hub-section" aria-label="功能入口">
              <div class="section-head">
                <span class="section-line" />
                <h3 class="section-label">功能入口</h3>
                <span class="section-line" />
              </div>

              <div class="card-grid">
            <button
              class="feature-card primary"
              type="button"
              @click="startGame"
            >
              <div class="primary-icon-wrap">
                <span class="card-icon">&#9654;</span>
              </div>
              <div class="primary-body">
                <div class="primary-head">
                  <h3 class="card-title">剧情模式</h3>
                  <span class="status-badge">
                    <span class="status-dot active" />
                    可游玩
                  </span>
                </div>
                <p class="card-desc">
                  继续你的重生之旅，每一次选择都会改写这场九十年代实验。
                </p>
                <p class="card-hint">主线入口 · 短视频主剧情</p>
              </div>
              <span class="primary-arrow" aria-hidden="true">&#8250;</span>
            </button>

            <button
              class="feature-card card-soul"
              type="button"
              @click="goSoulTalk"
            >
              <div class="card-icon-wrap">
                <span class="card-icon">&#9825;</span>
              </div>
              <h3 class="card-title">心灵倾述</h3>
              <p class="card-desc">
                与牛天真、李天佐、费启暗、阿宁四位伙伴倾诉，每位性格迥异。
              </p>
              <div class="card-tag card-tag-live">进入倾诉</div>
            </button>

            <button
              class="feature-card card-album"
              type="button"
              @click="showComingSoon('时光相册')"
            >
              <div class="card-icon-wrap">
                <span class="card-icon">&#10022;</span>
              </div>
              <h3 class="card-title">时光相册</h3>
              <p class="card-desc">
                记录你在九十年代刷抖音、拍短视频、搅动时代的精彩瞬间。
              </p>
              <div class="card-tag">即将开放</div>
            </button>

            <button
              class="feature-card card-achievement"
              type="button"
              @click="showComingSoon('成就墙')"
            >
              <div class="card-icon-wrap">
                <span class="card-icon">&#9670;</span>
              </div>
              <h3 class="card-title">成就墙</h3>
              <p class="card-desc">
                解锁“村口第一网红”“录像厅顶流”“县城直播先驱”等时代成就。
              </p>
              <div class="card-tag">即将开放</div>
            </button>
              </div>
            </section>

            <section class="bottom-info" aria-label="重生数据">
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
            </section>
          </div>
        </main>

        <footer class="footer-menu">
          <button class="footer-btn" type="button" @click="resumeGame">
            <span class="btn-label">读取存档</span>
          </button>
          <button class="footer-btn" type="button" @click="backToLanding">
            <span class="btn-label">返回封面</span>
          </button>
          <button
            class="footer-btn"
            type="button"
            @click="showComingSoon('系统设置')"
          >
            <span class="btn-label">系统设置</span>
          </button>
        </footer>

        <Transition name="fade">
          <div
            v-if="comingSoonVisible"
            class="toast-overlay"
            @click.self="comingSoonVisible = false"
          >
            <div class="toast-panel">
              <div class="toast-icon">&#10022;</div>
              <p class="toast-text">
                “{{ comingSoonName }}”功能还在穿越时空的路上...
              </p>
              <p class="toast-sub">敬请期待！</p>
              <button
                class="toast-btn"
                type="button"
                @click="comingSoonVisible = false"
              >
                好的
              </button>
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
const signalStrength = ref(2);

let signalInterval: ReturnType<typeof setInterval> | null = null;

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
  signalStrength.value = 2;

  startStaticNoise();

  signalInterval = setInterval(() => {
    signalStrength.value = Math.floor(Math.random() * 5) + 1;
  }, 300);

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

  if (signalInterval) {
    clearInterval(signalInterval);
    signalInterval = null;
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

function goSoulTalk() {
  router.push("/soul-talk");
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
  font-family:
    "Georgia", "Times New Roman", "Noto Serif SC", "Songti SC", "SimSun", serif;
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
    radial-gradient(
      ellipse at 20% 50%,
      rgba(201, 169, 110, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 20%,
      rgba(201, 169, 110, 0.06) 0%,
      transparent 40%
    ),
    radial-gradient(
      ellipse at 50% 80%,
      rgba(139, 69, 19, 0.04) 0%,
      transparent 50%
    ),
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
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}

.frame-corner.tr {
  top: 8px;
  right: 8px;
  border-left: none;
  border-bottom: none;
}

.frame-corner.bl {
  bottom: 8px;
  left: 8px;
  border-right: none;
  border-top: none;
}

.frame-corner.br {
  bottom: 8px;
  right: 8px;
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
  gap: 1rem;
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
  background: linear-gradient(180deg, #9a8368 0%, #8b7355 50%, #7a634a 100%);
  border-radius: 12px;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.tv-brand {
  position: absolute;
  bottom: 6px;
  left: 50%;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.6rem;
  letter-spacing: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%);
}

.tv-antennas {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
}

.antenna {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.antenna.left {
  transform: rotate(-20deg) translateX(-4px);
  animation: antenna-wave 2s ease-in-out infinite;
}

.antenna.right {
  transform: rotate(20deg) translateX(4px);
  animation: antenna-wave-right 2s ease-in-out infinite;
}

@keyframes antenna-wave {
  0%,
  100% {
    transform: rotate(-20deg) translateX(-4px);
  }
  50% {
    transform: rotate(-16deg) translateX(-4px);
  }
}

@keyframes antenna-wave-right {
  0%,
  100% {
    transform: rotate(20deg) translateX(4px);
  }
  50% {
    transform: rotate(16deg) translateX(4px);
  }
}

.antenna-base {
  width: 16px;
  height: 12px;
  background: linear-gradient(180deg, #8b7355 0%, #6b5a45 50%, #5a4a35 100%);
  border-radius: 2px 2px 4px 4px;
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3);
  margin-top: -2px;
}

.antenna-rod {
  width: 3px;
  height: 40px;
  background: linear-gradient(
    180deg,
    #d4c4a8 0%,
    #c9a96e 30%,
    #8b7355 70%,
    #6b5a45 100%
  );
  border-radius: 2px 2px 0 0;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.2);
}

.antenna-coil {
  position: absolute;
  top: 15px;
  width: 10px;
  height: 10px;
  border: 2px solid #c9a96e;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
}

.tv-feet {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 100px;
}

.foot {
  width: 40px;
  height: 14px;
  background: linear-gradient(180deg, #7a634a 0%, #5a4a35 100%);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.screen-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 100%
  );
  pointer-events: none;
  border-radius: 40px / 20px;
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
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
}

.tv-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 12px;
}

.knob {
  position: relative;
  width: 22px;
  height: 22px;
  background: linear-gradient(180deg, #7a634a 0%, #5a4a35 50%, #4a3728 100%);
  border: 2px solid #3d2914;
  border-radius: 50%;
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.3),
    inset 0 -2px 3px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.4);
}

.knob-indicator {
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: #c9a96e;
  border-radius: 1px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
  text-shadow: 0 0 10px rgba(201, 169, 110, 0.3);
}

.signal-indicator {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.signal-bar {
  width: 6px;
  height: 4px;
  background: rgba(201, 169, 110, 0.3);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.signal-bar.active {
  background: linear-gradient(180deg, #c9a96e 0%, #8b7355 100%);
  box-shadow: 0 0 6px rgba(201, 169, 110, 0.5);
}

.signal-bar:nth-child(1) {
  height: 6px;
}
.signal-bar:nth-child(2) {
  height: 10px;
}
.signal-bar:nth-child(3) {
  height: 14px;
}
.signal-bar:nth-child(4) {
  height: 18px;
}
.signal-bar:nth-child(5) {
  height: 22px;
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
  font-family:
    "Georgia", "Times New Roman", "Noto Serif SC", "Songti SC", "SimSun", serif;
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
  --hub-pad-x: clamp(4.5rem, 7vw, 5.5rem);
}

.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem var(--hub-pad-x);
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
  justify-content: center;
  padding: 1.25rem var(--hub-pad-x) 1.5rem;
  overflow-y: auto;
}

.hub-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
}

.welcome-section {
  text-align: center;
}

.welcome-kicker {
  margin: 0 0 0.5rem;
  color: #b8924a;
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.welcome-title {
  margin: 0 0 0.35rem;
  color: #3d2914;
  font-size: clamp(1.35rem, 3vw, 1.65rem);
  font-weight: 400;
  letter-spacing: 0.22em;
}

.welcome-sub {
  margin: 0;
  color: #8b7355;
  font-size: 0.88rem;
  letter-spacing: 0.06em;
}

.hub-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.55), transparent);
}

.section-label {
  margin: 0;
  color: #8b7355;
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.35em;
  white-space: nowrap;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  width: 100%;
}

.feature-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 168px;
  padding: 1.1rem 0.9rem 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(61, 41, 20, 0.04);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #c9a96e;
  box-shadow: 0 8px 24px rgba(61, 41, 20, 0.1);
}

.feature-card:not(.primary) {
  overflow: visible;
  padding: 3.2rem 2rem 2.6rem;
  background: transparent url(/images/border-frame.png) center / 145% auto no-repeat;
  border: none;
  border-radius: 0;
  box-shadow: none;
  min-height: 240px;
}

.feature-card:not(.primary):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(61, 41, 20, 0.1);
}

.feature-card.primary {
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  min-height: auto;
  padding: 1.1rem 1.25rem;
  text-align: left;
  background: linear-gradient(
    120deg,
    rgba(201, 169, 110, 0.18) 0%,
    rgba(255, 252, 247, 0.96) 55%
  );
  border-color: rgba(201, 169, 110, 0.75);
  box-shadow: 0 4px 20px rgba(61, 41, 20, 0.07);
}

.feature-card.primary:hover {
  background: linear-gradient(
    120deg,
    rgba(201, 169, 110, 0.26) 0%,
    rgba(255, 252, 247, 1) 55%
  );
  box-shadow: 0 8px 28px rgba(61, 41, 20, 0.1);
}

.primary-icon-wrap {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(201, 169, 110, 0.55);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.5);
}

.primary-body {
  flex: 1;
  min-width: 0;
}

.primary-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-bottom: 0.35rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.55rem;
  color: #4a7c59;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  background: rgba(46, 139, 87, 0.1);
  border: 1px solid rgba(46, 139, 87, 0.22);
  border-radius: 999px;
}

.feature-card.primary .card-desc {
  margin-bottom: 0.35rem;
}

.card-hint {
  margin: 0;
  color: #a08060;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.primary-arrow {
  flex-shrink: 0;
  color: #c9a96e;
  font-size: 2rem;
  line-height: 1;
  opacity: 0.7;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.feature-card.primary:hover .primary-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.card-icon-wrap {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 0.55rem;
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}

.card-icon-wrap .card-icon {
  margin-bottom: 0;
  font-size: 1.25rem;
}

.card-soul {
  background: linear-gradient(
    180deg,
    rgba(255, 248, 245, 0.95) 0%,
    rgba(255, 255, 255, 0.75) 100%
  );
}

.card-soul .card-icon {
  color: #a86b5a;
}

.card-album .card-icon {
  color: #b8924a;
}

.card-achievement .card-icon {
  color: #7a8b5a;
}

.card-icon {
  margin-bottom: 0;
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
  flex: 1;
  margin: 0 0 0.65rem;
  color: #8b7355;
  font-size: 0.78rem;
  line-height: 1.55;
}

.feature-card:not(.primary) .card-desc {
  min-height: 2.4em;
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
  margin-top: auto;
  display: inline-block;
  padding: 0.22rem 0.65rem;
  color: #8b7355;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  background: rgba(139, 115, 85, 0.08);
  border: 1px solid rgba(139, 115, 85, 0.15);
  border-radius: 999px;
}

.card-tag-live {
  color: #4a7c59;
  background: rgba(46, 139, 87, 0.1);
  border-color: rgba(46, 139, 87, 0.22);
}

.bottom-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(201, 169, 110, 0.22);
  border-radius: 8px;
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
  display: none;
}

.footer-menu {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  max-width: 100%;
  margin: 0;
  padding-inline: var(--hub-pad-x);
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

@media (max-width: 720px) {
  .home-page {
    --hub-pad-x: 1.25rem;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .feature-card:not(.primary) {
    min-height: auto;
  }

  .feature-card.primary {
    flex-wrap: wrap;
    text-align: left;
  }

  .primary-arrow {
    display: none;
  }

  .bottom-info {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .info-item {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 0.35rem 0;
    border-bottom: 1px solid rgba(201, 169, 110, 0.12);
  }

  .info-item:last-child {
    border-bottom: none;
  }
}

@media (max-width: 600px) {
  .welcome-title {
    letter-spacing: 0.12em;
  }

  .info-value {
    font-size: 0.95rem;
  }
}
</style>
