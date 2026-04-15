<script setup lang="ts">
import { onMounted } from "vue";
import MenuBar from "./components/layout/MenuBar.vue";
import { useAuthorize } from "./composables/useAuthorize";
import { useGlobalStore } from "./stores/GlobalStore";
import Footer from "./components/layout/Footer.vue";
import EnrolledCoursesSidebar from "./components/layout/EnrolledCoursesSidebar.vue";

const { setUser } = useGlobalStore();
const { fetchUserInfo, isAuthenticated } = useAuthorize();

onMounted(async () => {
  if (isAuthenticated) {
    const user = await fetchUserInfo();
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
