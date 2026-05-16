<template>
  <div class="home-ambience" aria-hidden="true">
    <div class="fiber-texture" />
    <div class="paper-wash paper-wash-a" />
    <div class="paper-wash paper-wash-b" />
    <div class="paper-wash paper-wash-c" />
    <div class="sunbeams" />
    <div class="light-leak light-leak-tr" />
    <div class="light-leak light-leak-bl" />
    <div class="ambience-glow ambience-glow-top" />
    <div class="ambience-glow ambience-glow-bottom" />
    <div class="ambience-glow ambience-glow-mid" />

    <div class="watermark watermark-1">1995</div>
    <div class="watermark watermark-2">重生</div>
    <div class="watermark watermark-3">档案</div>

    <div class="mote mote-a" />
    <div class="mote mote-b" />
    <div class="mote mote-c" />
    <div class="mote mote-d" />

    <div class="float-ornaments">
      <span v-for="n in 6" :key="n" class="ornament" :class="`orn-${n}`"
        >&#10022;</span
      >
    </div>

    <div class="dust-track">
      <span v-for="n in 14" :key="n" class="dust" :class="`dust-${n}`" />
    </div>

    <div class="vhs-band" />

    <div class="era-ticker">
      <div class="era-ticker-track">
        <span v-for="(item, i) in tickerItems" :key="`a-${i}`" class="era-item">
          {{ item }}
        </span>
        <span v-for="(item, i) in tickerItems" :key="`b-${i}`" class="era-item">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tickerItems = [
  "1995 · 录像厅",
  "村口小卖部",
  "抖音信号满格",
  "自行车铃声",
  "重生档案",
  "九十年代实验",
  "BB 机嘀嘀",
  "蝉鸣午后",
];
</script>

<style scoped>
.home-ambience {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

/* 纸张纤维纹理 */
.fiber-texture {
  position: absolute;
  inset: 0;
  opacity: 0.55;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(139, 105, 70, 0.025) 3px,
      rgba(139, 105, 70, 0.025) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 4px,
      rgba(120, 90, 55, 0.02) 4px,
      rgba(120, 90, 55, 0.02) 5px
    );
  mix-blend-mode: multiply;
}

/* 茶渍 / 水墨晕染 */
.paper-wash {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  animation: wash-drift 22s ease-in-out infinite;
}

.paper-wash-a {
  top: 18%;
  left: -8%;
  width: min(55vw, 420px);
  height: min(55vw, 420px);
  background: radial-gradient(
    circle,
    rgba(201, 169, 110, 0.22) 0%,
    rgba(232, 213, 163, 0.08) 45%,
    transparent 70%
  );
}

.paper-wash-b {
  top: 42%;
  right: -12%;
  width: min(50vw, 380px);
  height: min(50vw, 380px);
  background: radial-gradient(
    circle,
    rgba(180, 120, 80, 0.14) 0%,
    rgba(210, 160, 120, 0.06) 50%,
    transparent 72%
  );
  animation-delay: -7s;
}

.paper-wash-c {
  bottom: 8%;
  left: 28%;
  width: min(45vw, 340px);
  height: min(40vw, 300px);
  background: radial-gradient(
    ellipse,
    rgba(220, 180, 140, 0.12) 0%,
    transparent 68%
  );
  animation-delay: -14s;
}

@keyframes wash-drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(18px, -12px) scale(1.06);
  }
}

/* 午后阳光斜射 */
.sunbeams {
  position: absolute;
  inset: -20% -10%;
  background: repeating-linear-gradient(
    108deg,
    transparent,
    transparent 72px,
    rgba(255, 236, 200, 0.04) 72px,
    rgba(255, 236, 200, 0.1) 76px,
    transparent 80px
  );
  opacity: 0.85;
  animation: beams-shift 28s linear infinite;
  mask-image: radial-gradient(
    ellipse 90% 70% at 30% 20%,
    #000 0%,
    transparent 72%
  );
}

@keyframes beams-shift {
  from {
    transform: translateX(-4%) skewX(-2deg);
  }
  to {
    transform: translateX(4%) skewX(-2deg);
  }
}

/* 胶片漏光 */
.light-leak {
  position: absolute;
  width: min(42vw, 320px);
  height: min(42vw, 320px);
  border-radius: 50%;
  filter: blur(40px);
  animation: leak-pulse 10s ease-in-out infinite;
}

.light-leak-tr {
  top: -6%;
  right: -4%;
  background: radial-gradient(
    circle,
    rgba(255, 190, 120, 0.2),
    rgba(255, 220, 180, 0.06) 50%,
    transparent 70%
  );
}

.light-leak-bl {
  bottom: 12%;
  left: -6%;
  background: radial-gradient(
    circle,
    rgba(201, 140, 90, 0.16),
    transparent 65%
  );
  animation-delay: -5s;
}

@keyframes leak-pulse {
  0%,
  100% {
    opacity: 0.65;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

.ambience-glow {
  position: absolute;
  left: 50%;
  width: min(92vw, 900px);
  height: 280px;
  transform: translateX(-50%);
  pointer-events: none;
}

.ambience-glow-top {
  top: 0;
  background: radial-gradient(
    ellipse 80% 100% at 50% 0%,
    rgba(201, 169, 110, 0.16),
    transparent 70%
  );
}

.ambience-glow-mid {
  top: 38%;
  height: 360px;
  background: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    rgba(255, 248, 235, 0.35),
    transparent 68%
  );
  animation: mid-glow-breathe 8s ease-in-out infinite;
}

@keyframes mid-glow-breathe {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.ambience-glow-bottom {
  bottom: 0;
  background: radial-gradient(
    ellipse 70% 90% at 50% 100%,
    rgba(139, 69, 19, 0.1),
    transparent 65%
  );
}

/* 水印字 */
.watermark {
  position: absolute;
  font-family: "LXGW WenKai", "KaiTi", "楷体", serif;
  font-size: clamp(3.5rem, 12vw, 7rem);
  font-weight: 400;
  letter-spacing: 0.2em;
  color: rgba(201, 169, 110, 0.07);
  white-space: nowrap;
  user-select: none;
  transform: rotate(-12deg);
}

.watermark-1 {
  top: 28%;
  right: 6%;
}

.watermark-2 {
  top: 52%;
  left: 4%;
  transform: rotate(8deg);
  font-size: clamp(2.8rem, 10vw, 5.5rem);
}

.watermark-3 {
  bottom: 22%;
  right: 18%;
  transform: rotate(-6deg);
  font-size: clamp(2.2rem, 8vw, 4.5rem);
  opacity: 0.85;
}

.mote {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.32), transparent 72%);
  filter: blur(2px);
  animation: float-mote 16s ease-in-out infinite;
}

.mote-a {
  top: 22%;
  left: 6%;
  width: 140px;
  height: 140px;
  opacity: 0.45;
}

.mote-b {
  top: 55%;
  right: 8%;
  width: 100px;
  height: 100px;
  opacity: 0.35;
  animation-delay: -5s;
}

.mote-c {
  bottom: 18%;
  left: 38%;
  width: 80px;
  height: 80px;
  opacity: 0.3;
  animation-delay: -9s;
}

.mote-d {
  top: 12%;
  right: 22%;
  width: 60px;
  height: 60px;
  opacity: 0.28;
  animation-delay: -12s;
}

@keyframes float-mote {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(12px, -18px) scale(1.05);
  }
  66% {
    transform: translate(-8px, 10px) scale(0.95);
  }
}

/* 漂浮装饰 */
.float-ornaments {
  position: absolute;
  inset: 0;
}

.ornament {
  position: absolute;
  color: rgba(201, 169, 110, 0.35);
  font-size: 0.65rem;
  text-shadow: 0 0 8px rgba(201, 169, 110, 0.25);
  animation: orn-float 18s ease-in-out infinite;
}

.orn-1 {
  top: 24%;
  left: 18%;
  animation-duration: 20s;
}
.orn-2 {
  top: 38%;
  right: 14%;
  animation-delay: -4s;
}
.orn-3 {
  top: 62%;
  left: 8%;
  font-size: 0.5rem;
  animation-delay: -9s;
}
.orn-4 {
  bottom: 32%;
  right: 22%;
  animation-delay: -2s;
}
.orn-5 {
  top: 48%;
  left: 42%;
  opacity: 0.5;
  animation-delay: -14s;
}
.orn-6 {
  bottom: 18%;
  left: 62%;
  animation-delay: -7s;
}

@keyframes orn-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.25;
  }
  50% {
    transform: translateY(-14px) rotate(180deg);
    opacity: 0.55;
  }
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
  background: rgba(201, 169, 110, 0.5);
  animation: dust-rise linear infinite;
}

.dust-1 {
  left: 12%;
  animation-duration: 14s;
}
.dust-2 {
  left: 28%;
  animation-duration: 18s;
  animation-delay: -3s;
}
.dust-3 {
  left: 45%;
  animation-duration: 12s;
  animation-delay: -6s;
}
.dust-4 {
  left: 62%;
  animation-duration: 16s;
  animation-delay: -2s;
}
.dust-5 {
  left: 78%;
  animation-duration: 20s;
  animation-delay: -8s;
}
.dust-6 {
  left: 88%;
  animation-duration: 13s;
  animation-delay: -4s;
}
.dust-7 {
  left: 35%;
  animation-duration: 17s;
  animation-delay: -11s;
}
.dust-8 {
  left: 55%;
  animation-duration: 15s;
  animation-delay: -7s;
}
.dust-9 {
  left: 8%;
  animation-duration: 19s;
  animation-delay: -5s;
  width: 2px;
  height: 2px;
}
.dust-10 {
  left: 72%;
  animation-duration: 11s;
  animation-delay: -10s;
}
.dust-11 {
  left: 48%;
  animation-duration: 21s;
  animation-delay: -1s;
}
.dust-12 {
  left: 92%;
  animation-duration: 16s;
  animation-delay: -13s;
}
.dust-13 {
  left: 22%;
  animation-duration: 14s;
  animation-delay: -9s;
  width: 2px;
  height: 2px;
}
.dust-14 {
  left: 65%;
  animation-duration: 18s;
  animation-delay: -6s;
}

@keyframes dust-rise {
  0% {
    bottom: -5%;
    opacity: 0;
    transform: translateX(0);
  }
  10% {
    opacity: 0.65;
  }
  90% {
    opacity: 0.25;
  }
  100% {
    bottom: 105%;
    opacity: 0;
    transform: translateX(20px);
  }
}

/* VHS 扫描带 */
.vhs-band {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.15),
    rgba(255, 255, 255, 0.12),
    rgba(201, 169, 110, 0.15),
    transparent
  );
  opacity: 0.5;
  animation: vhs-scan 8s linear infinite;
}

@keyframes vhs-scan {
  0% {
    top: -2%;
  }
  100% {
    top: 102%;
  }
}

.era-ticker {
  position: absolute;
  bottom: 4.5rem;
  left: 0;
  right: 0;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 12%,
    #000 88%,
    transparent
  );
  opacity: 0.55;
}

.era-ticker-track {
  display: flex;
  width: max-content;
  gap: 2.5rem;
  padding: 0 1rem;
  animation: ticker-scroll 36s linear infinite;
}

.era-item {
  flex-shrink: 0;
  color: rgba(139, 115, 85, 0.85);
  font-size: 0.68rem;
  letter-spacing: 0.28em;
  white-space: nowrap;
}

.era-item::before {
  content: "✦ ";
  color: rgba(201, 169, 110, 0.7);
}

@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 720px) {
  .watermark {
    opacity: 0.6;
  }

  .sunbeams {
    opacity: 0.5;
  }

  .era-ticker {
    bottom: 3.5rem;
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .paper-wash,
  .sunbeams,
  .light-leak,
  .ambience-glow-mid,
  .mote,
  .ornament,
  .dust,
  .vhs-band,
  .era-ticker-track {
    animation: none !important;
  }
}
</style>
