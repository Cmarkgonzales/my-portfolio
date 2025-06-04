<template>
    <section id="projects" ref="projects" class="section py-24 bg-light-cyan">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-process-cyan uppercase tracking-wider mb-2">My Work</span>
                <h2 class="text-3xl md:text-4xl font-bold text-oxford-blue mb-4 text-center">Featured Projects</h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="project-card bg-white rounded-xl overflow-hidden shadow-sm" data-category="web">
                    <div class="h-48 bg-gradient-to-br from-ocean-blue to-process-cyan relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-white">
                            <svg class="w-20 h-20 opacity-30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                                <path d="M13 7h-2v6h6v-2h-4z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-bold text-oxford-blue">E-Commerce Platform</h3>
                            <span class="tag">Web App</span>
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-3">A full-featured e-commerce platform with product management, cart functionality, and payment processing.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">React</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Node.js</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">MongoDB</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Stripe</span>
                        </div>
                        <div class="flex space-x-4">
                            <a href="#" class="text-process-cyan hover:text-ocean-blue transition-colors font-medium flex items-center">
                                <i class="fas fa-external-link-alt mr-1"></i> Demo
                            </a>
                            <a href="#" class="text-process-cyan hover:text-ocean-blue transition-colors font-medium flex items-center">
                                <i class="fab fa-github mr-1"></i> Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>