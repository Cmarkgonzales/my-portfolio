<template>
    <section id="projects" ref="projects" class="section py-24 bg-light-cyan">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-process-cyan uppercase tracking-wider mb-2">
                    My Work
                </span>
                <h2 class="text-3xl md:text-4xl font-bold text-oxford-blue mb-4 text-center">
                    Featured Projects
                </h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                    v-for="project in myProjects"
                    :key="project.name"
                    class="card bg-white rounded-xl overflow-hidden"
                    data-category="web"
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
                                <i class="fas fa-external-link-alt mr-1"></i>
                                Demo
                            </a>
                            <a
                                :href="project.githubLink"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-ncs-blue hover:text-oxford-blue transition-colors font-medium flex items-center"
                            >
                                <i class="fab fa-github mr-1"></i>
                                Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="myProjects.length <= 1"
                class="mt-12 mx-auto max-w-md text-center transition-opacity duration-700 animate-fade-in"
            >
                <p class="text-gray-600 italic flex items-center justify-center gap-2">
                    <i class="fas fa-clock text-ncs-blue"></i>
                    More projects to come soon. Stay tuned!
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { myProjects } from '../constants/constants'
</script>