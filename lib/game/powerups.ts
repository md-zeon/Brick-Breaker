import { PowerUp, PowerUpType } from './types';

const POWERUP_TYPES: PowerUpType[] = ['wide', 'slow', 'life', 'laser', 'fireball', 'magnet', 'score2x'];
const POWERUP_SIZE = 28;

const POWERUP_THEME: Record<PowerUpType, { color: string; glow: string; icon: string }> = {
  wide:     { color: '#3B82F6', glow: '#60A5FA', icon: '↔' },
  slow:     { color: '#06B6D4', glow: '#22D3EE', icon: '◎' },
  life:     { color: '#EF4444', glow: '#F87171', icon: '♥' },
  laser:    { color: '#EC4899', glow: '#F472B6', icon: '⚡' },
  fireball: { color: '#F97316', glow: '#FB923C', icon: '🔥' },
  magnet:   { color: '#6366F1', glow: '#818CF8', icon: '◎' },
  score2x:  { color: '#EAB308', glow: '#FACC15', icon: '×2' },
};

export function maybeSpawnPowerUp(x: number, y: number, chance: number): PowerUp | null {
  if (Math.random() > chance) return null;

  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  return {
    x: x - POWERUP_SIZE / 2,
    y,
    width: POWERUP_SIZE,
    height: POWERUP_SIZE,
    type,
    dy: 1.8,
    active: true,
  };
}

export function updatePowerUps(powerups: PowerUp[], canvasHeight: number, dt: number): void {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += p.dy * dt;
    if (p.y > canvasHeight) {
      powerups.splice(i, 1);
    }
  }
}

export function drawPowerUp(ctx: CanvasRenderingContext2D, powerup: PowerUp, time: number, useShadows: boolean): void {
  const theme = POWERUP_THEME[powerup.type];
  const cx = powerup.x + powerup.width / 2;
  const cy = powerup.y + powerup.height / 2;
  const r = powerup.width / 2;
  const pulse = Math.sin(time * 5 + powerup.x * 0.3) * 0.15 + 0.85;

  ctx.save();

  // Outer glow
  ctx.globalAlpha = 0.3 * pulse;
  if (useShadows) {
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 14;
  }
  ctx.fillStyle = theme.glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
  ctx.fill();

  // Main body — gradient fill
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  const grad = ctx.createRadialGradient(cx - 2, cy - 3, 1, cx, cy, r);
  grad.addColorStop(0, theme.glow);
  grad.addColorStop(0.6, theme.color);
  grad.addColorStop(1, darken(theme.color, 0.5));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Gloss highlight
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(cx - 2, cy - r * 0.35, r * 0.5, r * 0.25, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Icon
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${powerup.type === 'score2x' ? '11px' : '16px'} monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(theme.icon, cx, cy + 1);

  ctx.restore();
}

function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(b * factor)})`;
}
