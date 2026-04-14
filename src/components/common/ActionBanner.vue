<script setup lang="ts">
import WarningIcon from "../icons/WarningIcon.vue";
import ArrowRightIcon from "../icons/ArrowRightIcon.vue";
import Button from "./Button.vue";

interface Props {
  title?: string;
  description?: string;
  buttonLabel?: string;
}

defineProps<Props>();
defineEmits(["action"]);
</script>

<template>
  <div class="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
    <div class="flex w-87.75 flex-col gap-2.25">
      <div v-if="title" class="flex items-center gap-1.5">
        <WarningIcon class="h-5.5 w-5.5" />
        <span class="text-[#292929]">{{ title }}</span>
      </div>
      <div v-if="description">
        <span class="text-[#8A8A8A]">{{ description }}</span>
      </div>
    </div>
    <Button
      v-if="buttonLabel"
      :label="buttonLabel"
      :icon="ArrowRightIcon"
      icon-pos="right"
      variant="banner-action"
      @click="$emit('action')"
    />
  </div>
</template>
