<script setup lang="ts">
import { useAuthorize } from "@/composables/useAuthorize";
import EnvelopeIcon from "../icons/EnvelopeIcon.vue";
import FacebookIcon from "../icons/FacebookIcon.vue";
import InstagramIcon from "../icons/InstagramIcon.vue";
import LinkedInIcon from "../icons/LinkedInIcon.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import PhoneIcon from "../icons/PhoneIcon.vue";
import PointerIcon from "../icons/PointerIcon.vue";
import TwitterIcon from "../icons/TwitterIcon.vue";
import YouTubeIcon from "../icons/YouTubeIcon.vue";
import Button from "../common/Button.vue";
import { useRouter } from "vue-router";
import AuthorizationModals from "../common/AuthorizationModals.vue";
import { ref } from "vue";

const { isAuthenticated } = useAuthorize();
const router = useRouter();

const showLogInModal = ref(false);
const showProfileModal = ref(false);
</script>
<template>
  <div>
    <div class="flex flex-col items-center gap-18.5 pt-20 pb-5">
      <div class="flex min-w-391.5 justify-between">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <LogoIcon class="w-11.25" />
              <span class="text-[24px] font-medium">Bootcamp</span>
            </div>
            <div class="flex flex-col text-[14px] font-medium">
              <span>Your learning journey starts here!</span>
              <span>Browse courses to get started.</span>
            </div>
          </div>
          <div class="flex items-center gap-5.5">
            <FacebookIcon class="cursor-pointer" />
            <TwitterIcon class="cursor-pointer" />
            <InstagramIcon class="cursor-pointer" />
            <LinkedInIcon class="cursor-pointer" />
            <YouTubeIcon class="cursor-pointer" />
          </div>
        </div>

        <div class="flex gap-30">
          <div class="flex flex-col gap-4">
            <span class="text-[20px] font-semibold text-[#130E67]">Explore</span>
            <div class="flex flex-col gap-2 text-[#666666]">
              <Button
                v-if="isAuthenticated"
                label="Enrolled Courses"
                variant="footer-link-gray"
                @click="router.push({ query: { enrolled: 'true' } })"
              />
              <Button label="Browse Courses" variant="footer-link-gray" @click="router.push('/catalog')" />
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <span class="text-[20px] font-semibold text-[#130E67]">Account</span>
            <Button
              v-if="isAuthenticated"
              label="My Profile"
              variant="footer-link-gray"
              @click="showProfileModal = !showProfileModal"
            />
            <Button v-else label="Log In" variant="footer-link-gray" @click="showLogInModal = true" />
          </div>
          <div class="flex flex-col gap-4">
            <span class="text-[20px] font-semibold text-[#130E67]">Contact</span>
            <div class="flex flex-col gap-2.5 text-[18px] text-[#666666]">
              <div class="flex items-center gap-1.5">
                <EnvelopeIcon />
                <span>contact@company.com</span>
              </div>
              <div class="flex items-center gap-1.5">
                <PhoneIcon />
                <span>(+995) 555 111 222</span>
              </div>
              <div class="flex items-center gap-1.5">
                <PointerIcon class="h-6 w-6" />
                <span>Aghmashenebeli St.115</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full max-w-391.5 justify-between text-[18px]">
        <div class="flex flex-1 justify-start">
          <span class="text-[#666666]">Copyright &copy; Redberry International</span>
        </div>
        <div class="flex flex-1 justify-end">
          <p class="text-[#666666]">
            All Rights Reserved | <span class="cursor-pointer text-[#4F46E5]">Terms and Conditions</span> |
            <span class="cursor-pointer text-[#4F46E5]">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>

    <AuthorizationModals v-model:show-log-in-modal="showLogInModal" v-model:show-profile-modal="showProfileModal" />
  </div>
</template>
