<template>
<!-- Contact Section -->
    <section id="contact" ref="contact" class="section py-24 bg-gradient-to-br from-oxford-blue to-ocean-blue text-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-process-cyan uppercase tracking-wider mb-2">Contact</span>
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-center">Get In Touch</h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>
            
            <div class="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
                <div class="md:w-2/5">
                    <div class="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-lg">
                        <h3 class="text-2xl font-semibold mb-8">Contact Information</h3>
                        
                        <div class="space-y-8">
                            <div class="flex items-start">
                                <div class="bg-chinese-bronze/20 p-3 rounded-xl mr-4 flex-shrink-0">
                                    <i class="fas fa-envelope text-chinese-bronze"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium mb-1">Email</h4>
                                    <p class="text-gray-300">cmarkgonzales.17@gmail.com</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="bg-chinese-bronze/20 p-3 rounded-xl mr-4 flex-shrink-0">
                                    <i class="fas fa-phone text-chinese-bronze"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium mb-1">Phone</h4>
                                    <p class="text-gray-300">+63 9081122600</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="bg-chinese-bronze/20 p-3 rounded-xl mr-4 flex-shrink-0">
                                    <i class="fas fa-map-marker-alt text-chinese-bronze"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium mb-1">Location</h4>
                                    <p class="text-gray-300">Cebu City, Cebu, Philippines</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-12">
                            <h3 class="text-xl font-semibold mb-6">Follow Me</h3>
                            <div class="flex space-x-4">
                                <a href="#" class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                                    <i class="fab fa-github text-xl"></i>
                                </a>
                                <a href="#" class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                                    <i class="fab fa-linkedin-in text-xl"></i>
                                </a>
                                <a href="#" class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                                    <i class="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="#" class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                                    <i class="fab fa-dribbble text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="md:w-3/5">
                    <div class="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-lg">
                        <h3 class="text-2xl font-semibold mb-6">Send Me a Message</h3>
                        
                        <form id="contact-form" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="name" class="block text-sm font-medium mb-2">Name</label>
                                    <input type="text" id="name" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white" placeholder="Your Name">
                                </div>
                                
                                <div>
                                    <label for="email" class="block text-sm font-medium mb-2">Email</label>
                                    <input type="email" id="email" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white" placeholder="Your Email">
                                </div>
                            </div>
                            
                            <div>
                                <label for="subject" class="block text-sm font-medium mb-2">Subject</label>
                                <input type="text" id="subject" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white" placeholder="Subject">
                            </div>
                            
                            <div>
                                <label for="message" class="block text-sm font-medium mb-2">Message</label>
                                <textarea id="message" rows="5" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white" placeholder="Your Message"></textarea>
                            </div>
                            
                            <div class="pt-2">
                                <button type="submit" class="w-full bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md flex items-center justify-center">
                                    <span>Send Message</span>
                                    <i class="fas fa-paper-plane ml-2"></i>
                                </button>
                            </div>
                        </form>
                        
                        <div id="form-message" class="mt-6 hidden">
                            <div class="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-center">
                                <p>Your message has been sent successfully! I'll get back to you soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
