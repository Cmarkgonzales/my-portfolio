<template>
    <header>
        <nav
            class="fixed top-0 left-0 w-full bg-white px-4 py-2 shadow-sm z-30"
            data-aos="fade-down"
        >
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity duration-300">
                    <img
                        src="/portfolio_logo.svg"
                        alt="Nav Logo"
                        class="h-12 w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 rounded-full transition-all duration-300"
                    />
                    <a
                        href="#home"
                        class="font-inters text-lg lg:text-3xl font-bold text-ocean-blue hover:text-ncs-blue transition-colors duration-300"
                    >
                        Chris<span class="text-chinese-bronze hover:text-dark-bronze">Chan</span>
                    </a>
                </div>
                <div class="md:hidden z-40">
                    <button
                        type="button"
                        class="block text-oxford-blue focus:outline-none"
                        @click="mobileMenuVisible = true"
                    >
                        <i class="fas fa-bars text-3xl"></i>
                    </button>
                </div>
                <ul class="hidden md:flex md:items-center lg:space-x-5 md:space-x-1">
                    <li
                        v-for="item in navLinks"
                        :key="`nav-link-${item.name}`"
                        @click="handleSectionNavigation(item.href)"
                    >
                        <a
                            :href="item.href"
                            :class="[
                                'relative inline-block px-4 py-2 rounded-full transition-all duration-300 ease-linear text-oxford-blue text-lg',
                                activeLink === item.href ? 'bg-ocean-blue text-white' : 'hover:bg-ncs-blue/5 hover:text-ncs-blue'
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
                'fixed top-0 right-0 w-64 h-full bg-white z-40 p-10 flex flex-col space-y-8 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden',
                mobileMenuVisible ? 'translate-x-0' : 'translate-x-full'
            ]"
        >
            <button
                type="button"
                class="absolute top-4 right-4 text-3xl text-oxford-blue focus:outline-none"
                @click="mobileMenuVisible = false"
            >
                <i class="fas fa-xmark"></i>
            </button>
            <ul class="flex flex-col space-y-5">
                <li
                    v-for="item in navLinks"
                    :key="`mobile-link-${item.name}`"
                    @click="handleSectionNavigation(item.href)"
                >
                    <a
                        :href="item.href"
                        :class="[
                            'relative inline-block px-4 py-2 rounded-full transition-all duration-300 ease-linear text-oxford-blue text-lg',
                            activeLink === item.href ? 'bg-ocean-blue text-white' : ''
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
    import { ref, onMounted, onBeforeUnmount, watch, nextTick} from 'vue';
    import { navLinks } from '@/constants/constants.js';

    const activeLink = ref('#home');
    const mobileMenuVisible = ref(false);
    let observer;

    const handleSectionNavigation = async (section) => {
        activeLink.value = section;
        mobileMenuVisible.value = false;
    };

    const sections = ref([]);
    onMounted(async () => {
        await nextTick();
        sections.value = navLinks
            .map(link => document.querySelector(link.href))
            .filter(Boolean);

        observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visibleSections.length > 0) {
                    const topSection = visibleSections[0];
                    activeLink.value = `#${topSection.target.id}`;
                }
            },
            {
                root: null,
                threshold: 0.3,
            }
        );

        sections.value.forEach(section => observer.observe(section));
    });

    onBeforeUnmount(() => {
        sections.value.forEach(section => observer.unobserve(section));
    });

    watch(activeLink, (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            history.replaceState(null, '', newValue);
        }
    });
</script>
