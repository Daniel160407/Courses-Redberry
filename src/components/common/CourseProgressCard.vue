<script setup lang="ts">
import Button from "./Button.vue";
import previewImg from "@/assets/images/coursePreviewImg.png";
import StarIcon from "../icons/StarIcon.vue";
import CalendarIcon from "../icons/CalendarIcon.vue";
import ClockIcon from "../icons/ClockIcon.vue";
import UsersIcon from "../icons/UsersIcon.vue";
import PointerIcon from "../icons/PointerIcon.vue";

interface CourseProgressProps {
  title: string;
  instructorName: string;
  avgRating: number | null;
  progress: number;
  image?: string;
  days?: string;
  times?: string;
  sessionType?: string;
  location?: string;
  blured?: boolean;
  extended?: boolean;
}

const props = defineProps<CourseProgressProps>();
</script>

<template>
  <div
    class="border-0.5 flex w-full min-w-126.5 flex-col gap-2 rounded-xl border-[#F5F5F5] bg-[#FFFFFF] p-5"
    :class="[props.blured ? 'blur-[20px]' : '', extended ? 'max-w-155.75 min-w-155.75' : 'max-w-126.5']"
  >
    <div class="flex">
      <img :src="image ?? previewImg" alt="Course preview" class="max-w-35 flex-1 rounded-xl object-cover" />
      <div class="flex flex-3 flex-col gap-2 pr-1 pl-4">
        <div class="flex justify-between">
          <p class="text-[#8A8A8A]">
            Lecturer <span class="font-medium text-[#666666]">{{ props.instructorName }}</span>
          </p>
          <div class="flex items-center gap-1">
            <StarIcon />
            <span>{{ props.avgRating ?? 0 }}</span>
          </div>
        </div>
        <span class="text-[20px] font-semibold text-[#141414]">{{ props.title }}</span>
        <div v-if="extended" class="flex flex-col">
          <div v-if="props.days" class="flex w-full items-center gap-2">
            <CalendarIcon />
            <span class="text-[14px] text-[#666666]">{{ props.days }}</span>
          </div>
          <div v-if="props.times" class="flex w-full items-center gap-2">
            <ClockIcon />
            <span class="text-[14px] text-[#666666]">{{ props.times }}</span>
          </div>
          <div v-if="props.sessionType" class="flex w-full items-center gap-2">
            <UsersIcon />
            <span class="text-[14px] text-[#666666]">{{ props.sessionType }}</span>
          </div>
          <div v-if="props.location" class="flex w-full items-center gap-2">
            <PointerIcon />
            <span class="text-[14px] text-[#666666]">{{ props.location }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-end justify-between gap-5">
      <div class="flex w-full flex-col gap-1 pb-1" :class="!extended ? 'max-w-84' : ''">
        <span class="text-sm font-medium">{{ props.progress }}% Complete</span>
        <div class="h-3.75 w-full overflow-hidden rounded-full bg-[#4F46E5]/20">
          <div
            class="h-full rounded-full bg-[#4F46E5] transition-all duration-500 ease-out"
            :style="{ width: `${props.progress}%` }"
          />
        </div>
      </div>
      <Button
        label="View"
        class="text-md rounded-lg border-2 border-[#958FEF] px-4 py-3 font-medium text-[#4F46E5] transition-all duration-300 ease-out hover:bg-[#4F46E5] hover:text-[#F5F5F5] active:scale-95"
        :class="extended ? 'h-12 w-29.25' : ''"
      />
    </div>
  </div>
</template>
