<template>
  <div
    class="character-picker"
    role="tablist"
    aria-label="选择倾诉对象"
  >
    <button
      v-for="character in characters"
      :key="character.id"
      class="character-tab"
      :class="{ active: character.id === activeId }"
      type="button"
      role="tab"
      :aria-selected="character.id === activeId"
      @click="$emit('select', character.id)"
    >
      <CharacterPortrait
        class="tab-portrait"
        :name="character.name"
        :symbol="character.symbol"
        :portrait="character.portrait"
        :accent="character.accent"
        :accent-soft="character.accentSoft"
        variant="thumb"
      />
      <span class="tab-meta">
        <span class="tab-name">{{ character.name }}</span>
        <span class="tab-role">{{ character.role }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import CharacterPortrait from "@/components/soul-talk/CharacterPortrait.vue";
import type { DigitalHuman } from "@/types/soulTalk";

defineProps<{
  characters: DigitalHuman[];
  activeId: string;
}>();

defineEmits<{
  select: [id: string];
}>();
</script>

<style scoped>
.character-picker {
  display: flex;
  gap: 0.65rem;
  padding: 0.15rem 0.1rem 0.35rem;
  overflow-x: auto;
  scrollbar-width: thin;
}

.character-tab {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.65rem;
  min-width: 156px;
  padding: 0.5rem 0.85rem 0.5rem 0.5rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 12px;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.character-tab:hover {
  border-color: rgba(201, 169, 110, 0.55);
}

.character-tab.active {
  background: rgba(255, 255, 255, 0.95);
  border-color: #c9a96e;
  box-shadow: 0 4px 16px rgba(61, 41, 20, 0.08);
}

.tab-portrait {
  flex-shrink: 0;
}

.tab-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.tab-name {
  color: #3d2914;
  font-size: 0.88rem;
  letter-spacing: 0.08em;
}

.tab-role {
  color: #8b7355;
  font-size: 0.65rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
