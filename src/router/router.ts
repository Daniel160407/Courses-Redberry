import { createRouter, createWebHistory } from "vue-router";
import { HOME_ROUTE } from "../composables/constants";

const routes = [{ path: "/", redirect: HOME_ROUTE }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
