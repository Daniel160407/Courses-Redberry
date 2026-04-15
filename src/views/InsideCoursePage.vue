<script setup lang="ts">
import Accordion from "@/components/common/Accordion.vue";
import AccordionPanel from "@/components/common/AccordionPanel.vue";
import AccordionHeader from "@/components/common/AccordionHeader.vue";
import AccordionContent from "@/components/common/AccordionContent.vue";
import SelectButton from "@/components/common/SelectButton.vue";
import AngleRightIcon from "@/components/icons/AngleRightIcon.vue";
import CalendarIcon from "@/components/icons/CalendarIcon.vue";
import ClockIcon from "@/components/icons/ClockIcon.vue";
import StarIcon from "@/components/icons/StarIcon.vue";
import {
  CATALOG_PAGE_NAME,
  CATALOG_ROUTE,
  DASHBOARD_ROUTE,
  TIME_SLOT_CONFIG,
  WEEKLY_SCHEDULE_CONFIG
} from "@/constants/constants";
import { useCoursesCrud } from "@/composables/useCoursesCrud";
import type {
  WeeklySchedule,
  ExtendedCourse,
  TimeSlot,
  SessionType,
  EnrollmentForm,
  EnrollmentConflict,
  Enrollment
} from "@/types/interfaces";
import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScheduleCrud } from "@/composables/useScheduleCrud";
import StepOneIcon from "@/components/icons/StepOneIcon.vue";
import StepTwoIcon from "@/components/icons/StepTwoIcon.vue";
import StepThreeIcon from "@/components/icons/StepThreeIcon.vue";
import WarningIcon from "@/components/icons/WarningIcon.vue";
import Button from "@/components/common/Button.vue";
import ActionBanner from "@/components/common/ActionBanner.vue";
import AuthorizationModals from "@/components/common/AuthorizationModals.vue";
import { useAuthorize } from "@/composables/useAuthorize";
import { useEnrollmentsCrud } from "@/composables/useEnrollmentsCrud";
import Modal from "@/components/common/Modal.vue";
import ConfirmationIcon from "@/components/icons/ConfirmationIcon.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import MonitorIcon from "@/components/icons/MonitorIcon.vue";
import PointerIcon from "@/components/icons/PointerIcon.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RefreshIcon from "@/components/icons/RefreshIcon.vue";
import MarkIcon from "@/components/icons/MarkIcon.vue";
import ConfettiIcon from "@/components/icons/ConfettiIcon.vue";
import StarRating from "@/components/common/StarRating.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import { CATEGORY_ICONS, SESSION_TYPE_ICONS, TIME_SLOT_ICONS } from "@/constants/iconMappings";
import StepOneFilledIcon from "@/components/icons/StepOneFilledIcon.vue";
import StepTwoFilledIcon from "@/components/icons/StepTwoFilledIcon.vue";
import StepThreeFilledIcon from "@/components/icons/StepThreeFilledIcon.vue";

const { isAuthenticated, isProfileComplete } = useAuthorize();
const { fetchCourseById, rateCourse } = useCoursesCrud();
const { fetchCourseWeeklySchedules, fetchCourseTimeSlots, fetchCourseSessionTypes } = useScheduleCrud();
const { fetchUserEnrollments, enrollCourse, completeEnrollment, deleteEnrollment } = useEnrollmentsCrud();
const router = useRouter();
const route = useRoute();

const course = ref<ExtendedCourse | null>(null);
const activeTab = ref<(string | number)[]>(["0"]);
const isLoading = ref(true);
const weeklySchedules = ref<WeeklySchedule[]>([]);
const timeSlots = ref<TimeSlot[]>([]);
const sessionTypes = ref<SessionType[]>([]);
const selectedWeeklySchedule = ref<WeeklySchedule | (typeof WEEKLY_SCHEDULE_CONFIG)[number] | null>(null);
const selectedTimeSlot = ref<TimeSlot | (typeof TIME_SLOT_CONFIG)[number] | null>(null);
const selectedSessionType = ref<SessionType | null>(null);
const userCourseEnrollment = ref<Enrollment | null>(null);

const enrollmentConflicts = ref<EnrollmentConflict[]>([]);
const isSubmitting = ref(false);
const isRatingSubmitting = ref(false);
const errorMessage = ref<string>("");
const modalRating = ref<number>(0);
const bannerRating = ref<number>(0);

const showLogInModal = ref(false);
const showProfileModal = ref(false);
const showEnrollmentConfirmationModal = ref(false);
const showEnrollmentConflictModal = ref(false);
const showAlreadyEnrolledModal = ref(false);
const showProfileIncompleteModal = ref(false);
const showEnrollmentCompletionModal = ref(false);
const showNoAvailableSeatsModal = ref(false);
const isRatingDismissed = ref(false);

const showRatingBox = computed(
  () =>
    !!userCourseEnrollment.value?.completedAt &&
    !isRatingDismissed.value &&
    !course.value?.isRated &&
    !isSubmitting.value
);

const parentPage = computed(() => route.path.split("/")[1]);

const courseId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id;
});

const courseAvgRating = computed(() => {
  if (!course.value?.reviews?.length) return 0;
  const total = course.value.reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = total / course.value.reviews.length;
  return Math.floor(avg * 10) / 10;
});

const formattedSessionTypes = computed(() => {
  return sessionTypes.value.map((st) => ({
    ...st,
    displayName: st.name.charAt(0).toUpperCase() + st.name.slice(1),
    displayLocation: st.name === "online" ? "Google Meet" : st.location,
    displayPrice: st.name === "online" ? "Included" : `+ $${st.priceModifier}`,
    isLowSeats: st.availableSeats <= 5 && st.availableSeats > 0,
    isFull: st.availableSeats === 0
  }));
});

const totalPrice = computed(() => {
  const base = Number(course.value?.basePrice) || 0;
  const modifier = Number(selectedSessionType.value?.priceModifier) || 0;
  return base + modifier;
});

const refreshEnrollmentStatus = async () => {
  if (!course.value) return;
  const res = await fetchUserEnrollments();
  if (res?.success) {
    userCourseEnrollment.value = res.enrollments.find((e: Enrollment) => e.course.id === course.value?.id) || null;
  }
};

const handleEnrollment = (force = false) => {
  if (!isAuthenticated.value) {
    showLogInModal.value = true;
    return;
  }

  if (!isProfileComplete.value) {
    showProfileIncompleteModal.value = true;
    return;
  }

  if (!selectedSessionType.value?.availableSeats) {
    showNoAvailableSeatsModal.value = true;
    return;
  }

  const cId = course.value?.id;
  const sId = selectedSessionType.value?.courseScheduleId;
  if (cId && sId) handleClickEnroll(cId, sId, force);
};

const isScheduleAvailable = (id: number) => weeklySchedules.value.some((ws) => ws.id === id);
const isTimeSlotAvailable = (id: number) => timeSlots.value.some((ts) => ts.id === id);

const handleSelectWeeklySchedule = (
  isSelected: boolean,
  weeklySchedule: WeeklySchedule | (typeof WEEKLY_SCHEDULE_CONFIG)[number]
) => {
  selectedWeeklySchedule.value = isSelected ? weeklySchedule : null;
  selectedTimeSlot.value = null;
  selectedSessionType.value = null;

  if (isSelected) {
    activeTab.value.push("1");
  }
};

const handleSelectTimeSlot = (isSelected: boolean, timeSlot: TimeSlot | (typeof TIME_SLOT_CONFIG)[number]) => {
  selectedTimeSlot.value = isSelected ? timeSlot : null;
  selectedSessionType.value = null;

  if (isSelected) {
    activeTab.value.push("2");
  }
};

const handleClickEnroll = async (courseId: number, courseScheduleId: number, force: boolean = false) => {
  enrollmentConflicts.value = [];
  showEnrollmentConflictModal.value = false;

  isSubmitting.value = true;
  try {
    const formData: EnrollmentForm = {
      courseId,
      courseScheduleId,
      force
    };

    const response = await enrollCourse(formData);

    if (response?.success) {
      showEnrollmentConfirmationModal.value = true;
      await refreshEnrollmentStatus();
    } else {
      const errorData = response?.serverErrors;
      if (errorData && typeof errorData === "object" && "conflicts" in errorData) {
        const conflicts = (errorData as { conflicts: EnrollmentConflict | EnrollmentConflict[] }).conflicts;
        enrollmentConflicts.value = Array.isArray(conflicts) ? conflicts : [conflicts];
        showEnrollmentConflictModal.value = true;
      } else if (errorData && typeof errorData === "object") {
        errorMessage.value = (errorData as any).message || "An error occurred";
        showAlreadyEnrolledModal.value = true;
      }
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleOpenProfileModal = () => {
  showProfileModal.value = !showProfileModal.value;
  showProfileIncompleteModal.value = false;
};

const handleCompleteEnrollment = async (enrollmentId: number) => {
  if (!enrollmentId) return;

  isSubmitting.value = true;
  try {
    const response = await completeEnrollment(enrollmentId);
    if (response?.success) {
      await refreshEnrollmentStatus();

      const courseResponse = await fetchCourseById(courseId.value);
      if (courseResponse?.success) {
        course.value = courseResponse.course;
      }

      showEnrollmentCompletionModal.value = true;
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleRetakeCourse = async () => {
  isSubmitting.value = true;
  try {
    const response = await deleteEnrollment(userCourseEnrollment.value?.id ?? 0);
    if (response?.success) {
      userCourseEnrollment.value = null;
      activeTab.value = ["0"];

      selectedWeeklySchedule.value = null;
      selectedTimeSlot.value = null;
      selectedSessionType.value = null;

      await nextTick();
      selectedWeeklySchedule.value = weeklySchedules.value[0] || null;
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleRateCourse = async (ratingVal?: any) => {
  if (isRatingSubmitting.value) return;

  const finalRating =
    typeof ratingVal === "number"
      ? ratingVal
      : showEnrollmentCompletionModal.value
        ? modalRating.value
        : bannerRating.value;

  if (finalRating === 0) {
    showEnrollmentCompletionModal.value = false;
    return;
  }

  isRatingSubmitting.value = true;
  try {
    await rateCourse(course.value?.id ?? 0, finalRating);
    if (course.value) {
      course.value.isRated = true;
    }
    modalRating.value = 0;
    bannerRating.value = 0;
    showEnrollmentCompletionModal.value = false;
    isRatingDismissed.value = true;
  } finally {
    isRatingSubmitting.value = false;
  }
};

watch(
  () => userCourseEnrollment.value?.id,
  () => {
    isRatingDismissed.value = false;
  }
);

watch([isAuthenticated, isProfileComplete], async (authorized, profileComplete) => {
  if (authorized && profileComplete) {
    await refreshEnrollmentStatus();
  } else {
    userCourseEnrollment.value = null;
  }
});

watch(selectedWeeklySchedule, async (newVal) => {
  if (!newVal || !course.value) return;

  const res = await fetchCourseTimeSlots(course.value.id, newVal.id);
  if (res?.success) {
    timeSlots.value = res.timeSlots;
    selectedTimeSlot.value = timeSlots.value[0] || null;
  }
});

watch(selectedTimeSlot, async (newVal) => {
  if (!newVal || !course.value || !selectedWeeklySchedule.value) return;

  const res = await fetchCourseSessionTypes(course.value.id, selectedWeeklySchedule.value.id, newVal.id);
  if (res?.success) {
    sessionTypes.value = res.sessionTypes;
    if (sessionTypes.value[0].availableSeats) selectedSessionType.value = sessionTypes.value[0] || null;
  }
});

watch(
  courseId,
  async (newId) => {
    if (!newId) return;

    isLoading.value = true;
    course.value = null;
    userCourseEnrollment.value = null;
    selectedWeeklySchedule.value = null;
    selectedTimeSlot.value = null;
    selectedSessionType.value = null;
    activeTab.value = ["0"];
    isRatingDismissed.value = false;

    try {
      const courseResponse = await fetchCourseById(newId);
      if (courseResponse?.success) {
        course.value = courseResponse.course;
        const cId = courseResponse.course.id;

        const weeklyRes = await fetchCourseWeeklySchedules(cId);
        if (weeklyRes?.success) {
          weeklySchedules.value = weeklyRes.weeklySchedules;
          selectedWeeklySchedule.value = weeklySchedules.value[0] || null;
        }
        await refreshEnrollmentStatus();
      }
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="flex min-h-screen justify-center bg-[#F5F5F5] pt-43 pb-40">
    <div class="flex min-w-391.5 flex-col gap-6">
      <div>
        <div class="mb-12 flex items-center gap-0.5">
          <div class="flex items-center gap-1 px-1 py-0.5">
            <span
              class="cursor-pointer text-[18px] font-medium text-[#666666] hover:underline"
              @click="router.push(DASHBOARD_ROUTE)"
              >Home</span
            >
            <AngleRightIcon />
          </div>
          <div v-if="parentPage === CATALOG_PAGE_NAME" class="flex items-center gap-1 px-1 py-0.5">
            <span
              class="cursor-pointer text-[18px] font-medium text-[#666666] hover:underline"
              @click="router.push(CATALOG_ROUTE)"
              >Browse</span
            >
            <AngleRightIcon />
          </div>
          <div>
            <span class="text-[18px] font-medium text-[#4F46E5]">{{ course?.category.name }}</span>
          </div>
        </div>
        <h1 class="text-[40px] font-semibold text-[#141414]">{{ course?.title }}</h1>
      </div>

      <div class="flex items-start gap-33.25">
        <div class="flex w-225.75 min-w-225.75 flex-col gap-4.5">
          <div class="flex flex-col gap-4">
            <img :src="course?.image" class="h-118.5 w-225.75 rounded-[10px] object-cover" />
            <div class="flex gap-4">
              <div class="flex w-full items-center justify-between">
                <div class="flex gap-3">
                  <div class="flex items-center gap-1">
                    <CalendarIcon />
                    <p>
                      <span>{{ course?.durationWeeks }}</span> Weeks
                    </p>
                  </div>
                  <div class="flex items-center gap-1">
                    <ClockIcon />
                    <p>
                      <span>{{ course?.hours }}</span> Hours
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <StarIcon />
                  <span>{{ courseAvgRating }}</span>
                </div>
              </div>
              <SelectButton
                :label="course?.category.name"
                :icon="CATEGORY_ICONS[course?.category.icon ?? 'development']"
                variant="text"
                class="whitespace-nowrap"
              />
            </div>
          </div>
          <div class="flex flex-col gap-4.5">
            <SelectButton :label="course?.instructor.name" :image="course?.instructor.avatar" variant="text" />
            <div class="flex flex-col gap-4.5">
              <span class="text-[20px] font-semibold text-[#8A8A8A]">Course Description</span>
              <p class="text-[16px] font-medium text-[#525252]">{{ course?.description }}</p>
            </div>
          </div>
        </div>

        <div v-if="!userCourseEnrollment && !isLoading" class="flex max-w-132.5 flex-1 flex-col gap-3">
          <Accordion v-model:value="activeTab">
            <AccordionPanel value="0">
              <AccordionHeader
                :icon="StepOneIcon"
                :secondary-icon="StepOneFilledIcon"
                :is-selected="!!selectedWeeklySchedule"
                >Weekly Schedule</AccordionHeader
              >
              <AccordionContent>
                <div class="grid grid-cols-4 gap-3">
                  <SelectButton
                    v-for="weeklySchedule in WEEKLY_SCHEDULE_CONFIG"
                    :key="weeklySchedule.id"
                    :label="weeklySchedule.shortLabel"
                    :is-selected="selectedWeeklySchedule?.id === weeklySchedule.id"
                    :disabled="!isScheduleAvailable(weeklySchedule.id)"
                    variant="schedule"
                    @click="(isSelected) => handleSelectWeeklySchedule(isSelected, weeklySchedule)"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel value="1">
              <AccordionHeader :icon="StepTwoIcon" :secondary-icon="StepTwoFilledIcon" :is-selected="!!selectedTimeSlot"
                >Time Slot</AccordionHeader
              >
              <AccordionContent>
                <div class="grid grid-cols-3 gap-1.5">
                  <SelectButton
                    v-for="timeSlot in TIME_SLOT_CONFIG"
                    :key="timeSlot.id"
                    :is-selected="selectedTimeSlot?.id === timeSlot.id"
                    :disabled="!isTimeSlotAvailable(timeSlot.id)"
                    variant="time-slot"
                    @click="(isSelected) => handleSelectTimeSlot(isSelected, timeSlot)"
                  >
                    <div class="flex items-center gap-3">
                      <component :is="TIME_SLOT_ICONS[timeSlot.id]" v-if="TIME_SLOT_ICONS[timeSlot.id]" />
                      <div class="flex flex-col gap-0.5">
                        <span class="text-[14px] font-medium">{{ timeSlot.label }}</span>
                        <span class="text-[10px]">{{ timeSlot.startTime }} - {{ timeSlot.endTime }}</span>
                      </div>
                    </div>
                  </SelectButton>
                </div>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel value="2">
              <AccordionHeader
                :icon="StepThreeIcon"
                :secondary-icon="StepThreeFilledIcon"
                :is-selected="!!selectedSessionType"
                >Session Type</AccordionHeader
              >
              <AccordionContent>
                <div class="grid grid-cols-3 gap-2">
                  <div
                    v-for="sessionType in formattedSessionTypes"
                    :key="sessionType.id"
                    class="flex min-h-38.75 min-w-42.75 flex-col items-center gap-2"
                  >
                    <SelectButton
                      :is-selected="selectedSessionType?.id === sessionType.id"
                      :disabled="sessionType.isFull"
                      variant="session-type"
                      @click="(isSelected) => (selectedSessionType = isSelected ? sessionType : null)"
                    >
                      <div class="flex w-full flex-col items-center justify-center gap-2.5 text-inherit">
                        <component
                          :is="SESSION_TYPE_ICONS[sessionType.id]"
                          v-if="SESSION_TYPE_ICONS[sessionType.id]"
                          class="h-6.5 w-6.5"
                        />
                        <div class="flex flex-col items-center gap-1.5">
                          <span class="text-[16px] font-semibold">{{ sessionType.displayName }}</span>
                          <div class="flex items-center gap-0.5">
                            <PointerIcon />
                            <span class="text-[12px]">{{ sessionType.displayLocation }}</span>
                          </div>
                        </div>
                        <span class="text-[14px]" :class="sessionType.isFull ? 'text-[#CCCCCC]' : 'text-[#736BEA]'">
                          {{ sessionType.displayPrice }}
                        </span>
                      </div>
                    </SelectButton>
                    <div>
                      <p v-if="!sessionType.isLowSeats" class="text-[12px] font-medium text-[#3D3D3D]">
                        <span>{{ sessionType.availableSeats }}</span>
                        Seats Available
                      </p>
                      <div v-else class="flex items-center gap-1">
                        <WarningIcon class="h-4 w-4" />
                        <p class="text-[12px] font-medium text-[#F4A316]">
                          Only <span>{{ sessionType.availableSeats }} Seats Remaining</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <div class="rounded-xl border border-[#F5F5F5] bg-[#FFFFFF] p-10">
            <div class="flex flex-col gap-8">
              <div class="flex flex-col gap-8">
                <div class="flex items-center justify-between">
                  <p class="text-[20px] font-semibold text-[#8A8A8A]">Total Price</p>
                  <span class="text-[32px] font-semibold text-[#333333]">${{ totalPrice }}</span>
                </div>
                <div class="flex flex-col gap-3 pr-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[16px] font-medium text-[#8A8A8A]">Base Price</span>
                    <span class="text-[16px] font-medium text-[#292929]">+ ${{ course?.basePrice || "0.00" }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[16px] font-medium text-[#8A8A8A]">Session Type</span>
                    <span class="text-[16px] font-medium text-[#292929]">
                      {{
                        selectedSessionType?.name === "online"
                          ? "Included"
                          : `+ $${selectedSessionType?.priceModifier || "0.00"}`
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                label="Enroll Now"
                :loading="isSubmitting"
                :variant="isAuthenticated && isProfileComplete ? 'enroll-auth' : 'enroll-unauth'"
                @click="handleEnrollment(false)"
              />
            </div>
          </div>

          <ActionBanner
            v-if="!isAuthenticated"
            title="Authentication Required"
            description="You need sign in to your profile before enrolling in this course."
            button-label="Sign In"
            @action="showLogInModal = !showLogInModal"
          />
          <ActionBanner
            v-else-if="!isProfileComplete"
            title="Complete Your Profile"
            description="You need to fill in your profile details before enrolling in this course."
            button-label="Complete"
            @action="showProfileModal = !showProfileModal"
          />
        </div>
        <div v-else-if="!isLoading" class="flex min-w-118.25 flex-col gap-12">
          <div class="flex flex-col gap-5.5">
            <div
              v-if="userCourseEnrollment?.completedAt"
              class="w-fit rounded-[100px] bg-[#1DC31D1A] p-4 text-[20px] font-semibold text-[#1DC31D]"
            >
              Completed
            </div>
            <div v-else class="w-fit rounded-[100px] bg-[#736BEA1A] p-4 text-[20px] font-semibold text-[#736BEA]">
              Enrolled
            </div>
            <div class="flex items-center gap-3">
              <CalendarIcon class="h-6 w-6" />
              <span>{{ userCourseEnrollment?.schedule.weeklySchedule.label }}</span>
            </div>
            <div class="flex items-center gap-3">
              <ClockIcon class="h-6 w-6" />
              <span>{{ userCourseEnrollment?.schedule.timeSlot.label }}</span>
            </div>
            <div class="flex items-center gap-3">
              <MonitorIcon class="h-6 w-6" />
              <span>{{ userCourseEnrollment?.schedule.sessionType.name }}</span>
            </div>
            <div class="flex items-center gap-3">
              <PointerIcon class="h-6 w-6" />
              <span>{{ userCourseEnrollment?.schedule.sessionType.location ?? "Google Meet" }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-10">
            <ProgressBar :progress="userCourseEnrollment?.progress ?? 0" size="medium" />
            <Button
              v-if="userCourseEnrollment?.completedAt"
              label="Retake Course"
              :loading="isSubmitting"
              :icon="RefreshIcon"
              icon-pos="right"
              variant="action"
              @click="handleRetakeCourse"
            />
            <Button
              v-else
              label="Complete Course"
              :loading="isSubmitting"
              :icon="MarkIcon"
              icon-pos="right"
              variant="action"
              @click="handleCompleteEnrollment(userCourseEnrollment?.id ?? 0)"
            />

            <Modal
              :visible="showEnrollmentCompletionModal"
              :icon="ConfettiIcon"
              title="Congratulations!"
              @continue="handleRateCourse"
            >
              <div>
                <p class="text-[20px] font-medium text-[#3D3D3D]">
                  You`ve completed "<span class="font-semibold">{{ userCourseEnrollment?.course.title }}</span
                  >" Course!
                </p>
              </div>
              <StarRating
                v-if="showRatingBox"
                v-model="modalRating"
                :disabled="isRatingSubmitting"
                @submit="handleRateCourse"
              />
            </Modal>
          </div>

          <div v-if="showRatingBox" class="rounded-lg bg-[#FFFFFF]">
            <div class="flex w-full justify-end p-2.5">
              <Button :icon="CloseIcon" variant="icon" @click="isRatingDismissed = true" />
            </div>
            <div class="relative -top-1 px-12.5 pb-10">
              <StarRating v-model="bannerRating" :disabled="isRatingSubmitting" @submit="handleRateCourse" />
            </div>
          </div>

          <div v-if="userCourseEnrollment && !isLoading && userCourseEnrollment.completedAt && course?.isRated">
            <ActionBanner title="You've already rated this course" />
          </div>
        </div>
      </div>

      <Modal
        :visible="showEnrollmentConfirmationModal"
        :icon="ConfirmationIcon"
        title="Enrollment Confirmed!"
        @continue="showEnrollmentConfirmationModal = false"
      >
        <p class="text-[20px] font-medium text-[#3D3D3D]">
          You`ve successfully enrolled to the "<span class="font-semibold">{{ course?.title }}</span
          >" Course!
        </p>
      </Modal>

      <Modal
        :visible="showEnrollmentConflictModal"
        :icon="WarningIcon"
        title="Enrollment Conflict"
        button-label="Continue Anyway"
        @continue="handleEnrollment(true)"
        @cancel="showEnrollmentConflictModal = false"
      >
        <div class="text-[20px] font-medium text-[#3D3D3D]">
          <p>
            You are already enrolled in "<span
              v-for="(conflict, index) in enrollmentConflicts"
              :key="conflict.conflictingEnrollmentId"
              class="font-semibold"
              >{{ conflict.conflictingCourseName }}{{ index < enrollmentConflicts.length - 1 ? ", " : "" }}</span
            >" with the same schedule:
            <span v-for="(conflict, index) in enrollmentConflicts" :key="conflict.conflictingEnrollmentId"
              >{{ conflict.schedule }}{{ index < enrollmentConflicts.length - 1 ? ", " : "" }}</span
            >
          </p>
          <span>Are you sure you want to continue?</span>
        </div>
      </Modal>

      <Modal
        :visible="showAlreadyEnrolledModal"
        :icon="WarningIcon"
        title="Enrollment Denyed!"
        :content="errorMessage"
        @continue="showAlreadyEnrolledModal = false"
      />

      <Modal
        :visible="showProfileIncompleteModal"
        :icon="UserIcon"
        title="Complete your profile to continue"
        content="You need to complete your profile before enrolling in this course."
        button-label="Complete Profile"
        @continue="handleOpenProfileModal"
        @cancel="showProfileIncompleteModal = false"
      />

      <Modal
        :visible="showNoAvailableSeatsModal"
        :icon="WarningIcon"
        title="No Seats Available"
        content="No seats available for this session type. Please select another, or try to change weekly schedule."
        @continue="showNoAvailableSeatsModal = false"
      />

      <AuthorizationModals v-model:showLogInModal="showLogInModal" v-model:show-profile-modal="showProfileModal" />
    </div>
  </div>
</template>
