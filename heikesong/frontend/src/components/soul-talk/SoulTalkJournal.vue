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
        <li>滚轮切换左上角四位伙伴</li>
        <li>单击舞台人物，播放互动视频</li>
        <li><kbd>←</kbd> <kbd>→</kbd> 快捷切换 · <kbd>Enter</kbd> 发送</li>
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
  gap: 0.75rem;
  height: 100%;
  min-height: 0;
}

.panel-head {
  flex-shrink: 0;
  padding: 0.75rem 0.9rem;
  background: linear-gradient(180deg, #faf6ee 0%, #f3ebe0 100%);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 2px 8px rgba(61, 41, 20, 0.06);
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
  color: #2a1f12;
  font-family: "LXGW WenKai", "KaiTi", "楷体", serif;
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.2em;
}

.panel-sub {
  margin: 0.35rem 0 0;
  color: #7a6348;
  font-size: 0.75rem;
}

.journal-scroll {
  flex: 1;
  min-height: 120px;
  max-height: min(42vh, 420px);
  padding: 0.65rem 0.7rem;
  overflow-y: auto;
  background: #fffcf7;
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 12px;
  box-shadow:
    inset 0 2px 8px rgba(61, 41, 20, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  scrollbar-width: thin;
  scrollbar-color: rgba(201, 169, 110, 0.5) #f5efe6;
}

.journal-scroll::-webkit-scrollbar {
  width: 6px;
}

.journal-scroll::-webkit-scrollbar-track {
  background: #f5efe6;
  border-radius: 4px;
}

.journal-scroll::-webkit-scrollbar-thumb {
  background: rgba(201, 169, 110, 0.5);
  border-radius: 4px;
}

.journal-empty {
  margin: 0;
  padding: 1.25rem 0.75rem;
  color: #8b7355;
  font-size: 0.82rem;
  line-height: 1.65;
  text-align: center;
  background: #faf6ee;
  border-radius: 8px;
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
  padding: 0.6rem 0.7rem;
  border-radius: 10px;
  border: 1px solid rgba(201, 169, 110, 0.3);
  background: #faf6ee;
  box-shadow: 0 2px 6px rgba(61, 41, 20, 0.05);
}

.journal-item.assistant {
  border-left: 3px solid rgba(201, 169, 110, 0.65);
}

.journal-item.user {
  background: #f3ebe0;
  border-color: rgba(92, 64, 51, 0.22);
  border-left: 3px solid rgba(92, 64, 51, 0.45);
}

.journal-label {
  display: block;
  margin-bottom: 0.25rem;
  color: #8b7355;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
}

.journal-text {
  margin: 0;
  color: #3d2914;
  font-size: 0.8rem;
  line-height: 1.6;
}

.journal-time {
  display: block;
  margin-top: 0.3rem;
  color: #a08060;
  font-size: 0.62rem;
  font-family: monospace;
}

.journal-hints {
  flex-shrink: 0;
  padding: 0.75rem 0.9rem;
  background: linear-gradient(180deg, #f8f2e8 0%, #f0e6d6 100%);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 2px 8px rgba(61, 41, 20, 0.06);
}

.hints-title {
  margin: 0 0 0.4rem;
  color: #8b6914;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
}

.journal-hints ul {
  margin: 0;
  padding: 0 0 0 1rem;
  color: #5c4a38;
  font-size: 0.72rem;
  line-height: 1.6;
}

.journal-hints kbd {
  padding: 0.08rem 0.35rem;
  font-family: inherit;
  font-size: 0.68rem;
  color: #4a3828;
  background: #fffcf7;
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 4px;
  box-shadow: 0 1px 0 rgba(201, 169, 110, 0.2);
}
</style>
