import { createRouter, createWebHistory } from "vue-router";
import { CATALOG_ROUTE, DASHBOARD_ROUTE } from "../composables/constants";
import DashboardPage from "@/views/DashboardPage.vue";
import CatalogPage from "@/views/CatalogPage.vue";

const routes = [
  { path: "/", redirect: DASHBOARD_ROUTE },
  { path: DASHBOARD_ROUTE, component: DashboardPage },
  { path: CATALOG_ROUTE, component: CatalogPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
