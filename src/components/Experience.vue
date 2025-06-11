<template>
    <section id="experience" ref="experience" class="section py-24 bg-light-cyan">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-process-cyan uppercase tracking-wider mb-2">
                    My Journey
                </span>
                <h2 class="text-3xl md:text-4xl font-bold text-oxford-blue mb-4 text-center">
                    Work Experience
                </h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>
            
            <div class="relative max-w-4xl mx-auto">
                <!-- Timeline Line -->
                <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full timeline-line"></div>
                <div class="timeline-container space-y-12">
                    <div
                        v-for="(item, index) in experiences"
                        :key="`exp-item-${index}`"
                        class="relative"
                    >
                        <div class="flex flex-col md:flex-row md:min-h-[200px] items-stretch">
                            <!-- Left Column -->
                            <div
                                class="md:w-1/2 mb-8 md:mb-0"
                                :class="index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pr-12 invisible md:visible'"
                            >
                                <ExperienceCard v-if="index % 2 === 0" :item="item" />
                            </div>
                            <!-- Timeline Dot -->
                            <div class="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 timeline-dot z-10"></div>

                            <!-- Right Column -->
                            <div
                                class="md:w-1/2"
                                :class="index % 2 !== 0 ? 'md:pl-12' : 'md:pl-12 invisible md:visible'"
                            >
                                <ExperienceCard v-if="index % 2 !== 0" :item="item" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { experiences } from '@/constants/constants.js';
    import ExperienceCard from '@/utils/ExperienceCard.vue';
</script>
