<script setup lang="ts">
import { ref, type Component } from "vue";

interface Props {
  label?: string;
  icon?: Component;
  image?: string;
  isSelected?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click", !props.isSelected);
};
</script>
<template>
  <div
    class="inline-flex w-fit cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300 ease-out"
    :class="
      props.isSelected
        ? 'border-[#281ED2] bg-[#EEEDFC] text-[#281ED2]'
        : 'border-[#FFFFFF] bg-[#FFFFFF] text-[#666666] hover:border-[#DDDBFA] hover:bg-[#DDDBFA] hover:text-[#281ED2]'
    "
    @click="handleClick"
  >
    <component :is="props.icon" v-if="props.icon" class="h-6 w-6" />
    <img v-else-if="props.image" :src="props.image" class="h-7.5 w-7.5 rounded-sm object-cover" />
    <span class="text-[16px] font-medium">{{ props.label }}</span>
  </div>
</template>
