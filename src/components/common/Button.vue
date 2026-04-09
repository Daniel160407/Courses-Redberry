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
  <button :type="props.type" :disabled="props.loading" class="flex cursor-pointer items-center justify-center gap-2">
    <slot v-if="props.iconPos === 'left'" name="icon">
      <component
        :is="props.icon"
        v-if="props.icon"
        class="h-6 w-6"
        :style="iconSize ? { height: `${iconSize}rem`, width: `${iconSize}rem` } : {}"
      />
    </slot>

    <span class="leading-none">
      <slot>{{ props.label }}</slot>
    </span>

    <slot v-if="props.iconPos === 'right'" name="icon">
      <component :is="props.icon" v-if="props.icon" class="h-6 w-6" />
    </slot>
  </button>
</template>
