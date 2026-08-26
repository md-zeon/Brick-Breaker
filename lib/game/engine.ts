import { GameData, Ball, Brick, Particle, PowerUp, PowerUpType, Trail, Boss, BossSegment, Laser, BackgroundStar } from './types';
import { LEVELS, COLORS } from './levels';
import { createBall, launchBall, resetBall, updateBall, bounceOffPaddle } from './ball';
import { createPaddle, updatePaddle } from './paddle';
import { createBricks, allBricksDestroyed, adjustBrightness } from './bricks';
import { ballBrickCollision, ballPaddleCollision, circleRectCollision } from './collision';
import { createParticles, updateParticles } from './particles';
import { maybeSpawnPowerUp, updatePowerUps, drawPowerUp } from './powerups';
import { playHit, playBreak, playBounce, playPowerUp, playLoseLife, playLevelComplete, playGameOver, playCombo } from './audio';

const HIGH_SCORE_KEY = 'brick-breaker-highscore';
const MAX_TRAIL = 12;
const COMBO_TIMEOUT = 90;
const LASER_SPEED = 8;
const LASER_COOLDOWN = 15;

function createBackgroundStars(width: number, height: number): BackgroundStar[] {
  const stars: BackgroundStar[] = [];
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.2 + Math.random() * 0.8,
      size: 0.5 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.5,
    });
  }
  return stars;
}

function createBoss(levelIndex: number, canvasWidth: number, canvasHeight: number): Boss {
  const tier = Math.floor(levelIndex / 5);
  const segCount = 3 + tier;
  const segWidth = 60;
  const segHeight = 20;
  const totalWidth = segCount * (segWidth + 8);
  const startX = (canvasWidth - totalWidth) / 2;
  const segments: BossSegment[] = [];

  for (let i = 0; i < segCount; i++) {
    segments.push({
      x: startX + i * (segWidth + 8),
      y: 80,
      width: segWidth,
      height: segHeight,
      hp: 2 + tier,
      color: COLORS.bossSegment,
    });
  }

  return {
    x: canvasWidth / 2 - 40,
    y: 100,
    width: 80,
    height: 30,
    hp: 5 + tier * 3,
    maxHp: 5 + tier * 3,
    dx: 1.5 + tier * 0.5,
    dy: 0,
    segments,
  };
}

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
    lasers: [],
    boss: null,
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
    laserCooldown: 0,
    endlessWave: 0,
    backgroundStars: createBackgroundStars(canvasWidth, canvasHeight),
    bgTime: 0,
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
  data.lasers = [];
  data.boss = null;
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.ball.speed = LEVELS[0].ballSpeed;
  data.combo = 0;
  data.maxCombo = 0;
  data.comboTimer = 0;
  data.shakeX = 0;
  data.shakeY = 0;
  data.shakeIntensity = 0;
  data.laserCooldown = 0;
  data.endlessWave = 0;
  resetBall(data.ball, data.paddle);

  const level = LEVELS[0];
  if (level.isBoss) {
    data.boss = createBoss(0, data.canvas.width, data.canvas.height);
  }
}

export function startEndless(data: GameData): void {
  data.state = 'endless';
  data.score = 0;
  data.lives = 3;
  data.level = 0;
  data.endlessWave = 0;
  data.powerups = [];
  data.particles = [];
  data.trails = [];
  data.lasers = [];
  data.boss = null;
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.combo = 0;
  data.maxCombo = 0;
  data.comboTimer = 0;
  data.shakeX = 0;
  data.shakeY = 0;
  data.shakeIntensity = 0;
  data.laserCooldown = 0;
  data.ball.speed = 5;
  spawnEndlessWave(data);
  resetBall(data.ball, data.paddle);
}

function spawnEndlessWave(data: GameData): void {
  data.endlessWave++;
  const cols = 10;
  const rows = Math.min(4 + Math.floor(data.endlessWave / 3), 8);
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const rand = Math.random();
      if (rand < 0.15) row.push(0);
      else if (rand < 0.25) row.push(4);
      else if (rand < 0.4) row.push(2);
      else if (rand < 0.48 && data.endlessWave > 5) row.push(3);
      else row.push(1);
    }
    grid.push(row);
  }
  data.bricks = [];
  const brickW = 50;
  const brickH = 18;
  const padding = 4;
  const totalW = cols * (brickW + padding) - padding;
  const offsetLeft = (data.canvas.width - totalW) / 2;
  const offsetTop = 60;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hits = grid[r][c];
      if (hits === 0) continue;
      const colorIndex = r % COLORS.brickColors.length;
      let color = COLORS.brickColors[colorIndex];
      if (hits === 4) color = COLORS.explosive;
      else if (hits === -1) color = COLORS.indestructible;
      else if (hits >= 2) color = adjustBrightness(color, 0.7);

      data.bricks.push({
        x: offsetLeft + c * (brickW + padding),
        y: offsetTop + r * (brickH + padding),
        width: brickW,
        height: brickH,
        hits,
        maxHits: hits === -1 ? -1 : hits,
        color,
        points: hits === 4 ? 15 : hits * 10,
        explosive: hits === 4,
      });
    }
  }
  data.ball.speed = 5 + data.endlessWave * 0.3;
}

export function selectLevel(data: GameData, level: number): void {
  data.level = level;
  data.bricks = createBricks(level, data.canvas.width);
  data.ball.speed = LEVELS[level].ballSpeed;
  data.powerups = [];
  data.particles = [];
  data.trails = [];
  data.lasers = [];
  data.boss = null;
  data.activePowerUp = null;
  data.powerUpTimer = 0;
  data.state = 'playing';
  data.combo = 0;
  data.comboTimer = 0;
  data.shakeX = 0;
  data.shakeY = 0;
  data.shakeIntensity = 0;
  data.laserCooldown = 0;
  resetBall(data.ball, data.paddle);

  const levelData = LEVELS[level];
  if (levelData?.isBoss) {
    data.boss = createBoss(level, data.canvas.width, data.canvas.height);
  }
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

function updateBackground(data: GameData): void {
  data.bgTime += 0.02;
  for (const star of data.backgroundStars) {
    star.y += star.speed;
    if (star.y > data.canvas.height) {
      star.y = 0;
      star.x = Math.random() * data.canvas.width;
    }
  }
}

function fireLaser(data: GameData): void {
  if (data.laserCooldown > 0) return;
  data.laserCooldown = LASER_COOLDOWN;
  data.lasers.push(
    { x: data.paddle.x + 8, y: data.paddle.y - 4, width: 3, height: 12, dy: -LASER_SPEED },
    { x: data.paddle.x + data.paddle.width - 11, y: data.paddle.y - 4, width: 3, height: 12, dy: -LASER_SPEED }
  );
}

function updateLasers(data: GameData): void {
  if (data.laserCooldown > 0) data.laserCooldown--;

  for (let i = data.lasers.length - 1; i >= 0; i--) {
    const laser = data.lasers[i];
    laser.y += laser.dy;
    if (laser.y + laser.height < 0) {
      data.lasers.splice(i, 1);
      continue;
    }

    for (let j = data.bricks.length - 1; j >= 0; j--) {
      const brick = data.bricks[j];
      if (brick.hits === 0 || brick.hits === -1) continue;

      if (
        laser.x < brick.x + brick.width &&
        laser.x + laser.width > brick.x &&
        laser.y < brick.y + brick.height &&
        laser.y + laser.height > brick.y
      ) {
        brick.hits--;
        if (brick.hits === 0) {
          data.score += brick.points;
          data.particles.push(...createParticles(
            brick.x + brick.width / 2,
            brick.y + brick.height / 2,
            brick.color
          ));
          if (brick.explosive) {
            explodeBrick(data, brick);
          }
        }
        data.lasers.splice(i, 1);
        break;
      }
    }
  }
}

function explodeBrick(data: GameData, brick: Brick): void {
  const cx = brick.x + brick.width / 2;
  const cy = brick.y + brick.height / 2;
  const radius = brick.width * 1.2;

  addShake(data, 6);
  data.particles.push(...createParticles(cx, cy, COLORS.explosive, 16));

  for (const b of data.bricks) {
    if (b === brick || b.hits === 0 || b.hits === -1) continue;
    const bx = b.x + b.width / 2;
    const by = b.y + b.height / 2;
    const dist = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2);
    if (dist < radius) {
      b.hits--;
      if (b.hits === 0) {
        data.score += b.points;
        data.particles.push(...createParticles(bx, by, b.color, 6));
        if (b.explosive) {
          setTimeout(() => explodeBrick(data, b), 50);
        }
      }
    }
  }
}

function updateBoss(data: GameData): void {
  const boss = data.boss;
  if (!boss) return;

  boss.x += boss.dx;
  if (boss.x <= 0 || boss.x + boss.width >= data.canvas.width) {
    boss.dx *= -1;
  }

  for (const seg of boss.segments) {
    seg.x += boss.dx * 0.7;
    if (seg.x <= 0 || seg.x + seg.width >= data.canvas.width) {
      seg.x = Math.max(0, Math.min(seg.x, data.canvas.width - seg.width));
    }
  }

  if (ballPaddleCollision(data.ball, data.paddle)) {
    bounceOffPaddle(data.ball, data.paddle);
    playBounce();
  }

  for (let i = boss.segments.length - 1; i >= 0; i--) {
    const seg = boss.segments[i];
    if (seg.hp <= 0) continue;

    const col = circleRectCollision(
      data.ball.x, data.ball.y, data.ball.radius,
      seg.x, seg.y, seg.width, seg.height
    );
    if (col.hit) {
      data.ball.x += col.normal.x * col.penetration;
      data.ball.y += col.normal.y * col.penetration;
      const dot = data.ball.dx * col.normal.x + data.ball.dy * col.normal.y;
      data.ball.dx -= 2 * dot * col.normal.x;
      data.ball.dy -= 2 * dot * col.normal.y;

      seg.hp--;
      addShake(data, 3);
      playHit();
      if (seg.hp <= 0) {
        data.score += 50;
        data.particles.push(...createParticles(
          seg.x + seg.width / 2, seg.y + seg.height / 2, seg.color, 12
        ));
      }
      break;
    }
  }

  boss.segments = boss.segments.filter(s => s.hp > 0);

  if (boss.segments.length === 0) {
    const col = circleRectCollision(
      data.ball.x, data.ball.y, data.ball.radius,
      boss.x, boss.y, boss.width, boss.height
    );
    if (col.hit) {
      data.ball.x += col.normal.x * col.penetration;
      data.ball.y += col.normal.y * col.penetration;
      const dot = data.ball.dx * col.normal.x + data.ball.dy * col.normal.y;
      data.ball.dx -= 2 * dot * col.normal.x;
      data.ball.dy -= 2 * dot * col.normal.y;

      boss.hp--;
      addShake(data, 4);
      playHit();
      if (boss.hp <= 0) {
        data.score += 200;
        addShake(data, 10);
        data.particles.push(...createParticles(
          boss.x + boss.width / 2, boss.y + boss.height / 2, COLORS.boss, 24
        ));
        data.boss = null;
        data.state = 'levelcomplete';
        playLevelComplete();
        updateHighScore(data);
      }
    }
  }
}

export function updateGame(data: GameData, mouseX: number): void {
  if (data.state !== 'playing' && data.state !== 'endless') return;

  updatePaddle(data.paddle, mouseX, data.canvas.width);
  updateBackground(data);

  if (data.comboTimer > 0) {
    data.comboTimer--;
    if (data.comboTimer <= 0) {
      data.combo = 0;
    }
  }

  addTrail(data);
  updateTrails(data);
  updateShake(data);

  if (data.activePowerUp === 'laser' && data.ball.stuck === false) {
    fireLaser(data);
  }
  updateLasers(data);

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

  if (data.boss) {
    updateBoss(data);
    return;
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

        if (brick.explosive) {
          explodeBrick(data, brick);
        }

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
    if (data.state === 'endless') {
      spawnEndlessWave(data);
      resetBall(data.ball, data.paddle);
    } else {
      data.state = 'levelcomplete';
      playLevelComplete();
      updateHighScore(data);
    }
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

function renderBackground(ctx: CanvasRenderingContext2D, data: GameData): void {
  const { canvas, backgroundStars, bgTime } = data;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = `rgba(85, 66, 255, ${0.04 + Math.sin(bgTime) * 0.02})`;
  ctx.lineWidth = 1;
  const gridSize = 40;
  const offsetY = (bgTime * 20) % gridSize;
  for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (const star of backgroundStars) {
    ctx.globalAlpha = star.alpha * (0.5 + Math.sin(bgTime * 2 + star.x) * 0.5);
    ctx.fillStyle = '#EFEFE6';
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;
}

export function renderGame(ctx: CanvasRenderingContext2D, data: GameData): void {
  const { canvas, ball, paddle, bricks, particles, powerups, trails, lasers, boss } = data;

  ctx.save();
  ctx.translate(data.shakeX, data.shakeY);

  renderBackground(ctx, data);

  for (const brick of bricks) {
    if (brick.hits === 0) continue;
    ctx.fillStyle = brick.color;
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
    ctx.fill();

    if (brick.explosive) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(brick.x + 1, brick.y + 1, brick.width - 2, brick.height - 2, 2);
      ctx.stroke();
    }

    if (brick.hits > 1 && brick.hits !== -1) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(brick.hits), brick.x + brick.width / 2, brick.y + brick.height / 2);
    }
  }

  if (boss) {
    for (const seg of boss.segments) {
      ctx.fillStyle = seg.color;
      ctx.beginPath();
      ctx.roundRect(seg.x, seg.y, seg.width, seg.height, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(seg.x + 4, seg.y + 3, seg.width - 8, 4);

      const hpPct = seg.hp / (2 + Math.floor(data.level / 5));
      ctx.fillStyle = '#333';
      ctx.fillRect(seg.x + 4, seg.y + seg.height - 7, seg.width - 8, 4);
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(seg.x + 4, seg.y + seg.height - 7, (seg.width - 8) * hpPct, 4);
    }

    ctx.fillStyle = COLORS.boss;
    ctx.beginPath();
    ctx.roundRect(boss.x, boss.y, boss.width, boss.height, 6);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(boss.x + 8, boss.y + 5, boss.width - 16, 6);

    ctx.fillStyle = '#333';
    ctx.fillRect(boss.x + 10, boss.y + boss.height - 10, boss.width - 20, 5);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(boss.x + 10, boss.y + boss.height - 10, (boss.width - 20) * (boss.hp / boss.maxHp), 5);
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

  if (data.activePowerUp === 'laser') {
    ctx.fillStyle = COLORS.laser;
    ctx.fillRect(paddle.x + 4, paddle.y - 2, 6, 4);
    ctx.fillRect(paddle.x + paddle.width - 10, paddle.y - 2, 6, 4);
  }

  ctx.shadowColor = COLORS.ball;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  for (const laser of lasers) {
    ctx.fillStyle = COLORS.laser;
    ctx.shadowColor = COLORS.laser;
    ctx.shadowBlur = 8;
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    ctx.shadowBlur = 0;
  }

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

  if (data.state === 'endless') {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Wave: ${data.endlessWave}`, 10, canvas.height - 10);
  }

  ctx.restore();
}
