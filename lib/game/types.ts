export interface Vector2 {
  x: number;
  y: number;
}

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
  stuck: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  maxHits: number;
  color: string;
  points: number;
  explosive?: boolean;
  hitFlash?: number;
}

export interface Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  dx: number;
  dy: number;
  segments: BossSegment[];
  name: string;
  bodyColor: string;
  accentColor: string;
  eyeColor: string;
  style: number;
}

export interface BossSegment {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  color: string;
}

export interface Laser {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

export interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
  dy: number;
  active: boolean;
}

export type PowerUpType = 'wide' | 'multi' | 'slow' | 'life' | 'sticky' | 'laser' | 'fireball' | 'magnet' | 'score2x';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'levelcomplete' | 'levelselect' | 'endless';

export interface Level {
  name: string;
  bricks: number[][];
  ballSpeed: number;
  powerUpChance: number;
  isBoss?: boolean;
}

export interface Trail {
  x: number;
  y: number;
  life: number;
}

export interface BackgroundStar {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
}

export interface GameData {
  canvas: {
    width: number;
    height: number;
  };
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  particles: Particle[];
  powerups: PowerUp[];
  trails: Trail[];
  lasers: Laser[];
  boss: Boss | null;
  score: number;
  lives: number;
  level: number;
  state: GameState;
  highScore: number;
  activePowerUp: PowerUpType | null;
  powerUpTimer: number;
  combo: number;
  maxCombo: number;
  comboTimer: number;
  shakeX: number;
  shakeY: number;
  shakeIntensity: number;
  laserCooldown: number;
  endlessWave: number;
  backgroundStars: BackgroundStar[];
  bgTime: number;
}
