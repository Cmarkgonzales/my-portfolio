<template>
    <section
        id="about"
        class="section py-24 bg-white"
    >
        <div class="container mx-auto px-4">
            <SectionHeader
                title="About Me"
                subTitle="Who I Am"
            />
            <div class="flex flex-col md:flex-row items-center gap-12">
                <div
                    class="md:w-2/5"
                    data-aos="fade-right"
                >
                    <div class="relative">
                        <div class="w-full h-96 bg-light-cyan rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src="/profile.png"
                                alt="About Profile"
                                class="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                        <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-chinese-bronze rounded-2xl flex items-center justify-center shadow-lg">
                            <div class="text-center text-white">
                                <span class="text-3xl font-bold block">
                                    3+
                                </span>
                                <span class="text-sm font-medium">
                                    Years Exp.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:w-3/5" data-aos="fade-left" data-aos-delay="400">
                    <h3 class="text-2xl font-semibold text-ocean-blue mb-4">
                        Full Stack Developer
                    </h3>
                    <p class="text-gray-700 mb-6 leading-relaxed">
                        {{ aboutMe.experience }}
                    </p>
                    <p class="text-gray-700 mb-6 leading-relaxed">
                        {{ aboutMe.mindset }}
                    </p>
                    <p class="text-gray-700 mb-6 leading-relaxed">
                        {{ aboutMe.hobbies }}
                    </p>

                    <ul
                        class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                    >
                        <li
                            v-for="(item, index) in aboutMe.personalInfo"
                            :key="index"
                            class="bg-light-cyan p-4 rounded-lg"
                        >
                            <p class="text-gray-800">
                                <span class="font-semibold text-ocean-blue">{{ item.label }}:</span>
                                {{ item.value }}
                            </p>
                        </li>
                    </ul>

                    <a
                        href="/my-portfolio/Christian_Gonzales_Resume.pdf"
                        download
                        class="inline-flex items-center bg-oxford-blue hover:bg-ocean-blue text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md" data-aos="fade-up"
                        data-aos-delay="600"
                    >
                        <span>Download Resume</span>
                        <font-awesome-icon class="ml-2" icon="fas fa-download"></font-awesome-icon>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { computed } from 'vue';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';

    const aboutMe = computed(() => constantsStore.aboutMe);
</script>
