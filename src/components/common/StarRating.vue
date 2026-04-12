<script setup lang="ts">
import { ref, computed } from "vue";
import RatingStarIcon from "@/components/icons/RatingStarIcon.vue";
import RatingStarHalfIcon from "@/components/icons/RatingStarHalfIcon.vue";

interface Props {
  modelValue: number;
  label?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Rate your experience",
  readonly: false
});

const emit = defineEmits(["update:modelValue"]);

const hoverValue = ref<number | null>(null);

const currentRating = computed(() => (hoverValue.value !== null ? hoverValue.value : props.modelValue));

const handleUpdate = (value: number) => {
  if (props.readonly) return;
  emit("update:modelValue", value);
};

const getStarStatus = (index: number) => {
  const val = currentRating.value;
  if (val >= index) return "full";
  if (val === index - 0.5) return "half";
  return "empty";
};
</script>

<template>
  <div class="flex flex-col items-center gap-4.5 font-sans">
    <h3 class="text-[16px] font-medium text-[#736BEA]">
      {{ label }}
    </h3>

    <div class="flex items-center gap-4.5" @mouseleave="hoverValue = null">
      <div
        v-for="i in 5"
        :key="i"
        class="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
        :class="{ 'cursor-default': readonly }"
      >
        <template v-if="getStarStatus(i) === 'full'">
          <RatingStarIcon class="h-11.5 w-11.5" />
        </template>
        <template v-else-if="getStarStatus(i) === 'half'">
          <RatingStarHalfIcon class="h-11.5 w-11.5" />
        </template>
        <template v-else>
          <RatingStarIcon class="h-11.5 w-11.5 opacity-20 grayscale" />
        </template>

        <div v-if="!readonly" class="absolute inset-0 flex">
          <div class="h-full w-1/2" @mouseenter="hoverValue = i - 0.5" @click="handleUpdate(i - 0.5)" />
          <div class="h-full w-1/2" @mouseenter="hoverValue = i" @click="handleUpdate(i)" />
        </div>
      </div>
    </div>
  </div>
</template>
