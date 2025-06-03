<template>
    <nav class="fixed w-full bg-white text-gray-800 shadow-sm z-20">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <img src="/cc_logo.svg" alt="Logo" class="h-10 w-10 md:h-12 md:w-12 rounded-full">
                <a href="#home" class="font-inter text-xl font-bold text-ocean-blue hover:text-ncs-blue transition-colors duration-300">
                    Chris<span class="text-chinese-bronze hover:text-dark-bronze">Chan</span>
                </a>
            </div>
            <ul
                :class="[
                    'font-bold space-y-4 md:space-y-0 md:space-x-8 md:flex',
                    mobileMenuVisible ? 'flex flex-col absolute top-full left-0 w-full bg-white px-4 py-4 border-t border-gray-100 md:static md:p-0 md:bg-transparent items-center text-center' : 'hidden md:flex',
                    'space-y-4 md:space-y-0 md:items-start md:text-left'
                ]"
            >
                <li
                    v-for="item in navLinks"
                    :key="item.name"
                    class="nav-item"
                    @click="handleSectionNavigation(item.href)"
                >
                    <a
                        :href="item.href"
                        :class="['nav-link', { active: activeLink === item.href }]"
                    >
                        {{ item.name }}
                    </a>
                </li>
            </ul>
            <button
                id="mobile-menu-button"
                class="md:hidden text-gray-800 focus:outline-none"
                @click="toggleMobileMenu"
            >
                <i :class="[mobileMenuVisible ? 'fas fa-xmark' : 'fas fa-bars', 'text-4xl']"></i>
            </button>
        </div>
    </nav>
</template>
<script setup>
    import { ref, onMounted, onBeforeUnmount, watch} from 'vue';
    import { navLinks } from '@/constants/constants.js';

    const activeLink = ref('#home');
    const mobileMenuVisible = ref(false);
    const sections = ref([]);

    const toggleMobileMenu = () => {
        mobileMenuVisible.value = !mobileMenuVisible.value;
    };
    
    const handleSectionNavigation = async (section) => {
        activeLink.value = section;
        mobileMenuVisible.value = false;
    };

    onMounted(() => {
        // Get the actual DOM elements based on navLinks href values
        sections.value = navLinks
            .map(link => document.querySelector(link.href))
            .filter(Boolean); // remove any null if element not found

        const observer = new IntersectionObserver(
            (entries) => {
                // Filter for intersecting entries
                const visibleSections = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); // sort by top position

                if (visibleSections.length > 0) {
                const topSection = visibleSections[0];  
                    activeLink.value = `#${topSection.target.id}`;
                }
            },
            {
                root: null,
                threshold: 0.3, // 30% visible
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
