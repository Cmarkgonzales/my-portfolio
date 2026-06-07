<template>
    <section
        id="home"
        class="relative isolate overflow-x-hidden pt-32 sm:pt-36 md:pt-40 pb-24 min-h-screen text-white"
    >
        <div class="hero-texture absolute inset-0 -z-10"></div>
        <div class="hero-radial absolute inset-0 -z-10"></div>
        <div class="hero-grid absolute inset-0 -z-10 opacity-45"></div>
        <AmbientStarfield
            :density="1.85"
            :parallax-strength="58"
            :focus-x="starfieldFocus.x"
            :focus-y="starfieldFocus.y"
            :focus-radius="0.38"
            :focus-weight="0.62"
        />

        <div class="relative z-10 isolate w-full">
        <div class="container mx-auto px-5 md:px-8 max-w-7xl xl:max-w-[84rem] 2xl:max-w-[92rem]">
            <div class="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 lg:gap-12 xl:gap-14">
                <div class="w-full md:w-5/12 lg:w-5/12 xl:w-5/12 text-center md:text-left pointer-events-auto shrink-0">
                    <span
                        class="hero-enter inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ncs-blue/35 bg-white/5 text-sm font-medium mb-5 sm:mb-7 shadow-[0_0_22px_rgba(4,138,191,0.2)]"
                        style="animation-delay: 200ms"
                    >
                        <span class="relative flex h-2.5 w-2.5">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80"></span>
                            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                        </span>
                        Available for work
                    </span>
                    <p
                        class="hero-enter uppercase tracking-[0.2em] text-xs sm:text-sm text-sky-cyan mb-3"
                        style="animation-delay: 350ms"
                    >
                        Christian Mark Gonzales
                    </p>
                    <h1
                        class="hero-enter text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-[1.08]"
                        style="animation-delay: 450ms"
                    >
                        Building robust digital
                        <span class="hero-name block">experiences</span>
                    </h1>
                    <div
                        class="hero-enter text-base sm:text-lg lg:text-xl text-gray-200 mb-5 sm:mb-7 min-h-[2.25rem] flex justify-center md:justify-start items-center"
                        style="animation-delay: 520ms"
                    >
                        <span class="mr-2 text-text-secondary">I am a</span>
                        <span class="text-chinese-bronze font-semibold">{{ typedRole }}</span>
                        <span class="ml-1 text-chinese-bronze animate-coding-cursor">|</span>
                    </div>
                    <p
                        class="hero-enter text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto md:mx-0"
                        style="animation-delay: 620ms"
                    >
                        {{ introText }}
                    </p>
                    <div
                        class="hero-enter flex flex-col sm:flex-row sm:justify-start gap-4"
                        style="animation-delay: 680ms"
                    >
                        <span
                            ref="magneticRef"
                            class="block w-full sm:inline-block sm:w-auto cursor-pointer"
                            @mouseenter="magnetic.onMouseEnter"
                            @mousemove="magnetic.onMouseMove"
                            @mouseleave="magnetic.onMouseLeave"
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                class="hero-cta-primary w-full sm:w-auto"
                                @click="scrollTo('#contact')"
                            >
                                Let's Build Together
                            </Button>
                        </span>
                        <Button
                            variant="secondary"
                            size="lg"
                            class="hero-cta-secondary w-full sm:w-auto"
                            @click="scrollTo('#projects')"
                        >
                            View Projects
                        </Button>
                    </div>

                    <dl
                        ref="statsStripRef"
                        class="hero-enter mt-8 sm:mt-10 flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4"
                        style="animation-delay: 740ms"
                    >
                        <div class="text-center md:text-left">
                            <dt class="sr-only">Years of experience</dt>
                            <dd class="text-xl sm:text-2xl font-bold text-sky-cyan tabular-nums">{{ yearsValue }}</dd>
                        </div>
                        <div class="text-center md:text-left">
                            <dt class="sr-only">Projects completed</dt>
                            <dd class="text-xl sm:text-2xl font-bold text-sky-cyan tabular-nums">{{ projectsValue }}</dd>
                        </div>
                        <div class="text-center md:text-left">
                            <dt class="sr-only">Technologies mastered</dt>
                            <dd class="text-xl sm:text-2xl font-bold text-sky-cyan tabular-nums">{{ techValue }}</dd>
                        </div>
                    </dl>
                </div>

                <div
                    class="hero-canvas-column hero-enter relative flex w-full md:w-7/12 lg:w-6/12 xl:w-6/12 items-center justify-center pointer-events-auto overflow-visible"
                    style="animation-delay: 550ms"
                >
                    <HeroDesktopCanvas
                        class="hero-canvas-panel relative z-[1] w-full max-w-[18rem] sm:max-w-[22rem] md:max-w-[26rem] lg:max-w-[30rem] xl:max-w-[34rem] 2xl:max-w-[38rem] aspect-square min-h-[14rem] sm:min-h-[18rem] md:min-h-[20rem] lg:min-h-[24rem]"
                    />
                </div>
            </div>

            <div
                class="hero-enter mt-14 sm:mt-16 flex justify-center md:justify-start gap-5 pointer-events-auto"
                style="animation-delay: 820ms"
            >
                <a
                    v-for="link in socialLinks"
                    :key="`home-${link.icon}`"
                    :href="link.url"
                    :aria-label="`Profile account for ${link.icon}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="h-11 w-11 rounded-xl border border-white/12 bg-white/5 text-white text-lg flex items-center justify-center hover:text-chinese-bronze hover:border-chinese-bronze/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <font-awesome-icon :icon="['fab', link.icon]" />
                </a>
            </div>
        </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, onBeforeUnmount, computed, ref } from 'vue';
    import { constantsStore } from '@/store';
    import Button from '@/components/ui/Button.vue';
    import { useMagneticButton } from '@/composables/useMagneticButton';
    import { useCountUp } from '@/composables/useCountUp';
    import AmbientStarfield from '@/components/AmbientStarfield.vue';
    import HeroDesktopCanvas from '@/components/canvas/HeroDesktopCanvas.vue';

    const introText = computed(() => constantsStore.homeSection.introText);
    const socialLinks = computed(() => constantsStore.socialLinks);
    const typedRole = ref('');
    const roleWords = [
        'Full Stack Developer',
        'Web Developer',
        'AI Automation Specialist',
    ];

    const magneticRef = ref(null);
    const magnetic = useMagneticButton(magneticRef);

    const statsStripRef = ref(null);
    const statsCountUpOptions = { immediate: true, delay: 850 };
    const { displayValue: yearsValue } = useCountUp(statsStripRef, { end: 4, suffix: '+ Years', ...statsCountUpOptions });
    const { displayValue: projectsValue } = useCountUp(statsStripRef, { end: 5, suffix: '+ Projects', ...statsCountUpOptions });
    const { displayValue: techValue } = useCountUp(statsStripRef, { end: 12, suffix: '+ Technologies', ...statsCountUpOptions });

    let roleTimer = null;
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let reducedMotion = false;
    const starfieldFocus = ref({ x: 0.72, y: 0.38 });

    const updateStarfieldFocus = () => {
        const isMobile = window.innerWidth < 768;
        starfieldFocus.value = isMobile
            ? { x: 0.5, y: 0.64 }
            : { x: 0.72, y: 0.38 };
    };

    const scrollTo = (selector) => {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const clearRoleTimer = () => {
        if (roleTimer) {
            clearTimeout(roleTimer);
            roleTimer = null;
        }
    };

    const animateRole = () => {
        const activeWord = roleWords[roleIndex];

        if (deleting) {
            typedRole.value = activeWord.slice(0, Math.max(0, characterIndex - 1));
            characterIndex = Math.max(0, characterIndex - 1);
        } else {
            typedRole.value = activeWord.slice(0, characterIndex + 1);
            characterIndex += 1;
        }

        if (!deleting && characterIndex >= activeWord.length) {
            deleting = true;
            roleTimer = setTimeout(animateRole, 1400);
            return;
        }

        if (deleting && characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roleWords.length;
            roleTimer = setTimeout(animateRole, 220);
            return;
        }

        roleTimer = setTimeout(animateRole, deleting ? 48 : 84);
    };

    onMounted(() => {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        updateStarfieldFocus();
        window.addEventListener('resize', updateStarfieldFocus, { passive: true });

        if (reducedMotion) {
            typedRole.value = roleWords[0];
        } else {
            animateRole();
        }
    });

    onBeforeUnmount(() => {
        clearRoleTimer();
        window.removeEventListener('resize', updateStarfieldFocus);
    });
</script>

<style scoped>
    .hero-texture {
        background:
            linear-gradient(110deg, rgba(1, 35, 64, 0.95), rgba(1, 58, 99, 0.9)),
            radial-gradient(circle at 22% 20%, rgba(7, 178, 217, 0.18), transparent 48%),
            radial-gradient(circle at 78% 28%, rgba(217, 128, 50, 0.14), transparent 40%);
    }

    .hero-grid {
        background-image:
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 1), transparent 85%);
    }

    .hero-radial {
        background:
            radial-gradient(circle at 72% 36%, rgba(4, 138, 191, 0.42), transparent 46%),
            radial-gradient(circle at 68% 42%, rgba(217, 128, 50, 0.16), transparent 38%);
        filter: blur(12px);
    }

    .hero-canvas-column {
        isolation: isolate;
    }

    .hero-name {
        background: linear-gradient(90deg, #07b2d9 0%, #d98032 55%, #f2b672 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .hero-cta-primary {
        box-shadow: 0 0 0 1px rgba(217, 128, 50, 0.28), 0 0 26px rgba(217, 128, 50, 0.26);
    }

    .hero-cta-primary:hover {
        box-shadow: 0 0 0 1px rgba(217, 128, 50, 0.45), 0 0 34px rgba(217, 128, 50, 0.42);
    }

    .hero-cta-secondary {
        box-shadow: 0 0 0 1px rgba(4, 138, 191, 0.26), 0 0 24px rgba(4, 138, 191, 0.16);
    }

    .hero-cta-secondary:hover {
        box-shadow: 0 0 0 1px rgba(4, 138, 191, 0.44), 0 0 30px rgba(4, 138, 191, 0.28);
    }

    .hero-canvas-panel {
        filter: none;
    }
</style>
