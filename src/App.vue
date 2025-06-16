<template>
    <main class="relative min-h-screen w-screen overflow-x-hidden">
        <div v-if="isLoading" class="flex items-center justify-center h-screen bg-oxford-blue">
            <LoadingScreen />
        </div>

        <template v-else>
            <NavBar />
            <Home />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
        </template>
    </main>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useFirebaseConstants } from '@/composables/useFirebaseConstants';

    import LoadingScreen from './components/LoadingScreen.vue';
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
