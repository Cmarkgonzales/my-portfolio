<template>
    <div class="relative min-h-screen w-full overflow-x-hidden text-text-primary">
        <a
            href="#main-content"
            class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:rounded-lg focus:bg-oxford-blue focus:px-4 focus:py-2 focus:text-white focus:shadow-soft-dark"
        >
            Skip to main content
        </a>
        <CursorTrail />
        <div v-if="isLoading" class="flex items-center justify-center h-screen bg-oxford-blue">
            <LoadingScreen />
        </div>

        <template v-else>
            <NavBar />
            <main id="main-content" tabindex="-1">
                <Home />
                <About />
                <Experience />
                <Skills />
                <Projects />
                <Contact />
            </main>
            <Footer />
        </template>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useFirebaseConstants } from '@/composables/useFirebaseConstants';

    import LoadingScreen from './components/LoadingScreen.vue';
    import CursorTrail from './components/CursorTrail.vue';
    import NavBar from '@/components/NavBar.vue';
    import Home from '@/components/Home.vue';
    import About from '@/components/About.vue';
    import Experience from '@/components/Experience.vue';
    import Skills from '@/components/Skills.vue';
    import Projects from '@/components/Projects.vue';
    import Contact from './components/Contact.vue';
    import Footer from '@/components/Footer.vue';

    const { fetchConstants, isLoading, error } = useFirebaseConstants();

    onMounted(async () => {
        await fetchConstants();
    });
</script>
