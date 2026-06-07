import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp(targetRef, { end, duration = 1200, suffix = '' } = {}) {
    const displayValue = ref(`0${suffix}`);
    let animationId = null;
    let observer = null;
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

    onMounted(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            displayValue.value = `${end}${suffix}`;
            hasAnimated = true;
            return;
        }

        if (targetRef.value) {
            setupObserver(targetRef.value);
        }
    });

    watch(
        () => targetRef.value,
        (el) => {
            if (el && !hasAnimated) {
                setupObserver(el);
            }
        },
    );

    onBeforeUnmount(() => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
        }
        observer?.disconnect();
    });

    return { displayValue };
}
