import type { Component } from "vue";
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
