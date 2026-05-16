<template>
  <div
    class="portrait-shell"
    :class="[`variant-${variant}`, { 'has-image': showImage }]"
    :style="shellStyle"
  >
    <div class="portrait-backdrop" />

    <img
      v-if="showImage"
      :key="currentSrc"
      :src="currentSrc"
      :alt="`${name}全身立绘`"
      class="portrait-image"
      @error="onImageError"
    />

    <div v-else class="portrait-fallback">
      <span class="fallback-symbol">{{ symbol }}</span>
      <p class="fallback-title">全身立绘位</p>
      <p class="fallback-hint">
        请将图片放入 <code>frontend/public/characters/</code><br />
        文件名：<code>{{ fileHint }}</code>
      </p>
    </div>

    <div class="portrait-floor" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getPortraitCandidates } from "@/utils/portrait";

const props = withDefaults(
  defineProps<{
    name: string;
    symbol: string;
    portrait: string;
    accent?: string;
    accentSoft?: string;
    variant?: "full" | "thumb" | "stage";
  }>(),
  {
    variant: "full",
    accent: "#c9a96e",
    accentSoft: "rgba(201, 169, 110, 0.14)",
  },
);

const candidateIndex = ref(0);
const loadExhausted = ref(false);

const candidates = computed(() => getPortraitCandidates(props.portrait));

const currentSrc = computed(() => candidates.value[candidateIndex.value] ?? "");

const showImage = computed(() => !loadExhausted.value && Boolean(currentSrc.value));

const fileHint = computed(() => {
  const base = props.portrait.split("/").pop()?.replace(/\.(png|jpe?g|webp)$/i, "") ?? "角色名";
  return `${base}.png`;
});

const shellStyle = computed(() => ({
  "--accent": props.accent,
  "--accent-soft": props.accentSoft,
}));

function resetLoadState() {
  candidateIndex.value = 0;
  loadExhausted.value = false;
}

function onImageError() {
  if (candidateIndex.value < candidates.value.length - 1) {
    candidateIndex.value += 1;
    return;
  }
  loadExhausted.value = true;
}

watch(
  () => props.portrait,
  () => {
    resetLoadState();
  },
);
</script>

<style scoped>
.portrait-shell {
  --accent: #c9a96e;
  --accent-soft: rgba(201, 169, 110, 0.14);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(201, 169, 110, 0.35);
  background: linear-gradient(180deg, var(--accent-soft) 0%, rgba(255, 255, 255, 0.92) 42%);
}

.variant-full {
  width: 100%;
  min-height: 360px;
  aspect-ratio: 3 / 4;
  max-height: min(56vh, 540px);
  border-radius: 12px;
}

.variant-stage {
  width: 100%;
  height: min(52vh, 480px);
  min-height: 280px;
  border: none;
  background: transparent;
  border-radius: 0;
}

.variant-thumb {
  width: 44px;
  height: 58px;
  min-height: 0;
  aspect-ratio: auto;
  border-radius: 8px;
}

.variant-stage .portrait-backdrop {
  background:
    radial-gradient(ellipse at 50% 100%, rgba(61, 41, 20, 0.12), transparent 55%),
    radial-gradient(ellipse at 50% 0%, var(--accent-soft), transparent 45%);
}

.variant-stage .portrait-image {
  padding: 0 0 0.25rem;
  filter: drop-shadow(0 12px 28px rgba(61, 41, 20, 0.15));
}

.variant-stage .portrait-floor {
  right: 15%;
  left: 15%;
  height: 18px;
}

.variant-stage .portrait-fallback {
  min-height: 280px;
}

.portrait-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 92%, rgba(61, 41, 20, 0.1), transparent 58%),
    radial-gradient(ellipse at 50% 12%, rgba(255, 255, 255, 0.7), transparent 48%);
  pointer-events: none;
}

.portrait-image {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  padding: 0.35rem 0.5rem 1rem;
  filter: drop-shadow(0 8px 18px rgba(61, 41, 20, 0.12));
}

.variant-thumb .portrait-image {
  padding: 0.12rem;
  object-position: center top;
  filter: none;
}

.portrait-fallback {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 100%;
  min-height: inherit;
  padding: 1rem;
  text-align: center;
}

.variant-thumb .portrait-fallback {
  padding: 0.2rem;
  gap: 0;
}

.fallback-symbol {
  color: var(--accent);
  font-size: clamp(2.8rem, 9vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.12em;
  opacity: 0.88;
}

.variant-thumb .fallback-symbol {
  font-size: 1rem;
}

.fallback-title {
  margin: 0;
  color: #8b7355;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
}

.variant-thumb .fallback-title,
.variant-thumb .fallback-hint {
  display: none;
}

.fallback-hint {
  margin: 0;
  color: #a08060;
  font-size: 0.68rem;
  line-height: 1.55;
}

.fallback-hint code {
  color: #8b4513;
  font-size: 0.64rem;
  word-break: break-all;
}

.portrait-floor {
  position: absolute;
  right: 10%;
  bottom: 0;
  left: 10%;
  z-index: 2;
  height: 14px;
  background: radial-gradient(ellipse at center, rgba(61, 41, 20, 0.2), transparent 72%);
  pointer-events: none;
}

.variant-thumb .portrait-floor {
  display: none;
}

.variant-stage .portrait-floor {
  display: block;
}
</style>
