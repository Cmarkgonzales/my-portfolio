<template>
    <Section id="skills" bg="surface">
            <SectionHeader
                title="My Expertise"
                subTitle="Technical Skills"
                subTitleColor="text-text-primary"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
                <Card
                    v-for="(skill, index) in mainSkills"
                    :key="`skill-${index}`"
                    variant="glass"
                    class="p-7 md:p-8"
                    data-aos="fade-up"
                    :data-aos-delay="index * 100"
                >
                    <div class="flex items-center gap-3 mb-6">
                        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-ncs-blue/15 border border-ncs-blue/35">
                            <font-awesome-icon class="text-ncs-blue text-lg" :icon="['fas', skill.icon]" />
                        </div>
                        <h3 class="text-xl font-bold text-text-primary">
                            {{ skill.category }}
                        </h3>
                    </div>
                    <div class="flex flex-wrap gap-2.5">
                        <span
                            v-for="(item, idx) in skill.skills"
                            :key="`skill-item-${skill.color}-${idx}`"
                            class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs md:text-sm transition-colors duration-300 hover:border-chinese-bronze/50 hover:text-white"
                            :style="skillChipStyle(skill.color)"
                        >
                            <span class="font-medium">{{ item.name }}</span>
                            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-white/12 text-text-secondary">
                                {{ item.level }}
                            </span>
                        </span>
                    </div>
                </Card>
            </div>
            
            <div
                class="mt-16"
                data-aos="fade-up"
            >
                <h3 class="text-xl font-bold text-text-primary mb-6 text-center">Additional Skills</h3>
                <div class="flex flex-wrap justify-center gap-3">
                    <span
                        v-for="tag in additionalSkills"
                        :key="`tag-${tag.name}`"
                        class="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs md:text-sm font-medium border border-border-subtle bg-white/6 text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-ncs-blue/40 hover:text-text-primary"
                    >
                        {{ tag.name }}
                    </span>
                </div>
            </div>
    </Section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import Section from '@/components/ui/Section.vue';
    import Card from '@/components/ui/Card.vue';

    const mainSkills = computed(() => constantsStore.mainSkills);
    const additionalSkills = computed(() => constantsStore.additionalSkills);

    const colorMap = {
        'ncs-blue': { border: 'rgba(4, 138, 191, 0.4)', background: 'rgba(4, 138, 191, 0.15)', text: '#a8dcf5' },
        'ocean-blue': { border: 'rgba(1, 58, 99, 0.45)', background: 'rgba(1, 58, 99, 0.22)', text: '#b7cfe9' },
        'chinese-bronze': { border: 'rgba(217, 128, 50, 0.42)', background: 'rgba(217, 128, 50, 0.14)', text: '#f3c9a3' },
        'sky-cyan': { border: 'rgba(7, 178, 217, 0.45)', background: 'rgba(7, 178, 217, 0.14)', text: '#b8effe' },
        'dark-bronze': { border: 'rgba(187, 95, 9, 0.42)', background: 'rgba(187, 95, 9, 0.14)', text: '#f2c08e' }
    };

    const skillChipStyle = (color) => {
        const palette = colorMap[color] ?? colorMap['ncs-blue'];
        return {
            borderColor: palette.border,
            backgroundColor: palette.background,
            color: palette.text
        };
    };
</script>
