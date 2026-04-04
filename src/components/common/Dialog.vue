<script setup lang="ts">
import { ref } from "vue";
import ArrowLeftIcon from "../icons/ArrowLeftIcon.vue";
import CloseIcon from "../icons/CloseIcon.vue";
import Button from "./Button.vue";

interface Props {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onSubmit?: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:visible", "submit"]);

const step = ref<number>(1);

const close = () => {
  step.value = 1;
  emit("update:visible", false);
};

const changeStep = (increment: number) => {
  const nextStep = step.value + increment;

  if (nextStep >= 1 && nextStep <= 3) {
    step.value = nextStep;
  }
};

const handleFinalClick = () => {
  if (step.value === 3) {
    emit("submit");
  } else {
    changeStep(1);
  }
};
</script>
<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
    <div class="relative flex w-115 flex-col gap-3 rounded-xl bg-white">
      <div class="flex justify-between px-4 py-6">
        <Button
          :icon="ArrowLeftIcon"
          type="button"
          @click="changeStep(-1)"
          class="cursor-pointer p-0! transition-opacity hover:opacity-70"
        />
        <Button
          :icon="CloseIcon"
          type="button"
          @click="close"
          class="cursor-pointer p-0! transition-opacity hover:opacity-70"
        />
      </div>

      <form @submit.prevent="handleFinalClick" class="flex flex-col gap-6 px-13 pb-10">
        <div class="flex flex-col items-center justify-center gap-1.5">
          <span class="text-3xl">{{ props.title }}</span>
          <span class="text-md">{{ props.subtitle }}</span>
        </div>

        <div class="flex gap-2">
          <div class="h-2 w-29 rounded-[30px]" :class="step > 0 ? 'bg-[#4F46E5]' : 'bg-[#B7B3F4]'"></div>
          <div class="h-2 w-29 rounded-[30px]" :class="step > 1 ? 'bg-[#4F46E5]' : 'bg-[#B7B3F4]'"></div>
          <div class="h-2 w-29 rounded-[30px]" :class="step > 2 ? 'bg-[#4F46E5]' : 'bg-[#B7B3F4]'"></div>
        </div>

        <slot v-if="$slots.step1 && step === 1" name="step1" />
        <slot v-else-if="$slots.step2 && step === 2" name="step2" />
        <slot v-else-if="$slots.step3 && step === 3" name="step3" />

        <Button
          type="submit"
          :label="step === 3 && buttonLabel ? buttonLabel : 'Next'"
          class="rounded-md bg-[#4F46E5] text-[#FFFFFF]"
        />

        <div v-if="$slots.end" class="flex w-full items-center gap-4">
          <div class="flex-1 border-t border-[#EAEAEA]"></div>
          <span class="text-sm font-medium text-[#757575]">or</span>
          <div class="flex-1 border-t border-[#EAEAEA]"></div>
        </div>

        <slot name="end" />
      </form>
    </div>
  </div>
</template>
