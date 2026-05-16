<template>
  <div class="landing-page">
    <!-- 纸张纹理背景 -->
    <div class="paper-bg" />
    <div class="grain-overlay" />

    <!-- 装饰边框 -->
    <div class="frame-corner tl" />
    <div class="frame-corner tr" />
    <div class="frame-corner bl" />
    <div class="frame-corner br" />

    <!-- 内容 -->
    <div class="content">
      <!-- 顶部：复古邮戳 -->
      <div class="stamp">
        <div class="stamp-circle">
          <span class="stamp-text">重生认证</span>
        </div>
      </div>

      <!-- 主标题区 -->
      <div class="title-area">
        <div class="deco-line top">
          <span class="ornament">&#10022;</span>
        </div>
        <h1 class="main-title">
          <span class="title-line">重生之</span>
          <span class="title-line accent">回到九十年代</span>
          <span class="title-line">玩抖音</span>
        </h1>
        <div class="deco-line bottom">
          <span class="ornament">&#10022;</span>
        </div>
      </div>

      <!-- 副标题 -->
      <p class="tagline">"如果九十年代的你拥有了抖音..."</p>

      <!-- 打字机效果描述 -->
      <div class="desc-box">
        <p class="typewriter">{{ displayedText }}<span class="cursor" v-if="showCursor">|</span></p>
      </div>

      <!-- 主按钮 -->
      <div class="action-area">
        <button class="start-btn" @click="enterGame" :disabled="!typewriterDone">
          <span class="btn-border">
            <span class="btn-inner">
              <span class="btn-icon">&#9654;</span>
              <span>{{ typewriterDone ? '开始重生' : '系统加载中...' }}</span>
            </span>
          </span>
        </button>
      </div>

      <!-- 底部菜单 -->
      <div class="bottom-menu">
        <button class="menu-link" @click="$emit('load')">
          <span class="link-dot" />
          读取存档
        </button>
        <span class="link-sep">&#10022;</span>
        <button class="menu-link" @click="showAbout = true">
          <span class="link-dot" />
          关于重生
        </button>
      </div>
    </div>

    <!-- 关于弹窗 -->
    <Transition name="fade">
      <div v-if="showAbout" class="modal-overlay" @click.self="showAbout = false">
        <div class="modal-panel">
          <div class="modal-header">
            <h3>关于重生</h3>
            <button class="modal-close" @click="showAbout = false">&times;</button>
          </div>
          <div class="modal-body">
            <p>这是一段荒诞的穿越之旅。</p>
            <p>你重生到了九十年代，却意外发现手机里的抖音居然还能用！</p>
            <p>在这个没有流量、没有美颜、没有带货的年代，你打算怎么玩？</p>
            <p>每一个选择，都将导向意想不到的结局...</p>
          </div>
          <div class="modal-footer">
            <button class="modal-btn" @click="showAbout = false">知道了</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  enter: []
  load: []
}>()

const fullText = ref('你睁开眼，发现自己躺在一张硬板床上。窗外传来自行车的铃声，墙上的日历赫然写着：1995年。你下意识地摸向口袋——手机还在！而且...抖音居然能打开？！')
const displayedText = ref('')
const showCursor = ref(true)
const typewriterDone = ref(false)
const showAbout = ref(false)

onMounted(() => {
  let index = 0
  const interval = setInterval(() => {
    if (index < fullText.value.length) {
      displayedText.value += fullText.value[index]
      index++
    } else {
      clearInterval(interval)
      typewriterDone.value = true
      setTimeout(() => { showCursor.value = false }, 3000)
    }
  }, 40)
})

function enterGame() {
  emit('enter')
}
</script>

<style scoped>
.landing-page {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #faf8f5;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 纸张纹理 */
.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 80%, rgba(139, 69, 19, 0.04) 0%, transparent 50%),
    #faf8f5;
}
.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* 角落装饰 */
.frame-corner {
  position: absolute;
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
  bottom: 24px;
  right: 24px;
  border-left: none;
  border-top: none;
}

/* 内容 */
.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 2rem 5rem;
  max-width: 640px;
  width: 100%;
  gap: 1.2rem;
  overflow-y: auto;
}

/* 邮戳 */
.stamp {
  margin-bottom: 0.5rem;
}
.stamp-circle {
  width: 80px;
  height: 80px;
  border: 3px double #c9a96e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-12deg);
  opacity: 0.7;
}
.stamp-text {
  font-size: 0.75rem;
  color: #c9a96e;
  letter-spacing: 2px;
  font-weight: bold;
}

/* 标题区 */
.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.deco-line {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}
.deco-line::before,
.deco-line::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a96e, transparent);
  max-width: 120px;
}
.ornament {
  color: #c9a96e;
  font-size: 1.2rem;
}
.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}
.title-line {
  font-size: clamp(1.5rem, 4vw, 2.8rem);
  color: #3d2914;
  font-weight: 400;
  letter-spacing: 6px;
  line-height: 1.3;
}
.title-line.accent {
  color: #8b4513;
  font-weight: bold;
  font-size: clamp(2rem, 5vw, 3.2rem);
  letter-spacing: 8px;
}

/* 副标题 */
.tagline {
  color: #8b7355;
  font-size: 1rem;
  font-style: italic;
  letter-spacing: 2px;
  margin: 0;
}

/* 描述框 */
.desc-box {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 4px;
  padding: 1.5rem 2rem;
  max-width: 500px;
  min-height: 80px;
}
.typewriter {
  color: #5c4033;
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0;
  text-align: left;
}
.cursor {
  color: #8b4513;
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}

/* 主按钮 */
.action-area {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.start-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.start-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.btn-border {
  display: inline-block;
  padding: 3px;
  border: 1px solid #c9a96e;
}
.btn-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 2.5rem;
  background: #3d2914;
  color: #faf8f5;
  font-size: 1rem;
  letter-spacing: 4px;
  transition: all 0.3s ease;
}
.start-btn:hover:not(:disabled) .btn-inner {
  background: #5c4033;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 41, 20, 0.3);
}
.btn-icon {
  font-size: 0.8rem;
}

/* 底部菜单 */
.bottom-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}
.menu-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: #8b7355;
  font-size: 0.85rem;
  transition: color 0.3s;
  font-family: inherit;
  letter-spacing: 1px;
}
.menu-link:hover {
  color: #3d2914;
}
.link-dot {
  width: 5px;
  height: 5px;
  background: currentColor;
  border-radius: 50%;
}
.link-sep {
  color: #c9a96e;
  font-size: 0.7rem;
  opacity: 0.6;
}

/* ========== 弹窗 ========== */
.modal-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  background: rgba(250, 248, 245, 0.85);
  backdrop-filter: blur(4px);
}
.modal-panel {
  background: #faf8f5;
  border: 1px solid #c9a96e;
  padding: 0;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(61, 41, 20, 0.15);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
}
.modal-header h3 {
  color: #3d2914;
  margin: 0;
  font-weight: 400;
  letter-spacing: 2px;
  font-size: 1.1rem;
}
.modal-close {
  background: none;
  border: none;
  color: #8b7355;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}
.modal-body {
  padding: 1.5rem;
}
.modal-body p {
  color: #5c4033;
  line-height: 1.8;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
.modal-body p:last-child {
  margin-bottom: 0;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(201, 169, 110, 0.3);
  text-align: center;
}
.modal-btn {
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
.modal-btn:hover {
  background: #5c4033;
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
