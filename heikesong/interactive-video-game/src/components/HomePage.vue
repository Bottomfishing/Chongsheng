<template>
  <div class="home-page">
    <!-- 纸张背景 -->
    <div class="paper-bg" />
    <div class="grain-overlay" />

    <!-- 装饰边框 -->
    <div class="frame-corner tl" />
    <div class="frame-corner tr" />
    <div class="frame-corner bl" />
    <div class="frame-corner br" />

    <!-- 顶部栏 -->
    <header class="top-bar">
      <div class="logo">
        <span class="logo-icon">&#10022;</span>
        <span class="logo-text">重生小卖部</span>
      </div>
      <div class="date-display">{{ currentDate }}</div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <!-- 欢迎语 -->
      <div class="welcome-section">
        <h2 class="welcome-title">欢迎回来，重生者</h2>
        <p class="welcome-sub">今天是你在九十年代的第 {{ dayCount }} 天</p>
      </div>

      <!-- 功能卡片网格 -->
      <div class="card-grid">
        <!-- 核心：视频剧情 -->
        <div class="feature-card primary" @click="$emit('enter-game')">
          <div class="card-icon">&#9654;</div>
          <h3 class="card-title">剧情模式</h3>
          <p class="card-desc">继续你的重生之旅，每个选择都改变命运</p>
          <div class="card-status">
            <span class="status-dot active" />
            <span>当前进度: 第 {{ currentEpisode }} 章</span>
          </div>
        </div>

        <!-- 功能占位1 -->
        <div class="feature-card" @click="showComingSoon('时光相册')">
          <div class="card-icon">&#10022;</div>
          <h3 class="card-title">时光相册</h3>
          <p class="card-desc">记录你在九十年代的精彩瞬间</p>
          <div class="card-tag">即将开放</div>
        </div>

        <!-- 功能占位2 -->
        <div class="feature-card" @click="showComingSoon('重生商店')">
          <div class="card-icon">&#9733;</div>
          <h3 class="card-title">重生商店</h3>
          <p class="card-desc">用积分兑换各种时代好物</p>
          <div class="card-tag">即将开放</div>
        </div>

        <!-- 功能占位3 -->
        <div class="feature-card" @click="showComingSoon('成就墙')">
          <div class="card-icon">&#9670;</div>
          <h3 class="card-title">成就墙</h3>
          <p class="card-desc">解锁你的重生成就，成为时代弄潮儿</p>
          <div class="card-tag">即将开放</div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="bottom-info">
        <div class="info-item">
          <span class="info-label">重生积分</span>
          <span class="info-value">{{ score }}</span>
        </div>
        <div class="info-divider" />
        <div class="info-item">
          <span class="info-label">已解锁结局</span>
          <span class="info-value">{{ unlockedEndings }}/{{ totalEndings }}</span>
        </div>
        <div class="info-divider" />
        <div class="info-item">
          <span class="info-label">探索度</span>
          <span class="info-value">{{ exploration }}%</span>
        </div>
      </div>
    </main>

    <!-- 底部菜单 -->
    <footer class="footer-menu">
      <button class="footer-btn" @click="$emit('load')">
        <span class="btn-label">读取存档</span>
      </button>
      <button class="footer-btn" @click="$emit('back')">
        <span class="btn-label">返回封面</span>
      </button>
      <button class="footer-btn" @click="showComingSoon('设置')">
        <span class="btn-label">系统设置</span>
      </button>
    </footer>

    <!-- 提示弹窗 -->
    <Transition name="fade">
      <div v-if="comingSoonVisible" class="toast-overlay" @click.self="comingSoonVisible = false">
        <div class="toast-panel">
          <div class="toast-icon">&#10022;</div>
          <p class="toast-text">"{{ comingSoonName }}" 功能还在穿越时空的路上...</p>
          <p class="toast-sub">敬请期待！</p>
          <button class="toast-btn" @click="comingSoonVisible = false">好的</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
  'enter-game': []
  'load': []
  'back': []
}>()

// 模拟数据（后续可接入 store）
const currentDate = ref('1995年5月16日')
const dayCount = ref(1)
const currentEpisode = ref(1)
const score = ref(0)
const unlockedEndings = ref(0)
const totalEndings = ref(6)
const exploration = ref(0)

const comingSoonVisible = ref(false)
const comingSoonName = ref('')

function showComingSoon(name: string) {
  comingSoonName.value = name
  comingSoonVisible.value = true
}
</script>

<style scoped>
.home-page {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #faf8f5;
  z-index: 20;
  display: flex;
  flex-direction: column;
}

/* 纸张纹理 */
.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(201, 169, 110, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(139, 69, 19, 0.04) 0%, transparent 40%),
    #faf8f5;
}
.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* 角落装饰 */
.frame-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #c9a96e;
  opacity: 0.5;
}
.frame-corner.tl { top: 16px; left: 16px; border-right: none; border-bottom: none; }
.frame-corner.tr { top: 16px; right: 16px; border-left: none; border-bottom: none; }
.frame-corner.bl { bottom: 16px; left: 16px; border-right: none; border-top: none; }
.frame-corner.br { bottom: 16px; right: 16px; border-left: none; border-top: none; }

/* 顶部栏 */
.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo-icon {
  color: #c9a96e;
  font-size: 1rem;
}
.logo-text {
  color: #3d2914;
  font-size: 1rem;
  letter-spacing: 3px;
  font-weight: 400;
}
.date-display {
  color: #8b7355;
  font-size: 0.85rem;
  letter-spacing: 1px;
  font-family: monospace;
}

/* 主内容 */
.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  overflow-y: auto;
  gap: 2rem;
}

/* 欢迎语 */
.welcome-section {
  text-align: center;
}
.welcome-title {
  color: #3d2914;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 4px;
  margin: 0 0 0.5rem;
}
.welcome-sub {
  color: #8b7355;
  font-size: 0.9rem;
  margin: 0;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 700px;
}
.feature-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 4px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(61, 41, 20, 0.1);
  border-color: #c9a96e;
}
.feature-card.primary {
  border-color: #c9a96e;
  background: rgba(201, 169, 110, 0.08);
}
.feature-card.primary:hover {
  background: rgba(201, 169, 110, 0.15);
}
.card-icon {
  font-size: 1.5rem;
  color: #c9a96e;
  margin-bottom: 0.75rem;
}
.feature-card.primary .card-icon {
  color: #8b4513;
  font-size: 1.8rem;
}
.card-title {
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0 0 0.5rem;
  letter-spacing: 2px;
}
.card-desc {
  color: #8b7355;
  font-size: 0.8rem;
  line-height: 1.6;
  margin: 0 0 0.75rem;
}
.card-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #5c4033;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c9a96e;
}
.status-dot.active {
  background: #2e8b57;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.card-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(139, 115, 85, 0.1);
  color: #8b7355;
  font-size: 0.7rem;
  letter-spacing: 1px;
  border-radius: 2px;
}

/* 底部信息 */
.bottom-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  border-top: 1px solid rgba(201, 169, 110, 0.2);
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
}
.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.info-label {
  color: #8b7355;
  font-size: 0.7rem;
  letter-spacing: 1px;
}
.info-value {
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 500;
}
.info-divider {
  width: 1px;
  height: 30px;
  background: rgba(201, 169, 110, 0.3);
}

/* 底部菜单 */
.footer-menu {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 0;
  padding: 0;
  border-top: 1px solid rgba(201, 169, 110, 0.3);
}
.footer-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: #8b7355;
  font-size: 0.85rem;
  letter-spacing: 2px;
  font-family: inherit;
  transition: all 0.3s;
  cursor: pointer;
  border-right: 1px solid rgba(201, 169, 110, 0.2);
}
.footer-btn:last-child {
  border-right: none;
}
.footer-btn:hover {
  color: #3d2914;
  background: rgba(201, 169, 110, 0.08);
}
.btn-label {
  position: relative;
}

/* Toast */
.toast-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  background: rgba(250, 248, 245, 0.7);
}
.toast-panel {
  background: #faf8f5;
  border: 1px solid #c9a96e;
  padding: 2rem;
  max-width: 340px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(61, 41, 20, 0.1);
}
.toast-icon {
  font-size: 2rem;
  color: #c9a96e;
  margin-bottom: 1rem;
}
.toast-text {
  color: #3d2914;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 0.5rem;
}
.toast-sub {
  color: #8b7355;
  font-size: 0.85rem;
  margin: 0 0 1.5rem;
}
.toast-btn {
  padding: 0.6rem 2rem;
  background: #3d2914;
  border: none;
  color: #faf8f5;
  font-family: inherit;
  letter-spacing: 2px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}
.toast-btn:hover {
  background: #5c4033;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .bottom-info {
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
  .info-value {
    font-size: 0.9rem;
  }
}
</style>
