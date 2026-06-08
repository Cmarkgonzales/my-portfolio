<template>
    <footer class="bg-oxford-blue text-white py-10" role="contentinfo">
        <div class="site-container">
            <div class="mb-8 rounded-xl border border-border-subtle surface-glass overflow-hidden">
                <button
                    type="button"
                    class="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-mono text-sky-cyan hover:bg-white/5 transition-colors focus-ring"
                    :aria-expanded="terminalOpen"
                    aria-controls="footer-terminal-panel"
                    @click="terminalOpen = !terminalOpen"
                >
                    <span>
                        <span class="text-chinese-bronze">~/</span> terminal
                    </span>
                    <font-awesome-icon :icon="terminalOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" />
                </button>

                <div
                    v-show="terminalOpen"
                    id="footer-terminal-panel"
                    class="border-t border-border-subtle"
                >
                    <div
                        ref="outputRef"
                        class="h-40 overflow-y-auto px-4 py-3 font-mono text-xs text-text-secondary space-y-1 bg-black/20"
                        aria-live="polite"
                    >
                        <p v-for="(line, index) in terminalOutput" :key="`term-${index}`">
                            <span class="text-sky-cyan mr-2">&gt;</span>{{ line }}
                        </p>
                    </div>
                    <form class="flex items-center gap-2 border-t border-border-subtle px-4 py-3" @submit.prevent="runCommand">
                        <label for="footer-terminal-input" class="sr-only">Terminal command</label>
                        <span class="text-sky-cyan font-mono text-sm">$</span>
                        <input
                            id="footer-terminal-input"
                            ref="inputRef"
                            v-model="terminalInput"
                            type="text"
                            autocomplete="off"
                            spellcheck="false"
                            class="flex-grow bg-transparent border-none outline-none font-mono text-sm text-text-primary placeholder:text-text-muted focus-ring rounded"
                            placeholder="type help"
                            @keydown.up.prevent="recallHistory(-1)"
                            @keydown.down.prevent="recallHistory(1)"
                        />
                    </form>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="flex flex-col items-center md:items-start space-y-2">
                    <div
                        class="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                        @click="scrollToHome"
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
                    <p class="text-gray-400 text-sm ml-3">
                        Full Stack Developer
                    </p>
                </div>

                <div class="text-center text-sm text-gray-300 space-y-1">
                    <p>&copy; 2025 Christian Mark Gonzales. All rights reserved.</p>
                    <p class="text-xs text-gray-500">
                        Hero 3D desktop by
                        <a
                            href="https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66"
                            class="hover:text-gray-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Yolala3D | Y3D</a>
                    </p>
                </div>

                <div>
                    <a
                        href="#home"
                        aria-label="Back to top"
                        class="bg-ocean-blue hover:bg-ncs-blue p-3 rounded-xl inline-block shadow-lg transition-all duration-300 ease-in-out hover:animate-bounce animate-soft-pulse"
                    >
                        <font-awesome-icon icon="fas fa-arrow-up" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
    import { nextTick, ref } from 'vue';
    import { constantsStore } from '@/store';
    import { useContactPrefill } from '@/composables/useContactPrefill';

    const { setIntent } = useContactPrefill();

    const terminalOpen = ref(false);
    const terminalInput = ref('');
    const terminalOutput = ref(['Type "help" to see available commands.']);
    const commandHistory = ref([]);
    const historyIndex = ref(-1);
    const inputRef = ref(null);
    const outputRef = ref(null);

    const appendOutput = (lines) => {
        terminalOutput.value.push(...lines);
        nextTick(() => {
            if (outputRef.value) {
                outputRef.value.scrollTop = outputRef.value.scrollHeight;
            }
        });
    };

    const scrollToSection = (selector, hash) => {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', hash);
        }
    };

    const scrollToHome = () => {
        scrollToSection('#home', '#home');
    };

    const runCommand = () => {
        const raw = terminalInput.value.trim();
        if (!raw) return;

        commandHistory.value.unshift(raw);
        historyIndex.value = -1;
        appendOutput([raw]);

        const command = raw.toLowerCase();

        if (command === 'help') {
            appendOutput([
                'help — list commands',
                'hire() — scroll to contact and prefill intent',
                'ls projects — scroll to projects',
                'open resume — open resume PDF',
                'clear — clear terminal output',
            ]);
        } else if (command === 'hire()' || command === 'hire') {
            setIntent('full-time');
            scrollToSection('#contact', '#contact');
            appendOutput(['Navigating to contact... Intent: Full-time']);
        } else if (command === 'ls projects' || command === 'ls') {
            scrollToSection('#projects', '#projects');
            appendOutput(['Opening projects section...']);
        } else if (command === 'open resume') {
            const resumeLink = constantsStore.resumeLink || '/my-portfolio/resume.pdf';
            window.open(resumeLink, '_blank', 'noopener,noreferrer');
            appendOutput([`Opening ${resumeLink}`]);
        } else if (command === 'clear') {
            terminalOutput.value = [];
        } else {
            appendOutput([`command not found: ${raw}`]);
        }

        terminalInput.value = '';
    };

    const recallHistory = (direction) => {
        if (!commandHistory.value.length) return;

        if (direction < 0) {
            historyIndex.value = Math.min(historyIndex.value + 1, commandHistory.value.length - 1);
        } else {
            historyIndex.value = Math.max(historyIndex.value - 1, -1);
        }

        terminalInput.value = historyIndex.value >= 0
            ? commandHistory.value[historyIndex.value]
            : '';
    };
</script>
