import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useMotion } from '@/composables/useMotion';

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp(targetRef, {
    end,
    duration = 1200,
    suffix = '',
    immediate = false,
    delay = 0,
} = {}) {
    const displayValue = ref(`0${suffix}`);
    let animationId = null;
    let observer = null;
    let startTimer = null;
    let hasAnimated = false;

    const animate = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        const startTime = performance.now();
        const target = Number(end) || 0;

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(eased * target);
            displayValue.value = `${current}${suffix}`;

            if (progress < 1) {
                animationId = requestAnimationFrame(tick);
            }
        };

        animationId = requestAnimationFrame(tick);
    };

    const setupObserver = (el) => {
        if (!el || hasAnimated) return;

        observer?.disconnect();
        observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    animate();
                    observer?.disconnect();
                    observer = null;
                }
            },
            { threshold: 0.3, rootMargin: '0px 0px -10% 0px' },
        );
        observer.observe(el);
    };

    const { isReducedMotion } = useMotion();

    const skipAnimation = () => {
        displayValue.value = `${end}${suffix}`;
        hasAnimated = true;
    };

    watch(isReducedMotion, (reduced) => {
        if (reduced) {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            if (startTimer !== null) {
                clearTimeout(startTimer);
                startTimer = null;
            }
            observer?.disconnect();
            observer = null;
            skipAnimation();
        }
    });

    onMounted(() => {
        if (isReducedMotion.value) {
            skipAnimation();
            return;
        }

        if (immediate) {
            startTimer = setTimeout(() => {
                animate();
            }, delay);
            return;
        }

        if (targetRef.value) {
            setupObserver(targetRef.value);
        }
    });

    watch(
        () => targetRef.value,
        (el) => {
            if (el && !hasAnimated && !immediate) {
                setupObserver(el);
            }
        },
    );

    onBeforeUnmount(() => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }
        if (startTimer !== null) {
            clearTimeout(startTimer);
        }
        observer?.disconnect();
    });

    return { displayValue };
}
