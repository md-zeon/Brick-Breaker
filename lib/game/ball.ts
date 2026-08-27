import { Ball, Paddle } from './types';

export function createBall(canvasWidth: number, canvasHeight: number, speed: number): Ball {
  return {
    x: canvasWidth / 2,
    y: canvasHeight - 60,
    dx: 0,
    dy: 0,
    radius: 8,
    speed,
    stuck: true,
  };
}

export function launchBall(ball: Ball): void {
  if (!ball.stuck) return;
  ball.stuck = false;
  const angle = (Math.random() - 0.5) * Math.PI / 6;
  ball.dx = ball.speed * Math.sin(angle);
  ball.dy = -ball.speed * Math.cos(angle);
}

export function resetBall(ball: Ball, paddle: Paddle): void {
  ball.x = paddle.x + paddle.width / 2;
  ball.y = paddle.y - ball.radius - 2;
  ball.dx = 0;
  ball.dy = 0;
  ball.stuck = true;
}

export function updateBall(ball: Ball, canvasWidth: number, canvasHeight: number, dt: number): 'lost' | 'wall' | 'ok' {
  if (ball.stuck) {
    return 'ok';
  }

  ball.x += ball.dx * dt;
  ball.y += ball.dy * dt;

  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.dx = Math.abs(ball.dx);
    return 'wall';
  }
  if (ball.x + ball.radius >= canvasWidth) {
    ball.x = canvasWidth - ball.radius;
    ball.dx = -Math.abs(ball.dx);
    return 'wall';
  }
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.dy = Math.abs(ball.dy);
    return 'wall';
  }
  if (ball.y + ball.radius > canvasHeight) {
    return 'lost';
  }

  return 'ok';
}

export function bounceOffPaddle(ball: Ball, paddle: Paddle): void {
  const hitPoint = (ball.x - paddle.x) / paddle.width;
  const clampedHit = Math.max(0, Math.min(1, hitPoint));
  const angle = (clampedHit * Math.PI / 3) - Math.PI / 6;
  const clampedAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angle));

  ball.dx = ball.speed * Math.sin(clampedAngle);
  ball.dy = -ball.speed * Math.cos(clampedAngle);

  if (Math.abs(ball.dy) < ball.speed * 0.4) {
    ball.dy = -ball.speed * 0.4;
  }

  ball.y = paddle.y - ball.radius - 1;
}
