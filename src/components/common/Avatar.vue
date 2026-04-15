<script setup lang="ts">
import UserIcon from "../icons/UserIcon.vue";

interface Props {
  src?: string;
  alt?: string;
  status?: boolean;
}

const { src, alt, status } = defineProps<Props>();
</script>

<template>
  <div class="relative inline-block">
    <div class="h-14 w-14 overflow-hidden rounded-full border-[1.5px] border-[#f5f5f5] hover:border-[#B7B3F4]">
      <img v-if="src" :src="src" :alt="alt" class="h-full w-full object-cover" />
      <div v-else class="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEEDFC]">
        <UserIcon />
      </div>
    </div>

    <div
      v-if="status !== undefined"
      class="absolute right-0 bottom-0 h-4 w-4 rounded-full border-[3px] border-white transition-colors duration-200"
      :class="status ? 'bg-[#1DC31D]' : 'bg-[#F4A316]'"
    ></div>
  </div>
</template>
