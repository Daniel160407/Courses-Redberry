import { defineStore } from "pinia";
import { ref } from "vue";
import type { Course, Enrollment, User } from "../types/interfaces";
import Cookies from "js-cookie";

export const useGlobalStore = defineStore("globalStore", () => {
  const user = ref<User | null>(null);
  const courses = ref<Course[]>([]);
  const featuredCourses = ref<Course[]>([]);
  const coursesInProgress = ref<Enrollment[]>([]);

  const isAuthorized = ref(!!Cookies.get("token"));
  const isProfileComplete = ref(false);
  const showLoginModal = ref(false);

  const setUser = (userData: User | null) => {
    user.value = userData;
    isAuthorized.value = !!userData;
    isProfileComplete.value = userData?.profileComplete ?? false;
  };

  const setCourses = (newCourses: Course[]) => {
    courses.value = newCourses;
  };

  const setFeaturedCourses = (newFeaturedCourses: Course[]) => {
    featuredCourses.value = newFeaturedCourses;
  };

  const setCoursesInProgress = (newCoursesInProgress: Enrollment[]) => {
    coursesInProgress.value = newCoursesInProgress;
  };

  const setIsProfileComplete = (value: boolean) => {
    isProfileComplete.value = value;
  };

  const setShowLoginModal = (value: boolean) => {
    showLoginModal.value = value;
  };

  return {
    user,
    courses,
    featuredCourses,
    coursesInProgress,
    isAuthorized,
    isProfileComplete,
    showLoginModal,

    setUser,
    setCourses,
    setFeaturedCourses,
    setCoursesInProgress,
    setIsProfileComplete,
    setShowLoginModal
  };
});
