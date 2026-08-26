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

export type PowerUpType = 'wide' | 'multi' | 'slow' | 'life' | 'sticky';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'levelcomplete' | 'levelselect';

export interface Level {
  name: string;
  bricks: number[][];
  ballSpeed: number;
  powerUpChance: number;
}

export interface Trail {
  x: number;
  y: number;
  life: number;
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
}
