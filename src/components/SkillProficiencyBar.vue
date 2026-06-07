<template>
    <div ref="barRef" class="skill-bar-row">
        <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-sm font-medium text-text-primary">{{ name }}</span>
            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-white/12 text-text-secondary shrink-0">
                {{ level }}
            </span>
        </div>
        <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
                class="h-full rounded-full transition-[width] duration-[1200ms] ease-out"
                :class="fillClass"
                :style="{ width: barWidth }"
            />
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import { useCountUp } from '@/composables/useCountUp';

    const props = defineProps({
        name: { type: String, required: true },
        level: { type: String, required: true },
        proficiency: { type: Number, required: true },
        fillClass: { type: String, default: 'bg-gradient-to-r from-ncs-blue to-sky-cyan' },
    });

    const barRef = ref(null);
    const { displayValue } = useCountUp(barRef, { end: props.proficiency, suffix: '%' });
    const barWidth = computed(() => displayValue.value || '0%');
</script>
