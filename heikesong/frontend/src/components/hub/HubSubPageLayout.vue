<template>
  <div
    class="hub-sub-page"
    :class="{ 'has-particles': showParticles, 'hub-sub-page--wide': wideContent }"
  >
    <div class="paper-bg" />
    <div class="grain-overlay" />
    <div v-if="showParticles" class="particle-layer" aria-hidden="true">
      <div v-for="n in 10" :key="n" class="particle" :class="`p-${n}`" />
    </div>

    <div class="frame-corner tl" />
    <div class="frame-corner tr" />
    <div class="frame-corner bl" />
    <div class="frame-corner br" />

    <header class="hub-sub-header">
      <RouterLink class="back-link" to="/">
        <span class="back-icon" aria-hidden="true">&#10022;</span>
        <span>返回重生大厅</span>
      </RouterLink>
      <div class="header-title">
        <p v-if="kicker" class="header-kicker">{{ kicker }}</p>
        <h1>{{ title }}</h1>
      </div>
      <div v-if="$slots['header-extra']" class="header-extra">
        <slot name="header-extra" />
      </div>
    </header>

    <main class="hub-sub-main" :class="{ 'hub-sub-main--wide': wideContent }">
      <div class="scroll-plate" :class="{ 'scroll-plate--wide': wideContent }">
        <div class="scroll-inner" :class="{ 'scroll-inner--wide': wideContent }">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  kicker?: string;
  showParticles?: boolean;
  /** 允许横向溢出（如 3D 相册），避免两侧照片被裁切 */
  wideContent?: boolean;
}>();
</script>

<style scoped>
.hub-sub-page {
  --frame-inset: 12px;
  --hub-pad-x: clamp(1.15rem, 3.5vw, 2.75rem);
  --neon-gold: #c9a96e;
  --neon-bright: #e8d5a3;
  --neon-glow: rgba(201, 169, 110, 0.45);
  --neon-glow-soft: rgba(201, 169, 110, 0.2);
  --font-display: "LXGW WenKai", "STKaiti", "KaiTi", "楷体", serif;
  --font-serif: "Noto Serif SC", "Songti SC", "SimSun", serif;
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  color: #3d2914;
  font-family: var(--font-serif);
  background: linear-gradient(
    180deg,
    rgba(18, 14, 8, 0.88) 0%,
    rgba(28, 22, 14, 0.35) 5%,
    rgba(252, 246, 234, 0.9) 14%,
    rgba(248, 240, 225, 0.86) 40%,
    rgba(255, 252, 247, 0.82) 60%,
    rgba(250, 244, 232, 0.88) 85%,
    rgba(18, 14, 8, 0.75) 100%
  );
  overflow: hidden;
}

.hub-sub-page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.02) 2px,
    rgba(0, 0, 0, 0.02) 4px
  );
  opacity: 0.28;
}

:global(html.settings-no-scanlines) .hub-sub-page::before {
  display: none;
}

.hub-sub-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 95% 75% at 50% 42%,
      transparent 35%,
      rgba(139, 90, 43, 0.07) 100%
    ),
    url("/images/bg-vintage.jpg") center / cover no-repeat;
  background-blend-mode: overlay, soft-light;
  opacity: var(--hub-vintage-overlay, 0.38);
}

.paper-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 90% 55% at 50% 28%,
      rgba(255, 248, 235, 0.5) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse at 10% 50%,
      rgba(201, 169, 110, 0.14) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 90% 75%,
      rgba(160, 100, 60, 0.1) 0%,
      transparent 48%
    );
}

.grain-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.08;
  mix-blend-mode: multiply;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.frame-corner {
  position: absolute;
  z-index: 3;
  width: 48px;
  height: 48px;
  border: 2px solid var(--neon-gold);
  pointer-events: none;
}

.frame-corner.tl {
  top: var(--frame-inset);
  left: var(--frame-inset);
  border-right: none;
  border-bottom: none;
}

.frame-corner.tr {
  top: var(--frame-inset);
  right: var(--frame-inset);
  border-left: none;
  border-bottom: none;
}

.frame-corner.bl {
  bottom: var(--frame-inset);
  left: var(--frame-inset);
  border-right: none;
  border-top: none;
}

.frame-corner.br {
  bottom: var(--frame-inset);
  right: var(--frame-inset);
  border-left: none;
  border-top: none;
}

.particle-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.55) 0%, transparent 70%);
  border-radius: 50%;
  animation: hub-particle-float linear infinite;
}

.p-1 { left: 12%; top: 88%; animation-duration: 14s; }
.p-2 { left: 28%; top: 92%; animation-duration: 17s; width: 4px; height: 4px; }
.p-3 { left: 45%; top: 86%; animation-duration: 12s; }
.p-4 { left: 62%; top: 90%; animation-duration: 16s; width: 5px; height: 5px; }
.p-5 { left: 78%; top: 88%; animation-duration: 13s; }
.p-6 { left: 88%; top: 91%; animation-duration: 18s; }
.p-7 { left: 20%; top: 78%; animation-duration: 15s; width: 4px; height: 4px; }
.p-8 { left: 55%; top: 80%; animation-duration: 11s; }
.p-9 { left: 70%; top: 76%; animation-duration: 19s; width: 4px; height: 4px; }
.p-10 { left: 38%; top: 74%; animation-duration: 14s; }

@keyframes hub-particle-float {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  12% {
    opacity: 0.9;
  }
  88% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-110vh);
    opacity: 0;
  }
}

:global(html.settings-no-ambience) .particle-layer {
  display: none;
}

.hub-sub-header {
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem var(--hub-pad-x);
  border-bottom: 1px solid rgba(201, 169, 110, 0.35);
  background: linear-gradient(
    180deg,
    rgba(22, 16, 10, 0.92) 0%,
    rgba(32, 24, 14, 0.88) 100%
  );
  box-shadow: 0 4px 24px rgba(10, 8, 4, 0.25);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  color: var(--neon-bright);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-decoration: none;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.back-icon {
  color: var(--neon-gold);
  font-size: 0.75rem;
}

.back-link:hover {
  color: #fff8e7;
  background: rgba(201, 169, 110, 0.16);
  border-color: rgba(201, 169, 110, 0.55);
  box-shadow: 0 0 14px var(--neon-glow-soft);
}

.header-title {
  text-align: center;
}

.header-kicker {
  margin: 0 0 0.2rem;
  color: rgba(201, 169, 110, 0.75);
  font-size: 0.62rem;
  letter-spacing: 0.28em;
}

.header-title h1 {
  margin: 0;
  color: var(--neon-bright);
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2.5vw, 1.35rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  text-shadow:
    0 0 8px var(--neon-glow),
    0 0 16px var(--neon-glow-soft);
}

.header-extra {
  justify-self: end;
}

.hub-sub-main {
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  padding: 1rem var(--hub-pad-x) max(1.25rem, var(--frame-inset));
  overflow: hidden;
}

.scroll-plate {
  position: relative;
  height: 100%;
  max-width: min(96vw, 820px);
  margin: 0 auto;
  padding: 0.35rem;
}

.scroll-plate::before {
  content: "";
  position: absolute;
  inset: -4px -6px -8px -6px;
  z-index: 0;
  background: url(/images/border-frame.png) center / 100% 100% no-repeat;
  opacity: 0.9;
  filter: sepia(0.1) saturate(0.95);
  pointer-events: none;
}

.scroll-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  max-height: calc(100vh - 7.5rem);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 2.4rem 0.65rem 2rem;
  padding: 1.15rem 1.1rem 1.35rem;
  background: linear-gradient(
    180deg,
    rgba(255, 252, 247, 0.96) 0%,
    rgba(248, 240, 228, 0.94) 100%
  );
  border: 1px solid rgba(201, 169, 110, 0.32);
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 8px 32px rgba(61, 41, 20, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(201, 169, 110, 0.45) transparent;
}

.scroll-inner::-webkit-scrollbar {
  width: 6px;
}

.scroll-inner::-webkit-scrollbar-thumb {
  background: rgba(201, 169, 110, 0.45);
  border-radius: 999px;
}

.scroll-inner--wide {
  overflow-x: visible;
  overflow-y: auto;
}

.hub-sub-page--wide {
  overflow-x: visible;
  overflow-y: hidden;
}

.hub-sub-main--wide,
.scroll-plate--wide {
  overflow: visible;
}

@media (max-width: 640px) {
  .hub-sub-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .back-link {
    justify-self: start;
  }

  .header-extra {
    justify-self: center;
  }

  .scroll-inner {
    margin: 2rem 0.5rem 1.65rem;
    padding: 0.9rem 0.75rem 1.1rem;
  }
}
</style>
