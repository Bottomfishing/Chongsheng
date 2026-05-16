<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="settings-portal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      @click.self="close"
    >
      <div class="settings-panel">
        <header class="settings-header">
          <div class="settings-header-text">
            <p class="settings-eyebrow">ARCHIVE CONTROL</p>
            <h2 id="settings-title" class="settings-title">系统设置</h2>
          </div>
          <button
            class="settings-close"
            type="button"
            aria-label="关闭设置"
            @click="close"
          >
            &times;
          </button>
        </header>

        <div class="settings-body">
          <section class="settings-section" aria-labelledby="settings-display">
            <h3 id="settings-display" class="section-title">
              <span class="section-mark" aria-hidden="true">&#10022;</span>
              显示与氛围
            </h3>

            <label class="setting-row setting-slider">
              <span class="setting-label">
                复古底图浓度
                <span class="setting-value"
                  >{{ Math.round(vintagePercent) }}%</span
                >
              </span>
              <input
                v-model.number="vintagePercent"
                class="setting-range"
                type="range"
                min="0"
                max="60"
                step="5"
                @input="onVintageInput"
              />
              <span class="setting-hint">调节全站泛黄老照片背景的深浅</span>
            </label>

            <div class="setting-row setting-toggle">
              <span class="setting-label">CRT 扫描线</span>
              <button
                class="toggle"
                type="button"
                role="switch"
                :aria-checked="local.scanlines"
                :class="{ on: local.scanlines }"
                @click="toggleScanlines"
              >
                <span class="toggle-thumb" />
              </button>
            </div>

            <div class="setting-row setting-toggle">
              <span class="setting-label">首页飘尘动效</span>
              <button
                class="toggle"
                type="button"
                role="switch"
                :aria-checked="local.ambience"
                :class="{ on: local.ambience }"
                @click="toggleAmbience"
              >
                <span class="toggle-thumb" />
              </button>
            </div>
          </section>

          <section class="settings-section" aria-labelledby="settings-data">
            <h3 id="settings-data" class="section-title">
              <span class="section-mark" aria-hidden="true">&#10022;</span>
              数据管理
            </h3>

            <div v-if="confirmStep" class="confirm-box">
              <p class="confirm-text">{{ confirmMessage }}</p>
              <div class="confirm-actions">
                <button
                  class="btn-ghost"
                  type="button"
                  @click="confirmStep = null"
                >
                  取消
                </button>
                <button
                  class="btn-danger"
                  type="button"
                  @click="runConfirmAction"
                >
                  确认
                </button>
              </div>
            </div>

            <ul v-else class="action-list">
              <li>
                <button
                  class="action-btn"
                  type="button"
                  @click="askConfirm('runtime')"
                >
                  <span class="action-name">清除剧情进度</span>
                  <span class="action-desc">删除当前进行中的主线存档</span>
                </button>
              </li>
              <li>
                <button
                  class="action-btn"
                  type="button"
                  @click="askConfirm('saves')"
                >
                  <span class="action-name">清空存档槽位</span>
                  <span class="action-desc">移除所有手动存档记录</span>
                </button>
              </li>
              <li>
                <button
                  class="action-btn"
                  type="button"
                  @click="askConfirm('achievements')"
                >
                  <span class="action-name">重置成就</span>
                  <span class="action-desc">已解锁成就将全部归零</span>
                </button>
              </li>
              <li>
                <button class="action-btn" type="button" @click="onReplayIntro">
                  <span class="action-name">重新观看开场</span>
                  <span class="action-desc">再次播放信号接入与穿越动画</span>
                </button>
              </li>
            </ul>
          </section>

          <p class="settings-version">重生企划 · Web v0.1</p>
        </div>

        <footer class="settings-footer">
          <button class="btn-primary" type="button" @click="close">完成</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  appSettings,
  patchSettings,
  type AppSettings,
} from "@/utils/settings";
import { clearRuntimeState } from "@/engine/storage";
import { SAVES_STORAGE_KEY } from "@/engine/saves";
import { saveUnlockedAchievements } from "@/utils/achievements";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  replayIntro: [];
  dataCleared: [];
}>();

type ConfirmStep = "runtime" | "saves" | "achievements";

const local = ref<AppSettings>({ ...appSettings.value });
const vintagePercent = ref(Math.round(appSettings.value.vintageOpacity * 100));
const confirmStep = ref<ConfirmStep | null>(null);

const confirmMessage = computed(() => {
  switch (confirmStep.value) {
    case "runtime":
      return "确定清除当前剧情进度？此操作不可撤销。";
    case "saves":
      return "确定清空所有存档槽位？此操作不可撤销。";
    case "achievements":
      return "确定重置全部成就？已获得的徽章将被移除。";
    default:
      return "";
  }
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      local.value = { ...appSettings.value };
      vintagePercent.value = Math.round(local.value.vintageOpacity * 100);
      confirmStep.value = null;
    }
  },
);

function close() {
  emit("update:open", false);
}

function onVintageInput() {
  const opacity = vintagePercent.value / 100;
  local.value.vintageOpacity = opacity;
  patchSettings({ vintageOpacity: opacity });
}

function toggleScanlines() {
  local.value.scanlines = !local.value.scanlines;
  patchSettings({ scanlines: local.value.scanlines });
}

function toggleAmbience() {
  local.value.ambience = !local.value.ambience;
  patchSettings({ ambience: local.value.ambience });
}

function askConfirm(step: ConfirmStep) {
  confirmStep.value = step;
}

function runConfirmAction() {
  switch (confirmStep.value) {
    case "runtime":
      clearRuntimeState();
      break;
    case "saves":
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(SAVES_STORAGE_KEY);
      }
      break;
    case "achievements":
      saveUnlockedAchievements([]);
      break;
    default:
      break;
  }

  confirmStep.value = null;
  emit("dataCleared");
}

function onReplayIntro() {
  close();
  emit("replayIntro");
}
</script>

<style scoped>
.settings-portal {
  position: fixed;
  inset: 0;
  z-index: 10120;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(6, 4, 2, 0.72);
  backdrop-filter: blur(8px);
}

.settings-panel {
  display: flex;
  flex-direction: column;
  width: min(100%, 420px);
  max-height: min(90vh, 640px);
  overflow: hidden;
  background: linear-gradient(
    165deg,
    rgba(28, 22, 14, 0.98) 0%,
    rgba(18, 14, 8, 0.99) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.45);
  border-radius: 14px;
  box-shadow:
    0 0 24px rgba(201, 169, 110, 0.12),
    0 24px 64px rgba(0, 0, 0, 0.45);
  animation: panel-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.settings-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem 0.85rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.25);
}

.settings-eyebrow {
  margin: 0 0 0.2rem;
  color: rgba(201, 169, 110, 0.65);
  font-size: 0.62rem;
  letter-spacing: 0.32em;
}

.settings-title {
  margin: 0;
  color: #e8d5a3;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.18em;
}

.settings-close {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  color: rgba(232, 213, 163, 0.75);
  font-size: 1.5rem;
  line-height: 1;
  background: transparent;
  border: 1px solid rgba(201, 169, 110, 0.3);
  border-radius: 6px;
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s;
}

.settings-close:hover {
  color: #fff8e7;
  background: rgba(201, 169, 110, 0.12);
  border-color: rgba(201, 169, 110, 0.55);
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 1.25rem 1rem;
}

.settings-section {
  margin-top: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.75rem;
  color: rgba(232, 213, 163, 0.9);
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.14em;
}

.section-mark {
  color: rgba(201, 169, 110, 0.8);
  font-size: 0.65rem;
}

.setting-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(201, 169, 110, 0.12);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-slider {
  flex-direction: column;
  align-items: stretch;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #e8d5a3;
  font-size: 0.88rem;
  letter-spacing: 0.06em;
}

.setting-value {
  color: rgba(201, 169, 110, 0.9);
  font-family: monospace;
  font-size: 0.8rem;
}

.setting-hint {
  width: 100%;
  color: rgba(139, 115, 85, 0.85);
  font-size: 0.72rem;
  line-height: 1.5;
}

.setting-range {
  width: 100%;
  height: 4px;
  margin: 0.35rem 0 0;
  accent-color: #c9a96e;
  cursor: pointer;
}

.toggle {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 24px;
  padding: 0;
  background: rgba(20, 15, 8, 0.9);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
  transition:
    background 0.25s,
    border-color 0.25s;
}

.toggle.on {
  background: rgba(201, 169, 110, 0.25);
  border-color: rgba(201, 169, 110, 0.65);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(139, 115, 85, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, background 0.25s;
}

.toggle.on .toggle-thumb {
  transform: translateX(20px);
  background: #e8d5a3;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.5);
}

.action-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  width: 100%;
  padding: 0.7rem 0.65rem;
  text-align: left;
  background: rgba(201, 169, 110, 0.04);
  border: 1px solid rgba(201, 169, 110, 0.18);
  border-radius: 8px;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.action-list li + li {
  margin-top: 0.45rem;
}

.action-btn:hover {
  background: rgba(201, 169, 110, 0.1);
  border-color: rgba(201, 169, 110, 0.4);
}

.action-name {
  color: #e8d5a3;
  font-size: 0.88rem;
  letter-spacing: 0.06em;
}

.action-desc {
  color: rgba(139, 115, 85, 0.9);
  font-size: 0.72rem;
}

.confirm-box {
  padding: 0.85rem;
  background: rgba(180, 60, 40, 0.08);
  border: 1px solid rgba(231, 76, 60, 0.35);
  border-radius: 8px;
}

.confirm-text {
  margin: 0 0 0.75rem;
  color: #f0d4c8;
  font-size: 0.85rem;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-ghost,
.btn-danger,
.btn-primary {
  padding: 0.45rem 1rem;
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  border-radius: 6px;
  border: 1px solid transparent;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.btn-ghost {
  color: rgba(232, 213, 163, 0.85);
  background: transparent;
  border-color: rgba(201, 169, 110, 0.3);
}

.btn-ghost:hover {
  background: rgba(201, 169, 110, 0.08);
}

.btn-danger {
  color: #fff5f2;
  background: rgba(180, 50, 35, 0.85);
  border-color: rgba(231, 76, 60, 0.5);
}

.btn-danger:hover {
  background: rgba(200, 55, 38, 0.95);
}

.settings-version {
  margin: 1.25rem 0 0;
  color: rgba(139, 115, 85, 0.75);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-align: center;
}

.settings-footer {
  padding: 0.85rem 1.25rem 1.15rem;
  border-top: 1px solid rgba(201, 169, 110, 0.2);
}

.btn-primary {
  width: 100%;
  padding: 0.65rem;
  color: #1a1408;
  background: linear-gradient(180deg, #e8d5a3 0%, #c9a96e 100%);
  border-color: rgba(232, 213, 163, 0.5);
  box-shadow: 0 0 16px rgba(201, 169, 110, 0.2);
}

.btn-primary:hover {
  filter: brightness(1.06);
}
</style>
