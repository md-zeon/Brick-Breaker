import { Level } from './types';

const BRICK_COLS = 10;

const ROW_COLORS = [
  '#EF4444', '#EF4444',
  '#F59E0B', '#F59E0B',
  '#22C55E', '#22C55E',
  '#3B82F6', '#3B82F6',
];

function createSpaceInvader(): number[][] {
  return [
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

function createSmiley(): number[][] {
  return [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,1,0,1,1,1,1,0,1,1],
    [0,0,1,0,0,0,0,1,0,0],
  ];
}

function createCross(): number[][] {
  return [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

function createSpiral(): number[][] {
  const grid: number[][] = Array.from({ length: 8 }, () => Array(10).fill(0));
  const path = [
    [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],
    [1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
    [7,8],[7,7],[7,6],[7,5],[7,4],[7,3],[7,2],[7,1],[7,0],
    [6,0],[5,0],[4,0],[3,0],[2,0],[1,0],
    [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],
    [2,8],[3,8],[4,8],[5,8],[6,8],
    [6,7],[6,6],[6,5],[6,4],[6,3],[6,2],[6,1],
    [5,1],[4,1],[3,1],[2,1],
    [2,2],[2,3],[2,4],[2,5],[2,6],[2,7],
    [3,7],[4,7],[5,7],
    [5,6],[5,5],[5,4],[5,3],[5,2],
    [4,2],[3,2],
    [3,3],[3,4],[3,5],[3,6],
    [4,6],[4,3],[4,4],[4,5],
  ];
  for (const [r, c] of path) {
    if (r < 8 && c < 10) grid[r][c] = 1;
  }
  return grid;
}

function createFortress(): number[][] {
  return [
    [2,0,2,0,2,0,2,0,2,0],
    [2,2,2,2,2,2,2,2,2,2],
    [0,2,1,1,1,1,1,1,2,0],
    [0,2,1,0,0,0,0,1,2,0],
    [0,2,1,0,0,0,0,1,2,0],
    [0,2,1,1,0,0,1,1,2,0],
    [0,2,1,1,1,1,1,1,2,0],
    [0,0,2,1,1,1,1,2,0,0],
  ];
}

function createSnake(): number[][] {
  return [
    [1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,0,1,0,0],
    [0,1,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
}

function createTornado(): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: number[] = [];
    const offset = Math.floor(Math.sin(r * 0.8) * 2 + 2);
    const width = 3 + Math.floor(r / 2);
    for (let c = 0; c < 10; c++) {
      row.push(c >= offset && c < offset + width ? (r < 2 ? 3 : 1) : 0);
    }
    grid.push(row);
  }
  return grid;
}

function createAlienShip(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,0,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,0,0,1],
  ];
}

function createMaze(): number[][] {
  return [
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1],
    [1,1,1,1,0,0,0,0,0,0],
  ];
}

function createDiamondDouble(): number[][] {
  const grid: number[][] = Array.from({ length: 8 }, () => Array(10).fill(0));
  const patterns = [
    [[0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],
     [3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],
     [4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[5,3],[5,4],[5,5],[5,6],[6,4],[6,5]],
  ];
  for (const coord of patterns[0]) {
    grid[coord[0]][coord[1]] = 1;
  }
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      if (grid[r][c] === 1) {
        const dr = Math.abs(r - 3.5);
        const dc = Math.abs(c - 4.5);
        if (dr + dc < 2) grid[r][c] = 3;
        else if (dr + dc < 3.5) grid[r][c] = 2;
      }
    }
  }
  return grid;
}

function createTree(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
  ];
}

function createGalagaShip(): number[][] {
  return [
    [0,0,0,1,0,0,1,0,0,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,1,0],
  ];
}

function createZigzag(): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: number[] = [];
    const offset = r % 2 === 0 ? 0 : 3;
    for (let c = 0; c < 10; c++) {
      const inBlock = c >= offset && c < offset + 4;
      row.push(inBlock ? (r % 4 < 2 ? 2 : 1) : 0);
    }
    grid.push(row);
  }
  return grid;
}

function createInvertedPyramid(): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: number[] = [];
    const width = 10 - r;
    const indent = Math.floor((10 - width) / 2);
    for (let c = 0; c < 10; c++) {
      if (c >= indent && c < indent + width) {
        row.push(r >= 6 ? 3 : r >= 4 ? 2 : 1);
      } else {
        row.push(0);
      }
    }
    grid.push(row);
  }
  return grid;
}

function createDonut(): number[][] {
  const grid: number[][] = Array.from({ length: 8 }, () => Array(10).fill(0));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      const dr = r - 3.5;
      const dc = c - 4.5;
      const dist = Math.sqrt(dr * dr + dc * dc);
      if (dist >= 2 && dist <= 3.5) {
        grid[r][c] = dist > 2.8 ? 2 : 1;
      }
    }
  }
  return grid;
}

function createHeartBig(): number[][] {
  const grid: number[][] = Array.from({ length: 8 }, () => Array(10).fill(0));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      const x = (c - 4.5) / 4.5;
      const y = (3.5 - r) / 3.5;
      const inside = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y < 0;
      if (inside) {
        const dist = Math.sqrt(x * x + y * y);
        grid[r][c] = dist < 0.6 ? 3 : dist < 0.85 ? 2 : 1;
      }
    }
  }
  return grid;
}

function createSpaceInvader2(): number[][] {
  return [
    [0,1,0,0,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,0,1,0,0,1,0,1,0],
    [1,0,0,0,1,1,0,0,0,1],
  ];
}

function createFullGrid3Hit(): number[][] {
  return Array.from({ length: 8 }, () => Array(10).fill(3));
}

export const LEVELS: Level[] = [
  { name: 'The Classic', bricks: createSpaceInvader(), ballSpeed: 5, powerUpChance: 0.1 },
  { name: 'Smiley Face', bricks: createSmiley(), ballSpeed: 5.5, powerUpChance: 0.12 },
  { name: 'The Cross', bricks: createCross(), ballSpeed: 6, powerUpChance: 0.15 },
  { name: 'Spiral', bricks: createSpiral(), ballSpeed: 6.5, powerUpChance: 0.15 },
  { name: 'Fortress', bricks: createFortress(), ballSpeed: 7, powerUpChance: 0.18 },
  { name: 'Snake', bricks: createSnake(), ballSpeed: 7.5, powerUpChance: 0.18 },
  { name: 'Tornado', bricks: createTornado(), ballSpeed: 8, powerUpChance: 0.2 },
  { name: 'Alien Ship', bricks: createAlienShip(), ballSpeed: 8.5, powerUpChance: 0.2 },
  { name: 'Maze', bricks: createMaze(), ballSpeed: 9, powerUpChance: 0.22 },
  { name: 'Diamond Core', bricks: createDiamondDouble(), ballSpeed: 9.5, powerUpChance: 0.25 },
  { name: 'The Tree', bricks: createTree(), ballSpeed: 6, powerUpChance: 0.15 },
  { name: 'Galaga', bricks: createGalagaShip(), ballSpeed: 7, powerUpChance: 0.18 },
  { name: 'Zigzag', bricks: createZigzag(), ballSpeed: 7.5, powerUpChance: 0.2 },
  { name: 'Cascade', bricks: createInvertedPyramid(), ballSpeed: 8, powerUpChance: 0.2 },
  { name: 'Donut', bricks: createDonut(), ballSpeed: 8.5, powerUpChance: 0.22 },
  { name: 'Love', bricks: createHeartBig(), ballSpeed: 9, powerUpChance: 0.22 },
  { name: 'Alien Boss', bricks: createSpaceInvader2(), ballSpeed: 9.5, powerUpChance: 0.25 },
  { name: 'The Wall', bricks: createFullGrid3Hit(), ballSpeed: 10, powerUpChance: 0.3 },
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
