<template>
  <HubSubPageLayout title="时光相册" kicker="1995 · Memory · Album">
    <template #header-extra>
      <div class="album-count">
        <span class="count-num">{{ totalPhotos }}</span>
        <span class="count-label">张照片</span>
      </div>
    </template>

    <nav class="category-tabs" role="tablist">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="tab-btn"
        :class="{ active: activeCategory === cat.id }"
        type="button"
        role="tab"
        :aria-selected="activeCategory === cat.id"
        @click="activeCategory = cat.id"
      >
        <span class="tab-icon" v-html="cat.icon" />
        <span class="tab-label">{{ cat.name }}</span>
        <span class="tab-badge">{{ cat.photos.length }}</span>
      </button>
    </nav>

    <div class="section-head">
      <span class="section-line" />
      <span class="section-label">{{ currentCategoryName }}</span>
      <span class="section-line" />
    </div>

    <div v-if="currentPhotos.length" class="photo-grid">
      <article
        v-for="(photo, idx) in currentPhotos"
        :key="`${activeCategory}-${idx}`"
        class="photo-item"
        :class="{ large: photo.size === 'large' }"
      >
        <div class="photo-frame">
          <div class="frame-corner-mark tl" />
          <div class="frame-corner-mark br" />
          <div class="photo-placeholder">
            <span class="photo-icon">&#127902;</span>
            <span class="photo-hint">{{ photo.title }}</span>
          </div>
          <div class="photo-overlay">
            <span class="photo-date">{{ photo.date }}</span>
            <span v-if="photo.tag" class="photo-tag">{{ photo.tag }}</span>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">&#128247;</span>
      <p class="empty-title">暂无照片</p>
      <p class="empty-desc">
        在剧情模式中做出选择，精彩瞬间将自动收录于此
      </p>
    </div>
  </HubSubPageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import HubSubPageLayout from "@/components/hub/HubSubPageLayout.vue";

interface PhotoItem {
  title: string;
  date: string;
  tag?: string;
  size?: "normal" | "large";
}

interface Category {
  id: string;
  name: string;
  icon: string;
  photos: PhotoItem[];
}

const categories = ref<Category[]>([
  {
    id: "story",
    name: "剧情瞬间",
    icon: "&#127916;",
    photos: [
      { title: "重生之始", date: "1995.03.15", tag: "主线" },
      { title: "录像厅之夜", date: "1995.04.02", tag: "主线" },
      { title: "街头直播", date: "1995.05.18", tag: "主线", size: "large" },
    ],
  },
  {
    id: "character",
    name: "人物写真",
    icon: "&#128100;",
    photos: [
      { title: "牛天真", date: "1995.03.20", tag: "角色" },
      { title: "李天佐", date: "1995.04.10", tag: "角色" },
      { title: "费启暗", date: "1995.05.05", tag: "角色" },
      { title: "阿宁", date: "1995.06.01", tag: "角色" },
    ],
  },
  {
    id: "scene",
    name: "场景掠影",
    icon: "&#127970;",
    photos: [
      { title: "小卖部", date: "1995.03.15", tag: "场景" },
      { title: "录像厅", date: "1995.04.02", tag: "场景" },
      { title: "县城广场", date: "1995.05.18", tag: "场景" },
    ],
  },
  {
    id: "collect",
    name: "我的收藏",
    icon: "&#11088;",
    photos: [],
  },
]);

const activeCategory = ref("story");

const currentCategory = computed(() =>
  categories.value.find((c) => c.id === activeCategory.value),
);

const currentCategoryName = computed(() => currentCategory.value?.name ?? "");

const currentPhotos = computed(() => currentCategory.value?.photos ?? []);

const totalPhotos = computed(() =>
  categories.value.reduce((sum, c) => sum + c.photos.length, 0),
);
</script>

<style scoped>
.album-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  color: #e8d5a3;
  font-size: 0.8rem;
  background: rgba(201, 169, 110, 0.12);
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 999px;
}

.count-num {
  color: #fff8e7;
  font-size: 1.05rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(201, 169, 110, 0.35);
}

.count-label {
  font-size: 0.72rem;
  opacity: 0.85;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1rem;
  padding: 0.35rem;
  background: rgba(255, 252, 247, 0.7);
  border: 1px solid rgba(201, 169, 110, 0.28);
  border-radius: 12px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  color: #6b4e2e;
  font-size: 0.82rem;
  font-family: inherit;
  letter-spacing: 0.08em;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.tab-btn:hover {
  color: #3d2914;
  background: rgba(201, 169, 110, 0.1);
}

.tab-btn.active {
  color: #2a1f12;
  background: linear-gradient(
    165deg,
    rgba(201, 169, 110, 0.22) 0%,
    rgba(201, 169, 110, 0.1) 100%
  );
  border-color: rgba(201, 169, 110, 0.5);
  box-shadow: 0 0 12px rgba(201, 169, 110, 0.15);
}

.tab-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.tab-badge {
  min-width: 1.1rem;
  padding: 0.05rem 0.35rem;
  color: #5c4033;
  font-size: 0.62rem;
  font-family: monospace;
  text-align: center;
  background: rgba(255, 252, 247, 0.9);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 999px;
}

.tab-btn.active .tab-badge {
  color: #3d2914;
  background: rgba(255, 255, 255, 0.85);
}

.section-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.45),
    transparent
  );
}

.section-label {
  flex-shrink: 0;
  color: #5c4033;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 0.82rem;
  letter-spacing: 0.2em;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.photo-item {
  aspect-ratio: 1;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.photo-item.large {
  grid-column: span 2;
  grid-row: span 2;
}

.photo-item:hover {
  transform: translateY(-4px);
}

.photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 120px;
  background: linear-gradient(165deg, #fffdf9 0%, #f3ebe0 100%);
  border: 1px solid rgba(201, 169, 110, 0.42);
  border-radius: 10px;
  box-shadow:
    0 4px 16px rgba(61, 41, 20, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  overflow: hidden;
  transition:
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.photo-item:hover .photo-frame {
  border-color: rgba(201, 169, 110, 0.65);
  box-shadow:
    0 12px 28px rgba(61, 41, 20, 0.12),
    0 0 20px rgba(201, 169, 110, 0.12);
}

.frame-corner-mark {
  position: absolute;
  z-index: 2;
  width: 14px;
  height: 14px;
  border-color: rgba(201, 169, 110, 0.55);
  border-style: solid;
  pointer-events: none;
}

.frame-corner-mark.tl {
  top: 6px;
  left: 6px;
  border-width: 2px 0 0 2px;
}

.frame-corner-mark.br {
  right: 6px;
  bottom: 6px;
  border-width: 0 2px 2px 0;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  height: 100%;
  color: #8b7355;
}

.photo-icon {
  font-size: 1.85rem;
  opacity: 0.45;
  filter: sepia(0.3);
}

.photo-hint {
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
}

.photo-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  padding: 0.5rem 0.6rem;
  background: linear-gradient(0deg, rgba(22, 16, 10, 0.75) 0%, transparent 100%);
}

.photo-date {
  color: rgba(232, 213, 163, 0.9);
  font-size: 0.62rem;
  font-family: monospace;
  letter-spacing: 0.06em;
}

.photo-tag {
  padding: 0.12rem 0.45rem;
  color: #fff8e7;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  background: rgba(201, 169, 110, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  opacity: 0.35;
}

.empty-title {
  margin: 0;
  color: #5c4033;
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
  font-size: 1rem;
  letter-spacing: 0.16em;
}

.empty-desc {
  margin: 0;
  max-width: 280px;
  color: #8b7355;
  font-size: 0.82rem;
  line-height: 1.65;
}

@media (max-width: 640px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .photo-item.large {
    grid-column: span 2;
    grid-row: span 1;
    aspect-ratio: 16 / 10;
  }
}
</style>
