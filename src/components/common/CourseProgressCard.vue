<script setup lang="ts">
import Button from "./Button.vue";
import StarIcon from "../icons/StarIcon.vue";
import CalendarIcon from "../icons/CalendarIcon.vue";
import ClockIcon from "../icons/ClockIcon.vue";
import UsersIcon from "../icons/UsersIcon.vue";
import PointerIcon from "../icons/PointerIcon.vue";
import ProgressBar from "./ProgressBar.vue";

interface CourseProgressProps {
  course: {
    title: string;
    instructor: { name: string };
    avgRating: number | null;
    image?: string;
    basePrice?: string;
  };
  progress: number;
  schedule?: {
    days?: string;
    times?: string;
    sessionType?: string;
    location?: string;
    priceModifier?: string;
  };
  blured?: boolean;
  extended?: boolean;
}

const props = defineProps<CourseProgressProps>();
const emit = defineEmits(["openDetails"]);
</script>

<template>
  <Transition
    appear
    enter-active-class="transition duration-400 ease-out"
    enter-from-class="opacity-0 translate-y-2.5"
    enter-to-class="opacity-100 translate-y-0"
  >
    <div
      class="flex w-full cursor-pointer flex-col justify-between gap-2 rounded-xl border-[0.5px] border-[#F5F5F5] bg-[#FFFFFF] p-5 shadow-[0_0_11.7px_0_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:border-[#B7B3F4] hover:shadow-[0_0_25px_0_rgba(138,130,212,0.1)] active:border-[#958FEF] active:shadow-[0_0_35px_0_rgba(138,130,212,0.25)]"
      :class="[
        props.blured ? 'blur-[20px]' : '',
        props.extended ? 'max-w-155.75 min-w-155.75' : 'max-w-126.5 min-w-126.5'
      ]"
      @click="emit('openDetails')"
    >
      <div class="flex">
        <img
          :src="props.course.image"
          alt="Course preview"
          class="max-h-30.75 flex-1 rounded-xl object-cover"
          :class="props.extended ? 'min-h-47.75 min-w-67.25' : 'min-h-30.75 max-w-35 min-w-35'"
        />
        <div class="flex flex-3 flex-col gap-2 pr-1 pl-4">
          <div class="flex justify-between">
            <p class="text-[#8A8A8A]">
              Lecturer <span class="font-medium text-[#666666]">{{ props.course.instructor.name }}</span>
            </p>
            <div class="flex items-center gap-1">
              <StarIcon />
              <span>{{ props.course.avgRating ?? 0 }}</span>
            </div>
          </div>
          <span class="text-[20px] font-semibold text-[#141414]">{{ props.course.title }}</span>
          <div v-if="props.extended" class="flex flex-col">
            <div v-if="props.schedule?.days" class="flex w-full items-center gap-2">
              <CalendarIcon />
              <span class="text-[14px] text-[#666666]">{{ props.schedule.days }}</span>
            </div>
            <div v-if="props.schedule?.times" class="flex w-full items-center gap-2">
              <ClockIcon />
              <span class="text-[14px] text-[#666666]">{{ props.schedule.times }}</span>
            </div>
            <div v-if="props.schedule?.sessionType" class="flex w-full items-center gap-2">
              <UsersIcon />
              <span class="text-[14px] text-[#666666]">{{ props.schedule.sessionType }}</span>
            </div>
            <div v-if="props.schedule?.location" class="flex w-full items-center gap-2">
              <PointerIcon />
              <span class="text-[14px] text-[#666666]">{{ props.schedule.location }}</span>
            </div>
            <div
              v-if="props.course.basePrice"
              class="flex w-full items-center gap-2 text-[18px] font-normal text-[#141414]"
            >
              <span>Price: ${{ props.course.basePrice }}</span>
              <span v-if="props.schedule?.priceModifier !== '0.00'"> + ${{ props.schedule?.priceModifier }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-end justify-between gap-5">
        <ProgressBar :progress="props.progress" class="w-full pb-1" :class="!props.extended ? 'max-w-84' : ''" />
        <Button
          label="View"
          variant="outline"
          :class="props.extended ? 'h-12! min-w-29.25' : 'h-12! min-w-22.5'"
          @click="emit('openDetails')"
        />
      </div>
    </div>
  </Transition>
</template>
