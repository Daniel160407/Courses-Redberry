<script setup lang="ts">
import { ref, computed } from "vue";
import RatingStarIcon from "@/components/icons/RatingStarIcon.vue";

interface Props {
  modelValue: number;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Rate your experience",
  disabled: false
});

const emit = defineEmits(["update:modelValue", "submit"]);

const hoverValue = ref<number | null>(null);

const currentRating = computed(() => (hoverValue.value !== null ? hoverValue.value : props.modelValue));

const handleUpdate = (value: number) => {
  if (props.disabled) return;
  emit("update:modelValue", value);
  emit("submit", value);
};

const getStarStatus = (index: number) => {
  const val = currentRating.value;
  if (val >= index) return "full";
  return "empty";
};
</script>

<template>
  <div class="flex flex-col items-center gap-4.5 font-sans">
    <h3 class="text-[16px] font-medium text-[#736BEA]">
      {{ label }}
    </h3>

    <div
      class="flex items-center gap-4.5"
      :class="{ 'pointer-events-none opacity-50': disabled }"
      @mouseleave="hoverValue = null"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
        @mouseenter="!disabled && (hoverValue = i)"
        @click="handleUpdate(i)"
      >
        <template v-if="getStarStatus(i) === 'full'">
          <RatingStarIcon class="h-11.5 w-11.5" />
        </template>
        <template v-else>
          <RatingStarIcon class="h-11.5 w-11.5 opacity-20 grayscale" />
        </template>
      </div>
    </div>
  </div>
</template>
