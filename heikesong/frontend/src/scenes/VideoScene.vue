<template>
  <section class="video-fullscreen">
    <video
      v-if="!hasVideoError"
      ref="videoRef"
      :key="node.src"
      class="fullscreen-video"
      :src="node.src"
      autoplay
      playsinline
      preload="auto"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @error="hasVideoError = true"
      @loadeddata="videoLoaded = true"
      @click="togglePlay"
    />

    <div v-else class="video-fallback-full">
      <p>未找到视频文件：{{ node.src }}</p>
      <button class="skip-btn" type="button" @click="emitComplete">继续</button>
    </div>

    <Transition name="subtitle-fade">
      <div v-if="subtitleParts" class="subtitle-overlay">
        <span class="subtitle-col subtitle-label">{{ subtitleParts[0] }}</span>
        <span class="subtitle-divider"></span>
        <span class="subtitle-col subtitle-name">{{ subtitleParts[1] }}</span>
      </div>
    </Transition>

    <Transition name="lottery-pop">
      <button
        v-if="showLotteryBtn"
        class="lottery-btn"
        type="button"
        @click="emit('lottery')"
      >
        🎁 新手大礼包
      </button>
    </Transition>

    <Transition name="lottery-pop">
      <button
        v-if="showPauseBtn && node.pauseAction !== '777-page'"
        class="pause-action-btn"
        type="button"
        @click="onPauseBtnClick"
      >
        {{ node.pauseLabel || '继续' }}
      </button>
    </Transition>

    <Transition name="lottery-pop">
      <button
        v-if="showPauseBtn && node.pauseAction === '777-page'"
        class="phone-hotspot"
        type="button"
        @click="onPauseBtnClick"
      />
    </Transition>

    <Transition name="choices-fade">
      <div v-if="showPauseChoices && props.node.pauseChoices?.length" class="pause-choices">
        <button
          v-for="opt in props.node.pauseChoices"
          :key="opt.id"
          class="pause-choice-btn"
          type="button"
          @click="onPauseChoiceClick(opt.next)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Transition>

    <Transition name="choices-fade">
      <div v-if="isHolding && props.holdChoices?.length" class="hold-choices">
        <button
          v-for="opt in props.holdChoices"
          :key="opt.id"
          class="hold-choice-btn"
          type="button"
          @click="emit('choose', opt.id)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Transition>

    <button v-if="!isHolding && !showLotteryBtn && !showPauseChoices" class="skip-btn" type="button" @click="emitComplete">
      点击此处跳过剧情
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { VideoNode } from "@/engine/types";

const emit = defineEmits<{
  complete: [];
  hold: [];
  choose: [optionId: string];
  lottery: [];
  pauseAction: [action: string];
  pauseChoice: [nextNodeId: string];
}>();

const props = defineProps<{
  node: VideoNode;
  holdChoices?: Array<{ id: string; label: string }>;
}>();

const hasVideoError = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const videoLoaded = ref(false);
const activeSubtitle = ref("");
const isHolding = ref(false);
const showLotteryBtn = ref(false);
const showPauseBtn = ref(false);
const showPauseChoices = ref(false);
let triggered = false;
let lotteryTriggered = false;
let pauseTriggered = false;

const subtitleParts = computed(() => {
  if (!activeSubtitle.value) return null;
  const parts = activeSubtitle.value.split("|");
  if (parts.length === 2) return parts;
  return null;
});

function emitComplete() {
  emit("complete");
}

function onEnded() {
  if (triggered) return;
  triggered = true;

  if (props.node.pauseAction && !props.node.pauseAt) {
    showPauseBtn.value = true;
  } else if (props.node.holdOnEnd) {
    isHolding.value = true;
    emit("hold");
  } else {
    emitComplete();
  }
}

function onTimeUpdate() {
  const video = videoRef.value;
  if (!video) return;

  if (!triggered) {
    const triggerTime = props.node.triggerTime;
    if (triggerTime && video.currentTime >= triggerTime) {
      triggered = true;
      video.pause();
      emitComplete();
      return;
    }
  }

  if (!lotteryTriggered && props.node.lotteryAt) {
    if (video.currentTime >= props.node.lotteryAt) {
      lotteryTriggered = true;
      video.pause();
      showLotteryBtn.value = true;
    }
  }

  if (!pauseTriggered && props.node.pauseAt) {
    if (video.currentTime >= props.node.pauseAt) {
      pauseTriggered = true;
      video.pause();
      if (props.node.pauseChoices?.length) {
        showPauseChoices.value = true;
      } else if (!props.node.pauseAction && !props.node.pauseLabel) {
        emitComplete();
      } else {
        showPauseBtn.value = true;
      }
    }
  }

  const subs = props.node.subtitles;
  if (subs) {
    const t = video.currentTime;
    const active = subs.find(
      (s) => t >= s.time && t < s.time + (s.duration ?? 3)
    );
    activeSubtitle.value = active?.text ?? "";
  }
}

function resumePlay() {
  showLotteryBtn.value = false;
  const video = videoRef.value;
  if (video) {
    video.play();
  }
}

function togglePlay() {
  const video = videoRef.value;
  if (!video || showLotteryBtn.value || showPauseBtn.value || showPauseChoices.value || showPhoneIframe.value) return;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function onPauseBtnClick() {
  showPauseBtn.value = false;
  if (props.node.pauseAction) {
    emit("pauseAction", props.node.pauseAction);
  } else {
    emitComplete();
  }
}

function onPauseChoiceClick(nextNodeId: string) {
  showPauseChoices.value = false;
  emit("pauseChoice", nextNodeId);
}

defineExpose({ resumePlay });

watch(
  () => props.node.src,
  () => {
    hasVideoError.value = false;
    triggered = false;
    lotteryTriggered = false;
    pauseTriggered = false;
    activeSubtitle.value = "";
    isHolding.value = false;
    showLotteryBtn.value = false;
    showPauseBtn.value = false;
    showPauseChoices.value = false;
  },
);
</script>

<style scoped>
.video-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-video {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transition: filter 0.8s ease;
}

.lottery-btn {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 24px 56px;
  background: linear-gradient(135deg, #ff6b9d, #c44dff);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow:
    0 0 20px rgba(255, 107, 157, 0.6),
    0 0 40px rgba(196, 77, 255, 0.3);
  animation: shake 0.6s ease-in-out infinite;
  z-index: 10;
}

.lottery-btn:hover {
  transform: translateX(-50%) scale(1.08);
  box-shadow:
    0 0 30px rgba(255, 107, 157, 0.8),
    0 0 60px rgba(196, 77, 255, 0.5);
}

@keyframes shake {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  20% { transform: translateX(-50%) rotate(-2deg); }
  40% { transform: translateX(-50%) rotate(2deg); }
  60% { transform: translateX(-50%) rotate(-1deg); }
  80% { transform: translateX(-50%) rotate(1deg); }
}

.pause-action-btn {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 24px 56px;
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 40px;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow:
    0 0 20px rgba(0, 198, 255, 0.6),
    0 0 40px rgba(0, 114, 255, 0.3);
  animation: shake 0.6s ease-in-out infinite;
  z-index: 10;
}

.pause-action-btn:hover {
  transform: translateX(-50%) scale(1.08);
  box-shadow:
    0 0 30px rgba(0, 198, 255, 0.8),
    0 0 60px rgba(0, 114, 255, 0.5);
}

.phone-hotspot {
  position: absolute;
  top: 8%;
  left: 38%;
  width: 26%;
  height: 82%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  cursor: pointer;
  z-index: 10;
  animation: hotspot-pulse 1.5s ease-in-out infinite;
}

@keyframes hotspot-pulse {
  0%, 100% { border-color: rgba(255, 255, 255, 0.4); }
  50% { border-color: rgba(255, 255, 255, 0.8); }
}

.lottery-pop-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lottery-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.lottery-pop-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.5);
}

.lottery-pop-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.8);
}

.hold-choices {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 80px;
}

.hold-choice-btn {
  padding: 28px 72px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 32px;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.hold-choice-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.pause-choices {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 80px;
}

.pause-choice-btn {
  padding: 28px 72px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 32px;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.pause-choice-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.choices-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.choices-fade-leave-active {
  transition: opacity 0.3s ease;
}

.choices-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

.choices-fade-leave-to {
  opacity: 0;
}

.skip-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.video-fallback-full {
  text-align: center;
  color: #aaa;
  font-size: 1rem;
}

.video-fallback-full p {
  margin-bottom: 16px;
}

.subtitle-overlay {
  position: absolute;
  top: 50%;
  right: 12%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 14px;
  pointer-events: none;
}

.subtitle-col {
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  writing-mode: vertical-rl;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 10px rgba(255, 107, 157, 0.8),
    0 0 20px rgba(255, 107, 157, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.8);
}

.subtitle-name {
  font-size: 2rem;
}

.subtitle-divider {
  width: 2px;
  height: 80px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 6px rgba(255, 107, 157, 0.5);
}

.subtitle-fade-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.subtitle-fade-leave-active {
  transition: opacity 0.4s ease;
}

.subtitle-fade-enter-from {
  opacity: 0;
  transform: translateY(-40%) scale(0.9);
}

.subtitle-fade-leave-to {
  opacity: 0;
}

.lottery-fade-enter-active {
  transition: opacity 0.4s ease;
}

.lottery-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lottery-fade-enter-from,
.lottery-fade-leave-to {
  opacity: 0;
}
</style>
