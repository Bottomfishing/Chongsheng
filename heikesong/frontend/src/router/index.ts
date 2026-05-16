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
    },
    {
      path: "/play",
      name: "play",
      component: PlayerView,
    },
    {
      path: "/soul-talk",
      name: "soul-talk",
      component: SoulTalkView,
    },
  ],
});

export default router;
