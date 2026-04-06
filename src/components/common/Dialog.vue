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
  hasSteps?: boolean;
  confirmClosing?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "submit", "close"]);

const step = ref<number>(1);

const openStep = (targetStep: number) => {
  if (targetStep >= 1 && targetStep <= 3) {
    step.value = targetStep;
    emit("update:visible", true);
  }
};

defineExpose({ openStep });

const close = () => {
  step.value = 1;
  if (!props.confirmClosing) emit("update:visible", false);
  emit("close");
};

const changeStep = (increment: number) => {
  const nextStep = step.value + increment;
  if (nextStep >= 1 && nextStep <= 3) {
    step.value = nextStep;
  }
};

const handleFinalClick = () => {
  if (step.value === 3 || !props.hasSteps) {
    emit("submit");
  } else {
    changeStep(1);
  }
};
</script>

<template>
  <div v-if="visible" class="font-inter fixed inset-0 z-50 flex items-center justify-center bg-black/20">
    <div class="relative flex w-115 flex-col gap-3 rounded-xl bg-white">
      <div class="flex justify-between px-4 py-6">
        <div>
          <Button
            v-if="hasSteps && step > 1"
            :icon="ArrowLeftIcon"
            type="button"
            class="cursor-pointer p-0! transition-opacity hover:opacity-70"
            @click="changeStep(-1)"
          />
        </div>
        <Button
          :icon="CloseIcon"
          type="button"
          class="cursor-pointer p-0! transition-opacity hover:opacity-70"
          @click="close"
        />
      </div>

      <form class="flex flex-col gap-6 px-13 pb-10" @submit.prevent="handleFinalClick">
        <div class="flex flex-col items-center justify-center gap-1.5">
          <span class="text-3xl">{{ props.title }}</span>
          <span class="text-md">{{ props.subtitle }}</span>
        </div>

        <slot v-if="$slots.start" name="start" />

        <div v-if="hasSteps" class="flex gap-2">
          <div class="h-2 w-29 rounded-[30px]" :class="step > 0 ? 'bg-[#4F46E5]' : 'bg-[#B7B3F4]'"></div>
          <div class="h-2 w-29 rounded-[30px]" :class="step > 1 ? 'bg-[#4F46E5]' : 'bg-[#B7B3F4]'"></div>
          <div class="h-2 w-29 rounded-[30px]" :class="step > 2 ? 'bg-[#4F46E5]' : 'bg-[#B7B3F4]'"></div>
        </div>

        <template v-if="!hasSteps">
          <slot name="content" />
        </template>
        <template v-else>
          <slot v-if="step === 1" name="step1" />
          <slot v-else-if="step === 2" name="step2" />
          <slot v-else-if="step === 3" name="step3" />
        </template>

        <Button
          type="submit"
          :label="(step === 3 || !hasSteps) && buttonLabel ? buttonLabel : 'Next'"
          class="rounded-md bg-[#4F46E5] text-[#FFFFFF]"
        />

        <div v-if="$slots.end" class="gap-2">
          <div class="flex w-full items-center gap-4">
            <div class="flex-1 border-t border-[#EAEAEA]"></div>
            <span class="text-sm font-medium text-[#757575]">or</span>
            <div class="flex-1 border-t border-[#EAEAEA]"></div>
          </div>
          <slot name="end" />
        </div>
      </form>
    </div>
  </div>
</template>
