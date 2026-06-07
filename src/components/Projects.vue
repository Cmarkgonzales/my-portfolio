<template>
    <Section id="projects" bg="muted">
        <SectionHeader
            title="My Work"
            subTitle="Featured Projects"
            subTitleColor="text-text-primary"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
            <article
                v-for="(project, index) in myProjects"
                :key="project.name"
                class="project-card group relative flex flex-col h-full rounded-xl overflow-hidden border border-border-subtle surface-glass"
                data-category="web"
                data-reveal="fade-up"
                :style="{ '--reveal-delay': `${120 + index * 90}ms` }"
                @mousemove="onCardMove($event)"
                @mouseleave="onCardLeave($event)"
            >
                <div class="project-card-glow pointer-events-none absolute inset-0 rounded-xl z-[1]" aria-hidden="true" />
                <div class="relative h-52 sm:h-56 overflow-hidden shrink-0">
                    <img
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        :src="project.image"
                        :alt="project.name"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#040c17]/85 via-[#040c17]/25 to-transparent" />
                    <Tag
                        variant="primary"
                        class="absolute top-3 left-3 capitalize whitespace-nowrap z-[2]"
                    >
                        {{ project.type }}
                    </Tag>

                    <div class="project-tech-overlay absolute inset-x-0 bottom-0 z-[3] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out p-3 bg-gradient-to-t from-oxford-blue/95 to-transparent">
                        <div class="flex flex-wrap gap-1.5 justify-center">
                            <span
                                v-for="tech in project.technologies"
                                :key="`overlay-${project.name}-${tech}`"
                                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium border border-sky-cyan/30 bg-ncs-blue/20 text-sky-cyan"
                            >
                                {{ tech }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="relative z-[2] p-6 flex flex-col flex-grow">
                    <div class="mb-3">
                        <h3 class="text-xl font-bold text-text-primary leading-tight">{{ project.name }}</h3>
                    </div>
                    <p class="text-text-secondary text-sm flex-grow leading-relaxed">
                        {{ project.description }}
                    </p>
                    <div class="flex space-x-4 mt-6 border-t border-border-subtle pt-5">
                        <a
                            v-if="isValidUrl(project.demoLink)"
                            :href="project.demoLink"
                            class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-ncs-blue/15 text-sky-cyan hover:bg-ncs-blue/25 hover:text-white transition-colors focus-ring"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <font-awesome-icon class="mr-2" icon="fas fa-external-link-alt" />
                            Live Demo
                        </a>
                        <a
                            :href="project.githubLink"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-white/8 text-text-secondary hover:bg-white/15 hover:text-text-primary transition-colors focus-ring"
                        >
                            <font-awesome-icon class="mr-2" icon="fab fa-github" />
                            Source
                        </a>
                    </div>
                </div>
            </article>
        </div>
        <div
            v-if="myProjects.length <= 1"
            class="mt-16 mx-auto max-w-md text-center transition-opacity duration-700 animate-fade-in"
        >
            <p class="text-text-muted italic flex items-center justify-center gap-2">
                <font-awesome-icon class="text-ncs-blue" icon="fas fa-clock" />
                More projects to come soon. Stay tuned!
            </p>
        </div>
    </Section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import Section from '@/components/ui/Section.vue';
    import Tag from '@/components/ui/Tag.vue';

    const myProjects = computed(() => constantsStore.projects);

    const isValidUrl = (href) => {
        if (!href || typeof href !== 'string') return false;
        try {
            const url = new URL(href);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const onCardMove = (event) => {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        const mx = (x / rect.width) * 100;
        const my = (y / rect.height) * 100;

        card.style.setProperty('--mx', `${mx}%`);
        card.style.setProperty('--my', `${my}%`);
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const onCardLeave = (event) => {
        const card = event.currentTarget;
        card.style.transform = '';
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
    };

</script>

<style scoped>
    .project-card {
        --mx: 50%;
        --my: 50%;
        transform-style: preserve-3d;
        transition: transform 0.15s ease-out, box-shadow 0.3s ease;
        box-shadow:
            0 0 0 1px rgba(4, 138, 191, 0.12),
            0 12px 28px rgba(2, 10, 18, 0.5);
    }

    .project-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 48px;
        border-top: 2px solid rgba(7, 178, 217, 0.6);
        border-left: 2px solid rgba(7, 178, 217, 0.6);
        border-radius: 0.75rem 0 0 0;
        pointer-events: none;
        z-index: 5;
        box-shadow: -2px -2px 12px rgba(7, 178, 217, 0.25);
    }

    .project-card::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: 6;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: radial-gradient(
            400px circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.08),
            transparent 40%
        );
    }

    .project-card:hover::after {
        opacity: 1;
    }

    .project-card:hover {
        box-shadow:
            0 0 0 1px rgba(4, 138, 191, 0.35),
            0 0 22px rgba(4, 138, 191, 0.2),
            0 18px 42px rgba(2, 10, 18, 0.62);
    }

    .project-card-glow {
        background: radial-gradient(
            500px circle at var(--mx) var(--my),
            rgba(217, 128, 50, 0.06),
            transparent 45%
        );
    }

    @media (prefers-reduced-motion: reduce) {
        .project-card {
            transition: box-shadow 0.3s ease;
        }

        .project-card:hover {
            transform: none !important;
        }
    }
</style>
