<script setup lang="ts">
interface Props {
  progress: number;
  size?: "small" | "medium";
}

withDefaults(defineProps<Props>(), {
  size: "small"
});
</script>

<template>
  <div class="flex flex-col gap-1" :class="size === 'small' ? 'gap-1' : 'gap-3'">
    <span :class="size === 'small' ? 'text-sm font-medium' : 'text-[20px] font-semibold'"
      >{{ progress }}% Complete</span
    >
    <div class="h-3.75 w-full overflow-hidden rounded-full bg-[#4F46E5]/20">
      <div
        class="h-full rounded-full bg-[#4F46E5] transition-all duration-500 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
