<template>
  <div class="soul-talk-page">
    <div class="paper-bg" />
    <div class="grain-overlay" />

    <div class="frame-corner tl" />
    <div class="frame-corner tr" />
    <div class="frame-corner bl" />
    <div class="frame-corner br" />

    <header class="soul-header">
      <RouterLink class="back-link" to="/">
        <span aria-hidden="true">&#8592;</span>
        返回小卖部
      </RouterLink>
      <div class="header-title">
        <p class="header-kicker">Soul Talk · 1995</p>
        <h1>心灵倾述</h1>
      </div>
      <span class="header-date">1995.05.16</span>
    </header>

    <main class="soul-main">
      <CharacterPicker
        :characters="digitalHumans"
        :active-id="activeCharacterId"
        @select="onPickerSelect"
      />

      <SoulTalkStage
        ref="stageRef"
        :character-id="activeCharacter.id"
        :character-name="activeCharacter.name"
        :character-symbol="activeCharacter.symbol"
        :character-role="activeCharacter.role"
        :character-portrait="activeCharacter.portrait"
        :character-animation="activeCharacter.animation"
        :accent="activeCharacter.accent"
        :accent-soft="activeCharacter.accentSoft"
        :messages="activeMessages"
        :is-typing="isTyping"
        :sending="isSending"
        placeholder="向 TA 说说你的心事…"
        @send="handleSend"
        @prev="switchPrevCharacter"
        @next="switchNextCharacter"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import CharacterPicker from "@/components/soul-talk/CharacterPicker.vue";
import SoulTalkStage from "@/components/soul-talk/SoulTalkStage.vue";
import type { ComponentPublicInstance } from "vue";
import { digitalHumans } from "@/data/digitalHumans";
import { soulTalkApi } from "@/services/soulTalkApi";
import type { ChatMessage } from "@/types/soulTalk";

const stageRef = ref<ComponentPublicInstance<{
  playCharacterVideo: () => void;
  stopCharacterVideo: () => void;
}> | null>(null);
const activeCharacterId = ref(digitalHumans[0].id);
const histories = reactive<Record<string, ChatMessage[]>>({});
const isTyping = ref(false);
const isSending = ref(false);

const activeCharacter = computed(
  () => digitalHumans.find((c) => c.id === activeCharacterId.value) ?? digitalHumans[0],
);

const activeMessages = computed(() => histories[activeCharacterId.value] ?? []);

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

function ensureGreeting(characterId: string) {
  if (histories[characterId]?.length) {
    return;
  }

  const character = digitalHumans.find((item) => item.id === characterId);
  if (!character) {
    return;
  }

  histories[characterId] = [createMessage("assistant", character.greeting)];
}

function switchCharacter(id: string) {
  activeCharacterId.value = id;
  ensureGreeting(id);
}

function switchCharacterAndStop(id: string) {
  switchCharacter(id);
  void nextTick(() => stageRef.value?.stopCharacterVideo());
}

function onPickerSelect(id: string) {
  switchCharacter(id);
  void nextTick(() => stageRef.value?.playCharacterVideo());
}

function switchPrevCharacter() {
  const idx = digitalHumans.findIndex((c) => c.id === activeCharacterId.value);
  const prevIdx = idx <= 0 ? digitalHumans.length - 1 : idx - 1;
  switchCharacterAndStop(digitalHumans[prevIdx].id);
}

function switchNextCharacter() {
  const idx = digitalHumans.findIndex((c) => c.id === activeCharacterId.value);
  const nextIdx = idx >= digitalHumans.length - 1 ? 0 : idx + 1;
  switchCharacterAndStop(digitalHumans[nextIdx].id);
}

async function handleSend(text: string) {
  const characterId = activeCharacterId.value;
  ensureGreeting(characterId);

  const history = histories[characterId] ?? [];
  history.push(createMessage("user", text));
  histories[characterId] = [...history];

  isSending.value = true;
  isTyping.value = true;

  try {
    const reply = await soulTalkApi.sendMessage({
      characterId,
      message: text,
      history,
    });

    histories[characterId] = [...history, createMessage("assistant", reply)];
  } catch {
    histories[characterId] = [
      ...history,
      createMessage("assistant", "信号好像断了一下，你可以再说一次吗？"),
    ];
  } finally {
    isTyping.value = false;
    isSending.value = false;
  }
}

ensureGreeting(activeCharacterId.value);
</script>

<style scoped>
.soul-talk-page {
  --frame-inset: 8px;
  --hub-pad-x: clamp(1.25rem, 5vw, 4.5rem);
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #3d2914;
  font-family:
    "Georgia", "Times New Roman", "Noto Serif SC", "Songti SC", "SimSun", serif;
}

.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 18% 20%, rgba(201, 169, 110, 0.1), transparent 42%),
    radial-gradient(ellipse at 82% 78%, rgba(139, 69, 19, 0.06), transparent 40%);
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  z-index: 2;
  width: 48px;
  height: 48px;
  border: 2px solid #c9a96e;
  pointer-events: none;
}

.frame-corner.tl {
  top: var(--frame-inset);
  left: var(--frame-inset);
  border-right: none;
  border-bottom: none;
}

.frame-corner.tr {
  top: var(--frame-inset);
  right: var(--frame-inset);
  border-left: none;
  border-bottom: none;
}

.frame-corner.bl {
  bottom: var(--frame-inset);
  left: var(--frame-inset);
  border-right: none;
  border-top: none;
}

.frame-corner.br {
  bottom: var(--frame-inset);
  right: var(--frame-inset);
  border-left: none;
  border-top: none;
}

.soul-header,
.soul-main {
  position: relative;
  z-index: 1;
}

.soul-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem var(--hub-pad-x);
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #8b7355;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #3d2914;
}

.header-title {
  text-align: center;
}

.header-kicker {
  margin: 0 0 0.2rem;
  color: #b8924a;
  font-size: 0.68rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.header-title h1 {
  margin: 0;
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  font-weight: 400;
  letter-spacing: 0.28em;
}

.header-date {
  justify-self: end;
  color: #8b7355;
  font-size: 0.8rem;
  font-family: monospace;
  letter-spacing: 0.06em;
}

.soul-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem var(--hub-pad-x) 1.25rem;
}

@media (max-width: 860px) {
  .soul-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .back-link {
    justify-self: start;
  }

  .header-date {
    justify-self: center;
  }
}
</style>
