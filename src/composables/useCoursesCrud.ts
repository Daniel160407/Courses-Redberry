import { useGlobalStore } from "@/stores/GlobalStore";
import { useAxios } from "./useAxios";
import { storeToRefs } from "pinia";

export const useCoursesCrud = () => {
  const { sendRequest, data, error } = useAxios();
  const globalStore = useGlobalStore();
  const { courses, featuredCourses } = storeToRefs(globalStore);
  const { setCourses, setFeaturedCourses } = globalStore;

  const fetchCourses = async () => {
    if (courses.value.length > 0) return { success: true, courses: courses.value };

    try {
      await sendRequest({
        method: "GET",
        url: "/courses",
        useToken: true
      });

      if (data.value?.data) {
        setCourses(data.value?.data);
        return { success: true, courses: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchFeaturedCourses = async () => {
    if (featuredCourses.value.length > 0) return { success: true, courses: featuredCourses.value };

    try {
      await sendRequest({
        method: "GET",
        url: "/courses/featured",
        useToken: true
      });

      if (data.value?.data) {
        setFeaturedCourses(data.value?.data);
        return { success: true, courses: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { fetchCourses, fetchFeaturedCourses };
};
