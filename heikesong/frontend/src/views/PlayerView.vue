<template>
  <main class="page-shell player-shell">
    <section class="player-panel">
      <div class="player-topbar">
        <RouterLink class="text-link" to="/">返回首页</RouterLink>
        <button class="text-link" type="button" @click="restartStory">重新开始</button>
      </div>

      <div v-if="isLoading" class="scene-card loading-card">
        <p class="scene-kicker">加载中</p>
        <h2>正在读取故事脚本</h2>
        <p class="scene-copy">马上就好，我们会恢复到你上次看到的位置。</p>
      </div>

      <div v-else-if="errorMessage" class="scene-card error-card">
        <p class="scene-kicker">加载失败</p>
        <h2>故事脚本暂时不可用</h2>
        <p class="scene-copy">{{ errorMessage }}</p>
        <div class="scene-actions">
          <button class="primary-button" type="button" @click="bootStory">重试</button>
        </div>
      </div>

      <VideoScene
        v-else-if="currentNode?.type === 'video'"
        :node="currentNode"
        @complete="goToNextVideoNode"
      />

      <ChoiceScene
        v-else-if="currentNode?.type === 'choice'"
        :node="currentNode"
        @choose="commitChoice"
      />

      <EndingScene
        v-else-if="currentNode?.type === 'ending'"
        :node="currentNode"
        @restart="restartStory"
      />

      <footer v-if="runtimeState" class="runtime-bar">
        <span>当前节点：{{ runtimeState.nodeId }}</span>
        <span>最近更新：{{ formattedUpdatedAt }}</span>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { StoryEngine } from "@/engine/story";
import type { RuntimeState, StoryNode, VideoNode } from "@/engine/types";
import ChoiceScene from "@/scenes/ChoiceScene.vue";
import EndingScene from "@/scenes/EndingScene.vue";
import VideoScene from "@/scenes/VideoScene.vue";

const route = useRoute();

const engine = ref<StoryEngine | null>(null);
const currentNode = ref<StoryNode | null>(null);
const runtimeState = ref<RuntimeState | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");

const formattedUpdatedAt = computed(() => {
  if (!runtimeState.value) {
    return "";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(runtimeState.value.updatedAt);
});

function syncFromEngine() {
  if (!engine.value) {
    return;
  }

  currentNode.value = engine.value.getCurrentNode();
  runtimeState.value = engine.value.getState();
}

async function bootStory() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const loadedEngine = await StoryEngine.load();
    engine.value = loadedEngine;

    if (route.query.restart === "1") {
      loadedEngine.reset();
    }

    syncFromEngine();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "未知错误";
  } finally {
    isLoading.value = false;
  }
}

function goToNextVideoNode() {
  if (!engine.value || currentNode.value?.type !== "video") {
    return;
  }

  engine.value.goto((currentNode.value as VideoNode).next);
  syncFromEngine();
}

function commitChoice(optionId: string) {
  if (!engine.value || currentNode.value?.type !== "choice") {
    return;
  }

  engine.value.commitChoice(runtimeState.value?.nodeId ?? engine.value.getCurrentNodeId(), optionId);
  syncFromEngine();
}

function restartStory() {
  if (!engine.value) {
    return;
  }

  engine.value.reset();
  syncFromEngine();
}

onMounted(() => {
  bootStory();
});
</script>
