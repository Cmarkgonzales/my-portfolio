<template>
    <header class="fixed top-0 left-0 w-full z-40">
        <nav
            :class="[
                'mx-auto mt-3 md:mt-4 w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-7xl rounded-2xl border px-4 md:px-6 transition-all duration-300',
                isScrolled
                    ? 'surface-glass border-border-strong shadow-soft-dark py-2.5 md:py-3'
                    : 'surface-glass border-border-subtle py-3.5 md:py-4'
            ]"
        >
            <div class="flex justify-between items-center">
                <div
                    class="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                    @click="scrollToSection('#home')"
                >
                    <img
                        src="/assets/logo.svg"
                        alt=""
                        aria-hidden="true"
                        class="h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300 ring-1 ring-white/20"
                    />
                    <span class="font-mono text-sm sm:text-base text-sky-cyan">
                        cm_gonzales <span class="text-chinese-bronze">~/</span>
                    </span>
                </div>

                <div class="md:hidden z-50">
                    <button
                        type="button"
                        class="text-text-primary text-2xl p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        @click="openMobileMenu"
                        aria-label="Open mobile menu"
                        :aria-expanded="mobileMenuVisible"
                        aria-controls="mobile-nav-drawer"
                    >
                        <font-awesome-icon icon="fas fa-bars" />
                    </button>
                </div>

                <div class="hidden md:flex items-center gap-1 lg:gap-4">
                    <ul class="flex items-center gap-1 lg:gap-4">
                        <li
                            v-for="item in navLinks"
                            :key="`nav-link-${item.name}`"
                        >
                            <button
                                type="button"
                                class="relative px-3 py-2 text-sm lg:text-base font-medium cursor-pointer text-text-secondary transition-colors duration-300 hover:text-text-primary"
                                :class="{ 'text-text-primary': activeLink === item.href }"
                                @click="scrollToSection(item.href)"
                                :aria-current="activeLink === item.href ? 'page' : undefined"
                            >
                                {{ item.name }}
                                <span
                                    :class="[
                                        'absolute left-3 right-3 -bottom-0.5 h-[2px] origin-center rounded-full transition-transform duration-300 bg-ncs-blue',
                                        activeLink === item.href ? 'scale-x-100' : 'scale-x-0'
                                    ]"
                                ></span>
                            </button>
                        </li>
                    </ul>
                    <span
                        ref="hireMeMagneticRef"
                        class="inline-block ml-1 lg:ml-2"
                        @mouseenter="hireMeMagnetic.onMouseEnter"
                        @mousemove="hireMeMagnetic.onMouseMove"
                        @mouseleave="hireMeMagnetic.onMouseLeave"
                    >
                        <Button variant="primary" size="sm" @click="scrollToSection('#contact')">
                            Hire Me
                        </Button>
                    </span>
                </div>
            </div>
        </nav>

        <div
            :class="[
                'fixed inset-0 z-40 md:hidden transition-opacity duration-300',
                mobileMenuVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            ]"
            @click="closeMobileMenu"
        >
            <div class="absolute inset-0 bg-[#020810]/50 backdrop-blur-sm"></div>
        </div>

        <aside
            id="mobile-nav-drawer"
            :class="[
                'fixed top-0 right-0 h-full w-[min(18rem,85vw)] z-50 p-7 flex flex-col gap-8 surface-glass border-l border-border-strong shadow-soft-dark transform transition-transform duration-300 ease-in-out md:hidden',
                mobileMenuVisible ? 'translate-x-0' : 'translate-x-full'
            ]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            @click.stop
        >
            <button
                type="button"
                class="absolute top-4 right-4 text-2xl text-text-primary rounded-lg p-2 cursor-pointer hover:bg-white/10 transition-colors"
                @click="closeMobileMenu"
                aria-label="Close mobile menu"
            >
                <font-awesome-icon icon="fas fa-xmark" />
            </button>

            <ul class="flex flex-col space-y-3 mt-8">
                <li
                    v-for="item in navLinks"
                    :key="`mobile-link-${item.name}`"
                >
                    <button
                        type="button"
                        :class="[
                            'relative w-full text-left px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ease-linear text-base border',
                            activeLink === item.href
                                ? 'bg-ncs-blue/20 border-ncs-blue/40 text-text-primary'
                                : 'text-text-secondary border-transparent hover:bg-white/10 hover:text-text-primary'
                        ]"
                        @click="scrollToSection(item.href)"
                        :aria-current="activeLink === item.href ? 'page' : undefined"
                    >
                        {{ item.name }}
                    </button>
                </li>
            </ul>

            <div class="mt-auto pt-4 border-t border-border-subtle">
                <Button variant="primary" size="md" class="w-full" @click="scrollToSection('#contact')">
                    Hire Me
                </Button>
            </div>
        </aside>

        <div class="fixed top-0 left-0 z-50 h-[2px] bg-ncs-blue/80 transition-[width] duration-150 ease-linear" :style="{ width: `${scrollProgress}%` }"></div>
    </header>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
    import { constantsStore } from '@/store';
    import Button from '@/components/ui/Button.vue';
    import { useMagneticButton } from '@/composables/useMagneticButton';

    const navLinks = computed(() => constantsStore.navLinks);
    const activeLink = ref('#home');
    const mobileMenuVisible = ref(false);
    const isScrolled = ref(false);
    const scrollProgress = ref(0);
    const SCROLL_SPY_OFFSET = 120;
    let scrollSpyFrame = null;

    const hireMeMagneticRef = ref(null);
    const hireMeMagnetic = useMagneticButton(hireMeMagneticRef);

    const openMobileMenu = () => {
        mobileMenuVisible.value = true;
    };

    const scrollToSection = (selector) => {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            activeLink.value = selector;
        }
        mobileMenuVisible.value = false;
    };

    const closeMobileMenu = () => {
        mobileMenuVisible.value = false;
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    };

    const updateActiveSectionFromScroll = () => {
        const links = navLinks.value;
        if (!links.length) return;

        const scrollPosition = window.scrollY + SCROLL_SPY_OFFSET;
        let current = links[0].href;

        links.forEach((link) => {
            const section = document.querySelector(link.href);
            if (!section) return;

            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (sectionTop <= scrollPosition) {
                current = link.href;
            }
        });

        const nearPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
        if (nearPageBottom) {
            current = links[links.length - 1].href;
        }

        activeLink.value = current;
    };

    const scheduleScrollSpyUpdate = () => {
        if (scrollSpyFrame !== null) return;

        scrollSpyFrame = requestAnimationFrame(() => {
            updateActiveSectionFromScroll();
            scrollSpyFrame = null;
        });
    };

    const handleScroll = () => {
        isScrolled.value = window.scrollY > 24;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        scrollProgress.value = Math.min(100, Math.max(0, progress));
        scheduleScrollSpyUpdate();
    };

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', scheduleScrollSpyUpdate, { passive: true });
        handleScroll();
        scheduleScrollSpyUpdate();
    });

    onBeforeUnmount(() => {
        if (scrollSpyFrame !== null) {
            cancelAnimationFrame(scrollSpyFrame);
        }
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', scheduleScrollSpyUpdate);
        document.body.style.overflow = '';
    });

    watch(navLinks, (links) => {
        if (links.length > 0) {
            scheduleScrollSpyUpdate();
        }
    }, { immediate: true });

    watch(activeLink, (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            history.replaceState(null, '', newValue);
        }
    });

    watch(mobileMenuVisible, (isOpen) => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
</script>
