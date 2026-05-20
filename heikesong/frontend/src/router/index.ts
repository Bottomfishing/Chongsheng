import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ChaptersView from "@/views/ChaptersView.vue";
import PlayerView from "@/views/PlayerView.vue";
import SoulTalkView from "@/views/SoulTalkView.vue";
import AchievementView from "@/views/AchievementView.vue";
import AlbumView from "@/views/AlbumView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { transition: "page-slide", public: true },
    },
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
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("auth_token");
  if (!to.meta.public && !token) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
});

export default router;
