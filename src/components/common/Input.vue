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
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  autocomplete: "new-passsword"
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

const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});
</script>

<template>
  <div class="font-inter flex w-full flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium" :class="displayError ? 'text-[#EF4444]' : 'text-[#3D3D3D]'">
      {{ label }}{{ required ? "*" : "" }}
    </label>

    <div class="relative">
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur"
        :class="[
          'w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200 outline-none',
          displayError
            ? 'border-[#EF4444] placeholder-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
            : 'border-[1.5px] border-[#D1D1D1] placeholder-[#8A8A8A] focus:border-[#ADADAD] focus:placeholder-[#D1D1D1]'
        ]"
      />

      <div class="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
        <component v-if="icon && type !== 'password'" :is="icon" class="h-6 w-6" />

        <div v-if="type === 'password'" @click="togglePassword" class="cursor-pointer select-none">
          <EyeCloseIcon
            v-if="!showPassword"
            class="h-6 w-6"
            :class="displayError ? 'text-[#EF4444]' : 'text-[#8A8A8A]'"
          />
          <EyeOpenIcon v-else class="h-6 w-6" :class="displayError ? 'text-[#EF4444]' : 'text-[#8A8A8A]'" />
        </div>
      </div>
    </div>

    <span v-if="displayError" class="text-xs text-[#EF4444]">
      {{ displayError }}
    </span>
  </div>
</template>
