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
import BoxIcon from "@/components/icons/BoxIcon.vue";
import { useRouter } from "vue-router";

const { fetchFeaturedCourses, fetchInProgressCourses } = useCoursesCrud();
const { featuredCourses, coursesInProgress, isAuthorized } = storeToRefs(useGlobalStore());
const router = useRouter();

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
    id: 4,
    course: {
      instructor: { name: "Sarah Johnson" },
      avgRating: 5,
      title: "Vue 3 Composition API"
    },
    progress: 75
  }
]);
const showLogIn = ref(false);
const showEnrolledCoursesSidebar = ref(false);

const limitedCourses = computed(() => {
  return coursesInProgress.value.slice(0, 4);
});

const handleOpenDetails = (course: Course) => {
  router.push(`/dashboard/course/${course.id}`);
};

onMounted(async () => {
  await fetchFeaturedCourses();
  await fetchInProgressCourses();
});
</script>
<template>
  <div class="flex min-h-screen flex-col gap-16 bg-[#F5F5F5] px-44.25 pt-43">
    <Slider :items="sliderItems" />

    <div v-if="isAuthorized && coursesInProgress?.length" class="flex flex-col gap-8">
      <div class="flex justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Continue Learning</span>
          <span class="text-[18px] font-medium text-[#3D3D3D]">Pick up where you left</span>
        </div>
        <Button
          label="See All"
          class="p-0! text-[20px] font-medium text-[#4F46E5] underline"
          @click="showEnrolledCoursesSidebar = true"
        />
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <div v-if="featuredCourses" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CourseCard
          v-for="course in featuredCourses"
          :key="course.id"
          v-bind="course"
          @open-details="handleOpenDetails(course)"
        />
      </div>
    </div>

    <div v-if="!isAuthorized" class="relative flex flex-col gap-8 pb-10">
      <div class="flex justify-between">
        <div class="flex flex-col gap-1.5">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Continue Learning</span>
          <span class="text-[18px] font-medium text-[#3D3D3D]">Pick up where you left</span>
        </div>
        <Button
          label="See All"
          class="p-0! text-[20px] font-medium text-[#4F46E5] underline"
          @click="showEnrolledCoursesSidebar = true"
        />
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
            <Button label="Log In" class="w-21 rounded-lg bg-[#4F46E5] text-[#FFFFFF]" @click="showLogIn = true" />
          </div>
        </div>
      </div>
      <AuthorizationModals v-model:showLogInModal="showLogIn" />
    </div>

    <div
      v-if="showEnrolledCoursesSidebar"
      class="fixed inset-0 z-50 bg-black/20"
      @click="showEnrolledCoursesSidebar = false"
    ></div>
    <div
      v-if="showEnrolledCoursesSidebar"
      class="fixed inset-y-0 right-0 z-100 w-198.5 max-w-198.5 overflow-y-auto border-l border-[#D1D1D1] bg-[#F5F5F5] shadow-xl"
    >
      <div class="flex h-21.5 items-end justify-between px-14.25">
        <span class="text-[40px] font-semibold text-[#0A0A0A]">Enrolled Courses</span>
        <p class="text-[16px] font-semibold text-[#0A0A0A]">
          Total Enrollments <span>{{ coursesInProgress?.length ?? 0 }}</span>
        </p>
      </div>
      <div class="px-21"></div>

      <div v-if="coursesInProgress" class="mt-9.25 flex flex-col items-center px-21">
        <CourseProgressCard
          v-for="enrollment in coursesInProgress"
          :key="enrollment.id"
          :title="enrollment.course.title"
          :instructor-name="enrollment.course.instructor.name"
          :avg-rating="enrollment.course.avgRating"
          :progress="enrollment.progress"
          :image="enrollment.course.image"
          :days="enrollment.schedule.weeklySchedule.label"
          :times="enrollment.schedule.timeSlot.label"
          :session-type="enrollment.schedule.sessionType.name"
          :location="enrollment.schedule.location"
          extended
        />
      </div>
      <div v-else class="flex h-full w-full items-center justify-center">
        <div class="flex flex-col items-center gap-1">
          <BoxIcon />
          <div class="flex flex-col items-center gap-3">
            <div class="flex flex-col gap-2 text-center">
              <div>
                <span class="text-2xl font-semibold text-[#130E67]">No Enrolled Courses Yet</span>
              </div>
              <div>
                <span class="text-medium text-[14px] text-[#130E67]"
                  >Your learning journey starts here! Browse courses to get started.</span
                >
              </div>
            </div>
            <Button
              label="Browse Courses"
              class="h-14.5 w-43.75 rounded-lg bg-[#4F46E5] px-6 py-4 text-[16px] font-medium text-[#F5F5F5]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
