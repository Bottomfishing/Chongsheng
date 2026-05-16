<template>
  <div
    class="stage-video"
    :class="{ 'is-playing': isPlaying, 'is-failed': failed }"
    @click="handleTap"
  >
    <img
      v-if="poster"
      class="stage-poster"
      :src="poster"
      :alt="name"
      :class="{ hidden: isPlaying }"
    />

    <video
      v-if="src && !failed"
      ref="videoEl"
      class="stage-video-el"
      :src="resolvedSrc"
      muted
      loop
      playsinline
      preload="metadata"
      @loadeddata="onLoaded"
      @playing="onPlaying"
      @pause="onPause"
      @error="onError"
    />

    <div v-if="loading && !failed" class="stage-loading" aria-hidden="true">
      <span class="loading-ring" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

const props = defineProps<{
  src?: string;
  poster?: string;
  name?: string;
}>();

const emit = defineEmits<{
  failed: [];
}>();

const videoEl = ref<HTMLVideoElement | null>(null);
const loading = ref(false);
const isPlaying = ref(false);
const failed = ref(false);
const retryCount = ref(0);

const resolvedSrc = computed(() => resolveMediaUrl(props.src ?? ""));

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
  el.playsInline = true;
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
}

/** 仅预加载并停在第一帧，不自动播放 */
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
    /* 播放失败时保持立绘 */
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
  if (!isPlaying.value) {
    void startPlayback();
  }
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

.stage-poster,
.stage-video-el {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.stage-poster {
  z-index: 2;
  padding: 0 0 0.5rem;
  filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.25));
  transition: opacity 0.35s ease;
}

.stage-poster.hidden {
  opacity: 0;
  pointer-events: none;
}

.stage-video-el {
  z-index: 1;
  padding: 0 0 0.5rem;
  background: transparent;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.stage-video.is-playing .stage-video-el {
  opacity: 1;
}

.stage-loading {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.loading-ring {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(201, 169, 110, 0.25);
  border-top-color: #c9a96e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
