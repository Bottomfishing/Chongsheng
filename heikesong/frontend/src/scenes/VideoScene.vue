<template>
  <section class="scene-card">
    <header class="scene-header">
      <p class="scene-kicker">视频节点</p>
      <h2>{{ node.title ?? "请观看这一段剧情" }}</h2>
      <p class="scene-copy">
        {{ node.description ?? "视频播放结束后会自动进入下一节点；如果本地还没放入视频，也可以手动继续。" }}
      </p>
    </header>

    <div class="video-frame">
      <video
        v-if="!hasVideoError"
        ref="videoRef"
        :key="node.src"
        class="story-video"
        :src="node.src"
        controls
        playsinline
        preload="metadata"
        @ended="onEnded"
        @timeupdate="onTimeUpdate"
        @error="hasVideoError = true"
      />

      <div v-else class="video-fallback">
        <p>未找到视频文件：`{{ node.src }}`</p>
        <p>你可以把对应 mp4 放进 `public/videos/`，或者先继续走完整个互动流程。</p>
      </div>
    </div>

    <div class="scene-actions">
      <button class="primary-button" type="button" @click="emitComplete">
        {{ hasVideoError ? "继续到下一段" : "跳过视频继续" }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { VideoNode } from "@/engine/types";

const emit = defineEmits<{
  complete: [];
}>();

const props = defineProps<{
  node: VideoNode;
}>();

const hasVideoError = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
let triggered = false;

function emitComplete() {
  emit("complete");
}

function onEnded() {
  if (!triggered) {
    triggered = true;
    emitComplete();
  }
}

function onTimeUpdate() {
  const video = videoRef.value;
  if (!video || triggered) {
    return;
  }

  const triggerTime = props.node.triggerTime;
  if (triggerTime && video.currentTime >= triggerTime) {
    triggered = true;
    video.pause();
    emitComplete();
  }
}

watch(
  () => props.node.src,
  () => {
    hasVideoError.value = false;
    triggered = false;
  },
);
</script>
