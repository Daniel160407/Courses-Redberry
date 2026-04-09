import { useAxios } from "./useAxios";

export const useScheduleCrud = () => {
  const { sendRequest, data, error } = useAxios();

  const fetchCourseWeeklySchedules = async (courseId: number) => {
    if (!courseId) return;

    try {
      await sendRequest({
        method: "GET",
        url: `/courses/${courseId}/weekly-schedules`
      });

      if (data.value?.data) {
        return { success: true, weeklySchedules: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchCourseTimeSlots = async (courseId: number, weeklyScheduleId: number) => {
    if (!courseId) return;

    try {
      await sendRequest({
        method: "GET",
        url: `/courses/${courseId}/time-slots`,
        params: {
          weekly_schedule_id: weeklyScheduleId
        }
      });

      if (data.value?.data) {
        return { success: true, timeSlots: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  const fetchCourseSessionTypes = async (courseId: number, weeklyScheduleId: number, timeSlotId: number) => {
    if (!courseId) return;

    try {
      await sendRequest({
        method: "GET",
        url: `/courses/${courseId}/session-types`,
        params: {
          weekly_schedule_id: weeklyScheduleId,
          time_slot_id: timeSlotId
        }
      });

      if (data.value?.data) {
        return { success: true, sessionTypes: data.value?.data };
      }
    } catch (err) {
      console.error(err);
      return { success: false, serverErrors: error.value };
    }
  };

  return {
    fetchCourseWeeklySchedules,
    fetchCourseTimeSlots,
    fetchCourseSessionTypes
  };
};
