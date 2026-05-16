<template>
  <section
    v-if="showPanel"
    class="soul-tutorial"
    :class="{ 'is-collapsed': collapsed }"
    aria-labelledby="soul-tutorial-title"
  >
    <header class="tutorial-head">
      <span class="tutorial-badge" aria-hidden="true">&#10022;</span>
      <div class="tutorial-head-text">
        <p class="tutorial-kicker">Guide · 1995</p>
        <h2 id="soul-tutorial-title" class="tutorial-title">
          {{ collapsed ? "操作备忘" : "倾诉小课堂" }}
        </h2>
      </div>
      <button
        v-if="collapsed"
        type="button"
        class="btn-expand"
        aria-label="展开教学"
        @click="expanded = true"
      >
        展开
      </button>
    </header>

    <template v-if="!collapsed">
      <ol class="tutorial-steps">
        <li class="tutorial-step">
          <span class="step-index" aria-hidden="true">01</span>
          <div class="step-body">
            <h3>滚轮切换人物</h3>
            <p>
              在左上角<strong>四分之一滚轮</strong>上，滚动鼠标滚轮，或点击头像、使用
              <span class="inline-ctl">‹ ›</span> 按钮，在四位伙伴间切换倾诉对象。
            </p>
            <p class="step-note">切换后会自动播放该角色的登场动画。</p>
          </div>
        </li>

        <li class="tutorial-step">
          <span class="step-index" aria-hidden="true">02</span>
          <div class="step-body">
            <h3>点击人物看互动</h3>
            <p>
              在<strong>倾诉舞台</strong>中央，<strong>单击</strong>人物立绘，即可播放 TA
              的专属交互视频（复古画框放映效果）。
            </p>
            <p class="step-note">
              也可在下方输入框倾诉；对话会出现在头顶气泡与右侧心事记录中。
            </p>
          </div>
        </li>
      </ol>

      <footer class="tutorial-foot">
        <button type="button" class="btn-primary" @click="collapse">
          知道了，开始倾诉
        </button>
        <button type="button" class="btn-ghost" @click="dismissForever">
          不再提示
        </button>
      </footer>
    </template>

    <ul v-else class="tutorial-mini">
      <li><span class="mini-tag">滚轮</span>切换四位倾诉对象</li>
      <li><span class="mini-tag">单击</span>舞台人物播放互动视频</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  dismissSoulTalkTutorial,
  isSoulTalkTutorialDismissed,
} from "@/utils/soulTalkTutorial";

const expanded = ref(true);
const hiddenForever = ref(false);

const collapsed = computed(() => !expanded.value);
const showPanel = computed(() => !hiddenForever.value);

function collapse() {
  expanded.value = false;
}

function dismissForever() {
  dismissSoulTalkTutorial();
  hiddenForever.value = true;
}

onMounted(() => {
  if (isSoulTalkTutorialDismissed()) {
    hiddenForever.value = true;
    return;
  }
  expanded.value = true;
});
</script>

<style scoped>
.soul-tutorial {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  max-width: var(--wheel-size, 26rem);
  margin: 0 auto;
  padding: 1rem 1.05rem 1.1rem;
  color: #3d2914;
  background: linear-gradient(
    165deg,
    #faf6ee 0%,
    #f5ebe0 48%,
    #f3e8d8 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.52);
  border-radius: 16px;
  box-shadow:
    0 12px 36px rgba(61, 41, 20, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 0 24px rgba(201, 169, 110, 0.08);
  box-sizing: border-box;
}

.soul-tutorial.is-collapsed {
  flex: 1;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
}

.soul-tutorial::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px dashed rgba(201, 169, 110, 0.28);
  border-radius: 12px;
  pointer-events: none;
}

.tutorial-head {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.tutorial-head-text {
  flex: 1;
  min-width: 0;
}

.tutorial-badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  color: #1a1408;
  font-size: 0.7rem;
  background: linear-gradient(180deg, #e8d5a3, #c9a96e);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.45);
}

.tutorial-kicker {
  margin: 0;
  color: #8b7355;
  font-size: 0.58rem;
  letter-spacing: 0.26em;
}

.tutorial-title {
  margin: 0.12rem 0 0;
  font-family: var(--font-display, "LXGW WenKai", "KaiTi", serif);
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  color: #2a1f12;
}

.is-collapsed .tutorial-title {
  font-size: 0.92rem;
}

.btn-expand {
  flex-shrink: 0;
  padding: 0.25rem 0.55rem;
  color: #5c4033;
  font: inherit;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  background: rgba(201, 169, 110, 0.14);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 6px;
  cursor: pointer;
}

.btn-expand:hover {
  background: rgba(201, 169, 110, 0.26);
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tutorial-step {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding: 0.65rem 0.7rem;
  background: rgba(255, 252, 247, 0.85);
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 12px;
}

.step-index {
  flex-shrink: 0;
  color: rgba(201, 169, 110, 0.9);
  font-family: monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  line-height: 1.4;
}

.step-body h3 {
  margin: 0 0 0.35rem;
  font-family: var(--font-display, "LXGW WenKai", "KaiTi", serif);
  font-size: 0.88rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  color: #2a1f12;
}

.step-body p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.65;
  color: #4a3828;
}

.step-body strong {
  color: #5c4033;
  font-weight: 600;
}

.step-note {
  margin-top: 0.35rem !important;
  padding-top: 0.35rem;
  color: #8b7355 !important;
  font-size: 0.72rem !important;
  border-top: 1px dashed rgba(201, 169, 110, 0.28);
}

.inline-ctl {
  display: inline-block;
  padding: 0 0.25rem;
  color: #5c4033;
  font-family: monospace;
  background: rgba(201, 169, 110, 0.15);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 4px;
}

.tutorial-foot {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.15rem;
}

.btn-primary,
.btn-ghost {
  width: 100%;
  padding: 0.55rem 0.75rem;
  font: inherit;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-primary {
  color: #fffef9;
  background: linear-gradient(165deg, #c9a96e 0%, #8b6914 100%);
  border: 1px solid rgba(92, 64, 51, 0.35);
  box-shadow: 0 6px 16px rgba(61, 41, 20, 0.15);
}

.btn-primary:hover {
  filter: brightness(1.05);
  box-shadow: 0 8px 20px rgba(61, 41, 20, 0.2);
}

.btn-ghost {
  color: #8b7355;
  background: transparent;
  border: 1px solid rgba(201, 169, 110, 0.35);
}

.btn-ghost:hover {
  color: #5c4033;
  background: rgba(201, 169, 110, 0.1);
}

.tutorial-mini {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0.35rem 0.15rem 0.15rem;
  list-style: none;
}

.tutorial-mini li {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  line-height: 1.5;
  color: #4a3828;
}

.mini-tag {
  flex-shrink: 0;
  padding: 0.12rem 0.4rem;
  color: #5c4033;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  background: rgba(201, 169, 110, 0.2);
  border: 1px solid rgba(201, 169, 110, 0.38);
  border-radius: 4px;
}

@media (max-width: 900px) {
  .soul-tutorial {
    max-width: min(100%, 22rem);
  }
}
</style>
