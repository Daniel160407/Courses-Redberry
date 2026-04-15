<script setup lang="ts">
import { ref, computed, watch, toRaw } from "vue";
import UploadIcon from "../icons/UploadIcon.vue";
import Button from "./Button.vue";

interface Props {
  modelValue: File | string | null;
  label?: string;
  error?: string;
  required?: boolean;
  success?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  success: false
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isTouched = ref(false);

const displayError = computed(() => {
  if (props.error) return props.error;
  if (isTouched.value && props.required && !props.modelValue) {
    return `${props.label || "Field"} is required`;
  }
  return null;
});

const fileSize = computed(() => {
  if (props.modelValue instanceof File) {
    const mb = props.modelValue.size / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  }
  return "";
});

const fileName = computed(() => {
  if (props.modelValue instanceof File) return props.modelValue.name;
  if (typeof props.modelValue === "string" && props.modelValue) return "Current Profile Image";
  return "";
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    isTouched.value = false;
    emit("update:modelValue", target.files[0]);
  }
};

const triggerFileInput = () => fileInput.value?.click();

watch(
  () => props.modelValue,
  (newFile) => {
    if (previewUrl.value?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.value);
    }

    if (newFile) {
      if (newFile instanceof File) {
        previewUrl.value = URL.createObjectURL(toRaw(newFile));
      } else {
        previewUrl.value = newFile;
      }
    } else {
      previewUrl.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="font-inter flex w-full flex-col gap-2">
    <label
      v-if="label"
      class="text-sm font-medium transition-colors"
      :class="displayError ? 'text-[#EF4444]' : success ? 'text-[#1DC31D]' : 'text-[#1A1A1A]'"
    >
      {{ label }}{{ required ? "*" : "" }}
    </label>

    <input ref="fileInput" type="file" class="hidden" accept=".jpg, .jpeg, .png, .webp" @change="handleFileChange" />

    <div
      v-if="modelValue && previewUrl"
      class="flex h-35.5 w-full items-center gap-4 rounded-xl border bg-[#F3F0FF] px-10 transition-all duration-500 ease-out"
      :class="displayError ? 'border-[#EF4444]' : success ? 'border-[#1DC31D]' : 'border-[#D1D1D1]'"
    >
      <div class="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
        <img :src="previewUrl" class="h-full w-full object-cover" alt="Avatar preview" />
      </div>

      <div class="flex flex-col gap-0.5 text-left">
        <span class="max-w-50 truncate text-lg font-medium text-[#4B4B4B]">
          {{ fileName }}
        </span>
        <span v-if="fileSize" class="text-sm text-[#8A8A8A]">Size - {{ fileSize }}</span>
        <Button type="button" variant="file-input-change" @click="triggerFileInput">Change</Button>
      </div>
    </div>

    <div
      v-else
      class="flex h-35 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] transition-all duration-500 ease-out"
      :class="displayError ? 'border-[#EF4444]' : success ? 'border-[#1DC31D]' : 'border-[#D1D1D1]'"
      @click="
        () => {
          triggerFileInput();
          isTouched = true;
        }
      "
    >
      <UploadIcon class="h-10 w-10 text-[#8A8A8A]" />
      <div class="text-center">
        <p class="text-sm text-[#1A1A1A]">
          Drag and drop or
          <span
            class="font-medium text-[#4F46E5] underline underline-offset-4"
            :class="{ 'text-[#EF4444]': displayError }"
          >
            Upload file
          </span>
        </p>
        <p class="mt-1 text-xs text-[#8A8A8A]" :class="{ 'text-[#EF4444]': displayError }">JPG, PNG or WebP</p>
      </div>
    </div>

    <span v-if="displayError" class="text-xs text-[#EF4444]">
      {{ displayError }}
    </span>
  </div>
</template>
