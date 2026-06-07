<template>
    <div class="hero-tech-floats pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
        <span
            v-for="(label, index) in scatteredLabels"
            :key="label.text"
            class="hero-tech-float"
            :style="labelStyle(label, index)"
        >
            {{ label.text }}
        </span>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';

    const TECH_DEFS = [
        { text: 'Vue 3', color: '#42b883' },
        { text: 'Vite', color: '#646cff' },
        { text: 'React', color: '#61dafb' },
        { text: 'Node.js', color: '#3c873a' },
        { text: 'Python', color: '#3776ab' },
        { text: 'TypeScript', color: '#3178c6' },
        { text: 'Firebase', color: '#ffca28' },
        { text: 'Tailwind', color: '#38bdf8' },
    ];

    const scatteredLabels = ref([]);

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const scatterTechLabels = (defs) => {
        const count = defs.length;
        const slotsPerRing = Math.ceil(count / 2);
        const startAngle = -Math.PI / 2;

        return defs.map((def, index) => {
            const isOuter = index % 2 === 0;
            const slot = Math.floor(index / 2);
            const radius = isOuter ? 44 : 35;
            const angleStep = (Math.PI * 2) / slotsPerRing;
            const angle = startAngle + slot * angleStep + (isOuter ? 0 : angleStep / 2);

            return {
                ...def,
                x: clamp(50 + Math.cos(angle) * radius, 8, 92),
                y: clamp(50 + Math.sin(angle) * radius, 8, 92),
                duration: 2.9 + (index % 4) * 0.28,
                delay: (index * 0.13) % 0.85,
            };
        });
    };

    const labelStyle = (label, index) => ({
        color: label.color,
        left: `${label.x}%`,
        top: `${label.y}%`,
        '--accent': label.color,
        '--float-duration': `${label.duration}s`,
        '--float-delay': `${label.delay + index * 0.04}s`,
    });

    onMounted(() => {
        scatteredLabels.value = scatterTechLabels(TECH_DEFS);
    });
</script>

<style scoped>
    .hero-tech-float {
        position: absolute;
        white-space: nowrap;
        padding: 0.38rem 0.82rem;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        background: rgba(7, 21, 40, 0.62);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid color-mix(in srgb, var(--accent, #07b2d9) 38%, rgba(255, 255, 255, 0.14));
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 24px color-mix(in srgb, var(--accent, #07b2d9) 28%, transparent),
            0 0 42px color-mix(in srgb, var(--accent, #07b2d9) 12%, transparent),
            0 4px 14px rgba(1, 35, 64, 0.42);
        text-shadow: 0 1px 2px rgba(1, 35, 64, 0.45);
        animation: techFloatWave var(--float-duration, 3.4s) ease-in-out infinite;
        animation-delay: var(--float-delay, 0s);
        will-change: transform;
    }

    @keyframes techFloatWave {
        0%,
        100% {
            transform: translate(-50%, -50%) translateY(0);
        }

        50% {
            transform: translate(-50%, -50%) translateY(-7px);
        }
    }

    @media (max-width: 639px) {
        .hero-tech-float {
            font-size: 0.68rem;
            padding: 0.3rem 0.62rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero-tech-float {
            animation: none;
            transform: translate(-50%, -50%);
        }
    }
</style>
