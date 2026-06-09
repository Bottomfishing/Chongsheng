<template>
  <button class="music-btn" :class="{ paused: !playing }" @click="toggle" aria-label="背景音乐">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { assetPath } from "@/utils/asset";

const playing = ref(false);
let audio: HTMLAudioElement;

onMounted(() => {
  audio = new Audio(assetPath("music/yuai.mp3"));
  audio.loop = true;
  audio.volume = 0.4;
});

function toggle() {
  if (!audio) return;
  if (playing.value) {
    audio.pause();
  } else {
    audio.play();
  }
  playing.value = !playing.value;
}
</script>

<style scoped>
.music-btn {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 9999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(61, 41, 20, 0.8);
  color: #faf8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: spin 4s linear infinite;
  transition: background 0.2s;
}

.music-btn:hover {
  background: rgba(61, 41, 20, 1);
}

.music-btn.paused {
  animation-play-state: paused;
  opacity: 0.6;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
