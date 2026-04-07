import { defineStore } from "pinia";
import { ref } from "vue";
import type { Course, User } from "../types/interfaces";

export const useGlobalStore = defineStore("globalStore", () => {
  const user = ref<User | null>(null);
  const courses = ref<Course[]>([]);
  const featuredCourses = ref<Course[]>([]);

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const setCourses = (newCourses: Course[]) => {
    courses.value = newCourses;
  };

  const setFeaturedCourses = (newFeaturedCourses: Course[]) => {
    featuredCourses.value = newFeaturedCourses;
  };

  return {
    user,
    courses,
    featuredCourses,

    setUser,
    setCourses,
    setFeaturedCourses
  };
});
