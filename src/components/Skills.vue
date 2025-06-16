<template>
    <section
        id="skills"
        class="section py-24 bg-white"
    >
        <div class="container mx-auto px-4">
            <SectionHeader
                title="My Expertise"
                subTitle="Technical Skills"
            />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div
                    v-for="(skill, index) in mainSkills"
                    :key="`skill-${index}`"
                    class="card p-8"
                    data-aos="zoom-in"
                    :data-aos-delay="index * 100"
                >
                    <div class="flex items-center justify-center w-16 h-16 bg-light-cyan rounded-2xl mx-auto">
                        <font-awesome-icon class="text-ncs-blue text-2xl" :icon="['fas', skill.icon]"></font-awesome-icon>
                    </div>
                    <h3 class="text-xl font-bold text-oxford-blue mb-4 text-center">
                        {{ skill.category }}
                    </h3>
                    <div class="space-y-5">
                        <div
                            v-for="(item, idx) in skill.skills"
                            :key="`skill-item-${skill.color}-${idx}`"
                        >
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">
                                    {{ item.name }}
                                </span>
                                <span class="text-chinese-bronze">
                                    {{ item.level }}
                                </span>
                            </div>
                            <div class="skill-bar">
                                <div
                                    class="skill-progress"
                                    :style="{ width: `${item.bar}%`, backgroundColor: `var(--color-${skill.color})` }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div
                class="mt-12"
                data-aos="fade-up"
            >
                <h3 class="text-xl font-bold text-oxford-blue mb-6 text-center">Additional Skills</h3>
                <div class="flex flex-wrap justify-center gap-3">
                    <span
                        v-for="tag in additionalSkills"
                        :key="`tag-${tag.name}`"
                        :class="`tag bg-${tag.color}/10 text-${tag.color}`"
                    >
                        {{ tag.name }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import SectionHeader from '@/generics/SectionHeader.vue';
    import { mainSkills, additionalSkills } from '@/constants/constants.js';
</script>
