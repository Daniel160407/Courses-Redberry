<script setup lang="ts">
import { type Component } from "vue";

interface Props {
  label?: string;
  icon?: Component;
  image?: string;
  isSelected?: boolean;
  disabled?: boolean;
  variant?: "primary" | "text";
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
</script>
<template>
  <div
    class="inline-flex w-fit items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300 ease-out"
    :class="[
      props.variant === 'text'
        ? 'cursor-default border-transparent bg-[#FFFFFF] text-[#666666]'
        : props.isSelected
          ? 'cursor-pointer border-[#281ED2] bg-[#EEEDFC] text-[#281ED2]'
          : 'cursor-pointer border-[#FFFFFF] bg-[#FFFFFF] text-[#666666] hover:border-[#DDDBFA] hover:bg-[#DDDBFA] hover:text-[#281ED2]',
      props.disabled ? 'cursor-not-allowed! bg-[#F5F5F5] text-[#CCCCCC]' : ''
    ]"
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
