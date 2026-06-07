<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium cursor-pointer disabled:cursor-not-allowed transition-all duration-300 focus-ring active:scale-[0.99] disabled:active:scale-100',
      variants[variant],
      sizes[size],
      { 'opacity-50': disabled }
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
  primary: 'bg-chinese-bronze hover:bg-dark-bronze text-white rounded-xl shadow-soft hover:shadow-[0_0_0_1px_rgba(217,128,50,0.28),0_0_26px_rgba(217,128,50,0.24)] hover:-translate-y-0.5',
  secondary: 'bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/30 hover:shadow-[0_0_0_1px_rgba(4,138,191,0.28),0_0_20px_rgba(4,138,191,0.18)] hover:-translate-y-0.5',
  outline: 'border-2 border-chinese-bronze text-chinese-bronze hover:bg-chinese-bronze hover:text-white rounded-xl hover:shadow-[0_0_0_1px_rgba(217,128,50,0.3),0_0_22px_rgba(217,128,50,0.24)] hover:-translate-y-0.5',
  ghost: 'bg-transparent hover:bg-white/10 text-text-secondary hover:text-text-primary rounded-xl'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}
</script>
