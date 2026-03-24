<template>
  <span :class="['inline-flex items-center rounded-full font-medium', variants[variant]]">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})

const variants = {
  default: 'bg-gray-100 text-gray-700 px-3 py-1 text-xs',
  primary: 'bg-light-cyan text-ncs-blue px-3 py-1 text-xs',
  outline: 'border border-gray-200 text-gray-600 px-3 py-1 text-xs'
}
</script>
