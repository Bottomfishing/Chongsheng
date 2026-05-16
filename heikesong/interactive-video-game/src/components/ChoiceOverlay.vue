<template>
  <Transition name="fade">
    <div v-if="visible" class="choice-overlay">
      <div class="choice-backdrop" />
      <div class="choice-container">
        <h3 class="choice-title">你的选择</h3>
        <div class="choice-list">
          <button
            v-for="choice in choices"
            :key="choice.id"
            class="choice-btn"
            @click="select(choice.id, choice.nextNodeId)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Choice } from '../types/game.ts'

defineProps<{
  visible: boolean
  choices: Choice[]
}>()

const emit = defineEmits<{
  select: [choiceId: string, nextNodeId: string]
}>()

function select(choiceId: string, nextNodeId: string) {
  emit('select', choiceId, nextNodeId)
}
</script>

<style scoped>
.choice-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.choice-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}
.choice-container {
  position: relative;
  z-index: 11;
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
}
.choice-title {
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  letter-spacing: 2px;
}
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.choice-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-family: inherit;
}
.choice-btn:hover {
  background: rgba(231, 76, 60, 0.8);
  border-color: #e74c3c;
  transform: translateY(-2px);
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
