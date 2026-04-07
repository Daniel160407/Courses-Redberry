<script setup lang="ts">
import type { SliderItem } from "@/types/interfaces";
import { ref, onMounted, onUnmounted, computed } from "vue";
import Button from "./Button.vue";
import ArrowLeftOutlinedIcon from "../icons/ArrowLeftOutlinedIcon.vue";
import ArrowRightOutlinedIcon from "../icons/ArrowRightOutlinedIcon.vue";

interface Props {
  items?: SliderItem[];
}

const { items = [] } = defineProps<Props>();
const showSlide = ref(0);
const autoPlayInterval = ref<ReturnType<typeof setInterval> | null>(null);

const trackStyle = computed(() => ({
  transform: `translateX(-${showSlide.value * 100}%)`,
  transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)"
}));

const nextSlide = () => {
  if (items.length > 0) {
    showSlide.value = (showSlide.value + 1) % items.length;
    resetAutoPlay();
  }
};

const prevSlide = () => {
  if (items.length > 0) {
    showSlide.value = (showSlide.value - 1 + items.length) % items.length;
    resetAutoPlay();
  }
};

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(nextSlide, 3000);
};
const stopAutoPlay = () => {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value);
};
const resetAutoPlay = () => {
  stopAutoPlay();
  startAutoPlay();
};

onMounted(() => startAutoPlay());
onUnmounted(() => stopAutoPlay());
</script>

<template>
  <div class="relative max-w-391.5 overflow-hidden rounded-[30px] bg-black">
    <div class="flex h-full w-full" :style="trackStyle">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="min-h-105 w-full shrink-0 bg-cover bg-center bg-no-repeat p-12"
        :style="{
          backgroundImage: item.image
            ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${item.image})`
            : 'none'
        }"
      >
        <div class="flex w-full flex-col gap-10">
          <div class="flex flex-col gap-3">
            <span class="text-5xl font-bold text-[#FFFFFF]">{{ item.title }}</span>
            <span class="font-inter max-w-304.5 text-2xl font-light text-[#FFFFFF]">
              {{ item.description }}
            </span>
          </div>
          <div>
            <Button :label="item.buttonLabel" class="rounded-md bg-[#4F46E5] px-6 py-4 text-xl text-[#F5F5F5]" />
          </div>
        </div>
      </div>
    </div>

    <div class="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-12">
      <div class="pointer-events-auto flex w-full items-center justify-between">
        <div class="w-34" />
        <div class="flex w-full justify-center gap-3">
          <div
            v-for="(_, index) in items"
            :key="index"
            :class="showSlide === index ? 'bg-[#F5F5F5]' : 'bg-[#C1BCBC]/50'"
            class="h-2 w-14 rounded-2xl transition-all duration-500"
          />
        </div>
        <div class="flex gap-6">
          <Button
            :icon="ArrowLeftOutlinedIcon"
            class="p-0! text-[#FFFFFF] hover:opacity-70"
            :icon-size="3.5"
            @click="prevSlide"
          />
          <Button
            :icon="ArrowRightOutlinedIcon"
            class="p-0! text-[#FFFFFF] hover:opacity-70"
            :icon-size="3.5"
            @click="nextSlide"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-shrink-0 {
  flex-shrink: 0;
}

.pointer-events-none {
  pointer-events: none;
}
.pointer-events-auto {
  pointer-events: auto;
}
</style>
