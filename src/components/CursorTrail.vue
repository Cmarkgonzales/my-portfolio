<template>
  <canvas v-if="isEnabled" ref="canvas" class="pointer-events-none fixed inset-0 z-[9999] h-full w-full"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const isEnabled = ref(false);
let ctx = null;
let particles = [];
let animationFrameId = null;
let queue = [];
let running = false;
const TRAIL_DELAY = 120;
const MAX_QUEUE_LENGTH = 90;
const MAX_PARTICLES = 130;

// Gradient colors and interpolation helpers
const START_COLOR = '#048ABF';
const END_COLOR = '#013A63';

const hex2rgb = (hex) => {
  const v = parseInt(hex.replace('#', ''), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
};

const interpolateColor = (color1, color2, factor) => {
  const c1 = hex2rgb(color1);
  const c2 = hex2rgb(color2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return `rgb(${r}, ${g}, ${b})`;
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 3; 
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.02;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size *= 0.95;
  }

  draw(ctx) {
    ctx.beginPath();
    const x = this.x;
    const y = this.y;
    const s = this.size;
    
    const innerS = s * 0.15;
    
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + innerS, y - innerS);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x + innerS, y + innerS);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - innerS, y + innerS);
    ctx.lineTo(x - s, y);
    ctx.lineTo(x - innerS, y - innerS);
    ctx.closePath();
    
    const fadeFactor = 1 - Math.max(0, this.life);
    const currentColor = interpolateColor(START_COLOR, END_COLOR, fadeFactor);
    ctx.fillStyle = currentColor;
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = currentColor;
    
    ctx.globalAlpha = Math.max(0, this.life * 0.9);
    ctx.fill();
    
    ctx.shadowBlur = 0;
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

const handleMouseMove = (e) => {
  queue.push({ x: e.clientX + 16, y: e.clientY + 16, time: Date.now() });
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
    if (particles.length < MAX_PARTICLES) {
      particles.push(new Particle(pos.x, pos.y));
    }
  }
  
  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw(ctx);
    
    if (particles[i].life <= 0 || particles[i].size <= 0.2) {
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

  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>
