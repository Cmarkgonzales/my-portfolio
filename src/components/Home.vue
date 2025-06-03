<template>
    <section id="home" class="section pt-28 md:pt-32 pb-16 bg-linear-to-r/decreasing from-oxford-blue to-ocean-blue text-white min-h-screen flex items-center">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-10 md:mb-0">
                    <span class="inline-block px-4 py-1 rounded-full bg-white/10 text-sm font-medium mb-6">
                        Full Stack Developer
                    </span>
                    <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Hi, I'm
                        <span class="text-chinese-bronze typing-effect" id="name">
                            Christian Mark Gonzales
                        </span>
                    </h1>
                    <p class="text-xl mb-8 text-gray-200 leading-relaxed max-w-lg">
                        I build exceptional digital experiences that make an impact through clean code and thoughtful design.
                    </p>
                    <div class="flex flex-wrap gap-4 sm:flex-row">
                        <a href="#contact" class="bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-lg font-medium transition duration-300 transform hover:scale-105 shadow-lg w-full sm:w-max flex justify-center">Get in Touch</a>
                        <a href="#projects" class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition duration-300 border border-white/20 sm:flex-row w-full sm:w-max flex justify-center">View Projects</a>
                    </div>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <div class="relative w-64 h-64 md:w-80 md:h-80">
                        <div class="absolute inset-0 bg-ncs-blue rounded-full opacity-20 animate-pulse shadow-md z-0"></div>
                        <div class="absolute inset-4 bg-ocean-blue rounded-full opacity-40 shadow-md z-10"></div>
                        <div class="absolute inset-8 bg-oxford-blue rounded-full shadow-md overflow-hidden z-10 flex items-center justify-center">
                            <div class="relative w-full h-full">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src="/3d_profile.png"
                                        alt="Profile"
                                        class="w-full h-full object-cover rounded-full transform transition-transform duration-500 hover:scale-110 hover:-translate-y-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-16 flex justify-center space-x-6">
                <a
                    v-for="link in socialLinks"
                    :key="`home-${link.icon}`"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-white hover:text-chinese-bronze transition-colors"
                >
                    <i :class="`fab fa-${link.icon} text-3xl`"></i>
                </a>
            </div>
        </div>
    </section>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import { socialLinks } from '../constants/constants'

    const nameRef = ref(null)

    onMounted(() => {
        const nameElement = nameRef.value
        if (!nameElement) return

        const nameText = nameElement.textContent
        nameElement.textContent = ''

        let i = 0
        const typeWriter = () => {
            if (i < nameText.length) {
                nameElement.textContent += nameText.charAt(i)
                i++
                setTimeout(typeWriter, 100)
            }
        }

        setTimeout(typeWriter, 1000)
    })
</script>
