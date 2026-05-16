<template>
  <div class="app">
    <!-- 1. 封面页 -->
    <Transition name="fade">
      <LandingPage
        v-if="page === 'landing'"
        @enter="enterIntro"
        @load="openLoad"
      />
    </Transition>

    <!-- 2. 开场背景视频 -->
    <Transition name="fade">
      <IntroVideo
        v-if="page === 'intro'"
        video-src="/videos/intro.mp4"
        @ended="enterHome"
      />
    </Transition>

    <!-- 3. 功能主页 -->
    <Transition name="fade">
      <HomePage
        v-if="page === 'home'"
        @enter-game="enterGame"
        @load="openLoad"
        @back="backToLanding"
      />
    </Transition>

    <!-- 4. 游戏画面 -->
    <Transition name="fade">
      <GameUI
        v-if="page === 'game'"
        :is-title-screen="false"
        @back-to-title="backToHome"
      />
    </Transition>

    <!-- 全局读档菜单 -->
    <SaveLoadMenu
      :visible="loadMenuVisible"
      mode="load"
      @close="loadMenuVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from './stores/gameStore.ts'
import LandingPage from './components/LandingPage.vue'
import IntroVideo from './components/IntroVideo.vue'
import HomePage from './components/HomePage.vue'
import GameUI from './components/GameUI.vue'
import SaveLoadMenu from './components/SaveLoadMenu.vue'

const store = useGameStore()

// 页面状态: landing | intro | home | game
const page = ref<'landing' | 'intro' | 'home' | 'game'>('landing')
const loadMenuVisible = ref(false)

// 封面 -> 开场视频
function enterIntro() {
  page.value = 'intro'
}

// 开场视频 -> 功能主页
function enterHome() {
  page.value = 'home'
}

// 功能主页 -> 游戏
function enterGame() {
  store.startGame()
  page.value = 'game'
}

// 游戏 -> 功能主页
function backToHome() {
  page.value = 'home'
}

// 功能主页 -> 封面
function backToLanding() {
  page.value = 'landing'
}

// 打开读档
function openLoad() {
  loadMenuVisible.value = true
}
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #faf8f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
