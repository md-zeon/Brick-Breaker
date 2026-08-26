import { Ball, Brick, Paddle } from './types';

export interface CollisionResult {
  hit: boolean;
  side: 'top' | 'bottom' | 'left' | 'right' | null;
  penetration: number;
  normal: { x: number; y: number };
}

export function circleRectCollision(
  cx: number, cy: number, radius: number,
  rx: number, ry: number, rw: number, rh: number
): CollisionResult {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));

  const dx = cx - closestX;
  const dy = cy - closestY;
  const distSq = dx * dx + dy * dy;

  if (distSq >= radius * radius) {
    return { hit: false, side: null, penetration: 0, normal: { x: 0, y: 0 } };
  }

  const distance = Math.sqrt(distSq);
  const penetration = radius - distance;

  let nx = 0;
  let ny = 0;
  if (distance > 0) {
    nx = dx / distance;
    ny = dy / distance;
  } else {
    ny = -1;
  }

  let side: 'top' | 'bottom' | 'left' | 'right' = 'top';
  if (Math.abs(nx) > Math.abs(ny)) {
    side = nx > 0 ? 'right' : 'left';
  } else {
    side = ny > 0 ? 'bottom' : 'top';
  }

  return { hit: true, side, penetration, normal: { x: nx, y: ny } };
}

export function ballBrickCollision(ball: Ball, brick: Brick): CollisionResult {
  const result = circleRectCollision(
    ball.x, ball.y, ball.radius,
    brick.x, brick.y, brick.width, brick.height
  );

  if (result.hit) {
    ball.x += result.normal.x * result.penetration;
    ball.y += result.normal.y * result.penetration;

    const dot = ball.dx * result.normal.x + ball.dy * result.normal.y;
    ball.dx -= 2 * dot * result.normal.x;
    ball.dy -= 2 * dot * result.normal.y;
  }

  return result;
}

export function ballPaddleCollision(ball: Ball, paddle: Paddle): boolean {
  if (ball.dy < 0) return false;

  const result = circleRectCollision(
    ball.x, ball.y, ball.radius,
    paddle.x, paddle.y, paddle.width, paddle.height
  );

  return result.hit;
}
