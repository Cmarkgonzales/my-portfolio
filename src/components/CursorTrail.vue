<template>
  <canvas v-if="isEnabled" ref="canvas" class="pointer-events-none fixed inset-0 z-[9999] h-full w-full"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const GLYPHS = ['{}', '//', '=>', '[]', 'const', '</>'];
const DEFAULT_COLOR = '#07B2D9';
const BRONZE_COLOR = '#D98032';
const GLYPH_FONT = '600 11px "DM Mono", monospace';

const canvas = ref(null);
const isEnabled = ref(false);
let ctx = null;
let particles = [];
let animationFrameId = null;
let queue = [];
let running = false;
const TRAIL_DELAY = 160;
const MIN_QUEUE_DISTANCE = 20;
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

const resolveTrailColor = (clientX, clientY) => {
  const target = document.elementFromPoint(clientX, clientY);
  const isInteractive = target?.closest('a, button, [role="button"]');
  return isInteractive ? BRONZE_COLOR : DEFAULT_COLOR;
};

const handleMouseMove = (e) => {
  const x = e.clientX + CURSOR_OFFSET;
  const y = e.clientY + CURSOR_OFFSET;

  if (lastQueuedPos) {
    const dx = x - lastQueuedPos.x;
    const dy = y - lastQueuedPos.y;
    if (dx * dx + dy * dy < MIN_QUEUE_DISTANCE * MIN_QUEUE_DISTANCE) {
      return;
    }
    lastMoveDx = dx;
    lastMoveDy = dy;
  }

  lastQueuedPos = { x, y };
  const color = resolveTrailColor(e.clientX, e.clientY);
  queue.push({ x, y, time: Date.now(), color, dirX: lastMoveDx, dirY: lastMoveDy });

  if (queue.length > MAX_QUEUE_LENGTH) {
    queue.splice(0, queue.length - MAX_QUEUE_LENGTH);
  }
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

  while (queue.length > 0 && currentTime - queue[0].time >= TRAIL_DELAY) {
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

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (prefersReducedMotion || coarsePointer) return;

  isEnabled.value = true;

  requestAnimationFrame(() => {
    if (!canvas.value) return;
    ctx = canvas.value.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();
  });
});

onUnmounted(() => {
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
});
</script>
