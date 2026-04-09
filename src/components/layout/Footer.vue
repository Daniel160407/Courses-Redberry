<script setup lang="ts">
import EnvelopeIcon from "../icons/EnvelopeIcon.vue";
import FacebookIcon from "../icons/FacebookIcon.vue";
import InstagramIcon from "../icons/InstagramIcon.vue";
import LinkedInIcon from "../icons/LinkedInIcon.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import PhoneIcon from "../icons/PhoneIcon.vue";
import PointerIcon from "../icons/PointerIcon.vue";
import TwitterIcon from "../icons/TwitterIcon.vue";
import YouTubeIcon from "../icons/YouTubeIcon.vue";
</script>
<template>
  <div>
    <div class="flex flex-col justify-between gap-18.5 px-44.25 pt-20 pb-5">
      <div class="flex justify-between">
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
            <FacebookIcon />
            <TwitterIcon />
            <InstagramIcon />
            <LinkedInIcon />
            <YouTubeIcon />
          </div>
        </div>

        <div class="flex gap-30">
          <div class="flex flex-col gap-4">
            <span class="text-[20px] font-semibold text-[#130E67]">Explore</span>
            <div class="flex flex-col gap-2 text-[#666666]">
              <span>Enrolled Courses</span>
              <span>Browse Courses</span>
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <span class="text-[20px] font-semibold text-[#130E67]">Account</span>
            <span class="text-[#666666]">My Profile</span>
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
      <div class="flex text-[18px]">
        <div class="flex flex-1 justify-start">
          <span class="text-[#666666]">Copyright &copy; Redberry International</span>
        </div>
        <div class="flex flex-1 justify-end">
          <p class="text-[#666666]">
            All Rights Reserved | <span class="text-[#4F46E5]">Terms and Conditions</span> |
            <span class="text-[#4F46E5]">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
