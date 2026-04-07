<script setup lang="ts">
import Slider from "@/components/common/Slider.vue";
import type { Course, SliderItem } from "@/types/interfaces";
import { onMounted, ref } from "vue";
import Slide1 from "../assets/images/slide1.png";
import Slide2 from "../assets/images/slide2.png";
import Slide3 from "../assets/images/slide3.png";
import { useCoursesCrud } from "@/composables/useCoursesCrud";
import CourseCard from "@/components/common/CourseCard.vue";

const { fetchCourses, fetchFeaturedCourses } = useCoursesCrud();
const courses = ref<Course[]>([]);
const featuredCourses = ref<Course[]>([]);

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

onMounted(async () => {
  const result = await fetchFeaturedCourses();
  if (result?.success) {
    featuredCourses.value = result.courses;
  }
});
</script>
<template>
  <div class="flex flex-col gap-16 bg-[#F5F5F5]">
    <Slider :items="sliderItems" />

    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-1.5">
        <span class="text-[40px] font-semibold text-[#0A0A0A]">Start Learning Today</span>
        <span class="text-[#3D3D3D]">Choose from our most popular courses and begin your journey</span>
      </div>
      <div v-if="featuredCourses" class="flex gap-6">
        <CourseCard v-for="course in featuredCourses" :key="course.id" v-bind="course" />
      </div>
    </div>
  </div>
</template>
