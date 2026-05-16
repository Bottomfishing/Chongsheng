<template>
  <HubSubPageLayout
    title="成就墙"
    kicker="1995 · Glory · Achievements"
    :show-particles="true"
  >
    <svg class="svg-defs" aria-hidden="true">
      <defs>
        <linearGradient
          id="achievementProgressGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#c9a96e" />
          <stop offset="100%" stop-color="#8b4513" />
        </linearGradient>
      </defs>
    </svg>

    <template #header-extra>
      <div class="progress-pill">
        <span class="pill-count">{{ unlockedCount }}</span>
        <span class="pill-sep">/</span>
        <span class="pill-total">{{ totalCount }}</span>
      </div>
    </template>

    <div class="overview-card">
      <div class="overview-left">
        <div class="overview-icon">&#127942;</div>
        <div class="overview-text">
          <p class="overview-label">&#37325;&#29983;&#25104;&#23601;&#24405;</p>
          <p class="overview-desc">
            &#25910;&#38598;&#20320;&#22312;&#37325;&#29983;&#20043;&#26053;&#20013;&#30340;&#27599;&#19968;&#20010;&#39640;&#20809;&#26102;&#21051;
          </p>
        </div>
      </div>
      <div class="overview-right">
        <div class="progress-ring">
          <svg class="progress-svg" viewBox="0 0 100 100">
            <circle class="progress-track" cx="50" cy="50" r="42" />
            <circle
              class="progress-fill"
              cx="50"
              cy="50"
              r="42"
              :stroke-dasharray="`${progressCircumference} ${progressCircumference}`"
              :stroke-dashoffset="progressOffset"
            />
          </svg>
          <div class="progress-text">
            <span class="progress-percent">{{ progressPercent }}</span>
            <span class="progress-unit">%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-head">
      <span class="section-line" />
      <span class="section-label">成就陈列</span>
      <span class="section-line" />
    </div>

    <div class="achievement-grid">
      <article
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-card"
        :class="{ unlocked: achievement.unlockedAt }"
      >
        <div class="card-frame" />
        <div class="card-inner">
          <div class="card-top">
            <div class="card-icon">{{ achievement.icon }}</div>
            <div v-if="achievement.unlockedAt" class="card-status unlocked">
              <span class="status-dot" />
            </div>
            <div v-else class="card-status locked">
              <span>&#128274;</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-name">{{ achievement.name }}</h3>
            <p class="card-desc">{{ achievement.description }}</p>
          </div>
          <div class="card-footer">
            <div v-if="achievement.unlockedAt" class="unlock-badge">
              <span>已解锁</span>
            </div>
            <div v-else class="lock-badge">
              <span>未解锁</span>
            </div>
          </div>
        </div>
      </article>

      <article class="achievement-card placeholder">
        <div class="card-inner">
          <div class="card-top">
            <div class="card-icon dim">&#10022;</div>
          </div>
          <div class="card-body">
            <h3 class="card-name dim">敬请期待</h3>
            <p class="card-desc dim">更多成就即将上线</p>
          </div>
          <div class="card-footer">
            <div class="lock-badge">
              <span>待添加</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </HubSubPageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import HubSubPageLayout from "@/components/hub/HubSubPageLayout.vue";
import { ACHIEVEMENTS, loadUnlockedAchievements } from "@/utils/achievements";

const unlockedIds = ref<string[]>([]);

onMounted(() => {
  unlockedIds.value = loadUnlockedAchievements();
});

const achievements = computed(() => {
  const unlocked = new Set(unlockedIds.value);
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlockedAt: unlocked.has(a.id) ? Date.now() : undefined,
  }));
});

const totalCount = computed(() => ACHIEVEMENTS.length);
const unlockedCount = computed(() => unlockedIds.value.length);

const progressPercent = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((unlockedCount.value / totalCount.value) * 100);
});

const progressCircumference = 2 * Math.PI * 42;
const progressOffset = computed(() => {
  return (
    progressCircumference -
    (progressPercent.value / 100) * progressCircumference
  );
});
</script>

<style scoped>
.svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

.progress-pill {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  padding: 0.35rem 0.75rem;
  color: #e8d5a3;
  font-size: 0.8rem;
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 999px;
}

.pill-count {
  color: #fff8e7;
  font-size: 1.05rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(201, 169, 110, 0.35);
}

.pill-sep {
  opacity: 0.6;
}

.pill-total {
  font-size: 0.85rem;
  opacity: 0.85;
}

.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 1.15rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(255, 252, 247, 0.98) 0%,
    rgba(248, 240, 228, 0.95) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.42);
  border-radius: 14px;
  box-shadow:
    0 4px 20px rgba(61, 41, 20, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.overview-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex: 1;
  min-width: 0;
}

.overview-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background: linear-gradient(145deg, #f5ebe0, #e8ddd0);
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 50%;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    0 2px 8px rgba(61, 41, 20, 0.08);
}

.overview-text {
  min-width: 0;
}

.overview-label {
  margin: 0 0 0.3rem;
  color: #3d2914;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 1rem;
  letter-spacing: 0.12em;
}

.overview-desc {
  margin: 0;
  color: #8b7355;
  font-size: 0.78rem;
  line-height: 1.55;
}

.overview-right {
  flex-shrink: 0;
}

.progress-ring {
  position: relative;
  width: 68px;
  height: 68px;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-track {
  fill: none;
  stroke: rgba(201, 169, 110, 0.22);
  stroke-width: 6;
  stroke-linecap: round;
}

.progress-fill {
  fill: none;
  stroke: url(#achievementProgressGradient);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
}

.progress-percent {
  color: #8b4513;
  font-size: 1rem;
  font-weight: 600;
}

.progress-unit {
  color: #8b7355;
  font-size: 0.65rem;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
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
  color: #5c4033;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 0.82rem;
  letter-spacing: 0.2em;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

.achievement-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgba(255, 252, 247, 0.98) 0%,
    rgba(248, 240, 228, 0.95) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.28);
  box-shadow:
    0 4px 16px rgba(61, 41, 20, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.achievement-card:hover {
  transform: translateY(-3px);
  border-color: rgba(201, 169, 110, 0.5);
  box-shadow:
    0 10px 28px rgba(61, 41, 20, 0.1),
    0 0 18px rgba(201, 169, 110, 0.1);
}

.achievement-card.unlocked {
  border-color: rgba(201, 169, 110, 0.55);
  box-shadow:
    0 4px 18px rgba(201, 169, 110, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.achievement-card.placeholder {
  border-style: dashed;
  opacity: 0.55;
}

.card-frame {
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(201, 169, 110, 0.12);
  border-radius: 10px;
  pointer-events: none;
  transition: border-color 0.3s ease;
}

.achievement-card:hover .card-frame {
  border-color: rgba(201, 169, 110, 0.32);
}

.card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  font-size: 1.45rem;
  background: linear-gradient(145deg, #f5ebe0, #e8ddd0);
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 12px;
  opacity: 0.45;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.achievement-card.unlocked .card-icon {
  opacity: 1;
  background: linear-gradient(145deg, #fff8ee, #f5e6d0);
  border-color: rgba(201, 169, 110, 0.5);
}

.achievement-card:hover .card-icon {
  transform: scale(1.06) rotate(-3deg);
}

.card-status {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  font-size: 0.8rem;
  border-radius: 50%;
}

.card-status.locked {
  color: #a09080;
  background: rgba(160, 144, 128, 0.1);
}

.card-status.unlocked {
  background: rgba(90, 138, 58, 0.12);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  margin-top: 0.45rem;
}

.card-name {
  margin: 0;
  color: #8b7355;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
}

.achievement-card.unlocked .card-name {
  color: #3d2914;
}

.card-desc {
  margin: 0;
  color: #a09080;
  font-size: 0.72rem;
  line-height: 1.5;
}

.achievement-card.unlocked .card-desc {
  color: #8b7355;
}

.card-name.dim,
.card-desc.dim,
.card-icon.dim {
  opacity: 0.4;
}

.card-footer {
  margin-top: auto;
  padding-top: 0.5rem;
}

.unlock-badge,
.lock-badge {
  display: inline-flex;
  padding: 0.3rem 0.75rem;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  border-radius: 999px;
}

.unlock-badge {
  color: #5a8a3a;
  background: rgba(90, 138, 58, 0.1);
  border: 1px solid rgba(90, 138, 58, 0.22);
}

.lock-badge {
  color: #a09080;
  background: rgba(160, 144, 128, 0.08);
  border: 1px solid rgba(160, 144, 128, 0.15);
}

.status-dot {
  width: 7px;
  height: 7px;
  background: #5a8a3a;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (max-width: 640px) {
  .overview-card {
    flex-direction: column;
    text-align: center;
  }

  .overview-left {
    flex-direction: column;
  }

  .achievement-grid {
    gap: 0.65rem;
  }

  .card-inner {
    padding: 0.85rem;
  }
}
</style>
