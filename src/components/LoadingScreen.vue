<template>
    <div class="flex items-center justify-center h-screen bg-oxford-blue px-4">
        <div
            class="w-full max-w-md rounded-xl border border-border-subtle surface-glass p-6 font-mono text-sm shadow-soft-dark"
            role="status"
            aria-live="polite"
            :aria-label="ariaLabel"
        >
            <div class="flex items-center gap-2 mb-4 text-sky-cyan text-xs">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-chinese-bronze/80" />
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-sky-cyan/60" />
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-ncs-blue/60" />
                <span class="ml-2 text-text-muted">portfolio-boot</span>
            </div>

            <div class="space-y-2 min-h-[7.5rem]">
                <p
                    v-for="(line, index) in visibleLines"
                    :key="`boot-line-${index}`"
                    class="text-text-secondary leading-relaxed"
                >
                    <span class="text-sky-cyan mr-2">&gt;</span>
                    <span>{{ line.text }}</span>
                    <span
                        v-if="index === visibleLines.length - 1 && !bootComplete"
                        class="boot-cursor text-chinese-bronze"
                        aria-hidden="true"
                    >_</span>
                </p>
            </div>

            <div class="mt-5 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-ncs-blue to-sky-cyan transition-all duration-500 ease-out"
                    :style="{ width: `${progressPercent}%` }"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { useFirebaseConstants } from '@/composables/useFirebaseConstants';
    import { useMotion } from '@/composables/useMotion';

    const BOOT_LINES = [
        'init portfolio',
        'load firebase constants',
        'mount 3d desktop',
        'ready',
    ];

    const { isLoading } = useFirebaseConstants();
    const { isReducedMotion } = useMotion();

    const currentLineIndex = ref(0);
    const charIndex = ref(0);
    const bootComplete = ref(false);
    let typeTimer = null;

    const visibleLines = computed(() => {
        const lines = [];
        for (let i = 0; i <= currentLineIndex.value; i += 1) {
            const fullText = BOOT_LINES[i];
            if (i < currentLineIndex.value) {
                lines.push({ text: fullText });
            } else {
                lines.push({ text: fullText.slice(0, charIndex.value) });
            }
        }
        return lines;
    });

    const progressPercent = computed(() => {
        if (bootComplete.value) return 100;
        const lineProgress = (currentLineIndex.value / BOOT_LINES.length) * 100;
        const charProgress = BOOT_LINES[currentLineIndex.value]
            ? (charIndex.value / BOOT_LINES[currentLineIndex.value].length) * (100 / BOOT_LINES.length)
            : 0;
        return Math.min(99, Math.round(lineProgress + charProgress));
    });

    const ariaLabel = computed(() => {
        if (bootComplete.value) return 'Portfolio loaded';
        const current = BOOT_LINES[currentLineIndex.value] ?? 'Loading';
        return `Loading portfolio: ${current}`;
    });

    const clearTypeTimer = () => {
        if (typeTimer) {
            clearTimeout(typeTimer);
            typeTimer = null;
        }
    };

    const advanceToNextLine = () => {
        if (currentLineIndex.value < BOOT_LINES.length - 1) {
            currentLineIndex.value += 1;
            charIndex.value = 0;
            scheduleTyping();
            return;
        }
        bootComplete.value = true;
    };

    const scheduleTyping = () => {
        clearTypeTimer();

        if (isReducedMotion.value) {
            currentLineIndex.value = BOOT_LINES.length - 1;
            charIndex.value = BOOT_LINES[BOOT_LINES.length - 1].length;
            bootComplete.value = true;
            return;
        }

        const line = BOOT_LINES[currentLineIndex.value];
        if (!line) return;

        if (charIndex.value < line.length) {
            typeTimer = setTimeout(() => {
                charIndex.value += 1;
                scheduleTyping();
            }, 28);
            return;
        }

        const delay = currentLineIndex.value === BOOT_LINES.length - 1 ? 200 : 320;
        typeTimer = setTimeout(advanceToNextLine, delay);
    };

    const syncBootToLoadingState = (loading) => {
        if (loading) {
            if (currentLineIndex.value < 1) {
                currentLineIndex.value = 1;
                charIndex.value = BOOT_LINES[1].length;
            }
            return;
        }

        if (currentLineIndex.value < 2) {
            currentLineIndex.value = 2;
            charIndex.value = BOOT_LINES[2].length;
        }

        if (currentLineIndex.value === 2 && charIndex.value >= BOOT_LINES[2].length) {
            typeTimer = setTimeout(advanceToNextLine, 400);
        }
    };

    watch(isLoading, (loading) => {
        syncBootToLoadingState(loading);
    }, { immediate: true });

    onMounted(() => {
        scheduleTyping();
    });

    onBeforeUnmount(() => {
        clearTypeTimer();
    });
</script>

<style scoped>
    .boot-cursor {
        animation: boot-blink 1s step-end infinite;
    }

    @keyframes boot-blink {
        50% {
            opacity: 0;
        }
    }
</style>
