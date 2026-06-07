const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function observeRevealTargets(container, options = {}) {
    const { threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = options;

    if (!container) {
        return () => {};
    }

    const targets = container.querySelectorAll('[data-reveal]');

    if (!targets.length) {
        return () => {};
    }

    if (prefersReducedMotion()) {
        targets.forEach((el) => el.classList.add('is-revealed'));
        return () => {};
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        },
        { threshold, rootMargin },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
}
