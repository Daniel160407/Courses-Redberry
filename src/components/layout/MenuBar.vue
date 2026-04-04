<script setup lang="ts">
import type { RegistrationForm, User } from "../../types/interfaces";
import Button from "../common/Button.vue";
import Dialog from "../common/Dialog.vue";
import Input from "../common/Input.vue";
import InputFile from "../common/InputFile.vue";
import BookIcon from "../icons/BookIcon.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import StarsIcon from "../icons/StarsIcon.vue";
import UserIcon from "../icons/UserIcon.vue";
import { ref } from "vue";

const props = defineProps<{
  user: User;
}>();

const showSignUpModal = ref(false);
const formData = ref<RegistrationForm>({
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  avatar: null
});

const handleRegister = async () => {};
</script>
<template>
  <div class="border-b border-b-[#D1D1D1] px-44 py-6">
    <div class="flex items-center justify-between">
      <LogoIcon />
      <div v-if="props.user" class="flex gap-9">
        <div class="flex gap-2">
          <Button label="Browse Courses" :icon="StarsIcon" />
          <Button label="Enrolled Courses" :icon="BookIcon" />
        </div>
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEEDFC]">
          <UserIcon />
        </div>
      </div>

      <div v-else class="flex gap-9">
        <Button label="Browse Courses" :icon="StarsIcon" />

        <div class="flex gap-4">
          <Button label="Log In" class="rounded-md border-2 border-[#958FEF] px-4 py-3 font-medium text-[#4F46E5]" />
          <Button
            label="Sign Up"
            @click="showSignUpModal = !showSignUpModal"
            class="rounded-md bg-[#4F46E5] px-6 py-4 font-medium text-[#FFFFFF]"
          />
        </div>
      </div>

      <Dialog
        v-model:visible="showSignUpModal"
        title="Create Account"
        subtitle="Join and start learning today"
        button-label="Sign Up"
        @submit="handleRegister"
      >
        <template #step1>
          <Input v-model="formData.email" label="Email" placeholder="you@example.com" type="email" required />
        </template>
        <template #step2>
          <Input v-model="formData.password" label="Password" placeholder="Password" type="password" required />
          <Input
            v-model="formData.confirmPassword"
            label="Confirm Password"
            placeholder="Password"
            type="password"
            required
          />
        </template>
        <template #step3>
          <Input v-model="formData.username" label="Username" placeholder="Username" type="text" required />
          <InputFile v-model="formData.avatar" label="Upload Avatar" />
        </template>
        <template #end>
          <div class="flex items-center justify-center gap-2 px-15">
            <span class="text-sm text-[#666666]">Already have an account?</span>
            <Button label="Log In" class="h-4 w-12 text-sm font-medium whitespace-nowrap underline" />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>
