<template>
  <section :id="id" :class="['section-shell', backgroundClass]">
    <div class="container mx-auto px-4 md:px-8 max-w-7xl">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  bg: {
    type: String,
    default: 'default' // 'default', 'light', 'dark'
  }
})

const backgroundClass = computed(() => {
  switch (props.bg) {
    case 'light':
      return 'bg-light-cyan';
    case 'dark':
      return 'surface-1 text-text-primary';
    case 'surface':
      return 'surface-0';
    case 'muted':
      return 'surface-1';
    case 'elevated':
      return 'surface-2';
    case 'glass':
      return 'surface-glass border-y border-border-subtle';
    default:
      return 'bg-transparent';
  }
})
</script>
