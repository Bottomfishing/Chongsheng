import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PlayerView from "@/views/PlayerView.vue";
import SoulTalkView from "@/views/SoulTalkView.vue";

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
  ],
});

export default router;
