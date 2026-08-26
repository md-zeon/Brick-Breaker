import { PowerUp, PowerUpType } from './types';
import { COLORS } from './levels';

const POWERUP_TYPES: PowerUpType[] = ['wide', 'multi', 'slow', 'life', 'sticky'];
const POWERUP_SIZE = 16;

export function maybeSpawnPowerUp(x: number, y: number, chance: number): PowerUp | null {
  if (Math.random() > chance) return null;

  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  return {
    x: x - POWERUP_SIZE / 2,
    y,
    width: POWERUP_SIZE,
    height: POWERUP_SIZE,
    type,
    dy: 2,
    active: true,
  };
}

export function updatePowerUps(powerups: PowerUp[], canvasHeight: number): void {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += p.dy;

    if (p.y > canvasHeight) {
      powerups.splice(i, 1);
    }
  }
}

export function drawPowerUp(ctx: CanvasRenderingContext2D, powerup: PowerUp): void {
  const icons: Record<PowerUpType, string> = {
    wide: '↔',
    multi: '✦',
    slow: '◎',
    life: '♥',
    sticky: '▼',
  };

  ctx.fillStyle = COLORS.powerUp;
  ctx.beginPath();
  ctx.arc(
    powerup.x + powerup.width / 2,
    powerup.y + powerup.height / 2,
    powerup.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.fillStyle = '#000';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    icons[powerup.type],
    powerup.x + powerup.width / 2,
    powerup.y + powerup.height / 2
  );
}
