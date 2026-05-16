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
          :class="[currentLine.role, { 'is-typing-text': showTypewriter }]"
        >
          <span class="speaker-name">
            {{ currentLine.role === "assistant" ? characterName : "你" }}
          </span>
          <p>
            {{ bubbleText }}<span v-if="showTypewriter && typewriterActive" class="type-cursor">|</span>
          </p>
        </div>
      </Transition>
    </div>

    <!-- 居中人物 -->
    <div
      class="character-stage"
      @mousemove="handleSpotlightMove"
      @mouseleave="handleSpotlightLeave"
      @dblclick="handleStageDblClick"
    >
      <button
        class="stage-arrow arrow-left"
        type="button"
        aria-label="上一个人物"
        @click="$emit('prev')"
      >
        <span aria-hidden="true">&#8249;</span>
      </button>

      <Transition name="character-slide" mode="out-in">
        <div :key="characterId" class="character-anchor">
          <div class="character-spotlight" aria-hidden="true" />
          <CharacterPortrait
            ref="portraitRef"
            :name="characterName"
            :symbol="characterSymbol"
            :portrait="characterPortrait"
            :animation="characterAnimation"
            :accent="accent"
            :accent-soft="accentSoft"
            variant="stage"
          />
        </div>
      </Transition>

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
        <div class="composer-box">
          <textarea
            v-model="draft"
            class="composer-input"
            rows="2"
            :placeholder="placeholder"
            :disabled="disabled || sending"
            @keydown.enter.exact.prevent="handleSubmit"
          />
        </div>
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
import { computed, ref, watch } from "vue";
import type { ComponentPublicInstance } from "vue";
import CharacterPortrait from "@/components/soul-talk/CharacterPortrait.vue";
import { useTypewriter } from "@/composables/useTypewriter";
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

const bubbleSource = computed(() => currentLine.value?.content ?? "");

const enableTypewriter = computed(
  () => !props.isTyping && currentLine.value?.role === "assistant",
);

const { displayed: typewriterText, isTyping: typewriterActive } = useTypewriter(
  bubbleSource,
  {
    enabled: enableTypewriter,
    charDelay: 30,
  },
);

const bubbleText = computed(() => {
  if (!currentLine.value) {
    return "";
  }
  if (currentLine.value.role === "user" || props.isTyping) {
    return currentLine.value.content;
  }
  return typewriterText.value;
});

const showTypewriter = computed(
  () => enableTypewriter.value && currentLine.value?.role === "assistant",
);

function handleStageDblClick() {
  playCharacterVideo();
}

watch(
  () => props.isTyping,
  (typing) => {
    if (!typing && currentLine.value?.role === "assistant") {
      playCharacterVideo();
    }
  },
);

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
  --stage-canvas: #faf8f5;
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: stretch;
  width: 100%;
  min-height: min(78vh, 760px);
  max-width: min(100%, 520px);
  margin: 0 auto;
  gap: 0;
}

/* 头顶气泡槽 */
.bubble-slot {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
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
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  min-height: 0;
  align-self: stretch;
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

/* 脚下输入 — 与画框/气泡统一的纸质感 */
.feet-composer {
  z-index: 25;
  width: 100%;
  max-width: 100%;
  justify-self: stretch;
  padding: 0.75rem 0 0.15rem;
  box-sizing: border-box;
}

.composer-form {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.55rem;
  width: 100%;
  box-sizing: border-box;
}

.composer-box {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  padding: 0.42rem;
  background: linear-gradient(
    165deg,
    rgba(255, 252, 247, 0.98) 0%,
    rgba(248, 242, 232, 0.96) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.42);
  border-radius: 18px;
  box-shadow:
    0 10px 28px rgba(61, 41, 20, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.composer-box::before,
.composer-box::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--accent, #c9a96e);
  border-style: solid;
  opacity: 0.55;
  pointer-events: none;
}

.composer-box::before {
  top: 7px;
  left: 7px;
  border-width: 2px 0 0 2px;
}

.composer-box::after {
  right: 7px;
  bottom: 7px;
  border-width: 0 2px 2px 0;
}

.composer-input {
  display: block;
  width: 100%;
  min-height: 2.75rem;
  max-height: 6.5rem;
  resize: none;
  padding: 0.55rem 0.65rem;
  color: #3d2914;
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.55;
  background: var(--stage-canvas, #faf8f5);
  border: 1px solid rgba(201, 169, 110, 0.22);
  border-radius: 13px;
  box-shadow: inset 0 1px 3px rgba(61, 41, 20, 0.05);
  box-sizing: border-box;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.composer-input::placeholder {
  color: #a08060;
  opacity: 0.85;
}

.composer-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.95);
  box-shadow:
    inset 0 1px 3px rgba(61, 41, 20, 0.05),
    0 0 0 2px var(--accent-soft, rgba(201, 169, 110, 0.2));
}

.composer-input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.composer-send {
  flex-shrink: 0;
  align-self: stretch;
  min-width: 4.5rem;
  padding: 0 1.1rem;
  border-radius: 14px;
  color: #fffef9;
  font: inherit;
  font-size: 0.86rem;
  letter-spacing: 0.18em;
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--accent, #c9a96e) 88%, #fff) 0%,
    color-mix(in srgb, var(--accent, #c9a96e) 70%, #5c4033) 100%
  );
  border: 1px solid color-mix(in srgb, var(--accent, #c9a96e) 55%, #3d2914);
  box-shadow:
    0 6px 18px rgba(61, 41, 20, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.composer-send:hover:not(:disabled) {
  filter: brightness(1.05);
  box-shadow:
    0 5px 14px rgba(61, 41, 20, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.composer-send:active:not(:disabled) {
  transform: translateY(0);
}

.composer-send:disabled {
  color: rgba(255, 254, 249, 0.75);
  background: linear-gradient(165deg, #c4b8a8 0%, #a89888 100%);
  border-color: rgba(139, 115, 85, 0.25);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
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

.character-slide-enter-active,
.character-slide-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.character-slide-enter-from {
  opacity: 0;
  transform: translateX(18px) scale(0.98);
}

.character-slide-leave-to {
  opacity: 0;
  transform: translateX(-18px) scale(0.98);
}

.type-cursor {
  margin-left: 1px;
  color: var(--accent);
  animation: cursor-blink 0.9s step-end infinite;
}

@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}

.speech-bubble.is-typing-text p {
  min-height: 1.5em;
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

  .composer-send {
    min-width: 3.75rem;
    padding: 0 0.85rem;
    font-size: 0.82rem;
  }
}
</style>
