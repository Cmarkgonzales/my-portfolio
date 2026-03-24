<template>
  <canvas ref="canvas" class="pointer-events-none fixed inset-0 z-[9999] h-full w-full"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
let ctx = null;
let particles = [];
let animationFrameId = null;
let queue = [];
const TRAIL_DELAY = 120; // Increased delay to emphasize following distance

// Gradient colors and interpolation helpers
const START_COLOR = '#048ABF'; // core ncs-blue (vibrant true blue for high contrast)
const END_COLOR = '#013A63';   // core ocean-blue (deep blue stardust tail)

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
    // Slightly larger base size so the shape pops
    this.size = Math.random() * 5 + 3; 
    // Small random velocity to spread out the trail slightly
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.02; // How fast it fades
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size *= 0.95; // Shrink as it fades
  }

  draw(ctx) {
    ctx.beginPath();
    const x = this.x;
    const y = this.y;
    const s = this.size;
    
    const innerS = s * 0.15; // sharper inner radius for a more striking star
    
    // Geometric four-pointed star
    ctx.moveTo(x, y - s); // top
    ctx.lineTo(x + innerS, y - innerS); // top-right
    ctx.lineTo(x + s, y); // right
    ctx.lineTo(x + innerS, y + innerS); // bottom-right
    ctx.lineTo(x, y + s); // bottom
    ctx.lineTo(x - innerS, y + innerS); // bottom-left
    ctx.lineTo(x - s, y); // left
    ctx.lineTo(x - innerS, y - innerS); // top-left
    ctx.closePath();
    
    // Calculate dynamic color based on particle age (gradient effect)
    const fadeFactor = 1 - Math.max(0, this.life);
    const currentColor = interpolateColor(START_COLOR, END_COLOR, fadeFactor);
    ctx.fillStyle = currentColor;
    
    // Add a glowing shadow to make the star truly pop
    ctx.shadowBlur = 10;
    ctx.shadowColor = currentColor;
    
    // Higher opacity scale to increase visibility
    ctx.globalAlpha = Math.max(0, this.life * 0.9);
    ctx.fill();
    
    // Reset shadow for performance on next draws
    ctx.shadowBlur = 0;
  }
}

const resizeCanvas = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  }
};

const handleMouseMove = (e) => {
  // Push to queue with timestamp and an explicit offset to maintain distance from the cursor tip
  queue.push({ x: e.clientX + 16, y: e.clientY + 16, time: Date.now() });
};

const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    queue.push({ x: e.touches[0].clientX + 16, y: e.touches[0].clientY + 16, time: Date.now() });
  }
};

const animate = () => {
  if (!ctx || !canvas.value) return;
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  
  const currentTime = Date.now();
  
  // Process queued movements that have passed the delay threshold
  while (queue.length > 0 && currentTime - queue[0].time >= TRAIL_DELAY) {
    const pos = queue.shift();
    // Emit only 1 particle per event to keep the trail elegant and non-distracting
    particles.push(new Particle(pos.x, pos.y));
  }
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw(ctx);
    
    // Remove dead particles
    if (particles[i].life <= 0 || particles[i].size <= 0.2) {
      particles.splice(i, 1);
      i--;
    }
  }
  
  // Reset alpha for safety
  ctx.globalAlpha = 1;
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  // Respect prefers-reduced-motion for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    animate();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchmove', handleTouchMove);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
