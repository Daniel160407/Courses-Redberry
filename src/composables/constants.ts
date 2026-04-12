import BulbIcon from "@/components/icons/BulbIcon.vue";
import ChartIcon from "@/components/icons/ChartIcon.vue";
import CloudeIcon from "@/components/icons/CloudeIcon.vue";
import CodeIcon from "@/components/icons/CodeIcon.vue";
import HybridIcon from "@/components/icons/HybridIcon.vue";
import MonitorIcon from "@/components/icons/MonitorIcon.vue";
import MoonIcon from "@/components/icons/MoonIcon.vue";
import PaletteIcon from "@/components/icons/PaletteIcon.vue";
import SunIcon from "@/components/icons/SunIcon.vue";
import TreeIcon from "@/components/icons/TreeIcon.vue";
import UsersIcon from "@/components/icons/UsersIcon.vue";
import type { Component } from "vue";

export const DASHBOARD_ROUTE = "/dashboard";
export const CATALOG_ROUTE = "/catalog";
export const DASHBOARD_COURSE_ROUTE = "/dashboard/course/:id";

export const DASHBOARD_PAGE_NAME = "dashboard";
export const CATALOG_PAGE_NAME = "catalog";

//profile statuses
export const INCOMPLETE_STATUS = "incomplete";
export const COMPLETE_STATUS = "complete";

//Dropdown options
export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: Hight to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Title: A-Z", value: "title_asc" }
];

//Static Constants
export const CATEGORY_ICONS: Record<string, Component> = {
  development: CodeIcon,
  design: PaletteIcon,
  business: ChartIcon,
  marketing: TreeIcon,
  "data-science": BulbIcon
};

export const TIME_SLOT_ICONS: Record<number, Component> = {
  1: CloudeIcon,
  2: SunIcon,
  3: MoonIcon
};

export const SESSION_TYPE_ICONS: Record<number, Component> = {
  1: MonitorIcon,
  2: UsersIcon,
  3: HybridIcon
};

export const WEEKLY_SCHEDULE_CONFIG = [
  { id: 1, label: "Monday - Wednesday", shortLabel: "Mon - Wed", days: ["monday", "wednesday"] },
  { id: 2, label: "Tuesday - Thursday", shortLabel: "Tue - Thu", days: ["tuesday", "thursday"] },
  { id: 3, label: "Friday - Saturday", shortLabel: "Fri - Sat", days: ["friday", "saturday"] },
  { id: 4, label: "Weekend Only", shortLabel: "Weekend", days: ["saturday", "sunday"] }
];

export const TIME_SLOT_CONFIG = [
  { id: 1, label: "Morning", startTime: "9:00 AM", endTime: "11:00 AM" },
  { id: 2, label: "Afternoon", startTime: "12:00 PM", endTime: "6:00 PM" },
  { id: 3, label: "Evening", startTime: "6:00 PM", endTime: "8:00 PM" }
];
