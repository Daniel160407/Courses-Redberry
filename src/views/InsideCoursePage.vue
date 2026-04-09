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
  CATEGORY_ICONS,
  DASHBOARD_ROUTE,
  TIME_SLOT_CONFIG,
  TIME_SLOT_ICONS,
  WEEKLY_SCHEDULE_CONFIG
} from "@/composables/constants";
import { useCoursesCrud } from "@/composables/useCoursesCrud";
import type { WeeklySchedule, ExtendedCourse, TimeSlot, SessionType } from "@/types/interfaces";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScheduleCrud } from "@/composables/useScheduleCrud";
import StepOneIcon from "@/components/icons/StepOneIcon.vue";
import StepTwoIcon from "@/components/icons/StepTwoIcon.vue";
import StepThreeIcon from "@/components/icons/StepThreeIcon.vue";

const { fetchCourseById } = useCoursesCrud();
const { fetchCourseWeeklySchedules, fetchCourseTimeSlots, fetchCourseSessionTypes } = useScheduleCrud();
const router = useRouter();
const route = useRoute();

const course = ref<ExtendedCourse | null>(null);
const activeTab = ref<string | number | null>(null);
const isLoading = ref(true);
const weeklySchedules = ref<WeeklySchedule[]>([]);
const timeSlots = ref<TimeSlot[]>([]);
const sessionTypes = ref<SessionType[]>([]);
const selectedWeeklySchedule = ref<WeeklySchedule | null>(null);
const selectedTimeSlot = ref<TimeSlot | null>(null);
const selectedSessionType = ref<SessionType | null>(null);

const parentPage = computed(() => route.path.split("/")[1]);

const courseId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : id;
});

const coursAvgRating = computed(() => {
  const reviews = course.value?.reviews ?? [];
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  return totalRating / reviews.length;
});

const isScheduleAvailable = (id: number) => weeklySchedules.value.some((ws) => ws.id === id);
const isTimeSlotAvailable = (id: number) => timeSlots.value.some((ts) => ts.id === id);

const handleSelectWeeklySchedule = (isSelected: boolean, weeklySchedule: WeeklySchedule) => {
  if (isSelected) {
    selectedWeeklySchedule.value = weeklySchedule;
    selectedTimeSlot.value = null;
    selectedSessionType.value = null;
  }
};

const handleSelectTimeSlot = (isSelected: boolean, timeSlot: TimeSlot) => {
  if (isSelected) {
    selectedTimeSlot.value = timeSlot;
    selectedSessionType.value = null;
  } else {
    selectedTimeSlot.value = null;
  }
};

watch(selectedWeeklySchedule, async (newVal) => {
  if (!newVal || !course.value) return;

  const res = await fetchCourseTimeSlots(course.value.id, newVal.id);
  if (res?.success) timeSlots.value = res.timeSlots;
});

watch(selectedTimeSlot, async (newVal) => {
  if (!newVal || !course.value || !selectedWeeklySchedule.value) return;

  const res = await fetchCourseSessionTypes(course.value.id, selectedWeeklySchedule.value.id, newVal.id);
  if (res?.success) sessionTypes.value = res.sessionTypes;
});

onMounted(async () => {
  try {
    if (!courseId.value) return;

    const courseResponse = await fetchCourseById(courseId.value);
    if (courseResponse?.success) {
      course.value = courseResponse.course;

      const weeklyRes = await fetchCourseWeeklySchedules(courseResponse.course.id);
      if (weeklyRes?.success) {
        weeklySchedules.value = weeklyRes.weeklySchedules;
        selectedWeeklySchedule.value = weeklySchedules.value[0] || null;
      }
    }
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div class="min-h-screen bg-[#F5F5F5] px-44.25 pt-43 pb-40">
    <div class="flex items-start gap-16">
      <div class="flex w-225.75 min-w-225.75 flex-col gap-6">
        <div>
          <div class="mb-12 flex items-center gap-0.5">
            <div class="flex gap-1 px-1 py-0.5">
              <span class="cursor-pointer text-[#666666] hover:underline" @click="router.push(DASHBOARD_ROUTE)"
                >Home</span
              >
              <AngleRightIcon />
            </div>
            <div v-if="parentPage === CATALOG_PAGE_NAME" class="px-1 py-0.5">
              <span class="text-[#736BEA]">Browse</span>
            </div>
          </div>
          <h1 class="text-[40px] font-semibold text-[#141414]">{{ course?.title }}</h1>
        </div>
        <div class="flex flex-col gap-4.5">
          <div class="flex flex-col gap-4">
            <img :src="course?.image" class="h-118.5 w-225.75 rounded-[10px] object-cover" />
            <div class="flex gap-1">
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
                  <span>{{ coursAvgRating }}</span>
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
      </div>

      <div class="mt-28 flex-1">
        <h2 class="mb-6 text-3xl font-semibold text-[#141414]">Course Content</h2>
        <Accordion v-model:value="activeTab">
          <AccordionPanel value="0">
            <AccordionHeader :icon="StepOneIcon">Weekly Schedule</AccordionHeader>
            <AccordionContent>
              <div class="grid grid-cols-4 gap-3">
                <SelectButton
                  v-for="weeklySchedule in WEEKLY_SCHEDULE_CONFIG"
                  :key="weeklySchedule.id"
                  :label="weeklySchedule.shortLabel"
                  :is-selected="selectedWeeklySchedule?.id === weeklySchedule.id"
                  :disabled="!isScheduleAvailable(weeklySchedule.id)"
                  :class="!isScheduleAvailable(weeklySchedule.id) ? 'bg-[#F5F5F5]!' : ''"
                  class="h-22.75 w-full justify-center border-[#D1D1D1]! p-2.5!"
                  @click="(isSelected) => handleSelectWeeklySchedule(isSelected, weeklySchedule)"
                />
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader :icon="StepTwoIcon">Time Slot</AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-3">
                <SelectButton
                  v-for="timeSlot in TIME_SLOT_CONFIG"
                  :key="timeSlot.id"
                  :label="timeSlot.label"
                  :is-selected="selectedTimeSlot?.id === timeSlot.id"
                  :disabled="!isTimeSlotAvailable(timeSlot.id)"
                  :class="!isTimeSlotAvailable(timeSlot.id) ? 'bg-[#F5F5F5]!' : ''"
                  :icon="TIME_SLOT_ICONS[timeSlot.id]"
                  class="h-14 w-full border-[#D1D1D1]! p-2.5!"
                  @click="(isSelected) => handleSelectTimeSlot(isSelected, timeSlot)"
                />
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
            <AccordionHeader :icon="StepThreeIcon">Session Type</AccordionHeader>
            <AccordionContent>
              <SelectButton>
                <div></div>
              </SelectButton>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </div>
</template>
