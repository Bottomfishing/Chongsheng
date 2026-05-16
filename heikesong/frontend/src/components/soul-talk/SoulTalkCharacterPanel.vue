<template>
  <aside class="character-panel" :style="panelStyle">
    <header class="panel-head">
      <p class="panel-kicker">Soul Talk</p>
      <h2 class="panel-title">倾诉对象</h2>
    </header>

    <CharacterPicker
      layout="vertical"
      :characters="characters"
      :active-id="activeId"
      :message-counts="messageCounts"
      @select="$emit('select', $event)"
    />

    <Transition name="detail-fade" mode="out-in">
      <div v-if="activeCharacter" :key="activeCharacter.id" class="character-detail">
        <p class="detail-era">{{ activeCharacter.era }}</p>
        <h3 class="detail-name">{{ activeCharacter.name }}</h3>
        <p class="detail-role">{{ activeCharacter.role }}</p>
        <p class="detail-desc">{{ activeCharacter.description }}</p>
        <ul class="trait-list">
          <li
            v-for="trait in activeCharacter.traits"
            :key="trait"
            class="trait-tag"
          >
            {{ trait }}
          </li>
        </ul>
      </div>
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CharacterPicker from "@/components/soul-talk/CharacterPicker.vue";
import type { DigitalHuman } from "@/types/soulTalk";

const props = defineProps<{
  characters: DigitalHuman[];
  activeId: string;
  messageCounts?: Record<string, number>;
}>();

defineEmits<{
  select: [id: string];
}>();

const activeCharacter = computed(
  () => props.characters.find((c) => c.id === props.activeId) ?? props.characters[0],
);

const panelStyle = computed(() => ({
  "--accent": activeCharacter.value?.accent ?? "#c9a96e",
  "--accent-soft": activeCharacter.value?.accentSoft ?? "rgba(201, 169, 110, 0.14)",
}));
</script>

<style scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.panel-head {
  padding-bottom: 0.25rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.28);
}

.panel-kicker {
  margin: 0 0 0.25rem;
  color: #b8924a;
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.panel-title {
  margin: 0;
  color: #3d2914;
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.2em;
}

.character-detail {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(61, 41, 20, 0.05);
}

.detail-era {
  margin: 0 0 0.35rem;
  color: #8b7355;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
}

.detail-name {
  margin: 0 0 0.2rem;
  color: #3d2914;
  font-size: 1.35rem;
  font-weight: 400;
  letter-spacing: 0.14em;
}

.detail-role {
  margin: 0 0 0.65rem;
  color: var(--accent, #c9a96e);
  font-size: 0.82rem;
  letter-spacing: 0.06em;
}

.detail-desc {
  margin: 0 0 0.75rem;
  color: #6b5a48;
  font-size: 0.82rem;
  line-height: 1.65;
}

.trait-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.trait-tag {
  padding: 0.2rem 0.55rem;
  color: #5c4a38;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  background: var(--accent-soft, rgba(201, 169, 110, 0.14));
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 999px;
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
