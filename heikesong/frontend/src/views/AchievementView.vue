<template>
  <div class="achievement-page">
    <!-- SVG 渐变定义 -->
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;">
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c9a96e" />
          <stop offset="100%" stop-color="#8b4513" />
        </linearGradient>
      </defs>
    </svg>

    <div class="paper-bg" />
    <div class="grain-overlay" />

    <!-- 浮动粒子背景 -->
    <div class="particle-layer">
      <div v-for="n in 12" :key="n" class="particle" :class="`p-${n}`" />
    </div>

    <!-- 顶部导航栏 -->
    <header class="top-bar">
      <button class="back-btn" type="button" @click="goBack">
        <span class="back-icon">&#8249;</span>
        <span>返回</span>
      </button>
      <div class="page-title">
        <span class="title-icon">&#9670;</span>
        <span>成就墙</span>
      </div>
      <div class="progress-info">
        <span class="progress-count">{{ unlockedCount }}</span>
        <span class="progress-sep">/</span>
        <span class="progress-total">{{ totalCount }}</span>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="achievement-container">
        <!-- 总览卡片 -->
        <div class="overview-card">
          <div class="overview-left">
            <div class="overview-icon">&#127942;</div>
            <div class="overview-text">
              <div class="overview-label">重生成就簿</div>
              <div class="overview-desc">
                收集你在重生之旅中的每一个高光时刻
              </div>
            </div>
          </div>
          <div class="overview-right">
            <div class="progress-ring">
              <svg class="progress-svg" viewBox="0 0 100 100">
                <circle
                  class="progress-track"
                  cx="50"
                  cy="50"
                  r="42"
                />
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

        <!-- 成就网格 -->
        <div class="achievement-grid">
          <div
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
          </div>

          <!-- 占位卡片（保持网格美观） -->
          <div class="achievement-card placeholder">
            <div class="card-inner">
              <div class="card-top">
                <div class="card-icon dim">❓</div>
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
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ACHIEVEMENTS,
  loadUnlockedAchievements,
} from "@/utils/achievements";
import type { Achievement } from "@/utils/achievements";

const router = useRouter();

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

function goBack() {
  router.push("/");
}
</script>

<style scoped>
.achievement-page {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  background: rgba(250, 248, 245, 0.92);
  color: #3d2914;
  overflow: hidden;
}

.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.04) 0%, transparent 40%),
    linear-gradient(180deg, #fdfbf7 0%, #f5f0e8 100%);
  pointer-events: none;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* 粒子背景 */
.particle-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.5) 0%, transparent 70%);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

.p-1 { left: 15%; top: 85%; animation-duration: 14s; animation-delay: 0s; }
.p-2 { left: 25%; top: 90%; animation-duration: 18s; animation-delay: 1s; width: 5px; height: 5px; }
.p-3 { left: 35%; top: 88%; animation-duration: 12s; animation-delay: 2s; }
.p-4 { left: 55%; top: 92%; animation-duration: 16s; animation-delay: 0.5s; width: 4px; height: 4px; }
.p-5 { left: 70%; top: 87%; animation-duration: 13s; animation-delay: 1.5s; }
.p-6 { left: 80%; top: 91%; animation-duration: 17s; animation-delay: 3s; width: 5px; height: 5px; }
.p-7 { left: 10%; top: 75%; animation-duration: 15s; animation-delay: 2s; }
.p-8 { left: 45%; top: 80%; animation-duration: 11s; animation-delay: 0.8s; width: 4px; height: 4px; }
.p-9 { left: 60%; top: 78%; animation-duration: 19s; animation-delay: 1.2s; }
.p-10 { left: 85%; top: 82%; animation-duration: 14s; animation-delay: 2.5s; width: 3px; height: 3px; }
.p-11 { left: 20%; top: 70%; animation-duration: 16s; animation-delay: 0.3s; }
.p-12 { left: 50%; top: 72%; animation-duration: 13s; animation-delay: 1.8s; width: 4px; height: 4px; }

@keyframes particle-float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-120vh) scale(0.5);
    opacity: 0;
  }
}

/* 顶部导航栏 */
.top-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
  background: rgba(253, 251, 247, 0.85);
  backdrop-filter: blur(12px);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  color: #8b7355;
  font-size: 0.85rem;
  font-family: inherit;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #5c4126;
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(201, 169, 110, 0.5);
  transform: translateX(-2px);
}

.back-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "STXingkai", "Xingkai SC", "行楷", "STKaiti", "KaiTi", serif;
  letter-spacing: 0.15em;
}

.title-icon {
  color: #c9a96e;
  font-size: 0.9rem;
}

.progress-info {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  color: #8b7355;
  font-size: 0.9rem;
}

.progress-count {
  color: #8b4513;
  font-size: 1.2rem;
  font-weight: 600;
}

.progress-sep {
  color: #c9a96e;
  font-size: 0.85rem;
}

.progress-total {
  color: #8b7355;
  font-size: 0.9rem;
}

/* 主内容区 */
.main-content {
  position: relative;
  z-index: 5;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem 1.25rem 2rem;
}

.main-content::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}

.main-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.achievement-container {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 总览卡片 */
.overview-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.75rem;
  background: linear-gradient(135deg, rgba(255, 252, 247, 0.98) 0%, rgba(248, 240, 228, 0.95) 100%);
  border: 2px solid rgba(201, 169, 110, 0.4);
  border-radius: 16px;
  box-shadow:
    0 4px 20px rgba(61, 41, 20, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.overview-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.overview-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  font-size: 1.6rem;
  background: linear-gradient(145deg, #f5ebe0, #e8ddd0);
  border: 2px solid rgba(201, 169, 110, 0.35);
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(61, 41, 20, 0.08);
}

.overview-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.overview-label {
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "STXingkai", "Xingkai SC", "行楷", "STKaiti", "KaiTi", serif;
  letter-spacing: 0.1em;
}

.overview-desc {
  color: #8b7355;
  font-size: 0.78rem;
  line-height: 1.5;
}

.overview-right {
  flex-shrink: 0;
}

.progress-ring {
  position: relative;
  width: 72px;
  height: 72px;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-track {
  fill: none;
  stroke: rgba(201, 169, 110, 0.2);
  stroke-width: 6;
  stroke-linecap: round;
}

.progress-fill {
  fill: none;
  stroke: url(#progressGradient);
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
  font-size: 1.1rem;
  font-weight: 600;
}

.progress-unit {
  color: #8b7355;
  font-size: 0.7rem;
}

/* 成就网格 */
.achievement-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.achievement-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255, 252, 247, 0.98) 0%, rgba(248, 240, 228, 0.95) 100%);
  border: 2px solid rgba(201, 169, 110, 0.25);
  box-shadow:
    0 4px 20px rgba(61, 41, 20, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s ease,
              border-color 0.35s ease;
  overflow: hidden;
}

.achievement-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 12px 32px rgba(61, 41, 20, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-color: rgba(201, 169, 110, 0.45);
}

.achievement-card.unlocked {
  border-color: rgba(201, 169, 110, 0.5);
  box-shadow:
    0 4px 20px rgba(201, 169, 110, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.achievement-card.unlocked:hover {
  border-color: rgba(201, 169, 110, 0.7);
  box-shadow:
    0 12px 32px rgba(201, 169, 110, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.achievement-card.placeholder {
  opacity: 0.55;
  border-style: dashed;
}

.card-frame {
  position: absolute;
  inset: -3px;
  border-radius: 18px;
  border: 1.5px solid rgba(201, 169, 110, 0.15);
  pointer-events: none;
  transition: border-color 0.3s ease;
}

.achievement-card:hover .card-frame {
  border-color: rgba(201, 169, 110, 0.35);
}

.card-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  font-size: 1.6rem;
  background: linear-gradient(145deg, #f5ebe0, #e8ddd0);
  border: 1.5px solid rgba(201, 169, 110, 0.3);
  border-radius: 14px;
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.8), 0 1px 4px rgba(61, 41, 20, 0.06);
  opacity: 0.45;
  transition: all 0.3s ease;
}

.achievement-card.unlocked .card-icon {
  opacity: 1;
  background: linear-gradient(145deg, #fff8ee, #f5e6d0);
  border-color: rgba(201, 169, 110, 0.5);
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(201, 169, 110, 0.15);
}

.achievement-card:hover .card-icon {
  transform: scale(1.1) rotate(-4deg);
}

.card-status {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  font-size: 0.85rem;
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
  gap: 0.35rem;
  margin-top: 0.5rem;
}

.card-name {
  margin: 0;
  color: #8b7355;
  font-size: 1rem;
  font-weight: 500;
  font-family: "STKaiti", "KaiTi", "楷体", "Noto Serif SC", serif;
  letter-spacing: 0.08em;
  transition: color 0.3s ease;
}

.achievement-card.unlocked .card-name {
  color: #3d2914;
}

.card-desc {
  margin: 0;
  color: #a09080;
  font-size: 0.75rem;
  line-height: 1.5;
  transition: color 0.3s ease;
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
  padding-top: 0.75rem;
}

.unlock-badge,
.lock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  border-radius: 999px;
  transition: all 0.3s ease;
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
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* 响应式 */
@media (max-width: 640px) {
  .overview-card {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }

  .overview-left {
    flex-direction: column;
    gap: 0.75rem;
  }

  .achievement-grid {
    gap: 0.75rem;
  }

  .card-inner {
    padding: 0.9rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
    border-radius: 12px;
  }

  .card-name {
    font-size: 0.9rem;
  }

  .card-desc {
    font-size: 0.7rem;
  }

  .top-bar {
    padding: 0.75rem 1rem;
  }

  .page-title {
    font-size: 0.95rem;
  }
}
</style>