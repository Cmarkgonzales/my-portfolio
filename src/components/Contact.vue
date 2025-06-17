<template>
    <section
        id="contact"
        class="section py-24 bg-gradient-to-br from-oxford-blue to-ocean-blue text-white"
    >
        <div class="container mx-auto px-4">
            <SectionHeader
                title="Contact"
                subTitle="Get In Touch"
                subTitleColor="text-white"
            />
            <div class="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
                <div
                    class="md:w-2/5"
                    data-aos="fade-right"
                >
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
                                    <font-awesome-icon
                                        class="text-chinese-bronze"
                                        :icon="['fas', detail.icon]"
                                    />
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
                                    :aria-label="`Profile link for ${link.icon}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"
                                >
                                    <font-awesome-icon class="text-xl" :icon="['fab', link.icon]" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="md:w-3/5"
                    data-aos="fade-left"
                >
                    <div class="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-lg">
                        <h3 class="text-2xl font-semibold mb-6">
                            Send Me a Message
                        </h3>
                        <form
                            id="contact-form"
                            class="space-y-6"
                            @submit.prevent="handleSubmit"
                        >
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    id="name"
                                    label="Name"
                                    v-model="formData.name"
                                    :error="errors.name"
                                    @clearError="clearError('name')"
                                    placeholder="Your Name"
                                />
                                <FormInput
                                    id="email"
                                    label="Email"
                                    v-model="formData.email"
                                    :error="errors.email"
                                    @clearError="clearError('email')"
                                    type="email"
                                    placeholder="Your Email"
                                />
                            </div>
                            <FormInput
                                id="subject"
                                label="Subject"
                                v-model="formData.subject"
                                :error="errors.subject"
                                @clearError="clearError('subject')"
                                placeholder="Subject"
                            />
                            <FormTextArea
                                id="message"
                                label="Message"
                                v-model="formData.message"
                                :error="errors.message"
                                @clearError="clearError('message')"
                                placeholder="Your Message"
                            />

                            <button
                                type="submit"
                                class="w-full bg-chinese-bronze hover:bg-dark-bronze text-white px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md flex items-center justify-center cursor-pointer"
                                :disabled="isSending"
                            >
                                <template v-if="!isSending">
                                    Send Message
                                    <font-awesome-icon class="ml-2" icon="fas fa-paper-plane" />
                                </template>
                                <template v-else>
                                    <font-awesome-icon class="mr-2 animate-spin" icon="fas fa-spinner" />
                                    Sending...
                                </template>
                            </button>
                        </form>

                        <transition name="fade">
                            <div
                                v-if="showModal"
                                class="fixed inset-0 z-50 flex items-center justify-center bg-light-cyan/60 rounded-2xl backdrop-blur-sm"
                            >
                                <div class="bg-light-cyan rounded-lg p-6 max-w-sm w-full text-center shadow-xl text-oxford-blue">
                                    <h2 class="text-xl font-bold mb-2">
                                        {{ modalMessage.title }}
                                    </h2>
                                    <p class="mb-4">
                                        {{ modalMessage.content }}
                                    </p>
                                    <button
                                        class="mt-2 px-4 py-2 bg-chinese-bronze text-white rounded hover:bg-dark-bronze transition"
                                        @click="showModal = false"
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
    import { reactive, ref, computed } from 'vue';
    import emailjs from '@emailjs/browser';
    import { constantsStore } from '@/store';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import FormInput from '@/generics/FormInput.vue';
    import FormTextArea from '@/generics/FormTextArea.vue';

    const formData = reactive({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const errors = reactive({});
    const isSending = ref(false);
    const showModal = ref(false);
    const modalMessage = ref({
        title: 'Message Sent',
        content: 'Thank you! I’ll get back to you as soon as possible.'
    });

    const socialLinks = computed(() => constantsStore.socialLinks);
    const contactDetails = computed(() => constantsStore.contact);

    const validate = () => {
        Object.keys(errors).forEach(key => delete errors[key])
        let isValid = true

        if (!formData.name.trim()) {
            errors.name = 'Name is required'
            isValid = false
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format'
            isValid = false
        }
        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required'
            isValid = false
        }
        if (!formData.message.trim()) {
            errors.message = 'Message is required'
            isValid = false
        }

        return isValid
    }

    const clearError = (field) => {
        delete errors[field]
    }

    const handleSubmit = async () => {
        if (!validate()) return

        isSending.value = true
        try {
            const { serviceID, templateID, userID } = contactDetails.value.emailCredentials
            await emailjs.send(serviceID, templateID, { ...formData }, userID)

            Object.keys(formData).forEach(key => formData[key] = '')
            modalMessage.value = {
                title: 'Message Sent',
                content: 'Thank you! I’ll get back to you as soon as possible.'
            }
        } catch (error) {
            modalMessage.value = {
                title: 'Error Sending Message',
                content: 'There was an error sending your message. Please try again later.'
            }
        } finally {
            isSending.value = false
            showModal.value = true
        }
    }
</script>
