<template>
  <main class="page-shell player-shell">
    <section class="player-panel">
      <div class="player-topbar">
        <RouterLink class="text-link" to="/">返回首页</RouterLink>
        <div class="player-actions">
          <button class="text-link" type="button" @click="openSave">保存</button>
          <button class="text-link" type="button" @click="openLoad">读取</button>
          <button class="text-link" type="button" @click="restartStory">重新开始</button>
        </div>
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

      <Transition name="scene-shift" mode="out-in">
        <VideoScene
          v-if="currentNode?.type === 'video'"
          :key="currentNode.id"
          :node="currentNode"
          @complete="goToNextVideoNode"
        />
      </Transition>

      <Transition name="scene-shift" mode="out-in">
        <ChoiceScene
          v-if="currentNode?.type === 'choice'"
          :key="currentNode.id"
          :node="currentNode"
          @choose="commitChoice"
        />
      </Transition>

      <Transition name="scene-shift" mode="out-in">
        <EndingScene
          v-if="currentNode?.type === 'ending'"
          :key="currentNode.id"
          :node="currentNode"
          @restart="restartStory"
        />
      </Transition>

      <footer v-if="runtimeState" class="runtime-bar">
        <span>当前节点：{{ runtimeState.nodeId }}</span>
        <span>最近更新：{{ formattedUpdatedAt }}</span>
      </footer>
    </section>

    <SaveLoadMenu
      :visible="menuVisible"
      :mode="menuMode"
      :current-state="runtimeState"
      @close="menuVisible = false"
      @load="handleLoadSave"
    />
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
import SaveLoadMenu from "@/components/SaveLoadMenu.vue";

const route = useRoute();

const engine = ref<StoryEngine | null>(null);
const currentNode = ref<StoryNode | null>(null);
const runtimeState = ref<RuntimeState | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");
const menuVisible = ref(false);
const menuMode = ref<"save" | "load">("save");

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

async function bootStory(resumeState?: RuntimeState) {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const loadedEngine = await StoryEngine.load(resumeState);
    engine.value = loadedEngine;

    if (route.query.restart === "1" && !resumeState) {
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

function openSave() {
  menuMode.value = "save";
  menuVisible.value = true;
}

function openLoad() {
  menuMode.value = "load";
  menuVisible.value = true;
}

function handleLoadSave(state: RuntimeState) {
  bootStory(state);
}

onMounted(() => {
  bootStory();
});
</script>

<style scoped>
.player-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scene-shift-enter-active,
.scene-shift-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.scene-shift-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.scene-shift-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
