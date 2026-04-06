<script setup lang="ts">
import { ref, computed, watch } from "vue";
import UploadIcon from "../icons/UploadIcon.vue";

interface Props {
  modelValue: File | null;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

const fileSize = computed(() => {
  if (!props.modelValue) return "";
  const mb = props.modelValue.size / (1024 * 1024);
  return `${mb.toFixed(1)}MB`;
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    emit("update:modelValue", target.files[0]);
  }
};

const triggerFileInput = () => fileInput.value?.click();

watch(
  () => props.modelValue,
  (newFile) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }

    if (newFile) {
      previewUrl.value = URL.createObjectURL(newFile);
    } else {
      previewUrl.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="font-inter flex w-full flex-col gap-2">
    <label v-if="label" class="text-sm font-medium text-[#1A1A1A]">{{ label }}</label>

    <input ref="fileInput" type="file" class="hidden" accept=".jpg, .jpeg, .png, .webp" @change="handleFileChange" />

    <div
      v-if="modelValue && previewUrl"
      class="flex h-48 w-full items-center gap-4 rounded-xl border border-[#D1D1D1] bg-[#F3F0FF] px-10"
    >
      <div class="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
        <img :src="previewUrl" class="h-full w-full object-cover" alt="Avatar preview" />
      </div>

      <div class="flex flex-col gap-0.5 text-left">
        <span class="max-w-50 truncate text-lg font-medium text-[#4B4B4B]">
          {{ modelValue.name }}
        </span>
        <span class="text-sm text-[#8A8A8A]">Size - {{ fileSize }}</span>
        <button
          type="button"
          class="crusor-pointer mt-1 text-left text-sm font-medium text-[#281ED2] underline underline-offset-4 hover:opacity-80"
          @click="triggerFileInput"
        >
          Change
        </button>
      </div>
    </div>

    <div
      v-else
      class="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-[#D1D1D1] transition-all"
      @click="triggerFileInput"
    >
      <UploadIcon class="h-10 w-10 text-[#8A8A8A]" />
      <div class="text-center">
        <p class="text-sm text-[#1A1A1A]">
          Drag and drop or <span class="font-medium text-[#4F46E5] underline underline-offset-4">Upload file</span>
        </p>
        <p class="mt-1 text-xs text-[#8A8A8A]">JPG, PNG or WebP</p>
      </div>
    </div>
  </div>
</template>
