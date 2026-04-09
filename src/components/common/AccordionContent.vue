<script setup lang="ts">
import { inject } from "vue";

const panel = inject<{ isOpen: { value: boolean } }>("panelContext");
</script>

<template>
  <div v-if="panel?.isOpen.value" :class="panel.isOpen ? 'text-[#130E67]!' : 'text-[#292929]!'" class="pb-4">
    <slot />
  </div>
</template>
