<template>
  <section :id="id" :class="['section-shell relative isolate overflow-hidden', backgroundClass]">
    <AmbientStarfield
      v-if="showStarfield"
      :density="starfieldDensity"
      :variant="starfieldVariant"
    />
    <div ref="contentRef" class="section-content-layer relative z-[1]">
      <div class="site-container" :class="containerBackdropClass">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import AmbientStarfield from '@/components/AmbientStarfield.vue';
import { observeRevealTargets } from '@/composables/useScrollReveal';

const contentRef = ref(null);
let disconnectRevealObserver = () => {};

const setupRevealObserver = async () => {
  await nextTick();
  requestAnimationFrame(() => {
    disconnectRevealObserver();
    disconnectRevealObserver = observeRevealTargets(contentRef.value);
  });
};

onMounted(() => {
  setupRevealObserver();
});

onBeforeUnmount(() => {
  disconnectRevealObserver();
});

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

const showStarfield = computed(() => props.bg !== 'glass');

const starfieldVariant = computed(() => (props.bg === 'light' ? 'light' : 'dark'));

const starfieldDensity = computed(() => {
  if (props.bg === 'dark') return 1.25;
  if (props.bg === 'light') return 0.9;
  return 1;
});

const containerBackdropClass = computed(() => '');

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
