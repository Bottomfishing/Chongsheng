<template>
  <section class="scene-card ending-card">
    <header class="scene-header ending-header">
      <p class="scene-kicker ending-kicker">结局节点</p>
      <h2 class="ending-title">{{ node.title }}</h2>
      <p class="scene-copy ending-text">{{ node.text }}</p>
    </header>

    <div class="scene-actions ending-actions">
      <button class="primary-button ending-restart" type="button" @click="$emit('restart')">
        <span class="restart-icon">&#8634;</span>
        <span>重新开始</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EndingNode } from "@/engine/types";

defineEmits<{
  restart: [];
}>();

defineProps<{
  node: EndingNode;
}>();
</script>

<style scoped>
.ending-header {
  animation: ending-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ending-kicker {
  animation-delay: 0.1s;
}

.ending-title {
  animation: ending-title-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.ending-text {
  animation: ending-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
}

.ending-actions {
  animation: ending-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
}

.ending-restart {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.ending-restart::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, rgba(255, 189, 115, 0.4), transparent 60%);
  border-radius: inherit;
  opacity: 0;
  animation: restart-glow 2s ease-in-out infinite;
  pointer-events: none;
}

.restart-icon {
  display: inline-block;
  animation: spin-slow 8s linear infinite;
}

@keyframes ending-fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ending-title-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes restart-glow {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
