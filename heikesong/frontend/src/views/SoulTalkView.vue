<template>
  <div class="soul-talk-page">
    <div class="paper-bg" />
    <div class="paper-grid" aria-hidden="true" />
    <div class="grain-overlay" />
    <SoulTalkAmbience v-if="appSettings.ambience" />

    <div class="frame-corner tl" />
    <div class="frame-corner tr" />
    <div class="frame-corner bl" />
    <div class="frame-corner br" />

    <header class="soul-header">
      <RouterLink class="back-link" to="/">
        <span class="back-icon" aria-hidden="true">&#10022;</span>
        <span>返回重生大厅</span>
      </RouterLink>
      <div class="header-title">
        <p class="header-kicker">1995 · 重生档案 · Soul Talk</p>
        <h1>心灵倾述</h1>
      </div>
      <span class="header-date">{{ todayLabel }}</span>
    </header>

    <main class="soul-main">
      <div class="soul-layout">
        <aside class="soul-wheel-dock">
          <SoulTalkCharacterWheel
            :characters="digitalHumans"
            :active-id="activeCharacterId"
            :message-counts="messageCounts"
            @select="onPickerSelect"
          />
          <SoulTalkTutorial />
        </aside>

        <div class="soul-content">
        <aside
          class="character-brief soul-paper-card soul-paper-card--brief brief-strip"
          :style="chamberStyle"
        >
          <div class="brief-inner">
            <p class="brief-era">{{ activeCharacter.era }}</p>
            <h2 class="brief-name">{{ activeCharacter.name }}</h2>
            <p class="brief-role">{{ activeCharacter.role }}</p>
            <p class="brief-desc">{{ activeCharacter.description }}</p>
            <ul class="brief-traits">
              <li v-for="t in activeCharacter.traits" :key="t">{{ t }}</li>
            </ul>
          </div>
        </aside>

        <div class="soul-body">
          <section class="stage-section">
          <div class="stage-chamber" :style="chamberStyle">
            <div class="chamber-label">
              <span class="chamber-kicker">Theater</span>
              <span class="chamber-title">倾诉舞台</span>
            </div>

            <SoulTalkStage
              ref="stageRef"
              :show-character-nav="false"
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
          </section>

          <SoulTalkJournal
            class="journal-section soul-paper-card soul-paper-card--journal"
            :character-name="activeCharacter.name"
            :messages="activeMessages"
          />
        </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import SoulTalkAmbience from "@/components/soul-talk/SoulTalkAmbience.vue";
import SoulTalkJournal from "@/components/soul-talk/SoulTalkJournal.vue";
import SoulTalkCharacterWheel from "@/components/soul-talk/SoulTalkCharacterWheel.vue";
import SoulTalkTutorial from "@/components/soul-talk/SoulTalkTutorial.vue";
import SoulTalkStage from "@/components/soul-talk/SoulTalkStage.vue";
import type { ComponentPublicInstance } from "vue";
import { digitalHumans } from "@/data/digitalHumans";
import { appSettings } from "@/utils/settings";
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
  --frame-inset: 12px;
  --hub-pad-x: clamp(1.15rem, 3.5vw, 2.75rem);
  --stage-canvas: #faf8f5;
  --neon-gold: #c9a96e;
  --neon-bright: #e8d5a3;
  --neon-dim: #8b6914;
  --neon-glow: rgba(201, 169, 110, 0.45);
  --neon-glow-soft: rgba(201, 169, 110, 0.2);
  --font-display: "LXGW WenKai", "STKaiti", "KaiTi", "楷体", serif;
  --font-serif: "Noto Serif SC", "Songti SC", "SimSun", serif;
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #3d2914;
  font-family: var(--font-serif);
  background: linear-gradient(
    180deg,
    rgba(18, 14, 8, 0.88) 0%,
    rgba(28, 22, 14, 0.35) 5%,
    rgba(252, 246, 234, 0.88) 14%,
    rgba(248, 240, 225, 0.82) 36%,
    rgba(255, 252, 247, 0.78) 55%,
    rgba(250, 244, 232, 0.84) 82%,
    rgba(28, 22, 14, 0.28) 94%,
    rgba(18, 14, 8, 0.8) 100%
  );
}

.soul-talk-page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
  opacity: 0.32;
}

.soul-talk-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 95% 75% at 50% 42%,
      transparent 35%,
      rgba(139, 90, 43, 0.07) 100%
    ),
    url("/images/bg-vintage.jpg") center / cover no-repeat;
  background-blend-mode: overlay, soft-light;
  opacity: var(--hub-vintage-overlay, 0.38);
}

.paper-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 90% 55% at 50% 30%,
      rgba(255, 248, 235, 0.45) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse at 12% 40%,
      rgba(201, 169, 110, 0.16) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 88% 70%,
      rgba(160, 100, 60, 0.1) 0%,
      transparent 48%
    );
}

.paper-grid {
  display: none;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.08;
  mix-blend-mode: multiply;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
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
  z-index: 2;
}

.soul-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem var(--hub-pad-x);
  border-bottom: 1px solid var(--neon-gold);
  background: rgba(10, 8, 4, 0.82);
  backdrop-filter: blur(12px);
  box-shadow:
    0 0 12px var(--neon-glow-soft),
    0 4px 24px rgba(10, 8, 4, 0.35),
    0 1px 0 rgba(255, 255, 255, 0.06);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  justify-self: start;
  padding: 0.35rem 0.65rem;
  color: var(--neon-bright);
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  text-shadow: 0 0 6px var(--neon-glow);
  border: 1px solid transparent;
  border-radius: 8px;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.back-icon {
  color: var(--neon-gold);
  font-size: 0.75rem;
}

.back-link:hover {
  color: #fff8e7;
  background: rgba(201, 169, 110, 0.12);
  border-color: rgba(201, 169, 110, 0.35);
  box-shadow: 0 0 14px var(--neon-glow-soft);
}

.header-title {
  text-align: center;
}

.header-kicker {
  margin: 0 0 0.2rem;
  color: rgba(201, 169, 110, 0.75);
  font-size: 0.62rem;
  letter-spacing: 0.28em;
}

.header-title h1 {
  margin: 0;
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  text-shadow:
    0 0 8px var(--neon-glow),
    0 0 16px var(--neon-glow-soft);
}

.header-date {
  justify-self: end;
  padding: 0.35rem 0.7rem;
  color: var(--neon-gold);
  font-size: 0.78rem;
  font-family: monospace;
  letter-spacing: 0.08em;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
  text-shadow: 0 0 5px var(--neon-glow-soft);
}

.soul-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0.75rem var(--hub-pad-x) max(1.25rem, var(--frame-inset));
  box-sizing: border-box;
  min-height: 0;
}

.soul-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 7.5rem);
  gap: 0.85rem;
}

.soul-wheel-dock {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
  align-self: stretch;
  width: 100%;
  max-width: min(100%, 26rem);
  min-height: 0;
}

.soul-wheel-dock :deep(.soul-tutorial) {
  flex: 1;
  min-height: 12rem;
}

.soul-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  min-height: 0;
}

.brief-strip {
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.brief-strip .brief-inner {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 0.15rem 1rem;
  align-items: baseline;
  padding: 0.75rem 1rem;
}

.brief-strip .brief-era {
  grid-column: 1;
  grid-row: 1;
  margin: 0;
}

.brief-strip .brief-name {
  grid-column: 2;
  grid-row: 1;
  margin: 0;
  font-size: 1.1rem;
}

.brief-strip .brief-role {
  grid-column: 1 / -1;
  grid-row: 2;
  margin: 0 0 0.35rem;
}

.brief-strip .brief-desc,
.brief-strip .brief-traits {
  display: none;
}

.hub-glass {
  position: relative;
  background: linear-gradient(
    165deg,
    rgba(255, 252, 247, 0.82) 0%,
    rgba(248, 238, 220, 0.76) 50%,
    rgba(255, 250, 242, 0.8) 100%
  );
  backdrop-filter: blur(14px);
  border: 1px solid rgba(201, 169, 110, 0.38);
  border-radius: 18px;
  box-shadow:
    0 12px 48px rgba(61, 41, 20, 0.1),
    0 0 32px rgba(201, 169, 110, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.hub-glass::before {
  content: "";
  position: absolute;
  top: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.65),
    transparent
  );
  pointer-events: none;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.45),
    transparent
  );
}

.section-label {
  flex-shrink: 0;
  margin: 0;
  color: #5c4033;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.2em;
}

.roster-section {
  flex-shrink: 0;
  padding: 1rem 1.1rem 1.1rem;
}

.soul-body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  gap: clamp(0.65rem, 1.2vw, 1rem);
  width: 100%;
  min-height: min(68vh, calc(100vh - 14rem));
  align-items: stretch;
}

.stage-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.stage-chamber {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  padding: 0.85rem 1rem 1rem;
  overflow: hidden;
  background:
    radial-gradient(
      ellipse 80% 50% at 50% 100%,
      var(--accent-soft, rgba(201, 169, 110, 0.18)),
      transparent 58%
    ),
    linear-gradient(
      165deg,
      rgba(22, 16, 10, 0.94) 0%,
      rgba(32, 24, 14, 0.9) 38%,
      rgba(40, 30, 18, 0.88) 100%
    );
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 18px;
  box-shadow:
    0 0 20px var(--neon-glow-soft),
    0 16px 48px rgba(10, 8, 4, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
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
  border-bottom: 1px solid rgba(201, 169, 110, 0.28);
}

.chamber-kicker {
  color: rgba(201, 169, 110, 0.7);
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.chamber-title {
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: 0.88rem;
  letter-spacing: 0.2em;
  text-shadow: 0 0 8px var(--neon-glow-soft);
}

.stage-chamber :deep(.soul-theater) {
  flex: 1;
  width: 100%;
  max-width: none;
  min-height: 0;
  margin: 0;
}

/* 不透明信纸卡片（角色简介 / 心事记录） */
.soul-paper-card {
  position: relative;
  overflow: hidden;
  background-color: #f7f0e4;
  background-image: linear-gradient(
    165deg,
    #faf6ee 0%,
    #f5ebe0 45%,
    #f3e8d8 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.48);
  border-radius: 16px;
  box-shadow:
    0 10px 36px rgba(61, 41, 20, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(201, 169, 110, 0.12);
}

.soul-paper-card--brief::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 0;
  width: 52%;
  height: 62%;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 90% 80% at 0% 100%,
      color-mix(in srgb, var(--accent, #c9a96e) 14%, transparent),
      transparent 68%
    ),
    radial-gradient(
      ellipse 55% 45% at 18% 88%,
      rgba(120, 150, 100, 0.07),
      transparent 70%
    );
}

.soul-paper-card--brief::after {
  content: "";
  position: absolute;
  top: 8%;
  right: 0;
  z-index: 0;
  width: 38%;
  height: 88%;
  pointer-events: none;
  opacity: 0.35;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 23px,
    rgba(180, 160, 130, 0.22) 23px,
    rgba(180, 160, 130, 0.22) 24px
  );
  mask-image: linear-gradient(90deg, transparent, #000 28%);
}

.character-brief {
  padding: 0;
}

.brief-inner {
  position: relative;
  z-index: 1;
  padding: 1.05rem 1.15rem 1.1rem;
}

.brief-era {
  margin: 0 0 0.35rem;
  color: #8b7355;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
}

.brief-name {
  margin: 0 0 0.2rem;
  color: #2a1f12;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.14em;
}

.brief-role {
  margin: 0 0 0.55rem;
  color: var(--accent, #c9a96e);
  font-size: 0.82rem;
  letter-spacing: 0.06em;
}

.brief-desc {
  margin: 0 0 0.7rem;
  padding: 0.55rem 0.65rem;
  color: #4a3828;
  font-size: 0.84rem;
  line-height: 1.7;
  background: #fffcf7;
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.brief-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brief-traits li {
  padding: 0.22rem 0.55rem;
  color: #5c4a38;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  background: #fffcf7;
  border: 1px solid color-mix(in srgb, var(--accent, #c9a96e) 35%, #e8dcc8);
  border-radius: 999px;
  box-shadow: 0 1px 4px rgba(61, 41, 20, 0.06);
}

.journal-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: 0;
}

.journal-section.soul-paper-card--journal {
  padding: 0.85rem;
}

.journal-section :deep(.journal-panel) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.journal-section :deep(.journal-scroll) {
  flex: 1;
  max-height: none;
  min-height: 12rem;
}

@media (min-width: 901px) {
  .soul-layout {
    display: grid;
    grid-template-columns: minmax(17.5rem, 26rem) minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    column-gap: 1.25rem;
    row-gap: 0.75rem;
    align-items: start;
  }

  .soul-wheel-dock {
    grid-column: 1;
    grid-row: 1 / 3;
    position: sticky;
    top: 0.75rem;
    align-self: stretch;
    width: 100%;
    max-width: 26rem;
    margin: 0;
    min-height: calc(100vh - 9rem);
  }

  .soul-content {
    grid-column: 2;
    grid-row: 1 / 3;
    min-height: calc(100vh - 8.5rem);
  }

  .brief-strip .brief-desc,
  .brief-strip .brief-traits {
    display: block;
  }

  .brief-strip .brief-inner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto;
    align-items: start;
    padding: 0.85rem 1.15rem;
  }

  .brief-strip .brief-era {
    grid-column: 1;
    grid-row: 1;
  }

  .brief-strip .brief-name {
    grid-column: 2;
    grid-row: 1;
  }

  .brief-strip .brief-role {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .brief-strip .brief-desc {
    display: block;
    grid-column: 1 / -1;
    grid-row: 3;
    margin: 0;
    padding: 0.45rem 0.6rem;
    font-size: 0.8rem;
    line-height: 1.55;
  }

  .brief-strip .brief-traits {
    display: flex;
    grid-column: 1 / -1;
    margin-top: 0.2rem;
  }

  .soul-body {
    flex: 1;
    min-height: 0;
  }
}

@media (max-width: 900px) {
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

  .soul-layout {
    min-height: auto;
    padding-top: 0;
  }

  .soul-wheel-dock {
    max-width: min(100%, 22rem);
    margin: 0 auto;
  }

  .soul-body {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .stage-chamber {
    min-height: min(52vh, 560px);
    height: auto;
  }

  .journal-section :deep(.journal-scroll) {
    max-height: min(42vh, 420px);
  }
}
</style>
