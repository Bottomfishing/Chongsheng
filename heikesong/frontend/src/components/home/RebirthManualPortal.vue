<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="manual-portal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-title"
        @click.self="onBackdropClick"
      >
        <div class="manual-vignette" aria-hidden="true" />

        <div class="book-scene" :class="phase">
          <div class="book-shadow" aria-hidden="true" />

          <article class="book" :class="{ open: phase !== 'opening' }">
            <header class="book-cover">
              <span class="cover-stamp">机密</span>
              <p class="cover-eyebrow">CHONGSHENG ARCHIVE</p>
              <h2 id="manual-title" class="cover-title">重生者手册</h2>
              <p class="cover-sub">绝密卷宗 · 仅供本人阅览</p>
              <p class="cover-no">档案号 CS-1995-001</p>
            </header>

            <div class="book-page">
              <p class="page-chapter">{{ currentPage.chapter }}</p>
              <h3 class="page-title">{{ currentPage.title }}</h3>

              <div class="page-body">
                <p
                  v-for="(line, i) in visibleLines"
                  :key="`${pageIndex}-${i}`"
                  class="page-line"
                >
                  {{ line }}
                </p>
                <span v-if="isTyping" class="type-cursor">|</span>
              </div>

              <div v-if="showStamp" class="red-stamp" aria-hidden="true">
                已阅
              </div>

              <footer class="page-footer">
                <span class="page-num"
                  >{{ pageIndex + 1 }} / {{ pages.length }}</span
                >
              </footer>
            </div>
          </article>

          <div class="manual-controls">
            <button
              type="button"
              class="ctrl-btn"
              :disabled="pageIndex <= 0 || phase === 'opening'"
              aria-label="上一页"
              @click="prevPage"
            >
              &#8249;
            </button>
            <button
              type="button"
              class="ctrl-btn"
              :disabled="pageIndex >= pages.length - 1 || phase === 'opening'"
              aria-label="下一页"
              @click="nextPage"
            >
              &#8250;
            </button>
          </div>

          <p class="manual-hint">{{ hintText }}</p>

          <div class="manual-actions">
            <button
              v-if="phase !== 'ready'"
              type="button"
              class="action-btn ghost"
              @click="abort"
            >
              合上卷宗
            </button>
            <button
              type="button"
              class="action-btn primary"
              :disabled="phase !== 'ready'"
              @click="close"
            >
              {{ phase === "ready" ? "记住了 · 继续重生" : "翻阅中…" }}
            </button>
          </div>
        </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

type Phase = "opening" | "writing" | "ready";

type ManualPage = {
  chapter: string;
  title: string;
  lines: string[];
};

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  shake: [duration?: number];
}>();

const PAGES: ManualPage[] = [
  {
    chapter: "第一章 · 穿越须知",
    title: "你睁开眼之前",
    lines: [
      "① 本手册不保证你能回到 2026，但保证 1995 会很吵。",
      "② 请勿向路人展示「抖音」——对方会以为你在念咒语。",
      "③ 若有人问你来自哪里，统一口径：外地来打工的。",
    ],
  },
  {
    chapter: "第二章 · 生存法则",
    title: "九十年代社交礼仪",
    lines: [
      "① 遇到李天佐：先递汽水，再谈理想，别谈 KPI。",
      "② 遇到费启暗：他说话声音越小，事情越大。",
      "③ 村口王大娘的消息，比新闻联播快半天。",
    ],
  },
  {
    chapter: "第三章 · 隐藏设定",
    title: "开发者偷偷写的",
    lines: [
      "① 你的手机电量：在九十年代显示为「∞」（大概）。",
      "② 每次选择都会分叉——但没有「坏结局」，只有「更狗血的结局」。",
      "③ 点击右上角日期，可骚扰时空管理局（已备案）。",
    ],
  },
  {
    chapter: "终章 · 盖章页",
    title: "重生者誓言",
    lines: [
      "本人自愿留在九十年代，搞事业、拍视频、",
      "偶尔和数字人倾诉，并承诺不向上级时空投诉。",
      "",
      "—— 签名：__________（你）",
    ],
  },
];

const HINTS = [
  "用左右箭头翻阅卷宗",
  "小秘密：这手册每次打开顺序不变，但你可以装不知道",
  "最后一页有红章，别漏看",
];

const phase = ref<Phase>("opening");
const pageIndex = ref(0);
const visibleLines = ref<string[]>([]);
const isTyping = ref(false);
const showStamp = ref(false);
const hintText = ref(HINTS[0]!);

let typeTimer: ReturnType<typeof setInterval> | null = null;
let phaseTimers: ReturnType<typeof setTimeout>[] = [];

const pages = PAGES;

const currentPage = computed(() => pages[pageIndex.value] ?? pages[0]!);

function clearTimers() {
  if (typeTimer) {
    clearInterval(typeTimer);
    typeTimer = null;
  }
  phaseTimers.forEach((t) => clearTimeout(t));
  phaseTimers = [];
}

function typeCurrentPage() {
  if (typeTimer) {
    clearInterval(typeTimer);
    typeTimer = null;
  }

  const lines = currentPage.value.lines;
  visibleLines.value = [];
  isTyping.value = true;
  showStamp.value = pageIndex.value === pages.length - 1 ? false : false;

  let lineIdx = 0;
  let charIdx = 0;
  const built: string[] = [];

  typeTimer = setInterval(() => {
    if (lineIdx >= lines.length) {
      if (typeTimer) {
        clearInterval(typeTimer);
        typeTimer = null;
      }
      isTyping.value = false;
      if (pageIndex.value === pages.length - 1) {
        phaseTimers.push(
          window.setTimeout(() => {
            showStamp.value = true;
            phase.value = "ready";
          }, 400),
        );
      } else {
        phase.value = "ready";
      }
      return;
    }

    const line = lines[lineIdx]!;
    if (charIdx === 0) {
      built[lineIdx] = "";
    }

    if (charIdx < line.length) {
      built[lineIdx] = line.slice(0, charIdx + 1);
      charIdx += 1;
    } else {
      lineIdx += 1;
      charIdx = 0;
    }

    visibleLines.value = [...built];
  }, 28);
}

function startOpenSequence() {
  clearTimers();
  pageIndex.value = 0;
  phase.value = "opening";
  showStamp.value = false;
  hintText.value = HINTS[Math.floor(Math.random() * HINTS.length)]!;
  emit("shake", 500);

  phaseTimers.push(
    window.setTimeout(() => {
      phase.value = "writing";
      typeCurrentPage();
    }, 650),
  );
}

function prevPage() {
  if (pageIndex.value <= 0 || phase.value === "opening") {
    return;
  }
  pageIndex.value -= 1;
  phase.value = "writing";
  showStamp.value = false;
  typeCurrentPage();
}

function nextPage() {
  if (pageIndex.value >= pages.length - 1 || phase.value === "opening") {
    return;
  }
  pageIndex.value += 1;
  phase.value = "writing";
  showStamp.value = false;
  typeCurrentPage();
}

function abort() {
  clearTimers();
  emit("update:open", false);
}

function close() {
  if (phase.value !== "ready") {
    return;
  }
  clearTimers();
  emit("update:open", false);
}

function onBackdropClick() {
  if (phase.value === "ready") {
    close();
  } else {
    abort();
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      void nextTick(() => startOpenSequence());
    } else {
      clearTimers();
      phase.value = "opening";
      pageIndex.value = 0;
      visibleLines.value = [];
      showStamp.value = false;
    }
  },
);

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style scoped>
.manual-portal {
  position: fixed;
  inset: 0;
  z-index: 10100;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(6, 4, 2, 0.78);
  backdrop-filter: blur(8px);
}

.manual-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(0, 0, 0, 0.55) 100%
  );
}

.book-scene {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  width: min(100%, 400px);
  animation: scene-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes scene-in {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.book-shadow {
  position: absolute;
  bottom: 4.5rem;
  left: 50%;
  width: 85%;
  height: 24px;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.45),
    transparent 70%
  );
  filter: blur(8px);
}

.book {
  position: relative;
  width: 100%;
  min-height: 360px;
  perspective: 1400px;
}

.book-cover {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.75rem 1.25rem;
  text-align: center;
  background: linear-gradient(
    145deg,
    #4a3728 0%,
    #2e2216 45%,
    #3d2914 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 10px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.35);
  transform-origin: left center;
  transition:
    transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s ease;
}

.book.open .book-cover {
  transform: rotateY(-88deg);
  opacity: 0;
  pointer-events: none;
}

.cover-stamp {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.2rem 0.5rem;
  color: #c0392b;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  border: 2px solid rgba(192, 57, 43, 0.75);
  border-radius: 4px;
  transform: rotate(12deg);
  opacity: 0.85;
}

.cover-eyebrow {
  margin: 0 0 0.5rem;
  color: rgba(201, 169, 110, 0.65);
  font-size: 0.58rem;
  letter-spacing: 0.32em;
  font-family: monospace;
}

.cover-title {
  margin: 0 0 0.35rem;
  color: #e8d5a3;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.cover-sub {
  margin: 0 0 0.75rem;
  color: rgba(232, 213, 163, 0.75);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
}

.cover-no {
  margin: 0;
  color: rgba(139, 115, 85, 0.9);
  font-size: 0.65rem;
  font-family: monospace;
  letter-spacing: 0.08em;
}

.book-page {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 360px;
  padding: 1.25rem 1.15rem 1rem;
  background: linear-gradient(180deg, #faf6ee 0%, #f3ead8 100%);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 10px;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.22),
    inset 0 0 40px rgba(201, 169, 110, 0.06);
  animation: page-reveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

@keyframes page-reveal {
  from {
    opacity: 0;
    transform: rotateY(12deg);
  }
  to {
    opacity: 1;
    transform: rotateY(0);
  }
}

.page-chapter {
  margin: 0 0 0.25rem;
  color: #8b7355;
  font-size: 0.65rem;
  letter-spacing: 0.18em;
}

.page-title {
  margin: 0 0 0.85rem;
  padding-bottom: 0.5rem;
  color: #3d2914;
  font-family: "LXGW WenKai", "STKaiti", serif;
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  border-bottom: 1px dashed rgba(201, 169, 110, 0.45);
}

.page-body {
  flex: 1;
  min-height: 140px;
  text-align: left;
}

.page-line {
  margin: 0 0 0.55rem;
  color: #4a3728;
  font-size: 0.82rem;
  line-height: 1.75;
  letter-spacing: 0.02em;
}

.type-cursor {
  color: #c9a96e;
  animation: blink 0.9s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.red-stamp {
  position: absolute;
  right: 1.25rem;
  bottom: 3rem;
  padding: 0.35rem 0.65rem;
  color: rgba(192, 57, 43, 0.88);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  border: 3px solid rgba(192, 57, 43, 0.75);
  border-radius: 6px;
  transform: rotate(-18deg) scale(0);
  animation: stamp-slam 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes stamp-slam {
  from {
    transform: rotate(-18deg) scale(1.8);
    opacity: 0;
  }
  to {
    transform: rotate(-18deg) scale(1);
    opacity: 1;
  }
}

.page-footer {
  margin-top: auto;
  padding-top: 0.5rem;
  text-align: right;
}

.page-num {
  color: #8b7355;
  font-size: 0.68rem;
  font-family: monospace;
}

.manual-controls {
  display: flex;
  gap: 0.75rem;
}

.ctrl-btn {
  width: 40px;
  height: 40px;
  color: #e8d5a3;
  font-size: 1.4rem;
  line-height: 1;
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 50%;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.ctrl-btn:hover:not(:disabled) {
  background: rgba(201, 169, 110, 0.22);
  border-color: rgba(201, 169, 110, 0.65);
}

.ctrl-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.manual-hint {
  margin: 0;
  color: rgba(201, 169, 110, 0.65);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.manual-actions {
  display: flex;
  gap: 0.65rem;
  width: 100%;
}

.action-btn {
  flex: 1;
  padding: 0.55rem 0.75rem;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  border-radius: 6px;
  border: 1px solid rgba(201, 169, 110, 0.4);
}

.action-btn.ghost {
  color: #8b7355;
  background: transparent;
}

.action-btn.ghost:hover {
  color: #e8d5a3;
  background: rgba(201, 169, 110, 0.1);
}

.action-btn.primary {
  color: #1a1208;
  background: linear-gradient(180deg, #e8d5a3, #c9a96e);
  border-color: #c9a96e;
}

.action-btn.primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.manual-portal {
  animation: portal-in 0.35s ease both;
}

@keyframes portal-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
