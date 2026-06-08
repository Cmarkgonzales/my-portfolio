import { ref, computed, readonly } from 'vue';
import { useMotion } from '@/composables/useMotion';

export const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .project-card, canvas';

const cursorX = ref(-100);
const cursorY = ref(-100);
const isInteractive = ref(false);
const isTextHeavy = ref(false);
const isHidden = ref(false);
const isTracking = ref(false);

let listenerCount = 0;

const resolveTargetState = (clientX, clientY) => {
    const target = document.elementFromPoint(clientX, clientY);
    isInteractive.value = Boolean(target?.closest(INTERACTIVE_SELECTOR));
    isTextHeavy.value = Boolean(target?.closest('#about, #experience'));
};

const handleMouseMove = (event) => {
    cursorX.value = event.clientX;
    cursorY.value = event.clientY;
    resolveTargetState(event.clientX, event.clientY);
};

const handleVisibilityChange = () => {
    isHidden.value = document.visibilityState === 'hidden';
};

const attachTracking = () => {
    if (listenerCount === 0) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        isHidden.value = document.visibilityState === 'hidden';
        isTracking.value = true;
    }
    listenerCount += 1;
};

const detachTracking = () => {
    listenerCount = Math.max(0, listenerCount - 1);
    if (listenerCount === 0) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        isTracking.value = false;
        cursorX.value = -100;
        cursorY.value = -100;
        isInteractive.value = false;
        isTextHeavy.value = false;
    }
};

export function useCustomCursor() {
    const { isReducedMotion } = useMotion();

    const coarsePointer = typeof window !== 'undefined'
        ? window.matchMedia('(pointer: coarse)').matches
        : false;

    const canUseCustomCursor = computed(
        () => !isReducedMotion.value && !coarsePointer && !isHidden.value,
    );

    return {
        cursorX: readonly(cursorX),
        cursorY: readonly(cursorY),
        isInteractive: readonly(isInteractive),
        isTextHeavy: readonly(isTextHeavy),
        isHidden: readonly(isHidden),
        isTracking: readonly(isTracking),
        canUseCustomCursor,
        attachTracking,
        detachTracking,
        resolveTargetState,
    };
}
