<script setup lang="ts">
import {
  type ProfileForm,
  type LogInErrors,
  type LogInForm,
  type RegistrationErrors,
  type RegistrationForm,
  type ProfileErrors
} from "@/types/interfaces";
import { useValidate } from "@/composables/useValidate";
import Button from "../common/Button.vue";
import Dialog from "../common/Dialog.vue";
import Input from "../common/Input.vue";
import InputFile from "../common/InputFile.vue";
import BookIcon from "../icons/BookIcon.vue";
import LogoIcon from "../icons/LogoIcon.vue";
import StarsIcon from "../icons/StarsIcon.vue";
import { ref, watch } from "vue";
import { useAuthorize } from "@/composables/useAuthorize";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/stores/GlobalStore";
import Avatar from "../common/Avatar.vue";
import { COMPLETE_STATUS, INCOMPLETE_STATUS } from "@/composables/constants";
import PencilIcon from "../icons/PencilIcon.vue";
import MarkIcon from "../icons/MarkIcon.vue";
import Select from "../common/Select.vue";
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import Modal from "../common/Modal.vue";
import WarningIcon from "../icons/WarningIcon.vue";

const { user } = storeToRefs(useGlobalStore());
const { validateRegistration, validateLogIn, validateProfileDetails } = useValidate();
const { isAuthenticated, register, logIn, updateProfile } = useAuthorize();

const showSignUpModal = ref(false);
const showLogInModal = ref(false);
const showProfileModal = ref(true);
const showCloseConfirm = ref(false);
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
const profileFormData = ref<ProfileForm>({
  full_name: user.value?.fullName ?? "",
  mobile_number: user.value?.mobileNumber ?? "",
  age: user.value?.age ?? 0,
  avatar: null
});
const profileFormErrors = ref<ProfileErrors>({
  full_name: "",
  mobile_number: "",
  age: ""
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

const handleUpdateProfile = async () => {
  const { errors, isValid } = validateProfileDetails(profileFormData.value);
  profileFormErrors.value = errors;
  console.log(errors);

  if (!isValid) return;

  const result = await updateProfile(profileFormData.value);
  if (result.success) {
    showProfileModal.value = false;
  } else {
    const serverErr = result?.serverErrors;

    if (typeof serverErr === "object" && serverErr?.errors) {
      for (const key in serverErr.errors) {
        if (key in profileFormErrors.value) {
          (profileFormErrors.value as any)[key] = serverErr.errors[key][0];
        }
      }
    }
  }
};

const switchAuthorizationModal = () => {
  showLogInModal.value = !showLogInModal.value;
  showSignUpModal.value = !showSignUpModal.value;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    complete: "#1DC31D",
    incomplete: "#F4A316"
  };

  return colors[status];
};

const getAgeOptions = () => {
  return Array.from({ length: 105 }, (_, i) => {
    const age = i + 16;
    return { label: age.toString(), value: age };
  });
};

const handleCloseProfile = () => {
  showCloseConfirm.value = true;
};

const handleClickCancelProfileConfirm = () => {
  showCloseConfirm.value = false;
};

const handleClickContinueProfileConfirm = () => {
  showCloseConfirm.value = false;
  showProfileModal.value = false;
};

watch(
  user,
  (newUser) => {
    if (newUser) {
      profileFormData.value = {
        full_name: newUser.fullName ?? "",
        mobile_number: newUser.mobileNumber ?? "",
        age: newUser.age ?? 0,
        avatar: null
      };
    }
  },
  { immediate: true }
);
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
        <Avatar :src="user?.avatar" />
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

      <Dialog
        v-model:visible="showProfileModal"
        title="Profile"
        button-label="Update Profile"
        :has-steps="false"
        confirm-closing
        @close="handleCloseProfile"
        @submit="handleUpdateProfile"
      >
        <template #start>
          <div class="flex gap-2">
            <Avatar :src="user?.avatar" :status="user?.profileComplete ? COMPLETE_STATUS : INCOMPLETE_STATUS" />
            <div class="flex flex-col gap-1">
              <span class="text-xl text-[#0A0A0A]">{{ user?.fullName ?? "Username" }}</span>
              <span
                class="pl-0.5 text-[10px]"
                :style="{ color: getStatusColor(user?.profileComplete ? COMPLETE_STATUS : INCOMPLETE_STATUS) }"
                >{{ user?.profileComplete ? "Profile is Complete" : "Incomplete Profile" }}</span
              >
            </div>
          </div>
        </template>
        <template #content>
          <Input
            v-model="profileFormData.full_name"
            :error="profileFormErrors.full_name"
            label="Full Name"
            placeholder="Username"
            :icon="PencilIcon"
          />
          <Input :model-value="user?.email ?? ''" label="Email" :icon="MarkIcon" disabled />
          <div class="flex gap-2">
            <Input
              v-model="profileFormData.mobile_number"
              :error="profileFormErrors.mobile_number"
              label="Mobile Number"
              type="tel"
              placeholder="599209820"
              :icon="MarkIcon"
              class="flex-3"
            />
            <Select
              v-model="profileFormData.age"
              :error="profileFormErrors.age"
              :options="getAgeOptions()"
              label="Age"
              :icon="ArrowDownIcon"
              class="flex-1"
            />
          </div>
          <InputFile v-model="profileFormData.avatar" label="Upload Avatar" />
        </template>
      </Dialog>

      <Modal
        :visible="showCloseConfirm"
        title="Your profile is incomplete."
        content="You won't be able to enroll in courses until you complete it. Close anyway?"
        button-label="Continue"
        :icon="WarningIcon"
        @continue="handleClickContinueProfileConfirm"
        @cancel="handleClickCancelProfileConfirm"
      />
    </div>
  </div>
</template>
