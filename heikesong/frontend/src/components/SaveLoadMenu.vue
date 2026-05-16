<template>
  <Transition name="fade">
    <div v-if="visible" class="menu-overlay" @click.self="close">
      <div class="menu-panel">
        <div class="menu-header">
          <h2>{{ mode === "save" ? "保存游戏" : "读取游戏" }}</h2>
          <button class="close-btn" type="button" @click="close">&times;</button>
        </div>

        <div v-if="saves.length === 0" class="empty-state">
          <span class="empty-icon">&#10022;</span>
          <p>暂无存档</p>
        </div>

        <div v-else class="save-list">
          <div
            v-for="save in saves"
            :key="save.id"
            class="save-item"
            @click="handleAction(save.id)"
          >
            <div class="save-info">
              <div class="save-time">{{ formatTime(save.timestamp) }}</div>
              <div class="save-node">节点: {{ getNodeTitle(save.nodeId) }}</div>
            </div>
            <button
              class="delete-btn"
              type="button"
              @click.stop="deleteSave(save.id)"
            >
              删除
            </button>
          </div>
        </div>

        <button
          v-if="mode === 'save'"
          class="new-save-btn"
          type="button"
          @click="createSave"
        >
          <span class="btn-icon">+</span>
          <span>新建存档</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { deleteSave, loadSaves, saveGame } from "@/engine/saves";
import type { GameSave } from "@/engine/saves";
import type { RuntimeState } from "@/engine/types";

const props = defineProps<{
  visible: boolean;
  mode: "save" | "load";
  currentState?: RuntimeState | null;
}>();

const emit = defineEmits<{
  close: [];
  load: [state: RuntimeState];
}>();

const saves = computed<GameSave[]>(() => loadSaves());

function getNodeTitle(nodeId: string): string {
  const titles: Record<string, string> = {
    video_wake_up: "一觉醒来",
    choice_wake_up: "第一反应",
    video_open_douyin: "打开抖音",
    choice_open_douyin: "利用外挂",
    video_check_calendar: "查看日历",
    choice_check_calendar: "思考改命",
    ending_village_broadcast: "村口第一网红",
    ending_county_stream: "县城直播先驱",
    ending_find_self: "遇见当年的自己",
    ending_buy_stocks: "股神重生",
  };
  return titles[nodeId] || nodeId;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function createSave() {
  if (!props.currentState) return;
  saveGame(props.currentState);
}

function handleAction(saveId: string) {
  if (props.mode === "load") {
    const saves = loadSaves();
    const save = saves.find((s) => s.id === saveId);
    if (save) {
      emit("load", {
        nodeId: save.nodeId,
        choiceLog: { ...save.choiceLog },
        updatedAt: Date.now(),
      });
    }
    close();
  }
}

function close() {
  emit("close");
}
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(250, 248, 245, 0.85);
  backdrop-filter: blur(4px);
}

.menu-panel {
  width: 90%;
  max-width: 480px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 1.5rem;
  background: #faf8f5;
  border: 1px solid #c9a96e;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(61, 41, 20, 0.15);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
}

.menu-header h2 {
  margin: 0;
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 2px;
}

.close-btn {
  color: #8b7355;
  font-size: 1.5rem;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #3d2914;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #8b7355;
  text-align: center;
}

.empty-icon {
  color: #c9a96e;
  font-size: 2rem;
}

.save-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.save-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.save-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #c9a96e;
}

.save-info {
  flex: 1;
}

.save-time {
  color: #3d2914;
  font-size: 0.9rem;
}

.save-node {
  color: #8b7355;
  font-size: 0.8rem;
  margin-top: 2px;
}

.delete-btn {
  padding: 0.3rem 0.6rem;
  color: #e74c3c;
  font-size: 0.8rem;
  background: rgba(231, 76, 60, 0.08);
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.15);
}

.new-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  color: #3d2914;
  font-size: 0.95rem;
  letter-spacing: 1px;
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid #c9a96e;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.new-save-btn:hover {
  background: rgba(201, 169, 110, 0.2);
}

.btn-icon {
  font-size: 1.1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
