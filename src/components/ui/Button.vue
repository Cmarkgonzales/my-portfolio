<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-300 focus-ring',
      variants[variant],
      sizes[size],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variants = {
  primary: 'bg-chinese-bronze hover:bg-dark-bronze text-white rounded-lg shadow-soft hover:shadow-hover hover:-translate-y-0.5',
  secondary: 'bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:-translate-y-0.5',
  outline: 'border-2 border-chinese-bronze text-chinese-bronze hover:bg-chinese-bronze hover:text-white rounded-lg hover:-translate-y-0.5',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 rounded-lg'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}
</script>
