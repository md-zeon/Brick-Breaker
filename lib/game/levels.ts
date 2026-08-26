import { Level } from './types';

const BRICK_ROWS = 8;
const BRICK_COLS = 10;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 4;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 35;

const ROW_COLORS = [
  '#EF4444', '#EF4444',
  '#F59E0B', '#F59E0B',
  '#22C55E', '#22C55E',
  '#3B82F6', '#3B82F6',
];

function createBrickGrid(rows: number, cols: number, hitPattern?: number[][]): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (hitPattern && hitPattern[r] && hitPattern[r][c] !== undefined) {
        row.push(hitPattern[r][c]);
      } else {
        row.push(1);
      }
    }
    grid.push(row);
  }
  return grid;
}

function createCheckerboard(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      row.push((r + c) % 2 === 0 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

function createDiamond(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  const centerR = Math.floor(rows / 2);
  const centerC = Math.floor(cols / 2);
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const dist = Math.abs(r - centerR) + Math.abs(c - centerC);
      row.push(dist <= Math.min(centerR, centerC) ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

function createPyramid(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    const indent = Math.floor((cols - (r + 1)) / 2);
    for (let c = 0; c < cols; c++) {
      if (c >= indent && c < indent + r + 1) {
        row.push(r === 0 ? 2 : 1);
      } else {
        row.push(0);
      }
    }
    grid.push(row);
  }
  return grid;
}

function createHeart(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  const heart = [
    [0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ];
  for (let r = 0; r < rows; r++) {
    grid.push(heart[r] || new Array(cols).fill(0));
  }
  return grid;
}

function createXPattern(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const onDiag = r === c || r + c === cols - 1;
      row.push(onDiag ? 2 : 0);
    }
    grid.push(row);
  }
  return grid;
}

function createWaves(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const wave = Math.sin(c * 0.8) > 0;
      row.push(wave ? (r < 3 ? 3 : 1) : 0);
    }
    grid.push(row);
  }
  return grid;
}

function createCastle(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const isWall = c === 0 || c === cols - 1 || r === 0;
      const isBattlement = r === 0 && c % 2 === 0;
      if (isWall) row.push(-1);
      else if (isBattlement) row.push(2);
      else row.push(1);
    }
    grid.push(row);
  }
  return grid;
}

function createArrow(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  const centerC = Math.floor(cols / 2);
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    const width = r + 1;
    const indent = Math.floor((cols - width) / 2);
    for (let c = 0; c < cols; c++) {
      if (r < rows - 2) {
        row.push(c === centerC ? 2 : 0);
      } else {
        row.push(c >= indent && c < indent + width ? 2 : 0);
      }
    }
    grid.push(row);
  }
  return grid;
}

function createFullGrid2Hit(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(2);
    }
    grid.push(row);
  }
  return grid;
}

export const LEVELS: Level[] = [
  {
    name: 'Level 1',
    bricks: createBrickGrid(5, BRICK_COLS),
    ballSpeed: 5,
    powerUpChance: 0.1,
  },
  {
    name: 'Level 2',
    bricks: createCheckerboard(6, BRICK_COLS),
    ballSpeed: 5.5,
    powerUpChance: 0.12,
  },
  {
    name: 'Level 3',
    bricks: createDiamond(7, BRICK_COLS),
    ballSpeed: 6,
    powerUpChance: 0.15,
  },
  {
    name: 'Level 4',
    bricks: createPyramid(7, BRICK_COLS),
    ballSpeed: 6.5,
    powerUpChance: 0.15,
  },
  {
    name: 'Level 5',
    bricks: createHeart(8, BRICK_COLS),
    ballSpeed: 7,
    powerUpChance: 0.18,
  },
  {
    name: 'Level 6',
    bricks: createXPattern(8, BRICK_COLS),
    ballSpeed: 7.5,
    powerUpChance: 0.18,
  },
  {
    name: 'Level 7',
    bricks: createWaves(8, BRICK_COLS),
    ballSpeed: 8,
    powerUpChance: 0.2,
  },
  {
    name: 'Level 8',
    bricks: createCastle(8, BRICK_COLS),
    ballSpeed: 8.5,
    powerUpChance: 0.2,
  },
  {
    name: 'Level 9',
    bricks: createArrow(8, BRICK_COLS),
    ballSpeed: 9,
    powerUpChance: 0.22,
  },
  {
    name: 'Level 10',
    bricks: createFullGrid2Hit(8, BRICK_COLS),
    ballSpeed: 9.5,
    powerUpChance: 0.25,
  },
];

export const COLORS = {
  background: '#0A090F',
  paddle: '#5542FF',
  ball: '#EFEFE6',
  ui: '#EFEFE6',
  brickColors: ROW_COLORS,
  indestructible: '#6B7280',
  powerUp: '#F59E0B',
};
