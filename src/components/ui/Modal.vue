<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-oxford-blue/80 backdrop-blur-sm p-4"
        @click="close"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          class="surface-glass border border-border-subtle text-text-primary rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="flex justify-between items-center p-6 border-b border-border-subtle">
            <h3 :id="titleId" class="text-xl font-bold text-text-primary">{{ title }}</h3>
            <button
              ref="closeButtonRef"
              type="button"
              class="text-text-muted hover:text-text-primary transition-colors p-1 focus-ring rounded-md"
              @click="close"
            >
              <span class="sr-only">Close modal</span>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  titleId: {
    type: String,
    default: 'modal-title'
  }
});

const emit = defineEmits(['update:modelValue']);

const dialogRef = ref(null);
const closeButtonRef = ref(null);
let previouslyFocused = null;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const getFocusableElements = () => {
  if (!dialogRef.value) return [];
  return Array.from(dialogRef.value.querySelectorAll(FOCUSABLE_SELECTOR));
};

const trapFocus = (event) => {
  if (!props.modelValue || event.key !== 'Tab') return;

  const focusable = getFocusableElements();
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const onKeydown = (event) => {
  if (!props.modelValue) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    close();
    return;
  }

  trapFocus(event);
};

const close = () => {
  emit('update:modelValue', false);
};

const restoreFocus = () => {
  if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
    previouslyFocused.focus();
  }
  previouslyFocused = null;
};

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);

    await nextTick();
    const focusable = getFocusableElements();
    (focusable[0] || closeButtonRef.value)?.focus();
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    restoreFocus();
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
