import type { EnrollmentForm } from "@/types/interfaces";
import { useAxios } from "./useAxios";
import { useGlobalStore } from "@/stores/GlobalStore";

export const useEnrollmentsCrud = () => {
  const { sendRequest, data, error } = useAxios();
  const { setUserEnrollments } = useGlobalStore();

  const fetchUserEnrollments = async () => {
    try {
      await sendRequest({ method: "GET", url: "/enrollments", useToken: true });
      setUserEnrollments(data.value?.data);
      return { success: true, enrollments: data.value?.data };
    } catch (err) {
      console.error("Fetch User Enrollments Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const enrollCourse = async (formData: EnrollmentForm) => {
    try {
      await sendRequest({ method: "POST", url: "/enrollments", useToken: true, data: formData });
      return { success: true, enrollment: data.value?.data };
    } catch (err) {
      console.error("Enroll Course Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const completeEnrollment = async (enrollmentId: number) => {
    try {
      await sendRequest({ method: "PATCH", url: `/enrollments/${enrollmentId}/complete`, useToken: true });
      return { success: true, enrollment: data.value?.data };
    } catch (err) {
      console.error("Complete Enrollment Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  const deleteEnrollment = async (enrollmentId: number) => {
    try {
      await sendRequest({ method: "DELETE", url: `/enrollments/${enrollmentId}`, useToken: true });
      return { success: true };
    } catch (err) {
      console.error("Delete Enrollment Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  return {
    fetchUserEnrollments,
    enrollCourse,
    completeEnrollment,
    deleteEnrollment
  };
};
