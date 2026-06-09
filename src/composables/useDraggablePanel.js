import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const DRAG_THRESHOLD_PX = 6;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function useDraggablePanel(panelRef, {
    padding = 16,
    storageKey = null,
    onTap = null,
    onDragEnd = null,
} = {}) {
    const x = ref(0);
    const y = ref(0);
    const isDragging = ref(false);
    const hasCustomPosition = ref(false);

    let activePointerId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let originX = 0;
    let originY = 0;
    let movedDuringGesture = false;

    const positionStyle = computed(() => ({
        left: `${x.value}px`,
        top: `${y.value}px`,
    }));

    const readStoredPosition = () => {
        if (!storageKey || typeof window === 'undefined') return null;

        try {
            const raw = sessionStorage.getItem(storageKey);
            if (!raw) return null;

            const parsed = JSON.parse(raw);
            if (typeof parsed?.x !== 'number' || typeof parsed?.y !== 'number') return null;
            return parsed;
        } catch {
            return null;
        }
    };

    const persistPosition = () => {
        if (!storageKey || typeof window === 'undefined' || !hasCustomPosition.value) return;

        sessionStorage.setItem(storageKey, JSON.stringify({
            x: x.value,
            y: y.value,
        }));
    };

    const clampToViewport = () => {
        const panel = panelRef.value;
        if (!panel || typeof window === 'undefined') return;

        const maxX = Math.max(padding, window.innerWidth - panel.offsetWidth - padding);
        const maxY = Math.max(padding, window.innerHeight - panel.offsetHeight - padding);

        x.value = clamp(x.value, padding, maxX);
        y.value = clamp(y.value, padding, maxY);
    };

    const setDefaultPosition = () => {
        const panel = panelRef.value;
        if (!panel || typeof window === 'undefined') return;

        x.value = window.innerWidth - panel.offsetWidth - padding;
        y.value = window.innerHeight - panel.offsetHeight - padding;
        clampToViewport();
    };

    const syncPosition = () => {
        const stored = readStoredPosition();
        if (stored) {
            x.value = stored.x;
            y.value = stored.y;
            hasCustomPosition.value = true;
            clampToViewport();
            return;
        }

        setDefaultPosition();
    };

    const captureEdgeContext = () => {
        const panel = panelRef.value;
        if (!panel || typeof window === 'undefined') return null;

        const rect = panel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        return {
            snapLeft: centerX < window.innerWidth / 2,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            top: rect.top,
        };
    };

    const repositionFromEdgeContext = (context) => {
        if (!context) return;

        const panel = panelRef.value;
        if (!panel || typeof window === 'undefined') return;

        x.value = context.snapLeft
            ? context.left
            : context.right - panel.offsetWidth;
        y.value = context.bottom - panel.offsetHeight;
        clampToViewport();
    };

    const snapToNearestHorizontalEdge = () => {
        const panel = panelRef.value;
        if (!panel || typeof window === 'undefined') return;

        const rect = panel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const snapLeft = centerX < window.innerWidth / 2;

        y.value = rect.top;

        if (snapLeft) {
            x.value = padding;
        } else {
            x.value = window.innerWidth - panel.offsetWidth - padding;
        }

        clampToViewport();
    };

    const endGesture = (event) => {
        if (activePointerId === null || event.pointerId !== activePointerId) return;

        const wasDrag = movedDuringGesture;
        isDragging.value = false;
        activePointerId = null;
        movedDuringGesture = false;

        event.currentTarget?.releasePointerCapture?.(event.pointerId);

        if (wasDrag) {
            hasCustomPosition.value = true;
            persistPosition();
            onDragEnd?.();
            return;
        }

        onTap?.();
    };

    const onPointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return;

        activePointerId = event.pointerId;
        movedDuringGesture = false;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        originX = x.value;
        originY = y.value;

        event.currentTarget?.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => {
        if (activePointerId === null || event.pointerId !== activePointerId) return;

        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;

        if (!movedDuringGesture) {
            const distance = Math.hypot(deltaX, deltaY);
            if (distance < DRAG_THRESHOLD_PX) return;

            movedDuringGesture = true;
            isDragging.value = true;
        }

        x.value = originX + deltaX;
        y.value = originY + deltaY;
        clampToViewport();
    };

    const onPointerUp = (event) => {
        endGesture(event);
    };

    const onPointerCancel = (event) => {
        endGesture(event);
    };

    const onWindowResize = () => {
        clampToViewport();
        persistPosition();
    };

    onMounted(() => {
        syncPosition();
        window.addEventListener('resize', onWindowResize, { passive: true });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', onWindowResize);
    });

    watch(panelRef, (panel) => {
        if (panel) {
            syncPosition();
        }
    });

    return {
        x,
        y,
        isDragging,
        hasCustomPosition,
        positionStyle,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        clampToViewport,
        syncPosition,
        captureEdgeContext,
        repositionFromEdgeContext,
        snapToNearestHorizontalEdge,
    };
}
