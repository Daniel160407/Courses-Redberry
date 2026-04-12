import { useGlobalStore } from "@/stores/GlobalStore";
import { useAxios } from "./useAxios";
import { storeToRefs } from "pinia";

export const useCoursesCrud = () => {
  const { sendRequest, data, error } = useAxios();
  const globalStore = useGlobalStore();
  const { featuredCourses, coursesInProgress } = storeToRefs(globalStore);
  const { setCourses, setFeaturedCourses, setCoursesInProgress } = globalStore;

  const fetchCourses = async (
    options: {
      sort?: string;
      page?: number;
      categoryIds?: number[];
      topicIds?: number[];
      instructorIds?: number[];
    } = {}
  ) => {
    const { sort, page = 0, categoryIds = [], topicIds = [], instructorIds = [] } = options;

    const filters = {
      "categories[]": categoryIds,
      "topics[]": topicIds,
      "instructors[]": instructorIds
    };

    const params: Record<string, string | number[]> = {};

    if (sort) params.sort = sort;
    if (page) params.page = page.toString();

    Object.entries(filters).forEach(([key, value]) => {
      if (value.length > 0) {
        params[key] = value;
      }
    });

    try {
      await sendRequest({
        method: "GET",
        url: "/courses",
        params
      });

      if (data.value?.data) {
        setCourses(data.value?.data);
        return { success: true, courses: data.value?.data, meta: data.value?.meta };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchCourseById = async (id: string) => {
    try {
      await sendRequest({
        method: "GET",
        url: `/courses/${id}`,
        useToken: true
      });

      if (data.value?.data) {
        return { success: true, course: data.value?.data };
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

  const fetchInProgressCourses = async () => {
    if (coursesInProgress.value.length > 0) return { success: true, courses: coursesInProgress.value };

    try {
      await sendRequest({
        method: "GET",
        url: "/courses/in-progress",
        useToken: true
      });

      if (data.value?.data) {
        setCoursesInProgress(data.value?.data);
        return { success: true, courses: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const rateCourse = async (courseId: number, rating: number) => {
    try {
      await sendRequest({
        method: "POST",
        url: `/courses/${courseId}/reviews`,
        useToken: true,
        params: {
          rating
        }
      });

      if (data.value?.data) {
        return { success: true, ratingData: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { fetchCourses, fetchCourseById, fetchFeaturedCourses, fetchInProgressCourses, rateCourse };
};
