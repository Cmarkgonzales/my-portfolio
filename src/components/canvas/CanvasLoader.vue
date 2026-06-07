<template>
    <div
        class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Loading 3D desktop scene"
    >
        <span class="canvas-loader" aria-hidden="true"></span>
        <p class="mt-10 text-sm font-extrabold text-white/90 tabular-nums">
            {{ progressLabel }}
        </p>
    </div>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        progress: {
            type: Number,
            default: 0,
        },
    });

    const progressLabel = computed(() => `${props.progress.toFixed(2)}%`);
</script>
