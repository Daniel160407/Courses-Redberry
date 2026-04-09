<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";
import ArrowLeftIcon from "../icons/ArrowLeftIcon.vue";
import ArrowRightIcon from "../icons/ArrowRightIcon.vue";

const props = defineProps<{
  total: number;
  modelValue: number;
}>();

const emit = defineEmits(["update:modelValue"]);

const pages = computed(() => {
  const t = props.total;
  const c = props.modelValue;

  if (t <= 7) {
    return Array.from({ length: t }, (_, i) => i + 1);
  }

  if (c <= 2) return [1, 2, 3, "...", t];

  if (c === 3) return [1, 2, 3, 4, "...", t];

  if (c === 4) return [1, 2, 3, 4, 5, "...", t];

  if (c === t - 3) return [1, "...", t - 4, t - 3, t - 2, t - 1, t];

  if (c === t - 2) return [1, "...", t - 3, t - 2, t - 1, t];

  if (c >= t - 1) return [1, "...", t - 2, t - 1, t];

  return [1, "...", c - 1, c, c + 1, "...", t];
});

const setPage = (page: number | string) => {
  if (typeof page === "number" && page >= 1 && page <= props.total) {
    emit("update:modelValue", page);
  }
};
</script>

<template>
  <div class="flex items-center gap-1 select-none">
    <Button
      type="button"
      :disabled="modelValue === 1"
      :icon="ArrowLeftIcon"
      :icon-size="0.75"
      :class="modelValue !== 1 ? 'cursor-pointer! text-[#4F46E5]!' : 'cursor-not-allowed! text-[#D1D1D1]!'"
      class="flex h-10 w-10 items-center justify-center rounded-sm border border-[#D1D1D1] bg-[#FFFFFF] py-0! pl-2"
      @click="setPage(modelValue - 1)"
    />
    <template v-for="(page, index) in pages" :key="index">
      <Button
        v-if="typeof page === 'number'"
        type="button"
        class="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D1D1D1] text-[16px] font-medium transition-colors"
        :class="page === modelValue ? 'bg-[#281ED2] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#4F46E5]'"
        @click="setPage(page)"
      >
        {{ page }}
      </Button>
      <span v-else class="flex h-10 w-8 items-center justify-center text-[#666666]">...</span>
    </template>
    <Button
      type="button"
      :disabled="modelValue === total"
      :icon="ArrowRightIcon"
      :icon-size="0.75"
      :class="modelValue !== total ? 'cursor-pointer! text-[#4F46E5]!' : 'cursor-not-allowed! text-[#D1D1D1]!'"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#D1D1D1] bg-[#FFFFFF] py-0! pl-2"
      @click="setPage(modelValue + 1)"
    />
  </div>
</template>
