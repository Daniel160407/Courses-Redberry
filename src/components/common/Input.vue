<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import EyeOpenIcon from "../icons/EyeOpenIcon.vue";
import EyeCloseIcon from "../icons/EyeCloseIcon.vue";

interface Props {
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: Component;
  disabled?: boolean;
  success?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  disabled: false,
  success: false
});

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const isTouched = ref(false);

const displayError = computed(() => {
  if (props.error) return props.error;

  if (isTouched.value && props.required && !props.modelValue) {
    return `${props.label || "Field"} is required`;
  }

  return null;
});

const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.value.length > 0) isTouched.value = false;
  emit("update:modelValue", target.value);
};

const handleBlur = () => {
  isTouched.value = true;
};
</script>

<template>
  <div class="font-inter flex w-full flex-col gap-2">
    <label
      v-if="label"
      class="text-sm font-medium"
      :class="displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : 'text-[#3D3D3D]'"
    >
      {{ label }}{{ required ? "*" : "" }}
    </label>

    <div class="relative">
      <div v-if="type === 'tel'" class="absolute top-1/2 left-4 -translate-y-1/2 pr-2 text-sm text-[#D1D1D1]">+995</div>

      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="new-password"
        :class="[
          'w-full rounded-lg border py-3 text-sm transition-all duration-200 outline-none',
          type === 'tel' ? 'pr-4 pl-14 text-[#ADADAD]' : 'px-4',
          disabled ? 'cursor-not-allowed border-[#ADADAD] bg-[#F5F5F5] text-[#ADADAD]' : '',
          displayError
            ? 'border-[#EF4444] placeholder-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
            : success
              ? 'border-[#1DC31D] focus:ring-1 focus:ring-[#1DC31D]'
              : 'border-[1.5px] border-[#D1D1D1] placeholder-[#8A8A8A] focus:border-[#ADADAD] focus:placeholder-[#D1D1D1]'
        ]"
        @input="handleInput"
        @blur="handleBlur"
      />

      <div class="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
        <component
          :is="icon"
          v-if="icon && type !== 'password'"
          class="h-6 w-6 text-[#ADADAD]"
          :class="[displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : '']"
        />

        <div v-if="type === 'password'" class="cursor-pointer select-none" @click="togglePassword">
          <EyeCloseIcon
            v-if="!showPassword"
            class="h-6 w-6"
            :class="displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : 'text-[#8A8A8A]'"
          />
          <EyeOpenIcon
            v-else
            class="h-6 w-6"
            :class="displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : 'text-[#8A8A8A]'"
          />
        </div>
      </div>
    </div>

    <span v-if="displayError" class="text-xs text-[#EF4444]">
      {{ displayError }}
    </span>
  </div>
</template>
