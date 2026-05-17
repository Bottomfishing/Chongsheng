import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ChaptersView from "@/views/ChaptersView.vue";
import PlayerView from "@/views/PlayerView.vue";
import SoulTalkView from "@/views/SoulTalkView.vue";
import AchievementView from "@/views/AchievementView.vue";
import AlbumView from "@/views/AlbumView.vue";
import MiniGameView from "@/views/MiniGameView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { transition: "page-slide" },
    },
    {
      path: "/chapters",
      name: "chapters",
      component: ChaptersView,
      meta: { transition: "page-slide" },
    },
    {
      path: "/play",
      name: "play",
      component: PlayerView,
      meta: { transition: "page-slide" },
    },
    {
      path: "/soul-talk",
      name: "soul-talk",
      component: SoulTalkView,
      meta: { transition: "page-slide" },
    },
    {
      path: "/achievements",
      name: "achievements",
      component: AchievementView,
      meta: { transition: "page-slide" },
    },
    {
      path: "/album",
      name: "album",
      component: AlbumView,
      meta: { transition: "page-slide" },
    },
    {
      path: "/mini-game",
      name: "mini-game",
      component: MiniGameView,
      meta: { transition: "page-slide" },
    },
  ],
});

export default router;
