<template>
    <section id="projects" ref="projects" class="section py-24 bg-light-cyan">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-process-cyan uppercase tracking-wider mb-2">My Work</span>
                <h2 class="text-3xl md:text-4xl font-bold text-oxford-blue mb-4 text-center">Featured Projects</h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>
            
            <div class="flex justify-center mb-10">
                <div class="inline-flex bg-white p-1.5 rounded-full shadow-sm">
                    <button class="filter-btn active px-5 py-2 rounded-full text-sm font-medium transition-all duration-200" data-filter="all">All</button>
                    <button class="filter-btn px-5 py-2 rounded-full text-sm font-medium transition-all duration-200" data-filter="web">Web App</button>
                    <button class="filter-btn px-5 py-2 rounded-full text-sm font-medium transition-all duration-200" data-filter="mobile">Mobile</button>
                    <button class="filter-btn px-5 py-2 rounded-full text-sm font-medium transition-all duration-200" data-filter="ui">UI/UX</button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Project 1 -->
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
                
                <!-- Project 2 -->
                <div class="project-card bg-white rounded-xl overflow-hidden shadow-sm" data-category="mobile">
                    <div class="h-48 bg-gradient-to-br from-ncs-blue to-process-cyan relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-white">
                            <svg class="w-20 h-20 opacity-30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M17.671 14.307C16.184 12.819 14.17 12 12 12s-4.184.819-5.671 2.307l1.414 1.414c1.11-1.11 2.621-1.722 4.257-1.722 1.636 0 3.146.612 4.257 1.722l1.414-1.414z"/>
                                <path d="M20.437 11.292c-4.572-4.573-12.301-4.573-16.873 0l1.414 1.414c3.807-3.807 10.238-3.807 14.045 0l1.414-1.414z"/>
                                <circle cx="12" cy="18" r="2"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-bold text-oxford-blue">Fitness Tracker App</h3>
                            <span class="tag">Mobile</span>
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-3">A mobile application for tracking workouts, nutrition, and fitness goals with data visualization.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">React Native</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Firebase</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Redux</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">D3.js</span>
                        </div>
                        <div class="flex space-x-4">
                            <a href="#" class="text-process-cyan hover:text-ocean-blue transition-colors font-medium flex items-center">
                                <i class="fas fa-external-link-alt mr-1"></i> App Store
                            </a>
                            <a href="#" class="text-process-cyan hover:text-ocean-blue transition-colors font-medium flex items-center">
                                <i class="fab fa-github mr-1"></i> Code
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Project 3 -->
                <div class="project-card bg-white rounded-xl overflow-hidden shadow-sm" data-category="ui">
                    <div class="h-48 bg-gradient-to-br from-chinese-bronze to-dark-bronze relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-white">
                            <svg class="w-20 h-20 opacity-30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"/>
                                <path d="M9.293 6.707 5.586 10.414 9.293 14.121 10.707 12.707 8.414 10.414 10.707 8.121z"/>
                                <path d="M14.707 6.707 13.293 8.121 15.586 10.414 13.293 12.707 14.707 14.121 18.414 10.414z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-bold text-oxford-blue">Design System</h3>
                            <span class="tag">UI/UX</span>
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-3">A comprehensive design system with reusable components, style guides, and documentation.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Figma</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Storybook</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">React</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Styled Components</span>
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
                
                <!-- Project 4 -->
                <div class="project-card bg-white rounded-xl overflow-hidden shadow-sm" data-category="web">
                    <div class="h-48 bg-gradient-to-br from-process-cyan to-ncs-blue relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-white">
                            <svg class="w-20 h-20 opacity-30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 16v-5H7v-2h4V6h2v5h4v2h-4v5h-2z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-bold text-oxford-blue">Task Management App</h3>
                            <span class="tag">Web App</span>
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-3">A collaborative task management application with real-time updates and team collaboration features.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Vue.js</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Firebase</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Vuex</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Tailwind CSS</span>
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
                
                <!-- Project 5 -->
                <div class="project-card bg-white rounded-xl overflow-hidden shadow-sm" data-category="ui">
                    <div class="h-48 bg-gradient-to-br from-oxford-blue to-ocean-blue relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-white">
                            <svg class="w-20 h-20 opacity-30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"/>
                                <path d="M7 7h1.998v2H7zm4 0h6v2h-6zm-4 4h1.998v2H7zm4 0h6v2h-6zm-4 4h1.998v2H7zm4 0h6v2h-6z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-bold text-oxford-blue">Dashboard UI Kit</h3>
                            <span class="tag">UI/UX</span>
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-3">A comprehensive UI kit for building admin dashboards and data visualization interfaces.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Sketch</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Figma</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Adobe XD</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">HTML/CSS</span>
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
                
                <!-- Project 6 -->
                <div class="project-card bg-white rounded-xl overflow-hidden shadow-sm" data-category="mobile">
                    <div class="h-48 bg-gradient-to-br from-ocean-blue to-oxford-blue relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-white">
                            <svg class="w-20 h-20 opacity-30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.186 10.74L12 16.926 7.814 12.74a2.745 2.745 0 0 1 0-3.907 2.745 2.745 0 0 1 3.906 0l.28.279.279-.279a2.745 2.745 0 0 1 3.906 0 2.745 2.745 0 0 1 .001 3.907z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="text-xl font-bold text-oxford-blue">Health Monitoring App</h3>
                            <span class="tag">Mobile</span>
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-3">A mobile app for monitoring health metrics, medication reminders, and connecting with healthcare providers.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Flutter</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Dart</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Firebase</span>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">HealthKit</span>
                        </div>
                        <div class="flex space-x-4">
                            <a href="#" class="text-process-cyan hover:text-ocean-blue transition-colors font-medium flex items-center">
                                <i class="fas fa-external-link-alt mr-1"></i> App Store
                            </a>
                            <a href="#" class="text-process-cyan hover:text-ocean-blue transition-colors font-medium flex items-center">
                                <i class="fab fa-github mr-1"></i> Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-12">
                <a href="#" class="inline-flex items-center bg-oxford-blue hover:bg-ocean-blue text-white px-8 py-3 rounded-lg font-medium transition duration-300 shadow-md">
                    <span>View All Projects</span>
                    <i class="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        </div>
    </section>
</template>