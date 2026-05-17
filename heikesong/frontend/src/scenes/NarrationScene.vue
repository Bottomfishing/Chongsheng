<template>
  <section class="scene-card narration-card">
    <header class="scene-header narration-header">
      <p class="scene-kicker narration-kicker">{{ node.title }}</p>
      <p class="scene-copy narration-text">{{ node.text }}</p>
    </header>

    <div class="scene-actions narration-actions">
      <button class="primary-button narration-next" type="button" @click="$emit('next')">
        <span>继续</span>
        <span class="next-arrow">&#8250;</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NarrationNode } from "@/engine/types";

defineEmits<{
  next: [];
}>();

defineProps<{
  node: NarrationNode;
}>();
</script>

<style scoped>
.narration-header {
  animation: narration-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.narration-kicker {
  font-weight: 700;
  animation-delay: 0.1s;
}

.narration-text {
  animation: narration-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
  line-height: 1.8;
  white-space: pre-wrap;
}

.narration-actions {
  animation: narration-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.narration-next {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.next-arrow {
  font-size: 1.2em;
  transition: transform 0.2s;
}

.narration-next:hover .next-arrow {
  transform: translateX(4px);
}

@keyframes narration-fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
