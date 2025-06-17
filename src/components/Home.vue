<template>
    <section
        id="home"
        class="section pt-24 sm:pt-28 md:pt-32 pb-16 bg-gradient-to-r from-oxford-blue to-ocean-blue text-white min-h-screen flex items-center"
    >
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center justify-between gap-10">
                <div
                    class="w-full md:w-1/2 text-center md:text-left"
                    data-aos="fade-right"
                >
                    <span
                        class="inline-block px-4 py-1 rounded-full bg-white/10 text-sm font-medium mb-4 sm:mb-6"
                        data-aos="fade-down"
                        data-aos-delay="200"
                    >
                        Full Stack Developer
                    </span>
                    <h1
                        class="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        Hi, I'm
                        <span class="relative text-chinese-bronze font-mono">
                            <span id="typed-name"></span>
                            <span class="absolute ml-1 text-chinese-bronze animate-coding-cursor">_</span>
                        </span>
                    </h1>
                    <p
                        class="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0"
                        data-aos="fade-up"
                        data-aos-delay="600"
                    >
                        {{ introText }}
                    </p>
                    <div
                        class="flex flex-col sm:flex-row sm:justify-start gap-4"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                    >
                        <a
                            href="#contact"
                            class="bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-lg font-medium transition-transform duration-300 transform hover:scale-105 shadow-lg text-center"
                        >
                            Get in Touch
                        </a>
                        <a
                            href="#projects"
                            class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition duration-300 border border-white/20 text-center"
                        >
                            View Projects
                        </a>
                    </div>
                </div>

                <div
                    class="w-full md:w-1/2 flex justify-center relative"
                    data-aos="zoom-in"
                    data-aos-delay="1000"
                >
                    <div class="group relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 perspective-dramatic">
                        <!-- Outer Pulsing Glow -->
                        <div class="absolute inset-0 bg-ncs-blue/20 rounded-full animate-pulse shadow-md z-0"></div>

                        <!-- Middle Ring -->
                        <div class="absolute inset-2 sm:inset-4 bg-ocean-blue/40 rounded-full shadow-md z-10"></div>

                        <!-- Avatar Image with Tilt -->
                        <div
                            class="absolute inset-5 sm:inset-6 bg-oxford-blue rounded-full shadow-md overflow-hidden z-20 flex items-center justify-center
                            transform-gpu transition-transform duration-500 group-hover:rotate-2 group-hover:-translate-y-2 group-hover:scale-105"
                        >
                            <img
                                src="/3d_profile.png"
                                alt="3D Profile"
                                class="w-full h-full object-cover rounded-full pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="mt-12 sm:mt-16 flex justify-center space-x-6"
                data-aos="fade-up"
                data-aos-delay="600"
            >
                <a
                    v-for="link in socialLinks"
                    :key="`home-${link.icon}`"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white text-2xl sm:text-3xl hover:text-chinese-bronze transition-colors"
                >
                    <font-awesome-icon :icon="['fab', link.icon]" />
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
