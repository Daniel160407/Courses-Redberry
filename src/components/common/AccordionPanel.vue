<script setup lang="ts">
import { provide, inject, computed } from "vue";

const props = defineProps<{
  value: string | number;
}>();

const context = inject<{ activeValue: { value: (string | number)[] } }>("accordionContext");

const isOpen = computed(() => context?.activeValue.value.includes(props.value) ?? false);

provide("panelContext", {
  value: props.value,
  isOpen
});
</script>

<template>
  <div class="flex flex-col">
    <slot />
  </div>
</template>
