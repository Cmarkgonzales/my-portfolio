<template>
    <footer class="bg-oxford-blue text-white py-10" role="contentinfo">
        <div class="site-container">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="flex flex-col items-center md:items-start space-y-2">
                    <div
                        class="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                        @click="scrollToHome"
                    >
                        <img
                            src="/assets/logo.svg"
                            alt=""
                            aria-hidden="true"
                            class="h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300 ring-1 ring-white/20"
                        />
                        <span class="font-mono text-sm sm:text-base text-sky-cyan">
                            cm_gonzales <span class="text-chinese-bronze">~/</span>
                        </span>
                    </div>
                    <p class="text-gray-400 text-sm ml-3">
                        Frontend | Backend | Full Stack Developer
                    </p>
                </div>

                <div class="text-center text-sm text-gray-300 space-y-1">
                    <p>&copy; 2025 Christian Mark Gonzales. All rights reserved.</p>
                    <p class="text-xs text-gray-500">
                        Hero 3D desktop by
                        <a
                            href="https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66"
                            class="hover:text-gray-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Yolala3D | Y3D</a>
                    </p>
                </div>

                <div>
                    <a
                        href="#home"
                        aria-label="Back to top"
                        class="bg-ocean-blue hover:bg-ncs-blue p-3 rounded-xl inline-block shadow-lg transition-all duration-300 ease-in-out hover:animate-bounce animate-soft-pulse"
                    >
                        <font-awesome-icon icon="fas fa-arrow-up" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
    const scrollToSection = (selector, hash) => {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', hash);
        }
    };

    const scrollToHome = () => {
        scrollToSection('#home', '#home');
    };
</script>
