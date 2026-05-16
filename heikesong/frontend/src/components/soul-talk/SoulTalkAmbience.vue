<template>
  <div class="soul-ambience" aria-hidden="true">
    <div class="mote mote-a" />
    <div class="mote mote-b" />
    <div class="mote mote-c" />
    <p class="side-quote side-quote-left">「说说心里话吧」</p>
    <p class="side-quote side-quote-right">1995 · 县城夜晚</p>
    <div class="floor-glow" />
  </div>
</template>

<style scoped>
.soul-ambience {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.mote {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.35), transparent 70%);
  filter: blur(1px);
  animation: float-mote 14s ease-in-out infinite;
}

.mote-a {
  top: 18%;
  left: 8%;
  width: 120px;
  height: 120px;
  opacity: 0.35;
}

.mote-b {
  top: 62%;
  right: 10%;
  width: 160px;
  height: 160px;
  opacity: 0.28;
  animation-delay: -4s;
}

.mote-c {
  bottom: 8%;
  left: 42%;
  width: 90px;
  height: 90px;
  opacity: 0.22;
  animation-delay: -8s;
}

.side-quote {
  position: absolute;
  top: 42%;
  margin: 0;
  color: rgba(139, 115, 85, 0.22);
  font-size: clamp(0.75rem, 1.2vw, 0.95rem);
  letter-spacing: 0.35em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.side-quote-left {
  left: clamp(0.5rem, 2vw, 2rem);
}

.side-quote-right {
  right: clamp(0.5rem, 2vw, 2rem);
}

.floor-glow {
  position: absolute;
  right: 10%;
  bottom: 0;
  left: 10%;
  height: 45%;
  background: radial-gradient(
    ellipse 55% 40% at 50% 100%,
    rgba(201, 169, 110, 0.14),
    transparent 70%
  );
}

@keyframes float-mote {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(12px, -18px) scale(1.08);
  }
}

@media (max-width: 1099px) {
  .side-quote {
    display: none;
  }
}
</style>
