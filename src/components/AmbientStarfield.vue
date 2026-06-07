<template>
    <div
        class="ambient-starfield-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
    >
        <canvas ref="canvasRef" class="block h-full w-full" />
    </div>
</template>

<script setup>
    import { onMounted, onBeforeUnmount, ref } from 'vue';

    const props = defineProps({
        density: {
            type: Number,
            default: 1,
        },
        variant: {
            type: String,
            default: 'dark',
            validator: (value) => ['dark', 'light'].includes(value),
        },
    });

    const STAR_PALETTES = {
        dark: {
            tints: ['#d9f5ff', '#8ec8e8'],
            alphaMin: 0.2,
            alphaRange: 0.45,
        },
        light: {
            tints: ['#048abf', '#07b2d9', '#5a8fad'],
            alphaMin: 0.14,
            alphaRange: 0.32,
        },
    };

    const canvasRef = ref(null);
    let ctx = null;
    let animationId = null;
    let resizeObserver = null;
    let visibilityObserver = null;
    let isVisible = true;
    let reducedMotion = false;
    let tick = 0;

    let stars = [];
    let parallaxX = 0;
    let parallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const STAR_BASE_COUNT = 160;

    const createStars = (width, height) => {
        const palette = STAR_PALETTES[props.variant] ?? STAR_PALETTES.dark;
        const count = Math.round(STAR_BASE_COUNT * props.density);
        stars = Array.from({ length: count }, (_, index) => {
            const depth = Math.random() * 0.65 + 0.2;
            const tint = palette.tints[index % palette.tints.length];
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                depth,
                radius: Math.random() * 1.1 + 0.35,
                alpha: Math.random() * palette.alphaRange + palette.alphaMin,
                vx: (Math.random() - 0.5) * 0.06,
                vy: (Math.random() - 0.5) * 0.045,
                twinklePhase: Math.random() * Math.PI * 2,
                tint,
            };
        });
    };

    const resize = () => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const layer = canvasRef.value?.parentElement;
        const parent = layer?.parentElement ?? layer;
        const width = parent?.clientWidth ?? window.innerWidth;
        const height = parent?.clientHeight ?? window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (stars.length === 0) {
            createStars(width, height);
        }
    };

    const onPointerMove = (event) => {
        if (reducedMotion) return;

        const nx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ny = (event.clientY / window.innerHeight - 0.5) * 2;
        const strength = 36;

        targetParallaxX = -nx * strength;
        targetParallaxY = -ny * strength;
    };

    const onPointerLeave = () => {
        targetParallaxX = 0;
        targetParallaxY = 0;
    };

    const draw = () => {
        const canvas = canvasRef.value;
        if (!canvas || !ctx || !isVisible) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        parallaxX += (targetParallaxX - parallaxX) * 0.05;
        parallaxY += (targetParallaxY - parallaxY) * 0.05;

        ctx.clearRect(0, 0, width, height);
        tick += 1;

        for (const star of stars) {
            if (!reducedMotion) {
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < -8) star.x = width + 8;
                if (star.x > width + 8) star.x = -8;
                if (star.y < -8) star.y = height + 8;
                if (star.y > height + 8) star.y = -8;
            }

            const x = star.x + parallaxX * star.depth;
            const y = star.y + parallaxY * star.depth;
            const twinkle = reducedMotion
                ? 1
                : 0.72 + 0.28 * Math.sin(tick * 0.018 + star.twinklePhase);

            ctx.globalAlpha = star.alpha * twinkle;
            ctx.fillStyle = star.tint;
            ctx.beginPath();
            ctx.arc(x, y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    };

    const loop = () => {
        draw();
        animationId = requestAnimationFrame(loop);
    };

    onMounted(() => {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        resize();

        const layer = canvasRef.value?.parentElement;
        const section = layer?.parentElement;
        if (section) {
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(section);

            visibilityObserver = new IntersectionObserver(
                ([entry]) => {
                    isVisible = entry.isIntersecting;
                },
                { threshold: 0.05 },
            );
            visibilityObserver.observe(section);
        }

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerleave', onPointerLeave);

        if (reducedMotion) {
            draw();
        } else {
            animationId = requestAnimationFrame(loop);
        }
    });

    onBeforeUnmount(() => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }
        resizeObserver?.disconnect();
        visibilityObserver?.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
    });
</script>
