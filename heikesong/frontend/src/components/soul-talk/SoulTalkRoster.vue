<template>
  <div class="soul-roster" role="tablist" aria-label="选择倾诉对象">
    <button
      v-for="character in characters"
      :key="character.id"
      type="button"
      class="roster-card"
      :class="{ active: character.id === activeId }"
      :style="{ '--accent': character.accent, '--accent-soft': character.accentSoft }"
      role="tab"
      :aria-selected="character.id === activeId"
      @click="$emit('select', character.id)"
    >
      <CharacterPortrait
        class="roster-portrait"
        :name="character.name"
        :symbol="character.symbol"
        :portrait="character.portrait"
        :accent="character.accent"
        :accent-soft="character.accentSoft"
        variant="thumb"
      />
      <span class="roster-meta">
        <span class="roster-name-row">
          <span class="roster-name">{{ character.name }}</span>
          <span
            v-if="(messageCounts?.[character.id] ?? 0) > 0"
            class="roster-dot"
            :title="`已对话 ${messageCounts?.[character.id]} 条`"
          />
        </span>
        <span class="roster-role">{{ character.role }}</span>
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
  messageCounts?: Record<string, number>;
}>();

defineEmits<{
  select: [id: string];
}>();
</script>

<style scoped>
.soul-roster {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  width: 100%;
}

.roster-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.65rem 0.85rem 0.65rem 0.6rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.roster-card:hover {
  border-color: rgba(201, 169, 110, 0.55);
  transform: translateY(-2px);
}

.roster-card.active {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--accent, #c9a96e);
  box-shadow:
    0 8px 24px rgba(61, 41, 20, 0.1),
    inset 0 -3px 0 var(--accent, #c9a96e);
}

.roster-portrait {
  flex-shrink: 0;
}

.roster-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.roster-name-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.roster-name {
  color: #3d2914;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.roster-role {
  color: #8b7355;
  font-size: 0.68rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.roster-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  background: var(--accent, #c9a96e);
  border-radius: 50%;
}

@media (max-width: 720px) {
  .soul-roster {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
