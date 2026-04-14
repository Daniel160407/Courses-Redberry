<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { type ProfileForm, type LogInForm, type RegistrationForm } from "@/types/interfaces";
import { useValidate } from "@/composables/useValidate";
import { useAuthorize } from "@/composables/useAuthorize";
import { useGlobalStore } from "@/stores/GlobalStore";
import { useCoursesCrud } from "@/composables/useCoursesCrud";

import Dialog from "../common/Dialog.vue";
import Input from "../common/Input.vue";
import InputFile from "../common/InputFile.vue";
import Button from "../common/Button.vue";
import Avatar from "../common/Avatar.vue";
import Select from "../common/Select.vue";
import Modal from "../common/Modal.vue";

import PencilIcon from "../icons/PencilIcon.vue";
import MarkIcon from "../icons/MarkIcon.vue";
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import WarningIcon from "../icons/WarningIcon.vue";
import SuccessIcon from "../icons/SuccessIcon.vue";

const showSignUpModal = defineModel<boolean>("showSignUpModal");
const showLogInModal = defineModel<boolean>("showLogInModal");
const showProfileModal = defineModel<boolean>("showProfileModal");

const globalStore = useGlobalStore();
const { user, showLoginModal } = storeToRefs(globalStore);
const { setUser, setIsProfileComplete, setShowLoginModal } = globalStore;
const { useRegistrationValidate, useLogInValidate, useProfileValidate } = useValidate();
const { register, logIn, updateProfile, isProfileComplete } = useAuthorize();
const { fetchInProgressCourses } = useCoursesCrud();

const registrationSubmitted = ref(false);
const logInSubmitted = ref(false);
const profileSubmitted = ref(false);
const showCloseConfirm = ref(false);
const registrationStep = ref(1);
const isSubmitting = ref(false);
const showProfileEditSuccessModal = ref(false);

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
const profileFormData = ref<ProfileForm>({
  full_name: user.value?.fullName ?? "",
  mobile_number: user.value?.mobileNumber ?? "",
  age: user.value?.age ?? 0,
  avatar: user.value?.avatar ?? null
});

const registrationFormErrors = useRegistrationValidate(registrationFormData);
const logInFormErrors = useLogInValidate(logInFormData);
const profileFormErrors = useProfileValidate(profileFormData);

const handleRegister = async () => {
  if (Object.values(registrationFormErrors).some((err) => err !== "")) {
    if (registrationFormErrors.email) {
      registrationStep.value = 1;
    } else if (registrationFormErrors.password || registrationFormErrors.confirmPassword) {
      registrationStep.value = 2;
    }
    return;
  }

  isSubmitting.value = true;
  try {
    const result = await register(registrationFormData.value);
    if (result.success) {
      showSignUpModal.value = false;
      setUser(result.user ?? null);
    } else if (result?.serverErrors) {
      const serverErr = result?.serverErrors;
      if (typeof serverErr === "object" && serverErr?.errors) {
        for (const key in serverErr.errors) {
          if (key in registrationFormErrors) {
            (registrationFormErrors as any)[key] = serverErr.errors[key][0];
          }
        }
        if (registrationFormErrors.email) {
          registrationStep.value = 1;
        } else if (registrationFormErrors.password || registrationFormErrors.confirmPassword) {
          registrationStep.value = 2;
        }
      }
    }
  } finally {
    isSubmitting.value = false;
  }
  registrationSubmitted.value = true;
};

const handleLogIn = async () => {
  if (Object.values(logInFormErrors).some((err) => err !== "")) return;
  isSubmitting.value = true;
  try {
    const result = await logIn(logInFormData.value);
    if (result.success) {
      showLogInModal.value = false;
      setUser(result.user ?? null);
      setIsProfileComplete(result.user?.profileComplete ?? false);
    } else {
      logInFormErrors.email = "Invalid credentials";
      logInFormErrors.password = "Invalid credentials";
    }
  } finally {
    isSubmitting.value = false;
  }
  logInSubmitted.value = true;
};

const handleUpdateProfile = async () => {
  if (Object.values(profileFormErrors).some((err) => err !== "")) return;
  isSubmitting.value = true;
  try {
    if (typeof profileFormData.value.avatar === "string") {
      profileFormData.value.avatar = null;
    }
    const result = await updateProfile(profileFormData.value);
    if (result?.success) {
      showProfileModal.value = false;
      showProfileEditSuccessModal.value = true;
      setUser(result?.user ?? null);
      setIsProfileComplete(result?.user?.profileComplete ?? false);
    } else if (result?.serverErrors) {
      const serverErr = result?.serverErrors;
      if (typeof serverErr === "object" && serverErr?.errors) {
        for (const key in serverErr.errors) {
          if (key in profileFormErrors) {
            (profileFormErrors as any)[key] = serverErr.errors[key][0];
          }
        }
      }
    }
  } finally {
    isSubmitting.value = false;
  }
  profileSubmitted.value = true;
};

const switchAuthorizationModal = () => {
  showLogInModal.value = !showLogInModal.value;
  showSignUpModal.value = !showSignUpModal.value;
};

const getAgeOptions = () => {
  return Array.from({ length: 105 }, (_, i) => {
    const age = i + 16;
    return { label: age.toString(), value: age };
  });
};

const handleCloseProfile = () => {
  if (isProfileComplete.value) showProfileModal.value = false;
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
  registrationFormData,
  () => {
    registrationSubmitted.value = false;
  },
  { deep: true }
);
watch(
  logInFormData,
  () => {
    logInSubmitted.value = false;
  },
  { deep: true }
);
watch(
  profileFormData,
  () => {
    profileSubmitted.value = false;
  },
  { deep: true }
);
watch(showSignUpModal, (isOpen) => {
  if (isOpen) registrationSubmitted.value = false;
});
watch(showLogInModal, (isOpen) => {
  if (isOpen) {
    logInSubmitted.value = false;
  } else {
    setShowLoginModal(false);
  }
});

watch(showLoginModal, (isOpen) => {
  if (isOpen) showLogInModal.value = true;
});
watch(showProfileModal, (isOpen) => {
  if (isOpen) profileSubmitted.value = false;
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      profileFormData.value = {
        full_name: newUser.fullName ?? "",
        mobile_number: newUser.mobileNumber ?? "",
        age: newUser.age ?? 0,
        avatar: newUser.avatar ?? null
      };
      fetchInProgressCourses();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <Dialog
      v-model:visible="showSignUpModal"
      v-model:step="registrationStep"
      title="Create Account"
      subtitle="Join and start learning today"
      button-label="Sign Up"
      :loading="isSubmitting"
      has-steps
      @submit="handleRegister"
    >
      <template #step1>
        <Input
          v-model="registrationFormData.email"
          :error="registrationFormErrors.email"
          :success="registrationSubmitted && !registrationFormErrors.email"
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
          :success="registrationSubmitted && !registrationFormErrors.password"
          label="Password"
          placeholder="Password"
          type="password"
          required
        />
        <Input
          v-model="registrationFormData.confirmPassword"
          :error="registrationFormErrors.confirmPassword"
          :success="registrationSubmitted && !registrationFormErrors.confirmPassword"
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
          :success="registrationSubmitted && !registrationFormErrors.username"
          label="Username"
          placeholder="Username"
          type="text"
          required
        />
        <InputFile
          v-model="registrationFormData.avatar"
          :error="registrationFormErrors.avatar"
          :success="registrationSubmitted && !registrationFormErrors.avatar"
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
      :loading="isSubmitting"
      :has-steps="false"
      @submit="handleLogIn"
    >
      <template #content>
        <Input
          v-model="logInFormData.email"
          :error="logInFormErrors.email"
          :success="logInSubmitted && !logInFormErrors.email"
          label="Email"
          placeholder="you@example.com"
          type="email"
        />
        <Input
          v-model="logInFormData.password"
          :error="logInFormErrors.password"
          :success="logInSubmitted && !logInFormErrors.password"
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
      :loading="isSubmitting"
      :has-steps="false"
      confirm-closing
      @close="handleCloseProfile"
      @submit="handleUpdateProfile"
    >
      <template #start>
        <div class="flex gap-2">
          <Avatar :src="user?.avatar" :status="isProfileComplete" />
          <div class="flex flex-col gap-1">
            <span class="text-xl text-[#0A0A0A]">{{ user?.fullName ?? "Username" }}</span>
            <span class="pl-0.5 text-[10px]" :class="isProfileComplete ? 'text-[#1DC31D]' : 'text-[#F4A316]'">
              {{ isProfileComplete ? "Profile is Complete" : "Incomplete Profile" }}
            </span>
          </div>
        </div>
      </template>
      <template #content>
        <Input
          v-model="profileFormData.full_name"
          :error="profileFormErrors.full_name"
          :success="profileSubmitted && !profileFormErrors.full_name"
          label="Full Name"
          placeholder="Username"
          :icon="PencilIcon"
        />
        <Input :model-value="user?.email ?? ''" label="Email" :icon="MarkIcon" disabled />
        <div class="flex gap-2">
          <Input
            v-model="profileFormData.mobile_number"
            :error="profileFormErrors.mobile_number"
            :success="profileSubmitted && !profileFormErrors.mobile_number"
            label="Mobile Number"
            type="tel"
            placeholder="599209820"
            :icon="MarkIcon"
            class="flex-3"
          />
          <Select
            v-model="profileFormData.age"
            :error="profileFormErrors.age"
            :success="profileSubmitted && !profileFormErrors.age"
            :options="getAgeOptions()"
            label="Age"
            :icon="ArrowDownIcon"
            class="flex-1"
          />
        </div>
        <InputFile
          v-model="profileFormData.avatar"
          :error="profileFormErrors.avatar"
          :success="profileSubmitted && !profileFormErrors.avatar"
          label="Upload Avatar"
        />
      </template>
    </Dialog>

    <Modal
      :visible="showCloseConfirm && !isProfileComplete"
      title="Your profile is incomplete."
      content="You won't be able to enroll in courses until you complete it. Close anyway?"
      button-label="Continue"
      :icon="WarningIcon"
      @continue="handleClickContinueProfileConfirm"
      @cancel="handleClickCancelProfileConfirm"
    />
    <Modal
      :visible="showProfileEditSuccessModal"
      title="Profile updated successfully"
      :icon="SuccessIcon"
      @continue="showProfileEditSuccessModal = false"
    />
  </div>
</template>
