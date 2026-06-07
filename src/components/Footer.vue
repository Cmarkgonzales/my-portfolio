<template>
    <footer class="bg-oxford-blue text-white py-10" role="contentinfo">
        <div class="container mx-auto px-4">
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
                        Full Stack Developer
                    </p>
                </div>

                <div class="text-center text-sm text-gray-300 space-y-1">
                    <p>&copy; 2025 Christian Mark Gonzales. All rights reserved.</p>
                    <p class="text-xs text-gray-500">
                        Hero 3D laptop by
                        <a
                            href="https://sketchfab.com/yakuphan"
                            class="hover:text-gray-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >yakuphan</a>
                        (CC BY-NC)
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
    const scrollToHome = () => {
        const home = document.querySelector('#home');
        if (home) {
            home.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', '#home');
        }
    };
</script>
