<script setup lang="ts">
import { type Course } from "@/types/interfaces";
import StarIcon from "../icons/StarIcon.vue";
import Button from "./Button.vue";

const props = defineProps<Course>();
</script>
<template>
  <div class="flex max-w-126.5 flex-col gap-6 rounded-xl bg-[#FFFFFF] p-5">
    <div class="flex flex-col gap-4">
      <div class="h-65.5 w-116.5 overflow-hidden rounded-[10px]">
        <img :src="props.image" class="h-full w-full object-cover" alt="Course thumbnail" />
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex justify-between">
          <p class="text-[#8A8A8A]">
            Lecturer <span class="font-medium text-[#666666]">{{ props.instructor.name }}</span>
          </p>
          <div v-if="props.avgRating" class="flex items-center gap-1">
            <StarIcon />
            <span>{{ props.avgRating }}</span>
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
      <Button label="Details" class="h-14.5 w-29 rounded-md bg-[#4F46E5] px-6 py-4 text-[20px] text-[#F5F5F5]" />
    </div>
  </div>
</template>
