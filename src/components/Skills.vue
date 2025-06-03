<template>
    <section id="skills" class="section py-24 bg-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-sky-cyan uppercase tracking-wider mb-2">My Expertise</span>
                <h2 class="text-3xl md:text-4xl font-bold text-oxford-blue mb-4 text-center">Technical Skills</h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <!-- Frontend Skills -->
                <div class="skill-card p-8">
                    <div class="flex items-center justify-center w-16 h-16 bg-light-cyan rounded-2xl mb-6 mx-auto">
                        <svg class="w-8 h-8 text-sky-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-oxford-blue mb-4 text-center">Frontend Development</h3>
                    
                    <div class="space-y-5">
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">JavaScript / TypeScript</span>
                                <span class="text-chinese-bronze">95%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-sky-cyan" style="width: 95%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">React / Redux</span>
                                <span class="text-chinese-bronze">90%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-sky-cyan" style="width: 90%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">HTML5 / CSS3</span>
                                <span class="text-chinese-bronze">95%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-sky-cyan" style="width: 95%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">Tailwind / SASS</span>
                                <span class="text-chinese-bronze">85%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-sky-cyan" style="width: 85%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Backend Skills -->
                <div class="skill-card p-8">
                    <div class="flex items-center justify-center w-16 h-16 bg-light-cyan rounded-2xl mb-6 mx-auto">
                        <svg class="w-8 h-8 text-sky-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-oxford-blue mb-4 text-center">Backend Development</h3>
                    
                    <div class="space-y-5">
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">Node.js / Express</span>
                                <span class="text-chinese-bronze">90%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ocean-blue" style="width: 90%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">MongoDB / Mongoose</span>
                                <span class="text-chinese-bronze">85%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ocean-blue" style="width: 85%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">SQL / PostgreSQL</span>
                                <span class="text-chinese-bronze">80%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ocean-blue" style="width: 80%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">GraphQL</span>
                                <span class="text-chinese-bronze">75%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ocean-blue" style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Other Skills -->
                <div class="skill-card p-8">
                    <div class="flex items-center justify-center w-16 h-16 bg-light-cyan rounded-2xl mb-6 mx-auto">
                        <svg class="w-8 h-8 text-sky-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-oxford-blue mb-4 text-center">DevOps & Tools</h3>
                    
                    <div class="space-y-5">
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">Git & GitHub</span>
                                <span class="text-chinese-bronze">95%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ncs-blue" style="width: 95%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">Docker / Kubernetes</span>
                                <span class="text-chinese-bronze">80%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ncs-blue" style="width: 80%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">AWS / Cloud</span>
                                <span class="text-chinese-bronze">85%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ncs-blue" style="width: 85%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-medium text-gray-700">CI/CD Pipelines</span>
                                <span class="text-chinese-bronze">85%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress bg-ncs-blue" style="width: 85%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-12">
                <h3 class="text-xl font-bold text-oxford-blue mb-6 text-center">Additional Skills</h3>
                <div class="flex flex-wrap justify-center gap-3">
                    <span class="tag bg-oxford-blue/10 text-oxford-blue">Responsive Design</span>
                    <span class="tag bg-ocean-blue/10 text-ocean-blue">UI/UX Design</span>
                    <span class="tag bg-ncs-blue/10 text-ncs-blue">Agile/Scrum</span>
                    <span class="tag bg-sky-cyan/10 text-sky-cyan">RESTful APIs</span>
                    <span class="tag bg-chinese-bronze/10 text-chinese-bronze">Jest/Testing</span>
                    <span class="tag bg-oxford-blue/10 text-oxford-blue">Webpack</span>
                    <span class="tag bg-ocean-blue/10 text-ocean-blue">Figma</span>
                    <span class="tag bg-ncs-blue/10 text-ncs-blue">Performance Optimization</span>
                    <span class="tag bg-sky-cyan/10 text-sky-cyan">Cross-browser Compatibility</span>
                    <span class="tag bg-chinese-bronze/10 text-chinese-bronze">Accessibility (WCAG)</span>
                </div>
            </div>
        </div>
    </section>
</template>