<template>
  <div class="chat-panel">
    <div ref="listRef" class="chat-list">
      <div
        v-for="message in messages"
        :key="message.id"
        class="chat-row"
        :class="message.role"
      >
        <div v-if="message.role === 'assistant'" class="bubble-avatar">
          <img
            v-if="avatarSrc && !avatarExhausted"
            :key="avatarSrc"
            :src="avatarSrc"
            :alt="characterName"
            class="avatar-img"
            @error="onAvatarError"
          />
          <span v-else>{{ characterSymbol }}</span>
        </div>
        <div class="bubble" :class="message.role">
          <p>{{ message.content }}</p>
        </div>
      </div>

      <div v-if="isTyping" class="chat-row assistant">
        <div class="bubble-avatar">
          <img
            v-if="avatarSrc && !avatarExhausted"
            :key="`typing-${avatarSrc}`"
            :src="avatarSrc"
            :alt="characterName"
            class="avatar-img"
            @error="onAvatarError"
          />
          <span v-else>{{ characterSymbol }}</span>
        </div>
        <div class="bubble assistant typing">
          <span /><span /><span />
        </div>
      </div>
    </div>

    <form class="chat-composer" @submit.prevent="handleSubmit">
      <textarea
        v-model="draft"
        class="chat-input"
        rows="2"
        :placeholder="placeholder"
        :disabled="disabled"
        @keydown.enter.exact.prevent="handleSubmit"
      />
      <button class="send-btn" type="submit" :disabled="disabled || !draft.trim()">
        {{ sending ? "发送中" : "发送" }}
      </button>
    </form>

    <p class="api-hint">
      <span class="hint-dot" />
      当前为演示对话；接入真实 API 后即可与角色实时倾诉。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { getPortraitCandidates } from "@/utils/portrait";
import type { ChatMessage } from "@/types/soulTalk";

const props = defineProps<{
  messages: ChatMessage[];
  characterName: string;
  characterSymbol: string;
  characterPortrait?: string;
  isTyping: boolean;
  sending: boolean;
  disabled?: boolean;
  placeholder?: string;
}>();

const avatarCandidates = computed(() =>
  props.characterPortrait ? getPortraitCandidates(props.characterPortrait) : [],
);
const avatarIndex = ref(0);
const avatarExhausted = ref(false);

const avatarSrc = computed(() => avatarCandidates.value[avatarIndex.value] ?? "");

watch(
  () => props.characterPortrait,
  () => {
    avatarIndex.value = 0;
    avatarExhausted.value = false;
  },
);

function onAvatarError() {
  if (avatarIndex.value < avatarCandidates.value.length - 1) {
    avatarIndex.value += 1;
    return;
  }
  avatarExhausted.value = true;
}

const emit = defineEmits<{
  send: [text: string];
}>();

const draft = ref("");
const listRef = ref<HTMLElement | null>(null);

async function scrollToBottom() {
  await nextTick();
  const el = listRef.value;
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
    scrollToBottom();
  },
  { flush: "post" },
);
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 10px;
  overflow: hidden;
}

.chat-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 220px;
  max-height: min(52vh, 480px);
  padding: 1rem;
  overflow-y: auto;
}

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.chat-row.user {
  justify-content: flex-end;
}

.bubble-avatar {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 32px;
  height: 32px;
  overflow: hidden;
  color: #8b6b5a;
  font-size: 0.7rem;
  background: rgba(201, 169, 110, 0.15);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 50%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.bubble {
  max-width: min(88%, 420px);
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
}

.bubble p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.65;
}

.bubble.assistant {
  color: #3d2914;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(201, 169, 110, 0.22);
  border-bottom-left-radius: 4px;
}

.bubble.user {
  color: #faf8f5;
  background: linear-gradient(135deg, #5c4033 0%, #3d2914 100%);
  border-bottom-right-radius: 4px;
}

.bubble.typing {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 52px;
  min-height: 36px;
}

.bubble.typing span {
  width: 6px;
  height: 6px;
  background: #c9a96e;
  border-radius: 50%;
  animation: bounce 1.2s ease-in-out infinite;
}

.bubble.typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.bubble.typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-composer {
  display: flex;
  gap: 0.65rem;
  align-items: flex-end;
  padding: 0.75rem;
  border-top: 1px solid rgba(201, 169, 110, 0.2);
  background: rgba(250, 248, 245, 0.9);
}

.chat-input {
  flex: 1;
  resize: none;
  padding: 0.65rem 0.75rem;
  color: #3d2914;
  font: inherit;
  font-size: 0.88rem;
  line-height: 1.5;
  background: #fff;
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 8px;
}

.chat-input:focus {
  outline: none;
  border-color: #c9a96e;
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  flex-shrink: 0;
  padding: 0.65rem 1.1rem;
  color: #faf8f5;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #5c4033 0%, #3d2914 100%);
  border: none;
  border-radius: 8px;
  transition: opacity 0.2s ease;
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.api-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0.5rem 0.85rem 0.65rem;
  color: #8b7355;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  background: rgba(250, 248, 245, 0.85);
}

.hint-dot {
  width: 6px;
  height: 6px;
  background: #c9a96e;
  border-radius: 50%;
}
</style>
