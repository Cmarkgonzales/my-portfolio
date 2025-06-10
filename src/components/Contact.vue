<template>
    <section
        id="contact"
        ref="contact"
        class="section py-24 bg-gradient-to-br from-oxford-blue to-ocean-blue text-white"
    >
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center mb-16">
                <span class="text-sm font-medium text-process-cyan uppercase tracking-wider mb-2">
                    Contact
                </span>
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Get In Touch
                </h2>
                <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
            </div>

            <div class="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
                <div class="md:w-2/5">
                    <div class="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-lg">
                        <h3 class="text-2xl font-semibold mb-8">
                            Contact Information
                        </h3>

                        <div class="space-y-8">
                            <div
                                v-for="detail in contactDetails.infos"
                                :key="`contact-${detail.key}`"
                                class="flex items-start"
                            >
                                <div class="bg-chinese-bronze/20 p-3 rounded-xl mr-4 flex-shrink-0">
                                    <i :class="[`fas fa-${detail.icon}`, 'text-chinese-bronze']"></i>
                                </div>
                                <div>
                                    <h4 class="text-lg font-medium mb-1">
                                        {{ detail.key }}
                                    </h4>
                                    <p class="text-gray-300 break-words break-all">
                                        {{ detail.value }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-12">
                            <h3 class="text-xl font-semibold mb-6">Follow Me</h3>
                            <div class="flex space-x-4">
                                <a
                                    v-for="link in socialLinks"
                                    :key="`contact-${link.icon}`"
                                    :href="link.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"
                                >
                                    <i :class="`fab fa-${link.icon} text-xl`"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="md:w-3/5">
                    <div class="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-lg">
                        <h3 class="text-2xl font-semibold mb-6">
                            Send Me a Message
                        </h3>
                        <form
                            id="contact-form"
                            class="space-y-6"
                            @submit.prevent="sendEmail"
                        >
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        for="name"
                                        class="block text-sm font-medium mb-2"
                                    >
                                        Name
                                    </label>
                                    <input
                                        v-model="name"
                                        type="text"
                                        id="name"
                                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white"
                                        placeholder="Your Name"
                                    >
                                </div>
                                <div>
                                    <label
                                        for="email"
                                        class="block text-sm font-medium mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        v-model="email"
                                        type="email"
                                        id="email"
                                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white"
                                        placeholder="Your Email"
                                    >
                                </div>
                            </div>
                            <div>
                                <label
                                    for="subject"
                                    class="block text-sm font-medium mb-2"
                                >
                                    Subject
                                </label>
                                <input
                                    v-model="subject"
                                    type="text"
                                    id="subject"
                                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white"
                                    placeholder="Subject"
                                >
                            </div>
                            <div>
                                <label
                                    for="message"
                                    class="block text-sm font-medium mb-2"
                                >
                                    Message
                                </label>
                                <textarea
                                    v-model="message"
                                    id="message"
                                    rows="5"
                                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chinese-bronze text-white"
                                    placeholder="Your Message"
                                >
                                </textarea>
                            </div>
                            <button
                                type="submit"
                                class="w-full bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md flex items-center justify-center cursor-pointer"
                                :disabled="isSending"
                            >
                                <template v-if="!isSending">
                                    <span v-if="!isSending">Send Message</span>
                                    <i class="fas fa-paper-plane ml-2"></i>
                                </template>
                                <span v-else>
                                    <i class="fas fa-spinner animate-spin ml-2"></i>
                                    Sending...
                                </span>
                            </button>
                        </form>
                        <transition name="fade">
                            <div
                                v-if="showModal"
                                class="fixed inset-0 z-50 flex items-center justify-center bg-light-cyan/60 rounded-2xl backdrop-blur-sm"
                            >
                                <div class="bg-light-cyan rounded-lg p-6 max-w-sm w-full text-center shadow-xl text-oxford-blue">
                                <h2 class="text-xl font-bold mb-2">{{ modalMessage.title }}</h2>
                                <p class="mb-4">{{ modalMessage.content }}</p>
                                <button
                                    @click="showModal = false"
                                    class="mt-2 px-4 py-2 bg-chinese-bronze text-white rounded hover:bg-dark-bronze transition"
                                >
                                    Close
                                </button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import emailjs from '@emailjs/browser';
    import { socialLinks, contactDetails } from '@/constants/constants.js';
    import { ref } from 'vue';

    const name = ref('')
    const email = ref('')
    const subject = ref('')
    const message = ref('')

    const showModal = ref(false)
    const isSending = ref(false)
    const modalMessage = ref({
        title: 'Message Sent',
        content: 'Thank you! I’ll get back to you as soon as possible.',
    })

    const sendEmail = async () => {
        isSending.value = true
        try {
            const { serviceID, templateID, userID } = contactDetails.emailCredentials
            const templateParams = {
                name: name.value,
                email: email.value,
                subject: subject.value,
                message: message.value,
            }

            await emailjs.send(serviceID, templateID, templateParams, userID)

            name.value = email.value = subject.value = message.value = ''
        } catch (error) {
            modalMessage.title.value = 'Error Sending Message'
            modalMessage.content.value = 'There was an error sending your message. Please try again later.'
        } finally {
            isSending.value = false
            showModal.value = true
        }
    }
</script>
