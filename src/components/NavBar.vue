<template>
    <header class="fixed w-full bg-white flex justify-between items-center p-4 shadow-sm z-20 ">
        <div class="flex items-center space-x-2 cursor-pointer :hover:opacity-90 transition-opacity duration-300">
            <img
                src="/portfolio_logo.svg"
                alt="Logo"
                class="h-12 w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 rounded-full transition-all duration-300"
            />
            <a
                href="#home"
                class="font-inters text-lg lg:text-3xl font-bold text-ocean-blue hover:text-ncs-blue transition-colors duration-300"
            >
                Chris
                <span class="text-chinese-bronze hover:text-dark-bronze">
                    Chan
                </span>
            </a>
        </div>

         <div class="md:hidden z-30">
            <button
                type="button" 
                class="block text-oxford-blue focus:outline-none"
                @click="mobileMenuVisible = !mobileMenuVisible"
            >
                <i :class="[mobileMenuVisible ? 'fas fa-xmark' : 'fas fa-bars', 'text-4xl']"></i>
            </button>
        </div>

        <nav
            :class="['fixed inset-0 z-20 flex flex-col items-center justify-center bg-white md:relative md:bg-transparent md:flex md:justify-between md:flex-row',
                mobileMenuVisible ? 'block':'hidden'
            ]"
        >
            <ul class="flex flex-col items-center space-y-5 md:flex-row lg:space-x-5 md:space-x-1 md:space-y-0">
                <li
                    v-for="item in navLinks"
                    :key="`nav-link-${item.name}`"
                    @click="handleSectionNavigation(item.href)"
                >
                    <a
                        :class="[
                            'relative inline-block px-4 py-2 rounded-full transition-all duration-300 ease-linear text-oxford-blue md:text-lg',
                            activeLink === item.href
                                ? 'bg-ocean-blue text-white'
                                : 'hover:bg-ncs-blue/5 hover:text-ncs-blue'
                        ]"
                        :href="item.href" 
                        @click="handleSectionNavigation(item.href)"
                    >
                        {{ item.name }}
                    </a>
                </li>
            </ul>
          </nav>
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
