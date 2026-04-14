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

    const params = {
      ...(sort && { sort }),
      ...(page && { page: page.toString() }),
      ...(categoryIds.length > 0 && { "categories[]": categoryIds }),
      ...(topicIds.length > 0 && { "topics[]": topicIds }),
      ...(instructorIds.length > 0 && { "instructors[]": instructorIds })
    };

    try {
      await sendRequest({ method: "GET", url: "/courses", params });

      if (data.value?.data) {
        setCourses(data.value?.data);
        return { success: true, courses: data.value?.data, meta: data.value?.meta };
      }
    } catch (err) {
      console.error("Fetch Courses Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchCourseById = async (id: string) => {
    try {
      await sendRequest({ method: "GET", url: `/courses/${id}`, useToken: true });
      return { success: true, course: data.value?.data };
    } catch (err) {
      console.error("Fetch Course By Id Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchFeaturedCourses = async () => {
    try {
      await sendRequest({ method: "GET", url: "/courses/featured", useToken: true });

      if (data.value?.data) {
        setFeaturedCourses(data.value?.data);
        return { success: true, courses: data.value?.data };
      }
    } catch (err) {
      console.error("Fetch Featured Courses Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchInProgressCourses = async () => {
    try {
      await sendRequest({ method: "GET", url: "/courses/in-progress", useToken: true });

      if (data.value?.data) {
        setCoursesInProgress(data.value?.data);
        return { success: true, courses: data.value?.data };
      }
    } catch (err) {
      console.error("Fetch In Progress Courses Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const rateCourse = async (courseId: number, rating: number) => {
    if (!rating) return;

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
      console.error("Rate Course Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { fetchCourses, fetchCourseById, fetchFeaturedCourses, fetchInProgressCourses, rateCourse };
};
