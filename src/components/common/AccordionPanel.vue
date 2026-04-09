<script setup lang="ts">
import { provide, inject, computed } from "vue";

const props = defineProps<{
  value: string | number;
}>();

const context = inject<{ activeValue: { value: any } }>("accordionContext");

const isOpen = computed(() => context?.activeValue.value === props.value);

provide("panelContext", {
  value: props.value,
  isOpen
});
</script>

<template>
  <div class="flex flex-col border-b border-gray-200">
    <slot />
  </div>
</template>
