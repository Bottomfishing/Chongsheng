<template>
  <div
    class="character-wheel"
    role="tablist"
    aria-label="选择倾诉对象"
    @wheel.prevent="onWheel"
  >
    <div class="wheel-stage">
      <div class="wheel-plate" aria-hidden="true">
        <div class="wheel-arc-glow" />
        <div class="wheel-arc-track" />
      </div>

      <!-- 炫酷中心枢纽（固定不随拨盘旋转） -->
      <div class="wheel-nexus" aria-hidden="false">
        <div class="nexus-aura" />
        <div class="nexus-ring nexus-ring--outer" />
        <div class="nexus-ring nexus-ring--mid" />
        <div class="nexus-ring nexus-ring--inner" />
        <div class="nexus-core">
          <span class="nexus-gem">&#10022;</span>
          <p class="nexus-kicker">Soul · 1995</p>
          <p class="nexus-name">{{ activeCharacter?.name }}</p>
          <div class="nexus-actions">
            <button
              type="button"
              class="nexus-btn"
              aria-label="上一位"
              @click="step(-1)"
            >
              &#8249;
            </button>
            <span class="nexus-index">{{ activeIndex + 1 }}/{{ characters.length }}</span>
            <button
              type="button"
              class="nexus-btn"
              aria-label="下一位"
              @click="step(1)"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>

      <!-- 两侧空位：装饰用，不可切换 -->
      <div
        v-for="ghost in ghostSlots"
        :key="ghost.id"
        class="wheel-ghost"
        :style="ghostStyle(ghost.angle)"
        aria-hidden="true"
      >
        <div class="ghost-portrait">
          <span class="ghost-silhouette" />
          <span class="ghost-lock" aria-hidden="true">&#10022;</span>
        </div>
        <span class="ghost-label">{{ ghost.label }}</span>
      </div>

      <div class="wheel-pointer" aria-hidden="true">
        <span class="pointer-beam" />
        <span class="pointer-gem">&#10022;</span>
      </div>

      <div
        class="wheel-dial"
        :style="{ transform: `rotate(${dialRotation}deg)` }"
      >
        <button
          v-for="(character, index) in characters"
          :key="character.id"
          type="button"
          class="wheel-slot"
          :class="{ active: character.id === activeId }"
          :style="slotStyle(index, character)"
          role="tab"
          :aria-selected="character.id === activeId"
          :aria-label="character.name"
          @click="select(character.id)"
        >
          <CharacterPortrait
            class="wheel-portrait"
            :name="character.name"
            :symbol="character.symbol"
            :portrait="character.portrait"
            :accent="character.accent"
            :accent-soft="character.accentSoft"
            variant="thumb"
          />
          <span class="wheel-name">{{ character.name }}</span>
          <span
            v-if="(messageCounts?.[character.id] ?? 0) > 0"
            class="wheel-dot"
            :title="`已有 ${messageCounts?.[character.id]} 条对话`"
          />
        </button>
      </div>
    </div>

    <p class="wheel-foot-hint">滚轮 · 点击头像切换 · 两侧虚位敬请期待</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import CharacterPortrait from "@/components/soul-talk/CharacterPortrait.vue";
import type { DigitalHuman } from "@/types/soulTalk";

const props = defineProps<{
  characters: DigitalHuman[];
  activeId: string;
  messageCounts?: Record<string, number>;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();

/** 四角色分布弧段；两侧 ghost 占更大弧端 */
const ARC_CHAR_START = 16;
const ARC_CHAR_END = 74;
const GHOST_ANGLE_START = 4;
const GHOST_ANGLE_END = 86;
const POINTER_ANGLE = 38;
const DESKTOP_RADIUS = 264;
const MOBILE_RADIUS = 216;

const ghostSlots = [
  { id: "ghost-start", angle: GHOST_ANGLE_START, label: "虚位" },
  { id: "ghost-end", angle: GHOST_ANGLE_END, label: "虚位" },
] as const;

const radius = ref(DESKTOP_RADIUS);

function syncRadius() {
  radius.value = window.innerWidth <= 720 ? MOBILE_RADIUS : DESKTOP_RADIUS;
}

onMounted(() => {
  syncRadius();
  window.addEventListener("resize", syncRadius, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", syncRadius);
});

const activeIndex = computed(() => {
  const idx = props.characters.findIndex((c) => c.id === props.activeId);
  return idx >= 0 ? idx : 0;
});

const activeCharacter = computed(
  () => props.characters[activeIndex.value] ?? props.characters[0],
);

const slotAngles = computed(() => {
  const n = props.characters.length;
  if (n <= 1) {
    return [POINTER_ANGLE];
  }
  const angleStep = (ARC_CHAR_END - ARC_CHAR_START) / (n - 1);
  return props.characters.map((_, i) => ARC_CHAR_START + i * angleStep);
});

const dialRotation = computed(
  () => POINTER_ANGLE - slotAngles.value[activeIndex.value],
);

function ghostStyle(angle: number) {
  return {
    transform: `rotate(${angle}deg) translateX(${radius.value}px) rotate(${-angle}deg)`,
  };
}

function slotStyle(index: number, character: DigitalHuman) {
  const angle = slotAngles.value[index];
  return {
    "--accent": character.accent,
    transform: `rotate(${angle}deg) translateX(${radius.value}px) rotate(${-angle - dialRotation.value}deg)`,
  };
}

function select(id: string) {
  emit("select", id);
}

function step(delta: number) {
  const n = props.characters.length;
  if (!n) {
    return;
  }
  const next = (activeIndex.value + delta + n) % n;
  emit("select", props.characters[next].id);
}

function onWheel(e: WheelEvent) {
  step(e.deltaY > 0 ? 1 : -1);
}
</script>

<style scoped>
.character-wheel {
  --wheel-radius: 264px;
  --portrait-size: 72px;
  --portrait-active: 80px;
  --slot-half: 44px;
  --nexus-size: clamp(7.5rem, 28%, 8.75rem);
  --wheel-size: calc(var(--wheel-radius) + var(--portrait-active) + 3.5rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  max-width: var(--wheel-size);
  flex-shrink: 0;
  z-index: 1;
  touch-action: pan-y;
  isolation: isolate;
}

.wheel-stage {
  position: relative;
  width: 100%;
  max-width: var(--wheel-size);
  aspect-ratio: 1;
  height: auto;
  margin: 0 auto;
}

.wheel-plate {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(18, 14, 8, 0.96) 0%,
    rgba(32, 24, 14, 0.92) 55%,
    rgba(45, 34, 20, 0.9) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.55);
  border-radius: 0 0 100% 0;
  box-shadow:
    0 0 32px rgba(201, 169, 110, 0.18),
    10px 10px 40px rgba(10, 8, 4, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.wheel-arc-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(201, 169, 110, 0.32),
      transparent 55%
    ),
    conic-gradient(
      from 0deg at 0% 0%,
      transparent 0deg,
      rgba(201, 169, 110, 0.1) 8deg,
      rgba(201, 169, 110, 0.28) 45deg,
      rgba(201, 169, 110, 0.32) 78deg,
      rgba(201, 169, 110, 0.1) 88deg,
      transparent 94deg
    );
  border-radius: 0 0 100% 0;
  pointer-events: none;
}

.wheel-arc-track {
  position: absolute;
  inset: 12%;
  border: 1px dashed rgba(201, 169, 110, 0.22);
  border-radius: 0 0 100% 0;
  border-top: none;
  border-left: none;
  pointer-events: none;
}

/* —— 中心枢纽 —— */
.wheel-nexus {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 6;
  width: var(--nexus-size);
  height: var(--nexus-size);
  pointer-events: none;
}

.nexus-aura {
  position: absolute;
  inset: -18%;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(201, 169, 110, 0.35),
    transparent 62%
  );
  filter: blur(8px);
  animation: nexus-breathe 3.5s ease-in-out infinite;
}

.nexus-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 110, 0.35);
  pointer-events: none;
}

.nexus-ring--outer {
  inset: 2%;
  border-style: dashed;
  opacity: 0.55;
  animation: nexus-spin 24s linear infinite;
}

.nexus-ring--mid {
  inset: 14%;
  border-width: 2px;
  border-color: rgba(232, 213, 163, 0.25);
  box-shadow:
    0 0 20px rgba(201, 169, 110, 0.15),
    inset 0 0 16px rgba(201, 169, 110, 0.08);
  animation: nexus-spin 16s linear infinite reverse;
}

.nexus-ring--inner {
  inset: 26%;
  border-color: rgba(201, 169, 110, 0.5);
  animation: nexus-spin 10s linear infinite;
}

.nexus-core {
  position: absolute;
  inset: 32%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.12rem;
  text-align: center;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(45, 34, 20, 0.95) 0%,
    rgba(18, 14, 8, 0.98) 70%
  );
  border: 1px solid rgba(201, 169, 110, 0.55);
  border-radius: 50%;
  box-shadow:
    0 0 28px rgba(201, 169, 110, 0.35),
    inset 0 0 20px rgba(201, 169, 110, 0.12);
  pointer-events: auto;
}

.nexus-gem {
  color: #e8d5a3;
  font-size: 0.75rem;
  text-shadow: 0 0 10px rgba(201, 169, 110, 0.8);
  animation: gem-flicker 2.2s ease-in-out infinite;
}

.nexus-kicker {
  margin: 0;
  color: rgba(201, 169, 110, 0.65);
  font-size: 0.45rem;
  letter-spacing: 0.2em;
  line-height: 1.2;
}

.nexus-name {
  margin: 0;
  max-width: 92%;
  color: #fff8e7;
  font-family: var(--font-display, "LXGW WenKai", "KaiTi", serif);
  font-size: clamp(0.62rem, 2.2vw, 0.78rem);
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 0 12px rgba(201, 169, 110, 0.45);
}

.nexus-actions {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.15rem;
}

.nexus-btn {
  display: grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  padding: 0;
  color: #e8d5a3;
  font-size: 0.85rem;
  line-height: 1;
  background: rgba(201, 169, 110, 0.15);
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.nexus-btn:hover {
  background: rgba(201, 169, 110, 0.32);
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.35);
}

.nexus-index {
  min-width: 1.8rem;
  color: rgba(232, 213, 163, 0.8);
  font-size: 0.5rem;
  font-family: monospace;
  letter-spacing: 0.06em;
}

@keyframes nexus-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes nexus-breathe {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes gem-flicker {
  0%,
  100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
    filter: brightness(1.2);
  }
}

/* —— 两侧虚位（固定，不随拨盘转） —— */
.wheel-ghost {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.22rem;
  width: calc(var(--slot-half) * 2);
  margin-left: calc(var(--slot-half) * -1);
  margin-top: calc(var(--slot-half) * -1);
  pointer-events: none;
  opacity: 0.55;
}

.ghost-portrait {
  position: relative;
  display: grid;
  place-items: center;
  width: calc(var(--portrait-size) * 0.82);
  height: calc(var(--portrait-size) * 0.82);
  border-radius: 50%;
  background: repeating-linear-gradient(
    -45deg,
    rgba(201, 169, 110, 0.06),
    rgba(201, 169, 110, 0.06) 4px,
    rgba(30, 24, 14, 0.5) 4px,
    rgba(30, 24, 14, 0.5) 8px
  );
  border: 2px dashed rgba(201, 169, 110, 0.28);
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.35);
}

.ghost-silhouette {
  width: 42%;
  height: 52%;
  border-radius: 50% 50% 42% 42%;
  background: linear-gradient(
    180deg,
    rgba(201, 169, 110, 0.2) 0%,
    rgba(201, 169, 110, 0.05) 100%
  );
  opacity: 0.5;
}

.ghost-lock {
  position: absolute;
  bottom: 8%;
  right: 12%;
  color: rgba(201, 169, 110, 0.45);
  font-size: 0.45rem;
}

.ghost-label {
  color: rgba(201, 169, 110, 0.45);
  font-size: 0.58rem;
  letter-spacing: 0.16em;
}

.wheel-dial {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 0;
  height: 0;
  transform-origin: 0 0;
  transition: transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.wheel-slot {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.28rem;
  width: calc(var(--slot-half) * 2);
  margin-left: calc(var(--slot-half) * -1);
  margin-top: calc(var(--slot-half) * -1);
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transform-origin: center center;
  transition:
    filter 0.3s ease,
    opacity 0.3s ease;
}

.wheel-portrait {
  width: var(--portrait-size);
  height: var(--portrait-size);
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(201, 169, 110, 0.4);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  transition:
    transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1),
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    width 0.35s ease,
    height 0.35s ease;
}

.wheel-slot.active .wheel-portrait {
  width: var(--portrait-active);
  height: var(--portrait-active);
  border-width: 3px;
  border-color: var(--accent, #c9a96e);
  box-shadow:
    0 0 20px color-mix(in srgb, var(--accent, #c9a96e) 55%, transparent),
    0 8px 24px rgba(0, 0, 0, 0.45);
  transform: scale(1.06);
}

.wheel-slot:not(.active) {
  opacity: 0.82;
}

.wheel-slot:not(.active):hover {
  opacity: 1;
}

.wheel-slot:not(.active):hover .wheel-portrait {
  border-color: rgba(201, 169, 110, 0.7);
  transform: scale(1.04);
}

.wheel-name {
  max-width: 88px;
  color: #e8d5a3;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
}

.wheel-slot.active .wheel-name {
  color: #fff8e7;
  font-size: 0.78rem;
  font-weight: 600;
}

.wheel-dot {
  position: absolute;
  top: 4px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: var(--accent, #c9a96e);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent, #c9a96e);
}

.wheel-pointer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 0;
  height: 0;
  transform: rotate(38deg) translateX(var(--wheel-radius));
  transform-origin: 0 0;
  pointer-events: none;
}

.pointer-beam {
  position: absolute;
  left: -1px;
  top: -1px;
  width: 2px;
  height: calc(var(--wheel-radius) * 0.42);
  margin-top: -4px;
  margin-left: -1px;
  background: linear-gradient(
    to bottom,
    rgba(201, 169, 110, 0.85),
    transparent
  );
  filter: blur(0.5px);
  transform-origin: top center;
  animation: beam-pulse 2s ease-in-out infinite;
}

.pointer-gem {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: -11px;
  margin-top: -11px;
  color: #1a1408;
  font-size: 0.65rem;
  background: linear-gradient(180deg, #e8d5a3, #c9a96e);
  border-radius: 50%;
  box-shadow: 0 0 14px rgba(201, 169, 110, 0.85);
  animation: pointer-pulse 2s ease-in-out infinite;
}

@keyframes pointer-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
}

@keyframes beam-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.wheel-foot-hint {
  margin: 0;
  text-align: center;
  color: rgba(201, 169, 110, 0.5);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
}

@media (max-width: 720px) {
  .character-wheel {
    --wheel-radius: 216px;
    --portrait-size: 60px;
    --portrait-active: 68px;
    --slot-half: 38px;
    --nexus-size: 6.75rem;
  }

  .wheel-foot-hint {
    font-size: 0.52rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wheel-dial,
  .nexus-ring,
  .nexus-aura,
  .nexus-gem,
  .pointer-gem,
  .pointer-beam {
    animation: none;
  }
}
</style>
