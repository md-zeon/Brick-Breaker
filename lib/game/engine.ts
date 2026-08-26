import { GameData, GameState, Ball, Brick, Particle, PowerUp, PowerUpType } from './types';
import { LEVELS, COLORS } from './levels';
import { createBall, launchBall, resetBall, updateBall, bounceOffPaddle } from './ball';
import { createPaddle, updatePaddle } from './paddle';
import { createBricks, allBricksDestroyed } from './bricks';
import { ballBrickCollision, ballPaddleCollision } from './collision';
import { createParticles, updateParticles } from './particles';
import { maybeSpawnPowerUp, updatePowerUps, drawPowerUp } from './powerups';

const HIGH_SCORE_KEY = 'brick-breaker-highscore';

export function createGameData(canvasWidth: number, canvasHeight: number): GameData {
  let highScore = 0;
  try {
    highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
  } catch {}

  return {
    canvas: { width: canvasWidth, height: canvasHeight },
    ball: createBall(canvasWidth, canvasHeight, LEVELS[0].ballSpeed),
    paddle: createPaddle(canvasWidth, canvasHeight),
    bricks: createBricks(0, canvasWidth),
    particles: [],
    powerups: [],
    score: 0,
    lives: 3,
    level: 0,
    state: 'menu',
    highScore,
    activePowerUp: null,
    powerUpTimer: 0,
  };
}

export function startGame(data: GameData): void {
  data.state = 'playing';
  data.score = 0;
  data.lives = 3;
  data.level = 0;
  data.bricks = createBricks(0, data.canvas.width);
  data.powerups = [];
  data.particles = [];
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.ball.speed = LEVELS[0].ballSpeed;
  resetBall(data.ball, data.paddle);
}

export function selectLevel(data: GameData, level: number): void {
  data.level = level;
  data.bricks = createBricks(level, data.canvas.width);
  data.ball.speed = LEVELS[level].ballSpeed;
  data.powerups = [];
  data.particles = [];
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.state = 'playing';
  resetBall(data.ball, data.paddle);
}

export function updateGame(data: GameData, mouseX: number): void {
  if (data.state !== 'playing') return;

  updatePaddle(data.paddle, mouseX, data.canvas.width);

  if (data.ball.stuck) {
    data.ball.x = data.paddle.x + data.paddle.width / 2;
    data.ball.y = data.paddle.y - data.ball.radius - 2;
    return;
  }

  const ballResult = updateBall(data.ball, data.canvas.width, data.canvas.height);

  if (ballResult === 'lost') {
    data.lives--;
    if (data.lives <= 0) {
      data.state = 'gameover';
      updateHighScore(data);
    } else {
      resetBall(data.ball, data.paddle);
    }
    return;
  }

  if (ballPaddleCollision(data.ball, data.paddle)) {
    bounceOffPaddle(data.ball, data.paddle);
  }

  for (let i = data.bricks.length - 1; i >= 0; i--) {
    const brick = data.bricks[i];
    if (brick.hits === 0 || brick.hits === -1) continue;

    const collision = ballBrickCollision(data.ball, brick);
    if (collision.hit) {
      brick.hits--;
      if (brick.hits === 0) {
        data.score += brick.points;
        data.particles.push(...createParticles(
          brick.x + brick.width / 2,
          brick.y + brick.height / 2,
          brick.color
        ));
        const level = LEVELS[data.level];
        if (level) {
          const powerUp = maybeSpawnPowerUp(
            brick.x + brick.width / 2,
            brick.y + brick.height / 2,
            level.powerUpChance
          );
          if (powerUp) data.powerups.push(powerUp);
        }
      }
      break;
    }
  }

  updateParticles(data.particles);
  updatePowerUps(data.powerups, data.canvas.height);

  for (let i = data.powerups.length - 1; i >= 0; i--) {
    const p = data.powerups[i];
    if (
      p.x < data.paddle.x + data.paddle.width &&
      p.x + p.width > data.paddle.x &&
      p.y < data.paddle.y + data.paddle.height &&
      p.y + p.height > data.paddle.y
    ) {
      applyPowerUp(data, p.type);
      data.powerups.splice(i, 1);
    }
  }

  if (data.activePowerUp && data.powerUpTimer > 0) {
    data.powerUpTimer--;
    if (data.powerUpTimer <= 0) {
      removePowerUp(data);
    }
  }

  if (allBricksDestroyed(data.bricks)) {
    data.state = 'levelcomplete';
    updateHighScore(data);
  }
}

function applyPowerUp(data: GameData, type: PowerUpType): void {
  removePowerUp(data);
  data.activePowerUp = type;
  data.powerUpTimer = 600;

  switch (type) {
    case 'wide':
      data.paddle.width = 160;
      break;
    case 'slow':
      data.ball.speed *= 0.6;
      data.ball.dx *= 0.6;
      data.ball.dy *= 0.6;
      break;
    case 'life':
      data.lives++;
      data.activePowerUp = null;
      data.powerUpTimer = 0;
      break;
    case 'multi':
      data.activePowerUp = null;
      data.powerUpTimer = 0;
      break;
  }
}

function removePowerUp(data: GameData): void {
  if (data.activePowerUp === 'wide') {
    data.paddle.width = 100;
  }
  if (data.activePowerUp === 'slow') {
    const level = LEVELS[data.level];
    if (level) data.ball.speed = level.ballSpeed;
  }
  data.activePowerUp = null;
  data.powerUpTimer = 0;
}

function updateHighScore(data: GameData): void {
  if (data.score > data.highScore) {
    data.highScore = data.score;
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(data.highScore));
    } catch {}
  }
}

export function renderGame(ctx: CanvasRenderingContext2D, data: GameData): void {
  const { canvas, ball, paddle, bricks, particles, powerups } = data;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const brick of bricks) {
    if (brick.hits === 0) continue;
    ctx.fillStyle = brick.color;
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
    ctx.fill();
  }

  ctx.fillStyle = COLORS.paddle;
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
  ctx.fill();

  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  for (const p of powerups) {
    drawPowerUp(ctx, p);
  }
}
