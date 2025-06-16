<template>
    <section
        id="projects"
        class="section py-24 bg-light-cyan"
    >
        <div class="container mx-auto px-4">
            <SectionHeader
                title="My Work"
                subTitle="Featured Projects"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                    v-for="project in myProjects"
                    :key="project.name"
                    class="card bg-white rounded-xl overflow-hidden"
                    data-category="web"
                    data-aos="fade-up"
                >
                    <div class="relative h-48">
                        <img
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                            :src="`/my-portfolio/${project.image}`"
                            :alt="project.name"
                        />
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-lg font-semibold text-oxford-blue">{{ project.name }}</h3>
                            <span class="text-xs bg-blue-100 text-ncs-blue font-medium px-2 py-0.5 rounded-full capitalize">
                                {{ project.type }}
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                            {{ project.description }}
                        </p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span
                                v-for="tech in project.technologies"
                                :key="`tech-${project.name}-${tech}`"
                                class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                                {{ tech }}
                            </span>
                        </div>
                        <div class="flex space-x-4">
                            <a
                                :href="project.demoLink"
                                class="text-ncs-blue hover:text-oxford-blue transition-colors font-medium flex items-center"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <font-awesome-icon class="text-sm mr-1" icon="fas fa-external-link-alt"></font-awesome-icon>
                                Demo
                            </a>
                            <a
                                :href="project.githubLink"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-ncs-blue hover:text-oxford-blue transition-colors font-medium flex items-center"
                            >
                                <font-awesome-icon class="mr-1" icon="fab fa-github"></font-awesome-icon>
                                Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="myProjects.length <= 1"
                class="mt-12 mx-auto max-w-md text-center transition-opacity duration-700 animate-fade-in"
                data-aos="fade-up"
            >
                <p class="text-gray-600 italic flex items-center justify-center gap-2">
                    <font-awesome-icon class="text-ncs-blue" icon="fas fa-clock"></font-awesome-icon>
                    More projects to come soon. Stay tuned!
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue'

    const myProjects = computed(() => constantsStore.projects);
</script>
