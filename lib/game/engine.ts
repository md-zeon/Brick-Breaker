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
const UNLOCKED_LEVEL_KEY = 'brick-breaker-unlocked-level';
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

interface BossConfig {
  name: string;
  bodyColor: string;
  accentColor: string;
  eyeColor: string;
  style: number;
}

const BOSS_CONFIGS: BossConfig[] = [
  { name: 'Warden', bodyColor: '#4A4A5A', accentColor: '#8B8BA0', eyeColor: '#FF0000', style: 0 },
  { name: 'Pendulum', bodyColor: '#2D1B4E', accentColor: '#DAA520', eyeColor: '#FFFFFF', style: 1 },
  { name: 'Orbiter', bodyColor: '#1A3A5C', accentColor: '#00D4FF', eyeColor: '#FFE44D', style: 2 },
  { name: 'Phantom', bodyColor: '#1A3322', accentColor: '#44FF88', eyeColor: '#FFFFFF', style: 3 },
  { name: 'Titan', bodyColor: '#5C1A1A', accentColor: '#FF6600', eyeColor: '#FFDD00', style: 4 },
  { name: 'Colossus', bodyColor: '#3A3A3A', accentColor: '#FFD700', eyeColor: '#4488FF', style: 5 },
  { name: 'Wraith', bodyColor: '#E8E8E8', accentColor: '#888888', eyeColor: '#FF0000', style: 6 },
  { name: 'Overlord', bodyColor: '#660022', accentColor: '#FFD700', eyeColor: '#FFAA00', style: 7 },
  { name: 'Inferno', bodyColor: '#CC2200', accentColor: '#FF8800', eyeColor: '#FFFFFF', style: 8 },
  { name: 'Frost', bodyColor: '#0044AA', accentColor: '#AAEEFF', eyeColor: '#00FFFF', style: 9 },
  { name: 'Guardian', bodyColor: '#555555', accentColor: '#333333', eyeColor: '#00FF44', style: 10 },
  { name: 'Machina', bodyColor: '#888888', accentColor: '#0066FF', eyeColor: '#FF0000', style: 11 },
  { name: 'Leviathan', bodyColor: '#0A2A4A', accentColor: '#22AA66', eyeColor: '#FFEE00', style: 12 },
  { name: 'Overgrowth', bodyColor: '#225522', accentColor: '#884422', eyeColor: '#FF2200', style: 13 },
  { name: 'Tempest', bodyColor: '#333344', accentColor: '#AAAACC', eyeColor: '#4488FF', style: 14 },
  { name: 'Abyss', bodyColor: '#2A0A3A', accentColor: '#44FF44', eyeColor: '#FF00FF', style: 15 },
  { name: 'Sandstorm', bodyColor: '#AA8844', accentColor: '#664422', eyeColor: '#FF0000', style: 16 },
  { name: 'Monolith', bodyColor: '#0A0A0A', accentColor: '#00FF88', eyeColor: '#FFFFFF', style: 17 },
  { name: 'Cortex', bodyColor: '#AA4466', accentColor: '#CC2244', eyeColor: '#8800FF', style: 18 },
  { name: 'Entropy', bodyColor: '#222233', accentColor: '#FF44FF', eyeColor: '#44FFFF', style: 19 },
];

function createBossSegments(style: number, cx: number, cy: number, tier: number, w: number, h: number, color: string): BossSegment[] {
  const segs: BossSegment[] = [];
  const hp = 2 + tier;

  const push = (x: number, y: number, sw: number, sh: number, c?: string) => {
    segs.push({ x: x - sw / 2, y: y - sh / 2, width: sw, height: sh, hp, color: c || color });
  };

  switch (style) {
    case 0: // Warden — 3 horizontal shield bars
      for (let i = 0; i < 3; i++) push(cx, cy - 30 + i * 30, 120, 18, i === 1 ? '#6B6B80' : color);
      break;
    case 1: // Pendulum — V shape
      push(cx - 60, cy - 10, 50, 16);
      push(cx + 60, cy - 10, 50, 16);
      push(cx, cy + 15, 50, 16, '#DAA520');
      push(cx - 30, cy - 30, 40, 14);
      push(cx + 30, cy - 30, 40, 14);
      break;
    case 2: // Orbiter — ring segments
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        push(cx + Math.cos(a) * 55, cy + Math.sin(a) * 35, 40, 14, i % 2 === 0 ? color : '#00D4FF');
      }
      break;
    case 3: // Phantom — ghost shape
      push(cx, cy - 10, 90, 20);
      push(cx - 35, cy + 10, 50, 16);
      push(cx + 35, cy + 10, 50, 16);
      push(cx, cy + 25, 40, 14, '#44FF88');
      push(cx - 15, cy - 30, 30, 14);
      push(cx + 15, cy - 30, 30, 14);
      break;
    case 4: // Titan — humanoid
      push(cx, cy - 30, 50, 18); // head
      push(cx, cy, 70, 22); // torso
      push(cx - 55, cy - 5, 35, 16, '#FF6600'); // left arm
      push(cx + 55, cy - 5, 35, 16, '#FF6600'); // right arm
      push(cx, cy + 25, 40, 16); // waist
      break;
    case 5: // Colossus — big block with runes
      push(cx, cy - 15, 130, 24, '#555555');
      push(cx, cy + 15, 130, 24, '#444444');
      push(cx - 50, cy, 20, 20, '#FFD700');
      push(cx + 50, cy, 20, 20, '#FFD700');
      break;
    case 6: // Wraith — thin skeleton
      push(cx, cy - 30, 40, 12, '#FFFFFF');
      push(cx - 30, cy - 10, 25, 10, '#CCCCCC');
      push(cx + 30, cy - 10, 25, 10, '#CCCCCC');
      push(cx, cy, 35, 12, '#EEEEEE');
      push(cx - 25, cy + 15, 20, 10, '#AAAAAA');
      push(cx + 25, cy + 15, 20, 10, '#AAAAAA');
      push(cx, cy + 28, 30, 12, '#DDDDDD');
      break;
    case 7: // Overlord — demon with crown
      push(cx, cy - 25, 80, 18, '#FFD700'); // crown
      push(cx - 25, cy - 40, 12, 18, '#FFD700'); // left horn
      push(cx + 25, cy - 40, 12, 18, '#FFD700'); // right horn
      push(cx, cy, 90, 24); // face
      push(cx, cy + 25, 60, 18, '#880033'); // chin
      break;
    case 8: // Inferno — flame demon
      push(cx, cy - 15, 50, 20, '#FF8800');
      push(cx - 35, cy, 40, 16, '#FF4400');
      push(cx + 35, cy, 40, 16, '#FF4400');
      push(cx, cy + 15, 60, 18, '#CC2200');
      push(cx - 20, cy - 35, 16, 20, '#FFFF00');
      push(cx + 20, cy - 35, 16, 20, '#FFFF00');
      push(cx, cy - 40, 12, 16, '#FFFFFF');
      break;
    case 9: // Frost — crystal shards
      push(cx, cy, 100, 22, '#6699CC');
      push(cx - 45, cy - 20, 30, 30, '#88BBEE');
      push(cx + 45, cy - 20, 30, 30, '#88BBEE');
      push(cx, cy - 25, 25, 25, '#AAEEFF');
      push(cx - 20, cy + 18, 20, 14, '#5588BB');
      push(cx + 20, cy + 18, 20, 14, '#5588BB');
      break;
    case 10: // Guardian — blocky stone
      push(cx - 40, cy - 15, 35, 20);
      push(cx, cy - 15, 35, 20);
      push(cx + 40, cy - 15, 35, 20);
      push(cx, cy + 10, 100, 20, '#666666');
      break;
    case 11: // Machina — robot
      push(cx, cy - 20, 60, 20, '#AAAAAA');
      push(cx, cy + 5, 80, 22, '#999999');
      push(cx - 50, cy + 5, 20, 30, '#777777');
      push(cx + 50, cy + 5, 20, 30, '#777777');
      push(cx, cy + 30, 50, 16, '#888888');
      break;
    case 12: // Leviathan — serpentine
      for (let i = 0; i < 5; i++) {
        const sx = cx - 80 + i * 40;
        const sy = cy + Math.sin(i * 1.2) * 15;
        push(sx, sy, 35, 18, i % 2 === 0 ? color : '#33CC77');
      }
      break;
    case 13: // Overgrowth — vine monster
      push(cx, cy - 10, 70, 20);
      push(cx - 50, cy - 30, 25, 35, '#44AA44');
      push(cx + 50, cy - 30, 25, 35, '#44AA44');
      push(cx - 30, cy + 15, 20, 20, '#664422');
      push(cx + 30, cy + 15, 20, 20, '#664422');
      push(cx, cy + 25, 30, 14, '#337733');
      break;
    case 14: // Tempest — scattered storm
      push(cx - 50, cy - 20, 45, 16, '#555566');
      push(cx + 50, cy - 20, 45, 16, '#555566');
      push(cx, cy, 60, 18, '#666677');
      push(cx - 30, cy + 18, 35, 14, '#777788');
      push(cx + 30, cy + 18, 35, 14, '#777788');
      break;
    case 15: // Abyss — tentacle horror
      push(cx, cy - 10, 80, 22, '#3A1A5A');
      push(cx - 40, cy + 15, 15, 30, '#44FF44');
      push(cx - 15, cy + 18, 15, 35, '#33CC33');
      push(cx + 15, cy + 18, 15, 35, '#33CC33');
      push(cx + 40, cy + 15, 15, 30, '#44FF44');
      push(cx, cy - 30, 40, 16, '#2A0A3A');
      break;
    case 16: // Sandstorm — worm segments
      for (let i = 0; i < 6; i++) {
        const sx = cx - 75 + i * 30;
        const sy = cy + Math.sin(i * 0.8) * 12;
        push(sx, sy, 25, 20, i % 2 === 0 ? color : '#CC9944');
      }
      break;
    case 17: // Monolith — alien geometric
      push(cx, cy - 5, 40, 50);
      push(cx - 35, cy + 5, 20, 30, '#00FF88');
      push(cx + 35, cy + 5, 20, 30, '#00FF88');
      push(cx, cy - 35, 20, 14, '#00CC66');
      break;
    case 18: // Cortex — brain
      push(cx - 20, cy - 15, 45, 20, '#CC6688');
      push(cx + 20, cy - 15, 45, 20, '#BB5577');
      push(cx - 25, cy + 10, 40, 18, '#AA4466');
      push(cx + 25, cy + 10, 40, 18, '#993355');
      push(cx, cy, 30, 24, '#CC2244');
      break;
    case 19: // Entropy — fragmented chaos
      push(cx - 40, cy - 25, 30, 18, '#FF44FF');
      push(cx + 40, cy - 25, 30, 18, '#44FFFF');
      push(cx - 50, cy, 25, 22, '#FFFF44');
      push(cx + 50, cy, 25, 22, '#FF4444');
      push(cx, cy - 10, 40, 20, '#44FF44');
      push(cx - 25, cy + 18, 35, 16, '#FF88FF');
      push(cx + 25, cy + 18, 35, 16, '#88FFFF');
      push(cx, cy + 30, 30, 14, '#FFFFFF');
      break;
  }
  return segs;
}

function createBoss(levelIndex: number, canvasWidth: number, canvasHeight: number): Boss {
  const tier = Math.floor(levelIndex / 5);
  const cfg = BOSS_CONFIGS[tier % BOSS_CONFIGS.length];
  const cx = canvasWidth / 2;
  const cy = 90;

  const segments = createBossSegments(cfg.style, cx, cy, tier, 0, 0, cfg.bodyColor);

  let minX = cx - 60, maxX = cx + 60, minY = cy - 40, maxY = cy + 40;
  for (const s of segments) {
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x + s.width);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y + s.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    hp: 5 + tier * 3,
    maxHp: 5 + tier * 3,
    dx: 1.5 + tier * 0.4,
    dy: 0,
    segments,
    name: cfg.name,
    bodyColor: cfg.bodyColor,
    accentColor: cfg.accentColor,
    eyeColor: cfg.eyeColor,
    style: cfg.style,
  };
}

export function createGameData(canvasWidth: number, canvasHeight: number): GameData {
  let highScore = 0;
  let maxUnlockedLevel = 0;
  try {
    highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    maxUnlockedLevel = parseInt(localStorage.getItem(UNLOCKED_LEVEL_KEY) || '0', 10);
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
    maxUnlockedLevel,
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
        brick.hitFlash = 1;
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
        unlockLevel(data, data.level);
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
    if (data.activePowerUp === 'magnet') {
      data.ball.stuck = true;
      data.ball.dx = 0;
      data.ball.dy = 0;
    } else {
      bounceOffPaddle(data.ball, data.paddle);
    }
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
      brick.hitFlash = 1;
      brick.hits--;

      // Fireball: no bounce, pass through
      if (data.activePowerUp !== 'fireball') {
        data.ball.x += collision.normal.x * collision.penetration;
        data.ball.y += collision.normal.y * collision.penetration;
        const dot = data.ball.dx * collision.normal.x + data.ball.dy * collision.normal.y;
        data.ball.dx -= 2 * dot * collision.normal.x;
        data.ball.dy -= 2 * dot * collision.normal.y;
      }

      if (brick.hits === 0) {
        data.combo++;
        data.comboTimer = COMBO_TIMEOUT;
        if (data.combo > data.maxCombo) data.maxCombo = data.combo;

        const comboMultiplier = Math.min(1 + (data.combo - 1) * 0.25, 4);
        const scoreMultiplier = data.activePowerUp === 'score2x' ? 2 : 1;
        data.score += Math.floor(brick.points * comboMultiplier * scoreMultiplier);

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
      unlockLevel(data, data.level);
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
    case 'fireball':
      data.ball.dx *= 1.15;
      data.ball.dy *= 1.15;
      break;
    case 'magnet':
      break;
    case 'score2x':
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
  if (data.activePowerUp === 'fireball') {
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

function unlockLevel(data: GameData, level: number): void {
  const next = level + 1;
  if (next < LEVELS.length && next > data.maxUnlockedLevel) {
    data.maxUnlockedLevel = next;
    try {
      localStorage.setItem(UNLOCKED_LEVEL_KEY, String(next));
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
    const bx = brick.x;
    const by = brick.y;
    const bw = brick.width;
    const bh = brick.height;
    const isIndestructible = brick.hits === -1;
    const isMulti = brick.maxHits > 1 && !isIndestructible;
    const damageLevel = isMulti ? brick.maxHits - brick.hits : 0;

    // Hit flash decay
    if (brick.hitFlash && brick.hitFlash > 0) {
      brick.hitFlash = Math.max(0, brick.hitFlash - 0.08);
    }

    ctx.save();

    // 3D gradient fill
    const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
    if (isIndestructible) {
      grad.addColorStop(0, '#9CA3AF');
      grad.addColorStop(0.3, '#6B7280');
      grad.addColorStop(1, '#374151');
    } else {
      const baseR = parseInt(brick.color.slice(1, 3), 16);
      const baseG = parseInt(brick.color.slice(3, 5), 16);
      const baseB = parseInt(brick.color.slice(5, 7), 16);
      const hi = `rgb(${Math.min(255, baseR + 40)},${Math.min(255, baseG + 40)},${Math.min(255, baseB + 40)})`;
      const lo = `rgb(${Math.floor(baseR * 0.55)},${Math.floor(baseG * 0.55)},${Math.floor(baseB * 0.55)})`;
      grad.addColorStop(0, hi);
      grad.addColorStop(0.35, brick.color);
      grad.addColorStop(1, lo);
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 3);
    ctx.fill();

    // Bevel highlight (top edge)
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.roundRect(bx + 1, by + 1, bw - 2, bh * 0.35, [3, 3, 0, 0]);
    ctx.fill();

    // Bevel shadow (bottom edge)
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(bx + 2, by + bh - 3, bw - 4, 2);

    // Brick texture — subtle mortar lines
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.33, by + 2);
    ctx.lineTo(bx + bw * 0.33, by + bh - 2);
    ctx.moveTo(bx + bw * 0.66, by + 2);
    ctx.lineTo(bx + bw * 0.66, by + bh - 2);
    ctx.stroke();

    // Pulsing glow on multi-hit bricks
    if (isMulti && brick.hits > 0) {
      const glowIntensity = 0.1 + (damageLevel / brick.maxHits) * 0.25;
      const pulse = Math.sin(data.bgTime * 4 + bx * 0.05) * 0.5 + 0.5;
      ctx.globalAlpha = glowIntensity * pulse;
      ctx.shadowColor = brick.color;
      ctx.shadowBlur = 8 + damageLevel * 4;
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 3);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Damage cracks
    if (isMulti && damageLevel > 0) {
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 1.5;
      const cx = bx + bw / 2;
      const cy = by + bh / 2;

      if (damageLevel >= 1) {
        ctx.beginPath();
        ctx.moveTo(cx - 8, by + 2);
        ctx.lineTo(cx - 3, cy - 2);
        ctx.lineTo(cx - 10, cy + 4);
        ctx.stroke();
      }
      if (damageLevel >= 2) {
        ctx.beginPath();
        ctx.moveTo(cx + 6, by + 3);
        ctx.lineTo(cx + 2, cy + 1);
        ctx.lineTo(cx + 9, cy + 5);
        ctx.stroke();
      }
      if (damageLevel >= 3 && brick.maxHits >= 4) {
        ctx.beginPath();
        ctx.moveTo(cx - 2, by + bh - 3);
        ctx.lineTo(cx + 1, cy + 3);
        ctx.lineTo(cx + 5, by + bh - 2);
        ctx.stroke();
      }
    }

    // Hit flash overlay
    if (brick.hitFlash && brick.hitFlash > 0) {
      ctx.globalAlpha = brick.hitFlash;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Explosive glow border
    if (brick.explosive) {
      const ePulse = Math.sin(data.bgTime * 6) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(255,215,0,${ePulse})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(bx + 1, by + 1, bw - 2, bh - 2, 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Bomb icon
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', bx + bw / 2, by + bh / 2);
    }

    // Indestructible metal texture
    if (isIndestructible) {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 0.5;
      for (let lx = bx + 6; lx < bx + bw - 4; lx += 8) {
        ctx.beginPath();
        ctx.moveTo(lx, by + 3);
        ctx.lineTo(lx, by + bh - 3);
        ctx.stroke();
      }
      // Bolt circles
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(bx + 5, by + bh / 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx + bw - 5, by + bh / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Multi-hit count badge
    if (isMulti && brick.hits > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.arc(bx + bw - 8, by + 8, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(brick.hits), bx + bw - 8, by + 9);
    }

    ctx.restore();
  }

  if (boss) {
    const t = data.bgTime;
    const hpRatio = boss.hp / boss.maxHp;
    const pulse = 1 + Math.sin(t * 4) * 0.04;
    const segTier = 2 + Math.floor(data.level / 5);

    for (const seg of boss.segments) {
      ctx.save();

      ctx.shadowColor = boss.accentColor;
      ctx.shadowBlur = 6 + Math.sin(t * 3 + seg.x * 0.1) * 3;

      ctx.fillStyle = seg.color;
      ctx.beginPath();
      ctx.roundRect(seg.x, seg.y, seg.width, seg.height, 3);
      ctx.fill();

      ctx.fillStyle = `rgba(255,255,255,0.15)`;
      ctx.fillRect(seg.x + 3, seg.y + 2, seg.width - 6, 3);

      ctx.shadowBlur = 0;

      const hpPct = seg.hp / segTier;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(seg.x + 3, seg.y + seg.height - 6, seg.width - 6, 4);
      const hpColor = hpPct > 0.5 ? '#44FF44' : hpPct > 0.25 ? '#FFAA00' : '#FF2200';
      ctx.fillStyle = hpColor;
      ctx.fillRect(seg.x + 3, seg.y + seg.height - 6, (seg.width - 6) * hpPct, 4);

      ctx.restore();
    }

    const bodyCx = boss.x + boss.width / 2;
    const bodyCy = boss.y + boss.height / 2;

    // Body glow aura
    ctx.save();
    ctx.globalAlpha = 0.15 + Math.sin(t * 2) * 0.05;
    const auraGrad = ctx.createRadialGradient(bodyCx, bodyCy, 10, bodyCx, bodyCy, boss.width * 0.7);
    auraGrad.addColorStop(0, boss.accentColor);
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(boss.x - 30, boss.y - 30, boss.width + 60, boss.height + 60);
    ctx.globalAlpha = 1;
    ctx.restore();

    // Eyes
    const eyeSpacing = Math.max(12, boss.width * 0.18);
    const eyeY = bodyCy - 2;
    const eyeSize = 4 + Math.sin(t * 5) * 1;

    for (const ex of [-eyeSpacing, eyeSpacing]) {
      // Eye white
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(bodyCx + ex, eyeY, eyeSize + 3, eyeSize + 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris
      ctx.fillStyle = boss.eyeColor;
      ctx.shadowColor = boss.eyeColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(bodyCx + ex, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pupil
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bodyCx + ex + Math.sin(t + ex) * 1.5, eyeY, eyeSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spikes along top (style dependent)
    if (boss.style <= 4 || boss.style === 7 || boss.style === 8 || boss.style === 13) {
      const spikeCount = 5 + boss.style;
      for (let i = 0; i < spikeCount; i++) {
        const sx = boss.x + (i / (spikeCount - 1)) * boss.width;
        const sH = 8 + Math.sin(t * 3 + i) * 3;
        ctx.fillStyle = boss.accentColor;
        ctx.beginPath();
        ctx.moveTo(sx - 4, boss.y);
        ctx.lineTo(sx, boss.y - sH);
        ctx.lineTo(sx + 4, boss.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Core HP bar
    ctx.fillStyle = '#111111';
    ctx.fillRect(bodyCx - 45, boss.y + boss.height + 12, 90, 6);
    const barColor = hpRatio > 0.5 ? '#FF4444' : hpRatio > 0.25 ? '#FF8800' : '#FF0000';
    ctx.fillStyle = barColor;
    ctx.shadowColor = barColor;
    ctx.shadowBlur = 6;
    ctx.fillRect(bodyCx - 45, boss.y + boss.height + 12, 90 * hpRatio, 6);
    ctx.shadowBlur = 0;

    // Boss name
    ctx.fillStyle = boss.eyeColor;
    ctx.shadowColor = boss.eyeColor;
    ctx.shadowBlur = 4;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(boss.name.toUpperCase(), bodyCx, boss.y - 10 - (boss.style <= 4 ? 8 : 0));
    ctx.shadowBlur = 0;

    // Damage flash when low HP
    if (hpRatio < 0.3) {
      ctx.globalAlpha = 0.1 + Math.sin(t * 10) * 0.08;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(boss.x - 5, boss.y - 5, boss.width + 10, boss.height + 10);
      ctx.globalAlpha = 1;
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

  if (data.activePowerUp === 'laser') {
    ctx.fillStyle = COLORS.laser;
    ctx.fillRect(paddle.x + 4, paddle.y - 2, 6, 4);
    ctx.fillRect(paddle.x + paddle.width - 10, paddle.y - 2, 6, 4);
  }

  // Ball rendering
  if (data.activePowerUp === 'fireball') {
    ctx.shadowColor = '#FF6600';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#FF4400';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#FFAA00';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#FFCC00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else {
    ctx.shadowColor = COLORS.ball;
    ctx.shadowBlur = 12;
    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

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
    drawPowerUp(ctx, p, data.bgTime);
  }

  if (data.combo > 1) {
    ctx.globalAlpha = Math.min(1, data.comboTimer / 30);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`COMBO x${data.combo}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.globalAlpha = 1;
  }

  if (data.activePowerUp === 'score2x') {
    ctx.fillStyle = '#EAB308';
    ctx.shadowColor = '#EAB308';
    ctx.shadowBlur = 6;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCORE ×2', canvas.width / 2, canvas.height / 2 + 60);
    ctx.shadowBlur = 0;
  }

  if (data.state === 'endless') {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Wave: ${data.endlessWave}`, 10, canvas.height - 10);
  }

  ctx.restore();
}
