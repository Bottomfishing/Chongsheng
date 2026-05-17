<template>
  <div
    class="album-3d"
    @mouseenter="pauseAuto"
    @mouseleave="resumeAuto"
  >
    <div class="stage-floor" aria-hidden="true">
      <div class="floor-glow" />
      <div class="floor-ring" />
    </div>

    <div
      ref="stageRef"
      class="carousel-stage"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
      @pointerleave="onPointerEnd"
    >
      <div
        class="carousel-ring"
        :style="ringStyle"
      >
        <article
          v-for="(photo, idx) in photos"
          :key="`${categoryKey}-${idx}`"
          class="carousel-card"
          :class="{
            active: idx === activeIndex,
            side: isSide(idx),
            behind: isBehind(idx),
          }"
          :style="cardStyle(idx)"
          @click="onCardClick(idx)"
        >
          <div class="polaroid">
            <div class="polaroid-inner" :style="coverStyle(idx)">
              <img
                v-if="photo.src"
                class="cover-img"
                :src="photo.src"
                :alt="photo.title"
                loading="lazy"
                draggable="false"
              />
              <span v-else class="cover-icon" aria-hidden="true">&#127902;</span>
              <span v-if="photo.tag" class="cover-tag">{{ photo.tag }}</span>
            </div>
            <div class="polaroid-caption">
              <span class="caption-title">{{ photo.title }}</span>
              <span class="caption-date">{{ photo.date }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="album-controls">
      <button
        class="nav-btn"
        type="button"
        aria-label="上一张"
        :disabled="photos.length <= 1"
        @click="step(-1)"
      >
        &#10094;
      </button>

      <div class="dot-row" role="tablist" :aria-label="`${photos.length} 张照片`">
        <button
          v-for="(_, idx) in photos"
          :key="idx"
          class="dot"
          :class="{ active: idx === activeIndex }"
          type="button"
          role="tab"
          :aria-selected="idx === activeIndex"
          :aria-label="`第 ${idx + 1} 张`"
          @click="goTo(idx)"
        />
      </div>

      <button
        class="nav-btn"
        type="button"
        aria-label="下一张"
        :disabled="photos.length <= 1"
        @click="step(1)"
      >
        &#10095;
      </button>
    </div>

    <div v-if="activePhoto" class="focus-panel">
      <p class="focus-kicker">当前聚焦</p>
      <h3 class="focus-title">{{ activePhoto.title }}</h3>
      <p class="focus-meta">
        <span>{{ activePhoto.date }}</span>
        <span v-if="activePhoto.tag" class="focus-tag">{{ activePhoto.tag }}</span>
      </p>
      <p class="focus-hint">拖动旋转相册 · 点击照片切换</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from "vue";

export interface AlbumPhoto {
  title: string;
  date: string;
  src?: string;
  tag?: string;
  size?: "normal" | "large";
}

const props = defineProps<{
  photos: AlbumPhoto[];
  categoryKey: string;
}>();

const activeIndex = ref(0);
const stageRef = ref<HTMLElement | null>(null);
const stageWidth = ref(520);
const isDragging = ref(false);
const dragMoved = ref(false);
const dragStartX = ref(0);
const dragStartIndex = ref(0);
let autoTimer: ReturnType<typeof setInterval> | null = null;
let resumeTimer: ReturnType<typeof setTimeout> | null = null;

const count = computed(() => props.photos.length);
const angleStep = computed(() => (count.value > 0 ? 360 / count.value : 0));

/** 根据舞台宽度计算环半径，避免照片超出可视区被裁切 */
const radius = computed(() => {
  if (count.value <= 1) return 0;
  const cardW = Math.min(200, Math.max(132, stageWidth.value * 0.36));
  const maxByWidth = Math.max(100, (stageWidth.value - cardW) * 0.38);
  const base =
    count.value === 2 ? 165 : count.value === 3 ? 185 : 155 + count.value * 16;
  return Math.min(base, maxByWidth);
});

const ringStyle = computed(
  (): CSSProperties => ({
    transform: `translate(-50%, -50%) rotateY(${-activeIndex.value * angleStep.value}deg)`,
  }),
);

const activePhoto = computed(() => props.photos[activeIndex.value] ?? null);

const coverHues = [32, 18, 42, 8, 55, 28];

function cardStyle(index: number): CSSProperties {
  const angle = index * angleStep.value;
  return {
    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius.value}px)`,
  };
}

function coverStyle(index: number): CSSProperties {
  const photo = props.photos[index];
  if (photo?.src) return {};
  const hue = coverHues[index % coverHues.length];
  return {
    background: `
      radial-gradient(ellipse 80% 60% at 30% 20%, hsla(${hue}, 55%, 88%, 0.9), transparent),
      linear-gradient(155deg, hsl(${hue}, 38%, 78%) 0%, hsl(${hue + 12}, 42%, 42%) 100%)
    `,
  };
}

function isBehind(index: number): boolean {
  if (count.value <= 1) return false;
  const diff = Math.abs(index - activeIndex.value);
  const wrap = Math.min(diff, count.value - diff);
  return wrap > 1;
}

function isSide(index: number): boolean {
  if (count.value <= 1) return false;
  const diff = Math.abs(index - activeIndex.value);
  const wrap = Math.min(diff, count.value - diff);
  return wrap === 1;
}

function goTo(index: number) {
  if (count.value === 0) return;
  activeIndex.value = ((index % count.value) + count.value) % count.value;
}

function step(delta: number) {
  goTo(activeIndex.value + delta);
}

function onCardClick(index: number) {
  if (dragMoved.value) return;
  goTo(index);
}

function onPointerDown(event: PointerEvent) {
  if (count.value <= 1) return;
  isDragging.value = true;
  dragMoved.value = false;
  dragStartX.value = event.clientX;
  dragStartIndex.value = activeIndex.value;
  pauseAuto();
  stageRef.value?.setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value || count.value <= 1) return;
  const delta = event.clientX - dragStartX.value;
  if (Math.abs(delta) > 6) dragMoved.value = true;
  const threshold = 52;
  const steps = Math.round(-delta / threshold);
  if (steps !== 0) {
    goTo(dragStartIndex.value + steps);
    dragStartX.value = event.clientX;
    dragStartIndex.value = activeIndex.value;
  }
}

function onPointerEnd(event: PointerEvent) {
  if (!isDragging.value) return;
  isDragging.value = false;
  stageRef.value?.releasePointerCapture(event.pointerId);
  scheduleResumeAuto();
}

function pauseAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  if (resumeTimer) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }
}

function scheduleResumeAuto() {
  if (resumeTimer) clearTimeout(resumeTimer);
  resumeTimer = setTimeout(startAuto, 2800);
}

function startAuto() {
  pauseAuto();
  if (count.value <= 1) return;
  autoTimer = setInterval(() => step(1), 4200);
}

function resumeAuto() {
  if (!isDragging.value) scheduleResumeAuto();
}

watch(
  () => props.categoryKey,
  () => {
    activeIndex.value = 0;
    startAuto();
  },
);

watch(
  () => count.value,
  () => {
    if (activeIndex.value >= count.value) {
      activeIndex.value = 0;
    }
    startAuto();
  },
);

let resizeObserver: ResizeObserver | null = null;

function bindStageResize() {
  resizeObserver?.disconnect();
  if (!stageRef.value) return;
  resizeObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width;
    if (width && width > 0) stageWidth.value = width;
  });
  resizeObserver.observe(stageRef.value);
}

onMounted(() => {
  bindStageResize();
  startAuto();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  pauseAuto();
});
</script>

<style scoped>
.album-3d {
  --album-gold: #c9a96e;
  --album-bright: #e8d5a3;
  --album-glow: rgba(201, 169, 110, 0.45);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 0.25rem 0 0.5rem;
  overflow: visible;
  user-select: none;
}

.stage-floor {
  position: absolute;
  bottom: 5.5rem;
  left: 50%;
  z-index: 0;
  width: min(92%, 420px);
  height: 120px;
  pointer-events: none;
  transform: translateX(-50%);
}

.floor-glow {
  position: absolute;
  inset: 20% 5% 0;
  background: radial-gradient(
    ellipse 70% 55% at 50% 50%,
    rgba(201, 169, 110, 0.35) 0%,
    transparent 70%
  );
  filter: blur(12px);
  animation: floor-pulse 4s ease-in-out infinite;
}

.floor-ring {
  position: absolute;
  inset: 35% 8% 8%;
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 50%;
  box-shadow:
    0 0 24px rgba(201, 169, 110, 0.2),
    inset 0 0 20px rgba(201, 169, 110, 0.08);
}

@keyframes floor-pulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.04);
  }
}

.carousel-stage {
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
  height: clamp(300px, 52vw, 380px);
  margin: 0.25rem 0 0.5rem;
  overflow: visible;
  perspective: clamp(680px, 95vw, 1100px);
  perspective-origin: 50% 50%;
  cursor: grab;
  touch-action: pan-y;
}

.carousel-stage:active {
  cursor: grabbing;
}

.carousel-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: transform 0.85s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;
}

.carousel-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(140px, 34vw, 188px);
  transform-style: preserve-3d;
  transition:
    filter 0.5s ease,
    opacity 0.5s ease,
    transform 0.85s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  /* 不用 z-index，避免 flatten 3D 层导致只看见最前一张 */
}

.carousel-card.side {
  opacity: 0.92;
  filter: brightness(0.94);
}

.carousel-card.behind {
  opacity: 0.72;
  filter: brightness(0.8) saturate(0.9);
}

.carousel-card.active {
  opacity: 1;
  filter: brightness(1.06);
}

.carousel-card.active .polaroid {
  border-color: rgba(201, 169, 110, 0.75);
  transform: scale(1.04);
  box-shadow:
    0 20px 48px rgba(61, 41, 20, 0.22),
    0 0 32px rgba(201, 169, 110, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.polaroid {
  padding: 0.55rem 0.55rem 2.4rem;
  background: linear-gradient(165deg, #fffdf9 0%, #f4ebe0 100%);
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 6px;
  box-shadow:
    0 12px 32px rgba(61, 41, 20, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transform: rotateY(0deg);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition:
    box-shadow 0.45s ease,
    border-color 0.45s ease,
    transform 0.45s ease;
}

.carousel-card:hover .polaroid {
  transform: translateY(-6px) scale(1.02);
}

.polaroid-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.12);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-icon {
  font-size: 2rem;
  opacity: 0.55;
  filter: sepia(0.25) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
}

.cover-tag {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  padding: 0.12rem 0.45rem;
  color: #fff8e7;
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  background: rgba(22, 16, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}

.polaroid-caption {
  position: absolute;
  right: 0.55rem;
  bottom: 0.55rem;
  left: 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: left;
}

.caption-title {
  color: #3d2914;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}

.caption-date {
  color: #8b7355;
  font-size: 0.62rem;
  font-family: monospace;
  letter-spacing: 0.06em;
}

.album-controls {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
}

.nav-btn {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  color: var(--album-bright);
  font-size: 1rem;
  background: rgba(22, 16, 10, 0.75);
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  border-color: rgba(201, 169, 110, 0.7);
  box-shadow: 0 0 14px rgba(201, 169, 110, 0.25);
  transform: scale(1.06);
}

.nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dot-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  max-width: 220px;
}

.dot {
  width: 7px;
  height: 7px;
  padding: 0;
  background: rgba(201, 169, 110, 0.25);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.dot.active {
  background: var(--album-gold);
  box-shadow: 0 0 8px var(--album-glow);
  transform: scale(1.25);
}

.focus-panel {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 0.75rem 1rem;
  text-align: center;
  background: linear-gradient(
    165deg,
    rgba(255, 252, 247, 0.92) 0%,
    rgba(248, 238, 220, 0.88) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.38);
  border-radius: 12px;
  box-shadow:
    0 8px 24px rgba(61, 41, 20, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.focus-kicker {
  margin: 0 0 0.25rem;
  color: rgba(201, 169, 110, 0.9);
  font-size: 0.62rem;
  letter-spacing: 0.28em;
}

.focus-title {
  margin: 0 0 0.35rem;
  color: #3d2914;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.12em;
}

.focus-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 0.35rem;
  color: #8b7355;
  font-size: 0.78rem;
  font-family: monospace;
}

.focus-tag {
  padding: 0.1rem 0.45rem;
  color: #fff8e7;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  background: rgba(201, 169, 110, 0.55);
  border-radius: 999px;
}

.focus-hint {
  margin: 0;
  color: #a09080;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
}

@media (max-width: 640px) {
  .carousel-stage {
    height: 260px;
  }

  .carousel-card {
    width: 128px;
  }

  .stage-floor {
    bottom: 4.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-ring {
    transition-duration: 0.2s;
  }

  .floor-glow {
    animation: none;
  }
}
</style>
