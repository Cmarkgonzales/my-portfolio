<template>
    <header>
        <nav
            class="fixed top-0 left-0 w-full bg-white px-4 py-3 shadow-sm z-30"
            data-aos="fade-down"
        >
            <div class="flex justify-between items-center max-w-7xl mx-auto">
                <div
                    class="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                >
                    <img
                        src="/assets/logo.svg"
                        alt="Nav Logo"
                        class="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 rounded-full transition-all duration-300"
                    />
                    <a
                        href="#home"
                        class="font-inters text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold text-ocean-blue hover:text-ncs-blue transition-colors duration-300"
                    >
                        Chris<span class="text-chinese-bronze hover:text-dark-bronze">Chan</span>
                    </a>
                </div>

                <div class="md:hidden z-40">
                    <button
                        type="button"
                        class="text-oxford-blue text-3xl focus:outline-none"
                        @click="mobileMenuVisible = true"
                        aria-label="Open mobile menu"
                    >
                        <font-awesome-icon icon="fas fa-bars" />
                    </button>
                </div>

                <ul class="hidden md:flex items-center space-x-2 lg:space-x-6">
                    <li
                        v-for="item in navLinks"
                        :key="`nav-link-${item.name}`"
                        @click="scrollToSection(item.href)"
                    >
                        <a
                            :href="item.href"
                            :class="[
                                'relative inline-block px-4 py-2 rounded-full transition-all duration-300 ease-linear text-base lg:text-lg text-oxford-blue',
                                activeLink === item.href
                                ? 'bg-ocean-blue text-white'
                                : 'hover:bg-ncs-blue/5 hover:text-ncs-blue'
                            ]"
                        >
                            {{ item.name }}
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <div
            :class="[
                'fixed top-0 right-0 w-64 h-full bg-white z-40 p-8 flex flex-col space-y-6 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden',
                mobileMenuVisible ? 'translate-x-0' : 'translate-x-full'
            ]"
        >
            <button
                type="button"
                class="absolute top-4 right-4 text-3xl text-oxford-blue focus:outline-none"
                @click="closeMobileMenu"
                aria-label="Close mobile menu"
            >
                <font-awesome-icon icon="fas fa-xmark" />
            </button>

            <ul class="flex flex-col space-y-5 mt-6">
                <li
                    v-for="item in navLinks"
                    :key="`mobile-link-${item.name}`"
                    @click="scrollToSection(item.href)"
                >
                    <a
                        :href="item.href"
                        :class="[
                            'relative inline-block px-4 py-2 rounded-full transition-all duration-300 ease-linear text-base text-oxford-blue',
                            activeLink === item.href ? 'bg-ocean-blue text-white' : 'hover:bg-ncs-blue/10 hover:text-ncs-blue'
                        ]"
                    >
                        {{ item.name }}
                    </a>
                </li>
            </ul>
        </div>
    </header>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
    import { constantsStore } from '@/store';

    const navLinks = computed(() => constantsStore.navLinks);
    const activeLink = ref('#home');
    const mobileMenuVisible = ref(false);
    const sections = ref([]);
    let observer = null;

    const scrollToSection = (selector) => {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            activeLink.value = selector;
        }
        mobileMenuVisible.value = false;
    }

    const closeMobileMenu = () => {
        mobileMenuVisible.value = false;
    }

    // Escape key closes mobile menu
    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    }

    const initIntersectionObserver = () => {
        if (observer) observer.disconnect();

        sections.value = navLinks.value
            .map(link => document.querySelector(link.href))
            .filter(Boolean);

        observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    activeLink.value = `#${visible[0].target.id}`;
                }
            },
            { root: null, threshold: 0.3 }
        );

        sections.value.forEach(section => observer.observe(section));
    }

    onMounted(() => {
        requestAnimationFrame(() => {
            history.replaceState(null, '', '#home');
            initIntersectionObserver();
            window.addEventListener('keydown', handleKeydown);
        });
    });

    onBeforeUnmount(() => {
        if (observer) observer.disconnect();
        window.removeEventListener('keydown', handleKeydown);
    });

    watch(activeLink, (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            history.replaceState(null, '', newValue);
        }
    });
</script>
