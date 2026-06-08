import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useMotion } from '@/composables/useMotion';

const KONAMI_SEQUENCE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
];

const burstActive = ref(false);
let position = 0;
let listenerAttached = false;
let reducedMotionRef = null;

function onKeydown(event) {
    if (reducedMotionRef?.value) return;

    if (event.code === KONAMI_SEQUENCE[position]) {
        position += 1;
        if (position === KONAMI_SEQUENCE.length) {
            position = 0;
            burstActive.value = true;
        }
        return;
    }

    position = event.code === KONAMI_SEQUENCE[0] ? 1 : 0;
}

function attachListener() {
    if (listenerAttached || typeof window === 'undefined') return;
    window.addEventListener('keydown', onKeydown);
    listenerAttached = true;
}

function detachListener() {
    if (!listenerAttached || typeof window === 'undefined') return;
    window.removeEventListener('keydown', onKeydown);
    listenerAttached = false;
    position = 0;
}

export function useKonamiCode() {
    const { isReducedMotion } = useMotion();
    reducedMotionRef = isReducedMotion;

    onMounted(() => {
        if (!isReducedMotion.value) {
            attachListener();
        }
    });

    onBeforeUnmount(() => {
        detachListener();
    });

    const dismissBurst = () => {
        burstActive.value = false;
    };

    return {
        burstActive,
        dismissBurst,
    };
}
