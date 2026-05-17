<template>
  <Teleport to="body">
    <div
      class="walking-tiktok"
      :class="[
        currentState,
        { dragging: isDragging, landed: isLanded, celebrating: isCelebrating },
      ]"
      :style="positionStyle"
      @mousedown="startDrag"
    >
      <div class="tiktok-body">
        <div class="tiktok-head">
          <svg class="tiktok-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
            />
          </svg>
          <div class="tiktok-eyes">
            <span class="eye eye-left"></span>
            <span class="eye eye-right"></span>
          </div>
          <div class="eye-brow left-brow" :class="{ raised: isThinking }"></div>
          <div
            class="eye-brow right-brow"
            :class="{ raised: isThinking }"
          ></div>
        </div>
        <div class="thinking-bubble" v-if="isThinking">
          <div class="thought-content">
            <span class="thought-dot" v-for="n in 3" :key="n"></span>
          </div>
        </div>
        <div
          class="mood-indicator"
          v-if="!isThinking && !isWalking && !isDragging && !isCelebrating"
        >
          <span class="mood-emoji">{{ moodEmoji }}</span>
        </div>
        <div class="celebration-effect" v-if="isCelebrating">
          <span class="confetti" v-for="i in 8" :key="i"></span>
          <span class="star" v-for="i in 4" :key="'star' + i"></span>
        </div>
      </div>
      <div class="tiktok-legs">
        <div
          class="leg leg-left"
          :class="{ stepping: isWalking && !isDragging }"
        ></div>
        <div
          class="leg leg-right"
          :class="{ stepping: isWalking && !isDragging }"
        ></div>
      </div>
      <div
        class="tiktok-shadow"
        :class="{ walking: isWalking && !isDragging, dragging: isDragging }"
      ></div>
      <div class="click-hint" v-if="!isDragging">拖拽/点击</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    /** 距视口底部的行走高度，应对齐首页 footer-menu 高度 */
    groundOffset?: number;
  }>(),
  {
    groundOffset: 52,
  },
);

const emit = defineEmits<{
  (e: "click"): void;
}>();

const isWalking = ref(false);
const isThinking = ref(false);
const isDragging = ref(false);
const isDragged = ref(false);
const isLanded = ref(false);
const isCelebrating = ref(false);
const isSleeping = ref(false);
const isWaving = ref(false);
const position = ref(-60);
const topPosition = ref<number | null>(null);

const moodIndex = ref(0);
const moods = [
  { emoji: "😊", name: "happy" },
  { emoji: "😄", name: "excited" },
  { emoji: "🤔", name: "thinking" },
  { emoji: "😌", name: "relaxed" },
  { emoji: "🧐", name: "curious" },
  { emoji: "😴", name: "sleepy" },
  { emoji: "🥳", name: "party" },
  { emoji: "😎", name: "cool" },
  { emoji: "🤗", name: "hug" },
  { emoji: "😇", name: "angel" },
];
const moodEmoji = computed(() => moods[moodIndex.value].emoji);
const currentMood = computed(() => moods[moodIndex.value].name);

let clickCount = 0;
let lastClickTime = 0;
let secretCode = "";
const secretCodeTarget = "1234";

const positionStyle = computed(() => {
  const style: Record<string, string> = {
    left: position.value + "px",
  };
  if (topPosition.value !== null) {
    style.top = topPosition.value + "px";
    style.bottom = "auto";
  } else {
    style.bottom = `${props.groundOffset}px`;
  }
  return style;
});

let animationFrame: number | null = null;
let stateTimeout: number | null = null;
let moodInterval: number | null = null;
let physicsFrame: number | null = null;

const speed = 0.5;
const tiktokWidth = 60;

let velocityX = 0;
let velocityY = 0;
const gravity = 0.6;
const bounce = 0.7;
const friction = 0.995; // 降低摩擦，滑行更远
const DRAG_THRESHOLD = 8;

function getWalkBottom(): number {
  return props.groundOffset;
}

let dragOffsetX = 0;
let dragOffsetY = 0;
let pointerStartX = 0;
let pointerStartY = 0;
let lastX = 0;
let lastY = 0;
let lastTime = 0;

const currentState = ref("idle");

function getRandomTime(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickNextState(): string {
  const weights = { idle: 2, thinking: 2, walking: 4, sleeping: 1, waving: 1 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [state, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return state;
  }
  return "walking";
}

function setState(state: string) {
  currentState.value = state;

  switch (state) {
    case "walking":
      isWalking.value = true;
      isThinking.value = false;
      isSleeping.value = false;
      isWaving.value = false;
      break;
    case "thinking":
      isWalking.value = false;
      isThinking.value = true;
      isSleeping.value = false;
      isWaving.value = false;
      break;
    case "sleeping":
      isWalking.value = false;
      isThinking.value = false;
      isSleeping.value = true;
      isWaving.value = false;
      break;
    case "waving":
      isWalking.value = false;
      isThinking.value = false;
      isSleeping.value = false;
      isWaving.value = true;
      break;
    case "idle":
    default:
      isWalking.value = false;
      isThinking.value = false;
      isSleeping.value = false;
      isWaving.value = false;
      break;
  }

  scheduleNextState();
}

function scheduleNextState() {
  if (stateTimeout) clearTimeout(stateTimeout);
  if (isDragging.value) return;

  const nextState = pickNextState();
  let duration: number;

  switch (nextState) {
    case "walking":
      duration = getRandomTime(4000, 7000);
      break;
    case "thinking":
      duration = getRandomTime(2000, 4000);
      break;
    case "sleeping":
      duration = getRandomTime(5000, 10000);
      break;
    case "waving":
      duration = getRandomTime(2000, 3000);
      break;
    case "idle":
    default:
      duration = getRandomTime(1500, 3000);
      break;
  }

  stateTimeout = window.setTimeout(() => {
    if (!isDragging.value) {
      setState(nextState);
    }
  }, duration);
}

function gameLoop() {
  if (isDragging.value) return;

  const screenWidth = window.innerWidth;

  if (isWalking.value && topPosition.value === null) {
    if (position.value < screenWidth - tiktokWidth - 20) {
      position.value += speed;
    } else {
      position.value = -tiktokWidth;
    }
  }

  animationFrame = requestAnimationFrame(gameLoop);
}

function startDrag(e: MouseEvent) {
  e.preventDefault();

  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  isDragged.value = false;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  if (stateTimeout) clearTimeout(stateTimeout);
  if (physicsFrame) cancelAnimationFrame(physicsFrame);

  isDragging.value = true;
  isLanded.value = false;
  isWalking.value = false;

  dragOffsetX = e.clientX - position.value;
  const currentTop =
    topPosition.value ?? window.innerHeight - getWalkBottom() - tiktokWidth;
  dragOffsetY = e.clientY - currentTop;

  velocityX = 0;
  velocityY = 0;
  lastX = e.clientX;
  lastY = e.clientY;
  lastTime = Date.now();

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", endDrag);
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return;

  const now = Date.now();
  const dt = now - lastTime;

  if (dt > 0) {
    // 计算实时速度（像素/毫秒）
    const vx = (e.clientX - lastX) / dt;
    const vy = (e.clientY - lastY) / dt;

    // 平滑更新速度，避免突变
    velocityX = velocityX * 0.7 + vx * 0.3;
    velocityY = velocityY * 0.7 + vy * 0.3;

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
  }

  const moved = Math.hypot(
    e.clientX - pointerStartX,
    e.clientY - pointerStartY,
  );
  if (moved < DRAG_THRESHOLD) {
    return;
  }

  if (!isDragged.value) {
    isDragged.value = true;
    topPosition.value =
      topPosition.value ?? window.innerHeight - getWalkBottom() - tiktokWidth;
  }

  position.value = e.clientX - dragOffsetX;
  topPosition.value = e.clientY - dragOffsetY;
}

function endDrag(e: MouseEvent) {
  if (!isDragging.value) return;

  const wasDrag = isDragged.value;
  isDragging.value = false;

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", endDrag);

  if (!wasDrag) {
    handleClick();
    topPosition.value = null;
    isDragged.value = false;
    resumeNormalBehavior();
    return;
  }

  // 直接使用拖拽过程中计算好的速度，乘以系数让效果更明显
  velocityX = velocityX * 16; // 转换为像素/帧（约16ms/帧）
  velocityY = velocityY * 16;
  startPhysics();
}

function handleClick() {
  const now = Date.now();
  const timeDiff = now - lastClickTime;

  if (timeDiff < 500) {
    clickCount++;
  } else {
    clickCount = 1;
  }
  lastClickTime = now;

  if (clickCount === 3) {
    triggerCelebration();
    clickCount = 0;
  } else if (clickCount === 5) {
    triggerSecretCode();
    clickCount = 0;
  }

  moodIndex.value = (moodIndex.value + 1) % moods.length;
  emit("click");
}

function triggerCelebration() {
  isCelebrating.value = true;
  setTimeout(() => {
    isCelebrating.value = false;
  }, 3000);
}

function triggerSecretCode() {
  moodIndex.value = 6;
  triggerCelebration();
}

function startPhysics() {
  if (physicsFrame) cancelAnimationFrame(physicsFrame);

  const screenHeight = window.innerHeight;

  function physicsLoop() {
    if (isDragging.value) return;

    velocityY += gravity;
    velocityX *= friction;

    position.value += velocityX;
    topPosition.value! += velocityY;

    const maxX = window.innerWidth - tiktokWidth - 20;
    if (position.value > maxX) {
      position.value = maxX;
      velocityX *= -bounce;
    }
    if (position.value < 20) {
      position.value = 20;
      velocityX *= -bounce;
    }

    const floorY = screenHeight - getWalkBottom() - tiktokWidth;
    if (topPosition.value! > floorY) {
      topPosition.value = floorY;
      velocityY *= -bounce;
      velocityX *= 0.9;

      if (Math.abs(velocityY) < 2) {
        velocityY = 0;
        isLanded.value = true;

        setTimeout(() => {
          if (!isDragging.value) {
            topPosition.value = null;
            isLanded.value = false;
            resumeNormalBehavior();
          }
        }, 2000);

        return;
      }
    }

    physicsFrame = requestAnimationFrame(physicsLoop);
  }

  physicsFrame = requestAnimationFrame(physicsLoop);
}

function resumeNormalBehavior() {
  setState("walking");
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(gameLoop);
  }
}

function updateMood() {
  moodIndex.value = (moodIndex.value + 1) % moods.length;
}

onMounted(() => {
  setState("walking");
  animationFrame = requestAnimationFrame(gameLoop);
  moodInterval = window.setInterval(updateMood, 3000);
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (stateTimeout) clearTimeout(stateTimeout);
  if (moodInterval) clearInterval(moodInterval);
  if (physicsFrame) cancelAnimationFrame(physicsFrame);

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", endDrag);
});
</script>

<style scoped>
.walking-tiktok {
  position: fixed;
  bottom: 52px;
  z-index: 10250;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  user-select: none;
  pointer-events: auto;
  touch-action: none;
  transition: transform 0.1s ease;
}

.walking-tiktok.dragging {
  cursor: grabbing;
  z-index: 10260;
}

.tiktok-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tiktok-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%);
  border-radius: 50%;
  box-shadow:
    0 3px 12px rgba(254, 44, 85, 0.35),
    0 0 25px rgba(37, 244, 238, 0.15),
    inset 0 2px 3px rgba(255, 255, 255, 0.4),
    inset 0 -2px 3px rgba(0, 0, 0, 0.1);
}

.walking-tiktok.walking .tiktok-head {
  animation: bodyBounce 0.3s ease-in-out infinite;
}

.walking-tiktok.thinking .tiktok-head {
  animation: thinkWobble 0.8s ease-in-out infinite;
}

.walking-tiktok.idle .tiktok-head {
  animation: idleSway 2s ease-in-out infinite;
}

.walking-tiktok.dragging .tiktok-head {
  animation: none;
  transform: scale(1.15);
  box-shadow:
    0 8px 25px rgba(254, 44, 85, 0.5),
    0 0 40px rgba(37, 244, 238, 0.3);
}

.walking-tiktok.landed .tiktok-head {
  animation: landSquish 0.3s ease-out;
}

.walking-tiktok.sleeping .tiktok-head {
  animation: sleepBounce 2s ease-in-out infinite;
  opacity: 0.8;
}

.walking-tiktok.waving .tiktok-head {
  animation: waveBounce 0.5s ease-in-out infinite;
}

.walking-tiktok.celebrating .tiktok-head {
  animation: celebrateJump 0.3s ease-in-out infinite;
  box-shadow:
    0 5px 20px rgba(254, 44, 85, 0.6),
    0 0 50px rgba(37, 244, 238, 0.4);
}

@keyframes bodyBounce {
  0%,
  100% {
    transform: translateY(0) scaleY(1);
  }
  50% {
    transform: translateY(-3px) scaleY(0.97);
  }
}

@keyframes thinkWobble {
  0%,
  100% {
    transform: rotate(-4deg) translateY(0);
  }
  25% {
    transform: rotate(4deg) translateY(-2px);
  }
  50% {
    transform: rotate(-4deg) translateY(0);
  }
  75% {
    transform: rotate(2deg) translateY(-1px);
  }
}

@keyframes idleSway {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@keyframes landSquish {
  0% {
    transform: scaleY(0.7) scaleX(1.3);
  }
  50% {
    transform: scaleY(1.2) scaleX(0.9);
  }
  100% {
    transform: scaleY(1) scaleX(1);
  }
}

@keyframes sleepBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes waveBounce {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes celebrateJump {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.1);
  }
}

.tiktok-icon {
  width: 18px;
  height: 18px;
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.tiktok-eyes {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
  margin-top: -2px;
}

.eye {
  width: 4px;
  height: 5px;
  background: white;
  border-radius: 50%;
  animation: blink 3s ease-in-out infinite;
}

.eye-left {
  animation-delay: 0.1s;
}

.walking-tiktok.walking .eye,
.walking-tiktok.dragging .eye {
  animation: none;
}

.walking-tiktok.thinking .eye {
  animation: thinkBlink 0.6s ease-in-out infinite;
}

@keyframes blink {
  0%,
  45%,
  55%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

@keyframes thinkBlink {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.3);
  }
}

.eye-brow {
  position: absolute;
  top: 8px;
  width: 5px;
  height: 2px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1px;
  transition: transform 0.3s ease;
}

.eye-brow.left-brow {
  left: 6px;
  transform: rotate(-15deg);
}

.eye-brow.right-brow {
  right: 6px;
  transform: rotate(15deg);
}

.eye-brow.raised {
  transform: translateY(-2px) rotate(-20deg);
}

.eye-brow.right-brow.raised {
  transform: translateY(-2px) rotate(20deg);
}

.tiktok-legs {
  display: flex;
  gap: 5px;
  margin-top: -2px;
}

.leg {
  width: 3px;
  height: 14px;
  background: linear-gradient(to bottom, #fe2c55, #25f4ee);
  border-radius: 0 0 2px 2px;
  transform-origin: top center;
}

.leg-left {
  margin-left: 5px;
}
.leg-right {
  margin-right: 5px;
}

.leg.stepping.leg-left {
  animation: legStepLeft 0.25s ease-in-out infinite;
}

.leg.stepping.leg-right {
  animation: legStepRight 0.25s ease-in-out infinite;
}

@keyframes legStepLeft {
  0%,
  100% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(15deg);
  }
}

@keyframes legStepRight {
  0%,
  100% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-15deg);
  }
}

.tiktok-shadow {
  width: 24px;
  height: 5px;
  margin-top: 3px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.5;
}

.tiktok-shadow.walking {
  animation: shadowPulse 0.3s ease-in-out infinite;
}

.tiktok-shadow.dragging {
  opacity: 0.8;
  transform: scale(1.5);
}

@keyframes shadowPulse {
  0%,
  100% {
    transform: scaleX(1);
    opacity: 0.5;
  }
  50% {
    transform: scaleX(0.85);
    opacity: 0.35;
  }
}

.thinking-bubble {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.thinking-bubble::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: white;
}

.thought-content {
  display: flex;
  gap: 4px;
}

.thought-dot {
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #fe2c55, #25f4ee);
  border-radius: 50%;
  animation: thoughtPop 0.7s ease-in-out infinite;
}

.thought-dot:nth-child(2) {
  animation-delay: 0.15s;
}
.thought-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes thoughtPop {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-5px) scale(1.2);
    opacity: 1;
  }
}

.mood-indicator {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  animation: moodPop 0.5s ease-out;
}

.mood-emoji {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

@keyframes moodPop {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.click-hint {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 11px;
  border-radius: 10px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.walking-tiktok:hover .click-hint {
  opacity: 1;
}

.walking-tiktok:hover .tiktok-head {
  animation: none;
  transform: scale(1.1);
}

.walking-tiktok.sleeping .eye {
  animation: sleepBlink 2s ease-in-out infinite;
}

@keyframes sleepBlink {
  0%,
  20%,
  100% {
    transform: scaleY(0.1);
  }
  10%,
  30% {
    transform: scaleY(1);
  }
}

.celebration-effect {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 80px;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: confettiFall 1.5s ease-out infinite;
}

.confetti:nth-child(1) {
  background: #fe2c55;
  left: 10%;
  animation-delay: 0s;
}
.confetti:nth-child(2) {
  background: #25f4ee;
  left: 25%;
  animation-delay: 0.1s;
}
.confetti:nth-child(3) {
  background: #ffeb3b;
  left: 40%;
  animation-delay: 0.2s;
}
.confetti:nth-child(4) {
  background: #4caf50;
  left: 55%;
  animation-delay: 0.3s;
}
.confetti:nth-child(5) {
  background: #2196f3;
  left: 70%;
  animation-delay: 0.4s;
}
.confetti:nth-child(6) {
  background: #9c27b0;
  left: 85%;
  animation-delay: 0.5s;
}
.confetti:nth-child(7) {
  background: #ff9800;
  left: 15%;
  animation-delay: 0.6s;
}
.confetti:nth-child(8) {
  background: #e91e63;
  left: 80%;
  animation-delay: 0.7s;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(60px) rotate(720deg);
    opacity: 0;
  }
}

.star {
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ffeb3b 0%, transparent 70%);
  border-radius: 50%;
  animation: starTwinkle 1s ease-in-out infinite;
}

.star:nth-child(1) {
  left: 20%;
  top: 10%;
  animation-delay: 0s;
}
.star:nth-child(2) {
  left: 70%;
  top: 20%;
  animation-delay: 0.2s;
}
.star:nth-child(3) {
  left: 45%;
  top: 5%;
  animation-delay: 0.4s;
}
.star:nth-child(4) {
  left: 85%;
  top: 35%;
  animation-delay: 0.6s;
}

@keyframes starTwinkle {
  0%,
  100% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
