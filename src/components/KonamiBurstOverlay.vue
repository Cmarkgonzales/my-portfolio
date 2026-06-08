<template>
    <Teleport to="body">
        <Transition name="konami-fade">
            <canvas
                v-if="active"
                ref="canvasRef"
                class="fixed inset-0 z-[9999] pointer-events-none"
                aria-hidden="true"
            />
        </Transition>
    </Teleport>
</template>

<script setup>
    import { onBeforeUnmount, ref, watch } from 'vue';

    const props = defineProps({
        active: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['complete']);

    const canvasRef = ref(null);
    let animationId = null;
    let particles = [];
    let startTime = 0;

    const TINTS = ['#d9f5ff', '#8ec8e8', '#07b2d9', '#f2b672', '#ffffff'];
    const DURATION_MS = 2200;
    const PARTICLE_COUNT = 120;

    const createParticles = (width, height) => {
        particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
            const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + Math.random() * 0.4;
            const speed = Math.random() * 4 + 2;
            return {
                x: width * 0.5,
                y: height * 0.5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 2.5 + 1,
                alpha: Math.random() * 0.5 + 0.5,
                tint: TINTS[index % TINTS.length],
            };
        });
    };

    const draw = (timestamp) => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const elapsed = timestamp - startTime;
        const progress = elapsed / DURATION_MS;

        ctx.clearRect(0, 0, width, height);

        for (const particle of particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.04;
            particle.alpha = Math.max(0, 1 - progress);

            ctx.beginPath();
            ctx.fillStyle = particle.tint;
            ctx.globalAlpha = particle.alpha;
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        if (elapsed < DURATION_MS) {
            animationId = requestAnimationFrame(draw);
            return;
        }

        stopAnimation();
        emit('complete');
    };

    const stopAnimation = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    };

    const startAnimation = () => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createParticles(window.innerWidth, window.innerHeight);
        startTime = performance.now();
        stopAnimation();
        animationId = requestAnimationFrame(draw);
    };

    watch(() => props.active, async (isActive) => {
        if (isActive) {
            await Promise.resolve();
            startAnimation();
            return;
        }
        stopAnimation();
    });

    onBeforeUnmount(() => {
        stopAnimation();
    });
</script>

<style scoped>
    .konami-fade-enter-active,
    .konami-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .konami-fade-enter-from,
    .konami-fade-leave-to {
        opacity: 0;
    }
</style>
