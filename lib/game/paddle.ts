import { Paddle } from './types';

export function createPaddle(canvasWidth: number, canvasHeight: number): Paddle {
  const width = 100;
  const height = 14;
  return {
    x: (canvasWidth - width) / 2,
    y: canvasHeight - 40,
    width,
    height,
  };
}

export function updatePaddle(paddle: Paddle, targetX: number, canvasWidth: number): void {
  paddle.x = targetX - paddle.width / 2;
  paddle.x = Math.max(0, Math.min(paddle.x, canvasWidth - paddle.width));
}
