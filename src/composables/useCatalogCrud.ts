import { useAxios } from "./useAxios";

export const useCatalogCrud = () => {
  const { sendRequest, data, error } = useAxios();

  const fetchFilters = async () => {
    return {
      categoriesResponse: await fetchCategories(),
      topicsResponse: await fetchTopics(),
      instructorsResponse: await fetchInstructors()
    };
  };

  const fetchCategories = async () => {
    try {
      await sendRequest({
        method: "GET",
        url: "/categories"
      });

      if (data.value?.data) {
        return { success: true, categories: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchTopics = async (categoryIds: number[] = []) => {
    const params: Record<string, number[]> = {};
    if (categoryIds.length > 0) {
      params["categories[]"] = categoryIds;
    }

    try {
      await sendRequest({
        method: "GET",
        url: "/topics",
        params
      });

      if (data.value?.data) {
        return { success: true, topics: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchInstructors = async () => {
    try {
      await sendRequest({
        method: "GET",
        url: "/instructors"
      });

      if (data.value?.data) {
        return { success: true, instructors: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  return {
    fetchFilters,
    fetchCategories,
    fetchTopics,
    fetchInstructors
  };
};
