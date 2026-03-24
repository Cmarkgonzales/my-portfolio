<template>
    <Section id="projects" bg="light">
        <SectionHeader
            title="My Work"
            subTitle="Featured Projects"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card
                v-for="project in myProjects"
                :key="project.name"
                class="flex flex-col h-full"
                data-category="web"
                data-aos="fade-up"
            >
                <div class="relative h-48 sm:h-56 overflow-hidden">
                    <img
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        :src="project.image"
                        :alt="project.name"
                    />
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-bold text-oxford-blue leading-tight">{{ project.name }}</h3>
                        <Tag variant="primary" class="capitalize whitespace-nowrap ml-3">{{ project.type }}</Tag>
                    </div>
                    <p class="text-gray-600 text-sm mb-5 flex-grow leading-relaxed">
                        {{ project.description }}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        <Tag
                            v-for="tech in project.technologies"
                            :key="`tech-${project.name}-${tech}`"
                        >
                            {{ tech }}
                        </Tag>
                    </div>
                    <div class="flex space-x-6 mt-auto border-t border-gray-100 pt-5">
                        <a
                            :href="project.demoLink"
                            class="text-ncs-blue hover:text-chinese-bronze transition-colors font-medium flex items-center focus-ring text-sm rounded-sm"
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
                            class="text-gray-500 hover:text-oxford-blue transition-colors font-medium flex items-center focus-ring text-sm rounded-sm"
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
            <p class="text-gray-500 italic flex items-center justify-center gap-2">
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
