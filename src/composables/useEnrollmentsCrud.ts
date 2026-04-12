import type { EnrollmentForm } from "@/types/interfaces";
import { useAxios } from "./useAxios";

export const useEnrollmentsCrud = () => {
  const { sendRequest, data, error } = useAxios();

  const fetchUserEnrollments = async () => {
    try {
      await sendRequest({
        method: "GET",
        url: "/enrollments",
        useToken: true
      });

      if (data.value?.data) {
        return { success: true, enrollments: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error };
    }
  };

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

  const completeEnrollment = async (enrollmentId: number) => {
    try {
      await sendRequest({
        method: "PATCH",
        url: `/enrollments/${enrollmentId}/complete`,
        useToken: true
      });

      if (data.value?.data) {
        return { success: true, enrollment: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error };
    }
  };

  const deleteEnrollment = async (enrollmentId: number) => {
    try {
      await sendRequest({
        method: "DELETE",
        url: `/enrollments/${enrollmentId}`,
        useToken: true
      });
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error };
    }
  };

  return {
    fetchUserEnrollments,
    enrollCourse,
    completeEnrollment,
    deleteEnrollment
  };
};
