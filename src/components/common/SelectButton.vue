<script setup lang="ts">
import { computed, type Component } from "vue";

interface Props {
  label?: string;
  icon?: Component;
  image?: string;
  isSelected?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "text" | "schedule" | "time-slot" | "session-type";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: "primary"
});
const emit = defineEmits(["click"]);

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2.5 rounded-xl border transition-all duration-300 ease-out px-3 py-2" as const;

const VARIANT_STYLES: Record<string, string> = {
  primary: "border-[#FFFFFF] bg-[#FFFFFF]",
  outline: "border-[#D1D1D1] bg-[#FFFFFF]",
  schedule: "border-[#D1D1D1] bg-[#FFFFFF] h-22.75 w-full justify-center p-2.5",
  "time-slot": "border-[#FFFFFF] bg-[#FFFFFF] p-3.75",
  "session-type": "border-[#FFFFFF] bg-[#FFFFFF] min-h-38.75 min-w-42.75 px-5 py-3.75"
} as const;

const handleClick = () => {
  if (!props.disabled) {
    emit("click", !props.isSelected);
  }
};

const buttonClasses = computed(() => {
  if (props.disabled) {
    return `${BASE_STYLES} cursor-not-allowed border-[#D1D1D1] bg-[#F5F5F5] text-[#CCCCCC] w-full`;
  }

  if (props.variant === "text") {
    return `${BASE_STYLES} cursor-default border-transparent bg-white text-[#666666] w-fit!`;
  }

  const isSelected = props.isSelected;

  const currentVariant = VARIANT_STYLES[props.variant as keyof typeof VARIANT_STYLES] || VARIANT_STYLES.primary;

  if (isSelected) {
    return `${BASE_STYLES} cursor-pointer border-[#281ED2] bg-[#EEEDFC] text-[#281ED2] ${props.variant !== "primary" ? "w-full" : ""}`;
  }

  return `${BASE_STYLES} cursor-pointer ${currentVariant} text-[#525252] hover:border-[#DDDBFA] hover:bg-[#DDDBFA] hover:text-[#281ED2]`;
});
</script>
<template>
  <div
    class="inline-flex items-center justify-center gap-2.5 rounded-xl border px-3 py-2"
    :class="buttonClasses"
    @click="handleClick"
  >
    <template v-if="props.label">
      <component :is="props.icon" v-if="props.icon" class="h-6 w-6" />
      <img v-else-if="props.image" :src="props.image" class="h-7.5 w-7.5 rounded-sm object-cover" />
      <span class="text-[16px] font-medium">{{ props.label }}</span>
    </template>
    <slot v-else />
  </div>
</template>
