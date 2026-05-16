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
  gap: 1rem;
  padding: 0.15rem 0.1rem 0.35rem;
}

.character-tab {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  padding: 0.7rem 1.2rem 0.7rem 0.7rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 12px;
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.character-tab:hover {
  border-color: rgba(201, 169, 110, 0.55);
  transform: translateY(-2px);
}

.character-tab.active {
  background: rgba(255, 255, 255, 0.95);
  border-color: #c9a96e;
  box-shadow: 0 6px 22px rgba(61, 41, 20, 0.1);
  transform: translateY(-2px) scale(1.02);
}

.character-tab.active::after {
  content: "";
  position: absolute;
  right: 0.6rem;
  bottom: 0.5rem;
  left: 0.6rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent, #c9a96e), transparent);
  border-radius: 1px;
  opacity: 0.6;
  animation: tab-glow 2s ease-in-out infinite;
}

@keyframes tab-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.tab-portrait {
  flex-shrink: 0;
}

.tab-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.tab-name {
  color: #3d2914;
  font-size: 1rem;
  letter-spacing: 0.08em;
}

.tab-role {
  color: #8b7355;
  font-size: 0.78rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
