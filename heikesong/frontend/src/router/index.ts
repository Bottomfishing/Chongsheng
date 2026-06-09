import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ChaptersView from "@/views/ChaptersView.vue";
import PlayerView from "@/views/PlayerView.vue";
import SoulTalkView from "@/views/SoulTalkView.vue";
import AchievementView from "@/views/AchievementView.vue";
import AlbumView from "@/views/AlbumView.vue";
import { hasLocalSession } from "@/utils/localAuth";

const router = createRouter({
  history: createWebHashHistory(),
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
  if (!to.meta.public && !hasLocalSession()) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
});

export default router;
