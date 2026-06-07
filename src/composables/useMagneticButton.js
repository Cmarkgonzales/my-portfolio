import { onBeforeUnmount } from 'vue';

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer() {
    return window.matchMedia('(pointer: coarse)').matches;
}

export function useMagneticButton(elRef, { strength = 0.35, maxOffset = 12 } = {}) {
    const disabled = prefersReducedMotion() || isCoarsePointer();

    const resetTransform = () => {
        const el = elRef.value;
        if (!el) return;
        el.style.transform = '';
    };

    const onMouseEnter = () => {
        if (disabled) return;
        const el = elRef.value;
        if (el) {
            el.style.transition = 'transform 0.15s ease-out';
        }
    };

    const onMouseMove = (event) => {
        if (disabled) return;

        const el = elRef.value;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (event.clientX - centerX) * strength;
        const offsetY = (event.clientY - centerY) * strength;
        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));
        const clampedY = Math.max(-maxOffset, Math.min(maxOffset, offsetY));

        el.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
    };

    const onMouseLeave = () => {
        if (disabled) return;

        const el = elRef.value;
        if (el) {
            el.style.transition = 'transform 0.4s ease-out';
        }
        resetTransform();
    };

    onBeforeUnmount(resetTransform);

    return { onMouseMove, onMouseLeave, onMouseEnter };
}
