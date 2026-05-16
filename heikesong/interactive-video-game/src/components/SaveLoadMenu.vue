<template>
  <Transition name="fade">
    <div v-if="visible" class="menu-overlay">
      <div class="menu-backdrop" @click="close" />
      <div class="menu-panel">
        <div class="menu-header">
          <h2>{{ mode === 'save' ? '保存游戏' : '读取游戏' }}</h2>
          <button class="close-btn" @click="close">×</button>
        </div>

        <div v-if="saves.length === 0" class="empty-state">
          暂无存档
        </div>

        <div class="save-list">
          <div
            v-for="save in saves"
            :key="save.id"
            class="save-item"
          >
            <div class="save-info" @click="handleAction(save.id)">
              <div class="save-time">{{ formatTime(save.timestamp) }}</div>
              <div class="save-node">节点: {{ getNodeTitle(save.currentNodeId) }}</div>
            </div>
            <button class="delete-btn" @click.stop="deleteSave(save.id)">删除</button>
          </div>
        </div>

        <button v-if="mode === 'save'" class="new-save-btn" @click="createSave">
          + 新建存档
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore.ts'
// GameSave type is used implicitly via store.allSaves

const props = defineProps<{
  visible: boolean
  mode: 'save' | 'load'
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useGameStore()
const saves = computed(() => store.allSaves)

function getNodeTitle(nodeId: string): string {
  const node = store.story.nodes.find((n) => n.id === nodeId)
  return node?.title || nodeId
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function createSave() {
  store.saveGame()
}

function handleAction(saveId: string) {
  if (props.mode === 'load') {
    store.loadGame(saveId)
    close()
  }
}

function deleteSave(saveId: string) {
  store.deleteSave(saveId)
}

function close() {
  emit('close')
}
</script>

<style scoped>
.menu-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.menu-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
}
.menu-panel {
  position: relative;
  z-index: 21;
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 480px;
  max-height: 70vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.menu-header h2 {
  color: #fff;
  font-size: 1.2rem;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}
.empty-state {
  color: #888;
  text-align: center;
  padding: 2rem;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.save-item:hover {
  background: rgba(255, 255, 255, 0.1);
}
.save-info {
  flex: 1;
}
.save-time {
  color: #fff;
  font-size: 0.9rem;
}
.save-node {
  color: #888;
  font-size: 0.8rem;
  margin-top: 2px;
}
.delete-btn {
  background: rgba(231, 76, 60, 0.2);
  border: none;
  color: #e74c3c;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
.new-save-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid rgba(46, 204, 113, 0.4);
  color: #2ecc71;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
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
