# Brick Breaker — Implementation Plan

## Overview

A classic brick breaker / breakout game built with Canvas API. Control a paddle, bounce a ball, break all bricks. Levels, power-ups, and high scores. Pure client-side, no backend.

---

## Market Research

### Competitors

| Game                   | Strengths          | Weaknesses                   |
| ---------------------- | ------------------ | ---------------------------- |
| Breakout (Atari)       | Classic, addictive | Dated graphics, no power-ups |
| Arkanoid               | Power-ups, levels  | Complex, old                 |
| Brick Breaker (mobile) | Touch controls     | Ad-heavy, pay-to-win         |
| DX Ball                | Clean, fast        | Desktop only, dated          |
| Browser breakout games | Accessible         | Poor UI, no polish           |

### Opportunity

- No modern, well-designed brick breaker exists for web
- Most browser games are ad-heavy or poorly designed
- Canvas-based game shows creative coding skills

### Target Users

- Anyone wanting quick fun
- Portfolio visitors (shows game dev skills)
- Retro gaming fans

---

## UI/UX Design

### Game Screen

```
┌──────────────────────────────────────────────────┐
│  Score: 2,450    Level: 3    Lives: ♥♥♥         │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██         │    │
│  │  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██         │    │
│  │  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██         │    │
│  │  ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░         │    │
│  │                                          │    │
│  │                                          │    │
│  │                                          │    │
│  │                    ●                     │    │
│  │               ┌─────────┐               │    │
│  │               └─────────┘               │    │
│  │              ← paddle →                 │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [← →] Move Paddle    [SPACE] Launch Ball        │
└──────────────────────────────────────────────────┘
```

### Menu Screen

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│              BRICK BREAKER                       │
│              ─────────────                       │
│                                                  │
│         ██ ██ ██ ██ ██                           │
│                                                  │
│              [START GAME]                        │
│              [SELECT LEVEL]                      │
│                                                  │
│              High Score: 15,000                  │
│                                                  │
│         Controls:                                │
│         ← → or Mouse - Move Paddle               │
│         SPACE - Launch Ball                      │
│         P - Pause                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Level Complete Screen

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              LEVEL COMPLETE!                     │
│              ─────────────                       │
│                                                  │
│              Score: 2,450                        │
│              Time: 1:23                          │
│              Bricks: 42/42                       │
│                                                  │
│              [NEXT LEVEL]                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Color Palette

- Background: `#0A090F` (dark)
- Paddle: `#5542FF` (purple)
- Ball: `#EFEFE6` (white)
- Bricks by row:
  - Row 1-2: `#EF4444` (red)
  - Row 3-4: `#F59E0B` (orange)
  - Row 5-6: `#22C55E` (green)
  - Row 7-8: `#3B82F6` (blue)
- Power-ups: `#F59E0B` (gold)
- UI: `#EFEFE6` (off-white)

### Key Components

- `GameCanvas` — main canvas element
- `GameOverlay` — score, lives, level display
- `MenuScreen` — start menu
- `LevelSelect` — choose starting level
- `GameOverScreen` — final score, restart
- `LevelCompleteScreen` — transition between levels
- `PauseOverlay` — pause menu

---

## Tech Stack

| Layer       | Technology               |
| ----------- | ------------------------ |
| Framework   | Next.js 14 (App Router)  |
| Styling     | Tailwind CSS + shadcn/ui |
| Game Engine | HTML5 Canvas API         |
| State       | React state + refs       |
| Audio       | Web Audio API (optional) |
| Deployment  | Vercel                   |

---

## Input Handling

### Pointer Events (Mouse + Touch)

Use Pointer Events API for unified mouse and touch input:

```typescript
canvas.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  paddle.x = Math.max(0, Math.min(x - paddle.width/2, canvas.width - paddle.width));
});

canvas.addEventListener('pointerdown', (e) => {
  if (game.state === 'playing' && ball.stuck) {
    ball.launch();
  }
});
```

### Keyboard Controls

| Key | Action |
|-----|--------|
| ← → | Move paddle |
| SPACE | Launch ball / Start game |
| P | Pause/Resume |
| ESC | Pause (alternate) |

---

## Features

### MVP

- [x] Paddle movement (arrow keys + mouse)
- [x] Ball physics (bounce off walls, paddle, bricks)
- [x] Brick grid with different colors
- [x] Collision detection
- [x] Score tracking
- [x] Lives system (3 lives)
- [x] Game over screen
- [x] High score (localStorage)

### V1

- [ ] Multiple levels (increasing difficulty)
- [ ] Power-ups (wide paddle, multi-ball, slow ball, extra life)
- [ ] Particle effects on brick break
- [ ] Ball speed increases over time
- [ ] Start/pause menu
- [ ] Level complete screen

### V2 (Optional)

- [ ] Destructible brick types (1-hit, 2-hit, indestructible)
- [ ] Moving bricks
- [ ] Boss levels
- [ ] Sound effects
- [ ] Mobile touch controls
- [ ] Leaderboard (if backend added)

---

## File Structure

```
brick-breaker/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── GameCanvas.tsx         # Main canvas wrapper
│   ├── GameOverlay.tsx        # Score/lives/level HUD
│   ├── MenuScreen.tsx         # Start menu
│   ├── LevelSelect.tsx        # Level selection
│   ├── GameOverScreen.tsx     # Game over
│   ├── LevelCompleteScreen.tsx # Level transition
│   └── ui/
├── lib/
│   ├── game/
│   │   ├── engine.ts          # Game loop, update, render
│   │   ├── paddle.ts          # Paddle class
│   │   ├── ball.ts            # Ball class with physics
│   │   ├── bricks.ts          # Brick grid management
│   │   ├── collision.ts       # Collision detection
│   │   ├── particles.ts       # Break effects
│   │   ├── powerups.ts        # Power-up system
│   │   ├── levels.ts          # Level definitions
│   │   ├── audio.ts           # Sound manager
│   │   └── types.ts           # Game types/interfaces
│   └── hooks/
│       └── useGame.ts         # React hook for game state
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── PLAN.md
```

---

## Game Architecture

### Game Loop

```typescript
class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private paddle: Paddle;
  private ball: Ball;
  private bricks: Brick[][];
  private particles: Particle[];
  private powerups: Powerup[];
  private score: number;
  private lives: number;
  private level: number;
  private running: boolean;

  update(deltaTime: number) {
    // Update paddle position
    // Update ball position
    // Check ball-wall collision
    // Check ball-paddle collision
    // Check ball-brick collision
    // Update particles
    // Update power-ups
    // Check win/lose conditions
  }

  render() {
    // Clear canvas
    // Draw bricks
    // Draw paddle
    // Draw ball
    // Draw particles
    // Draw power-ups
    // Draw UI
  }

  loop(timestamp: number) {
    const deltaTime = timestamp - this.lastTime;
    this.update(deltaTime);
    this.render();
    this.lastTime = timestamp;
    if (this.running) requestAnimationFrame(this.loop);
  }
}
```

### Ball Physics

```typescript
class Ball {
  x: number;
  y: number;
  dx: number; // velocity x
  dy: number; // velocity y
  radius: number;
  speed: number;
  stuck: boolean; // true when ball is on paddle before launch

  update(deltaTime: number) {
    if (this.stuck) return;
    this.x += this.dx * deltaTime;
    this.y += this.dy * deltaTime;
  }

  bounceOffPaddle(paddle: Paddle) {
    // Calculate angle based on where ball hits paddle
    // Center hit = vertical, edge hit = angled
    const hitPoint = (this.x - paddle.x) / paddle.width;
    const angle = (hitPoint * Math.PI) / 3 - Math.PI / 6; // -30 to +30 degrees
    
    // Clamp angle to prevent near-horizontal bouncing
    const clampedAngle = Math.max(-Math.PI/3, Math.min(Math.PI/3, angle));
    
    this.dx = this.speed * Math.sin(clampedAngle);
    this.dy = -this.speed * Math.cos(clampedAngle);
    
    // Ensure minimum vertical velocity (40% of total speed)
    if (Math.abs(this.dy) < this.speed * 0.4) {
      this.dy = -this.speed * 0.4 * Math.sign(this.dy || -1);
    }
  }

  launch() {
    if (!this.stuck) return;
    this.stuck = false;
    // Launch at slight random angle
    const angle = (Math.random() - 0.5) * Math.PI / 6;
    this.dx = this.speed * Math.sin(angle);
    this.dy = -this.speed * Math.cos(angle);
  }
}
```

### Collision Detection

- **Ball-Wall**: Simple boundary check, reflect velocity component
- **Ball-Paddle**: AABB circle-rect collision with angle calculation based on hit position
- **Ball-Brick**: AABB with penetration resolution to prevent tunneling
- **Ball-Bottom**: lose life when ball center passes below canvas
- **Ball-Stuck**: If ball velocity ~0 for 3s, give it a random nudge

#### Preventing Tunneling

Fast ball can skip through thin bricks. Solution: use penetration depth to push ball out before reflecting velocity.

```typescript
function resolveCollision(ball: Ball, brick: Brick): boolean {
  // Find closest point on brick to ball center
  const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
  const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
  
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < ball.radius) {
    // Determine collision side by penetration depth
    const penetration = ball.radius - distance;
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Push ball out
    ball.x += nx * penetration;
    ball.y += ny * penetration;
    
    // Reflect velocity using dot product
    const dot = ball.dx * nx + ball.dy * ny;
    ball.dx -= 2 * dot * nx;
    ball.dy -= 2 * dot * ny;
    
    return true;
  }
  return false;
}
```

#### Multiple Collisions Per Frame

If ball hits multiple bricks in one frame, process closest collision first, then recurse with remaining time:

```typescript
function updateBallWithCollisions(ball: Ball, bricks: Brick[], dt: number) {
  const collisions = findCollisions(ball, bricks, dt);
  if (collisions.length === 0) {
    ball.move(dt);
    return;
  }
  
  const closest = collisions[0];
  ball.moveTo(closest.point);
  reflectVelocity(ball, closest.normal);
  
  const remainingTime = dt * (1 - closest.timeFraction);
  updateBallWithCollisions(ball, bricks, remainingTime);
}
```

### Level System

```typescript
const LEVELS = [
  {
    name: "Level 1",
    bricks: [
      // 10x5 grid, all 1-hit bricks
    ],
    ballSpeed: 5,
    powerUpChance: 0.1,
  },
  {
    name: "Level 2",
    bricks: [
      // 10x6 grid, mix of 1-hit and 2-hit bricks
    ],
    ballSpeed: 6,
    powerUpChance: 0.15,
  },
  // ... more levels
];
```

### Level Design Templates

| Level | Layout | Bricks | Special |
|-------|--------|--------|---------|
| 1 | Full grid | 50 (10x5) | All 1-hit |
| 2 | Checkerboard | 25 | All 1-hit |
| 3 | Diamond | 21 | Mix 1-hit/2-hit |
| 4 | Pyramid | 15 | 2-hit top row |
| 5 | Heart shape | 28 | Mix |
| 6 | X pattern | 20 | 2-hit on edges |
| 7 | Waves | 40 | 3-hit center |
| 8 | Castle | 35 | Indestructible walls |
| 9 | Arrow | 18 | Fast ball |
| 10 | Full grid | 60 | All 2-hit |

### Brick Types

| Type | Hits | Color | Points |
|------|------|-------|--------|
| Normal | 1 | Row color | 10 |
| Tough | 2 | Darker shade | 20 |
| Strong | 3 | Darkest shade | 30 |
| Indestructible | ∞ | Gray | 0 |

### Power-up System

- **Wide Paddle**: Increases paddle width for 10 seconds
- **Multi-Ball**: Splits ball into 3
- **Slow Ball**: Reduces ball speed for 10 seconds
- **Extra Life**: +1 life
- **Sticky Paddle**: Ball sticks to paddle on hit

### Power-up Spawn

- Power-up drops when specific brick colors break
- Fall at constant speed, caught by paddle
- Only one active power-up at a time (except Extra Life)
- Visual indicator shows remaining duration

---

## Audio System

### Web Audio API Setup

```typescript
class AudioManager {
  private ctx: AudioContext;
  private sounds: Map<string, AudioBuffer>;
  
  constructor() {
    this.ctx = new AudioContext();
  }
  
  play(soundName: string) {
    const buffer = this.sounds.get(soundName);
    if (!buffer) return;
    
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.ctx.destination);
    source.start();
  }
}
```

### Sound Effects

| Sound | Trigger | Description |
|-------|---------|-------------|
| Hit | Ball hits brick | Short pop |
| Bounce | Ball hits paddle/wall | Soft thud |
| Break | Brick destroyed | Crunch |
| Powerup | Catch power-up | Chime |
| Lose | Ball lost | Descending tone |
| Level | Level complete | Victory fanfare |
| Game Over | No lives left | Sad tone |

### Audio Best Practices

- Use short, compressed audio files (< 50KB each)
- Pre-load all sounds during menu screen
- Resume AudioContext on first user interaction (browser policy)
- Provide mute toggle in pause menu

---

## API Routes

None — pure client-side game.

---

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy
4. Environment variables: None

---

## Game States

```
MENU → PLAYING ↔ PAUSED → GAME_OVER
  ↓                           ↓
LEVEL_SELECT            RESTART → MENU
  ↓
PLAYING → LEVEL_COMPLETE → PLAYING
```

### State Transitions
| From | To | Trigger |
|------|----|---------|
| MENU | PLAYING | Click START GAME |
| MENU | LEVEL_SELECT | Click SELECT LEVEL |
| PLAYING | PAUSED | Press P or ESC |
| PAUSED | PLAYING | Press P or ESC |
| PLAYING | GAME_OVER | Lives = 0 |
| GAME_OVER | MENU | Click RESTART |
| PLAYING | LEVEL_COMPLETE | All bricks destroyed |
| LEVEL_COMPLETE | PLAYING | Click NEXT LEVEL |
| LEVEL_SELECT | PLAYING | Select level |

---

## Performance Considerations

- **Object Pooling**: Reuse particle objects instead of creating/destroying
- **Canvas Optimization**: Only redraw dirty regions when possible
- **requestAnimationFrame**: Use for smooth 60 FPS rendering
- **Delta Time**: Frame-rate independent movement
- **Minimize Allocations**: Avoid creating objects in game loop to prevent GC pauses
- **Batch Similar Draws**: Group brick draws by color to reduce state changes

### Object Pool Pattern

```typescript
class ParticlePool {
  private pool: Particle[] = [];
  
  acquire(): Particle {
    return this.pool.pop() || new Particle();
  }
  
  release(particle: Particle) {
    particle.reset();
    this.pool.push(particle);
  }
  
  releaseAll(particles: Particle[]) {
    particles.forEach(p => this.release(p));
  }
}
```

### Frame Budget

Target 16.7ms per frame (60 FPS):
- Game logic: 4-6ms
- Rendering: 4-6ms  
- GPU work: 2-4ms
- Headroom: 2-6ms

### Garbage Collection Avoidance

- Pre-allocate arrays for collision results
- Reuse vector objects for positions/velocities
- Avoid string concatenation in hot paths
- Use object pools for particles and power-ups

### Memory Management

- Remove off-screen particles immediately
- Clear particle arrays when level completes
- Limit max particles (e.g., 200) to prevent memory growth
- Use WeakMap for temporary collision data

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 14+ | Full |
| Edge 90+ | Full |
| Mobile Safari | V2 touch controls |
| Mobile Chrome | V2 touch controls |

---

## Responsive Design

- Canvas scales to fit viewport while maintaining 16:9 aspect ratio
- Min width: 480px, Max width: 1200px
- Paddle and brick sizes scale proportionally
- UI text scales with canvas

### High DPI Canvas Setup

Handle Retina/high-DPI displays for crisp rendering:

```typescript
function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  // Store logical dimensions for game logic
  return { width: rect.width, height: rect.height };
}
```

### Window Resize Handling

```typescript
window.addEventListener('resize', () => {
  const dims = setupCanvas(canvas);
  game.resize(dims.width, dims.height);
});
```

---

## Error Handling

- **localStorage unavailable**: Game works without high scores
- **Canvas not supported**: Show fallback message
- **Performance issues**: Reduce particle count on low-end devices

---

## Testing Strategy

- Manual testing across browsers
- Verify 60 FPS in Chrome DevTools
- Test localStorage persistence
- Validate collision detection edge cases
- Responsive layout testing

---

## Accessibility

- Keyboard navigation for all menus
- High contrast UI elements
- Screen reader announcements for game events (V2)

---

## Success Metrics

- 60 FPS gameplay
- Smooth paddle following mouse
- Ball physics feel natural
- No collision bugs
- High score persists between sessions
- Works on Chrome, Firefox, Safari, Edge
- Canvas scales responsively
- No memory leaks from particles/power-ups
