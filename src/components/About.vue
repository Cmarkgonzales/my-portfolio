<template>
    <Section id="about" bg="default">
            <SectionHeader
                title="About Me"
                subTitle="Who I Am"
                subTitleColor="text-text-primary"
            />
            <div class="flex flex-col md:flex-row items-center gap-14 lg:gap-[4.75rem]">
                <div
                    class="md:w-2/5"
                    data-reveal="fade-right"
                >
                    <div class="relative">
                        <div class="w-full h-96 bg-light-cyan rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src="/assets/profile.png"
                                alt="About Profile"
                                class="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                        <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-chinese-bronze rounded-2xl flex items-center justify-center shadow-lg">
                            <div class="text-center text-white">
                                <span class="text-3xl font-bold block">
                                    4+
                                </span>
                                <span class="text-sm font-medium">
                                    Years Exp.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:w-3/5 stack-md" data-reveal="fade-left" :style="{ '--reveal-delay': '400ms' }">
                    <h3 class="text-2xl lg:text-3xl font-semibold text-text-primary">
                        Full Stack Developer
                    </h3>
                    <p class="text-text-secondary leading-relaxed">
                        {{ aboutMe.experience }}
                    </p>
                    <p class="text-text-secondary leading-relaxed">
                        {{ aboutMe.mindset }}
                    </p>
                    <p class="text-text-secondary leading-relaxed">
                        {{ aboutMe.hobbies }}
                    </p>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        data-reveal="zoom-in"
                        :style="{ '--reveal-delay': '600ms' }"
                    >
                        <article
                            v-for="(highlight, index) in developerHighlights"
                            :key="`highlight-${index}`"
                            class="about-highlight surface-glass border border-border-subtle rounded-xl p-4 backdrop-blur-sm"
                        >
                            <div class="flex items-start gap-3">
                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ncs-blue/15 border border-ncs-blue/30">
                                    <font-awesome-icon
                                        class="text-sky-cyan text-sm"
                                        :icon="['fas', highlight.icon]"
                                    />
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-sm font-semibold text-text-primary leading-snug">
                                        {{ highlight.title }}
                                    </h4>
                                    <p class="mt-1 text-sm text-text-secondary leading-relaxed">
                                        {{ highlight.description }}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                    <a
                        :href="resumeLink"
                        aria-label="Download"
                        class="inline-flex items-center bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-xl font-medium transition duration-300 shadow-[0_0_0_1px_rgba(217,128,50,0.28),0_0_24px_rgba(217,128,50,0.22)] hover:shadow-[0_0_0_1px_rgba(217,128,50,0.45),0_0_30px_rgba(217,128,50,0.35)]"
                        data-reveal="fade-up"
                        :style="{ '--reveal-delay': '700ms' }"
                    >
                        <span>Download Resume</span>
                        <font-awesome-icon class="ml-2" icon="fas fa-download" />
                    </a>
                </div>
            </div>
    </Section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import Section from '@/components/ui/Section.vue';

    const aboutMe = computed(() => constantsStore.aboutMe);
    const resumeLink = computed(() => constantsStore.resumeLink);

    const DEFAULT_HIGHLIGHTS = [
        {
            icon: 'desktop',
            title: 'Full-stack delivery',
            description: 'Ship cohesive features across APIs, data layers, and polished interfaces.',
        },
        {
            icon: 'server',
            title: 'Performance-first',
            description: 'Optimize queries, payloads, and render paths before scaling infrastructure.',
        },
        {
            icon: 'gear',
            title: 'Maintainable systems',
            description: 'Build clear architecture teams can extend with confidence over time.',
        },
        {
            icon: 'paper-plane',
            title: 'Collaborative shipping',
            description: 'Partner with product and design to deliver on scope without cutting quality.',
        },
    ];

    const developerHighlights = computed(() => {
        const highlights = aboutMe.value.highlights;
        if (Array.isArray(highlights) && highlights.length > 0) {
            return highlights;
        }
        return DEFAULT_HIGHLIGHTS;
    });
</script>

<style scoped>
    .about-highlight {
        transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
    }

    .about-highlight:hover {
        border-color: rgba(4, 138, 191, 0.35);
        box-shadow: 0 0 0 1px rgba(4, 138, 191, 0.15), 0 8px 24px rgba(2, 10, 18, 0.35);
        transform: translateY(-2px);
    }
</style>
