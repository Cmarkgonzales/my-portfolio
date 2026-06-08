<template>
    <div class="skills-galaxy relative flex flex-col">
        <div
            class="relative rounded-xl border border-border-subtle surface-glass overflow-hidden"
            data-reveal="fade-up"
            :style="{ '--reveal-delay': '200ms' }"
        >
            <canvas
                ref="canvasRef"
                class="skills-galaxy-canvas block w-full h-[min(28rem,60vw)] min-h-[16rem]"
                aria-hidden="true"
                @mousemove="handlePointerMove"
                @mouseleave="handlePointerLeave"
                @click="handleCanvasClick"
            />

            <div
                v-if="hoveredNode && !pinnedNode"
                class="skills-galaxy-tooltip pointer-events-none absolute z-10 rounded-lg border border-border-subtle bg-surface-1/95 px-3 py-2 text-sm shadow-soft-dark backdrop-blur-sm"
                :style="tooltipStyle"
            >
                <p class="font-semibold text-text-primary">{{ hoveredNode.name }}</p>
                <p class="text-xs text-text-secondary">{{ hoveredNode.category }}</p>
                <p v-if="hoveredNode.showProficiency !== false" class="text-xs text-sky-cyan mt-0.5">
                    {{ hoveredNode.level }} · {{ hoveredNode.proficiency }}%
                </p>
            </div>
        </div>

        <div
            v-if="pinnedNode"
            class="mt-4 rounded-xl border border-border-subtle surface-glass p-4"
            role="region"
            :aria-label="`Skill details for ${pinnedNode.name}`"
        >
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h4 class="text-lg font-bold text-text-primary">{{ pinnedNode.name }}</h4>
                    <p class="text-sm text-text-secondary">{{ pinnedNode.category }}</p>
                </div>
                <button
                    type="button"
                    class="focus-ring rounded-md px-2 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                    @click="clearPin"
                >
                    Close
                </button>
            </div>
            <p v-if="pinnedNode.showProficiency !== false" class="mt-2 text-sm text-sky-cyan">
                {{ pinnedNode.level }} proficiency · {{ pinnedNode.proficiency }}%
            </p>
        </div>

        <ul class="sr-only">
            <li v-for="(node, index) in galaxySkills" :key="`galaxy-skill-${node.name}-${index}`">
                <button
                    type="button"
                    class="focus-ring"
                    @focus="focusNode(node)"
                    @blur="blurNode"
                    @keydown.enter.prevent="pinNode(node)"
                    @keydown.space.prevent="pinNode(node)"
                >
                    {{ node.name }}, {{ node.category }}
                    <template v-if="node.showProficiency !== false">, {{ node.level }}, {{ node.proficiency }}%</template>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { useMotion } from '@/composables/useMotion';
    import {
        flattenAdditionalSkillsForGalaxy,
        flattenSkillsForGalaxy,
    } from '@/utils/skillProficiency';

    const props = defineProps({
        mainSkills: {
            type: Array,
            default: () => [],
        },
        additionalSkills: {
            type: Array,
            default: () => [],
        },
    });

    const canvasRef = ref(null);
    const hoveredNode = ref(null);
    const pinnedNode = ref(null);
    const tooltipPos = ref({ x: 0, y: 0 });

    let ctx = null;
    let animationId = null;
    let resizeObserver = null;
    let nodes = [];
    let tick = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;

    const { isReducedMotion } = useMotion();

    const galaxySkills = computed(() => [
        ...flattenSkillsForGalaxy(props.mainSkills),
        ...flattenAdditionalSkillsForGalaxy(props.additionalSkills),
    ]);

    const tooltipStyle = computed(() => ({
        left: `${tooltipPos.value.x}px`,
        top: `${tooltipPos.value.y}px`,
        transform: 'translate(-50%, calc(-100% - 12px))',
    }));

    const buildNodes = (width, height) => {
        const skills = galaxySkills.value;
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const categories = [...new Set(skills.map((skill) => skill.category))];

        return skills.map((skill, index) => {
            const categoryIndex = categories.indexOf(skill.category);
            const ringCount = Math.max(categories.length, 1);
            const ringRatio = (categoryIndex + 1) / (ringCount + 0.6);
            const angleSpread = (Math.PI * 2) / Math.max(skills.filter((s) => s.category === skill.category).length, 1);
            const indexInCategory = skills
                .filter((s) => s.category === skill.category)
                .indexOf(skill);

            const semiMajor = width * (0.14 + ringRatio * 0.2);
            const semiMinor = height * (0.12 + ringRatio * 0.18);
            const phase = (indexInCategory * angleSpread) + (categoryIndex * 0.7) + (index * 0.15);
            const speed = 0.0012 + (index % 5) * 0.00025;
            const baseScale = skill.nodeScale ?? (0.045 + (skill.proficiency ?? 55) / 2200);

            return {
                ...skill,
                semiMajor,
                semiMinor,
                phase,
                speed,
                baseScale,
                x: centerX,
                y: centerY,
            };
        });
    };

    const updateNodePositions = (animate) => {
        const centerX = canvasWidth * 0.5;
        const centerY = canvasHeight * 0.5;

        for (const node of nodes) {
            const phase = animate ? node.phase + tick * node.speed : node.phase;
            node.x = centerX + Math.cos(phase) * node.semiMajor;
            node.y = centerY + Math.sin(phase) * node.semiMinor;
        }
    };

    const drawNode = (node, highlighted) => {
        const radius = Math.max(4, canvasWidth * node.baseScale) * (highlighted ? 1.35 : 1);
        const glowRadius = radius * 2.4;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        gradient.addColorStop(0, `${node.accentColor}cc`);
        gradient.addColorStop(0.45, `${node.accentColor}55`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = node.accentColor;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (highlighted) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(232, 241, 251, 0.85)';
            ctx.lineWidth = 1.5;
            ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    const drawConstellationLines = () => {
        const byCategory = nodes.reduce((acc, node) => {
            if (!acc[node.category]) acc[node.category] = [];
            acc[node.category].push(node);
            return acc;
        }, {});

        ctx.strokeStyle = 'rgba(143, 168, 197, 0.12)';
        ctx.lineWidth = 1;

        for (const categoryNodes of Object.values(byCategory)) {
            for (let i = 0; i < categoryNodes.length; i++) {
                const current = categoryNodes[i];
                const next = categoryNodes[(i + 1) % categoryNodes.length];
                ctx.beginPath();
                ctx.moveTo(current.x, current.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
            }
        }
    };

    const draw = () => {
        if (!ctx || !canvasRef.value) return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (!isReducedMotion.value) {
            tick += 1;
        }

        updateNodePositions(!isReducedMotion.value);
        drawConstellationLines();

        const activeName = pinnedNode.value?.name ?? hoveredNode.value?.name;

        for (const node of nodes) {
            drawNode(node, node.name === activeName);
        }
    };

    const animate = () => {
        draw();
        animationId = requestAnimationFrame(animate);
    };

    const resize = () => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;

        canvasWidth = width;
        canvasHeight = height;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        nodes = buildNodes(width, height);
        draw();
    };

    const getCanvasPoint = (event) => {
        const canvas = canvasRef.value;
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const findNodeAt = (x, y) => {
        let closest = null;
        let closestDistance = Infinity;

        for (const node of nodes) {
            const radius = Math.max(4, canvasWidth * node.baseScale);
            const distance = Math.hypot(node.x - x, node.y - y);
            if (distance <= radius + 8 && distance < closestDistance) {
                closest = node;
                closestDistance = distance;
            }
        }

        return closest;
    };

    const handlePointerMove = (event) => {
        const point = getCanvasPoint(event);
        const node = findNodeAt(point.x, point.y);
        hoveredNode.value = node;
        tooltipPos.value = { x: point.x, y: point.y };
    };

    const handlePointerLeave = () => {
        if (!pinnedNode.value) {
            hoveredNode.value = null;
        }
    };

    const pinNode = (node) => {
        pinnedNode.value = node;
        hoveredNode.value = node;
    };

    const handleCanvasClick = (event) => {
        const point = getCanvasPoint(event);
        const node = findNodeAt(point.x, point.y);
        if (node) {
            pinnedNode.value = pinnedNode.value?.name === node.name ? null : node;
            hoveredNode.value = node;
        } else {
            pinnedNode.value = null;
            hoveredNode.value = null;
        }
    };

    const focusNode = (node) => {
        hoveredNode.value = node;
        tooltipPos.value = { x: node.x, y: node.y };
        draw();
    };

    const blurNode = () => {
        if (!pinnedNode.value) {
            hoveredNode.value = null;
        }
        draw();
    };

    const clearPin = () => {
        pinnedNode.value = null;
        hoveredNode.value = null;
    };

    const startAnimation = () => {
        if (animationId !== null) return;
        animationId = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    };

    watch(isReducedMotion, () => {
        draw();
    });

    watch(galaxySkills, () => {
        resize();
    });

    onMounted(() => {
        resize();

        if (canvasRef.value) {
            resizeObserver = new ResizeObserver(() => resize());
            resizeObserver.observe(canvasRef.value);
        }

        startAnimation();
    });

    onBeforeUnmount(() => {
        stopAnimation();
        resizeObserver?.disconnect();
    });
</script>

<style scoped>
    .skills-galaxy-canvas {
        background:
            radial-gradient(circle at 50% 45%, rgba(4, 138, 191, 0.14), transparent 58%),
            radial-gradient(circle at 30% 70%, rgba(217, 128, 50, 0.08), transparent 45%);
    }
</style>
