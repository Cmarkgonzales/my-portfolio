<template>
    <canvas
        ref="canvasRef"
        class="hero-canvas-sparkles pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
    />
</template>

<script setup>
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { useMotion } from '@/composables/useMotion';

    const SPARKLE_COUNT = 180;

    const canvasRef = ref(null);
    let ctx = null;
    let animationId = null;
    let resizeObserver = null;
    let particles = [];
    let tick = 0;
    const { isReducedMotion } = useMotion();

    const TINTS = ['#d9f5ff', '#8ec8e8', '#07b2d9', '#f2b672', '#ffffff'];

    const createParticles = (width, height) => {
        particles = Array.from({ length: SPARKLE_COUNT }, (_, index) => {
            const tint = TINTS[index % TINTS.length];
            const depth = Math.random() * 0.65 + 0.25;
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                depth,
                radius: Math.random() * 1.35 + 0.35,
                alpha: Math.random() * 0.28 + 0.1,
                vx: (Math.random() - 0.5) * 0.14,
                vy: (Math.random() - 0.5) * 0.11,
                twinklePhase: Math.random() * Math.PI * 2,
                tint,
            };
        });
    };

    const resize = () => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createParticles(width, height);
    };

    const draw = () => {
        const canvas = canvasRef.value;
        if (!canvas || !ctx) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const maxDist = Math.min(width, height) * 0.52;

        ctx.clearRect(0, 0, width, height);
        tick += 1;

        for (const particle of particles) {
            if (!isReducedMotion.value) {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < -6) particle.x = width + 6;
                if (particle.x > width + 6) particle.x = -6;
                if (particle.y < -6) particle.y = height + 6;
                if (particle.y > height + 6) particle.y = -6;
            }

            const dx = particle.x - centerX;
            const dy = particle.y - centerY;
            const dist = Math.hypot(dx, dy);
            const edgeFade = 1 - Math.min(dist / maxDist, 1) ** 1.35;
            if (edgeFade <= 0.02) continue;

            const twinkle = isReducedMotion.value
                ? 1
                : 0.68 + 0.32 * Math.sin(tick * 0.016 + particle.twinklePhase + particle.depth * 2);

            ctx.globalAlpha = particle.alpha * twinkle * edgeFade * (0.72 + particle.depth * 0.28);
            ctx.fillStyle = particle.tint;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    };

    const loop = () => {
        draw();
        animationId = requestAnimationFrame(loop);
    };

    onMounted(() => {
        resize();

        const canvas = canvasRef.value;
        const observeTarget = canvas?.parentElement;
        if (observeTarget) {
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(observeTarget);
        }

        if (isReducedMotion.value) {
            draw();
        } else {
            animationId = requestAnimationFrame(loop);
        }
    });

    watch(isReducedMotion, (reduced) => {
        if (reduced) {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            draw();
        } else if (animationId === null) {
            animationId = requestAnimationFrame(loop);
        }
    });

    onBeforeUnmount(() => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }
        resizeObserver?.disconnect();
    });
</script>

<style scoped>
    .hero-canvas-sparkles {
        opacity: 0.5;
        filter: blur(0.6px);
    }
</style>
