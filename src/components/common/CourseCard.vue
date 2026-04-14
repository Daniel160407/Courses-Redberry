<script setup lang="ts">
import { type Course } from "@/types/interfaces";
import StarIcon from "../icons/StarIcon.vue";
import Button from "./Button.vue";
import type { Component } from "vue";

interface Props extends Course {
  variant?: "primary" | "secondary";
  categoryIcon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary"
});
const emit = defineEmits(["openDetails"]);
</script>
<template>
  <div
    v-if="props.variant === 'primary'"
    class="flex min-h-144 w-full max-w-126.5 min-w-126.5 cursor-pointer flex-col justify-between rounded-xl border border-[#F5F5F5] bg-[#FFFFFF] p-5 transition-all duration-300 ease-out hover:border-[#B7B3F4] hover:shadow-[0_0_25px_0_rgba(138,130,212,0.1)] active:border-[#958FEF]"
    @click="emit('openDetails')"
  >
    <div class="flex flex-col gap-4">
      <div class="h-65.5 w-116.5 overflow-hidden rounded-[10px]">
        <img :src="props.image" class="h-full w-full object-cover" alt="Course thumbnail" />
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex justify-between">
          <p class="text-[#8A8A8A]">
            Lecturer <span class="font-medium text-[#666666]">{{ props.instructor.name }}</span>
          </p>
          <div class="flex items-center gap-1">
            <StarIcon />
            <span>{{ props.avgRating ?? 0 }}</span>
          </div>
        </div>

        <div>
          <span class="text-2xl font-semibold text-[#141414]">{{ props.title }}</span>
        </div>
      </div>
      <div>
        <p class="text-md text-[#666666]">{{ props.description }}</p>
      </div>
    </div>

    <div class="flex justify-between">
      <p class="flex items-center gap-2 text-[#8A8A8A]">
        Starting From <span class="text-[32px] font-semibold text-[#141414]">${{ props.basePrice }}</span>
      </p>
      <Button label="Details" variant="primary" @click="emit('openDetails')" />
    </div>
  </div>

  <div
    v-else-if="props.variant === 'secondary'"
    class="flex max-w-93.25 cursor-pointer flex-col gap-2.5 rounded-xl border border-[#F5F5F5] bg-[#FFFFFF] p-5"
    @click="emit('openDetails')"
  >
    <div class="flex h-full flex-col justify-between gap-4.5">
      <div class="flex flex-col gap-4.5">
        <img :src="props.image" class="h-45.25 w-83.25 rounded-[10px] object-cover" alt="Course thumbnail" />
        <div class="flex flex-col gap-4.5">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between">
              <div class="text-[14px] font-medium text-[#8A8A8A]">
                <span>{{ props.instructor.name }}</span> | <span>{{ props.durationWeeks }} Weeks</span>
              </div>
              <div class="flex items-center gap-1">
                <StarIcon />
                <span class="text-[14px] font-medium text-[#525252]">{{ props.avgRating ?? 0 }}</span>
              </div>
            </div>
            <div class="text-2xl font-semibold text-[#0A0A0A]">
              <p>{{ props.title }}</p>
            </div>
          </div>
          <div class="flex">
            <div class="flex items-center gap-1.5 rounded-xl bg-[#F5F5F5] px-3 py-2 text-[#525252]">
              <component :is="props.categoryIcon" v-if="props.categoryIcon" />
              <span class="text-[16px] font-medium">{{ props.category.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-[12px] font-medium text-[#8A8A8A]">Starting From</span>
          <span class="text-[24px] font-semibold text-[#292929]">${{ props.basePrice }}</span>
        </div>
        <Button label="Details" variant="secondary" @click="emit('openDetails')" />
      </div>
    </div>
  </div>
</template>
