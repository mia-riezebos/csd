import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/sketch/:sketch",
    name: "sketch",
    component: () => import("@/pages/Sketch.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
