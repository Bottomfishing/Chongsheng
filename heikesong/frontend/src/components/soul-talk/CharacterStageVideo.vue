<template>
  <div
    class="stage-video"
    :class="{ 'is-playing': isPlaying, 'is-failed': failed }"
    :style="frameStyle"
    @click="handleTap"
  >
    <!-- 待机：全幅立绘，无画框 -->
    <img
      v-if="poster"
      class="stage-poster"
      :src="poster"
      :alt="name"
      :class="{ hidden: isPlaying }"
    />

    <!-- 播放：复古画框 + 框内轻融合（比纯 CSS 或纯边框更自然） -->
    <div class="stage-reel" :class="{ active: isPlaying }" :aria-hidden="!isPlaying">
      <div class="reel-frame">
        <span class="reel-corner tl" />
        <span class="reel-corner tr" />
        <span class="reel-corner bl" />
        <span class="reel-corner br" />

        <div class="reel-paper">
          <div class="reel-screen">
            <video
              v-if="src && !failed"
              ref="videoEl"
              class="stage-video-el"
              :src="resolvedSrc"
              muted
              playsinline
              preload="metadata"
              @loadeddata="onLoaded"
              @playing="onPlaying"
              @pause="onPause"
              @ended="onEnded"
              @error="onError"
            />
            <div class="reel-vignette" />
          </div>
          <p v-if="name" class="reel-caption">{{ name }} · 1995</p>
        </div>
      </div>
    </div>

    <div v-if="loading && !failed" class="stage-loading" aria-hidden="true">
      <span class="loading-ring" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    src?: string;
    poster?: string;
    name?: string;
    accent?: string;
  }>(),
  {
    accent: "#c9a96e",
  },
);

const emit = defineEmits<{
  failed: [];
}>();

const videoEl = ref<HTMLVideoElement | null>(null);
const loading = ref(false);
const isPlaying = ref(false);
const failed = ref(false);
const retryCount = ref(0);

const resolvedSrc = computed(() => resolveMediaUrl(props.src ?? ""));
const frameStyle = computed(() => ({
  "--accent": props.accent,
  "--stage-canvas": "var(--stage-canvas, #faf8f5)",
}));

function resolveMediaUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

function setupVideoElement(el: HTMLVideoElement) {
  el.muted = true;
  el.defaultMuted = true;
  el.loop = false;
  el.playsInline = true;
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
}

async function prepareVideo() {
  if (!props.src || failed.value) {
    return;
  }

  await nextTick();
  const el = videoEl.value;
  if (!el) {
    return;
  }

  setupVideoElement(el);
  el.pause();
  el.currentTime = 0;

  if (el.readyState < 1) {
    loading.value = true;
    el.load();
  } else {
    loading.value = false;
  }
}

async function startPlayback() {
  if (!props.src || failed.value) {
    return;
  }

  loading.value = true;
  await nextTick();

  const el = videoEl.value;
  if (!el) {
    loading.value = false;
    return;
  }

  setupVideoElement(el);

  try {
    if (el.readyState < 2) {
      el.load();
    }
    el.currentTime = 0;
    await el.play();
  } catch {
    /* 保持立绘 */
  } finally {
    loading.value = false;
  }
}

function onLoaded() {
  loading.value = false;
  const el = videoEl.value;
  if (el && !isPlaying.value) {
    el.pause();
    el.currentTime = 0;
  }
}

function onPlaying() {
  isPlaying.value = true;
  loading.value = false;
}

function onPause() {
  const el = videoEl.value;
  if (el && !el.ended) {
    isPlaying.value = false;
  }
}

function onEnded() {
  const el = videoEl.value;
  if (el) {
    el.pause();
    el.currentTime = 0;
  }
  isPlaying.value = false;
}

function onError() {
  if (retryCount.value < 1) {
    retryCount.value += 1;
    void prepareVideo();
    return;
  }
  failed.value = true;
  loading.value = false;
  emit("failed");
}

function handleTap() {
  if (isPlaying.value) {
    return;
  }
  void startPlayback();
}

function reset() {
  failed.value = false;
  retryCount.value = 0;
  loading.value = false;
  isPlaying.value = false;
}

function stop() {
  const el = videoEl.value;
  if (el) {
    el.pause();
    el.currentTime = 0;
  }
  isPlaying.value = false;
}

watch(
  () => props.src,
  () => {
    reset();
    void prepareVideo();
  },
  { flush: "post" },
);

watch(videoEl, (el) => {
  if (el) {
    void prepareVideo();
  }
});

onMounted(() => {
  void prepareVideo();
});

defineExpose({ play: startPlayback, stop });
</script>

<style scoped>
.stage-video {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}

/* —— 待机立绘 —— */
.stage-poster {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  padding: 0 0 0.5rem;
  filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.22));
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.stage-poster.hidden {
  opacity: 0;
  transform: scale(0.98);
  pointer-events: none;
}

/* —— 播放画框：仅在 is-playing 时显现 —— */
.stage-reel {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 0.35rem 0.65rem;
  opacity: 0;
  transform: translateY(10px) scale(0.97);
  pointer-events: none;
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.stage-reel.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.reel-frame {
  position: relative;
  width: min(92%, 300px);
  padding: 0.45rem;
  background: linear-gradient(
    145deg,
    rgba(255, 252, 247, 0.98) 0%,
    rgba(250, 245, 238, 0.95) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.55);
  box-shadow:
    0 10px 36px rgba(61, 41, 20, 0.14),
    0 2px 0 rgba(255, 255, 255, 0.85) inset,
    0 0 0 3px rgba(201, 169, 110, 0.12);
}

.reel-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: var(--accent, #c9a96e);
  border-style: solid;
  opacity: 0.85;
}

.reel-corner.tl {
  top: 5px;
  left: 5px;
  border-width: 2px 0 0 2px;
}

.reel-corner.tr {
  top: 5px;
  right: 5px;
  border-width: 2px 2px 0 0;
}

.reel-corner.bl {
  bottom: 5px;
  left: 5px;
  border-width: 0 0 2px 2px;
}

.reel-corner.br {
  right: 5px;
  bottom: 5px;
  border-width: 0 2px 2px 0;
}

.reel-paper {
  padding: 0.35rem 0.35rem 0.5rem;
  background: var(--stage-canvas, #faf8f5);
  border: 1px solid rgba(201, 169, 110, 0.28);
}

.reel-screen {
  position: relative;
  overflow: hidden;
  aspect-ratio: 9 / 14;
  max-height: min(46vh, 360px);
  background: var(--stage-canvas, #faf8f5);
}

.stage-video-el {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  /* 仅在画框内做轻量融合，减轻棚拍背景突兀感 */
  mix-blend-mode: multiply;
  opacity: 0.94;
}

.reel-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      rgba(250, 248, 245, 0.2) 0%,
      transparent 12%,
      transparent 78%,
      rgba(61, 41, 20, 0.08) 100%
    ),
    radial-gradient(
      ellipse 88% 90% at 50% 50%,
      transparent 52%,
      rgba(250, 248, 245, 0.35) 100%
    );
}

.reel-caption {
  margin: 0.45rem 0 0;
  color: #8b7355;
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-align: center;
}

.stage-loading {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.loading-ring {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(201, 169, 110, 0.25);
  border-top-color: var(--accent, #c9a96e);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
