<template>
    <main className="relative min-h-screen w-screen overflow-x-hidden">
        <NavBar />
        <Home />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
    </main>
</template>

<script setup>

import Home from '@/components/Home.vue';
import NavBar from '@/components/NavBar.vue';
import About from '@/components/About.vue';
import Experience from '@/components/Experience.vue';
import Skills from '@/components/Skills.vue';
import Projects from '@/components/Projects.vue';
import Contact from './components/Contact.vue';
import Footer from '@/components/Footer.vue';
</script>
