<template>
  <canvas v-if="isEnabled" ref="canvas" class="pointer-events-none fixed inset-0 z-[9999] h-full w-full"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useMotion } from '@/composables/useMotion';
import { useCustomCursor } from '@/composables/useCustomCursor';

const GLYPHS = ['{}', '//', '=>', '[]', 'const', '</>'];
const DEFAULT_COLOR = '#07B2D9';
const BRONZE_COLOR = '#D98032';
const GLYPH_FONT = '600 11px "DM Mono", monospace';

const {
  cursorX,
  cursorY,
  isInteractive,
  isTextHeavy,
  isTracking,
  resolveTargetState,
} = useCustomCursor();

const canvas = ref(null);
const isEnabled = ref(false);
let ctx = null;
let particles = [];
let animationFrameId = null;
let queue = [];
let running = false;
const TRAIL_DELAY = 160;
const TRAIL_DELAY_TEXT_HEAVY = 280;
const MIN_QUEUE_DISTANCE = 20;
const MIN_QUEUE_DISTANCE_TEXT_HEAVY = 38;
const MIN_SPAWN_DISTANCE = 16;
const CURSOR_OFFSET = 14;
const MAX_QUEUE_LENGTH = 60;
const MAX_PARTICLES = 90;

let lastQueuedPos = null;
let lastSpawnPos = null;
let lastMoveDx = 0;
let lastMoveDy = -1;

class Particle {
  constructor(x, y, color, dirX, dirY) {
    const len = Math.hypot(dirX, dirY) || 1;
    const nx = dirX / len;
    const ny = dirY / len;
    const px = -ny;
    const py = nx;
    const lane = (Math.random() - 0.5) * 10;

    this.x = x - nx * 6 + px * lane;
    this.y = y - ny * 6 + py * lane;
    this.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    this.color = color;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.018;
    this.speedX = -nx * 0.35 + (Math.random() - 0.5) * 0.6;
    this.speedY = -ny * 0.35 + (Math.random() - 0.5) * 0.6;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
  }

  draw(context) {
    context.font = GLYPH_FONT;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = this.color;
    context.globalAlpha = Math.max(0, this.life * 0.85);
    context.fillText(this.glyph, this.x, this.y);
  }
}

const resizeCanvas = () => {
  if (canvas.value) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.value.width = Math.floor(window.innerWidth * dpr);
    canvas.value.height = Math.floor(window.innerHeight * dpr);
    canvas.value.style.width = `${window.innerWidth}px`;
    canvas.value.style.height = `${window.innerHeight}px`;
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
};

const resolveTrailColor = (clientX, clientY, interactiveOverride) => {
  if (interactiveOverride !== undefined) {
    return interactiveOverride ? BRONZE_COLOR : DEFAULT_COLOR;
  }
  resolveTargetState(clientX, clientY);
  return isInteractive.value ? BRONZE_COLOR : DEFAULT_COLOR;
};

const getQueueDistanceThreshold = () => (
  isTextHeavy.value ? MIN_QUEUE_DISTANCE_TEXT_HEAVY : MIN_QUEUE_DISTANCE
);

const enqueueTrailPoint = (clientX, clientY, interactiveOverride) => {
  const x = clientX + CURSOR_OFFSET;
  const y = clientY + CURSOR_OFFSET;
  const minDistance = getQueueDistanceThreshold();

  if (lastQueuedPos) {
    const dx = x - lastQueuedPos.x;
    const dy = y - lastQueuedPos.y;
    if (dx * dx + dy * dy < minDistance * minDistance) {
      return;
    }
    lastMoveDx = dx;
    lastMoveDy = dy;
  }

  lastQueuedPos = { x, y };
  const color = resolveTrailColor(clientX, clientY, interactiveOverride);
  queue.push({ x, y, time: Date.now(), color, dirX: lastMoveDx, dirY: lastMoveDy });

  if (queue.length > MAX_QUEUE_LENGTH) {
    queue.splice(0, queue.length - MAX_QUEUE_LENGTH);
  }
};

const handleMouseMove = (e) => {
  if (isTracking.value) return;
  enqueueTrailPoint(e.clientX, e.clientY);
};

const stopAnimation = () => {
  running = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const startAnimation = () => {
  if (running || !ctx || !canvas.value) return;
  running = true;
  animationFrameId = requestAnimationFrame(animate);
};

const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden') {
    stopAnimation();
  } else {
    startAnimation();
  }
};

const animate = () => {
  if (!running || !ctx || !canvas.value) return;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const currentTime = Date.now();

  const trailDelay = isTextHeavy.value ? TRAIL_DELAY_TEXT_HEAVY : TRAIL_DELAY;

  while (queue.length > 0 && currentTime - queue[0].time >= trailDelay) {
    const pos = queue.shift();

    if (lastSpawnPos) {
      const dx = pos.x - lastSpawnPos.x;
      const dy = pos.y - lastSpawnPos.y;
      if (dx * dx + dy * dy < MIN_SPAWN_DISTANCE * MIN_SPAWN_DISTANCE) {
        continue;
      }
    }

    if (particles.length < MAX_PARTICLES) {
      particles.push(new Particle(pos.x, pos.y, pos.color, pos.dirX, pos.dirY));
      lastSpawnPos = { x: pos.x, y: pos.y };
    }
  }

  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw(ctx);

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }

  ctx.globalAlpha = 1;
  animationFrameId = requestAnimationFrame(animate);
};

const { isReducedMotion } = useMotion();
const coarsePointer = typeof window !== 'undefined'
  ? window.matchMedia('(pointer: coarse)').matches
  : false;

let listenersAttached = false;

const attachListeners = () => {
  if (listenersAttached || !canvas.value) return;
  listenersAttached = true;
  ctx = canvas.value.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  startAnimation();
};

const detachListeners = () => {
  if (!listenersAttached) return;
  listenersAttached = false;
  stopAnimation();
  particles = [];
  queue = [];
  lastQueuedPos = null;
  lastSpawnPos = null;
  lastMoveDx = 0;
  lastMoveDy = -1;
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
};

const updateEnabledState = () => {
  const shouldEnable = !isReducedMotion.value && !coarsePointer;
  isEnabled.value = shouldEnable;

  if (shouldEnable) {
    requestAnimationFrame(() => attachListeners());
  } else {
    detachListeners();
  }
};

watch(isReducedMotion, updateEnabledState);

watch([cursorX, cursorY], ([x, y]) => {
  if (!isTracking.value || !isEnabled.value) return;
  enqueueTrailPoint(x, y, isInteractive.value);
});

onMounted(() => {
  updateEnabledState();
});

onUnmounted(() => {
  detachListeners();
});
</script>
