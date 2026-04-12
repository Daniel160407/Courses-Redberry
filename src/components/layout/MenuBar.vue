<script setup lang="ts">
import { ref } from "vue";
import AuthorizationModals from "../common/AuthorizationModals.vue";
import Avatar from "../common/Avatar.vue";
import Button from "../common/Button.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import StarsIcon from "../icons/StarsIcon.vue";
import BookIcon from "../icons/BookIcon.vue";
import { useAuthorize } from "@/composables/useAuthorize";

const { user, isAuthenticated, isProfileComplete } = useAuthorize();

const showSignUp = ref(false);
const showLogIn = ref(false);
const showProfile = ref(false);
</script>

<template>
  <div class="fixed top-0 left-0 z-100 w-full border-b border-b-[#D1D1D1] bg-[#F5F5F5] px-44 py-6">
    <div class="flex items-center justify-between">
      <LogoIcon />
      <div v-if="isAuthenticated" class="flex gap-9">
        <div class="flex gap-2">
          <Button label="Browse Courses" :icon="StarsIcon" />
          <Button label="Enrolled Courses" :icon="BookIcon" />
        </div>
        <Avatar
          :src="user?.avatar"
          :status="isProfileComplete ?? false"
          class="cursor-pointer"
          @click="showProfile = true"
        />
      </div>

      <div v-else class="flex gap-9">
        <Button label="Browse Courses" :icon="StarsIcon" />

        <div class="flex gap-4">
          <Button
            label="Log In"
            class="rounded-md border-2 border-[#958FEF] px-4 py-3 font-medium text-[#4F46E5]"
            @click="showLogIn = !showLogIn"
          />
          <Button
            label="Sign Up"
            class="rounded-md bg-[#4F46E5] px-6 py-4 font-medium text-[#FFFFFF]"
            @click="showSignUp = !showSignUp"
          />
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
