<script setup lang="ts">
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import Button from "./Button.vue";
import { computed, ref } from "vue";

interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue: string;
  options: readonly Option[];
}

const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const currentLabel = computed(() => {
  const selectedOption = props.options.find((opt) => opt.value === props.modelValue);
  return selectedOption ? selectedOption.label : props.options[0]?.label;
});

const extended = ref(false);

const handleOptionClick = (option: Option) => {
  emit("update:modelValue", option.value);
  extended.value = false;
};
</script>

<template>
  <div class="relative flex flex-col gap-2.75">
    <Button
      :icon="ArrowDownIcon"
      icon-pos="right"
      class="rounded-lg border border-[#F5F5F5] bg-[#FFFFFF] px-5 py-1.75 text-[16px] font-medium text-[#666666]"
      @click="extended = !extended"
    >
      Sort By: <span class="font-medium text-[#4F46E5]">{{ currentLabel }}</span>
    </Button>

    <div
      v-if="extended"
      class="absolute top-full left-0 z-20 mt-2 w-full overflow-hidden rounded-[10px] border border-[#F5F5F5] bg-white shadow-lg"
    >
      <Button
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        class="w-full justify-start px-5 py-2.5 text-[16px] font-medium"
        :class="currentLabel === option.label ? 'bg-[#DDDBFA] text-[#4F46E5]' : 'bg-[#FFFFFF] text-[#666666]'"
        @click="handleOptionClick(option)"
      />
    </div>
  </div>
</template>
