<template>
  <div class="album-page">
    <div class="paper-bg" />
    <div class="grain-overlay" />

    <!-- 顶部导航栏 -->
    <header class="top-bar">
      <button class="back-btn" type="button" @click="goBack">
        <span class="back-icon">&#8249;</span>
        <span>返回</span>
      </button>
      <div class="page-title">
        <span class="title-icon">&#9670;</span>
        <span>时光相册</span>
      </div>
      <div class="album-count">
        <span class="count-num">{{ totalPhotos }}</span>
        <span class="count-label">张照片</span>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="album-container">
        <!-- 分类标签 -->
        <nav class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="tab-btn"
            :class="{ active: activeCategory === cat.id }"
            type="button"
            @click="activeCategory = cat.id"
          >
            <span class="tab-icon">{{ cat.icon }}</span>
            <span class="tab-label">{{ cat.name }}</span>
          </button>
        </nav>

        <!-- 时间线标题 -->
        <div class="timeline-header">
          <div class="timeline-line" />
          <span class="timeline-label">{{ currentCategoryName }}</span>
          <div class="timeline-line" />
        </div>

        <!-- 照片网格 -->
        <div class="photo-grid">
          <div
            v-for="(photo, idx) in currentPhotos"
            :key="idx"
            class="photo-item"
            :class="{ large: photo.size === 'large' }"
          >
            <div class="photo-frame">
              <div class="photo-placeholder">
                <span class="photo-icon">&#127902;</span>
                <span class="photo-hint">{{ photo.title }}</span>
              </div>
              <div class="photo-overlay">
                <div class="photo-meta">
                  <span class="photo-date">{{ photo.date }}</span>
                  <span v-if="photo.tag" class="photo-tag">{{ photo.tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="currentPhotos.length === 0" class="empty-state">
          <div class="empty-icon">&#128247;</div>
          <p class="empty-title">暂无照片</p>
          <p class="empty-desc">
            在剧情模式中做出选择，精彩瞬间将自动收录于此
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
      { title: "街头直播", date: "1995.05.18", tag: "主线" },
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
  categories.value.find((c) => c.id === activeCategory.value)
);

const currentCategoryName = computed(() => currentCategory.value?.name ?? "");

const currentPhotos = computed(() => currentCategory.value?.photos ?? []);

const totalPhotos = computed(() =>
  categories.value.reduce((sum, c) => sum + c.photos.length, 0)
);

function goBack() {
  router.push("/");
}
</script>

<style scoped>
.album-page {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  background: rgba(250, 248, 245, 0.92);
  color: #3d2914;
  overflow: hidden;
}

.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.04) 0%, transparent 40%),
    linear-gradient(180deg, #fdfbf7 0%, #f5f0e8 100%);
  pointer-events: none;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ===== 顶部导航栏 ===== */
.top-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid rgba(201, 169, 110, 0.3);
  background: rgba(253, 251, 247, 0.85);
  backdrop-filter: blur(12px);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  color: #8b7355;
  font-size: 0.85rem;
  font-family: inherit;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: #5c4126;
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(201, 169, 110, 0.5);
  transform: translateX(-2px);
}

.back-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3d2914;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "STXingkai", "Xingkai SC", "行楷", "STKaiti", "KaiTi", serif;
  letter-spacing: 0.15em;
}

.title-icon {
  color: #c9a96e;
  font-size: 0.9rem;
}

.album-count {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  color: #8b7355;
  font-size: 0.85rem;
}

.count-num {
  color: #8b4513;
  font-size: 1.1rem;
  font-weight: 600;
}

.count-label {
  font-size: 0.75rem;
}

/* ===== 主内容区 ===== */
.main-content {
  position: relative;
  z-index: 5;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem 1.25rem 2rem;
}

.main-content::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}

.main-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.album-container {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ===== 分类标签 ===== */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: rgba(255, 252, 247, 0.8);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  color: #8b7355;
  font-size: 0.85rem;
  font-family: inherit;
  letter-spacing: 0.08em;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: #5c4126;
  background: rgba(201, 169, 110, 0.08);
}

.tab-btn.active {
  color: #3d2914;
  background: rgba(201, 169, 110, 0.15);
  border-color: rgba(201, 169, 110, 0.4);
  font-weight: 500;
}

.tab-icon {
  font-size: 1rem;
  line-height: 1;
}

/* ===== 时间线标题 ===== */
.timeline-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.timeline-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.4), transparent);
}

.timeline-label {
  color: #8b7355;
  font-size: 0.75rem;
  font-family: "STKaiti", "KaiTi", "楷体", serif;
  letter-spacing: 0.2em;
  white-space: nowrap;
}

/* ===== 照片网格 ===== */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.photo-item {
  aspect-ratio: 1;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.photo-item.large {
  grid-column: span 2;
  grid-row: span 2;
  aspect-ratio: auto;
}

.photo-item:hover {
  transform: translateY(-4px);
}

.photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #fffdf9 0%, #f5efe6 100%);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(61, 41, 20, 0.05);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.photo-item:hover .photo-frame {
  box-shadow: 0 8px 24px rgba(61, 41, 20, 0.1);
  border-color: rgba(201, 169, 110, 0.6);
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  min-height: 120px;
  color: #a09080;
}

.photo-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.photo-hint {
  font-size: 0.75rem;
  font-family: "STKaiti", "KaiTi", "楷体", serif;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

.photo-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.5rem 0.65rem;
  background: linear-gradient(0deg, rgba(61, 41, 20, 0.65) 0%, transparent 100%);
}

.photo-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
}

.photo-date {
  color: rgba(250, 248, 245, 0.85);
  font-size: 0.65rem;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.photo-tag {
  padding: 0.15rem 0.4rem;
  color: rgba(250, 248, 245, 0.9);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  background: rgba(201, 169, 110, 0.5);
  border-radius: 999px;
}

/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.4;
}

.empty-title {
  margin: 0;
  color: #8b7355;
  font-size: 1rem;
  font-family: "STKaiti", "KaiTi", "楷体", serif;
  letter-spacing: 0.15em;
}

.empty-desc {
  margin: 0;
  color: #a09080;
  font-size: 0.8rem;
  line-height: 1.6;
  max-width: 280px;
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .top-bar {
    padding: 0.75rem 1rem;
  }

  .page-title {
    font-size: 0.95rem;
  }

  .album-count {
    font-size: 0.75rem;
  }

  .category-tabs {
    gap: 0.35rem;
  }

  .tab-btn {
    padding: 0.4rem 0.65rem;
    font-size: 0.78rem;
  }
}
</style>
