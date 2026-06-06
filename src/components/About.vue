<template>
    <Section id="about" bg="default">
            <SectionHeader
                title="About Me"
                subTitle="Who I Am"
                subTitleColor="text-text-primary"
            />
            <div class="flex flex-col md:flex-row items-center gap-14 lg:gap-[4.75rem]">
                <div
                    class="md:w-2/5"
                    data-aos="fade-right"
                >
                    <div class="relative">
                        <div class="w-full h-96 bg-light-cyan rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src="/assets/profile.png"
                                alt="About Profile"
                                class="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                        <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-chinese-bronze rounded-2xl flex items-center justify-center shadow-lg">
                            <div class="text-center text-white">
                                <span class="text-3xl font-bold block">
                                    4+
                                </span>
                                <span class="text-sm font-medium">
                                    Years Exp.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:w-3/5 stack-md" data-aos="fade-left" data-aos-delay="400">
                    <h3 class="text-2xl lg:text-3xl font-semibold text-text-primary">
                        Full Stack Developer
                    </h3>
                    <p class="text-text-secondary leading-relaxed">
                        {{ aboutMe.experience }}
                    </p>
                    <p class="text-text-secondary leading-relaxed">
                        {{ aboutMe.mindset }}
                    </p>
                    <p class="text-text-secondary leading-relaxed">
                        {{ aboutMe.hobbies }}
                    </p>

                    <ul
                        class="grid grid-cols-1 md:grid-cols-2 gap-6"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                    >
                        <li
                            v-for="(item, index) in aboutMe.personalInfo"
                            :key="index"
                            class="bg-white/6 border border-border-subtle p-4 rounded-lg backdrop-blur-sm"
                        >
                            <p class="text-text-secondary">
                                <span class="font-semibold text-sky-cyan">{{ item.label }}:</span>
                                {{ item.value }}
                            </p>
                        </li>
                    </ul>
                    <a
                        :href="resumeLink"
                        aria-label="Download"
                        class="inline-flex items-center bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-xl font-medium transition duration-300 shadow-[0_0_0_1px_rgba(217,128,50,0.28),0_0_24px_rgba(217,128,50,0.22)] hover:shadow-[0_0_0_1px_rgba(217,128,50,0.45),0_0_30px_rgba(217,128,50,0.35)]" data-aos="fade-up"
                        data-aos-delay="600"
                    >
                        <span>Download Resume</span>
                        <font-awesome-icon class="ml-2" icon="fas fa-download" />
                    </a>
                </div>
            </div>
    </Section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import Section from '@/components/ui/Section.vue';

    const aboutMe = computed(() => constantsStore.aboutMe);
    const resumeLink = computed(() => constantsStore.resumeLink);
</script>
