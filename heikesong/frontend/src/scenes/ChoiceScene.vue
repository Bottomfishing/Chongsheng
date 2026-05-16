<template>
  <section class="scene-card">
    <header class="scene-header">
      <p class="scene-kicker">分支节点</p>
      <h2>做出你的选择</h2>
      <p class="scene-copy">{{ node.prompt }}</p>
    </header>

    <div class="choice-grid">
      <button
        v-for="option in node.options"
        :key="option.id"
        class="choice-button"
        type="button"
        @click="$emit('choose', option.id)"
      >
        <span class="choice-tag">{{ option.id }}</span>
        <span>{{ option.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ChoiceNode, OptionId } from "@/engine/types";

defineEmits<{
  choose: [optionId: OptionId];
}>();

defineProps<{
  node: ChoiceNode;
}>();
</script>
