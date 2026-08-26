import { Level } from './types';

const ROW_COLORS = [
  '#EF4444', '#EF4444',
  '#F59E0B', '#F59E0B',
  '#22C55E', '#22C55E',
  '#3B82F6', '#3B82F6',
];

function empty(): number[][] {
  return Array.from({ length: 8 }, () => Array(10).fill(0));
}

function full(hits: number = 1): number[][] {
  return Array.from({ length: 8 }, () => Array(10).fill(hits));
}

function pyramid(): number[][] {
  const grid = empty();
  for (let r = 0; r < 8; r++) {
    const w = 2 + r * 2;
    const off = 5 - r;
    for (let c = off; c < off + w && c < 10; c++) {
      if (c >= 0) grid[r][c] = r < 2 ? 1 : r < 5 ? 2 : 3;
    }
  }
  return grid;
}

function diamond(cx: number, cy: number, radius: number, fill: number[][]): number[][] {
  const grid = fill || empty();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      if (Math.abs(r - cy) + Math.abs(c - cx) <= radius) {
        grid[r][c] = 1;
      }
    }
  }
  return grid;
}

function circle(cx: number, cy: number, r: number, fill: number[][]): number[][] {
  const grid = fill || empty();
  for (let r2 = 0; r2 < 8; r2++) {
    for (let c = 0; c < 10; c++) {
      const dist = Math.sqrt((r2 - cy) ** 2 + (c - cx) ** 2);
      if (dist <= r) grid[r2][c] = 1;
    }
  }
  return grid;
}

function ring(cx: number, cy: number, outerR: number, innerR: number, fill: number[][]): number[][] {
  const grid = fill || empty();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      const dist = Math.sqrt((r - cy) ** 2 + (c - cx) ** 2);
      if (dist <= outerR && dist >= innerR) grid[r][c] = 1;
    }
  }
  return grid;
}

// === Level 1: Space Invader ===
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

// === Level 2: Smiley ===
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

// === Level 3: Cross ===
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

// === Level 4: Spiral ===
function createSpiral(): number[][] {
  const grid = empty();
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
  for (const [r, c] of path) if (r < 8 && c < 10) grid[r][c] = 1;
  return grid;
}

// === Level 6: Fortress ===
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

// === Level 7: Snake ===
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

// === Level 8: Tornado ===
function createTornado(): number[][] {
  const grid = empty();
  for (let r = 0; r < 8; r++) {
    const offset = Math.floor(Math.sin(r * 0.8) * 2 + 2);
    const width = 3 + Math.floor(r / 2);
    for (let c = offset; c < offset + width && c < 10; c++) {
      if (c >= 0) grid[r][c] = r < 2 ? 3 : 1;
    }
  }
  return grid;
}

// === Level 9: Alien Ship ===
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

// === Level 11: Maze ===
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

// === Level 12: Diamond Core ===
function createDiamondDouble(): number[][] {
  const grid = empty();
  const coords = [
    [0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],
    [3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],
    [4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[5,3],[5,4],[5,5],[5,6],[6,4],[6,5],
  ];
  for (const [r, c] of coords) grid[r][c] = 1;
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

// === Level 13: Tree ===
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

// === Level 14: Galaga ===
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

// === Level 16: Zigzag ===
function createZigzag(): number[][] {
  const grid = empty();
  for (let r = 0; r < 8; r++) {
    const offset = r % 2 === 0 ? 0 : 3;
    for (let c = offset; c < offset + 4 && c < 10; c++) {
      grid[r][c] = r % 4 < 2 ? 2 : 1;
    }
  }
  return grid;
}

// === Level 17: Cascade ===
function createInvertedPyramid(): number[][] {
  const grid = empty();
  for (let r = 0; r < 8; r++) {
    const w = 10 - r;
    const off = Math.floor((10 - w) / 2);
    for (let c = off; c < off + w; c++) {
      grid[r][c] = r >= 6 ? 3 : r >= 4 ? 2 : 1;
    }
  }
  return grid;
}

// === Level 18: Donut ===
function createDonut(): number[][] {
  const grid = empty();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      const dr = r - 3.5;
      const dc = c - 4.5;
      const dist = Math.sqrt(dr * dr + dc * dc);
      if (dist >= 2 && dist <= 3.5) grid[r][c] = dist > 2.8 ? 2 : 1;
    }
  }
  return grid;
}

// === Level 19: Love ===
function createHeartBig(): number[][] {
  const grid = empty();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      const x = (c - 4.5) / 4.5;
      const y = (3.5 - r) / 3.5;
      if (Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y < 0) {
        const dist = Math.sqrt(x * x + y * y);
        grid[r][c] = dist < 0.6 ? 3 : dist < 0.85 ? 2 : 1;
      }
    }
  }
  return grid;
}

// === Level 21: Alien Boss ===
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

// === Level 22: The Wall ===
function createFullGrid3Hit(): number[][] {
  return full(3);
}

// === Level 23: Arrow Up ===
function createArrowUp(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

// === Level 24: Double Diamond ===
function createDoubleDiamond(): number[][] {
  const g = empty();
  diamond(4, 3, 3, g);
  diamond(4, 3, 1.5, g);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    if (g[r][c] === 1) {
      const d = Math.abs(r - 3) + Math.abs(c - 4);
      g[r][c] = d <= 1 ? 3 : d <= 2 ? 2 : 1;
    }
  }
  return g;
}

// === Level 26: Checkerboard ===
function createCheckerboard(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    if ((r + c) % 2 === 0) g[r][c] = 1;
  }
  return g;
}

// === Level 27: Pac-Man ===
function createPacMan(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dist = Math.sqrt((r - 3.5) ** 2 + (c - 4.5) ** 2);
    const angle = Math.atan2(r - 3.5, c - 4.5);
    if (dist <= 3.5 && !(dist <= 3 && angle > -0.5 && angle < 0.5)) {
      g[r][c] = dist < 1 ? 3 : dist < 2.5 ? 2 : 1;
    }
  }
  return g;
}

// === Level 28: Rocket ===
function createRocket(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,0,1,0,0,0,0,1,0,0],
  ];
}

// === Level 29: Crown ===
function createCrown(): number[][] {
  return [
    [1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1],
    [1,1,0,1,1,1,1,0,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,2,2,2,2,2,2,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
}

// === Level 31: Skull ===
function createSkull(): number[][] {
  return [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,1,1,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,0,1,1,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

// === Level 32: Butterfly ===
function createButterfly(): number[][] {
  return [
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,0,0,0,0,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
  ];
}

// === Level 33: Columns ===
function createColumns(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      if (c % 3 === 0) g[r][c] = r < 3 ? 3 : r < 5 ? 2 : 1;
    }
  }
  return g;
}

// === Level 35: Inv Pyramid ===
function createInvPyramid(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) {
    const w = 2 + r * 2;
    const off = 5 - r;
    for (let c = off; c < off + w && c < 10; c++) {
      if (c >= 0) g[r][c] = r < 2 ? 1 : r < 5 ? 2 : 3;
    }
  }
  return g;
}

// === Level 37: Vortex ===
function createVortex(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dist = Math.sqrt((r - 3.5) ** 2 + (c - 4.5) ** 2);
    if (dist < 1.5) g[r][c] = 3;
    else if (dist < 2.5) g[r][c] = 2;
    else if (dist < 3.5) g[r][c] = 1;
  }
  return g;
}

// === Level 38: Wave ===
function createWave(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const wave = Math.round(Math.sin(c * 0.8 + r * 0.5) * 1.5 + 3);
    if (Math.abs(r - wave) < 1) g[r][c] = 1;
  }
  return g;
}

// === Level 40: Star ===
function createStar(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const cx = c - 4.5;
    const cy = r - 3.5;
    const angle = Math.atan2(cy, cx);
    const dist = Math.sqrt(cx * cx + cy * cy);
    const starR = 1.2 + Math.cos(angle * 5) * 0.8;
    if (dist < starR + 0.5) g[r][c] = dist < 1 ? 3 : 2;
  }
  return g;
}

// === Level 41: Arrow Down ===
function createArrowDown(): number[][] {
  return [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
  ];
}

// === Level 43: Helix ===
function createHelix(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const wave1 = Math.round(4.5 + Math.sin(r * 0.9) * 2);
    const wave2 = Math.round(4.5 - Math.sin(r * 0.9) * 2);
    if (c === wave1 || c === wave2) g[r][c] = 1;
    if ((r === 0 || r === 7) && (c >= 3 && c <= 6)) g[r][c] = 2;
  }
  return g;
}

// === Level 44: Cube ===
function createCube(): number[][] {
  return [
    [0,0,2,2,2,2,2,2,0,0],
    [0,2,2,1,1,1,1,2,2,0],
    [2,2,1,1,1,1,1,1,2,2],
    [2,1,1,1,2,2,1,1,1,2],
    [2,1,1,1,2,2,1,1,1,2],
    [2,2,1,1,1,1,1,1,2,2],
    [0,2,2,1,1,1,1,2,2,0],
    [0,0,2,2,2,2,2,2,0,0],
  ];
}

// === Level 45: Infinity ===
function createInfinity(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const x = (c - 4.5) / 3;
    const y = (r - 3.5) / 2;
    const val = (x * x + y * y + 1) ** 2 - 4 * x * x;
    if (val < 1.5 && val > -1) g[r][c] = 1;
  }
  return g;
}

// === Level 46: Lightning ===
function createLightning(): number[][] {
  return [
    [0,0,0,0,0,0,2,3,3,0],
    [0,0,0,0,0,2,2,3,0,0],
    [0,0,0,0,2,2,3,0,0,0],
    [0,0,0,2,2,3,3,3,0,0],
    [0,0,2,2,3,3,0,0,0,0],
    [0,2,2,3,0,0,0,0,0,0],
    [2,2,3,0,0,0,0,0,0,0],
    [2,3,3,0,0,0,0,0,0,0],
  ];
}

// === Level 47: Flame ===
function createFlame(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,1,1,2,3,3,2,1,1,0],
    [1,1,2,3,3,3,3,2,1,1],
    [1,2,3,3,3,3,3,3,2,1],
    [1,2,2,3,3,3,3,2,2,1],
    [0,1,1,2,2,2,2,1,1,0],
  ];
}

// === Level 49: Ice Crystal ===
function createIceCrystal(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dx = Math.abs(c - 4.5);
    const dy = Math.abs(r - 3.5);
    if (dx + dy < 3) g[r][c] = 1;
    if (dx < 2 && dy < 2) g[r][c] = 2;
    if (dx + dy < 1.5) g[r][c] = 3;
  }
  return g;
}

// === Level 50: Sun ===
function createSun(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dist = Math.sqrt((r - 3.5) ** 2 + (c - 4.5) ** 2);
    const angle = Math.atan2(r - 3.5, c - 4.5);
    const rayLen = 3.2 + Math.cos(angle * 8) * 0.8;
    if (dist < 1.8) g[r][c] = 3;
    else if (dist < rayLen) g[r][c] = 1;
  }
  return g;
}

// === Level 51: Moon ===
function createMoon(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dist1 = Math.sqrt((r - 3.5) ** 2 + (c - 4) ** 2);
    const dist2 = Math.sqrt((r - 3.5) ** 2 + (c - 6) ** 2);
    if (dist1 < 3.5 && dist2 > 2.5) g[r][c] = dist1 < 2 ? 2 : 1;
  }
  return g;
}

// === Level 52: Planet ===
function createPlanet(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dist = Math.sqrt((r - 4) ** 2 + (c - 5) ** 2);
    if (dist < 2.5) g[r][c] = dist < 1.5 ? 3 : 2;
    if (r === 3 && c >= 2 && c <= 8) g[r][c] = 1;
  }
  return g;
}

// === Level 53: Castle ===
function createCastle(): number[][] {
  return [
    [2,0,2,0,0,0,0,2,0,2],
    [2,0,2,0,0,0,0,2,0,2],
    [2,2,2,1,1,1,1,2,2,2],
    [2,2,2,1,0,0,1,2,2,2],
    [2,2,2,1,0,0,1,2,2,2],
    [2,2,2,1,1,1,1,2,2,2],
    [2,2,2,2,2,2,2,2,2,2],
    [0,0,0,0,1,1,0,0,0,0],
  ];
}

// === Level 55: Cathedral ===
function createCathedral(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,1,2,2,2,2,1,0,0],
    [0,1,1,2,2,2,2,1,1,0],
    [1,1,1,2,2,2,2,1,1,1],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,0,0,1,1,0,0],
  ];
}

// === Level 56: Temple ===
function createTemple(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,2,2,2,2,1,1,0],
    [1,1,2,2,2,2,2,2,1,1],
    [1,2,2,2,2,2,2,2,2,1],
  ];
}

// === Level 57: Lab ===
function createLaboratory(): number[][] {
  return [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

// === Level 58: DNA ===
function createDNA(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) {
    const w1 = Math.round(4.5 + Math.sin(r * 1.2) * 2.5);
    const w2 = Math.round(4.5 - Math.sin(r * 1.2) * 2.5);
    if (w1 >= 0 && w1 < 10) g[r][w1] = 2;
    if (w2 >= 0 && w2 < 10) g[r][w2] = 2;
    if (r % 2 === 0) {
      const minC = Math.min(w1, w2);
      const maxC = Math.max(w1, w2);
      for (let c = minC + 1; c < maxC; c++) {
        if (c >= 0 && c < 10) g[r][c] = 1;
      }
    }
  }
  return g;
}

// === Level 59: Robot ===
function createRobot(): number[][] {
  return [
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,0,1,1,1,1,0,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,0,0,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,0,1,0,0,1,0,1,0],
  ];
}

// === Level 61: Cat ===
function createCat(): number[][] {
  return [
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,0,1,1,1],
    [1,0,1,1,0,0,1,1,0,1],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

// === Level 62: Dog ===
function createDog(): number[][] {
  return [
    [0,1,1,0,0,0,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,0,0,0,0,1,0,0],
  ];
}

// === Level 63: Bird ===
function createBird(): number[][] {
  return [
    [0,0,0,0,0,0,0,1,1,0],
    [0,0,0,0,0,0,1,1,0,0],
    [1,0,0,0,0,1,1,0,0,0],
    [1,1,0,0,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,0,0,0,0],
  ];
}

// === Level 64: Fish ===
function createFish(): number[][] {
  return [
    [0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,1,2,1,1,0],
    [1,1,1,1,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,0],
    [1,2,2,2,2,2,2,1,1,1],
    [1,1,1,1,1,1,2,1,1,0],
    [0,0,0,0,0,1,2,1,1,0],
    [0,0,0,0,0,0,1,1,0,0],
  ];
}

// === Level 65: Whale ===
function createWhale(): number[][] {
  return [
    [0,0,0,0,0,0,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,2,2,2,2,1,1],
    [1,2,2,1,2,2,2,2,1,1],
    [1,2,2,2,2,2,2,1,1,0],
    [1,1,2,2,2,2,1,1,0,0],
    [0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
}

// === Level 67: Mushroom ===
function createMushroom(): number[][] {
  return [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,2,1,2,2,1,2,1,0],
    [1,2,1,2,1,1,2,1,2,1],
    [1,1,2,1,2,2,1,2,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
  ];
}

// === Level 68: Flower ===
function createFlower(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dx = c - 4.5;
    const dy = r - 3.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const petalR = 1.8 + Math.cos(angle * 4) * 0.8;
    if (dist < petalR && dist > 0.5) g[r][c] = 1;
    if (dist < 1) g[r][c] = 3;
  }
  return g;
}

// === Level 69: Leaf ===
function createLeaf(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dx = (c - 5) / 4;
    const dy = (r - 4) / 3;
    const val = dx * dx + dy * dy + dx * dy * 0.5;
    if (val < 1) {
      g[r][c] = (c === Math.round(5 - r * 0.5) || r === c) ? 2 : 1;
    }
  }
  return g;
}

// === Level 70: Cactus ===
function createCactus(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,1,0,0,1,1,0,0,1,0],
    [0,1,0,0,1,1,0,0,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ];
}

// === Level 71: Bamboo ===
function createBamboo(): number[][] {
  const g = empty();
  for (let c = 1; c < 10; c += 2) {
    for (let r = 0; r < 8; r++) {
      g[r][c] = r % 3 === 0 ? 2 : 1;
    }
  }
  return g;
}

// === Level 73: Anchor ===
function createAnchor(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,0,0,1,1,1,1,0,0,1],
    [0,0,1,1,0,0,1,1,0,0],
  ];
}

// === Level 74: Compass ===
function createCompass(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dist = Math.sqrt((r - 3.5) ** 2 + (c - 4.5) ** 2);
    if (dist < 3.5 && dist > 2.5) g[r][c] = 1;
    if ((r < 2 && Math.abs(c - 4.5) < 1) ||
        (r > 5 && Math.abs(c - 4.5) < 1) ||
        (c < 2 && Math.abs(r - 3.5) < 1) ||
        (c > 7 && Math.abs(r - 3.5) < 1)) g[r][c] = 2;
  }
  return g;
}

// === Level 75: Ship ===
function createShip(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,0,1,2,1,0,0,0],
    [0,0,0,0,1,2,2,1,0,0],
    [0,0,0,1,1,2,2,2,1,0],
    [0,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,0,1,0,0,0,1,0,0],
  ];
}

// === Level 76: Lighthouse ===
function createLighthouse(): number[][] {
  return [
    [0,0,0,3,3,3,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,0,1,2,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,1,1,2,1,1,0,0,0],
    [0,1,1,1,2,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,0],
  ];
}

// === Level 77: Wave Wall ===
function createWaveWall(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    if (c < 2 || c > 7) g[r][c] = -1;
    else {
      const wave = Math.round(Math.sin(c * 1.2) * 1 + 3);
      if (Math.abs(r - wave) <= 1) g[r][c] = 1;
    }
  }
  return g;
}

// === Level 79: Mountains ===
function createMountains(): number[][] {
  return [
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,1,2,1,0,0,1,0],
    [0,0,1,2,3,2,1,1,2,1],
    [0,1,2,3,3,3,2,2,3,2],
    [1,2,3,3,3,3,3,3,3,3],
    [2,3,3,3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3,3,3,3],
    [2,2,2,2,2,2,2,2,2,2],
  ];
}

// === Level 80: Volcano ===
function createVolcano(): number[][] {
  return [
    [0,0,0,0,3,3,0,0,0,0],
    [0,0,0,3,2,2,3,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,1,1,2,2,2,2,1,1,0],
    [1,1,2,2,2,2,2,2,1,1],
    [2,2,2,2,2,2,2,2,2,2],
    [2,3,3,3,3,3,3,3,3,2],
    [3,3,3,3,3,3,3,3,3,3],
  ];
}

// === Level 81: Canyon ===
function createCanyon(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    if (c < 3 || c > 6) g[r][c] = r < 3 ? 1 : r < 5 ? 2 : 3;
    if ((c === 3 || c === 6) && r > 1) g[r][c] = 2;
  }
  return g;
}

// === Level 82: Waterfall ===
function createWaterfall(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    if (c >= 4 && c <= 5) g[r][c] = r < 2 ? 3 : r < 5 ? 2 : 1;
    if (r === 3 && (c < 4 || c > 5)) g[r][c] = 1;
    if (r === 6 && (c >= 3 && c <= 6)) g[r][c] = 1;
  }
  return g;
}

// === Level 83: Desert ===
function createDesert(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const wave = Math.round(Math.sin(c * 0.7 + r * 0.3) * 1.5 + r);
    if (wave >= 0 && wave < 8 && Math.abs(r - wave) < 1) g[r][c] = 1;
  }
  return g;
}

// === Level 85: Cityscape ===
function createCityscape(): number[][] {
  return [
    [1,0,1,1,0,0,1,0,1,1],
    [1,0,1,1,0,0,1,0,1,1],
    [1,0,1,1,2,0,1,0,1,1],
    [1,2,1,1,2,2,1,2,1,1],
    [1,2,1,1,2,2,1,2,1,1],
    [1,2,1,1,2,2,1,2,1,1],
    [1,2,1,1,2,2,1,2,1,1],
    [1,2,1,1,2,2,1,2,1,1],
  ];
}

// === Level 86: Skyscraper ===
function createSkyscraper(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,0,1,2,2,2,2,1,0,0],
    [0,1,1,2,2,2,2,1,1,0],
    [0,1,2,2,2,2,2,2,1,0],
    [1,1,2,2,2,2,2,2,1,1],
  ];
}

// === Level 87: Bridge ===
function createBridge(): number[][] {
  return [
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,1,1],
    [0,1,1,0,0,0,0,1,1,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
  ];
}

// === Level 88: Tower ===
function createTower(): number[][] {
  return [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,0,1,2,2,1,0,0,0],
    [0,0,1,1,2,2,1,1,0,0],
    [0,1,1,1,2,2,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
  ];
}

// === Level 89: Obelisk ===
function createObelisk(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) {
    const w = Math.max(1, Math.floor(2 - r / 4));
    const off = 5 - Math.ceil(w / 2);
    for (let c = off; c < off + w && c < 10; c++) {
      if (c >= 0) g[r][c] = r < 1 ? 3 : r < 3 ? 2 : 1;
    }
  }
  g[7][4] = 2; g[7][5] = 2;
  return g;
}

// === Level 91: Circuit ===
function createCircuit(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    if (r % 2 === 0 || c % 2 === 0) g[r][c] = 1;
  }
  g[0][0] = 2; g[0][9] = 2; g[7][0] = 2; g[7][9] = 2;
  g[3][4] = 3; g[4][5] = 3;
  return g;
}

// === Level 92: Binary ===
function createBinary(): number[][] {
  return [
    [0,1,1,0,0,1,0,1,1,0],
    [1,0,0,1,1,0,1,0,0,1],
    [0,1,0,1,0,1,0,1,0,1],
    [1,1,1,0,1,0,1,0,1,1],
    [0,0,1,1,1,1,0,1,0,0],
    [1,0,0,0,1,1,1,0,1,0],
    [0,1,1,1,0,0,1,1,0,1],
    [1,0,1,0,1,0,0,1,1,0],
  ];
}

// === Level 93: Hexagon ===
function createHexagon(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const dx = Math.abs(c - 4.5);
    const dy = Math.abs(r - 3.5);
    if (dx + dy < 4) g[r][c] = 1;
    if (dx + dy < 2.5) g[r][c] = 2;
    if (dx + dy < 1) g[r][c] = 3;
  }
  return g;
}

// === Level 94: Pixel Face ===
function createPixelFace(): number[][] {
  return [
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,0,0,0,1,1,0],
  ];
}

// === Level 95: Controller ===
function createController(): number[][] {
  return [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,1,1,0,1,1,1],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,0,0],
  ];
}

// === Level 97: Chaos ===
function createChaos(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const v = (r * 7 + c * 13 + 3) % 10;
    if (v < 6) g[r][c] = v < 2 ? 3 : v < 4 ? 2 : 1;
  }
  return g;
}

// === Level 98: Minimal ===
function createMinimal(): number[][] {
  const g = empty();
  g[1][2] = 2; g[1][7] = 2;
  g[3][4] = 3; g[3][5] = 3;
  g[5][1] = 2; g[5][8] = 2;
  g[0][0] = 1; g[0][9] = 1;
  g[7][0] = 1; g[7][9] = 1;
  return g;
}

// === Level 99: Infinity Loop ===
function createInfinityLoop(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const x = (c - 4.5) / 3.5;
    const y = (r - 3.5) / 2.5;
    const val = (x * x + y * y + 1) ** 2 - 4 * x * x;
    if (val > -0.5 && val < 2) g[r][c] = 1;
    if (val > 0.3 && val < 1.2) g[r][c] = 2;
  }
  return g;
}

// === Level 100: The End ===
function createTheEnd(): number[][] {
  const g = empty();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) {
    const x = (c - 4.5) / 4.5;
    const y = (3.5 - r) / 3.5;
    if (Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y < 0) {
      g[r][c] = 3;
    }
    if ((r === 0 && (c === 0 || c === 9)) ||
        (r === 1 && (c === 1 || c === 8)) ||
        (r === 7 && (c === 0 || c === 9)) ||
        (r === 6 && (c === 1 || c === 8))) {
      g[r][c] = 2;
    }
  }
  return g;
}

export const LEVELS: Level[] = [
  { name: 'The Classic', bricks: createSpaceInvader(), ballSpeed: 5, powerUpChance: 0.1 },
  { name: 'Smiley Face', bricks: createSmiley(), ballSpeed: 5.2, powerUpChance: 0.1 },
  { name: 'The Cross', bricks: createCross(), ballSpeed: 5.4, powerUpChance: 0.12 },
  { name: 'Spiral', bricks: createSpiral(), ballSpeed: 5.6, powerUpChance: 0.12 },
  { name: 'BOSS: Warden', bricks: [], ballSpeed: 5.8, powerUpChance: 0.2, isBoss: true },
  { name: 'Fortress', bricks: createFortress(), ballSpeed: 5.8, powerUpChance: 0.14 },
  { name: 'Snake', bricks: createSnake(), ballSpeed: 6, powerUpChance: 0.14 },
  { name: 'Tornado', bricks: createTornado(), ballSpeed: 6.2, powerUpChance: 0.15 },
  { name: 'Alien Ship', bricks: createAlienShip(), ballSpeed: 6.4, powerUpChance: 0.15 },
  { name: 'BOSS: Pendulum', bricks: [], ballSpeed: 6.6, powerUpChance: 0.2, isBoss: true },
  { name: 'Maze', bricks: createMaze(), ballSpeed: 6.6, powerUpChance: 0.16 },
  { name: 'Diamond Core', bricks: createDiamondDouble(), ballSpeed: 6.8, powerUpChance: 0.16 },
  { name: 'The Tree', bricks: createTree(), ballSpeed: 7, powerUpChance: 0.17 },
  { name: 'Galaga', bricks: createGalagaShip(), ballSpeed: 7.2, powerUpChance: 0.17 },
  { name: 'BOSS: Orbiter', bricks: [], ballSpeed: 7.4, powerUpChance: 0.22, isBoss: true },
  { name: 'Zigzag', bricks: createZigzag(), ballSpeed: 7.4, powerUpChance: 0.18 },
  { name: 'Cascade', bricks: createInvertedPyramid(), ballSpeed: 7.6, powerUpChance: 0.18 },
  { name: 'Donut', bricks: createDonut(), ballSpeed: 7.8, powerUpChance: 0.19 },
  { name: 'Love', bricks: createHeartBig(), ballSpeed: 8, powerUpChance: 0.19 },
  { name: 'BOSS: Phantom', bricks: [], ballSpeed: 8.2, powerUpChance: 0.22, isBoss: true },
  { name: 'Alien Boss', bricks: createSpaceInvader2(), ballSpeed: 8.2, powerUpChance: 0.2 },
  { name: 'The Wall', bricks: createFullGrid3Hit(), ballSpeed: 8.4, powerUpChance: 0.2 },
  { name: 'Arrow Up', bricks: createArrowUp(), ballSpeed: 8.4, powerUpChance: 0.2 },
  { name: 'Double Diamond', bricks: createDoubleDiamond(), ballSpeed: 8.6, powerUpChance: 0.21 },
  { name: 'BOSS: Titan', bricks: [], ballSpeed: 8.6, powerUpChance: 0.24, isBoss: true },
  { name: 'Checkerboard', bricks: createCheckerboard(), ballSpeed: 8.6, powerUpChance: 0.21 },
  { name: 'Pac-Man', bricks: createPacMan(), ballSpeed: 8.7, powerUpChance: 0.22 },
  { name: 'Rocket Ship', bricks: createRocket(), ballSpeed: 8.8, powerUpChance: 0.22 },
  { name: 'Crown', bricks: createCrown(), ballSpeed: 8.8, powerUpChance: 0.23 },
  { name: 'BOSS: Colossus', bricks: [], ballSpeed: 9, powerUpChance: 0.24, isBoss: true },
  { name: 'Skull', bricks: createSkull(), ballSpeed: 9, powerUpChance: 0.23 },
  { name: 'Butterfly', bricks: createButterfly(), ballSpeed: 9, powerUpChance: 0.23 },
  { name: 'Columns', bricks: createColumns(), ballSpeed: 9.1, powerUpChance: 0.24 },
  { name: 'Pyramid', bricks: pyramid(), ballSpeed: 9.2, powerUpChance: 0.24 },
  { name: 'BOSS: Wraith', bricks: [], ballSpeed: 9.2, powerUpChance: 0.25, isBoss: true },
  { name: 'Inv Pyramid', bricks: createInvPyramid(), ballSpeed: 9.2, powerUpChance: 0.24 },
  { name: 'Vortex', bricks: createVortex(), ballSpeed: 9.3, powerUpChance: 0.25 },
  { name: 'Wave', bricks: createWave(), ballSpeed: 9.3, powerUpChance: 0.25 },
  { name: 'Grid Lock', bricks: full(2), ballSpeed: 9.4, powerUpChance: 0.25 },
  { name: 'BOSS: Overlord', bricks: [], ballSpeed: 9.4, powerUpChance: 0.26, isBoss: true },
  { name: 'Star', bricks: createStar(), ballSpeed: 9.4, powerUpChance: 0.25 },
  { name: 'Arrow Down', bricks: createArrowDown(), ballSpeed: 9.5, powerUpChance: 0.26 },
  { name: 'Helix', bricks: createHelix(), ballSpeed: 9.5, powerUpChance: 0.26 },
  { name: 'Cube', bricks: createCube(), ballSpeed: 9.5, powerUpChance: 0.26 },
  { name: 'BOSS: Inferno', bricks: [], ballSpeed: 9.6, powerUpChance: 0.27, isBoss: true },
  { name: 'Infinity', bricks: createInfinity(), ballSpeed: 9.6, powerUpChance: 0.26 },
  { name: 'Lightning', bricks: createLightning(), ballSpeed: 9.6, powerUpChance: 0.27 },
  { name: 'Flame', bricks: createFlame(), ballSpeed: 9.7, powerUpChance: 0.27 },
  { name: 'Ice Crystal', bricks: createIceCrystal(), ballSpeed: 9.7, powerUpChance: 0.27 },
  { name: 'BOSS: Frost', bricks: [], ballSpeed: 9.7, powerUpChance: 0.28, isBoss: true },
  { name: 'Sun', bricks: createSun(), ballSpeed: 9.7, powerUpChance: 0.27 },
  { name: 'Moon', bricks: createMoon(), ballSpeed: 9.8, powerUpChance: 0.28 },
  { name: 'Planet', bricks: createPlanet(), ballSpeed: 9.8, powerUpChance: 0.28 },
  { name: 'Castle', bricks: createCastle(), ballSpeed: 9.8, powerUpChance: 0.28 },
  { name: 'BOSS: Guardian', bricks: [], ballSpeed: 9.8, powerUpChance: 0.28, isBoss: true },
  { name: 'Cathedral', bricks: createCathedral(), ballSpeed: 9.8, powerUpChance: 0.28 },
  { name: 'Temple', bricks: createTemple(), ballSpeed: 9.8, powerUpChance: 0.28 },
  { name: 'Laboratory', bricks: createLaboratory(), ballSpeed: 9.8, powerUpChance: 0.29 },
  { name: 'DNA', bricks: createDNA(), ballSpeed: 9.8, powerUpChance: 0.29 },
  { name: 'BOSS: Machina', bricks: [], ballSpeed: 9.9, powerUpChance: 0.29, isBoss: true },
  { name: 'Robot', bricks: createRobot(), ballSpeed: 9.9, powerUpChance: 0.29 },
  { name: 'Cat', bricks: createCat(), ballSpeed: 9.9, powerUpChance: 0.29 },
  { name: 'Dog', bricks: createDog(), ballSpeed: 9.9, powerUpChance: 0.29 },
  { name: 'Bird', bricks: createBird(), ballSpeed: 9.9, powerUpChance: 0.29 },
  { name: 'BOSS: Leviathan', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Fish', bricks: createFish(), ballSpeed: 10, powerUpChance: 0.29 },
  { name: 'Whale', bricks: createWhale(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Mushroom', bricks: createMushroom(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Flower', bricks: createFlower(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Overgrowth', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Leaf', bricks: createLeaf(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Cactus', bricks: createCactus(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Bamboo', bricks: createBamboo(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Anchor', bricks: createAnchor(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Tempest', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Compass', bricks: createCompass(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Ship', bricks: createShip(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Lighthouse', bricks: createLighthouse(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Wave Wall', bricks: createWaveWall(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Abyss', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Mountains', bricks: createMountains(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Volcano', bricks: createVolcano(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Canyon', bricks: createCanyon(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Waterfall', bricks: createWaterfall(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Sandstorm', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Desert', bricks: createDesert(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Cityscape', bricks: createCityscape(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Skyscraper', bricks: createSkyscraper(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Bridge', bricks: createBridge(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Monolith', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Tower', bricks: createTower(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Obelisk', bricks: createObelisk(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Circuit', bricks: createCircuit(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Binary', bricks: createBinary(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Cortex', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
  { name: 'Hexagon', bricks: createHexagon(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Pixel Face', bricks: createPixelFace(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Controller', bricks: createController(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'Chaos', bricks: createChaos(), ballSpeed: 10, powerUpChance: 0.3 },
  { name: 'BOSS: Entropy', bricks: [], ballSpeed: 10, powerUpChance: 0.3, isBoss: true },
];

export const COLORS = {
  background: '#0A090F',
  paddle: '#5542FF',
  ball: '#EFEFE6',
  ui: '#EFEFE6',
  brickColors: ROW_COLORS,
  indestructible: '#6B7280',
  powerUp: '#F59E0B',
  explosive: '#FF6B35',
  laser: '#FF3366',
  boss: '#FF0044',
  bossSegment: '#CC0033',
};
