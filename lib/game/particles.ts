import { Particle } from './types';

const MAX_PARTICLES = 150;

export function createParticles(x: number, y: number, color: string, count: number = 8): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 1.5 + Math.random() * 3;

    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color,
      size: 2 + Math.random() * 3,
    });
  }

  return particles.slice(0, MAX_PARTICLES);
}

export function updateParticles(particles: Particle[], dt: number): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.dx * dt;
    p.y += p.dy * dt;
    p.dy += 0.08 * dt;
    p.life -= 0.025 * dt;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}
