<script setup lang="ts">
import type { Component } from "vue";
import Button from "./Button.vue";

interface Props {
  visible?: boolean;
  title?: string;
  content?: string;
  icon?: Component;
  buttonLabel?: string;
}

const { visible, title, content, icon, buttonLabel } = defineProps<Props>();
const emit = defineEmits(["continue", "cancel"]);
</script>
<template>
  <div v-if="visible" class="fixed inset-0 z-300 bg-black/20" />

  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="visible" class="font-inter pointer-events-none fixed inset-0 z-310 flex items-center justify-center">
      <div
        class="rounded-4 pointer-events-auto relative flex max-w-119 flex-col rounded-2xl bg-[#FFFFFF] p-15 shadow-2xl"
      >
        <div class="flex flex-col gap-[10.5]">
          <div class="flex flex-col items-center gap-10.5">
            <div class="flex flex-col items-center gap-6 text-center">
              <component :is="icon" v-if="icon" class="h-23.5 w-23.5" />
              <span v-if="title" class="text-[32px] font-semibold text-[#3D3D3D]">{{ title }}</span>
              <slot>
                <span v-if="content" class="text-[20px] text-[#3D3D3D]">{{ content }}</span>
              </slot>
            </div>
            <div v-if="buttonLabel" class="flex w-full gap-2">
              <Button :label="buttonLabel" variant="modal-outline" class="flex-1" @click="emit('continue')" />
              <Button label="Cancel" variant="modal-primary" class="flex-1" @click="emit('cancel')" />
            </div>
            <Button v-else label="Done" variant="modal-primary" class="w-full" @click="emit('continue')" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
