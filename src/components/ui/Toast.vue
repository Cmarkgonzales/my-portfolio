<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="show" class="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white rounded-lg shadow-hover p-4 border-l-4 border-chinese-bronze max-w-sm">
        <div class="text-sm text-gray-800 font-medium">{{ message }}</div>
        <button @click="close" class="text-gray-400 hover:text-gray-600 focus-ring rounded-md">
          <span class="sr-only">Close notification</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['update:show'])

const close = () => {
  emit('update:show', false)
}

let timeout;
watch(() => props.show, (val) => {
  if (val) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
