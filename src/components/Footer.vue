<template>
    <footer class="bg-oxford-blue text-white py-10" role="contentinfo">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="flex flex-col items-center md:items-start space-y-2">
                    <div class="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-300">
                        <img
                            src="/portfolio_logo.svg"
                            alt="Portfolio Logo"
                            class="h-12 w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 rounded-full transition-all duration-300"
                        />
                        <a
                            href="#home"
                            class="font-inters text-xl lg:text-3xl font-bold text-ncs-blue hover:text-sky-cyan transition-colors duration-300"
                        >
                            Chris<span class="text-chinese-bronze hover:text-dark-bronze">Chan</span>
                        </a>
                    </div>
                    <p class="text-gray-400 text-sm ml-3">
                        Full Stack Developer
                    </p>
                </div>

                <div class="text-center text-sm text-gray-300 hover:text-white transition-colors duration-300">
                    &copy; 2025 Christian Mark Gonzales. All rights reserved.
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
