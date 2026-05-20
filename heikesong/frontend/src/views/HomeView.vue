<template>
  <div class="home-flow" :class="{ 'page-shaking': pageShaking }">
    <Transition name="fade">
      <section v-if="stage === 'landing'" class="landing-page">
        <div class="paper-bg" />
        <div class="grain-overlay" />

        <!-- 浮动粒子背景 -->
        <div class="particle-layer">
          <div v-for="n in 20" :key="n" class="particle" :class="`p-${n}`" />
        </div>

        <!-- 鼠标跟随光斑 -->
        <div
          class="cursor-glow"
          :style="{
            left: `${cursorX}px`,
            top: `${cursorY}px`,
          }"
        />

        <div class="frame-corner tl" />
        <div class="frame-corner tr" />
        <div class="frame-corner bl" />
        <div class="frame-corner br" />

        <div class="content">
          <div class="stamp enter-anim" style="--delay: 0.1s">
            <div class="stamp-circle">
              <span class="stamp-text">顶流企划</span>
            </div>
          </div>

          <p class="landing-kicker enter-anim" style="--delay: 0.18s">
            1995 · 重生企划
          </p>

          <div class="title-area enter-anim" style="--delay: 0.25s">
            <div class="deco-line top">
              <span class="ornament">&#10022;</span>
            </div>
            <h1 class="main-title">
              <span class="title-line">重生之我在</span>
              <span class="title-line accent">抖音当顶流</span>
            </h1>
            <div class="deco-line bottom">
              <span class="ornament">&#10022;</span>
            </div>
          </div>

          <p class="tagline enter-anim" style="--delay: 0.45s">
            1995 · 复古霓虹 × 短视频穿越 · 轻恋爱 + 事业养成
          </p>

          <div class="desc-card enter-anim" style="--delay: 0.6s">
            <p class="desc-text typewriter-desc">
              {{ descDisplayed
              }}<span v-if="descCursorVisible" class="type-cursor">|</span>
            </p>
          </div>

          <div class="action-area enter-anim" style="--delay: 0.8s">
            <button
              ref="startBtn"
              class="start-btn glow-btn"
              type="button"
              @mousemove="handleStartBtnMove"
              @mouseleave="handleStartBtnLeave"
              @click="enterHome"
            >
              <span class="btn-border">
                <span class="btn-inner">
                  <span class="btn-icon">&#9654;</span>
                  <span>开启重生企划</span>
                </span>
              </span>
            </button>
          </div>

          <div class="bottom-menu enter-anim" style="--delay: 0.95s">
            <button class="menu-item" type="button" @click="resumeGame">
              &#8226; 读取存档
            </button>
            <span class="menu-sep">&#183;</span>
            <button class="menu-item" type="button" @click="showAbout = true">
              &#8226; 关于重生
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
      <section v-if="stage === 'home'" class="home-page">
        <div class="paper-bg" />
        <div class="grain-overlay" />
        <HomeAmbience v-if="appSettings.ambience" />

        <div class="frame-corner tl" />
        <div class="frame-corner tr" />
        <div class="frame-corner bl" />
        <div class="frame-corner br" />

        <header class="top-bar">
          <button
            type="button"
            class="logo"
            title="打开重生者手册"
            aria-label="打开重生者手册"
            @mousedown.prevent
            @click.stop="openRebirthManual"
            @keydown.enter.prevent="openRebirthManual"
            @keydown.space.prevent="openRebirthManual"
          >
            <span class="logo-icon" aria-hidden="true">&#10022;</span>
            <span class="logo-text">重生者手册</span>
            <span class="logo-hint">点击翻阅</span>
          </button>
          <button
            type="button"
            class="date-display"
            title="点击穿越时空"
            aria-label="穿越时空校准"
            @click="openTimeTravel"
          >
            <span class="date-icon" aria-hidden="true">&#9201;</span>
            <span class="date-text">1995年5月16日</span>
          </button>
        </header>

        <main class="main-content">
          <div class="welcome-section home-rise">
            <p class="welcome-kicker">1995 · 重生档案已同步</p>
            <h2 class="welcome-title">
              欢迎回来<span class="title-separator">
                <img
                  src="/images/logo.jpg"
                  alt="logo"
                  class="separator-logo"
                /> </span
              >重生者
            </h2>
            <p class="welcome-sub">今天是你在九十年代的第 1 天</p>
            <div class="welcome-divider" aria-hidden="true">
              <span class="divider-line" />
              <span class="divider-gem">&#10022;</span>
              <span class="divider-line" />
            </div>
          </div>

          <div class="hub-container home-rise home-rise-delay">
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
                  @mousemove="handleCardMove"
                  @mouseleave="handleCardLeave"
                  @click="startGame"
                >
                  <div class="primary-icon-wrap">
                    <video
                      class="primary-icon-video"
                      src="/videos/制作GIF动图.mp4"
                      autoplay
                      loop
                      muted
                      playsinline
                      preload="auto"
                      aria-hidden="true"
                    />
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
                  @mousemove="handleCardMove"
                  @mouseleave="handleCardLeave"
                  @click="goSoulTalk"
                >
                  <div class="card-content">
                    <h3 class="card-title">心灵倾述</h3>
                    <p class="card-desc">
                      与牛天真、李天佐、费启暗、阿宁四位伙伴倾诉，每位性格迥异。
                    </p>
                    <div class="card-tag card-tag-live">进入倾诉</div>
                  </div>
                </button>

                <button
                  class="feature-card card-album"
                  type="button"
                  @mousemove="handleCardMove"
                  @mouseleave="handleCardLeave"
                  @click="goAlbum"
                >
                  <div class="card-content">
                    <h3 class="card-title">时光相册</h3>
                    <p class="card-desc">
                      记录你在九十年代刷抖音、拍短视频、搅动时代的精彩瞬间。
                    </p>
                    <div class="card-tag card-tag-live">查看相册</div>
                  </div>
                </button>

                <button
                  class="feature-card card-achievement"
                  type="button"
                  @mousemove="handleCardMove"
                  @mouseleave="handleCardLeave"
                  @click="goAchievements"
                >
                  <div class="card-content">
                    <h3 class="card-title">成就墙</h3>
                    <p class="card-desc">
                      解锁"村口第一网红""录像厅顶流""县城直播先驱"等时代成就。
                    </p>
                    <div class="card-tag card-tag-live">查看成就</div>
                  </div>
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
                <span class="info-label">已解锁成就</span>
                <span class="info-value"
                  >{{ achievementCountDisplay }}/{{ ACHIEVEMENTS.length }}</span
                >
              </div>
              <div class="info-divider" />
              <div class="info-item">
                <span class="info-label">探索度</span>
                <span class="info-value">0%</span>
              </div>
            </section>
          </div>
        </main>

        <footer ref="footerMenuRef" class="footer-menu">
          <button class="footer-btn" type="button" @click="resumeGame">
            <span class="btn-label">读取存档</span>
          </button>
          <button class="footer-btn" type="button" @click="backToLanding">
            <span class="btn-label">返回封面</span>
          </button>
          <button class="footer-btn" type="button" @click="settingsOpen = true">
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

    <TimeTravelPortal
      v-if="stage === 'home'"
      :open="timeTravelOpen"
      @update:open="timeTravelOpen = $event"
      @shake="onTimeTravelShake"
    />
    <RebirthManualPortal
      :open="manualOpen"
      @update:open="manualOpen = $event"
      @shake="onTimeTravelShake"
    />
    <HomeSettingsPanel
      :open="settingsOpen"
      @update:open="settingsOpen = $event"
      @replay-intro="replayIntroFromSettings"
      @data-cleared="onSettingsDataCleared"
    />

    <!-- 成就解锁提示 -->
    <Transition name="achievement-toast">
      <div
        v-if="showAchievementToast && achievementToast"
        class="achievement-toast"
        @click="dismissAchievementToast"
      >
        <div class="achievement-icon">🏆</div>
        <div class="achievement-body">
          <div class="achievement-label">成就解锁</div>
          <div class="achievement-name">{{ achievementToast.name }}</div>
          <div class="achievement-desc">{{ achievementToast.description }}</div>
        </div>
      </div>
    </Transition>

    <WalkingTikTok
      v-if="isHomePage"
      :ground-offset="footerBarHeight"
      @click="isChatOpen = true"
    />
    <FullscreenToggle />
    <TikTokChatDialog :isOpen="isChatOpen" @close="isChatOpen = false" />
  </div>
</template>

<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import WalkingTikTok from "@/components/WalkingTikTok.vue";
import TikTokChatDialog from "@/components/TikTokChatDialog.vue";
import FullscreenToggle from "@/components/FullscreenToggle.vue";
import TimeTravelPortal from "@/components/home/TimeTravelPortal.vue";
import HomeAmbience from "@/components/home/HomeAmbience.vue";
import RebirthManualPortal from "@/components/home/RebirthManualPortal.vue";
import HomeSettingsPanel from "@/components/home/HomeSettingsPanel.vue";
import { appSettings } from "@/utils/settings";

const route = useRoute();
const isHomePage = computed(() => route.name === "home");
const isChatOpen = ref(false);
const timeTravelOpen = ref(false);
const manualOpen = ref(false);
const settingsOpen = ref(false);
const statsRefreshKey = ref(0);
const footerMenuRef = ref<HTMLElement | null>(null);
const footerBarHeight = ref(52);
let footerResizeObserver: ResizeObserver | null = null;

function syncFooterBarHeight() {
  if (!footerMenuRef.value) {
    return;
  }
  footerBarHeight.value = Math.round(
    footerMenuRef.value.getBoundingClientRect().height,
  );
}

function attachFooterHeightObserver() {
  footerResizeObserver?.disconnect();
  footerResizeObserver = null;
  if (!footerMenuRef.value) {
    return;
  }
  syncFooterBarHeight();
  footerResizeObserver = new ResizeObserver(syncFooterBarHeight);
  footerResizeObserver.observe(footerMenuRef.value);
}

function handleCardMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rx = ((y - cy) / cy) * -6;
  const ry = ((x - cx) / cx) * 6;
  el.style.setProperty("--rx", `${rx}deg`);
  el.style.setProperty("--ry", `${ry}deg`);
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
}

function handleCardLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  if (!el) return;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

function handleStartBtnMove(e: MouseEvent) {
  const el = startBtn.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  el.style.setProperty("--bx", `${x * 0.15}px`);
  el.style.setProperty("--by", `${y * 0.15}px`);
}

function handleStartBtnLeave() {
  const el = startBtn.value;
  if (!el) return;
  el.style.setProperty("--bx", "0px");
  el.style.setProperty("--by", "0px");
}
import { useRouter } from "vue-router";
import { clearRuntimeState, loadRuntimeState } from "@/engine/storage";
import {
  unlockAchievement,
  getAchievement,
  getUnlockedCount,
  ACHIEVEMENTS,
} from "@/utils/achievements";
import type { Achievement } from "@/utils/achievements";

type Stage = "landing" | "intro" | "home";
type IntroScene = "static" | "title" | "video";

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

const descFullText =
  '人物备注：天真（2026短视频操盘手·穿越女主）、费启鸣（未爆火·青涩社恐男主）、天佐（富二代反派）、阿宁（男主前女友）。剧情结构：第一幕"穿越入局·命运初遇"，第二幕"创业之路·暗流涌动"，第三幕"巅峰对决·直播PK定胜负"。';
const descDisplayed = ref("");
const descCursorVisible = ref(true);
let descTypewriterInterval: ReturnType<typeof setInterval> | null = null;

const progress = ref(0);
const canSkip = ref(false);
const staticCanvas = ref<HTMLCanvasElement | null>(null);
const introVideo = ref<HTMLVideoElement | null>(null);
const signalStrength = ref(2);
const startBtn = ref<HTMLButtonElement | null>(null);
const progressLabel = ref("信号接入中");

// 鼠标跟随光斑
const cursorX = ref(-100);
const cursorY = ref(-100);

// 电视破坏效果
const tvBroken = ref(false);
const tvBrokenAnimating = ref(false);

// 页面震动 & 全屏碎裂
const pageShaking = ref(false);
const screenShattered = ref(false);

// 时空扭曲（视频加载前）
const warpActive = ref(false);

// 成就解锁提示
const achievementToast = ref<Achievement | null>(null);
const showAchievementToast = ref(false);

let signalInterval: ReturnType<typeof setInterval> | null = null;

let typewriterInterval: ReturnType<typeof setInterval> | null = null;
let introStaticInterval: ReturnType<typeof setInterval> | null = null;
let introProgressInterval: ReturnType<typeof setInterval> | null = null;
let glitchInterval: ReturnType<typeof setInterval> | null = null;
let introTimers: Array<ReturnType<typeof setTimeout>> = [];

const SKIP_TIME = 2000;

function onMouseMove(e: MouseEvent) {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
}

const INTRO_SEEN_KEY = "chongsheng_intro_seen";

onMounted(() => {
  const seen = localStorage.getItem(INTRO_SEEN_KEY);
  if (seen === "true") {
    stage.value = "home";
    nextTick(attachFooterHeightObserver);
    return;
  }
  startTypewriter();
  window.addEventListener("mousemove", onMouseMove);
  setTimeout(startDescTypewriter, 800);
});

watch(
  () => stage.value,
  (nextStage) => {
    if (nextStage === "home") {
      nextTick(attachFooterHeightObserver);
    } else {
      footerResizeObserver?.disconnect();
      footerResizeObserver = null;
    }
  },
);

onBeforeUnmount(() => {
  clearTypewriter();
  clearDescTypewriter();
  clearIntroSequence();
  window.removeEventListener("mousemove", onMouseMove);
  footerResizeObserver?.disconnect();
  footerResizeObserver = null;
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

function startDescTypewriter() {
  descDisplayed.value = "";
  descCursorVisible.value = true;
  let index = 0;
  descTypewriterInterval = setInterval(() => {
    if (index < descFullText.length) {
      descDisplayed.value += descFullText[index];
      index++;
      return;
    }
    if (descTypewriterInterval) {
      clearInterval(descTypewriterInterval);
      descTypewriterInterval = null;
    }
    setTimeout(() => {
      descCursorVisible.value = false;
    }, 3000);
  }, 45);
}

function clearDescTypewriter() {
  if (descTypewriterInterval) {
    clearInterval(descTypewriterInterval);
    descTypewriterInterval = null;
  }
}

async function enterIntro() {
  clearDescTypewriter();
  stage.value = "intro";
  scene.value = "static";
  await nextTick();
  startIntroSequence();
}

function startIntroSequence() {
  clearIntroSequence();
  progress.value = 0;
  progressLabel.value = "信号接入中";
  canSkip.value = false;
  signalStrength.value = 2;

  startStaticNoise();

  signalInterval = setInterval(() => {
    signalStrength.value = Math.floor(Math.random() * 5) + 1;
  }, 300);

  const startedAt = Date.now();
  introProgressInterval = setInterval(() => {
    const elapsed = Date.now() - startedAt;

    if (elapsed >= SKIP_TIME) {
      canSkip.value = true;
    }

    // 进度条：static + title 阶段按预动画进度，video 阶段交给视频自身
    if (scene.value !== "video") {
      progress.value = Math.min((elapsed / 5500) * 100, 100);
    }
  }, 100);

  introTimers = [
    window.setTimeout(() => {
      scene.value = "title";
    }, 2500),
    window.setTimeout(() => {
      // 时空扭曲效果：页面震动 + 漩涡扭曲，持续 1.2s 后进入视频
      warpActive.value = true;
      triggerPageShake(1200);
    }, 4800),
    window.setTimeout(() => {
      warpActive.value = false;
      screenShattered.value = false;
      scene.value = "video";
      // 进入视频阶段后，进度条开始乱动（信号紊乱 / 时空穿越效果）
      startProgressGlitch();
    }, 5500),
  ];
}

function startProgressGlitch() {
  if (glitchInterval) {
    clearInterval(glitchInterval);
  }

  let glitchBase = 85;
  let tickCount = 0;

  const mildLabels = ["信号波动...", "传输不稳定", "时#空#轻#颤#"];
  const midLabels = ["信$号$衰$减$", "时#空#不#稳#", "信#号#干#扰#"];
  const severeLabels = ["信#号#丢#失#...", "时#间#线#坍#塌#", "连#接#中#断#"];

  // 进度条缓慢下降 + 轻微随机波动，模拟信号逐渐丢失
  glitchInterval = setInterval(() => {
    tickCount++;

    // 基础值稳步下降（3~6 每 tick），但偶尔小幅反弹
    const drop = Math.random() < 0.15 ? -2 : 3 + Math.random() * 4;
    glitchBase = Math.max(0, glitchBase - drop);

    // 显示值围绕 base 波动，幅度 ±8，偶尔闪回
    let display = glitchBase + (Math.random() - 0.5) * 16;
    if (Math.random() < 0.08) {
      display += 18 + Math.random() * 15; // 偶发闪回
    }
    progress.value = Math.max(-5, Math.min(105, display));

    // 文字根据当前 base 值分阶段切换（每 2~3 个 tick 切换一次）
    if (tickCount % (2 + Math.floor(Math.random() * 2)) === 0) {
      if (glitchBase > 55) {
        progressLabel.value =
          mildLabels[Math.floor(Math.random() * mildLabels.length)];
      } else if (glitchBase > 25) {
        progressLabel.value =
          midLabels[Math.floor(Math.random() * midLabels.length)];
      } else {
        progressLabel.value =
          severeLabels[Math.floor(Math.random() * severeLabels.length)];
      }
    }
  }, 400);
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

  if (glitchInterval) {
    clearInterval(glitchInterval);
    glitchInterval = null;
  }

  warpActive.value = false;
  screenShattered.value = false;
  pageShaking.value = false;

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

function onVideoProgress() {
  const video = introVideo.value;
  if (!video || !video.duration) {
    return;
  }

  const remaining = video.duration - video.currentTime;

  // 视频剩最后 0.8 秒时停止乱动、归零，营造"穿越归零"的仪式感
  if (remaining <= 0.8 && glitchInterval) {
    clearInterval(glitchInterval);
    glitchInterval = null;
    progress.value = 0;
  }
}

function enterHome() {
  clearIntroSequence();
  progress.value = 0;
  progressLabel.value = "信号接入中";
  stage.value = "home";
  localStorage.setItem(INTRO_SEEN_KEY, "true");
}

function triggerPageShake(duration = 600) {
  pageShaking.value = true;
  window.setTimeout(() => {
    pageShaking.value = false;
  }, duration);
}

function breakTv() {
  if (tvBroken.value || tvBrokenAnimating.value || scene.value !== "static") {
    return;
  }
  tvBrokenAnimating.value = true;

  // 停止雪花屏
  if (introStaticInterval) {
    clearInterval(introStaticInterval);
    introStaticInterval = null;
  }
  if (signalInterval) {
    clearInterval(signalInterval);
    signalInterval = null;
  }

  // 页面震动 + 全屏碎裂
  triggerPageShake(800);

  // 播放破坏动画
  setTimeout(() => {
    tvBrokenAnimating.value = false;
    tvBroken.value = true;

    // 全屏碎裂扩散
    screenShattered.value = true;

    notifyAchievementUnlocked("smash_tv");
  }, 900);
}

function notifyAchievementUnlocked(id: string) {
  if (!unlockAchievement(id)) {
    return;
  }
  const ach = getAchievement(id);
  if (!ach) {
    return;
  }
  achievementToast.value = ach;
  showAchievementToast.value = true;
  setTimeout(() => {
    showAchievementToast.value = false;
  }, 3500);
}

function dismissAchievementToast() {
  showAchievementToast.value = false;
}

function startGame() {
  router.push("/chapters");
}

function goSoulTalk() {
  router.push("/soul-talk");
}

function goAlbum() {
  router.push("/album");
}

function goAchievements() {
  router.push("/achievements");
}

function resumeGame() {
  const savedState = loadRuntimeState();
  router.push(savedState?.nodeId ? "/play?resume=1" : "/play");
}

function backToLanding() {
  clearIntroSequence();
  stage.value = "landing";
  descDisplayed.value = "";
  descCursorVisible.value = true;
  setTimeout(startDescTypewriter, 600);
}

function showComingSoon(name: string) {
  comingSoonName.value = name;
  comingSoonVisible.value = true;
}

function openTimeTravel() {
  if (timeTravelOpen.value) {
    return;
  }
  timeTravelOpen.value = true;
}

function openRebirthManual() {
  if (stage.value !== "home") {
    return;
  }
  manualOpen.value = true;
  notifyAchievementUnlocked("read_manual");
}

const achievementCountDisplay = computed(() => {
  void statsRefreshKey.value;
  return getUnlockedCount();
});

function replayIntroFromSettings() {
  localStorage.removeItem(INTRO_SEEN_KEY);
  enterHome();
}

function onSettingsDataCleared() {
  statsRefreshKey.value += 1;
}

function onTimeTravelShake(duration = 600) {
  triggerPageShake(duration);
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
.intro-video {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.home-page {
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.landing-page {
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  background: linear-gradient(
    180deg,
    rgba(18, 14, 8, 0.92) 0%,
    rgba(28, 22, 14, 0.4) 8%,
    rgba(252, 246, 234, 0.9) 18%,
    rgba(248, 240, 225, 0.86) 42%,
    rgba(255, 252, 247, 0.82) 58%,
    rgba(250, 244, 232, 0.88) 78%,
    rgba(28, 22, 14, 0.35) 92%,
    rgba(18, 14, 8, 0.88) 100%
  );
  --neon-gold: #c9a96e;
  --neon-bright: #e8d5a3;
  --neon-dim: #8b6914;
  --neon-glow: rgba(201, 169, 110, 0.45);
  --neon-glow-soft: rgba(201, 169, 110, 0.2);
  --font-display: "LXGW WenKai", "STKaiti", "KaiTi", "楷体", serif;
  --font-serif: "Noto Serif SC", "Songti SC", "SimSun", serif;
  font-family: var(--font-serif);
}

.landing-page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
  opacity: 0.32;
}

.landing-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 95% 75% at 50% 40%,
      transparent 35%,
      rgba(139, 90, 43, 0.08) 100%
    ),
    radial-gradient(circle at 0% 0%, rgba(255, 210, 140, 0.1), transparent 38%),
    radial-gradient(
      circle at 100% 88%,
      rgba(180, 130, 80, 0.08),
      transparent 42%
    ),
    url("/images/bg-vintage.jpg") center / cover no-repeat;
  background-blend-mode: overlay, normal, normal, soft-light;
  opacity: var(--hub-vintage-overlay, 0.4);
  animation: hub-warm-pulse 14s ease-in-out infinite;
}

.landing-page .paper-bg {
  z-index: 0;
  background:
    radial-gradient(
      ellipse 90% 55% at 50% 32%,
      rgba(255, 248, 235, 0.52) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse at 18% 48%,
      rgba(201, 169, 110, 0.16) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 82% 22%,
      rgba(232, 200, 150, 0.12) 0%,
      transparent 45%
    ),
    repeating-linear-gradient(
      -18deg,
      transparent,
      transparent 80px,
      rgba(201, 169, 110, 0.025) 80px,
      rgba(201, 169, 110, 0.04) 81px
    );
}

.landing-page .grain-overlay {
  z-index: 0;
  opacity: 0.09;
  mix-blend-mode: multiply;
}

.landing-page .frame-corner {
  z-index: 2;
  border-color: var(--neon-gold);
  box-shadow:
    0 0 10px var(--neon-glow-soft),
    inset 0 0 8px rgba(201, 169, 110, 0.08);
}

.landing-page .content::before {
  content: "";
  position: absolute;
  inset: -1.5rem -2rem;
  z-index: -1;
  border-radius: 22px;
  background: radial-gradient(
    ellipse 100% 95% at 50% 45%,
    rgba(32, 24, 12, 0.55) 0%,
    rgba(42, 32, 18, 0.32) 50%,
    transparent 82%
  );
  pointer-events: none;
}

.landing-kicker {
  margin: 0;
  color: var(--neon-bright);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.45),
    0 0 12px var(--neon-glow-soft);
}

.paper-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 20% 50%,
      rgba(201, 169, 110, 0.12) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 20%,
      rgba(201, 169, 110, 0.09) 0%,
      transparent 40%
    ),
    radial-gradient(
      ellipse at 50% 80%,
      rgba(139, 69, 19, 0.06) 0%,
      transparent 50%
    );
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.05;
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

/* ===== 浮动粒子背景 ===== */
.particle-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(
    circle,
    rgba(201, 169, 110, 0.6) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: particle-float linear infinite;
}

.p-1 {
  left: 10%;
  top: 90%;
  animation-duration: 12s;
  animation-delay: 0s;
}
.p-2 {
  left: 20%;
  top: 95%;
  animation-duration: 15s;
  animation-delay: 1s;
  width: 6px;
  height: 6px;
}
.p-3 {
  left: 30%;
  top: 92%;
  animation-duration: 10s;
  animation-delay: 2s;
}
.p-4 {
  left: 40%;
  top: 97%;
  animation-duration: 14s;
  animation-delay: 0.5s;
  width: 3px;
  height: 3px;
}
.p-5 {
  left: 50%;
  top: 93%;
  animation-duration: 11s;
  animation-delay: 3s;
  width: 5px;
  height: 5px;
}
.p-6 {
  left: 60%;
  top: 96%;
  animation-duration: 13s;
  animation-delay: 1.5s;
}
.p-7 {
  left: 70%;
  top: 91%;
  animation-duration: 16s;
  animation-delay: 2.5s;
  width: 4px;
  height: 4px;
}
.p-8 {
  left: 80%;
  top: 94%;
  animation-duration: 9s;
  animation-delay: 0s;
  width: 6px;
  height: 6px;
}
.p-9 {
  left: 90%;
  top: 98%;
  animation-duration: 12s;
  animation-delay: 4s;
}
.p-10 {
  left: 15%;
  top: 95%;
  animation-duration: 14s;
  animation-delay: 2s;
  width: 3px;
  height: 3px;
}
.p-11 {
  left: 25%;
  top: 88%;
  animation-duration: 11s;
  animation-delay: 1s;
  width: 5px;
  height: 5px;
}
.p-12 {
  left: 35%;
  top: 99%;
  animation-duration: 13s;
  animation-delay: 3s;
}
.p-13 {
  left: 45%;
  top: 90%;
  animation-duration: 10s;
  animation-delay: 0.5s;
  width: 4px;
  height: 4px;
}
.p-14 {
  left: 55%;
  top: 97%;
  animation-duration: 15s;
  animation-delay: 2.5s;
  width: 3px;
  height: 3px;
}
.p-15 {
  left: 65%;
  top: 93%;
  animation-duration: 12s;
  animation-delay: 1.5s;
  width: 6px;
  height: 6px;
}
.p-16 {
  left: 75%;
  top: 96%;
  animation-duration: 14s;
  animation-delay: 0s;
}
.p-17 {
  left: 85%;
  top: 91%;
  animation-duration: 11s;
  animation-delay: 3.5s;
  width: 4px;
  height: 4px;
}
.p-18 {
  left: 5%;
  top: 94%;
  animation-duration: 13s;
  animation-delay: 2s;
  width: 5px;
  height: 5px;
}
.p-19 {
  left: 95%;
  top: 89%;
  animation-duration: 10s;
  animation-delay: 1s;
}
.p-20 {
  left: 50%;
  top: 100%;
  animation-duration: 16s;
  animation-delay: 4s;
  width: 3px;
  height: 3px;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) scale(0.3);
    opacity: 0;
  }
}

/* ===== 鼠标跟随光斑 ===== */
.cursor-glow {
  position: fixed;
  z-index: 0;
  width: 300px;
  height: 300px;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(201, 169, 110, 0.12) 0%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    left 0.15s ease-out,
    top 0.15s ease-out;
}

/* ===== 文字 stagger 入场动画 ===== */
.enter-anim {
  opacity: 0;
  transform: translateY(20px);
  animation: enter-slide 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes enter-slide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 按钮光晕效果 ===== */
.glow-btn {
  position: relative;
}

.glow-btn::before {
  content: "";
  position: absolute;
  inset: -2px;
  z-index: -1;
  background: linear-gradient(90deg, #c9a96e, #e8d5a3, #c9a96e);
  background-size: 200% 100%;
  border-radius: 4px;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.4s ease;
  animation: glow-shift 3s linear infinite;
}

.glow-btn:hover::before {
  opacity: 0.6;
}

@keyframes glow-shift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* ===== 装饰线流光 ===== */
.deco-line::before,
.deco-line::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.6),
    transparent
  );
  background-size: 200% 100%;
  animation: line-shimmer 3s ease-in-out infinite;
}

.deco-line.top::before,
.deco-line.top::after {
  animation-delay: 0s;
}

.deco-line.bottom::before,
.deco-line.bottom::after {
  animation-delay: 1.5s;
}

@keyframes line-shimmer {
  0%,
  100% {
    background-position: -100% 50%;
    opacity: 0.5;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}

/* ===== 描述卡片微光 ===== */
.desc-card {
  position: relative;
  overflow: hidden;
}

.desc-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(201, 169, 110, 0.03) 50%,
    transparent 60%
  );
  animation: card-shimmer 5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes card-shimmer {
  0%,
  100% {
    transform: translateX(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) rotate(45deg);
  }
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
  animation: stamp-float 3s ease-in-out infinite;
}

@keyframes stamp-float {
  0%,
  100% {
    transform: rotate(-12deg) translateY(0);
  }
  50% {
    transform: rotate(-10deg) translateY(-4px);
  }
}

.stamp-text {
  color: var(--neon-bright, #e8d5a3);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(201, 169, 110, 0.35);
}

.landing-page .stamp-circle {
  border-color: var(--neon-gold, #c9a96e);
  box-shadow:
    0 0 16px rgba(201, 169, 110, 0.2),
    inset 0 0 12px rgba(201, 169, 110, 0.08);
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
  color: var(--neon-bright, #e8d5a3);
  font-family: var(--font-display, "LXGW WenKai", "STKaiti", "KaiTi", serif);
  font-size: clamp(1.5rem, 4vw, 2.8rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  line-height: 1.35;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 0 14px var(--neon-glow-soft, rgba(201, 169, 110, 0.2));
}

.title-line.accent {
  color: #fff8e7;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-shadow:
    0 0 10px var(--neon-glow, rgba(201, 169, 110, 0.45)),
    0 0 22px var(--neon-glow-soft, rgba(201, 169, 110, 0.2));
}

.tagline {
  margin: 0;
  color: var(--neon-gold, #c9a96e);
  font-size: 0.82rem;
  letter-spacing: 0.2em;
  text-shadow: 0 0 8px var(--neon-glow-soft, rgba(201, 169, 110, 0.2));
}

.desc-card {
  max-width: 520px;
  padding: 1.25rem 1.75rem;
  background: linear-gradient(
    165deg,
    rgba(255, 252, 247, 0.88) 0%,
    rgba(248, 238, 220, 0.82) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(201, 169, 110, 0.42);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(61, 41, 20, 0.08),
    0 0 24px rgba(201, 169, 110, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.desc-text {
  margin: 0;
  color: #6b5340;
  font-size: 0.82rem;
  line-height: 1.85;
  text-align: left;
  letter-spacing: 0.3px;
}

.typewriter-desc {
  min-height: 3em;
}

.type-cursor {
  display: inline-block;
  color: #c9a96e;
  animation: blink-cursor 1s step-end infinite;
}

@keyframes blink-cursor {
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
  transform: translate(var(--bx, 0), var(--by, 0));
  transition: transform 0.15s ease-out;
}

.btn-border {
  display: inline-block;
}

.landing-page .btn-border {
  display: inline-block;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--neon-gold, #c9a96e) 0%,
    var(--neon-bright, #e8d5a3) 50%,
    #8b4513 100%
  );
  border-radius: 6px;
  box-shadow: 0 0 16px var(--neon-glow-soft, rgba(201, 169, 110, 0.2));
}

.btn-inner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 2.2rem;
  color: var(--neon-bright, #e8d5a3);
  font-family: var(--font-display, "LXGW WenKai", "STKaiti", "KaiTi", serif);
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  background: linear-gradient(
    165deg,
    rgba(22, 16, 10, 0.96) 0%,
    rgba(45, 32, 18, 0.94) 100%
  );
  border-radius: 5px;
  transition: all 0.3s ease;
}

.start-btn:hover .btn-inner {
  color: #fff8e7;
  background: linear-gradient(
    165deg,
    rgba(32, 24, 14, 0.98) 0%,
    rgba(61, 41, 20, 0.96) 100%
  );
  box-shadow:
    inset 0 0 12px var(--neon-glow-soft, rgba(201, 169, 110, 0.15)),
    0 4px 16px rgba(61, 41, 20, 0.25);
}

.btn-icon {
  font-size: 0.75rem;
}

.bottom-menu {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.5rem;
}

.menu-item {
  color: rgba(232, 213, 163, 0.85);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  background: none;
  border: none;
  transition:
    color 0.3s ease,
    text-shadow 0.3s ease;
}

.menu-item:hover {
  color: var(--neon-bright, #e8d5a3);
  text-shadow: 0 0 10px var(--neon-glow-soft, rgba(201, 169, 110, 0.35));
  cursor: pointer;
}

.menu-sep {
  color: var(--neon-gold, #c9a96e);
  font-size: 0.8rem;
  opacity: 0.55;
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
  background: rgba(12, 10, 6, 0.72);
  backdrop-filter: blur(8px);
}

.modal-panel,
.toast-panel {
  width: 90%;
  background: linear-gradient(
    165deg,
    rgba(255, 252, 247, 0.98) 0%,
    rgba(248, 240, 228, 0.96) 100%
  );
  border: 1px solid var(--neon-gold, #c9a96e);
  border-radius: 12px;
  box-shadow:
    0 12px 40px rgba(10, 8, 4, 0.35),
    0 0 24px var(--neon-glow-soft, rgba(201, 169, 110, 0.15));
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
.video-scene {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tv-static,
.video-scene {
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

.video-scene {
  background: #000;
}

.intro-video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 0 0.5rem;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
}

.progress-track {
  position: relative;
  width: min(420px, 85%);
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.progress-track::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3C/svg%3E");
  background-size: 4px 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b8924a 0%, #c9a96e 50%, #e8d5a3 100%);
  border-radius: 2px;
  transition: width 0.15s linear;
  box-shadow:
    0 0 8px rgba(201, 169, 110, 0.4),
    0 0 2px rgba(201, 169, 110, 0.6);
}

.progress-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(420px, 85%);
  margin-top: 0.35rem;
}

.progress-label {
  color: rgba(201, 169, 110, 0.7);
  font-size: 0.65rem;
  letter-spacing: 2px;
}

.progress-percent {
  color: rgba(250, 248, 245, 0.65);
  font-size: 0.65rem;
  font-family: monospace;
  letter-spacing: 1px;
}

.home-page {
  z-index: 10050;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  background: linear-gradient(
    180deg,
    rgba(18, 14, 8, 0.88) 0%,
    rgba(28, 22, 14, 0.35) 6%,
    rgba(252, 246, 234, 0.88) 14%,
    rgba(248, 240, 225, 0.82) 32%,
    rgba(255, 252, 247, 0.78) 50%,
    rgba(250, 244, 232, 0.82) 72%,
    rgba(252, 248, 240, 0.88) 84%,
    rgba(28, 22, 14, 0.3) 94%,
    rgba(18, 14, 8, 0.82) 100%
  );
  --hub-pad-x: clamp(1.25rem, 4vw, 2.75rem);
  --font-display: "LXGW WenKai", "STKaiti", "KaiTi", "楷体", serif;
  --font-welcome:
    "LXGW WenKai", "STXingkai", "KaiTi", "楷体", "Noto Serif SC", serif;
  --font-serif: "Noto Serif SC", "Songti SC", "SimSun", serif;
  --neon-gold: #c9a96e;
  --neon-bright: #e8d5a3;
  --neon-dim: #8b6914;
  --neon-glow: rgba(201, 169, 110, 0.45);
  --neon-glow-soft: rgba(201, 169, 110, 0.2);
  --neon-glow-strong: rgba(201, 169, 110, 0.7);
  font-family: var(--font-serif);
}

/* ===== CRT 扫描线覆盖层（层级必须低于顶栏，否则会挡住点击）===== */
.home-page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
  opacity: 0.35;
}

/* 主页暖色晕影 + 复古底图透出 */
.home-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 95% 75% at 50% 42%,
      transparent 35%,
      rgba(139, 90, 43, 0.07) 100%
    ),
    radial-gradient(circle at 0% 0%, rgba(255, 210, 140, 0.1), transparent 38%),
    radial-gradient(
      circle at 100% 85%,
      rgba(180, 130, 80, 0.08),
      transparent 42%
    ),
    url("/images/bg-vintage.jpg") center / cover no-repeat;
  background-blend-mode: overlay, normal, normal, soft-light;
  opacity: 0.42;
  animation: hub-warm-pulse 14s ease-in-out infinite;
}

@keyframes hub-warm-pulse {
  0%,
  100% {
    opacity: 0.38;
  }
  50% {
    opacity: 0.48;
  }
}

.home-page .paper-bg {
  z-index: 0;
  background:
    radial-gradient(
      ellipse 90% 55% at 50% 35%,
      rgba(255, 248, 235, 0.5) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse at 15% 45%,
      rgba(201, 169, 110, 0.18) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 85% 25%,
      rgba(232, 200, 150, 0.14) 0%,
      transparent 45%
    ),
    radial-gradient(
      ellipse at 50% 88%,
      rgba(160, 100, 60, 0.1) 0%,
      transparent 50%
    ),
    repeating-linear-gradient(
      -18deg,
      transparent,
      transparent 80px,
      rgba(201, 169, 110, 0.025) 80px,
      rgba(201, 169, 110, 0.04) 81px
    );
}

.home-page .grain-overlay {
  z-index: 0;
  opacity: 0.09;
  mix-blend-mode: multiply;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 10000;
  pointer-events: auto;
  user-select: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem var(--hub-pad-x);
  background: rgba(10, 8, 4, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--neon-gold);
  box-shadow:
    0 0 12px var(--neon-glow-soft),
    0 0 24px rgba(201, 169, 110, 0.08),
    0 4px 24px rgba(10, 8, 4, 0.3),
    0 1px 0 rgba(255, 255, 255, 0.06);
}

.logo {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.75rem;
  margin: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer !important;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.2s ease;
}

.logo * {
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer !important;
}

.logo:hover {
  background: rgba(201, 169, 110, 0.1);
  border-color: rgba(201, 169, 110, 0.35);
  box-shadow: 0 0 14px var(--neon-glow-soft);
  transform: translateY(-1px);
}

.logo:active {
  transform: translateY(0);
}

.logo-hint {
  margin-left: 0.15rem;
  padding: 0.12rem 0.45rem;
  color: rgba(232, 213, 163, 0.95);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  background: rgba(201, 169, 110, 0.18);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.logo:hover .logo-hint,
.logo:focus-visible .logo-hint {
  opacity: 1;
  transform: translateX(0);
}

.logo:focus-visible {
  outline: 2px solid rgba(201, 169, 110, 0.65);
  outline-offset: 2px;
}

.logo-icon {
  color: var(--neon-gold);
  font-size: 1rem;
  text-shadow: 0 0 8px var(--neon-glow);
  animation: neon-flicker 4s ease-in-out infinite;
}

.logo-text {
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-shadow:
    0 0 6px var(--neon-glow),
    0 0 12px var(--neon-glow-soft);
  animation: neon-pulse 3s ease-in-out infinite;
}

.date-display {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  color: var(--neon-gold);
  font-size: 0.85rem;
  letter-spacing: 1px;
  font-family: monospace;
  text-shadow: 0 0 5px var(--neon-glow-soft);
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
  cursor: pointer !important;
  user-select: none;
  touch-action: manipulation;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.2s ease;
}

.date-display * {
  pointer-events: none;
  user-select: none;
  cursor: pointer !important;
}

.date-display:hover {
  background: rgba(201, 169, 110, 0.16);
  border-color: rgba(201, 169, 110, 0.6);
  box-shadow: 0 0 14px var(--neon-glow-soft);
  transform: translateY(-1px);
}

.date-display:active {
  transform: translateY(0);
}

.date-icon {
  font-size: 0.95rem;
  line-height: 1;
  animation: date-tick 2s ease-in-out infinite;
}

@keyframes date-tick {
  0%,
  100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

.date-text {
  letter-spacing: 0.06em;
}

.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2.25rem;
  padding: clamp(1.75rem, 4.5vh, 2.75rem) var(--hub-pad-x) 2rem;
  overflow-y: auto;
  background: transparent;
  border: none;
  box-shadow: none;
}

.hub-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  width: 100%;
  max-width: 820px;
  padding: 1.35rem 1.1rem 1.25rem;
  background: linear-gradient(
    165deg,
    rgba(255, 252, 247, 0.82) 0%,
    rgba(248, 238, 220, 0.76) 45%,
    rgba(255, 250, 242, 0.8) 100%
  );
  backdrop-filter: blur(14px);
  border: 1px solid rgba(201, 169, 110, 0.38);
  border-radius: 18px;
  box-shadow:
    0 12px 48px rgba(61, 41, 20, 0.1),
    0 0 32px rgba(201, 169, 110, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.45) inset,
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.hub-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.65),
    transparent
  );
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.25);
  pointer-events: none;
}

.welcome-section {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 820px;
  margin: 0;
  padding: 1.25rem 0;
  text-align: center;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  outline: none;
}

/* 欢迎区衬底：加深对比，避免浅金字贴在浅灰背景上发虚 */
.welcome-section::before {
  content: "";
  position: absolute;
  top: -0.75rem;
  right: -1.5rem;
  bottom: -0.5rem;
  left: -1.5rem;
  z-index: -1;
  border-radius: 20px;
  background: radial-gradient(
    ellipse 95% 110% at 50% 48%,
    rgba(32, 24, 12, 0.78) 0%,
    rgba(42, 32, 18, 0.58) 42%,
    rgba(50, 38, 22, 0.28) 68%,
    transparent 88%
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

.welcome-kicker {
  margin: 0 0 0.65rem;
  color: #e8d5a3;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.55),
    0 2px 6px rgba(0, 0, 0, 0.4);
}

.welcome-title {
  margin: 0 0 0.8rem;
  background: linear-gradient(
    135deg,
    #ffecd2 0%,
    #fcb69f 15%,
    #ff9a9e 30%,
    #ffecd2 45%,
    #a8edea 60%,
    #fed6e3 75%,
    #ffecd2 100%
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-welcome);
  font-size: clamp(3.2rem, 8vw, 5rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  line-height: 1.3;
  animation:
    gradientShift 3s ease infinite,
    titleFloat 4s ease-in-out infinite,
    neonGlow 2s ease-in-out infinite alternate;
  position: relative;
  filter: drop-shadow(0 0 30px rgba(252, 182, 159, 0.8))
    drop-shadow(0 0 60px rgba(255, 154, 158, 0.6))
    drop-shadow(0 0 90px rgba(168, 237, 234, 0.4))
    drop-shadow(0 0 120px rgba(254, 44, 85, 0.3));
}

.welcome-title::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 140%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 236, 210, 0.25) 0%,
    rgba(252, 182, 159, 0.15) 30%,
    transparent 70%
  );
  z-index: -1;
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes neonGlow {
  0% {
    filter: drop-shadow(0 0 20px rgba(252, 182, 159, 0.6))
      drop-shadow(0 0 40px rgba(255, 154, 158, 0.4))
      drop-shadow(0 0 60px rgba(168, 237, 234, 0.2));
  }
  100% {
    filter: drop-shadow(0 0 40px rgba(252, 182, 159, 1))
      drop-shadow(0 0 80px rgba(255, 154, 158, 0.8))
      drop-shadow(0 0 120px rgba(168, 237, 234, 0.6))
      drop-shadow(0 0 160px rgba(254, 44, 85, 0.4));
  }
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.15);
  }
}

.title-separator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin: 0 0.4rem;
  width: 3.5rem;
  height: 3.5rem;
  animation: separatorFloat 4s ease-in-out infinite;
}

.separator-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(254, 44, 85, 0.5));
}

@keyframes separatorFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
  }
}

@keyframes separatorGlow {
  0%,
  100% {
    box-shadow:
      0 0 20px rgba(254, 44, 85, 0.5),
      0 0 40px rgba(37, 244, 238, 0.3);
  }
  50% {
    box-shadow:
      0 0 30px rgba(254, 44, 85, 0.7),
      0 0 60px rgba(37, 244, 238, 0.5);
  }
}

.welcome-sub {
  margin: 0 0 1.35rem;
  color: #f0e6d0;
  font-size: clamp(1.15rem, 2.6vw, 1.35rem);
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1.6;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.4);
}

.welcome-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  max-width: 320px;
  margin: 0 auto;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(232, 213, 163, 0.9),
    transparent
  );
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.35);
}

.divider-gem {
  flex-shrink: 0;
  color: #e8d5a3;
  font-size: 0.75rem;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.45),
    0 0 10px rgba(201, 169, 110, 0.35);
}

.hub-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: visible;
  padding-top: 0.25rem;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--neon-gold),
    transparent
  );
  box-shadow: 0 0 4px var(--neon-glow-soft);
}

.section-label {
  margin: 0;
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  white-space: nowrap;
  text-shadow:
    0 1px 2px rgba(10, 8, 4, 0.2),
    0 0 8px var(--neon-glow-soft);
  padding: 0.25rem 0.75rem;
  border: 1.5px solid var(--neon-gold);
  border-radius: 4px;
  background: rgba(201, 169, 110, 0.08);
  box-shadow:
    inset 0 0 10px var(--neon-glow-soft),
    0 0 12px var(--neon-glow-soft),
    0 0 20px rgba(201, 169, 110, 0.06);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  width: 100%;
  padding: 0.5rem 0.25rem;
  perspective: 1200px;
  overflow: visible;
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
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(var(--rx, 0deg))
    rotateY(var(--ry, 0deg)) translateZ(0);
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease;
  animation: card-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.feature-card:nth-child(1) {
  animation-delay: 0.05s;
}
.feature-card:nth-child(2) {
  animation-delay: 0.15s;
}
.feature-card:nth-child(3) {
  animation-delay: 0.25s;
}
.feature-card:nth-child(4) {
  animation-delay: 0.35s;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: perspective(800px) rotateX(4deg) translateY(24px);
  }
  to {
    opacity: 1;
    transform: perspective(800px) rotateX(0deg) translateY(0);
  }
}

.feature-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    rgba(201, 169, 110, 0.15),
    transparent 40%
  );
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  border-color: var(--neon-gold);
  box-shadow: 0 8px 24px rgba(61, 41, 20, 0.1);
}

.feature-card:hover::before {
  opacity: 1;
}

/* ===== 复古卷轴卡片（心灵倾述 / 时光相册 / 成就墙）===== */
.feature-card:not(.primary) {
  overflow: visible;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  min-height: 248px;
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(var(--rx, 0deg))
    rotateY(var(--ry, 0deg)) translateZ(0) translateY(var(--ty, 0px));
  transition:
    transform 0.15s ease-out,
    box-shadow 0.3s ease,
    filter 0.3s ease;
}

/* 边框装饰图 —— 填满整张卡片，展示完整卷轴与花朵 */
.feature-card:not(.primary)::after {
  content: "";
  position: absolute;
  inset: -4px -6px -8px -6px;
  z-index: 0;
  background: url(/images/border-frame.png) center / 100% 100% no-repeat;
  opacity: 0.92;
  filter: sepia(0.12) saturate(0.95);
  pointer-events: none;
  transition:
    filter 0.35s ease,
    opacity 0.35s ease;
}

/* 卡片内容层：透明，直接叠在卷轴背景图上 */
.feature-card:not(.primary) > .card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 1.4rem);
  min-height: 200px;
  margin: 4rem 0.7rem 2rem;
  padding: 1.2rem 1rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transition: transform 0.3s ease;
}

/* 复古卷轴卡片文字 —— 深棕 + 轻阴影，叠在背景图上可读 */
.feature-card:not(.primary) .card-title {
  color: #4a3018;
  font-weight: 500;
  text-shadow:
    0 1px 0 rgba(255, 252, 247, 0.65),
    0 0 12px rgba(255, 248, 235, 0.45);
}

.feature-card:not(.primary) .card-desc {
  color: #5c4030;
  opacity: 1;
  text-shadow: 0 1px 0 rgba(255, 252, 247, 0.55);
}

.feature-card:not(.primary) .card-tag {
  color: #5c3d1e;
  background: rgba(201, 169, 110, 0.15);
  border-color: rgba(92, 61, 30, 0.25);
  text-shadow: none;
  box-shadow: none;
}

.feature-card:not(.primary) .card-tag-live {
  color: #5c3d1e;
  background: rgba(201, 169, 110, 0.15);
  border-color: rgba(92, 61, 30, 0.25);
  box-shadow: none;
  text-shadow: none;
}

/* 悬浮效果：纸张浮起 + 阴影层次 + 微光 */
.feature-card:not(.primary):hover {
  --ty: -6px;
  filter: brightness(1.03);
}

.feature-card:not(.primary):hover > .card-content {
  transform: translateY(-2px);
}

.feature-card:not(.primary):hover::after {
  filter: brightness(1.06) drop-shadow(0 16px 40px rgba(61, 41, 20, 0.18));
  transition: filter 0.35s ease;
}

.feature-card:not(.primary):hover .card-title {
  color: #3d2613;
  transform: translateY(-2px);
  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

.feature-card:not(.primary):hover .card-desc {
  color: #5c3d1e;
  transition: color 0.3s ease;
}

.feature-card:not(.primary):hover .card-tag {
  background: rgba(201, 169, 110, 0.22);
  border-color: rgba(92, 61, 30, 0.4);
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

.feature-card:not(.primary):hover .card-tag-live {
  background: rgba(201, 169, 110, 0.22);
  border-color: rgba(92, 61, 30, 0.4);
}

/* ===== 剧情模式卡片 —— 霓虹灯箱 ===== */
.feature-card.primary {
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  min-height: 120px;
  padding: 1.5rem 2rem;
  text-align: left;
  background: linear-gradient(
    135deg,
    rgba(20, 15, 8, 0.92) 0%,
    rgba(35, 25, 12, 0.95) 50%,
    rgba(20, 15, 8, 0.92) 100%
  );
  border: 2px solid var(--neon-gold);
  border-radius: 16px;
  box-shadow:
    0 0 8px var(--neon-glow-soft),
    0 0 20px var(--neon-glow-soft),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card.primary::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(201, 169, 110, 0.02) 2px,
    rgba(201, 169, 110, 0.02) 4px
  );
  opacity: 0.6;
}

.feature-card.primary:hover {
  border-color: var(--neon-bright);
  box-shadow:
    0 0 12px var(--neon-glow),
    0 0 30px var(--neon-glow-soft),
    0 0 60px rgba(201, 169, 110, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: translateY(-3px);
}

.primary-icon-wrap {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border: 2px solid var(--neon-gold);
  border-radius: 50%;
  overflow: hidden;
  background: #14100a;
  box-shadow:
    0 0 12px var(--neon-glow-soft),
    inset 0 2px 4px rgba(255, 255, 255, 0.05),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s ease;
  position: relative;
  z-index: 1;
}

.primary-icon-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
}

.feature-card.primary:hover .primary-icon-wrap {
  transform: scale(1.1);
  box-shadow:
    0 0 16px var(--neon-glow),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.primary-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.primary-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1rem;
  margin-bottom: 0.5rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.85rem;
  color: #5a9a6e;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  background: rgba(10, 25, 15, 0.7);
  border: 1px solid rgba(90, 154, 110, 0.5);
  border-radius: 999px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 8px rgba(90, 154, 110, 0.2);
  text-shadow: 0 0 4px rgba(90, 154, 110, 0.3);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(90, 154, 110, 0.4);
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #5a9a6e;
  box-shadow:
    0 0 10px rgba(90, 154, 110, 0.8),
    0 0 20px rgba(90, 154, 110, 0.4);
  animation: neon-pulse-green 2s ease-in-out infinite;
}

.feature-card.primary .card-title {
  margin: 0;
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px var(--neon-glow-soft);
}

.feature-card.primary .card-desc {
  margin: 0 0 0.55rem;
  color: var(--neon-gold);
  font-size: 0.98rem;
  line-height: 1.7;
  text-align: left;
  text-shadow: 0 0 4px var(--neon-glow-soft);
  opacity: 0.9;
}

.card-hint {
  margin: 0;
  color: var(--neon-dim);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-shadow: 0 0 4px var(--neon-glow-soft);
}

.primary-arrow {
  flex-shrink: 0;
  color: var(--neon-gold);
  font-size: 2.4rem;
  line-height: 1;
  opacity: 0.7;
  text-shadow: 0 0 12px var(--neon-glow);
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
  animation: neon-pulse-arrow 2s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

.feature-card.primary:hover .primary-arrow {
  opacity: 1;
  transform: translateX(14px);
  text-shadow: 0 0 20px var(--neon-glow);
}

.card-icon-wrap {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 0.55rem;
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 50%;
  background: rgba(20, 15, 8, 0.6);
  box-shadow: 0 0 6px var(--neon-glow-soft);
}

.card-icon-wrap .card-icon {
  margin-bottom: 0;
  font-size: 1.25rem;
  color: var(--neon-gold);
  text-shadow: 0 0 6px var(--neon-glow-soft);
}

.card-title {
  margin: 0.6rem 0 0.7rem;
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
  text-shadow: 0 0 6px var(--neon-glow-soft);
}

.card-desc {
  flex: 1;
  margin: 0 0 0.9rem;
  color: var(--neon-gold);
  font-size: 0.8rem;
  line-height: 1.7;
  text-align: center;
  transition: color 0.3s ease;
  opacity: 0.85;
}

.feature-card:not(.primary) .card-desc {
  min-height: 2.8em;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--neon-gold);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--neon-glow-soft);
}

.status-dot.active {
  background: #2e8b57;
  box-shadow: 0 0 8px rgba(46, 139, 87, 0.6);
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
  margin-bottom: 0.4rem;
  display: inline-block;
  padding: 0.22rem 0.65rem;
  color: var(--neon-gold);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 999px;
  transition: all 0.3s ease;
  text-shadow: 0 0 4px var(--neon-glow-soft);
}

.card-tag-live {
  color: #5a9a6e;
  background: rgba(10, 25, 15, 0.5);
  border-color: rgba(90, 154, 110, 0.4);
  box-shadow: 0 0 6px rgba(90, 154, 110, 0.15);
  text-shadow: 0 0 4px rgba(90, 154, 110, 0.2);
}

/* ===== 底部信息栏 —— 数码管面板 ===== */
.bottom-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  background: rgba(10, 8, 4, 0.88);
  border: 1px solid var(--neon-gold);
  border-radius: 8px;
  box-shadow:
    0 -4px 20px rgba(10, 8, 4, 0.2),
    0 0 12px var(--neon-glow-soft),
    0 0 24px rgba(201, 169, 110, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.info-label {
  color: var(--neon-gold);
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-shadow: 0 0 6px var(--neon-glow);
  opacity: 0.95;
}

.info-value {
  color: #fff8e7;
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-shadow:
    0 0 8px var(--neon-glow),
    0 0 16px var(--neon-glow-soft),
    0 0 28px rgba(201, 169, 110, 0.15);
  animation: neon-pulse-dim 4s ease-in-out infinite;
}

.info-divider {
  display: none;
}

/* ===== 底部菜单 —— 霓虹按键 ===== */
.footer-menu {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  max-width: 100%;
  margin: 0;
  padding-inline: var(--hub-pad-x);
  border-top: 1px solid var(--neon-gold);
  background: rgba(10, 8, 4, 0.82);
  box-shadow:
    0 -4px 24px rgba(10, 8, 4, 0.3),
    0 -1px 12px var(--neon-glow-soft),
    0 -1px 24px rgba(201, 169, 110, 0.08);
}

.footer-btn {
  flex: 1;
  padding: 1rem;
  color: var(--neon-bright);
  font-size: 0.85rem;
  letter-spacing: 2px;
  background: none;
  border: none;
  border-right: 1px solid rgba(201, 169, 110, 0.25);
  transition: all 0.3s;
  text-shadow: 0 0 6px var(--neon-glow);
  position: relative;
  overflow: hidden;
}

.footer-btn:last-child {
  border-right: none;
}

.footer-btn:hover {
  color: #fff8e7;
  background: rgba(201, 169, 110, 0.12);
  text-shadow:
    0 0 12px var(--neon-glow),
    0 0 24px var(--neon-glow-soft);
  box-shadow: inset 0 0 20px var(--neon-glow-soft);
}

/* ===== Toast —— 霓虹弹窗 ===== */
.toast-overlay {
  background: rgba(10, 8, 4, 0.65);
  backdrop-filter: blur(6px);
}

.toast-panel {
  max-width: 340px;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(20, 15, 8, 0.95),
    rgba(30, 22, 10, 0.95)
  );
  border: 1px solid var(--neon-gold);
  border-radius: 12px;
  box-shadow:
    0 0 16px var(--neon-glow-soft),
    0 0 40px rgba(201, 169, 110, 0.08);
}

.toast-icon {
  margin-bottom: 1rem;
  color: var(--neon-gold);
  font-size: 2rem;
  text-shadow: 0 0 12px var(--neon-glow);
  animation: neon-pulse 2s ease-in-out infinite;
}

.toast-text {
  margin: 0 0 0.5rem;
  color: var(--neon-bright);
  font-size: 0.95rem;
  line-height: 1.6;
  text-shadow: 0 0 6px var(--neon-glow-soft);
}

.toast-sub {
  margin: 0 0 1.5rem;
  color: var(--neon-gold);
  font-size: 0.85rem;
  text-shadow: 0 0 4px var(--neon-glow-soft);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.frame-corner {
  z-index: 0;
  pointer-events: none;
}

.home-page .frame-corner.tl,
.home-page .frame-corner.tr {
  top: 12px;
}

/* ===== 霓虹动画 ===== */
.home-rise {
  animation: home-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.home-rise-delay {
  animation-delay: 0.15s;
}

@keyframes home-rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes neon-pulse {
  0%,
  100% {
    opacity: 1;
    text-shadow:
      0 0 6px var(--neon-glow),
      0 0 12px var(--neon-glow-soft);
  }
  50% {
    opacity: 0.92;
    text-shadow:
      0 0 10px var(--neon-glow),
      0 0 24px var(--neon-glow-soft),
      0 0 40px rgba(201, 169, 110, 0.1);
  }
}

@keyframes neon-flicker {
  0%,
  100% {
    opacity: 1;
  }
  92% {
    opacity: 1;
  }
  93% {
    opacity: 0.7;
  }
  94% {
    opacity: 1;
  }
  96% {
    opacity: 0.85;
  }
  97% {
    opacity: 1;
  }
}

@keyframes neon-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes glow-flow {
  0%,
  100% {
    opacity: 0.5;
    box-shadow: 0 0 4px var(--neon-glow-soft);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 8px var(--neon-glow);
  }
}

@keyframes neon-pulse-green {
  0%,
  100% {
    box-shadow:
      0 0 8px rgba(90, 154, 110, 0.6),
      0 0 16px rgba(90, 154, 110, 0.3);
  }
  50% {
    box-shadow:
      0 0 14px rgba(90, 154, 110, 0.9),
      0 0 28px rgba(90, 154, 110, 0.5);
  }
}

@keyframes neon-pulse-arrow {
  0%,
  100% {
    opacity: 0.7;
    text-shadow: 0 0 8px var(--neon-glow-soft);
  }
  50% {
    opacity: 1;
    text-shadow:
      0 0 16px var(--neon-glow),
      0 0 30px var(--neon-glow-soft);
  }
}

@keyframes neon-pulse-dim {
  0%,
  100% {
    text-shadow:
      0 0 6px var(--neon-glow),
      0 0 12px var(--neon-glow-soft);
  }
  50% {
    text-shadow:
      0 0 10px var(--neon-glow),
      0 0 20px var(--neon-glow-soft),
      0 0 40px rgba(201, 169, 110, 0.08);
  }
}

@keyframes neon-flicker-card {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.95;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.97;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 720px) {
  .home-page {
    --hub-pad-x: 1.15rem;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .feature-card:not(.primary) {
    min-height: 220px;
    padding: 3rem 1.6rem 2.4rem;
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
    border-bottom: 1px solid rgba(201, 169, 110, 0.25);
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

/* ===== 电视破坏效果 ===== */
.tv-frame {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.tv-frame:hover {
  transform: scale(1.01);
}

.tv-frame.breaking {
  animation: tv-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.tv-frame.broken {
  cursor: default;
  animation: tv-flash 0.3s ease-out both;
}

@keyframes tv-shake {
  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
  10% {
    transform: translate(-4px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(4px, 2px) rotate(1deg);
  }
  30% {
    transform: translate(-6px, -3px) rotate(-1.5deg);
  }
  40% {
    transform: translate(6px, 3px) rotate(1.5deg);
  }
  50% {
    transform: translate(-4px, -2px) rotate(-1deg);
  }
  60% {
    transform: translate(4px, 2px) rotate(1deg);
  }
  70% {
    transform: translate(-2px, -1px) rotate(-0.5deg);
  }
  80% {
    transform: translate(2px, 1px) rotate(0.5deg);
  }
  90% {
    transform: translate(-1px, 0) rotate(0);
  }
}

@keyframes tv-flash {
  0% {
    filter: brightness(1) contrast(1);
  }
  30% {
    filter: brightness(3) contrast(1.5);
  }
  60% {
    filter: brightness(0.3) contrast(2);
  }
  100% {
    filter: brightness(1) contrast(1);
  }
}

/* 屏幕裂纹 */
.tv-crack {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    transparent 48%,
    rgba(200, 200, 200, 0.6) 49%,
    rgba(150, 150, 150, 0.8) 50%,
    rgba(200, 200, 200, 0.6) 51%,
    transparent 52%
  );
  opacity: 0;
  animation: crack-appear 0.3s ease-out 0.4s forwards;
}

.crack-1 {
  top: 15%;
  left: 20%;
  width: 60%;
  height: 2px;
  transform: rotate(35deg);
}

.crack-2 {
  top: 40%;
  left: 30%;
  width: 50%;
  height: 2px;
  transform: rotate(-25deg);
  animation-delay: 0.5s;
}

.crack-3 {
  top: 55%;
  left: 25%;
  width: 55%;
  height: 2px;
  transform: rotate(15deg);
  animation-delay: 0.6s;
}

@keyframes crack-appear {
  from {
    opacity: 0;
    transform: scaleX(0) rotate(var(--r, 0deg));
  }
  to {
    opacity: 0.7;
    transform: scaleX(1) rotate(var(--r, 0deg));
  }
}

/* 天线耷拉 */
.antenna.droop .antenna-rod {
  transform: rotate(-30deg);
  transform-origin: bottom center;
  transition: transform 0.5s ease;
}

.antenna.droop .antenna-coil {
  transform: rotate(-30deg);
  transform-origin: bottom center;
  transition: transform 0.5s ease;
}

/* 屏幕熄灭 */
.screen-off {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  opacity: 0;
  animation: screen-die 0.4s ease-out 0.2s forwards;
}

@keyframes screen-die {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.static-canvas.off {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 破坏后各部件状态 */
.tv-brand.broken,
.tv-controls.broken,
.tv-feet.broken {
  opacity: 0.6;
  filter: grayscale(0.4);
  transition: all 0.4s ease;
}

.broken-text {
  color: #e74c3c !important;
  letter-spacing: 0.2em;
  animation: none !important;
  text-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
}

/* ===== 成就解锁提示 ===== */
.achievement-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10200;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(20, 15, 8, 0.95) 0%,
    rgba(30, 22, 10, 0.98) 100%
  );
  border: 1px solid var(--neon-gold);
  border-radius: 12px;
  box-shadow:
    0 0 16px var(--neon-glow-soft),
    0 12px 40px rgba(61, 41, 20, 0.15);
  cursor: pointer;
}

.achievement-icon {
  font-size: 2rem;
  line-height: 1;
  animation: trophy-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  text-shadow: 0 0 12px var(--neon-glow);
  filter: drop-shadow(0 0 6px var(--neon-glow-soft));
}

@keyframes trophy-bounce {
  0% {
    transform: scale(0) rotate(-20deg);
  }
  60% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}

.achievement-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.achievement-label {
  color: var(--neon-gold);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-shadow: 0 0 6px var(--neon-glow-soft);
}

.achievement-name {
  color: var(--neon-bright);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px var(--neon-glow-soft);
}

.achievement-desc {
  color: var(--neon-gold);
  font-size: 0.78rem;
  opacity: 0.85;
  text-shadow: 0 0 4px var(--neon-glow-soft);
}

.achievement-toast-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.achievement-toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.achievement-toast-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.achievement-toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 600px) {
  .achievement-toast {
    right: 1rem;
    left: 1rem;
    bottom: 1rem;
  }
}

/* ===== 页面震动 ===== */
.page-shaking {
  animation: page-shake-intense 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes page-shake-intense {
  0% {
    transform: translate(0, 0) rotate(0);
  }
  8% {
    transform: translate(-8px, 5px) rotate(-0.8deg);
  }
  16% {
    transform: translate(7px, -4px) rotate(0.6deg);
  }
  24% {
    transform: translate(-10px, 6px) rotate(-1deg);
  }
  32% {
    transform: translate(9px, -5px) rotate(0.8deg);
  }
  40% {
    transform: translate(-7px, 4px) rotate(-0.6deg);
  }
  48% {
    transform: translate(8px, -6px) rotate(0.7deg);
  }
  56% {
    transform: translate(-6px, 3px) rotate(-0.5deg);
  }
  64% {
    transform: translate(5px, -4px) rotate(0.4deg);
  }
  72% {
    transform: translate(-4px, 2px) rotate(-0.3deg);
  }
  80% {
    transform: translate(3px, -2px) rotate(0.2deg);
  }
  88% {
    transform: translate(-2px, 1px) rotate(-0.1deg);
  }
  100% {
    transform: translate(0, 0) rotate(0);
  }
}

/* ===== 全屏碎裂效果 ===== */
.shatter-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  overflow: hidden;
}

.shatter-piece {
  position: absolute;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(200, 200, 200, 0.7) 40%,
    rgba(150, 150, 150, 0.5) 100%
  );
  opacity: 0;
  animation: shatter-spread 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.piece-1 {
  top: 10%;
  left: 45%;
  width: 3px;
  height: 80px;
  transform: rotate(15deg);
  animation-delay: 0.1s;
}
.piece-2 {
  top: 20%;
  left: 40%;
  width: 2px;
  height: 60px;
  transform: rotate(-20deg);
  animation-delay: 0.15s;
}
.piece-3 {
  top: 30%;
  left: 50%;
  width: 2px;
  height: 70px;
  transform: rotate(35deg);
  animation-delay: 0.2s;
}
.piece-4 {
  top: 15%;
  left: 55%;
  width: 3px;
  height: 90px;
  transform: rotate(-10deg);
  animation-delay: 0.12s;
}
.piece-5 {
  top: 40%;
  left: 35%;
  width: 2px;
  height: 50px;
  transform: rotate(45deg);
  animation-delay: 0.18s;
}
.piece-6 {
  top: 50%;
  left: 60%;
  width: 2px;
  height: 65px;
  transform: rotate(-30deg);
  animation-delay: 0.22s;
}
.piece-7 {
  top: 60%;
  left: 42%;
  width: 3px;
  height: 55px;
  transform: rotate(25deg);
  animation-delay: 0.25s;
}
.piece-8 {
  top: 25%;
  left: 65%;
  width: 2px;
  height: 75px;
  transform: rotate(-15deg);
  animation-delay: 0.14s;
}
.piece-9 {
  top: 70%;
  left: 48%;
  width: 2px;
  height: 45px;
  transform: rotate(40deg);
  animation-delay: 0.28s;
}
.piece-10 {
  top: 35%;
  left: 30%;
  width: 3px;
  height: 85px;
  transform: rotate(-25deg);
  animation-delay: 0.16s;
}
.piece-11 {
  top: 45%;
  left: 70%;
  width: 2px;
  height: 60px;
  transform: rotate(10deg);
  animation-delay: 0.2s;
}
.piece-12 {
  top: 55%;
  left: 38%;
  width: 2px;
  height: 70px;
  transform: rotate(-40deg);
  animation-delay: 0.24s;
}

@keyframes shatter-spread {
  0% {
    opacity: 0;
    transform: scaleY(0) rotate(var(--r, 0deg));
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
    transform: scaleY(1) rotate(var(--r, 0deg));
  }
}

/* ===== 时空扭曲效果 ===== */
.warp-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: radial-gradient(
    circle at center,
    transparent 30%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  animation: warp-fade-in 0.3s ease-out forwards;
}

.warp-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(201, 169, 110, 0.6);
  border-radius: 50%;
  animation: warp-expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.warp-ring.delay-1 {
  animation-delay: 0.15s;
  border-color: rgba(201, 169, 110, 0.4);
}

.warp-ring.delay-2 {
  animation-delay: 0.3s;
  border-color: rgba(201, 169, 110, 0.2);
}

.warp-vortex {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid rgba(231, 76, 60, 0.5);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation:
    vortex-spin 0.8s linear infinite,
    vortex-pulse 0.6s ease-in-out infinite alternate;
}

@keyframes warp-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes warp-expand {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(8);
    opacity: 0;
  }
}

@keyframes vortex-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes vortex-pulse {
  from {
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
  }
  to {
    box-shadow: 0 0 30px rgba(231, 76, 60, 0.6);
  }
}

.intro-video.warping {
  filter: contrast(1.3) saturate(1.2) brightness(0.9);
  transition: filter 0.3s ease;
}
</style>
