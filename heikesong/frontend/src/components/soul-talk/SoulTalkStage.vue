<template>
  <div class="soul-theater" :style="theaterStyle">
    <!-- 头顶：仅一条当前台词气泡 -->
    <div class="bubble-slot">
      <Transition name="bubble" mode="out-in">
        <div
          v-if="isTyping"
          key="typing"
          class="speech-bubble assistant typing"
        >
          <span class="speaker-name">{{ characterName }}</span>
          <span class="typing-dots"><span /><span /><span /></span>
        </div>

        <div
          v-else-if="currentLine"
          :key="currentLine.id"
          class="speech-bubble"
          :class="currentLine.role"
        >
          <span class="speaker-name">
            {{ currentLine.role === "assistant" ? characterName : "你" }}
          </span>
          <p>{{ currentLine.content }}</p>
        </div>
      </Transition>
    </div>

    <!-- 居中人物 -->
    <div class="character-stage" @mousemove="handleSpotlightMove" @mouseleave="handleSpotlightLeave">
      <button
        class="stage-arrow arrow-left"
        type="button"
        aria-label="上一个人物"
        @click="$emit('prev')"
      >
        <span aria-hidden="true">&#8249;</span>
      </button>

      <div class="character-anchor">
        <div class="character-spotlight" aria-hidden="true" />
        <CharacterPortrait
          ref="portraitRef"
          :key="characterId"
          :name="characterName"
          :symbol="characterSymbol"
          :portrait="characterPortrait"
          :animation="characterAnimation"
          :accent="accent"
          :accent-soft="accentSoft"
          variant="stage"
        />
      </div>

      <button
        class="stage-arrow arrow-right"
        type="button"
        aria-label="下一个人物"
        @click="$emit('next')"
      >
        <span aria-hidden="true">&#8250;</span>
      </button>
    </div>

    <!-- 脚下输入 -->
    <div class="feet-composer">
      <form class="composer-form" @submit.prevent="handleSubmit">
        <textarea
          v-model="draft"
          class="composer-input"
          rows="2"
          :placeholder="placeholder"
          :disabled="disabled || sending"
          @keydown.enter.exact.prevent="handleSubmit"
        />
        <button
          class="composer-send"
          type="submit"
          :disabled="disabled || sending || !draft.trim()"
        >
          {{ sending ? "…" : "发送" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ComponentPublicInstance } from "vue";
import CharacterPortrait from "@/components/soul-talk/CharacterPortrait.vue";
import type { ChatMessage } from "@/types/soulTalk";

const props = defineProps<{
  characterId: string;
  characterName: string;
  characterSymbol: string;
  characterRole: string;
  characterPortrait: string;
  characterAnimation?: string;
  accent: string;
  accentSoft: string;
  messages: ChatMessage[];
  isTyping: boolean;
  sending: boolean;
  disabled?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  send: [text: string];
  prev: [];
  next: [];
}>();

const theaterStyle = computed(() => ({
  "--accent": props.accent,
  "--accent-soft": props.accentSoft,
}));

const portraitRef = ref<ComponentPublicInstance<{ play: () => void; stop: () => void }> | null>(null);
const draft = ref("");

function playCharacterVideo() {
  portraitRef.value?.play?.();
}

function stopCharacterVideo() {
  portraitRef.value?.stop?.();
}

defineExpose({ playCharacterVideo, stopCharacterVideo });

/** 头顶只展示最新一条对话 */
const currentLine = computed(() => {
  if (!props.messages.length) {
    return null;
  }
  return props.messages[props.messages.length - 1];
});

function handleSubmit() {
  const text = draft.value.trim();
  if (!text || props.disabled || props.sending) {
    return;
  }
  emit("send", text);
  draft.value = "";
}

function handleSpotlightMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--spx", `${x}%`);
  el.style.setProperty("--spy", `${y}%`);
}

function handleSpotlightLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  if (!el) return;
  el.style.setProperty("--spx", "50%");
  el.style.setProperty("--spy", "100%");
}
</script>

<style scoped>
.soul-theater {
  --accent: #c9a96e;
  --accent-soft: rgba(201, 169, 110, 0.14);
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: end;
  width: 100%;
  min-height: min(78vh, 760px);
  max-width: 460px;
  margin: 0 auto;
  gap: 0;
}

/* 头顶气泡槽 */
.bubble-slot {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 88px;
  padding: 0 0.5rem 0.35rem;
  z-index: 20;
}

.speech-bubble {
  position: relative;
  width: min(100%, 400px);
  padding: 0.75rem 1.1rem 0.9rem;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(61, 41, 20, 0.12);
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -11px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border: 11px solid transparent;
}

.speech-bubble.assistant {
  color: #3d2914;
  background: rgba(255, 252, 247, 0.97);
  border: 1px solid rgba(201, 169, 110, 0.5);
}

.speech-bubble.assistant::after {
  border-top-color: rgba(255, 252, 247, 0.97);
  filter: drop-shadow(0 1px 0 rgba(201, 169, 110, 0.3));
}

.speech-bubble.user {
  color: #faf8f5;
  background: linear-gradient(145deg, #5c4033 0%, #3d2914 100%);
  border: 1px solid rgba(61, 41, 20, 0.25);
}

.speech-bubble.user::after {
  border-top-color: #3d2914;
}

.speaker-name {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
}

.speech-bubble.assistant .speaker-name {
  color: var(--accent);
}

.speech-bubble.user .speaker-name {
  color: rgba(255, 255, 255, 0.75);
}

.speech-bubble p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  text-align: left;
}

.speech-bubble.typing {
  min-width: 100px;
}

.typing-dots {
  display: inline-flex;
  gap: 0.35rem;
  padding-top: 0.1rem;
}

.typing-dots span {
  width: 7px;
  height: 7px;
  background: var(--accent);
  border-radius: 50%;
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }

  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

/* 人物舞台 */
.character-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
}

.stage-arrow {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #8b7355;
  font-size: 1.8rem;
  line-height: 1;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(61, 41, 20, 0.12);
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stage-arrow:hover {
  color: #3d2914;
  background: rgba(255, 255, 255, 0.98);
  border-color: #c9a96e;
  box-shadow: 0 6px 20px rgba(201, 169, 110, 0.25);
  transform: translateY(-50%) scale(1.12);
}

.stage-arrow:active {
  transform: translateY(-50%) scale(0.92);
  transition-duration: 0.08s;
}

.stage-arrow.arrow-left {
  left: 0.5rem;
}

.stage-arrow.arrow-right {
  right: 0.5rem;
}

.stage-arrow span {
  display: block;
  margin-top: -2px;
}

/* 人物区 */
.character-anchor {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: 0;
  padding-bottom: 0.25rem;
}

.character-spotlight {
  position: absolute;
  bottom: 0;
  left: 50%;
  z-index: 0;
  width: min(100%, 380px);
  height: 85%;
  background: transparent;
  border-radius: 50% 50% 0 0;
  transform: translateX(-50%);
  pointer-events: none;
}

.character-anchor :deep(.portrait-shell) {
  position: relative;
  z-index: 1;
}

/* 脚下输入 */
.feet-composer {
  z-index: 25;
  width: 100%;
  padding: 0.5rem 0 0;
}

.composer-form {
  display: flex;
  gap: 0.55rem;
  align-items: flex-end;
  padding: 0.6rem 0.65rem;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(201, 169, 110, 0.5);
  border-radius: 14px;
  box-shadow: 0 10px 32px rgba(61, 41, 20, 0.1);
}

.composer-input {
  flex: 1;
  resize: none;
  padding: 0.6rem 0.7rem;
  color: #3d2914;
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  background: #fff;
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 10px;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.composer-input:focus {
  outline: none;
  border-color: #c9a96e;
  box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.15), 0 2px 8px rgba(201, 169, 110, 0.1);
}

.composer-send {
  flex-shrink: 0;
  min-width: 68px;
  padding: 0.62rem 1.05rem;
  color: #faf8f5;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  background: linear-gradient(145deg, #5c4033 0%, #3d2914 100%);
  border: none;
  border-radius: 10px;
}

.composer-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.bubble-enter-active,
.bubble-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.bubble-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

.bubble-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.portrait-fade-enter-active,
.portrait-fade-leave-active {
  transition:
    opacity 0.32s ease,
    transform 0.32s ease;
}

.portrait-fade-enter-from,
.portrait-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 600px) {
  .soul-theater {
    min-height: min(82vh, 680px);
    max-width: 100%;
  }

  .bubble-slot {
    min-height: 76px;
  }

  .speech-bubble {
    width: 100%;
  }
}
</style>
