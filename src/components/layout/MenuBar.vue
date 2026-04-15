<script setup lang="ts">
import { ref } from "vue";
import AuthorizationModals from "../common/AuthorizationModals.vue";
import Avatar from "../common/Avatar.vue";
import Button from "../common/Button.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import StarsIcon from "../icons/StarsIcon.vue";
import BookIcon from "../icons/BookIcon.vue";
import { useAuthorize } from "@/composables/useAuthorize";
import { useRouter, useRoute } from "vue-router";
import { CATALOG_ROUTE, DASHBOARD_ROUTE } from "@/constants/constants";

const { user, isAuthenticated, isProfileComplete } = useAuthorize();
const router = useRouter();
const route = useRoute();

const showSignUp = ref(false);
const showLogIn = ref(false);
const showProfile = ref(false);
</script>

<template>
  <div class="fixed top-0 left-0 z-100 flex w-full justify-center border-b border-b-[#D1D1D1] bg-[#F5F5F5] py-6">
    <div class="flex min-w-391.5 items-center justify-between">
      <Button :icon="LogoIcon" variant="icon" :iconSize="3.75" @click="router.push(DASHBOARD_ROUTE)" />
      <div v-if="isAuthenticated" class="flex gap-9">
        <div class="flex gap-2">
          <Button
            label="Browse Courses"
            :icon="StarsIcon"
            variant="nav"
            :class="{ 'text-[#4F46E5]': route.path === CATALOG_ROUTE }"
            @click="router.push(CATALOG_ROUTE)"
          />
          <Button
            label="Enrolled Courses"
            :icon="BookIcon"
            variant="nav"
            @click="router.push({ query: { ...route.query, enrolled: 'true' } })"
          />
        </div>
        <Avatar
          :src="user?.avatar"
          :status="isProfileComplete ?? false"
          class="cursor-pointer"
          @click="showProfile = true"
        />
      </div>

      <div v-else class="flex gap-9">
        <Button
          label="Browse Courses"
          :icon="StarsIcon"
          variant="nav"
          :class="{ 'text-[#4F46E5]': route.path === CATALOG_ROUTE }"
          @click="router.push(CATALOG_ROUTE)"
        />

        <div class="flex gap-3.75">
          <Button label="Log In" variant="outline" @click="showLogIn = !showLogIn" />
          <Button label="Sign Up" variant="primary" class="h-auto! w-auto!" @click="showSignUp = !showSignUp" />
        </div>
      </div>
    </div>
    <AuthorizationModals
      v-model:showSignUpModal="showSignUp"
      v-model:showLogInModal="showLogIn"
      v-model:showProfileModal="showProfile"
    />
  </div>
</template>
