<script setup lang="ts">
import { inject } from "vue";

const panel = inject<{ isOpen: { value: boolean } }>("panelContext");
</script>

<template>
  <div
    class="grid overflow-hidden transition-all duration-300 ease-in-out"
    :class="[panel?.isOpen.value ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0']"
  >
    <div class="min-h-0">
      <div class="pt-2 pb-5">
        <slot />
      </div>
    </div>
  </div>
</template>
