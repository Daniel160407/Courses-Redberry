<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthorize } from "@/composables/useAuthorize";
import { CATALOG_ROUTE } from "@/constants/constants";
import CourseProgressCard from "@/components/common/CourseProgressCard.vue";
import BoxIcon from "@/components/icons/BoxIcon.vue";
import Button from "@/components/common/Button.vue";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/stores/GlobalStore";

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuthorize();
const { userEnrollments } = storeToRefs(useGlobalStore());

const isSidebarOpen = computed(() => isAuthenticated.value && route.query.enrolled === "true");

const closeSidebar = () => {
  const query = { ...route.query };
  delete query.enrolled;
  router.push({ query });
};

const handleOpenDetails = (courseId: number) => {
  const rootPath = route.path.split("/")[1] || "dashboard";
  const query = { ...route.query };
  delete query.enrolled;
  router.push({ path: `/${rootPath}/course/${courseId}`, query });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

watch(isSidebarOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <div class="sidebar-layout">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isSidebarOpen" class="fixed inset-0 z-110 bg-black/20" @click="closeSidebar"></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-400 ease-in-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-400 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isSidebarOpen"
        class="fixed inset-y-0 right-0 z-120 w-198.5 max-w-full overflow-y-auto border-l border-[#D1D1D1] bg-[#F5F5F5] shadow-xl"
      >
        <div class="z-10 mt-10.5 flex h-21.5 items-end justify-between bg-[#F5F5F5] px-14.25">
          <span class="text-[40px] font-semibold text-[#0A0A0A]">Enrolled Courses</span>
          <p class="text-[16px] font-semibold text-[#0A0A0A]">
            Total Enrollments <span>{{ userEnrollments?.length ?? 0 }}</span>
          </p>
        </div>

        <div v-if="userEnrollments?.length" class="mt-9.25 flex flex-col items-center gap-3 px-21 pb-10">
          <CourseProgressCard
            v-for="enrollment in userEnrollments"
            :key="enrollment.id"
            :title="enrollment.course.title"
            :instructor-name="enrollment.course.instructor.name"
            :avg-rating="enrollment.course.avgRating"
            :progress="enrollment.progress"
            :image="enrollment.course.image"
            :days="enrollment.schedule.weeklySchedule.label"
            :times="enrollment.schedule.timeSlot.label"
            :session-type="enrollment.schedule.sessionType.name"
            :location="enrollment.schedule.location"
            :base-price="enrollment.course.basePrice"
            :price-modifier="enrollment.schedule.sessionType.priceModifier"
            extended
            @open-details="handleOpenDetails(enrollment.course.id)"
          />
        </div>

        <div v-else class="flex h-[calc(100%-86px)] w-full items-center justify-center">
          <div class="flex flex-col items-center gap-1">
            <BoxIcon />
            <div class="flex flex-col items-center gap-3 text-center">
              <h3 class="text-2xl font-semibold text-[#130E67]">No Enrolled Courses Yet</h3>
              <p class="text-medium text-[14px] text-[#130E67]">Your learning journey starts here!</p>
              <Button
                label="Browse Courses"
                variant="primary"
                class="mt-2 h-14.5 w-43.75! rounded-lg"
                @click="router.push(CATALOG_ROUTE)"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
