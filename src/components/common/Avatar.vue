<script setup lang="ts">
import UserIcon from "../icons/UserIcon.vue";

interface Props {
  src?: string;
  alt?: string;
  status?: string;
}

const { src, alt, status } = defineProps<Props>();

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    complete: "#1DC31D",
    incomplete: "#F4A316"
  };

  return colors[status];
};
</script>

<template>
  <div class="relative inline-block">
    <div class="h-14 w-14 overflow-hidden rounded-full border-2 border-white">
      <img v-if="src" :src="src" :alt="alt" class="h-full w-full object-cover" />
      <div v-else class="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEEDFC]">
        <UserIcon />
      </div>
    </div>

    <div
      v-if="status"
      class="absolute right-0 bottom-0 h-4 w-4 rounded-full border-[3px] border-white transition-colors duration-200"
      :style="{ backgroundColor: getStatusColor(status) }"
    ></div>
  </div>
</template>
