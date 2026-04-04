<script setup lang="ts">
import type { Component } from "vue";

interface Props {
  label?: string;
  icon?: Component;
  iconPos?: "left" | "right";
  loading?: boolean;
  type?: "button" | "submit";
}

const props = withDefaults(defineProps<Props>(), {
  iconPos: "left",
  loading: false,
  type: "button"
});
</script>
<template>
  <button
    :type="props.type"
    :loading="props.loading"
    :disabled="props.loading"
    class="flex cursor-pointer items-center justify-center gap-2 p-4"
  >
    <slot v-if="iconPos === 'left'" name="icon">
      <component v-if="icon" :is="icon" class="h-6 w-6" />
    </slot>

    <span v-if="label" class="leading-none">{{ label }}</span>

    <slot v-if="iconPos === 'right'" name="icon">
      <component v-if="icon" :is="icon" class="h-6 w-6" />
    </slot>
  </button>
</template>
