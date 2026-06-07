<template>
    <Section id="skills" bg="surface">
        <SectionHeader
            title="My Expertise"
            subTitle="Technical Skills"
            subTitleColor="text-text-primary"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
            <div
                v-for="(skill, index) in mainSkills"
                :key="`skill-${index}`"
                class="rounded-xl border border-border-subtle surface-glass p-6 md:p-7"
                data-reveal="fade-up"
                :style="{ '--reveal-delay': `${120 + index * 90}ms` }"
            >
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-ncs-blue/15 border border-ncs-blue/35">
                        <font-awesome-icon class="text-ncs-blue text-lg" :icon="['fas', skill.icon]" />
                    </div>
                    <h3 class="text-xl font-bold text-text-primary">
                        {{ skill.category }}
                    </h3>
                </div>
                <div class="space-y-4">
                    <SkillProficiencyBar
                        v-for="(item, idx) in skill.skills"
                        :key="`skill-item-${skill.color}-${idx}`"
                        :name="item.name"
                        :level="item.level"
                        :proficiency="resolveProficiency(item)"
                        :fill-class="barFillClass(skill.color)"
                    />
                </div>
            </div>
        </div>

        <div
            class="mt-16"
            data-reveal="fade-up"
            :style="{ '--reveal-delay': '180ms' }"
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
    import SkillProficiencyBar from '@/components/SkillProficiencyBar.vue';
    import { resolveProficiency } from '@/utils/skillProficiency';

    const mainSkills = computed(() => constantsStore.mainSkills);
    const additionalSkills = computed(() => constantsStore.additionalSkills);

    const barFillClass = (color) => {
        const map = {
            'ncs-blue': 'bg-gradient-to-r from-ncs-blue to-sky-cyan',
            'ocean-blue': 'bg-gradient-to-r from-ocean-blue to-ncs-blue',
            'chinese-bronze': 'bg-gradient-to-r from-chinese-bronze to-dark-bronze',
            'sky-cyan': 'bg-gradient-to-r from-sky-cyan to-ncs-blue',
            'dark-bronze': 'bg-gradient-to-r from-dark-bronze to-chinese-bronze',
        };
        return map[color] ?? map['ncs-blue'];
    };
</script>
