import { Brick } from './types';
import { COLORS, LEVELS } from './levels';

const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 4;
const BRICK_OFFSET_TOP = 60;

export function createBricks(levelIndex: number, canvasWidth: number): Brick[] {
  const level = LEVELS[levelIndex];
  if (!level) return [];

  const bricks: Brick[] = [];
  const grid = level.bricks;
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const totalWidth = cols * (BRICK_WIDTH + BRICK_PADDING) - BRICK_PADDING;
  const offsetLeft = (canvasWidth - totalWidth) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hits = grid[r][c];
      if (hits === 0) continue;

      const colorIndex = r % COLORS.brickColors.length;
      let color = COLORS.brickColors[colorIndex];
      if (hits === 4) color = COLORS.explosive;
      else if (hits === -1) color = COLORS.indestructible;
      else if (hits >= 2) color = adjustBrightness(color, 0.7);

      bricks.push({
        x: offsetLeft + c * (BRICK_WIDTH + BRICK_PADDING),
        y: BRICK_OFFSET_TOP + r * (BRICK_HEIGHT + BRICK_PADDING),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        hits: hits === 4 ? 1 : hits,
        maxHits: hits === -1 ? -1 : hits === 4 ? 1 : hits,
        color,
        points: hits === 4 ? 15 : hits === -1 ? 0 : hits * 10,
        explosive: hits === 4,
      });
    }
  }

  return bricks;
}

export function allBricksDestroyed(bricks: Brick[]): boolean {
  return bricks.every(b => b.hits === 0 || b.hits === -1);
}

export function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const nr = Math.floor(r * factor);
  const ng = Math.floor(g * factor);
  const nb = Math.floor(b * factor);

  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}
