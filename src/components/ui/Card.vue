<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  interactive: {
    type: Boolean,
    default: true
  }
});

const baseClass = 'rounded-xl overflow-hidden border transition-all duration-300';

const variantClass = computed(() => {
  switch (props.variant) {
    case 'glass':
      return 'surface-glass border-border-subtle shadow-soft-dark text-text-primary';
    case 'dark':
      return 'surface-1 border-border-subtle shadow-soft-dark text-text-primary';
    case 'elevated':
      return 'surface-2 border-border-strong shadow-soft-dark text-text-primary';
    default:
      return 'bg-white border-gray-100 shadow-soft text-oxford-blue';
  }
});

const interactionClass = computed(() => {
  if (!props.interactive) {
    return '';
  }

  if (props.variant === 'default') {
    return 'hover:shadow-hover hover:-translate-y-1';
  }

  return 'hover:-translate-y-1 hover:shadow-hover-dark hover:border-ncs-blue/40';
});

const cardClass = computed(() => [baseClass, variantClass.value, interactionClass.value]);
</script>
