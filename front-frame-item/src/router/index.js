import { createRouter, createWebHistory } from "vue-router";
import publishedRouter from "./published/index";
import orderRouter from "./order/index";
import infrastructureRouter from "./infrastructure";
import serviceRouter from "./customerService/index";

const routes = [
  {
    path: "/",
    name: "Loading",
    component: () => import("../pages/Loading.vue"),
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("../pages/test.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../pages/About.vue"),
  },
  ...publishedRouter,
  ...orderRouter,
  ...infrastructureRouter,
  ...serviceRouter,
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];
const router = createRouter({
  // 微应用的入口名称 window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL
  // '/multiplatform-web'
  history: createWebHistory("/multiplatform-app/"),
  routes,
});

export default router;
