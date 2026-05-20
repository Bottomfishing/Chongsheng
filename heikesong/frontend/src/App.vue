<template>
  <div class="app-shell">
    <MusicPlayer />
    <RouterView v-slot="{ Component, route }">
      <Transition
        :name="route.meta.transition as string || 'page-slide'"
        mode="out-in"
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import MusicPlayer from "@/components/MusicPlayer.vue";
</script>

<style>
/* 页面切换：下滑入 / 上滑出 */
.page-slide-enter-active,
.page-slide-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* 从 SoulTalk 返回首页的反向切换 */
.page-slide-reverse-enter-active,
.page-slide-reverse-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-slide-reverse-enter-from {
  opacity: 0;
  transform: translateY(-18px);
}

.page-slide-reverse-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
