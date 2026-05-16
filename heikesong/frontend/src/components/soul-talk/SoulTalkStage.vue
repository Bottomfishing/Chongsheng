<template>
  <div class="soul-theater" :style="theaterStyle">
    <div ref="bubbleLayerRef" class="bubble-layer">
      <TransitionGroup name="bubble" tag="div" class="bubble-stack">
        <div
          v-for="message in messages"
          :key="message.id"
          class="speech-wrap"
          :class="message.role"
        >
          <div class="speech-bubble" :class="message.role">
            <span v-if="message.role === 'assistant'" class="speaker-name">
              {{ characterName }}
            </span>
            <p>{{ message.content }}</p>
          </div>
        </div>

        <div v-if="isTyping" key="typing" class="speech-wrap assistant">
          <div class="speech-bubble assistant typing">
            <span class="speaker-name">{{ characterName }}</span>
            <span class="typing-dots"><span /><span /><span /></span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <Transition name="portrait-fade" mode="out-in">
      <div :key="characterId" class="character-anchor">
        <CharacterPortrait
          :name="characterName"
          :symbol="characterSymbol"
          :portrait="characterPortrait"
          :accent="accent"
          :accent-soft="accentSoft"
          variant="stage"
        />
        <div class="character-meta">
          <span class="meta-name">{{ characterName }}</span>
          <span class="meta-role">{{ characterRole }}</span>
        </div>
      </div>
    </Transition>

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
        <button class="composer-send" type="submit" :disabled="disabled || sending || !draft.trim()">
          {{ sending ? "…" : "发送" }}
        </button>
      </form>
      <p class="composer-hint">按 Enter 发送 · 对话气泡将出现在角色头部位置</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import CharacterPortrait from "@/components/soul-talk/CharacterPortrait.vue";
import type { ChatMessage } from "@/types/soulTalk";

const props = defineProps<{
  characterId: string;
  characterName: string;
  characterSymbol: string;
  characterRole: string;
  characterPortrait: string;
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
}>();

const theaterStyle = computed(() => ({
  "--accent": props.accent,
  "--accent-soft": props.accentSoft,
}));

const draft = ref("");
const bubbleLayerRef = ref<HTMLElement | null>(null);

async function scrollBubbles() {
  await nextTick();
  const el = bubbleLayerRef.value;
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
}

function handleSubmit() {
  const text = draft.value.trim();
  if (!text || props.disabled || props.sending) {
    return;
  }
  emit("send", text);
  draft.value = "";
}

watch(
  () => [props.messages.length, props.isTyping],
  () => {
    scrollBubbles();
  },
  { flush: "post" },
);
</script>

<style scoped>
.soul-theater {
  --accent: #c9a96e;
  --accent-soft: rgba(201, 169, 110, 0.14);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: min(72vh, 720px);
  margin: 0 auto;
}

/* 头部气泡区 */
.bubble-layer {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 20;
  width: min(92%, 520px);
  max-height: 38%;
  padding: 0.5rem 0.25rem 0;
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateX(-50%);
  scrollbar-width: thin;
  mask-image: linear-gradient(180deg, transparent, #000 12%, #000 92%, transparent);
}

.bubble-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding-bottom: 0.5rem;
}

.speech-wrap {
  display: flex;
  width: 100%;
  max-width: 420px;
}

.speech-wrap.assistant {
  justify-content: center;
}

.speech-wrap.user {
  justify-content: flex-end;
  padding-right: 0.5rem;
}

.speech-bubble {
  position: relative;
  max-width: 100%;
  padding: 0.7rem 1rem 0.85rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(61, 41, 20, 0.1);
}

.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -10px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
}

.speech-bubble.assistant {
  color: #3d2914;
  background: rgba(255, 252, 247, 0.96);
  border: 1px solid rgba(201, 169, 110, 0.45);
}

.speech-bubble.assistant::after {
  left: 50%;
  transform: translateX(-50%);
  border-top-color: rgba(255, 252, 247, 0.96);
  filter: drop-shadow(0 1px 0 rgba(201, 169, 110, 0.35));
}

.speech-bubble.user {
  color: #faf8f5;
  background: linear-gradient(135deg, #5c4033 0%, #3d2914 100%);
  border: 1px solid rgba(61, 41, 20, 0.2);
}

.speech-bubble.user::after {
  right: 28%;
  border-top-color: #3d2914;
}

.speaker-name {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--accent);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
}

.speech-bubble.user .speaker-name {
  display: none;
}

.speech-bubble p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.65;
  text-align: left;
}

.speech-bubble.typing {
  min-width: 80px;
}

.typing-dots {
  display: inline-flex;
  gap: 0.3rem;
  padding-top: 0.15rem;
}

.typing-dots span {
  width: 6px;
  height: 6px;
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
    opacity: 0.4;
  }

  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* 居中人物 */
.character-anchor {
  position: relative;
  z-index: 10;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  max-width: 420px;
  min-height: 0;
  padding-top: clamp(120px, 28vh, 200px);
  margin-top: auto;
}

.character-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin-top: 0.35rem;
  padding-bottom: 0.5rem;
}

.meta-name {
  color: #3d2914;
  font-size: 0.95rem;
  letter-spacing: 0.25em;
}

.meta-role {
  color: #8b7355;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
}

/* 脚下输入框 */
.feet-composer {
  position: relative;
  z-index: 25;
  flex-shrink: 0;
  width: min(100%, 480px);
  padding: 0.75rem 0 0.25rem;
}

.composer-form {
  display: flex;
  gap: 0.6rem;
  align-items: flex-end;
  padding: 0.65rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(61, 41, 20, 0.1);
}

.composer-input {
  flex: 1;
  resize: none;
  padding: 0.55rem 0.65rem;
  color: #3d2914;
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  background: #fff;
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 8px;
}

.composer-input:focus {
  outline: none;
  border-color: #c9a96e;
}

.composer-send {
  flex-shrink: 0;
  min-width: 64px;
  padding: 0.6rem 1rem;
  color: #faf8f5;
  font-size: 0.88rem;
  letter-spacing: 0.15em;
  background: linear-gradient(135deg, #5c4033 0%, #3d2914 100%);
  border: none;
  border-radius: 8px;
}

.composer-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.composer-hint {
  margin: 0.4rem 0 0;
  color: #a08060;
  font-size: 0.68rem;
  text-align: center;
  letter-spacing: 0.04em;
}

.bubble-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.bubble-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.bubble-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.bubble-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.portrait-fade-enter-active,
.portrait-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.portrait-fade-enter-from,
.portrait-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 600px) {
  .bubble-layer {
    max-height: 42%;
    width: 96%;
  }

  .character-anchor {
    max-width: 100%;
    padding-top: clamp(100px, 32vh, 180px);
  }

  .speech-wrap.user {
    padding-right: 0;
  }
}
</style>
