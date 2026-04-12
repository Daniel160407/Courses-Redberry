import type { EnrollmentForm } from "@/types/interfaces";
import { useAxios } from "./useAxios";

export const useEnrollmentsCrud = () => {
  const { sendRequest, data, error } = useAxios();

  const enrollCourse = async (formData: EnrollmentForm) => {
    try {
      await sendRequest({
        method: "POST",
        url: "/enrollments",
        useToken: true,
        data: formData
      });

      if (data.value?.data) {
        return { success: true, enrollment: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error };
    }
  };

  return {
    enrollCourse
  };
};
