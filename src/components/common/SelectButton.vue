<script setup lang="ts">
import { computed, type Component } from "vue";

interface Props {
  label?: string;
  icon?: Component;
  image?: string;
  isSelected?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "text";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: "primary"
});
const emit = defineEmits(["click"]);

const handleClick = () => {
  if (!props.disabled) {
    emit("click", !props.isSelected);
  }
};

const buttonClasses = computed(() => {
  if (props.disabled) {
    return "cursor-not-allowed! border-[#D1D1D1]! bg-[#F5F5F5] text-[#CCCCCC]!";
  }

  if (props.variant === "text") {
    return "cursor-default border-transparent bg-[#FFFFFF] text-[#666666]";
  }

  const base = "cursor-pointer transition-all duration-300 ease-out";
  const selected = "border-[#281ED2] bg-[#EEEDFC] text-[#281ED2]";

  const unselectedMap = {
    primary: "border-[#FFFFFF] bg-[#FFFFFF]",
    outline: "border-[#D1D1D1] bg-[#FFFFFF]"
  };

  const unselected = `${unselectedMap[props.variant as "primary" | "outline"]} text-[#525252] hover:border-[#DDDBFA] hover:bg-[#DDDBFA] hover:text-[#281ED2]`;

  return `${base} ${props.isSelected ? selected : unselected}`;
});
</script>
<template>
  <div
    class="inline-flex w-fit items-center gap-2.5 rounded-xl border px-3 py-2"
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
