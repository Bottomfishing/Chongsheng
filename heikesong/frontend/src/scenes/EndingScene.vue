<template>
  <section class="scene-card ending-card">
    <header class="scene-header">
      <p class="scene-kicker">结局节点</p>
      <h2>{{ node.title }}</h2>
      <p class="scene-copy">{{ node.text }}</p>
    </header>

    <div class="scene-actions">
      <button class="primary-button" type="button" @click="$emit('restart')">重新开始</button>
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
