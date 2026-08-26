import { GameData, Ball, Brick, Particle, PowerUp, PowerUpType, Trail } from './types';
import { LEVELS, COLORS } from './levels';
import { createBall, launchBall, resetBall, updateBall, bounceOffPaddle } from './ball';
import { createPaddle, updatePaddle } from './paddle';
import { createBricks, allBricksDestroyed } from './bricks';
import { ballBrickCollision, ballPaddleCollision } from './collision';
import { createParticles, updateParticles } from './particles';
import { maybeSpawnPowerUp, updatePowerUps, drawPowerUp } from './powerups';
import { playHit, playBreak, playBounce, playPowerUp, playLoseLife, playLevelComplete, playGameOver, playCombo } from './audio';

const HIGH_SCORE_KEY = 'brick-breaker-highscore';
const MAX_TRAIL = 12;
const COMBO_TIMEOUT = 90;

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
    trails: [],
    score: 0,
    lives: 3,
    level: 0,
    state: 'menu',
    highScore,
    activePowerUp: null,
    powerUpTimer: 0,
    combo: 0,
    maxCombo: 0,
    comboTimer: 0,
    shakeX: 0,
    shakeY: 0,
    shakeIntensity: 0,
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
  data.trails = [];
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.ball.speed = LEVELS[0].ballSpeed;
  data.combo = 0;
  data.maxCombo = 0;
  data.comboTimer = 0;
  data.shakeX = 0;
  data.shakeY = 0;
  data.shakeIntensity = 0;
  resetBall(data.ball, data.paddle);
}

export function selectLevel(data: GameData, level: number): void {
  data.level = level;
  data.bricks = createBricks(level, data.canvas.width);
  data.ball.speed = LEVELS[level].ballSpeed;
  data.powerups = [];
  data.particles = [];
  data.trails = [];
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.state = 'playing';
  data.combo = 0;
  data.comboTimer = 0;
  data.shakeX = 0;
  data.shakeY = 0;
  data.shakeIntensity = 0;
  resetBall(data.ball, data.paddle);
}

function addShake(data: GameData, intensity: number): void {
  data.shakeIntensity = Math.min(data.shakeIntensity + intensity, 12);
}

function updateShake(data: GameData): void {
  if (data.shakeIntensity > 0) {
    data.shakeX = (Math.random() - 0.5) * data.shakeIntensity * 2;
    data.shakeY = (Math.random() - 0.5) * data.shakeIntensity * 2;
    data.shakeIntensity *= 0.85;
    if (data.shakeIntensity < 0.5) {
      data.shakeIntensity = 0;
      data.shakeX = 0;
      data.shakeY = 0;
    }
  }
}

function addTrail(data: GameData): void {
  if (data.ball.stuck) return;
  data.trails.push({ x: data.ball.x, y: data.ball.y, life: 1 });
  if (data.trails.length > MAX_TRAIL) {
    data.trails.shift();
  }
}

function updateTrails(data: GameData): void {
  for (let i = data.trails.length - 1; i >= 0; i--) {
    data.trails[i].life -= 0.08;
    if (data.trails[i].life <= 0) {
      data.trails.splice(i, 1);
    }
  }
}

export function updateGame(data: GameData, mouseX: number): void {
  if (data.state !== 'playing') return;

  updatePaddle(data.paddle, mouseX, data.canvas.width);

  if (data.comboTimer > 0) {
    data.comboTimer--;
    if (data.comboTimer <= 0) {
      data.combo = 0;
    }
  }

  addTrail(data);
  updateTrails(data);
  updateShake(data);

  if (data.ball.stuck) {
    data.ball.x = data.paddle.x + data.paddle.width / 2;
    data.ball.y = data.paddle.y - data.ball.radius - 2;
    return;
  }

  const ballResult = updateBall(data.ball, data.canvas.width, data.canvas.height);

  if (ballResult === 'lost') {
    data.lives--;
    data.combo = 0;
    playLoseLife();
    if (data.lives <= 0) {
      data.state = 'gameover';
      playGameOver();
      updateHighScore(data);
    } else {
      resetBall(data.ball, data.paddle);
    }
    return;
  }

  if (ballResult === 'wall') {
    playBounce();
  }

  if (ballPaddleCollision(data.ball, data.paddle)) {
    bounceOffPaddle(data.ball, data.paddle);
    data.combo = 0;
    playBounce();
  }

  for (let i = data.bricks.length - 1; i >= 0; i--) {
    const brick = data.bricks[i];
    if (brick.hits === 0 || brick.hits === -1) continue;

    const collision = ballBrickCollision(data.ball, brick);
    if (collision.hit) {
      brick.hits--;
      if (brick.hits === 0) {
        data.combo++;
        data.comboTimer = COMBO_TIMEOUT;
        if (data.combo > data.maxCombo) data.maxCombo = data.combo;

        const comboMultiplier = Math.min(1 + (data.combo - 1) * 0.25, 4);
        data.score += Math.floor(brick.points * comboMultiplier);

        if (data.combo > 1) {
          playCombo(data.combo);
        } else {
          playBreak();
        }

        addShake(data, 4);
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
      } else {
        playHit();
        addShake(data, 2);
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
      playPowerUp();
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
    playLevelComplete();
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
  const { canvas, ball, paddle, bricks, particles, powerups, trails } = data;

  ctx.save();
  ctx.translate(data.shakeX, data.shakeY);

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

  for (const brick of bricks) {
    if (brick.hits === 0) continue;
    ctx.fillStyle = brick.color;
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
    ctx.fill();

    if (brick.hits > 1 && brick.hits !== -1) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(brick.hits), brick.x + brick.width / 2, brick.y + brick.height / 2);
    }
  }

  for (const t of trails) {
    ctx.globalAlpha = t.life * 0.4;
    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(t.x, t.y, ball.radius * t.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = COLORS.paddle;
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
  ctx.fill();

  ctx.shadowColor = COLORS.ball;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  for (const p of powerups) {
    drawPowerUp(ctx, p);
  }

  if (data.combo > 1) {
    ctx.globalAlpha = Math.min(1, data.comboTimer / 30);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`COMBO x${data.combo}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}
