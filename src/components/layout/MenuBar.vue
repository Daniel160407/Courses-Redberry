<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/stores/GlobalStore";
import AuthorizationModals from "../common/AuthorizationModals.vue";
import Avatar from "../common/Avatar.vue";
import Button from "../common/Button.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import StarsIcon from "../icons/StarsIcon.vue";
import BookIcon from "../icons/BookIcon.vue";
import { COMPLETE_STATUS, INCOMPLETE_STATUS } from "@/composables/constants";

const { user, isAuthorized } = storeToRefs(useGlobalStore());

const showSignUp = ref(false);
const showLogIn = ref(false);
const showProfile = ref(false);
</script>

<template>
  <div class="border-b border-b-[#D1D1D1] bg-[#F5F5F5] px-44 py-6">
    <div class="flex items-center justify-between">
      <LogoIcon />
      <div v-if="isAuthorized" class="flex gap-9">
        <div class="flex gap-2">
          <Button label="Browse Courses" :icon="StarsIcon" />
          <Button label="Enrolled Courses" :icon="BookIcon" />
        </div>
        <Avatar
          :src="user?.avatar"
          :status="user?.profileComplete ? COMPLETE_STATUS : INCOMPLETE_STATUS"
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
