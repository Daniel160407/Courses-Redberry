<script setup lang="ts">
import { onMounted } from "vue";
import MenuBar from "./components/layout/MenuBar.vue";
import { useAuthorize } from "./composables/useAuthorize";
import { useGlobalStore } from "./stores/GlobalStore";
import { useCoursesCrud } from "./composables/useCoursesCrud";
import Footer from "./components/layout/Footer.vue";
import EnrolledCoursesSidebar from "./components/layout/EnrolledCoursesSidebar.vue";

const { setUser } = useGlobalStore();
const { fetchUserInfo, isAuthenticated } = useAuthorize();
const { fetchInProgressCourses } = useCoursesCrud();

onMounted(async () => {
  if (isAuthenticated.value) {
    const [user] = await Promise.all([fetchUserInfo(), fetchInProgressCourses()]);
    setUser(user ?? null);
  }
});
</script>
<template>
  <div>
    <MenuBar />
    <router-view />
    <Footer />
    <EnrolledCoursesSidebar />
  </div>
</template>
