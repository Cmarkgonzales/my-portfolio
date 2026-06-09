<template>
    <Teleport to="body">
        <div
            ref="panelRef"
            class="floating-terminal"
            :class="{
                'floating-terminal--open': isOpen,
                'floating-terminal--dragging': isDragging,
            }"
            :style="positionStyle"
        >
            <button
                v-if="!isOpen"
                type="button"
                class="floating-terminal-fab focus-ring"
                :class="{ 'floating-terminal-fab--animated': !isReducedMotion }"
                aria-label="Open terminal"
                aria-expanded="false"
                aria-controls="floating-terminal-panel"
                @pointerdown="onFabPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
                @pointercancel="onPointerCancel"
            >
                <span class="floating-terminal-fab-glow" aria-hidden="true"></span>
                <span class="floating-terminal-fab-icon" aria-hidden="true">
                    <font-awesome-icon icon="fas fa-terminal" class="text-base sm:text-lg" />
                </span>
                <span class="floating-terminal-fab-label hidden sm:inline">
                    <span class="text-chinese-bronze">~/</span>terminal<span class="floating-terminal-fab-cursor">_</span>
                </span>
            </button>

            <section
                v-else
                id="floating-terminal-panel"
                class="floating-terminal-panel"
                role="dialog"
                aria-label="Interactive terminal"
            >
                <header
                    class="floating-terminal-header"
                    @pointerdown="onHeaderPointerDown"
                    @pointermove="onPointerMove"
                    @pointerup="onPointerUp"
                    @pointercancel="onPointerCancel"
                >
                    <div class="flex min-w-0 items-center gap-2">
                        <font-awesome-icon
                            icon="fas fa-grip-vertical"
                            class="floating-terminal-grip shrink-0 text-text-muted"
                            aria-hidden="true"
                        />
                        <p class="truncate font-mono text-sm text-sky-cyan">
                            <span class="text-chinese-bronze">~/</span>terminal
                        </p>
                    </div>

                    <button
                        type="button"
                        class="floating-terminal-icon-btn focus-ring"
                        aria-label="Close terminal"
                        @click.stop="closeTerminal"
                    >
                        <font-awesome-icon icon="fas fa-xmark" />
                    </button>
                </header>

                <div
                    ref="outputRef"
                    class="floating-terminal-output"
                    aria-live="polite"
                >
                    <p
                        v-for="(line, index) in terminalOutput"
                        :key="`term-${index}`"
                        class="leading-relaxed"
                    >
                        <span class="text-sky-cyan mr-2">&gt;</span>{{ line }}
                    </p>
                </div>

                <form
                    class="floating-terminal-form"
                    @submit.prevent="runCommand"
                >
                    <label for="floating-terminal-input" class="sr-only">Terminal command</label>
                    <span class="text-sky-cyan font-mono text-sm shrink-0">$</span>
                    <input
                        id="floating-terminal-input"
                        ref="inputRef"
                        v-model="terminalInput"
                        type="text"
                        autocomplete="off"
                        spellcheck="false"
                        class="floating-terminal-input focus-ring"
                        placeholder="type help"
                        @keydown.up.prevent="recallHistory(-1)"
                        @keydown.down.prevent="recallHistory(1)"
                    />
                </form>
            </section>
        </div>
    </Teleport>
</template>

<script setup>
    import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import { constantsStore } from '@/store';
    import { useContactPrefill } from '@/composables/useContactPrefill';
    import { useDraggablePanel } from '@/composables/useDraggablePanel';
    import { useMotion } from '@/composables/useMotion';

    const { setIntent } = useContactPrefill();
    const { isReducedMotion } = useMotion();

    const panelRef = ref(null);
    const outputRef = ref(null);
    const inputRef = ref(null);

    const isOpen = ref(false);
    const terminalInput = ref('');
    const terminalOutput = ref([
        'Type "help" to see available commands.',
        'Try: cd projects or status --availability',
    ]);

    const SECTIONS = {
        home: { hash: '#home', label: 'Home' },
        about: { hash: '#about', label: 'About' },
        experience: { hash: '#experience', label: 'Experience' },
        skills: { hash: '#skills', label: 'Skills' },
        projects: { hash: '#projects', label: 'Projects' },
        contact: { hash: '#contact', label: 'Contact' },
    };

    const sectionKeys = Object.keys(SECTIONS);
    const commandHistory = ref([]);
    const historyIndex = ref(-1);

    const {
        isDragging,
        positionStyle,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        syncPosition,
        captureEdgeContext,
        repositionFromEdgeContext,
        snapToNearestHorizontalEdge,
    } = useDraggablePanel(panelRef, {
        padding: 12,
        onTap: () => toggleTerminalOpen(true),
        onDragEnd: () => {
            if (!isOpen.value) {
                nextTick(() => snapToNearestHorizontalEdge());
            }
        },
    });

    const toggleTerminalOpen = (open) => {
        const context = captureEdgeContext();
        isOpen.value = open;
        nextTick(() => {
            if (open) {
                repositionFromEdgeContext(context);
                inputRef.value?.focus();
            } else {
                snapToNearestHorizontalEdge();
            }
        });
    };

    const closeTerminal = () => toggleTerminalOpen(false);

    const onFabPointerDown = (event) => {
        onPointerDown(event);
    };

    const onHeaderPointerDown = (event) => {
        if (event.target.closest('button')) return;
        onPointerDown(event);
    };

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

    const navigateToSection = (key) => {
        const section = SECTIONS[key];
        if (!section) return false;

        scrollToSection(section.hash, section.hash);
        appendOutput([`Navigating to ${section.label}...`]);
        return true;
    };

    const listSections = () => {
        appendOutput([
            sectionKeys.join('  '),
            'Use: cd <section> or goto <section>',
        ]);
    };

    const unknownSectionMessage = (name) => [
        `section not found: ${name}`,
        `Available: ${sectionKeys.join(', ')}`,
    ];

    const runCommand = () => {
        const raw = terminalInput.value.trim();
        if (!raw) return;

        commandHistory.value.unshift(raw);
        historyIndex.value = -1;
        appendOutput([raw]);

        const command = raw.toLowerCase();

        if (command === 'help') {
            appendOutput([
                'Navigation:',
                '  cd <section> — go to a section',
                '  goto <section> — same as cd',
                '  ls — list all sections',
                '  ls <section> — go to a section',
                `  Sections: ${sectionKeys.join(', ')}`,
                'Other:',
                '  status --availability — show current work status',
                '  hire() — scroll to contact and prefill intent',
                '  open resume — open resume PDF',
                '  exit — close the terminal',
                '  clear — clear terminal output',
            ]);
        } else if (command === 'status --availability' || command === 'status') {
            appendOutput(['→ accepting new projects & collaborations']);
        } else if (command === 'hire()' || command === 'hire') {
            setIntent('full-time');
            scrollToSection('#contact', '#contact');
            appendOutput(['Navigating to Contact... Intent: Full-time']);
        } else if (command === 'ls') {
            listSections();
        } else if (command.startsWith('ls ')) {
            const target = command.slice(3).trim();
            if (!navigateToSection(target)) {
                appendOutput(unknownSectionMessage(target));
            }
        } else if (command.startsWith('cd ')) {
            const target = command.slice(3).trim();
            if (!navigateToSection(target)) {
                appendOutput(unknownSectionMessage(target));
            }
        } else if (command.startsWith('goto ')) {
            const target = command.slice(5).trim();
            if (!navigateToSection(target)) {
                appendOutput(unknownSectionMessage(target));
            }
        } else if (command === 'open resume') {
            const resumeLink = constantsStore.resumeLink || '/my-portfolio/resume.pdf';
            window.open(resumeLink, '_blank', 'noopener,noreferrer');
            appendOutput([`Opening ${resumeLink}`]);
        } else if (command === 'clear') {
            terminalOutput.value = [];
        } else if (command === 'exit' || command === 'close' || command === 'quit') {
            appendOutput(['Closing terminal...']);
            terminalInput.value = '';
            nextTick(closeTerminal);
            return;
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

    const onDocumentPointerDown = (event) => {
        if (!isOpen.value) return;

        const panel = panelRef.value;
        if (!panel || panel.contains(event.target)) return;

        closeTerminal();
    };

    watch(isOpen, (open) => {
        if (open) {
            nextTick(() => {
                document.addEventListener('pointerdown', onDocumentPointerDown);
            });
            return;
        }

        document.removeEventListener('pointerdown', onDocumentPointerDown);
    });

    onMounted(() => {
        sessionStorage.removeItem('floating-terminal-position');
        nextTick(syncPosition);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('pointerdown', onDocumentPointerDown);
    });
</script>

<style scoped>
    .floating-terminal {
        position: fixed;
        z-index: 70;
        touch-action: none;
    }

    .floating-terminal--dragging {
        user-select: none;
    }

    .floating-terminal-fab {
        position: relative;
        isolation: isolate;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-height: 3.25rem;
        min-width: 3.25rem;
        padding: 0.75rem 0.9rem;
        border-radius: 9999px;
        border: 1px solid rgba(4, 138, 191, 0.42);
        background:
            linear-gradient(145deg, rgba(1, 58, 99, 0.95), rgba(1, 35, 64, 0.92));
        color: #e8f7ff;
        box-shadow:
            0 0 0 1px rgba(7, 178, 217, 0.18),
            0 10px 28px rgba(1, 35, 64, 0.55),
            0 0 24px rgba(4, 138, 191, 0.22);
        cursor: grab;
        transition:
            transform 0.22s cubic-bezier(0.34, 1.15, 0.64, 1),
            box-shadow 0.22s ease,
            border-color 0.22s ease;
    }

    .floating-terminal-fab::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        background: linear-gradient(
            135deg,
            rgba(7, 178, 217, 0.14) 0%,
            transparent 42%,
            rgba(217, 128, 50, 0.1) 100%
        );
        pointer-events: none;
        transition: opacity 0.22s ease;
    }

    @media (hover: hover) and (pointer: fine) {
        .floating-terminal-fab:hover {
            transform: translateY(-2px);
            border-color: rgba(7, 178, 217, 0.58);
            box-shadow:
                0 0 0 1px rgba(7, 178, 217, 0.34),
                0 14px 34px rgba(1, 35, 64, 0.58),
                0 0 32px rgba(4, 138, 191, 0.32);
        }

        .floating-terminal-fab:hover::after {
            opacity: 1;
        }

        .floating-terminal-fab:hover .floating-terminal-fab-icon {
            color: #9de4f7;
            transform: scale(1.06);
        }

        .floating-terminal-fab:hover .floating-terminal-fab-glow {
            opacity: 1;
        }
    }

    .floating-terminal-fab:active {
        transform: translateY(0) scale(0.97);
        box-shadow:
            0 0 0 1px rgba(7, 178, 217, 0.24),
            0 6px 18px rgba(1, 35, 64, 0.5),
            0 0 18px rgba(4, 138, 191, 0.2);
    }

    .floating-terminal--dragging .floating-terminal-fab {
        cursor: grabbing;
        transform: scale(1.02);
        box-shadow:
            0 0 0 1px rgba(7, 178, 217, 0.38),
            0 16px 36px rgba(1, 35, 64, 0.62),
            0 0 34px rgba(4, 138, 191, 0.34);
    }

    .floating-terminal-fab-glow {
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background: radial-gradient(circle at 30% 20%, rgba(7, 178, 217, 0.35), transparent 58%);
        opacity: 0.72;
        pointer-events: none;
        transition: opacity 0.22s ease;
    }

    .floating-terminal-fab-icon {
        position: relative;
        z-index: 1;
        display: inline-flex;
        color: #d9f4ff;
        transition: color 0.22s ease, transform 0.22s ease;
    }

    .floating-terminal-fab-label {
        position: relative;
        z-index: 1;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        color: #8fdcf0;
        padding-right: 0.15rem;
    }

    .floating-terminal-fab-cursor {
        margin-left: 1px;
        color: rgba(143, 220, 240, 0.75);
    }

    .floating-terminal-fab--animated .floating-terminal-fab-cursor {
        animation: fabCursorBlink 1.15s step-end infinite;
    }

    @keyframes fabCursorBlink {
        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0;
        }
    }

    .floating-terminal-panel {
        display: flex;
        flex-direction: column;
        width: min(calc(100vw - 1.5rem), 22rem);
        height: min(70vh, 26rem);
        border-radius: 1rem;
        border: 1px solid rgba(4, 138, 191, 0.35);
        background:
            linear-gradient(160deg, rgba(1, 35, 64, 0.97), rgba(1, 58, 99, 0.94));
        box-shadow:
            0 0 0 1px rgba(7, 178, 217, 0.14),
            0 18px 48px rgba(1, 35, 64, 0.62),
            0 0 36px rgba(4, 138, 191, 0.2);
        overflow: hidden;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
    }

    @media (min-width: 640px) {
        .floating-terminal-panel {
            width: min(calc(100vw - 2rem), 24rem);
            height: min(72vh, 28rem);
        }
    }

    .floating-terminal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.7rem 0.8rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(0, 0, 0, 0.18);
        cursor: grab;
    }

    .floating-terminal--dragging .floating-terminal-header {
        cursor: grabbing;
    }

    .floating-terminal-grip {
        font-size: 0.72rem;
    }

    .floating-terminal-icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 0.45rem;
        color: rgba(232, 247, 255, 0.75);
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    .floating-terminal-icon-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
    }

    .floating-terminal-output {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 0.85rem 0.9rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        font-size: 0.72rem;
        line-height: 1.55;
        color: rgba(232, 247, 255, 0.72);
        background: rgba(0, 0, 0, 0.22);
    }

    @media (min-width: 640px) {
        .floating-terminal-output {
            font-size: 0.78rem;
        }
    }

    .floating-terminal-form {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 0.85rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(0, 0, 0, 0.14);
    }

    .floating-terminal-input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        font-size: 0.82rem;
        color: #f4fbff;
    }

    .floating-terminal-input::placeholder {
        color: rgba(232, 247, 255, 0.42);
    }

    @media (prefers-reduced-motion: reduce) {
        .floating-terminal-fab,
        .floating-terminal-fab::after,
        .floating-terminal-fab-glow,
        .floating-terminal-fab-icon {
            transition: none;
        }

        .floating-terminal-fab:hover,
        .floating-terminal-fab:active,
        .floating-terminal--dragging .floating-terminal-fab {
            transform: none;
        }
    }

    @media (max-width: 639px) {
        .floating-terminal-fab {
            min-width: 3.35rem;
            min-height: 3.35rem;
            padding: 0.8rem;
        }
    }
</style>
