import { createRouter, createWebHistory } from "vue-router";
import { DASHBOARD_ROUTE } from "../composables/constants";
import DashboardPage from "@/views/DashboardPage.vue";

const routes = [
  { path: "/", redirect: DASHBOARD_ROUTE },
  { path: DASHBOARD_ROUTE, component: DashboardPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
