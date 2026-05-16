<template>
  <Teleport to="body">
    <Transition name="portal-fade">
      <div
        v-if="open"
        class="time-portal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="time-portal-title"
        @click.self="onBackdropClick"
      >
        <div class="portal-vignette" aria-hidden="true" />
        <div class="portal-scanlines" aria-hidden="true" />

        <div class="warp-rings" aria-hidden="true">
          <div class="warp-ring" />
          <div class="warp-ring delay-1" />
          <div class="warp-ring delay-2" />
        </div>

        <div class="portal-panel" :class="phase">
          <div class="portal-badge">
            <span class="rec-dot" />
            <span>TIME WARP · 1995</span>
          </div>

          <p class="portal-status">{{ statusText }}</p>

          <div class="date-stage" aria-live="polite">
            <p
              id="time-portal-title"
              class="glitch-date"
              :data-text="displayDate"
            >
              {{ displayDate }}
            </p>
          </div>

          <div class="timeline-strip" aria-hidden="true">
            <span
              v-for="(y, i) in timelineYears"
              :key="y"
              class="timeline-year"
              :class="{ active: i === activeYearIdx }"
            >
              {{ y }}
            </span>
          </div>

          <p class="portal-message">{{ messageText }}</p>

          <ul v-if="phase === 'locked'" class="portal-facts">
            <li v-for="(fact, i) in facts" :key="i">{{ fact }}</li>
          </ul>

          <div class="portal-actions">
            <button
              v-if="phase !== 'locked'"
              class="portal-btn ghost"
              type="button"
              @click="abort"
            >
              放弃校准
            </button>
            <button
              class="portal-btn primary"
              type="button"
              :disabled="phase !== 'locked'"
              @click="close"
            >
              {{ phase === "locked" ? "锚定 1995 · 继续重生" : "时空校准中…" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  shake: [duration?: number];
}>();

type Phase = "scramble" | "locking" | "locked";

const GLITCH_DATES = [
  "2026年??月??日",
  "1988年12月31日",
  "1999年12月31日",
  "公元∞年1月1日",
  "ERROR·0x1995",
  "1995年5月16日",
  "2000年1月1日",
  "████年5月16日",
];

const STATUS_LINES = [
  "正在检索平行宇宙档案…",
  "检测到来自 2026 年的记忆碎片…",
  "警告：时光机在录像厅检修中…",
  "村口广播：请勿乱按日期按钮！",
  "抖音信号在 1995 年意外满格…",
  "王大娘：年轻人，别把手表按坏了！",
];

const LOCK_MESSAGES = [
  "时空锚点已锁定。今天仍是——你在九十年代的第 1 天。",
  "校准完成：1995 年的蝉鸣、自行车铃与 BB 机，全部在线。",
  "你没能回到 2026，但 1995 好像……也还不赖？",
];

const FACT_POOL = [
  "本日宜：拍短视频、暗恋、在小卖部赊账",
  "忌：解释什么是「直播带货」",
  "隐藏设定：口袋里的手机仍能刷抖音",
  "天气：晴 · 有风 · 有青春",
];

const timelineYears = [1988, 1992, 1995, 1999, 2026];
const TARGET_DATE = "1995年5月16日";

const phase = ref<Phase>("scramble");
const displayDate = ref(GLITCH_DATES[0]);
const statusText = ref(STATUS_LINES[0]);
const messageText = ref("");
const facts = ref<string[]>([]);
const activeYearIdx = ref(0);

let glitchTimer: ReturnType<typeof setInterval> | null = null;
let phaseTimer: ReturnType<typeof setTimeout> | null = null;
let yearTimer: ReturnType<typeof setInterval> | null = null;
let timers: ReturnType<typeof setTimeout>[] = [];

function clearAllTimers() {
  if (glitchTimer) {
    clearInterval(glitchTimer);
    glitchTimer = null;
  }
  if (yearTimer) {
    clearInterval(yearTimer);
    yearTimer = null;
  }
  if (phaseTimer) {
    clearTimeout(phaseTimer);
    phaseTimer = null;
  }
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function startSequence() {
  clearAllTimers();
  phase.value = "scramble";
  messageText.value = "";
  facts.value = [];
  activeYearIdx.value = 0;
  statusText.value = pickRandom(STATUS_LINES);
  emit("shake", 720);

  let tick = 0;
  glitchTimer = setInterval(() => {
    displayDate.value = GLITCH_DATES[tick % GLITCH_DATES.length]!;
    if (tick % 4 === 0) {
      statusText.value = pickRandom(STATUS_LINES);
    }
    tick += 1;
  }, 85);

  yearTimer = setInterval(() => {
    activeYearIdx.value = (activeYearIdx.value + 1) % timelineYears.length;
  }, 120);

  timers.push(
    window.setTimeout(() => {
      phase.value = "locking";
      messageText.value = "主线年代强制写入中 ████████░░ 82%";
    }, 1600),
  );

  timers.push(
    window.setTimeout(() => {
      if (glitchTimer) {
        clearInterval(glitchTimer);
        glitchTimer = null;
      }
      displayDate.value = TARGET_DATE;
      phase.value = "locked";
      messageText.value = pickRandom(LOCK_MESSAGES);
      facts.value = [
        FACT_POOL[0]!,
        pickRandom(FACT_POOL.slice(1)),
        pickRandom(FACT_POOL),
      ];
      activeYearIdx.value = timelineYears.indexOf(1995);
      statusText.value = "时空校准完成 · REC";
    }, 2600),
  );
}

function abort() {
  clearAllTimers();
  emit("update:open", false);
}

function close() {
  clearAllTimers();
  emit("update:open", false);
}

function onBackdropClick() {
  if (phase.value === "locked") {
    close();
  } else {
    abort();
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      startSequence();
    } else {
      clearAllTimers();
    }
  },
);

onBeforeUnmount(() => {
  clearAllTimers();
});
</script>

<style scoped>
.time-portal {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background: rgba(8, 6, 3, 0.72);
  backdrop-filter: blur(6px);
}

.portal-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 35%,
    rgba(0, 0, 0, 0.65) 100%
  );
}

.portal-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.2;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  animation: scan-drift 6s linear infinite;
}

@keyframes scan-drift {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(8px);
  }
}

.warp-rings {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.warp-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 1px solid rgba(201, 169, 110, 0.55);
  border-radius: 50%;
  animation: ring-expand 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.warp-ring.delay-1 {
  animation-delay: 0.35s;
  border-color: rgba(201, 169, 110, 0.35);
}

.warp-ring.delay-2 {
  animation-delay: 0.7s;
  border-color: rgba(201, 169, 110, 0.2);
}

@keyframes ring-expand {
  0% {
    transform: scale(0.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(12);
    opacity: 0;
  }
}

.portal-panel {
  position: relative;
  z-index: 1;
  width: min(100%, 420px);
  padding: 1.5rem 1.35rem 1.25rem;
  text-align: center;
  background: linear-gradient(
    165deg,
    rgba(18, 14, 8, 0.96) 0%,
    rgba(32, 24, 14, 0.94) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.55);
  border-radius: 12px;
  box-shadow:
    0 0 40px rgba(201, 169, 110, 0.15),
    0 24px 64px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  animation: panel-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.portal-panel.locked {
  animation:
    panel-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both,
    lock-flash 0.6s ease 0.1s;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes lock-flash {
  0%,
  100% {
    box-shadow:
      0 0 40px rgba(201, 169, 110, 0.15),
      0 24px 64px rgba(0, 0, 0, 0.45);
  }
  50% {
    box-shadow:
      0 0 56px rgba(201, 169, 110, 0.35),
      0 24px 64px rgba(0, 0, 0, 0.45);
  }
}

.portal-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  color: #e8d5a3;
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  font-family: monospace;
}

.rec-dot {
  width: 7px;
  height: 7px;
  background: #e74c3c;
  border-radius: 50%;
  animation: rec-blink 1s step-end infinite;
}

@keyframes rec-blink {
  50% {
    opacity: 0;
  }
}

.portal-status {
  margin: 0 0 0.85rem;
  color: rgba(201, 169, 110, 0.85);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  min-height: 1.2em;
}

.date-stage {
  margin: 0 0 1rem;
  padding: 0.65rem 0.5rem;
  border-top: 1px solid rgba(201, 169, 110, 0.2);
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
}

.glitch-date {
  position: relative;
  margin: 0;
  color: #faf8f5;
  font-size: clamp(1.35rem, 5vw, 1.75rem);
  font-family: "Courier New", "Consolas", monospace;
  letter-spacing: 0.08em;
  text-shadow:
    0 0 12px rgba(201, 169, 110, 0.5),
    2px 0 rgba(231, 76, 60, 0.35),
    -2px 0 rgba(52, 152, 219, 0.35);
  animation: text-flicker 0.12s step-end infinite;
}

.portal-panel.locked .glitch-date {
  animation: none;
  color: #e8d5a3;
}

.portal-panel.scramble .glitch-date::before,
.portal-panel.scramble .glitch-date::after,
.portal-panel.locking .glitch-date::before,
.portal-panel.locking .glitch-date::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  clip-path: inset(0 0 0 0);
}

.portal-panel.scramble .glitch-date::before,
.portal-panel.locking .glitch-date::before {
  left: 2px;
  color: rgba(231, 76, 60, 0.7);
  animation: glitch-top 0.35s infinite linear alternate-reverse;
}

.portal-panel.scramble .glitch-date::after,
.portal-panel.locking .glitch-date::after {
  left: -2px;
  color: rgba(52, 152, 219, 0.65);
  animation: glitch-bottom 0.3s infinite linear alternate-reverse;
}

@keyframes glitch-top {
  0% {
    clip-path: inset(12% 0 68% 0);
  }
  100% {
    clip-path: inset(58% 0 22% 0);
  }
}

@keyframes glitch-bottom {
  0% {
    clip-path: inset(62% 0 8% 0);
  }
  100% {
    clip-path: inset(18% 0 48% 0);
  }
}

@keyframes text-flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.88;
  }
}

.timeline-strip {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.timeline-year {
  padding: 0.15rem 0.45rem;
  color: rgba(139, 115, 85, 0.7);
  font-size: 0.68rem;
  font-family: monospace;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.timeline-year.active {
  color: #3d2914;
  background: rgba(201, 169, 110, 0.35);
  border-color: rgba(201, 169, 110, 0.5);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.25);
}

.portal-message {
  margin: 0 0 0.85rem;
  color: rgba(250, 248, 245, 0.88);
  font-size: 0.86rem;
  line-height: 1.65;
  letter-spacing: 0.04em;
}

.portal-facts {
  margin: 0 0 1rem;
  padding: 0.65rem 0.85rem;
  list-style: none;
  text-align: left;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border: 1px solid rgba(201, 169, 110, 0.18);
}

.portal-facts li {
  position: relative;
  padding-left: 0.85rem;
  color: rgba(232, 213, 163, 0.9);
  font-size: 0.78rem;
  line-height: 1.7;
}

.portal-facts li::before {
  content: "✦";
  position: absolute;
  left: 0;
  color: #c9a96e;
  font-size: 0.55rem;
}

.portal-facts li + li {
  margin-top: 0.25rem;
}

.portal-actions {
  display: flex;
  gap: 0.65rem;
  justify-content: center;
}

.portal-btn {
  flex: 1;
  max-width: 11rem;
  padding: 0.55rem 0.85rem;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  border-radius: 6px;
  border: 1px solid rgba(201, 169, 110, 0.4);
  transition:
    background 0.25s ease,
    opacity 0.25s ease,
    box-shadow 0.25s ease;
}

.portal-btn.ghost {
  color: #8b7355;
  background: transparent;
}

.portal-btn.ghost:hover {
  color: #e8d5a3;
  background: rgba(201, 169, 110, 0.08);
}

.portal-btn.primary {
  color: #1a1208;
  background: linear-gradient(180deg, #e8d5a3 0%, #c9a96e 100%);
  border-color: #c9a96e;
  box-shadow: 0 0 16px rgba(201, 169, 110, 0.35);
}

.portal-btn.primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.portal-btn.primary:not(:disabled):hover {
  filter: brightness(1.06);
  box-shadow: 0 0 22px rgba(201, 169, 110, 0.5);
}

.portal-fade-enter-active,
.portal-fade-leave-active {
  transition: opacity 0.35s ease;
}

.portal-fade-enter-from,
.portal-fade-leave-to {
  opacity: 0;
}
</style>
