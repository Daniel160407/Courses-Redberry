import { useAxios } from "./useAxios";

export const useCatalogCrud = () => {
  const { sendRequest, data, error } = useAxios();

  const fetchFilters = async () => {
    const [categoriesResponse, topicsResponse, instructorsResponse] = await Promise.all([
      fetchCategories(),
      fetchTopics(),
      fetchInstructors()
    ]);

    return {
      categoriesResponse,
      topicsResponse,
      instructorsResponse
    };
  };

  const fetchCategories = async () => {
    try {
      await sendRequest({ method: "GET", url: "/categories" });
      return { success: true, categories: data.value?.data };
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchTopics = async (categoryIds: number[] = []) => {
    const params = categoryIds.length > 0 ? { "categories[]": categoryIds } : {};

    try {
      await sendRequest({ method: "GET", url: "/topics", params });
      return { success: true, topics: data.value?.data };
    } catch (err) {
      console.error("Fetch Topics Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchInstructors = async () => {
    try {
      await sendRequest({ method: "GET", url: "/instructors" });
      return { success: true, instructors: data.value?.data };
    } catch (err) {
      console.error("Fetch Instructors Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { fetchFilters, fetchCategories, fetchTopics, fetchInstructors };
};
