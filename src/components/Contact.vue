<template>
    <Section id="contact" bg="dark" class="bg-gradient-to-br from-oxford-blue to-ocean-blue">
            <SectionHeader
                title="Contact"
                subTitle="Get In Touch"
                subTitleColor="text-white"
            />
            <div class="flex flex-col md:flex-row gap-14 lg:gap-16 max-w-6xl mx-auto">
                <div
                    class="md:w-2/5"
                    data-reveal="fade-right"
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
                                <div class="flex-grow min-w-0">
                                    <h4 class="text-lg font-medium mb-1">
                                        {{ detail.key }}
                                    </h4>
                                    <p class="text-gray-300 break-words">
                                        {{ detail.value }}
                                        <button
                                            v-if="isCopyable(detail)"
                                            type="button"
                                            class="contact-copy-btn ml-1.5 inline-flex align-middle focus-ring"
                                            :aria-label="`Copy ${detail.key.toLowerCase()}`"
                                            @click="copyContactValue(detail)"
                                        >
                                            <font-awesome-icon icon="fas fa-copy" />
                                            <span class="sr-only">Copy {{ detail.key }}</span>
                                        </button>
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
                    data-reveal="fade-left"
                    :style="{ '--reveal-delay': '120ms' }"
                >
                    <div class="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10 shadow-lg">
                        <h3 class="text-2xl font-semibold mb-6">
                            Send Me a Message
                        </h3>

                        <div class="mb-6">
                            <p class="text-sm text-gray-300 mb-3">I'm interested in:</p>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="intent in intentOptions"
                                    :key="intent.id"
                                    type="button"
                                    class="rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors focus-ring"
                                    :class="selectedIntent === intent.id
                                        ? 'border-sky-cyan bg-sky-cyan/20 text-sky-cyan'
                                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:text-white'"
                                    :aria-pressed="selectedIntent === intent.id"
                                    @click="applyIntent(intent)"
                                >
                                    {{ intent.label }}
                                </button>
                            </div>
                        </div>

                        <form
                            id="contact-form"
                            class="space-y-6"
                            @submit.prevent="handleSubmit"
                        >
                            <div
                                v-if="submitError"
                                class="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 space-y-2"
                                role="alert"
                                aria-live="assertive"
                            >
                                <p>{{ submitError }}</p>
                                <a
                                    v-if="contactEmail"
                                    :href="mailtoFallbackHref"
                                    class="inline-flex items-center gap-2 text-sky-cyan hover:text-white transition-colors underline underline-offset-2"
                                >
                                    <font-awesome-icon icon="fas fa-envelope" />
                                    Email me directly at {{ contactEmail }}
                                </a>
                            </div>

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

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                class="w-full flex items-center justify-center cursor-pointer"
                                :disabled="isSending || submitSuccess"
                                :class="{ 'contact-submit--success': submitSuccess && !isReducedMotion }"
                            >
                                <template v-if="submitSuccess">
                                    <font-awesome-icon
                                        class="mr-2"
                                        :class="{ 'contact-check-pulse': !isReducedMotion }"
                                        icon="fas fa-check-circle"
                                    />
                                    Message Sent!
                                </template>
                                <template v-else-if="!isSending">
                                    Send Message
                                    <font-awesome-icon class="ml-2" icon="fas fa-paper-plane" />
                                </template>
                                <template v-else>
                                    <font-awesome-icon class="mr-2 animate-spin" icon="fas fa-spinner" />
                                    Sending your message...
                                </template>
                            </Button>
                        </form>

                        <Toast
                            v-model:show="showToast"
                            :message="toastMessage"
                        />
                    </div>
                </div>
            </div>
    </Section>
</template>

<script setup>
    import { reactive, ref, computed, onMounted, watch } from 'vue';
    import emailjs from '@emailjs/browser';
    import { constantsStore } from '@/store';
    import { useContactPrefill } from '@/composables/useContactPrefill';
    import { useMotion } from '@/composables/useMotion';
    import SectionHeader from '@/generics/SectionHeader.vue';
    import FormInput from '@/generics/FormInput.vue';
    import FormTextArea from '@/generics/FormTextArea.vue';
    import Section from '@/components/ui/Section.vue';
    import Button from '@/components/ui/Button.vue';
    import Toast from '@/components/ui/Toast.vue';

    const { pendingIntent, consumeIntent } = useContactPrefill();
    const { isReducedMotion } = useMotion();

    const intentOptions = [
        {
            id: 'collaboration',
            label: 'Collaboration',
            subject: 'Collaboration Opportunity',
            message: "Hi Christian,\n\nI'm reaching out about a potential collaboration. ",
        },
        {
            id: 'full-time',
            label: 'Full-time',
            subject: 'Full-time Role Inquiry',
            message: "Hi Christian,\n\nI'm interested in discussing a full-time opportunity. ",
        },
        {
            id: 'freelance',
            label: 'Freelance',
            subject: 'Freelance Project Inquiry',
            message: "Hi Christian,\n\nI have a freelance project I'd like to discuss. ",
        },
    ];

    const formData = reactive({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const errors = reactive({});
    const isSending = ref(false);
    const submitSuccess = ref(false);
    const submitError = ref('');
    const showToast = ref(false);
    const toastMessage = ref('');
    const selectedIntent = ref(null);

    const socialLinks = computed(() => constantsStore.socialLinks);
    const contactDetails = computed(() => constantsStore.contact);

    const contactEmail = computed(() => {
        const infos = contactDetails.value?.infos ?? [];
        const emailInfo = infos.find((info) => info.key?.toLowerCase() === 'email');
        return emailInfo?.value?.trim() ?? '';
    });

    const mailtoFallbackHref = computed(() => {
        const params = new URLSearchParams();
        if (formData.subject.trim()) params.set('subject', formData.subject.trim());
        if (formData.name.trim() || formData.message.trim()) {
            const body = [
                formData.name.trim() ? `Name: ${formData.name.trim()}` : '',
                formData.email.trim() ? `Email: ${formData.email.trim()}` : '',
                '',
                formData.message.trim(),
            ].filter(Boolean).join('\n');
            params.set('body', body);
        }
        const query = params.toString();
        return query ? `mailto:${contactEmail.value}?${query}` : `mailto:${contactEmail.value}`;
    });

    const applyIntent = (intent) => {
        selectedIntent.value = intent.id;
        formData.subject = intent.subject;
        formData.message = intent.message;
        clearError('subject');
        clearError('message');
    };

    const applyPrefillIntent = (intentId) => {
        const intent = intentOptions.find((option) => option.id === intentId);
        if (intent) {
            applyIntent(intent);
        }
    };

    onMounted(() => {
        const pending = consumeIntent();
        if (pending) {
            applyPrefillIntent(pending);
        }
    });

    watch(pendingIntent, (intent) => {
        if (intent) {
            applyPrefillIntent(intent);
            consumeIntent();
        }
    });

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

    const COPYABLE_KEYS = new Set(['email', 'phone']);

    const isCopyable = (detail) => COPYABLE_KEYS.has(detail.key.toLowerCase());

    const copyContactValue = async (detail) => {
        const label = detail.key.toLowerCase();
        try {
            await navigator.clipboard.writeText(detail.value);
            toastMessage.value = `${detail.key} copied to clipboard.`;
            showToast.value = true;
        } catch {
            toastMessage.value = `Unable to copy ${label}. Please copy it manually.`;
            showToast.value = true;
        }
    };

    const resolveEmailCredentials = () => {
        const credentials = contactDetails.value?.emailCredentials ?? {};
        const serviceID = credentials.serviceID?.trim();
        const templateID = credentials.templateID?.trim();
        const publicKey = credentials.userID?.trim() || credentials.publicKey?.trim();

        if (!serviceID || !templateID || !publicKey) {
            throw new Error('Email service is not configured.');
        }

        return { serviceID, templateID, publicKey };
    };

    const buildTemplateParams = () => ({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        reply_to: formData.email.trim(),
    });

    const resolveSubmitError = (error) => {
        const detail = String(error?.text ?? error?.message ?? '').trim();

        if (/invalid grant|gmail_api|reconnect your gmail/i.test(detail)) {
            return 'The contact form email service is temporarily unavailable. Please use the direct email link below.';
        }

        if (/public key is required|service id is required|template id is required/i.test(detail)) {
            return 'The contact form is not fully configured yet. Please use the direct email link below.';
        }

        if (detail) {
            return 'There was an error sending your message. Please try again later or use the direct email link below.';
        }

        return 'There was an error sending your message. Please try again later.';
    };

    const handleSubmit = async () => {
        submitError.value = '';
        submitSuccess.value = false;

        if (!validate()) return;

        isSending.value = true;
        try {
            const { serviceID, templateID, publicKey } = resolveEmailCredentials();
            emailjs.init({ publicKey });

            await emailjs.send(
                serviceID,
                templateID,
                buildTemplateParams(),
                { publicKey },
            );

            Object.keys(formData).forEach((key) => {
                formData[key] = '';
            });
            selectedIntent.value = null;
            submitSuccess.value = true;

            setTimeout(() => {
                submitSuccess.value = false;
            }, 4000);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Contact form submission failed:', error);
            }
            submitError.value = resolveSubmitError(error);
        } finally {
            isSending.value = false;
        }
    };
</script>

<style scoped>
    .contact-copy-btn {
        padding: 0.2rem;
        border-radius: 0.25rem;
        font-size: 0.65rem;
        color: rgba(198, 217, 238, 0.45);
        cursor: pointer;
        transition: color 0.2s ease, background-color 0.2s ease;
        vertical-align: middle;
    }

    .contact-copy-btn:hover {
        color: #07b2d9;
        background-color: rgba(255, 255, 255, 0.08);
    }

    .contact-check-pulse {
        animation: contact-check-pulse 0.6s ease-out;
    }

    .contact-submit--success {
        box-shadow: 0 0 0 1px rgba(7, 178, 217, 0.35), 0 0 24px rgba(7, 178, 217, 0.25);
    }

    @keyframes contact-check-pulse {
        0% {
            transform: scale(0.6);
            opacity: 0.4;
        }
        60% {
            transform: scale(1.15);
            opacity: 1;
        }
        100% {
            transform: scale(1);
        }
    }
</style>
