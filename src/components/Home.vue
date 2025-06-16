<template>
    <section
        id="home"
        class="section pt-28 md:pt-32 pb-16 bg-linear-to-r/decreasing from-oxford-blue to-ocean-blue text-white min-h-screen flex items-center"
    >
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
                <div
                    class="md:w-1/2 mb-10 md:mb-0"
                    data-aos="fade-right"
                >
                    <span
                        class="inline-block px-4 py-1 rounded-full bg-white/10 text-sm font-medium mb-6" data-aos="fade-down"
                        data-aos-delay="200"
                    >
                        Full Stack Developer
                    </span>
                    <h1
                        class="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        Hi, I'm
                        <span class="relative text-chinese-bronze font-mono">
                            <span id="typed-name"></span>
                            <span class="absolute ml-2 text-chinese-bronze animate-coding-cursor">_</span>
                        </span>
                    </h1>
                    <p
                        class="text-xl mb-8 text-gray-200 leading-relaxed max-w-lg"
                        data-aos="fade-up"
                        data-aos-delay="600"
                    >
                        {{ introText }}
                    </p>
                    <div
                        class="flex flex-wrap gap-4 sm:flex-row"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                    >
                        <a
                            href="#contact"
                            class="bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-lg font-medium transition duration-300 transform hover:scale-105 shadow-lg w-full sm:w-max flex justify-center"
                        >
                            Get in Touch
                        </a>
                        <a
                            href="#projects"
                            class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition duration-300 border border-white/20 sm:flex-row w-full sm:w-max flex justify-center"
                        >
                            View Projects
                        </a>
                    </div>
                </div>

                <div
                    class="md:w-1/2 flex justify-center"
                    data-aos="zoom-in"
                    data-aos-delay="1000"
                >
                    <div class="avatar-container">
                        <div class="absolute inset-0 bg-ncs-blue rounded-full opacity-20 animate-pulse shadow-md z-0"></div>
                        <div class="absolute inset-4 bg-ocean-blue rounded-full opacity-40 shadow-md z-10"></div>
                        <div class="absolute inset-8 bg-oxford-blue rounded-full shadow-md overflow-hidden z-10 flex items-center justify-center">
                            <div class="relative w-full h-full">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src="/3d_profile.png"
                                        alt="3D Profile"
                                        class="w-full h-full object-cover rounded-full transform transition-transform duration-500 hover:scale-110 hover:-translate-y-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="mt-16 flex justify-center space-x-6"
                data-aos="fade-up"
                data-aos-delay="600"
            >
                <a
                    v-for="link in socialLinks"
                    :key="`home-${link.icon}`"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white text-3xl hover:text-chinese-bronze transition-colors"
                >
                    <font-awesome-icon :icon="['fab', link.icon]"></font-awesome-icon>
                </a>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, computed } from 'vue';
    import { constantsStore } from '@/store';

    const introText = computed(() => constantsStore.homeSection.introText);
    const socialLinks = computed(() => constantsStore.socialLinks);

    onMounted(() => {
        const name = "Christian Mark Gonzales";
        const typedName = document.getElementById("typed-name");
        let index = 0;

        const type = () => {
            if (index < name.length) {
                typedName.textContent += name.charAt(index);
                index++;
                setTimeout(type, 100);  // 100ms per character
            }
        };

        type();
    });
</script>
