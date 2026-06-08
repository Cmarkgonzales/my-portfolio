<template>
    <div
        class="inline-flex items-center rounded-lg border border-border-subtle bg-white/5 p-0.5"
        role="group"
        aria-label="Motion preference"
    >
        <button
            type="button"
            class="motion-toggle-btn focus-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200"
            :class="motionPreference === 'full' ? 'bg-ncs-blue/25 text-text-primary' : 'text-text-secondary hover:text-text-primary'"
            :aria-pressed="motionPreference === 'full'"
            @click="setMotionPreference('full')"
        >
            Full
        </button>
        <button
            type="button"
            class="motion-toggle-btn focus-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200"
            :class="motionPreference === 'reduced' ? 'bg-ncs-blue/25 text-text-primary' : 'text-text-secondary hover:text-text-primary'"
            :aria-pressed="motionPreference === 'reduced'"
            @click="setMotionPreference('reduced')"
        >
            Reduced
        </button>
    </div>
</template>

<script setup>
    import { useMotion } from '@/composables/useMotion';

    const { motionPreference, setMotionPreference } = useMotion();
</script>
