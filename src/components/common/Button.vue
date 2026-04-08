<script setup lang="ts">
import type { Component } from "vue";

interface Props {
  label?: string;
  icon?: Component;
  iconPos?: "left" | "right";
  iconSize?: number;
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
    <slot v-if="props.iconPos === 'left'" name="icon">
      <component
        :is="props.icon"
        v-if="props.icon"
        :style="iconSize ? { height: `${iconSize}rem`, width: `${iconSize}rem` } : {}"
        :class="!iconSize ? 'h-6 w-6' : ''"
      />
    </slot>

    <span v-if="props.label" class="leading-none">{{ props.label }}</span>

    <slot v-if="props.iconPos === 'right'" name="icon">
      <component :is="props.icon" v-if="props.icon" class="h-6 w-6" />
    </slot>
  </button>
</template>
