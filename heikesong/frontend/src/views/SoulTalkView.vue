<template>
  <div class="soul-talk-page">
    <div class="paper-bg" />
    <div class="paper-grid" aria-hidden="true" />
    <div class="grain-overlay" />
    <SoulTalkAmbience />

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
      <span class="header-date">{{ todayLabel }}</span>
    </header>

    <main class="soul-main">
      <section class="roster-section">
        <SoulTalkRoster
          :characters="digitalHumans"
          :active-id="activeCharacterId"
          :message-counts="messageCounts"
          @select="onPickerSelect"
        />
      </section>

      <div class="soul-body">
        <section class="stage-section">
          <div class="stage-chamber" :style="chamberStyle">
            <div class="chamber-label">
              <span class="chamber-kicker">Theater</span>
              <span class="chamber-title">倾诉舞台</span>
            </div>

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
          </div>

          <aside class="character-brief" :style="chamberStyle">
            <p class="brief-era">{{ activeCharacter.era }}</p>
            <h2 class="brief-name">{{ activeCharacter.name }}</h2>
            <p class="brief-role">{{ activeCharacter.role }}</p>
            <p class="brief-desc">{{ activeCharacter.description }}</p>
            <ul class="brief-traits">
              <li v-for="t in activeCharacter.traits" :key="t">{{ t }}</li>
            </ul>
          </aside>
        </section>

        <SoulTalkJournal
          class="journal-section"
          :character-name="activeCharacter.name"
          :messages="activeMessages"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import SoulTalkAmbience from "@/components/soul-talk/SoulTalkAmbience.vue";
import SoulTalkJournal from "@/components/soul-talk/SoulTalkJournal.vue";
import SoulTalkRoster from "@/components/soul-talk/SoulTalkRoster.vue";
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

const todayLabel = computed(() => {
  const d = new Date();
  return `1995.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
});

const activeCharacter = computed(
  () => digitalHumans.find((c) => c.id === activeCharacterId.value) ?? digitalHumans[0],
);

const activeMessages = computed(() => histories[activeCharacterId.value] ?? []);

const messageCounts = computed(() => {
  const counts: Record<string, number> = {};
  for (const c of digitalHumans) {
    counts[c.id] = histories[c.id]?.length ?? 0;
  }
  return counts;
});

const chamberStyle = computed(() => ({
  "--accent": activeCharacter.value.accent,
  "--accent-soft": activeCharacter.value.accentSoft,
}));

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36, 8)}`,
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

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  if (target?.tagName === "TEXTAREA" || target?.tagName === "INPUT") {
    if (e.key === "Enter" && !e.shiftKey) {
      return;
    }
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    switchPrevCharacter();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    switchNextCharacter();
  }
}

onMounted(() => {
  ensureGreeting(activeCharacterId.value);
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.soul-talk-page {
  --frame-inset: 8px;
  --hub-pad-x: clamp(1rem, 3vw, 2.75rem);
  --stage-canvas: #faf8f5;
  position: relative;
  min-height: 100vh;
  background-color: var(--stage-canvas);
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
    radial-gradient(ellipse at 15% 12%, rgba(201, 169, 110, 0.14), transparent 45%),
    radial-gradient(ellipse at 88% 88%, rgba(139, 69, 19, 0.08), transparent 42%),
    linear-gradient(180deg, #fcf9f4 0%, #f5efe6 48%, #faf8f5 100%);
}

.paper-grid {
  position: absolute;
  inset: 0;
  opacity: 0.045;
  background-image:
    linear-gradient(rgba(201, 169, 110, 0.55) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201, 169, 110, 0.55) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.04;
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
  background: rgba(255, 252, 247, 0.55);
  backdrop-filter: blur(6px);
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
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
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
  gap: 1rem;
  width: 100%;
  max-width: min(96vw, 1360px);
  margin: 0 auto;
  padding: 1rem var(--hub-pad-x) 1.75rem;
  box-sizing: border-box;
}

.roster-section {
  flex-shrink: 0;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 16px;
  box-shadow: 0 10px 32px rgba(61, 41, 20, 0.06);
}

.soul-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.stage-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.stage-chamber {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: min(58vh, 640px);
  padding: 0.85rem 1rem 1rem;
  background:
    radial-gradient(ellipse at 50% 100%, var(--accent-soft, rgba(201, 169, 110, 0.12)), transparent 58%),
    rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(201, 169, 110, 0.38);
  border-radius: 18px;
  box-shadow:
    0 16px 48px rgba(61, 41, 20, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.stage-chamber::before,
.stage-chamber::after {
  content: "";
  position: absolute;
  top: 12%;
  bottom: 18%;
  width: 28px;
  pointer-events: none;
  opacity: 0.35;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(201, 169, 110, 0.25) 30%,
    rgba(201, 169, 110, 0.25) 70%,
    transparent
  );
}

.stage-chamber::before {
  left: 0;
  border-radius: 0 8px 8px 0;
}

.stage-chamber::after {
  right: 0;
  border-radius: 8px 0 0 8px;
}

.chamber-label {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  margin-bottom: 0.35rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.22);
}

.chamber-kicker {
  color: #b8924a;
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.chamber-title {
  color: #3d2914;
  font-size: 0.88rem;
  letter-spacing: 0.2em;
}

.stage-chamber :deep(.soul-theater) {
  flex: 1;
  max-width: none;
  min-height: 0;
}

.character-brief {
  display: none;
  padding: 1rem 1.1rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 14px;
}

.brief-era {
  margin: 0 0 0.3rem;
  color: #8b7355;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
}

.brief-name {
  margin: 0 0 0.15rem;
  color: #3d2914;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.brief-role {
  margin: 0 0 0.5rem;
  color: var(--accent, #c9a96e);
  font-size: 0.8rem;
}

.brief-desc {
  margin: 0 0 0.65rem;
  color: #6b5a48;
  font-size: 0.82rem;
  line-height: 1.65;
}

.brief-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brief-traits li {
  padding: 0.18rem 0.5rem;
  color: #5c4a38;
  font-size: 0.68rem;
  background: var(--accent-soft, rgba(201, 169, 110, 0.14));
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 999px;
}

.journal-section {
  min-height: 200px;
}

/* 大屏：舞台 + 右侧记录 + 底部角色简介 */
@media (min-width: 1100px) {
  .soul-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 320px);
    grid-template-rows: 1fr auto;
    gap: 1rem 1.25rem;
    align-items: stretch;
  }

  .stage-section {
    grid-row: 1 / 3;
    grid-column: 1;
  }

  .journal-section {
    grid-row: 1;
    grid-column: 2;
    min-height: 0;
    height: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(201, 169, 110, 0.32);
    border-radius: 16px;
    box-shadow: 0 10px 32px rgba(61, 41, 20, 0.06);
  }

  .journal-section :deep(.journal-panel) {
    height: 100%;
    max-height: none;
  }

  .journal-section :deep(.journal-scroll) {
    max-height: min(52vh, 520px);
  }

  .character-brief {
    display: block;
    grid-row: 2;
    grid-column: 2;
  }

  .stage-chamber {
    min-height: min(68vh, 720px);
  }
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
