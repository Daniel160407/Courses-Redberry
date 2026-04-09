<script setup lang="ts">
import { provide, computed } from "vue";

interface Props {
  value?: string | number | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:value", "change"]);

const activeValue = computed(() => props.value);

const updateValue = (newValue: string | number) => {
  const val = activeValue.value === newValue ? null : newValue;
  emit("update:value", val);
  emit("change", val);
};

provide("accordionContext", {
  activeValue,
  updateValue
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <slot />
  </div>
</template>
