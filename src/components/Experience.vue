<template>
    <Section id="experience" bg="light">
            <SectionHeader
                title="My Journey"
                subTitle="Work Experience"
            />
            <div class="relative max-w-5xl mx-auto">
                <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full timeline-line"></div>
                <div class="timeline-container space-y-14">
                    <div
                        v-for="(item, index) in experiences"
                        :key="`exp-item-${index}`"
                        class="relative"
                    >
                        <div class="flex flex-col md:flex-row md:min-h-[200px] items-stretch">

                            <div
                                class="md:w-1/2 mb-8 md:mb-0"
                                :class="index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pr-12 invisible md:visible'"
                            >
                                <ExperienceCard
                                    v-if="index % 2 === 0"
                                    :item="item"
                                    :index="index"
                                />
                            </div>

                            <div class="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 timeline-dot z-10"></div>

                            <div
                                class="md:w-1/2"
                                :class="index % 2 !== 0 ? 'md:pl-12' : 'md:pl-12 invisible md:visible'"
                            >
                                <ExperienceCard
                                    v-if="index % 2 !== 0"
                                    :item="item"
                                    :index="index"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </Section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import ExperienceCard from '@/generics/ExperienceCard.vue';
    import Section from '@/components/ui/Section.vue';

    const experiences = computed(() => constantsStore.experiences);
</script>
