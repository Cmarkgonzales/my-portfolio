<template>
    <div
        class="ambient-starfield-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
    >
        <canvas ref="canvasRef" class="block h-full w-full" />
    </div>
</template>

<script setup>
    import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
    import { useMotion } from '@/composables/useMotion';

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
        parallaxStrength: {
            type: Number,
            default: 44,
        },
        focusX: {
            type: Number,
            default: null,
        },
        focusY: {
            type: Number,
            default: null,
        },
        focusRadius: {
            type: Number,
            default: 0.34,
        },
        focusWeight: {
            type: Number,
            default: 0,
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
    const { isReducedMotion } = useMotion();
    let tick = 0;

    let particles = [];
    let particleCanvasWidth = 0;
    let particleCanvasHeight = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const STAR_BASE_COUNT = 220;
    const DUST_BASE_COUNT = 500;

    const randomPosition = (width, height) => {
        const useFocus = props.focusWeight > 0 && props.focusX !== null && props.focusY !== null;

        if (!useFocus || Math.random() > props.focusWeight) {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
            };
        }

        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() ** 0.55 * props.focusRadius;
        return {
            x: props.focusX * width + Math.cos(angle) * spread * width,
            y: props.focusY * height + Math.sin(angle) * spread * height,
        };
    };

    const createParticles = (width, height) => {
        const palette = STAR_PALETTES[props.variant] ?? STAR_PALETTES.dark;
        const starCount = Math.round(STAR_BASE_COUNT * props.density);
        const dustCount = Math.round(DUST_BASE_COUNT * props.density);

        const stars = Array.from({ length: starCount }, (_, index) => {
            const depth = Math.random() * 0.55 + 0.18;
            const tint = palette.tints[index % palette.tints.length];
            const position = randomPosition(width, height);
            return {
                kind: 'star',
                x: position.x,
                y: position.y,
                depth,
                parallaxBoost: 1,
                radius: Math.random() * 1.25 + 0.4,
                alpha: Math.random() * palette.alphaRange + palette.alphaMin,
                vx: (Math.random() - 0.5) * 0.06,
                vy: (Math.random() - 0.5) * 0.045,
                twinklePhase: Math.random() * Math.PI * 2,
                tint,
            };
        });

        const dust = Array.from({ length: dustCount }, (_, index) => {
            const depth = Math.random() * 0.72 + 0.28;
            const tint = palette.tints[(index + 1) % palette.tints.length];
            const position = randomPosition(width, height);
            return {
                kind: 'dust',
                x: position.x,
                y: position.y,
                depth,
                parallaxBoost: 1.2 + Math.random() * 0.55,
                radius: Math.random() * 0.55 + 0.14,
                alpha: Math.random() * 0.28 + 0.08,
                vx: (Math.random() - 0.5) * 0.028,
                vy: (Math.random() - 0.5) * 0.022,
                twinklePhase: Math.random() * Math.PI * 2,
                tint,
            };
        });

        particles = [...dust, ...stars];
    };

    const rebuildParticles = (width, height, force = false) => {
        if (!width || !height) return;

        const sizeChanged =
            Math.abs(width - particleCanvasWidth) > 48 ||
            Math.abs(height - particleCanvasHeight) > 48;

        if (!force && particles.length > 0 && !sizeChanged) return;

        particleCanvasWidth = width;
        particleCanvasHeight = height;
        createParticles(width, height);
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

        rebuildParticles(width, height);
    };

    const onPointerMove = (event) => {
        if (isReducedMotion.value) return;

        const nx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ny = (event.clientY / window.innerHeight - 0.5) * 2;

        targetParallaxX = -nx * props.parallaxStrength;
        targetParallaxY = -ny * props.parallaxStrength;
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

        for (const particle of particles) {
            if (!isReducedMotion.value) {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < -8) particle.x = width + 8;
                if (particle.x > width + 8) particle.x = -8;
                if (particle.y < -8) particle.y = height + 8;
                if (particle.y > height + 8) particle.y = -8;
            }

            const depthShift = particle.depth * particle.parallaxBoost;
            const x = particle.x + parallaxX * depthShift;
            const y = particle.y + parallaxY * depthShift;
            const twinkle = isReducedMotion.value
                ? 1
                : particle.kind === 'dust'
                    ? 0.82 + 0.18 * Math.sin(tick * 0.012 + particle.twinklePhase)
                    : 0.72 + 0.28 * Math.sin(tick * 0.018 + particle.twinklePhase);

            ctx.globalAlpha = particle.alpha * twinkle;
            ctx.fillStyle = particle.tint;
            ctx.beginPath();
            ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    };

    const loop = () => {
        draw();
        animationId = requestAnimationFrame(loop);
    };

    watch(
        () => [props.density, props.focusX, props.focusY, props.focusRadius, props.focusWeight],
        () => {
            const canvas = canvasRef.value;
            if (!canvas?.clientWidth || !canvas?.clientHeight) return;
            rebuildParticles(canvas.clientWidth, canvas.clientHeight, true);
        },
    );

    onMounted(() => {
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
        visibilityObserver?.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
    });
</script>
