import { createRouter, createWebHistory } from "vue-router";
import { CATALOG_COURSE_ROUTE, CATALOG_ROUTE, DASHBOARD_COURSE_ROUTE, DASHBOARD_ROUTE } from "../constants/constants";
import DashboardPage from "@/views/DashboardPage.vue";
import CatalogPage from "@/views/CatalogPage.vue";
import InsideCoursePage from "@/views/InsideCoursePage.vue";

const routes = [
  { path: "/", redirect: DASHBOARD_ROUTE },
  { path: DASHBOARD_ROUTE, component: DashboardPage },
  { path: CATALOG_ROUTE, component: CatalogPage },
  { path: DASHBOARD_COURSE_ROUTE, component: InsideCoursePage },
  { path: CATALOG_COURSE_ROUTE, component: InsideCoursePage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
