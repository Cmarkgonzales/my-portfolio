<template>
    <Section id="projects" bg="muted">
        <SectionHeader
            title="My Work"
            subTitle="Featured Projects"
            subTitleColor="text-text-primary"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
            <Card
                v-for="project in myProjects"
                :key="project.name"
                variant="glass"
                class="group flex flex-col h-full"
                data-category="web"
                data-aos="fade-up"
            >
                <div class="relative h-52 sm:h-56 overflow-hidden">
                    <img
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        :src="project.image"
                        :alt="project.name"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#040c17]/85 via-[#040c17]/25 to-transparent"></div>
                    <Tag
                        variant="primary"
                        class="absolute top-3 left-3 capitalize whitespace-nowrap"
                    >
                        {{ project.type }}
                    </Tag>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="mb-3">
                        <h3 class="text-xl font-bold text-text-primary leading-tight">{{ project.name }}</h3>
                    </div>
                    <p class="text-text-secondary text-sm mb-5 flex-grow leading-relaxed">
                        {{ project.description }}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        <span
                            v-for="tech in project.technologies"
                            :key="`tech-${project.name}-${tech}`"
                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-ncs-blue/30 bg-ncs-blue/12 text-sky-cyan"
                        >
                            {{ tech }}
                        </span>
                    </div>
                    <div class="flex space-x-4 mt-auto border-t border-border-subtle pt-5">
                        <a
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
            </Card>
        </div>
        <div
            v-if="myProjects.length <= 1"
            class="mt-16 mx-auto max-w-md text-center transition-opacity duration-700 animate-fade-in"
            data-aos="fade-up"
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
    import Card from '@/components/ui/Card.vue';
    import Tag from '@/components/ui/Tag.vue';

    const myProjects = computed(() => constantsStore.projects);
</script>
