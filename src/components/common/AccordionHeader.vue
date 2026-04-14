<script setup lang="ts">
import { inject, type Component } from "vue";
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import Button from "./Button.vue";

const props = defineProps<{
  icon?: Component;
}>();

const context = inject<{ updateValue: (v: any) => void }>("accordionContext");
const panel = inject<{ value: any; isOpen: { value: boolean } }>("panelContext");

const toggle = () => {
  if (context && panel) {
    context.updateValue(panel.value);
  }
};
</script>

<template>
  <Button
    type="button"
    variant="accordion-header"
    :class="panel?.isOpen.value ? 'text-[#130E67]!' : 'text-[#8A8A8A]!'"
    @click="toggle"
  >
    <div class="flex items-center gap-2">
      <component :is="props.icon" v-if="props.icon" />
      <slot />
    </div>
    <span :class="{ 'rotate-180': panel?.isOpen.value }" class="transition-transform duration-200"
      ><arrow-down-icon
    /></span>
  </Button>
</template>
