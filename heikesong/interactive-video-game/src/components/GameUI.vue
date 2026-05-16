<template>
  <div class="game-ui">
    <!-- 视频层 -->
    <VideoPlayer
      :src="store.currentNode?.videoSrc || ''"
      :is-playing="store.isPlaying"
      @timeupdate="store.onTimeUpdate"
      @ended="store.onVideoEnded"
    />

    <!-- 选项层 -->
    <ChoiceOverlay
      :visible="store.showChoices"
      :choices="store.currentNode?.choices || []"
      @select="store.makeChoice"
    />

    <!-- 顶部 HUD -->
    <div class="game-hud" v-if="!isTitleScreen">
      <div class="hud-left">{{ store.story.title }}</div>
      <div class="hud-right">
        <button class="hud-btn" @click="openSave">保存</button>
        <button class="hud-btn" @click="openLoad">读取</button>
        <button class="hud-btn" @click="backToTitle">退出</button>
      </div>
    </div>

    <!-- 结局重玩提示 -->
    <div v-if="store.isEnding && !store.showChoices" class="ending-overlay">
      <button class="replay-btn" @click="store.startGame">重新播放</button>
      <button class="replay-btn" @click="backToTitle">返回标题</button>
    </div>

    <!-- 存档菜单 -->
    <SaveLoadMenu
      :visible="menuVisible"
      :mode="menuMode"
      @close="menuVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore.ts'
import VideoPlayer from './VideoPlayer.vue'
import ChoiceOverlay from './ChoiceOverlay.vue'
import SaveLoadMenu from './SaveLoadMenu.vue'

defineProps<{
  isTitleScreen: boolean
}>()

const emit = defineEmits<{
  'back-to-title': []
}>()

const store = useGameStore()
const menuVisible = ref(false)
const menuMode = ref<'save' | 'load'>('save')

function openSave() {
  menuMode.value = 'save'
  menuVisible.value = true
  store.isPlaying = false
}

function openLoad() {
  menuMode.value = 'load'
  menuVisible.value = true
  store.isPlaying = false
}

function backToTitle() {
  emit('back-to-title')
}
</script>

<style scoped>
.game-ui {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}
.game-hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  z-index: 5;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}
.hud-left {
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
}
.hud-right {
  display: flex;
  gap: 0.5rem;
}
.hud-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}
.hud-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
.ending-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 15;
  background: rgba(0, 0, 0, 0.6);
}
.replay-btn {
  padding: 1rem 3rem;
  font-size: 1.1rem;
  background: rgba(231, 76, 60, 0.9);
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}
.replay-btn:hover {
  transform: scale(1.05);
}
</style>
