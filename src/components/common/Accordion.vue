<script setup lang="ts">
import { provide, computed } from "vue";

interface Props {
  value?: (string | number)[];
}

const props = withDefaults(defineProps<Props>(), {
  value: () => []
});
const emit = defineEmits(["update:value", "change"]);

const activeValue = computed(() => props.value);

const updateValue = (newValue: string | number) => {
  const currentActiveValues = activeValue.value;
  const index = currentActiveValues.indexOf(newValue);
  let newActiveValues: (string | number)[];

  if (index > -1) {
    newActiveValues = currentActiveValues.filter((val) => val !== newValue);
  } else {
    newActiveValues = [...currentActiveValues, newValue];
  }

  emit("update:value", newActiveValues);
  emit("change", newActiveValues);
};

provide("accordionContext", {
  activeValue,
  updateValue
});
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <slot />
  </div>
</template>
