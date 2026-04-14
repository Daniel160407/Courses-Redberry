<script setup lang="ts">
import Button from "./Button.vue";
import previewImg from "@/assets/images/coursePreviewImg.png";
import StarIcon from "../icons/StarIcon.vue";
import CalendarIcon from "../icons/CalendarIcon.vue";
import ClockIcon from "../icons/ClockIcon.vue";
import UsersIcon from "../icons/UsersIcon.vue";
import PointerIcon from "../icons/PointerIcon.vue";
import ProgressBar from "./ProgressBar.vue";

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
const emit = defineEmits(["openDetails"]);
</script>

<template>
  <div
    class="flex w-full cursor-pointer flex-col justify-between gap-2 rounded-xl border-[0.5px] border-[#F5F5F5] bg-[#FFFFFF] p-5 shadow-[0_0_11.7px_0_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:border-[#B7B3F4] hover:shadow-[0_0_25px_0_rgba(138,130,212,0.1)] active:border-[#958FEF] active:shadow-[0_0_35px_0_rgba(138,130,212,0.25)]"
    :class="[props.blured ? 'blur-[20px]' : '', extended ? 'max-w-155.75 min-w-155.75' : 'max-w-126.5 min-w-126.5']"
    @click="emit('openDetails')"
  >
    <div class="flex">
      <img
        :src="image ?? previewImg"
        alt="Course preview"
        class="max-h-30.75 min-h-30.75 max-w-35 min-w-35 flex-1 rounded-xl object-cover"
      />
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
      <ProgressBar :progress="props.progress" class="w-full pb-1" :class="!extended ? 'max-w-84' : ''" />
      <Button
        label="View"
        class="text-md h-12 rounded-lg border-2 border-[#958FEF] px-4 py-3 font-medium text-[#4F46E5] transition-all duration-300 ease-out hover:bg-[#4F46E5] hover:text-[#F5F5F5] active:scale-95"
        :class="extended ? 'w-29.25' : 'w-22.5'"
        @click="emit('openDetails')"
      />
    </div>
  </div>
</template>
