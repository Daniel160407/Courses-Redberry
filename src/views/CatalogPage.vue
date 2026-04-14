<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import CourseCard from "@/components/common/CourseCard.vue";
import Paginator from "@/components/common/Paginator.vue";
import SelectButton from "@/components/common/SelectButton.vue";
import SortingDropdown from "@/components/common/SortingDropdown.vue";
import AngleRightIcon from "@/components/icons/AngleRightIcon.vue";
import BulbIcon from "@/components/icons/BulbIcon.vue";
import ChartIcon from "@/components/icons/ChartIcon.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import CodeIcon from "@/components/icons/CodeIcon.vue";
import PaletteIcon from "@/components/icons/PaletteIcon.vue";
import TreeIcon from "@/components/icons/TreeIcon.vue";
import { DASHBOARD_ROUTE, SORT_OPTIONS } from "@/constants/constants";
import { useCatalogCrud } from "@/composables/useCatalogCrud";
import { useCoursesCrud } from "@/composables/useCoursesCrud";
import type { Course, Category, Instructor, Topic, CoursesResponse } from "@/types/interfaces";
import { computed, onMounted, ref, watch, type Component } from "vue";
import { useRouter, useRoute } from "vue-router";

const { fetchFilters, fetchTopics } = useCatalogCrud();
const { fetchCourses } = useCoursesCrud();
const router = useRouter();
const route = useRoute();

const parseQueryParam = (param: string | (string | null)[] | null): number[] => {
  if (!param) return [];
  const val = Array.isArray(param) ? param[0] : param;
  if (!val) return [];
  return val
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
};

const categories = ref<Category[]>([]);
const topics = ref<Topic[]>([]);
const instructors = ref<Instructor[]>([]);

const courses = ref<Course[]>([]);

const selectedCategoryIds = ref<number[]>(parseQueryParam(route.query.categories as string));
const selectedTopicIds = ref<number[]>(parseQueryParam(route.query.topics as string));
const selectedInstructorIds = ref<number[]>(parseQueryParam(route.query.instructors as string));

const sort = ref<string>((route.query.sort as string) || "");

const totalCourses = ref<number>(0);
const isFiltering = ref(false);
const perPage = ref<number>(0);
const currentPage = ref<number>(Number(route.query.page) || 1);
const lastPage = ref<number>(0);

const activeFiltersQuantity = computed(() => {
  return selectedCategoryIds.value.length + selectedTopicIds.value.length + selectedInstructorIds.value.length;
});

const showingCount = computed(() => {
  return Math.min(currentPage.value * perPage.value, totalCourses.value);
});

const getCategoryIcon = (iconName: string) => {
  const icons: Record<string, Component> = {
    development: CodeIcon,
    design: PaletteIcon,
    business: ChartIcon,
    marketing: TreeIcon,
    "data-science": BulbIcon
  };

  return icons[iconName];
};

const updateCourses = async () => {
  isFiltering.value = true;
  try {
    const coursesResponse = await fetchCourses({
      categoryIds: selectedCategoryIds.value,
      topicIds: selectedTopicIds.value,
      instructorIds: selectedInstructorIds.value,
      sort: sort.value,
      page: currentPage.value
    });
    if (coursesResponse && coursesResponse.success && coursesResponse.courses && coursesResponse.meta) {
      setPaginationData(coursesResponse as CoursesResponse);
    }
  } finally {
    isFiltering.value = false;
  }
};

const handleClickCategory = async (isSelected: boolean, category: Category) => {
  selectedCategoryIds.value = isSelected
    ? [...selectedCategoryIds.value, category.id]
    : selectedCategoryIds.value.filter((id) => id !== category.id);

  const topicsResponse = await fetchTopics(selectedCategoryIds.value);
  topics.value = topicsResponse?.topics;

  selectedTopicIds.value = [];
  currentPage.value = 1;
};

const handleClickTopic = async (isSelected: boolean, topic: Topic) => {
  selectedTopicIds.value = isSelected
    ? [...selectedTopicIds.value, topic.id]
    : selectedTopicIds.value.filter((id) => id !== topic.id);

  currentPage.value = 1;
};

const handleClickInstructor = async (isSelected: boolean, instructor: Instructor) => {
  selectedInstructorIds.value = isSelected
    ? [...selectedInstructorIds.value, instructor.id]
    : selectedInstructorIds.value.filter((id) => id !== instructor.id);

  currentPage.value = 1;
};

const handleClearFilters = async () => {
  if (
    isFiltering.value ||
    (selectedCategoryIds.value.length === 0 &&
      selectedTopicIds.value.length === 0 &&
      selectedInstructorIds.value.length === 0)
  )
    return;
  selectedCategoryIds.value = [];
  selectedTopicIds.value = [];
  selectedInstructorIds.value = [];
  currentPage.value = 1;
};

const handleOpenDetails = (course: Course) => {
  router.push(`/catalog/course/${course.id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const setPaginationData = (coursesResponse: CoursesResponse) => {
  courses.value = coursesResponse.courses;
  totalCourses.value = coursesResponse.meta.total;
  perPage.value = coursesResponse.meta.perPage;
  lastPage.value = coursesResponse.meta.lastPage;
};

const syncToUrl = () => {
  const query: Record<string, any> = {};
  if (selectedCategoryIds.value.length) query.categories = selectedCategoryIds.value.join(",");
  if (selectedTopicIds.value.length) query.topics = selectedTopicIds.value.join(",");
  if (selectedInstructorIds.value.length) query.instructors = selectedInstructorIds.value.join(",");
  if (sort.value) query.sort = sort.value;
  if (currentPage.value > 1) query.page = currentPage.value;

  router.replace({ query });
};

watch([selectedCategoryIds, selectedTopicIds, selectedInstructorIds, sort, currentPage], () => {
  syncToUrl();
  updateCourses();
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

onMounted(async () => {
  const responses = await fetchFilters();
  if (responses.categoriesResponse?.success) categories.value = responses.categoriesResponse.categories;
  if (responses.instructorsResponse?.success) instructors.value = responses.instructorsResponse.instructors;

  if (selectedCategoryIds.value.length > 0) {
    const topicsRes = await fetchTopics(selectedCategoryIds.value);
    topics.value = topicsRes?.topics;
  } else if (responses.topicsResponse?.success) {
    topics.value = responses.topicsResponse.topics;
  }

  await updateCourses();
});
</script>
<template>
  <div class="min-h-screen overflow-x-hidden bg-[#F5F5F5] px-44.25 pt-43 pb-40">
    <div class="mb-12 flex items-center gap-0.5 text-[18px]">
      <div class="flex items-center gap-1 px-1 py-0.5">
        <span class="cursor-pointer text-[#666666] hover:underline" @click="router.push(DASHBOARD_ROUTE)">Home</span>
        <AngleRightIcon />
      </div>
      <div class="px-1 py-0.5">
        <span class="text-[#736BEA]">Browse</span>
      </div>
    </div>

    <div class="flex items-start gap-22.5">
      <div class="flex flex-col gap-6">
        <aside
          class="scrollbar-hide sticky flex h-[calc(100vh-160px)] w-77.25 min-w-77.25 flex-col gap-8 overflow-y-auto pr-4"
        >
          <div class="flex items-center justify-between">
            <span class="text-[40px] font-semibold text-[#000000]">Filters</span>
            <Button
              label="Clear All Filters"
              :loading="isFiltering"
              :icon="CloseIcon"
              icon-pos="right"
              variant="danger-nav"
              @click="handleClearFilters"
            />
          </div>

          <div class="flex flex-col gap-6">
            <span class="text-[18px] font-medium text-[#8A8A8A]">Categories</span>
            <div class="flex flex-wrap gap-2">
              <SelectButton
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :icon="getCategoryIcon(category.icon)"
                :is-selected="selectedCategoryIds.includes(category.id)"
                @click="(isSelected) => handleClickCategory(isSelected, category)"
              />
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <span class="text-[18px] font-medium text-[#8A8A8A]">Topics</span>
            <div class="flex flex-wrap gap-2">
              <SelectButton
                v-for="topic in topics"
                :key="topic.id"
                :label="topic.name"
                :is-selected="selectedTopicIds.includes(topic.id)"
                @click="(isSelected) => handleClickTopic(isSelected, topic)"
              />
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <span class="text-[18px] font-medium text-[#8A8A8A]">Instructor</span>
            <div class="flex flex-wrap gap-2">
              <SelectButton
                v-for="instructor in instructors"
                :key="instructor.id"
                :label="instructor.name"
                :image="instructor.avatar"
                :is-selected="selectedInstructorIds.includes(instructor.id)"
                @click="(isSelected) => handleClickInstructor(isSelected, instructor)"
              />
            </div>
          </div>
        </aside>

        <div class="border-t border-[#ADADAD] pt-4 font-medium text-[#8A8A8A]">
          <p>
            <span>{{ activeFiltersQuantity }} Filters Active</span>
          </p>
        </div>
      </div>

      <main class="flex flex-1 flex-col gap-8">
        <div class="flex items-center justify-between">
          <div>
            <p v-if="showingCount">
              Showing <span>{{ showingCount }}</span> out of
              <span>{{ totalCourses }}</span>
            </p>
            <p v-else>No courses found</p>
          </div>
          <SortingDropdown v-model="sort" :options="SORT_OPTIONS" />
        </div>

        <div v-if="showingCount" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            v-for="course in courses"
            :key="course.id"
            v-bind="course"
            variant="secondary"
            :category-icon="getCategoryIcon(course.category.icon)"
            @open-details="handleOpenDetails(course)"
          />
        </div>
        <div v-if="showingCount" class="flex justify-center">
          <Paginator v-model="currentPage" :total="lastPage" />
        </div>
      </main>
    </div>
  </div>
</template>
