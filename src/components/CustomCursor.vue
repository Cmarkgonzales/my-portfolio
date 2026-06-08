<template>
    <div
        v-if="isVisible"
        class="pointer-events-none fixed inset-0 z-[10000]"
        aria-hidden="true"
    >
        <div
            ref="ringRef"
            class="custom-cursor-ring absolute rounded-full border-2 border-sky-cyan/85 will-change-transform"
            :class="{ 'custom-cursor-ring--interactive': isInteractive }"
        />
        <div
            ref="dotRef"
            class="custom-cursor-dot absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-cyan will-change-transform"
            :class="{ 'custom-cursor-dot--interactive': isInteractive }"
        />
    </div>
</template>

<script setup>
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import { useCustomCursor } from '@/composables/useCustomCursor';

    const RING_LERP = 0.18;
    const RING_SIZE = 28;
    const RING_SIZE_INTERACTIVE = 44;

    const ringRef = ref(null);
    const dotRef = ref(null);

    const {
        cursorX,
        cursorY,
        isInteractive,
        canUseCustomCursor,
        attachTracking,
        detachTracking,
    } = useCustomCursor();

    const isVisible = computed(() => canUseCustomCursor.value);

    let animationFrameId = null;
    let ringX = -100;
    let ringY = -100;

    const applyRingSize = (expanded) => {
        const ring = ringRef.value;
        if (!ring) return;

        const size = expanded ? RING_SIZE_INTERACTIVE : RING_SIZE;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.marginLeft = `${-size / 2}px`;
        ring.style.marginTop = `${-size / 2}px`;
    };

    const tick = () => {
        ringX += (cursorX.value - ringX) * RING_LERP;
        ringY += (cursorY.value - ringY) * RING_LERP;

        const ring = ringRef.value;
        const dot = dotRef.value;

        if (ring) {
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        }

        if (dot) {
            dot.style.transform = `translate3d(${cursorX.value}px, ${cursorY.value}px, 0)`;
        }

        animationFrameId = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
        if (animationFrameId !== null) return;
        ringX = cursorX.value;
        ringY = cursorY.value;
        animationFrameId = requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    watch(isInteractive, (interactive) => {
        applyRingSize(interactive);
    });

    watch(canUseCustomCursor, (enabled) => {
        if (enabled) {
            attachTracking();
            startAnimation();
            requestAnimationFrame(() => applyRingSize(isInteractive.value));
        } else {
            stopAnimation();
            detachTracking();
        }
    }, { immediate: true });

    onMounted(() => {
        if (canUseCustomCursor.value) {
            requestAnimationFrame(() => applyRingSize(isInteractive.value));
        }
    });

    onUnmounted(() => {
        stopAnimation();
        detachTracking();
    });
</script>

<style scoped>
    .custom-cursor-ring {
        transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .custom-cursor-ring--interactive {
        border-color: rgba(217, 128, 50, 0.9);
        background-color: rgba(217, 128, 50, 0.08);
    }

    .custom-cursor-dot {
        transition: background-color 0.2s ease;
    }

    .custom-cursor-dot--interactive {
        background-color: #d98032;
    }
</style>
