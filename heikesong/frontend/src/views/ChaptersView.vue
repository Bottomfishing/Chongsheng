<template>
  <main class="chapters-page">
    <RouterLink class="back-link" to="/">← 返回首页</RouterLink>
    <div class="panels">
      <div
        v-for="(act, i) in acts"
        :key="i"
        class="panel"
        @click="enterScene(act.startNode)"
      >
        <img :src="act.img" :alt="act.label" class="panel-img" />
        <div class="panel-overlay">
          <span class="act-label">{{ act.label }}</span>
          <span class="act-title">{{ act.title }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const acts = [
  {
    label: "第一幕",
    title: "穿越入局·命运初遇",
    img: "/images/录像厅.jpg",
    startNode: "video_caochang1",
  },
  {
    label: "第二幕",
    title: "创业之路·暗流涌动",
    img: "/images/网吧.jpg",
    startNode: "video_xiyang1",
  },
  {
    label: "第三幕",
    title: "巅峰对决·直播PK定胜负",
    img: "/images/舞厅.jpg",
    startNode: "video_shoushiwu1",
  },
];

function enterScene(nodeId: string) {
  router.push({ path: "/play", query: { start: nodeId } });
}
</script>

<style scoped>
.chapters-page {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
}

.back-link {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  color: #fff;
  font-size: 0.9rem;
  text-decoration: none;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  transition: background 0.2s;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.panels {
  display: flex;
  width: 100%;
  height: 100%;
}

.panel {
  flex: 1;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.panel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease, filter 0.4s ease;
}

.panel:hover .panel-img {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.panel-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;
}

.panel:hover .panel-overlay {
  background: rgba(0, 0, 0, 0.15);
}

.act-label {
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  text-shadow:
    0 0 12px rgba(255, 107, 157, 0.8),
    0 0 24px rgba(255, 107, 157, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.1em;
}

.act-title {
  margin-top: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.05em;
}
</style>
