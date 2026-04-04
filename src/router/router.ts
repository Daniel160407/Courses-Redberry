import { createRouter, createWebHistory } from "vue-router";
import { HOME_ROUTE } from "../composables/constants";
import Test from "../views/Test.vue";

const routes = [
  { path: "/", redirect: HOME_ROUTE },
  { path: HOME_ROUTE, component: Test },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
