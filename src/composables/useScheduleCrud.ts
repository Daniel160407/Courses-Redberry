import { useAxios } from "./useAxios";

export const useScheduleCrud = () => {
  const { sendRequest, data, error } = useAxios();

  const fetchCourseWeeklySchedules = async (courseId: number) => {
    if (!courseId) return;

    try {
      await sendRequest({ method: "GET", url: `/courses/${courseId}/weekly-schedules` });
      return { success: true, weeklySchedules: data.value?.data };
    } catch (err) {
      console.error("Fetch Weekly Schedules Error:", err);
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
      return { success: true, timeSlots: data.value?.data };
    } catch (err) {
      console.error("Fetch Time Slots Error:", err);
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
      return { success: true, sessionTypes: data.value?.data };
    } catch (err) {
      console.error("Fetch Session Types Error:", err);
      return { success: false, serverErrors: error.value };
    }
  };

  return { fetchCourseWeeklySchedules, fetchCourseTimeSlots, fetchCourseSessionTypes };
};
