<script setup lang="ts">
import Slider from "@/components/common/Slider.vue";
import type { Course, DummyCourse, SliderItem } from "@/types/interfaces";
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
import { useRouter } from "vue-router";
import { useAuthorize } from "@/composables/useAuthorize";
import { useEnrollmentsCrud } from "@/composables/useEnrollmentsCrud";

const { fetchFeaturedCourses, fetchInProgressCourses } = useCoursesCrud();
const { featuredCourses, coursesInProgress } = storeToRefs(useGlobalStore());
const { isAuthenticated } = useAuthorize();
const { fetchUserEnrollments } = useEnrollmentsCrud();
const router = useRouter();

const sliderItems = ref<SliderItem[]>([
  {
    title: "Start learning something new today",
    description:
      "Explore a wide range of expert-led courses in design, development, business, and more. Find the skills you need to grow your career and learn at your own pace.",
    buttonLabel: "Browse Courses",
    action: () => router.push("/catalog"),
    image: Slide1
  },
  {
    title: "Pick up where you left off",
    description:
      "Your learning journey is already in progress. Continue your enrolled courses, track your progress, and stay on track toward completing your goals.",
    buttonLabel: "Start Learning",
    action: () => router.push("/catalog"),
    image: Slide2
  },
  {
    title: "Learn together, grow faster",
    description: "",
    buttonLabel: "Learn More",
    action: () => router.push("/catalog"),
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
  }
]);
const showLogIn = ref(false);

const limitedCourses = computed(() => {
  return coursesInProgress.value.slice(0, 4);
});

const handleOpenDetails = (course: Course) => {
  router.push(`/dashboard/course/${course.id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(async () => {
  await Promise.all([fetchFeaturedCourses(), fetchInProgressCourses(), fetchUserEnrollments()]);
});
</script>
<template>
  <div
    class="flex min-h-screen flex-col items-center gap-16 bg-[#F5F5F5] pt-43"
    :class="[isAuthenticated && coursesInProgress.length ? 'pb-62' : '', !isAuthenticated ? 'pb-30' : '']"
  >
    <Slider :items="sliderItems" />

    <div v-if="isAuthenticated && coursesInProgress?.length" class="flex max-w-391.5 flex-col gap-8">
      <div class="flex justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Continue Learning</span>
          <span class="text-[18px] font-medium text-[#3D3D3D]">Pick up where you left</span>
        </div>
        <Button label="See All" variant="link" @click="router.push({ query: { enrolled: 'true' } })" />
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CourseProgressCard
          v-for="item in limitedCourses"
          :key="item.id"
          :title="item.course.title"
          :image="item.course.image"
          :instructor-name="item.course.instructor.name"
          :avg-rating="item.course.avgRating"
          :progress="item.progress"
          @open-details="handleOpenDetails(item.course)"
        />
      </div>
    </div>

    <div v-if="featuredCourses.length" class="flex flex-col gap-8">
      <div class="flex flex-col gap-1.5">
        <span class="text-[40px] font-semibold text-[#0A0A0A]">Start Learning Today</span>
        <span class="text-[#3D3D3D]">Choose from our most popular courses and begin your journey</span>
      </div>
      <div v-if="featuredCourses" class="grid grid-cols-3 gap-6">
        <CourseCard
          v-for="course in featuredCourses"
          :key="course.id"
          v-bind="course"
          @open-details="handleOpenDetails(course)"
        />
      </div>
    </div>

    <div v-if="!isAuthenticated" class="relative flex flex-col gap-8 pb-8.75">
      <div class="flex justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Continue Learning</span>
          <span class="text-[18px] font-medium text-[#3D3D3D]">Pick up where you left</span>
        </div>
        <Button label="See All" variant="link" @click="router.push({ query: { enrolled: 'true' } })" />
      </div>

      <div class="pointer-events-none grid grid-cols-1 gap-6 select-none md:grid-cols-2 lg:grid-cols-3">
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
            <Button label="Log In" variant="primary" @click="showLogIn = true" />
          </div>
        </div>
      </div>
      <AuthorizationModals v-model:showLogInModal="showLogIn" />
    </div>
  </div>
</template>
