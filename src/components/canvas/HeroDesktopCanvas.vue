<template>
    <div class="hero-tech-stage relative h-full w-full overflow-visible">
        <div class="hero-sphere-anchor pointer-events-none absolute -inset-[10%] z-0" aria-hidden="true">
            <div class="hero-sphere-glow" />
            <HeroCanvasSparkles />
            <div class="hero-sphere-wash" />
        </div>
        <CanvasLoader v-if="loading" :progress="progress" />
        <div
            ref="containerEl"
            class="hero-canvas-viewport pointer-events-auto absolute inset-0 z-[2] touch-none"
            aria-hidden="true"
        />
        <HeroTechFloatLabels />
    </div>
</template>

<script setup>
    import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
    import { initHeroDesktopScene } from '@/composables/useHeroDesktopScene';
    import CanvasLoader from '@/components/canvas/CanvasLoader.vue';
    import HeroCanvasSparkles from '@/components/canvas/HeroCanvasSparkles.vue';
    import HeroTechFloatLabels from '@/components/canvas/HeroTechFloatLabels.vue';

    const containerEl = ref(null);
    const loading = ref(true);
    const progress = ref(0);
    let sceneHandle = null;

    onMounted(async () => {
        await nextTick();
        requestAnimationFrame(() => {
            if (!containerEl.value) return;

            sceneHandle = initHeroDesktopScene(containerEl.value, {
                onProgress: (value) => {
                    progress.value = value;
                },
                onLoad: () => {
                    loading.value = false;
                },
                onError: () => {
                    loading.value = false;
                },
            });
        });
    });

    onBeforeUnmount(() => {
        sceneHandle?.dispose();
        sceneHandle = null;
    });
</script>

<style scoped>
    .hero-sphere-anchor {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: sphereBreathe 9s ease-in-out infinite;
    }

    .hero-sphere-wash,
    .hero-sphere-glow {
        position: absolute;
        pointer-events: none;
    }

    .hero-sphere-wash {
        inset: 4%;
        background:
            radial-gradient(ellipse 88% 88% at 50% 48%, rgba(10, 36, 62, 0.07) 0%, transparent 72%),
            radial-gradient(ellipse 60% 50% at 34% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 100%),
            radial-gradient(ellipse 55% 45% at 66% 72%, rgba(1, 12, 26, 0.06) 0%, transparent 100%);
        filter: blur(6px);
    }

    .hero-sphere-glow {
        inset: -4%;
        background:
            radial-gradient(ellipse 92% 92% at 50% 50%, rgba(7, 178, 217, 0.07) 0%, rgba(4, 138, 191, 0.035) 42%, transparent 76%),
            radial-gradient(ellipse 70% 65% at 52% 56%, rgba(217, 128, 50, 0.04) 0%, transparent 68%);
        filter: blur(22px);
    }

    @keyframes sphereBreathe {
        0%,
        100% {
            opacity: 0.92;
        }

        50% {
            opacity: 1;
        }
    }

    .hero-canvas-viewport :deep(canvas) {
        display: block;
        width: 100% !important;
        height: 100% !important;
        background: transparent !important;
    }

    @media (prefers-reduced-motion: reduce) {
        .hero-sphere-anchor {
            animation: none;
        }
    }
</style>
