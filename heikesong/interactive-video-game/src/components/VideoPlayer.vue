<template>
  <div class="video-wrapper">
    <video
      ref="videoRef"
      :src="src"
      class="video-element"
      playsinline
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @loadedmetadata="onLoadedMeta"
    />
    <!-- 进度条 -->
    <div class="progress-bar" v-if="duration > 0">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  src: string
  isPlaying: boolean
}>()

const emit = defineEmits<{
  timeupdate: [currentTime: number, duration: number]
  ended: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const duration = ref(0)
const currentTime = ref(0)
const progressPercent = ref(0)

watch(() => props.isPlaying, (playing) => {
  nextTick(() => {
    const v = videoRef.value
    if (!v) return
    if (playing) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  })
})

watch(() => props.src, () => {
  duration.value = 0
  currentTime.value = 0
  progressPercent.value = 0
})

function onTimeUpdate() {
  const v = videoRef.value
  if (!v) return
  currentTime.value = v.currentTime
  duration.value = v.duration || 0
  progressPercent.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  emit('timeupdate', currentTime.value, duration.value)
}

function onEnded() {
  emit('ended')
}

function onLoadedMeta() {
  const v = videoRef.value
  if (v) {
    duration.value = v.duration
  }
}

defineExpose({
  videoElement: videoRef,
})
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}
.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
}
.progress-fill {
  height: 100%;
  background: #e74c3c;
  transition: width 0.2s linear;
}
</style>
