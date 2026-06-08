import { ref, computed, readonly } from 'vue';

const STORAGE_KEY = 'motionPreference';

const motionPreference = ref('full');
const systemReduced = ref(false);

let mediaQuery = null;
let initialized = false;

function initMotion() {
    if (initialized || typeof window === 'undefined') return;
    initialized = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'full') {
        motionPreference.value = stored;
    }

    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    systemReduced.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', (event) => {
        systemReduced.value = event.matches;
    });
}

// UI toggle removed — honor OS preference only so hero 3D + float animations stay active.
const isReducedMotion = computed(() => systemReduced.value);

function setMotionPreference(preference) {
    if (preference !== 'full' && preference !== 'reduced') return;
    motionPreference.value = preference;
    localStorage.setItem(STORAGE_KEY, preference);
}

export function useMotion() {
    initMotion();

    return {
        motionPreference: readonly(motionPreference),
        systemReduced: readonly(systemReduced),
        isReducedMotion,
        setMotionPreference,
    };
}
