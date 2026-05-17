<template>
  <main class="mini-game-page">
    <div class="paper-bg" />
    <div class="grain-overlay" />

    <div class="frame-corner tl" />
    <div class="frame-corner tr" />
    <div class="frame-corner bl" />
    <div class="frame-corner br" />

    <header class="mini-header">
      <RouterLink class="back-link" to="/">
        <span aria-hidden="true">&#8592;</span>
        返回首页
      </RouterLink>

      <div class="header-copy">
        <p class="header-kicker">Mini Game · Phaser</p>
        <h1>直播冲榜</h1>
        <p class="header-desc">基于 Phaser 接入的第一个小游戏原型。</p>
      </div>

      <button class="retry-button" type="button" @click="restartGame">再来一次</button>
    </header>

    <section class="mini-layout">
      <div class="game-panel">
        <div ref="gameHost" class="game-host" />
      </div>

      <aside class="side-panel">
        <section class="info-card">
          <h2>玩法说明</h2>
          <p>左右移动底部"直播机位"，接住从上方掉落的"赞"和"礼"。</p>
          <p>"赞"加 1 分，"礼"加 3 分，45 秒结束结算。</p>
        </section>

        <section class="info-card">
          <h2>本局状态</h2>
          <p>当前分数：{{ lastScore }}</p>
          <p>历史最高：{{ bestScore }}</p>
          <p>适合作为你这个项目里"直播 PK / 冲榜挑战"的小游戏入口。</p>
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import type Phaser from "phaser";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { createStreamRushGame } from "@/games/streamRush/createStreamRushGame";

const gameHost = ref<HTMLElement | null>(null);
const lastScore = ref(0);
const bestScore = ref(0);

let game: Phaser.Game | null = null;

function syncBestScore() {
  const raw = window.localStorage.getItem("stream-rush-best-score");
  const score = Number(raw);
  bestScore.value = Number.isFinite(score) ? score : 0;
}

function bindSceneEvents() {
  if (!game) {
    return;
  }

  const scene = game.scene.getScene("stream-rush");
  scene.events.on("stream-rush-finished", (payload: { score: number; bestScore: number }) => {
    lastScore.value = payload.score;
    bestScore.value = payload.bestScore;
  });
}

async function mountGame() {
  if (!gameHost.value) {
    return;
  }

  game = createStreamRushGame(gameHost.value);
  await nextTick();
  bindSceneEvents();
  syncBestScore();
}

async function restartGame() {
  if (game) {
    game.destroy(true);
    game = null;
  }

  lastScore.value = 0;
  await nextTick();
  await mountGame();
}

onMounted(() => {
  mountGame();
});

onBeforeUnmount(() => {
  if (game) {
    game.destroy(true);
    game = null;
  }
});
</script>

<style scoped>
.mini-game-page {
  position: relative;
  min-height: 100vh;
  color: #3d2914;
  background: #faf8f5;
  font-family: "Georgia", "Times New Roman", "Noto Serif SC", "Songti SC", "SimSun", serif;
}

.paper-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(250, 248, 245, 0.88), rgba(250, 248, 245, 0.88)),
    radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.06) 0%, transparent 40%),
    #faf8f5;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.frame-corner {
  position: absolute;
  z-index: 1;
  width: 60px;
  height: 60px;
  border: 2px solid #c9a96e;
}

.frame-corner.tl {
  top: 24px;
  left: 24px;
  border-right: none;
  border-bottom: none;
}

.frame-corner.tr {
  top: 24px;
  right: 24px;
  border-left: none;
  border-bottom: none;
}

.frame-corner.bl {
  bottom: 24px;
  left: 24px;
  border-right: none;
  border-top: none;
}

.frame-corner.br {
  right: 24px;
  bottom: 24px;
  border-left: none;
  border-top: none;
}

.mini-header,
.mini-layout {
  position: relative;
  z-index: 2;
}

.mini-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 2rem 3rem 1rem;
}

.back-link,
.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  color: #8b7355;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover,
.retry-button:hover {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(201, 169, 110, 0.6);
}

.header-copy {
  text-align: center;
}

.header-kicker,
.header-desc {
  margin: 0;
}

.header-kicker {
  color: #b8924a;
  font-size: 0.75rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.header-copy h1 {
  margin: 0.4rem 0;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 400;
  letter-spacing: 0.18em;
}

.header-desc {
  color: #8b7355;
  font-size: 0.95rem;
}

.mini-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1.5rem;
  padding: 1rem 3rem 3rem;
}

.game-panel,
.info-card {
  background: rgba(255, 252, 247, 0.86);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(61, 41, 20, 0.08);
}

.game-panel {
  padding: 1rem;
}

.game-host {
  width: 100%;
  min-height: 540px;
  border-radius: 14px;
  overflow: hidden;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  padding: 1.2rem 1.15rem;
}

.info-card h2 {
  margin: 0 0 0.7rem;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.info-card p {
  margin: 0 0 0.65rem;
  color: #6c5238;
  line-height: 1.7;
}

.info-card p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1080px) {
  .mini-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .mini-header,
  .mini-layout {
    padding-right: 1.25rem;
    padding-left: 1.25rem;
  }

  .mini-header {
    grid-template-columns: 1fr;
  }

  .header-copy {
    text-align: left;
  }

  .game-host {
    min-height: 420px;
  }
}
</style>
