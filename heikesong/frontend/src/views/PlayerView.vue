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
          ref="videoSceneRef"
          :key="currentNode.id"
          :node="currentNode"
          :hold-choices="overlayChoiceOptions"
          @complete="goToNextVideoNode"
          @hold="onVideoHold"
          @choose="commitOverlayChoice"
          @lottery="openLottery"
          @pause-action="handlePauseAction"
          @pause-choice="handlePauseChoice"
        />
      </Transition>

      <Transition name="scene-shift" mode="out-in">
        <NarrationScene
          v-if="currentNode?.type === 'narration'"
          :key="currentNode.id"
          :node="currentNode"
          @next="goToNextNarrationNode"
        />
      </Transition>

      <Transition name="scene-shift" mode="out-in">
        <ChoiceScene
          v-if="currentNode?.type === 'choice' && !videoHolding"
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

      <Transition name="lottery-fade">
        <div v-if="lotteryVisible" class="lottery-overlay">
          <iframe
            src="/lottery-game/index.html"
            class="lottery-iframe"
            frameborder="0"
            allow="autoplay"
          />
          <button class="lottery-close-btn" type="button" @click="closeLottery">
            关闭 ×
          </button>
        </div>
      </Transition>

      <Transition name="lottery-fade">
        <div v-if="miniGameVisible" class="lottery-overlay">
          <div ref="miniGameHost" class="mini-game-host" />
          <button class="lottery-close-btn" type="button" @click="closeMiniGame">
            关闭 ×
          </button>
        </div>
      </Transition>

      <Transition name="lottery-fade">
        <div v-if="fightingGameVisible" class="lottery-overlay">
          <iframe
            src="/fighting-game/index.html"
            class="lottery-iframe"
            frameborder="0"
            allow="autoplay"
          />
          <button class="lottery-close-btn" type="button" @click="closeFightingGame">
            关闭 ×
          </button>
        </div>
      </Transition>

      <Transition name="lottery-fade">
        <div v-if="linkGameVisible" class="lottery-overlay">
          <iframe
            src="/link-game/index.html"
            class="lottery-iframe"
            frameborder="0"
            allow="autoplay"
          />
          <button class="lottery-close-btn" type="button" @click="closeLinkGame">
            关闭 ×
          </button>
        </div>
      </Transition>

      <Transition name="lottery-fade">
        <div v-if="signaturePadVisible" class="lottery-overlay">
          <iframe
            src="/signature-pad/index.html"
            class="lottery-iframe"
            frameborder="0"
            allow="autoplay"
          />
          <button class="lottery-close-btn" type="button" @click="closeSignaturePad">
            关闭 ×
          </button>
        </div>
      </Transition>

      <Transition name="lottery-fade">
        <div v-if="pancakeGameVisible" class="lottery-overlay">
          <iframe
            src="/pancake-game/index.html"
            class="lottery-iframe"
            frameborder="0"
            allow="autoplay"
          />
          <button class="lottery-close-btn" type="button" @click="closePancakeGame">
            关闭 ×
          </button>
        </div>
      </Transition>

      <Transition name="lottery-fade">
        <div v-if="pageGameVisible" class="lottery-overlay">
          <iframe
            src="/777.html"
            class="lottery-iframe"
            frameborder="0"
            allow="autoplay"
          />
          <button class="lottery-close-btn" type="button" @click="closePageGame">
            完成 ✓
          </button>
        </div>
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { StoryEngine } from "@/engine/story";
import type { RuntimeState, StoryNode, VideoNode, NarrationNode, ChoiceNode } from "@/engine/types";
import { createStreamRushGame } from "@/games/streamRush/createStreamRushGame";
import ChoiceScene from "@/scenes/ChoiceScene.vue";
import EndingScene from "@/scenes/EndingScene.vue";
import NarrationScene from "@/scenes/NarrationScene.vue";
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
const videoHolding = ref(false);
const lotteryVisible = ref(false);
const miniGameVisible = ref(false);
const miniGameHost = ref<HTMLElement | null>(null);
const fightingGameVisible = ref(false);
const linkGameVisible = ref(false);
const signaturePadVisible = ref(false);
const pancakeGameVisible = ref(false);
const pageGameVisible = ref(false);
const videoSceneRef = ref<InstanceType<typeof VideoScene> | null>(null);
let miniGame: import("phaser").Game | null = null;

const overlayChoiceOptions = computed(() => {
  if (!engine.value || currentNode.value?.type !== "video") return undefined;
  const videoNode = currentNode.value as VideoNode;
  if (!videoNode.holdOnEnd) return undefined;
  const nextNode = engine.value.getNodeById(videoNode.next);
  if (!nextNode || nextNode.type !== "choice") return undefined;
  return nextNode.options.map((o) => ({ id: o.id, label: o.label }));
});

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
    } else if (route.query.start && typeof route.query.start === "string" && !resumeState) {
      loadedEngine.goto(route.query.start);
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

  videoHolding.value = false;
  engine.value.goto((currentNode.value as VideoNode).next);
  syncFromEngine();
}

function onVideoHold() {
  videoHolding.value = true;
}

function commitOverlayChoice(optionId: string) {
  if (!engine.value || currentNode.value?.type !== "video") return;

  const videoNode = currentNode.value as VideoNode;
  engine.value.goto(videoNode.next);
  engine.value.commitChoice(videoNode.next, optionId);

  videoHolding.value = false;
  syncFromEngine();
}

function openLottery() {
  lotteryVisible.value = true;
}

function closeLottery() {
  lotteryVisible.value = false;
  videoSceneRef.value?.resumePlay();
}

function handlePauseAction(action: string) {
  if (action === "mini-game") {
    openMiniGame();
  } else if (action === "fighting-game") {
    openFightingGame();
  } else if (action === "link-game") {
    openLinkGame();
  } else if (action === "signature-pad") {
    openSignaturePad();
  } else if (action === "pancake-game") {
    openPancakeGame();
  } else if (action === "777-page") {
    openPageGame();
  } else {
    goToNextVideoNode();
  }
}

function handlePauseChoice(nextNodeId: string) {
  if (!engine.value) return;
  engine.value.goto(nextNodeId);
  syncFromEngine();
}

async function openMiniGame() {
  miniGameVisible.value = true;
  await nextTick();
  if (miniGameHost.value) {
    miniGame = createStreamRushGame(miniGameHost.value);
    const scene = miniGame.scene.getScene("stream-rush");
    scene.events.on("stream-rush-finished", () => {
      closeMiniGame();
    });
  }
}

function closeMiniGame() {
  if (miniGame) {
    miniGame.destroy(true);
    miniGame = null;
  }
  miniGameVisible.value = false;
  goToNextVideoNode();
}

function openFightingGame() {
  fightingGameVisible.value = true;
}

function closeFightingGame() {
  fightingGameVisible.value = false;
  goToNextVideoNode();
}

function openLinkGame() {
  linkGameVisible.value = true;
}

function closeLinkGame() {
  linkGameVisible.value = false;
  goToNextVideoNode();
}

function openSignaturePad() {
  signaturePadVisible.value = true;
}

function closeSignaturePad() {
  signaturePadVisible.value = false;
  goToNextVideoNode();
}

function openPancakeGame() {
  pancakeGameVisible.value = true;
}

function closePancakeGame() {
  pancakeGameVisible.value = false;
  videoSceneRef.value?.resumePlay();
}

function openPageGame() {
  pageGameVisible.value = true;
}

function closePageGame() {
  pageGameVisible.value = false;
  goToNextVideoNode();
}

function goToNextNarrationNode() {
  if (!engine.value || currentNode.value?.type !== "narration") {
    return;
  }

  engine.value.goto((currentNode.value as NarrationNode).next);
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

onBeforeUnmount(() => {
  if (miniGame) {
    miniGame.destroy(true);
    miniGame = null;
  }
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

.lottery-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottery-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.lottery-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  z-index: 2001;
  transition: background 0.2s;
}

.lottery-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mini-game-host {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottery-fade-enter-active {
  transition: opacity 0.4s ease;
}

.lottery-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lottery-fade-enter-from,
.lottery-fade-leave-to {
  opacity: 0;
}
</style>
