<template>
  <section class="scene-card">
    <header class="scene-header">
      <p class="scene-kicker">分支节点</p>
      <h2>做出你的选择</h2>
      <p class="scene-copy">{{ node.prompt }}</p>
    </header>

    <div class="choice-grid">
      <button
        v-for="(option, idx) in node.options"
        :key="option.id"
        class="choice-button"
        :style="{ animationDelay: `${idx * 0.08}s` }"
        type="button"
        @click="handleChoose($event, option.id)"
      >
        <span class="choice-tag">{{ option.id }}</span>
        <span>{{ option.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ChoiceNode, OptionId } from "@/engine/types";

const emit = defineEmits<{
  choose: [optionId: OptionId];
}>();

defineProps<{
  node: ChoiceNode;
}>();

function handleChoose(e: MouseEvent, id: OptionId) {
  createRipple(e);
  setTimeout(() => emit("choose", id), 280);
}

function createRipple(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement;
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute;
    left: ${e.clientX - rect.left - size / 2}px;
    top: ${e.clientY - rect.top - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 189, 115, 0.35);
    transform: scale(0);
    animation: ripple-spread 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    pointer-events: none;
  `;
  btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
</script>

<style scoped>
@keyframes ripple-spread {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

.choice-button {
  position: relative;
  overflow: hidden;
  animation: choice-pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes choice-pop-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
