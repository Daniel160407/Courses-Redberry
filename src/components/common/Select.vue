<script setup lang="ts">
import { computed, ref, type Component } from "vue";

interface Props {
  modelValue: string | number | string[] | number[];
  label?: string;
  options: { label: string; value: string | number }[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  icon?: Component;
  success?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  success: false,
  placeholder: "Select an option"
});

const emit = defineEmits(["update:modelValue"]);

const isTouched = ref(false);

const displayError = computed(() => {
  if (props.error) return props.error;

  const isEmpty = Array.isArray(props.modelValue) ? props.modelValue.length === 0 : !props.modelValue;

  if (isTouched.value && props.required && isEmpty) {
    return `${props.label || "Field"} is required`;
  }

  return null;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  isTouched.value = false;
  emit("update:modelValue", target.value);
};

const handleBlur = () => {
  isTouched.value = true;
};
</script>

<template>
  <div class="flex w-full flex-col gap-2" :class="{ 'opacity-60': disabled }">
    <label
      v-if="label"
      class="text-sm font-medium transition-colors"
      :class="displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : 'text-[#3D3D3D]'"
    >
      {{ label }}{{ required ? "*" : "" }}
    </label>

    <div class="relative">
      <select
        :value="modelValue"
        :disabled="disabled"
        class="w-full appearance-none rounded-lg border bg-white px-4 py-3 text-sm text-[#ADADAD] transition-all duration-200 outline-none"
        :class="[
          disabled ? 'cursor-not-allowed bg-[#F5F5F5]' : 'cursor-pointer',
          displayError
            ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
            : success
              ? 'border-[#1DC31D] focus:ring-1 focus:ring-[#1DC31D]'
              : 'border-[#D1D1D1] focus:border-[#ADADAD]'
        ]"
        @change="handleChange"
        @blur="handleBlur"
      >
        <option value="" disabled selected hidden>{{ placeholder }}</option>

        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div class="absolute top-1/2 right-4 flex -translate-y-1/2 items-center">
        <component
          :is="icon"
          v-if="icon"
          class="h-6 w-6"
          :class="displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : ''"
        />
      </div>
    </div>

    <span v-if="displayError" class="text-xs text-[#EF4444]">
      {{ displayError }}
    </span>
  </div>
</template>
