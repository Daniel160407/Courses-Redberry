<script setup lang="ts">
import Slider from "@/components/common/Slider.vue";
import type { DummyCourse, SliderItem } from "@/types/interfaces";
import { computed, onMounted, ref } from "vue";
import Slide1 from "../assets/images/slide1.png";
import Slide2 from "../assets/images/slide2.png";
import Slide3 from "../assets/images/slide3.png";
import { useCoursesCrud } from "@/composables/useCoursesCrud";
import CourseCard from "@/components/common/CourseCard.vue";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/stores/GlobalStore";
import Button from "@/components/common/Button.vue";
import CourseProgressCard from "@/components/common/CourseProgressCard.vue";
import LockIcon from "@/components/icons/LockIcon.vue";
import AuthorizationModals from "@/components/common/AuthorizationModals.vue";

const { fetchFeaturedCourses, fetchInProgressCourses } = useCoursesCrud();
const { featuredCourses, coursesInProgress, isAuthorized } = storeToRefs(useGlobalStore());

const sliderItems = ref<SliderItem[]>([
  {
    title: "Start learning something new today",
    description:
      "Explore a wide range of expert-led courses in design, development, business, and more. Find the skills you need to grow your career and learn at your own pace.",
    buttonLabel: "Browse Courses",
    image: Slide1
  },
  {
    title: "Pick up where you left off",
    description:
      "Your learning journey is already in progress. Continue your enrolled courses, track your progress, and stay on track toward completing your goals.",
    buttonLabel: "Start Learning",
    image: Slide2
  },
  {
    title: "Learn together, grow faster",
    description: "",
    buttonLabel: "Learn More",
    image: Slide3
  }
]);
const dummyCourses = ref<DummyCourse[]>([
  {
    id: 1,
    course: {
      instructor: { name: "Sarah Johnson" },
      avgRating: 5,
      title: "React from Zero to Hero"
    },
    progress: 25
  },
  {
    id: 2,
    course: {
      instructor: { name: "Sarah Johnson" },
      avgRating: 5,
      title: "Advanced TypeScript Patterns"
    },
    progress: 50
  },
  {
    id: 3,
    course: {
      instructor: { name: "Sarah Johnson" },
      avgRating: 5,
      title: "Vue 3 Composition API"
    },
    progress: 75
  },
  {
    id: 3,
    course: {
      instructor: { name: "Sarah Johnson" },
      avgRating: 5,
      title: "Vue 3 Composition API"
    },
    progress: 75
  }
]);
const showLogIn = ref(false);

const limitedCourses = computed(() => {
  return coursesInProgress.value.slice(0, 4);
});

onMounted(async () => {
  await fetchFeaturedCourses();
  await fetchInProgressCourses();
});
</script>
<template>
  <div class="flex flex-col gap-16 bg-[#F5F5F5]">
    <Slider :items="sliderItems" />

    <div v-if="isAuthorized && coursesInProgress" class="flex flex-col gap-8">
      <div class="flex justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Continue Learning</span>
          <span class="text-[18px] font-medium text-[#3D3D3D]">Pick up where you left</span>
        </div>
        <Button label="See all" class="p-0! text-[20px] font-medium text-[#4F46E5] underline" />
      </div>

      <div class="flex justify-between">
        <CourseProgressCard
          v-for="item in limitedCourses"
          :key="item.id"
          :title="item.course.title"
          :instructor-name="item.course.instructor.name"
          :avg-rating="item.course.avgRating"
          :progress="item.progress"
        />
      </div>
    </div>

    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-1.5">
        <span class="text-[40px] font-semibold text-[#0A0A0A]">Start Learning Today</span>
        <span class="text-[#3D3D3D]">Choose from our most popular courses and begin your journey</span>
      </div>
      <div v-if="featuredCourses" class="flex gap-6">
        <CourseCard v-for="course in featuredCourses" :key="course.id" v-bind="course" />
      </div>
    </div>

    <div v-if="!isAuthorized" class="relative flex flex-col gap-8 pb-10">
      <div class="flex justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Continue Learning</span>
          <span class="text-[18px] font-medium text-[#3D3D3D]">Pick up where you left</span>
        </div>
        <Button label="See all" class="p-0! text-[20px] font-medium text-[#4F46E5] underline" />
      </div>

      <div class="pointer-events-none grid grid-cols-1 gap-4 select-none md:grid-cols-2 lg:grid-cols-4">
        <CourseProgressCard
          v-for="item in dummyCourses"
          :key="item.id"
          :title="item.course.title"
          :instructor-name="item.course.instructor.name"
          :avg-rating="item.course.avgRating"
          :progress="item.progress"
          blured
        />
      </div>

      <div class="absolute inset-0 z-10 flex items-center justify-center pt-24">
        <div
          class="flex w-104.5 flex-col gap-2.5 rounded-xl border border-[#ADADAD] bg-[#FFFFFF] px-14 py-8 shadow-2xl"
        >
          <div class="flex flex-col items-center gap-6">
            <div class="flex flex-col items-center gap-3 text-center">
              <div class="w-18.5 rounded-full bg-[#DDDBFA] p-5">
                <LockIcon />
              </div>
              <span class="text-[16px] font-medium text-[#0A0A0A]">Sign in to track your learning progress</span>
            </div>
            <Button label="Log In" class="w-21 rounded-lg bg-[#4F46E5] text-[#FFFFFF]" @click="showLogIn = true" />
          </div>
        </div>
      </div>
      <AuthorizationModals v-model:showLogInModal="showLogIn" />
    </div>
  </div>
</template>
