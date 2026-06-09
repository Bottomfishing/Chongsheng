<template>
  <Transition name="dialog">
    <div v-if="isOpen" class="chat-overlay" @click.self="closeDialog">
      <div class="chat-dialog">
        <div class="dialog-header">
          <div class="header-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
            </svg>
          </div>
          <div class="header-info">
            <span class="header-name">抖小音</span>
            <span class="header-status">在线</span>
          </div>
          <button class="close-btn" @click="closeDialog">×</button>
        </div>

        <div class="dialog-messages" ref="messagesContainer">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="{ user: msg.role === 'user', assistant: msg.role === 'assistant' }"
          >
            <div class="message-avatar" v-if="msg.role === 'assistant'">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </div>
            <div class="message-bubble">
              <div v-if="msg.isTyping" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <template v-else>{{ msg.content }}</template>
            </div>
          </div>
        </div>

        <div class="dialog-quick-replies" v-if="messages.length <= 1">
          <button
            v-for="reply in quickReplies"
            :key="reply"
            class="quick-reply"
            @click="sendQuickReply(reply)"
          >
            {{ reply }}
          </button>
        </div>

        <div class="dialog-input">
          <input
            v-model="inputText"
            type="text"
            placeholder="说点什么..."
            @keyup.enter="sendMessage"
            :disabled="isLoading"
          />
          <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputText.trim()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '嗨！我是抖小音～有什么我可以帮你的吗？😊'
  }
]);

const inputText = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const quickReplies = [
  '你是谁？',
  '讲个笑话',
  '推荐一首歌',
  '今天天气怎么样'
];

const localReplies = [
  '我在呢～这台机器现在就是你的九十年代小宇宙。',
  '今天适合大胆一点：先拍一条，再改一条，顶流都是试出来的。',
  '给你一个主意：把老街、录像厅和抖音热梗混在一起，反差感会很强。',
  '如果心里没底，就先走剧情模式，那里会把节奏带起来。',
  '笑话来了：1995 年最大的流量密码是什么？答：你带来的手机。',
];

function closeDialog() {
  emit('close');
}

async function sendMessage() {
  const text = inputText.value.trim();
  if (!text || isLoading.value) return;

  messages.value.push({
    role: 'user',
    content: text
  });
  inputText.value = '';
  isLoading.value = true;

  messages.value.push({
    role: 'assistant',
    content: '',
    isTyping: true
  });

  scrollToBottom();

  try {
    await new Promise((resolve) => setTimeout(resolve, 550 + Math.random() * 450));
    
    messages.value = messages.value.filter(m => !m.isTyping);

    messages.value.push({
      role: 'assistant',
      content: localReplies[Math.floor(Math.random() * localReplies.length)]
    });
  } catch (error) {
    messages.value = messages.value.filter(m => !m.isTyping);
    messages.value.push({
      role: 'assistant',
      content: '我这边刚刚走神了，再发一次我继续陪你聊。'
    });
  }

  isLoading.value = false;
  scrollToBottom();
}

function sendQuickReply(text: string) {
  inputText.value = text;
  sendMessage();
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    scrollToBottom();
  }
});
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10300;
  backdrop-filter: blur(4px);
}

.chat-dialog {
  width: 380px;
  max-width: 90vw;
  max-height: 70vh;
  background: linear-gradient(145deg, #ffffff 0%, #f8f4f0 100%);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%);
  color: white;
}

.header-avatar {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-avatar svg {
  width: 24px;
  height: 24px;
  color: #fe2c55;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-name {
  font-weight: 600;
  font-size: 16px;
}

.header-status {
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.dialog-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 85%;
}

.message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-avatar svg {
  width: 18px;
  height: 18px;
  color: white;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
  background: #f0ebe6;
  color: #333;
  border-bottom-left-radius: 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typingBounce 1.2s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.dialog-quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 20px 12px;
}

.quick-reply {
  padding: 8px 14px;
  background: white;
  border: 1px solid #e0d8d0;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-reply:hover {
  background: linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%);
  color: white;
  border-color: transparent;
  transform: scale(1.05);
}

.dialog-input {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #f0ebe6;
}

.dialog-input input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #f0ebe6;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.dialog-input input:focus {
  border-color: #fe2c55;
}

.dialog-input input:disabled {
  background: #f5f5f5;
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.send-btn svg {
  width: 20px;
  height: 20px;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(254, 44, 85, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .chat-dialog,
.dialog-leave-to .chat-dialog {
  transform: scale(0.9) translateY(20px);
}
</style>
