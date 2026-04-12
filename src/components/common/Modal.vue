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
  <div v-if="visible" class="font-inter fixed inset-0 z-50 flex items-center justify-center bg-black/20">
    <div class="rounded-4 flex max-w-119 flex-col rounded-2xl bg-[#FFFFFF] p-15">
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
            <Button
              :label="buttonLabel"
              class="flex-1 rounded-lg border-2 border-[#958FEF] text-[#4F46E5]"
              @click="emit('continue')"
            />
            <Button label="Cancel" class="flex-1 rounded-lg bg-[#4F46E5] text-[#FFFFFF]" @click="emit('cancel')" />
          </div>
          <Button v-else label="Done" class="w-full rounded-lg bg-[#4F46E5] text-[#FFFFFF]" @click="emit('continue')" />
        </div>
      </div>
    </div>
  </div>
</template>
