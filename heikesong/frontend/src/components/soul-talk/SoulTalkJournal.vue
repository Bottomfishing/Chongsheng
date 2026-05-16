<template>
  <aside class="journal-panel">
    <header class="panel-head">
      <p class="panel-kicker">Memory</p>
      <h2 class="panel-title">心事记录</h2>
      <p class="panel-sub">与 {{ characterName }} 的对话</p>
    </header>

    <div ref="scrollRef" class="journal-scroll">
      <p v-if="!messages.length" class="journal-empty">
        还没有留言。选一位伙伴，说说你的心事吧。
      </p>
      <ul v-else class="journal-list">
        <li
          v-for="msg in messages"
          :key="msg.id"
          class="journal-item"
          :class="msg.role"
        >
          <span class="journal-label">
            {{ msg.role === "assistant" ? characterName : "你" }}
          </span>
          <p class="journal-text">{{ msg.content }}</p>
          <time class="journal-time">{{ formatTime(msg.createdAt) }}</time>
        </li>
      </ul>
    </div>

    <footer class="journal-hints">
      <p class="hints-title">小提示</p>
      <ul>
        <li>点击左侧人物，播放 TA 的动画</li>
        <li><kbd>←</kbd> <kbd>→</kbd> 切换倾诉对象</li>
        <li><kbd>Enter</kbd> 发送 · 双击舞台重播动画</li>
      </ul>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import type { ChatMessage } from "@/types/soulTalk";

const props = defineProps<{
  characterName: string;
  messages: ChatMessage[];
}>();

const scrollRef = ref<HTMLElement | null>(null);

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    const el = scrollRef.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  },
);
</script>

<style scoped>
.journal-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  height: 100%;
  min-height: 0;
}

.panel-head {
  flex-shrink: 0;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.28);
}

.panel-kicker {
  margin: 0 0 0.2rem;
  color: #b8924a;
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.panel-title {
  margin: 0;
  color: #3d2914;
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.2em;
}

.panel-sub {
  margin: 0.35rem 0 0;
  color: #8b7355;
  font-size: 0.75rem;
}

.journal-scroll {
  flex: 1;
  min-height: 120px;
  max-height: min(42vh, 420px);
  padding: 0.35rem 0.15rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(201, 169, 110, 0.45) transparent;
}

.journal-scroll::-webkit-scrollbar {
  width: 5px;
}

.journal-scroll::-webkit-scrollbar-thumb {
  background: rgba(201, 169, 110, 0.45);
  border-radius: 4px;
}

.journal-empty {
  margin: 0;
  padding: 1rem 0.5rem;
  color: #a08060;
  font-size: 0.82rem;
  line-height: 1.65;
  text-align: center;
}

.journal-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journal-item {
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(201, 169, 110, 0.22);
  background: rgba(255, 255, 255, 0.55);
}

.journal-item.user {
  background: rgba(92, 64, 51, 0.08);
  border-color: rgba(92, 64, 51, 0.15);
}

.journal-label {
  display: block;
  margin-bottom: 0.2rem;
  color: #8b7355;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
}

.journal-text {
  margin: 0;
  color: #3d2914;
  font-size: 0.8rem;
  line-height: 1.55;
}

.journal-time {
  display: block;
  margin-top: 0.25rem;
  color: #a08060;
  font-size: 0.62rem;
  font-family: monospace;
}

.journal-hints {
  flex-shrink: 0;
  padding: 0.75rem 0.85rem;
  background: rgba(255, 252, 247, 0.85);
  border: 1px dashed rgba(201, 169, 110, 0.4);
  border-radius: 10px;
}

.hints-title {
  margin: 0 0 0.4rem;
  color: #8b7355;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
}

.journal-hints ul {
  margin: 0;
  padding: 0 0 0 1rem;
  color: #6b5a48;
  font-size: 0.72rem;
  line-height: 1.55;
}

.journal-hints kbd {
  padding: 0.05rem 0.3rem;
  font-family: inherit;
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 4px;
}
</style>
