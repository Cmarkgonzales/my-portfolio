<template>
  <Modal
    v-model="isOpen"
    :title="project?.name ?? 'Case Study'"
    title-id="case-study-title"
  >
    <div v-if="project" class="space-y-6">
      <div v-if="project.role" class="space-y-1">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-sky-cyan">Role</h4>
        <p class="text-text-secondary text-sm leading-relaxed">{{ project.role }}</p>
      </div>

      <div v-if="project.problem" class="space-y-1">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-sky-cyan">Problem</h4>
        <p class="text-text-secondary text-sm leading-relaxed">{{ project.problem }}</p>
      </div>

      <div v-if="project.solution" class="space-y-1">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-sky-cyan">Solution</h4>
        <p class="text-text-secondary text-sm leading-relaxed">{{ project.solution }}</p>
      </div>

      <div v-if="project.impact" class="space-y-1">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-sky-cyan">Impact</h4>
        <p class="text-text-secondary text-sm leading-relaxed">{{ project.impact }}</p>
      </div>

      <div v-if="project.metrics?.length" class="space-y-2">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-sky-cyan">Metrics</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-text-secondary">
          <li v-for="(metric, index) in project.metrics" :key="`metric-${index}`">
            {{ metric }}
          </li>
        </ul>
      </div>

      <div v-if="project.highlights?.length" class="space-y-2">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-sky-cyan">Highlights</h4>
        <ul class="list-disc list-inside space-y-1 text-sm text-text-secondary">
          <li v-for="(highlight, index) in project.highlights" :key="`highlight-${index}`">
            {{ highlight }}
          </li>
        </ul>
      </div>

      <div v-if="!hasCaseStudyFields" class="space-y-3">
        <p class="text-text-secondary text-sm leading-relaxed">{{ project.description }}</p>
        <div v-if="project.technologies?.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="tech in project.technologies"
            :key="`modal-tech-${tech}`"
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium border border-sky-cyan/30 bg-ncs-blue/20 text-sky-cyan"
          >
            {{ tech }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-border-subtle">
        <a
          v-if="isValidUrl(project.demoLink)"
          :href="project.demoLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-ncs-blue/15 text-sky-cyan hover:bg-ncs-blue/25 hover:text-white transition-colors focus-ring"
        >
          <font-awesome-icon class="mr-2" icon="fas fa-external-link-alt" />
          Live Demo
        </a>
        <a
          v-if="project.githubLink"
          :href="project.githubLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-white/8 text-text-secondary hover:bg-white/15 hover:text-text-primary transition-colors focus-ring"
        >
          <font-awesome-icon class="mr-2" icon="fab fa-github" />
          Source
        </a>
        <button
          type="button"
          class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors focus-ring"
          @click="close"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { computed } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import { isValidUrl } from '@/utils/url';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  project: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const hasCaseStudyFields = computed(() => {
  if (!props.project) return false;
  return Boolean(
    props.project.role ||
    props.project.problem ||
    props.project.solution ||
    props.project.impact ||
    props.project.metrics?.length ||
    props.project.highlights?.length
  );
});

const close = () => {
  isOpen.value = false;
};
</script>
