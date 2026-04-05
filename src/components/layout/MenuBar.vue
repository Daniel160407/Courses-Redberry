<script setup lang="ts">
import { useValidate } from "../../composables/useValidate";
import type { LogInErrors, LogInForm, RegistrationErrors, RegistrationForm, User } from "../../types/interfaces";
import Button from "../common/Button.vue";
import Dialog from "../common/Dialog.vue";
import Input from "../common/Input.vue";
import InputFile from "../common/InputFile.vue";
import BookIcon from "../icons/BookIcon.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import StarsIcon from "../icons/StarsIcon.vue";
import UserIcon from "../icons/UserIcon.vue";
import { ref } from "vue";
import { useAuthorize } from "../../composables/useAuthorize";

const { validateRegistration, validateLogIn } = useValidate();
const { isAuthenticated, register, logIn } = useAuthorize();

const showSignUpModal = ref(false);
const showLogInModal = ref(false);
const registrationFormData = ref<RegistrationForm>({
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  avatar: null
});
const logInFormData = ref<LogInForm>({
  email: "",
  password: ""
});
const registrationFormErrors = ref<RegistrationErrors>({
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  avatar: ""
});
const logInFormErrors = ref<LogInErrors>({
  email: "",
  password: ""
});

const handleRegister = async () => {
  const { errors, isValid } = validateRegistration(registrationFormData.value);
  registrationFormErrors.value = errors;

  if (!isValid) return;

  const result = await register(registrationFormData.value);
  if (result.success) {
    showSignUpModal.value = false;
  } else {
    const serverErr = result?.serverErrors;

    if (typeof serverErr === "object" && serverErr?.errors) {
      for (const key in serverErr.errors) {
        if (key in registrationFormErrors.value) {
          (registrationFormErrors.value as any)[key] = serverErr.errors[key][0];
        }
      }
    }
  }
};

const handleLogIn = async () => {
  const { errors, isValid } = validateLogIn(logInFormData.value);
  logInFormErrors.value = errors;

  if (!isValid) return;

  const result = await logIn(logInFormData.value);
  if (result.success) {
    showLogInModal.value = false;
  } else {
    logInFormErrors.value.email = "Invalid email or password";
    logInFormErrors.value.password = "Invalid email or password";
  }
};

const switchAuthorizationModal = () => {
  showLogInModal.value = !showLogInModal.value;
  showSignUpModal.value = !showSignUpModal.value;
};
</script>
<template>
  <div class="border-b border-b-[#D1D1D1] px-44 py-6">
    <div class="flex items-center justify-between">
      <LogoIcon />
      <div v-if="isAuthenticated()" class="flex gap-9">
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
          <Button
            label="Log In"
            class="rounded-md border-2 border-[#958FEF] px-4 py-3 font-medium text-[#4F46E5]"
            @click="showLogInModal = !showLogInModal"
          />
          <Button
            label="Sign Up"
            class="rounded-md bg-[#4F46E5] px-6 py-4 font-medium text-[#FFFFFF]"
            @click="showSignUpModal = !showSignUpModal"
          />
        </div>
      </div>

      <Dialog
        ref="signUpDialog"
        v-model:visible="showSignUpModal"
        title="Create Account"
        subtitle="Join and start learning today"
        button-label="Sign Up"
        has-steps
        @submit="handleRegister"
      >
        <template #step1>
          <Input
            v-model="registrationFormData.email"
            :error="registrationFormErrors.email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            required
          />
        </template>

        <template #step2>
          <Input
            v-model="registrationFormData.password"
            :error="registrationFormErrors.password"
            label="Password"
            placeholder="Password"
            type="password"
            required
          />
          <Input
            v-model="registrationFormData.confirmPassword"
            :error="registrationFormErrors.confirmPassword"
            label="Confirm Password"
            placeholder="Password"
            type="password"
            required
          />
        </template>

        <template #step3>
          <Input
            v-model="registrationFormData.username"
            :error="registrationFormErrors.username"
            label="Username"
            placeholder="Username"
            type="text"
            required
          />
          <InputFile
            v-model="registrationFormData.avatar"
            :error="registrationFormErrors.avatar"
            label="Upload Avatar"
          />
        </template>
        <template #end>
          <div class="flex items-center justify-center gap-2 px-15">
            <span class="text-sm text-[#666666]">Already have an account?</span>
            <Button
              label="Log In"
              class="h-4 w-12 text-sm font-medium whitespace-nowrap underline"
              @click="switchAuthorizationModal"
            />
          </div>
        </template>
      </Dialog>

      <Dialog
        v-model:visible="showLogInModal"
        title="Welcome Back"
        subtitle="Log in to continue your learning"
        button-label="Log In"
        :has-steps="false"
        @submit="handleLogIn"
      >
        <template #content>
          <Input
            v-model="logInFormData.email"
            :error="logInFormErrors.email"
            label="Email"
            placeholder="you@example.com"
            type="email"
          />
          <Input
            v-model="logInFormData.password"
            :error="logInFormErrors.password"
            label="Password"
            placeholder="Password"
            type="password"
          />
        </template>
        <template #end>
          <div class="flex items-center justify-center gap-2 px-15">
            <span class="text-sm text-[#666666]">Don`t have an account?</span>
            <Button
              label="Sign Up"
              class="h-4 w-12 text-sm font-medium whitespace-nowrap underline"
              @click="switchAuthorizationModal"
            />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>
