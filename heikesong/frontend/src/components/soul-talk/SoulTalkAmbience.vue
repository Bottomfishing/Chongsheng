<template>
  <div class="soul-ambience" aria-hidden="true">
    <div class="fiber-texture" />
    <div class="paper-wash paper-wash-a" />
    <div class="paper-wash paper-wash-b" />
    <div class="sunbeams" />
    <div class="mote mote-a" />
    <div class="mote mote-b" />
    <div class="mote mote-c" />
    <p class="watermark watermark-1">倾诉</p>
    <p class="watermark watermark-2">1995</p>
    <p class="side-quote side-quote-left">「说说心里话吧」</p>
    <p class="side-quote side-quote-right">县城夜晚 · 蝉鸣</p>
    <div class="floor-glow" />
    <div class="dust-track">
      <span v-for="n in 8" :key="n" class="dust" :class="`dust-${n}`" />
    </div>
  </div>
</template>

<style scoped>
.soul-ambience {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.fiber-texture {
  position: absolute;
  inset: 0;
  opacity: 0.45;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(139, 105, 70, 0.022) 3px,
      rgba(139, 105, 70, 0.022) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 4px,
      rgba(120, 90, 55, 0.018) 4px,
      rgba(120, 90, 55, 0.018) 5px
    );
  mix-blend-mode: multiply;
}

.paper-wash {
  position: absolute;
  border-radius: 50%;
  filter: blur(52px);
  animation: wash-drift 24s ease-in-out infinite;
}

.paper-wash-a {
  top: 12%;
  left: -6%;
  width: min(50vw, 380px);
  height: min(50vw, 380px);
  background: radial-gradient(
    circle,
    rgba(201, 169, 110, 0.18),
    transparent 68%
  );
}

.paper-wash-b {
  bottom: 10%;
  right: -8%;
  width: min(45vw, 340px);
  height: min(45vw, 340px);
  background: radial-gradient(
    circle,
    rgba(180, 120, 80, 0.12),
    transparent 70%
  );
  animation-delay: -10s;
}

@keyframes wash-drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(14px, -10px);
  }
}

.sunbeams {
  position: absolute;
  inset: -15% -8%;
  background: repeating-linear-gradient(
    108deg,
    transparent,
    transparent 72px,
    rgba(255, 236, 200, 0.035) 72px,
    rgba(255, 236, 200, 0.08) 76px,
    transparent 80px
  );
  mask-image: radial-gradient(
    ellipse 85% 65% at 40% 25%,
    #000 0%,
    transparent 72%
  );
  animation: beams-shift 30s linear infinite;
}

@keyframes beams-shift {
  from {
    transform: translateX(-3%);
  }
  to {
    transform: translateX(3%);
  }
}

.mote {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.32), transparent 72%);
  filter: blur(2px);
  animation: float-mote 14s ease-in-out infinite;
}

.mote-a {
  top: 18%;
  left: 8%;
  width: 120px;
  height: 120px;
  opacity: 0.38;
}

.mote-b {
  top: 62%;
  right: 10%;
  width: 160px;
  height: 160px;
  opacity: 0.3;
  animation-delay: -4s;
}

.mote-c {
  bottom: 12%;
  left: 42%;
  width: 90px;
  height: 90px;
  opacity: 0.24;
  animation-delay: -8s;
}

@keyframes float-mote {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(12px, -18px) scale(1.06);
  }
}

.watermark {
  position: absolute;
  font-family: "LXGW WenKai", "KaiTi", "楷体", serif;
  font-size: clamp(3rem, 10vw, 5.5rem);
  letter-spacing: 0.2em;
  color: rgba(201, 169, 110, 0.06);
  user-select: none;
  transform: rotate(-10deg);
}

.watermark-1 {
  top: 32%;
  right: 8%;
}

.watermark-2 {
  bottom: 28%;
  left: 6%;
  transform: rotate(6deg);
}

.side-quote {
  position: absolute;
  top: 42%;
  margin: 0;
  color: rgba(201, 169, 110, 0.2);
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
  right: 8%;
  bottom: 0;
  left: 8%;
  height: 42%;
  background: radial-gradient(
    ellipse 55% 40% at 50% 100%,
    rgba(201, 169, 110, 0.16),
    transparent 70%
  );
}

.dust-track {
  position: absolute;
  inset: 0;
}

.dust {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(201, 169, 110, 0.45);
  animation: dust-rise linear infinite;
}

.dust-1 {
  left: 15%;
  animation-duration: 16s;
}
.dust-2 {
  left: 35%;
  animation-duration: 20s;
  animation-delay: -4s;
}
.dust-3 {
  left: 55%;
  animation-duration: 14s;
  animation-delay: -7s;
}
.dust-4 {
  left: 75%;
  animation-duration: 18s;
  animation-delay: -2s;
}
.dust-5 {
  left: 88%;
  animation-duration: 22s;
  animation-delay: -9s;
}
.dust-6 {
  left: 42%;
  animation-duration: 15s;
  animation-delay: -11s;
}
.dust-7 {
  left: 62%;
  animation-duration: 17s;
  animation-delay: -5s;
}
.dust-8 {
  left: 25%;
  animation-duration: 19s;
  animation-delay: -13s;
}

@keyframes dust-rise {
  0% {
    bottom: -5%;
    opacity: 0;
  }
  15% {
    opacity: 0.55;
  }
  100% {
    bottom: 105%;
    opacity: 0;
    transform: translateX(16px);
  }
}

@media (max-width: 1099px) {
  .side-quote,
  .watermark {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .paper-wash,
  .sunbeams,
  .mote,
  .dust {
    animation: none !important;
  }
}
</style>
