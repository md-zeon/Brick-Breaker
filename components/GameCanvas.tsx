'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameData } from '@/lib/game/types';
import {
  createGameData,
  startGame,
  startEndless,
  selectLevel,
  updateGame,
  renderGame,
} from '@/lib/game/engine';
import { launchBall } from '@/lib/game/ball';
import { LEVELS } from '@/lib/game/levels';
import MenuScreen from './MenuScreen';
import GameOverlay from './GameOverlay';
import GameOverScreen from './GameOverScreen';
import LevelCompleteScreen from './LevelCompleteScreen';
import LevelSelect from './LevelSelect';

const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 520;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameDataRef = useRef<GameData | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseXRef = useRef<number>(CANVAS_WIDTH / 2);
  const keysRef = useRef({ left: false, right: false });
  const touchStartXRef = useRef<number | null>(null);
  const touchPaddleXRef = useRef<number>(CANVAS_WIDTH / 2);

  const [state, setState] = useState<GameData['state']>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(0);
  const [endlessWave, setEndlessWave] = useState(0);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;
    const availW = parent.clientWidth - 16;
    const availH = parent.clientHeight - 16;
    const sx = availW / CANVAS_WIDTH;
    const sy = availH / CANVAS_HEIGHT;
    setScale(Math.min(sx, sy, 1));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', updateScale);
      vv.addEventListener('scroll', updateScale);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
      if (vv) {
        vv.removeEventListener('resize', updateScale);
        vv.removeEventListener('scroll', updateScale);
      }
    };
  }, [updateScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    gameDataRef.current = createGameData(CANVAS_WIDTH, CANVAS_HEIGHT);
    setState(gameDataRef.current.state);
    setHighScore(gameDataRef.current.highScore);
    setMaxUnlockedLevel(gameDataRef.current.maxUnlockedLevel);

    const syncUI = (data: GameData) => {
      setState(data.state);
      setScore(data.score);
      setLives(data.lives);
      setLevel(data.level);
      setHighScore(data.highScore);
      setMaxUnlockedLevel(data.maxUnlockedLevel);
      setEndlessWave(data.endlessWave);
    };

    const loop = () => {
      const data = gameDataRef.current;
      if (!data) return;

      if ((data.state === 'playing' || data.state === 'endless') && keysRef.current.left) {
        mouseXRef.current = Math.max(0, mouseXRef.current - 8);
      }
      if ((data.state === 'playing' || data.state === 'endless') && keysRef.current.right) {
        mouseXRef.current = Math.min(CANVAS_WIDTH, mouseXRef.current + 8);
      }

      updateGame(data, mouseXRef.current);
      renderGame(ctx, data);
      syncUI(data);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouseXRef.current = getCanvasX(e.clientX);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const data = gameDataRef.current;
      if (!data) return;

      if (e.pointerType === 'touch') {
        const canvasX = getCanvasX(e.clientX);
        touchStartXRef.current = canvasX;
        touchPaddleXRef.current = mouseXRef.current;
      }

      if ((data.state === 'playing' || data.state === 'endless') && data.ball.stuck) {
        launchBall(data.ball);
      }
    };

    const handlePointerUp = () => {
      touchStartXRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;

      const canvasX = getCanvasX(touch.clientX);

      if (touchStartXRef.current !== null) {
        const dx = canvasX - touchStartXRef.current;
        const newX = touchPaddleXRef.current + dx;
        mouseXRef.current = Math.max(0, Math.min(CANVAS_WIDTH, newX));
      } else {
        touchStartXRef.current = canvasX;
        touchPaddleXRef.current = mouseXRef.current;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const data = gameDataRef.current;
      if (!data) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;

      if (e.code === 'Space' && (data.state === 'playing' || data.state === 'endless')) {
        e.preventDefault();
        if (data.ball.stuck) launchBall(data.ball);
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (data.state === 'playing' || data.state === 'endless') data.state = 'paused';
        else if (data.state === 'paused') {
          data.lastTime = 0;
          data.state = data.endlessWave > 0 ? 'endless' : 'playing';
        }
      }
      if (e.code === 'KeyM' && data.state === 'paused') {
        data.state = 'menu';
        setState('menu');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleStart = () => {
    const data = gameDataRef.current;
    if (!data) return;
    startGame(data);
  };

  const handleStartEndless = () => {
    const data = gameDataRef.current;
    if (!data) return;
    startEndless(data);
  };

  const handleSelectLevel = (lvl: number) => {
    const data = gameDataRef.current;
    if (!data) return;
    selectLevel(data, lvl);
  };

  const handleNextLevel = () => {
    const data = gameDataRef.current;
    if (!data) return;
    const next = data.level + 1;
    if (next < LEVELS.length) {
      selectLevel(data, next);
    } else {
      data.state = 'menu';
      setState('menu');
    }
  };

  const handleRestart = () => {
    const data = gameDataRef.current;
    if (!data) return;
    data.state = 'menu';
    setState('menu');
  };

  return (
    <div ref={containerRef} className="relative select-none" style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale, maxWidth: '100vw', maxHeight: '100dvh' }}>
      <canvas
        ref={canvasRef}
        className="rounded-lg touch-none"
        style={{
          background: '#0A090F',
          width: CANVAS_WIDTH * scale,
          height: CANVAS_HEIGHT * scale,
        }}
      />

      {state === 'menu' && (
        <MenuScreen
          highScore={highScore}
          onStart={handleStart}
          onStartEndless={handleStartEndless}
          onLevelSelect={() => {
            const data = gameDataRef.current;
            if (data) data.state = 'levelselect';
            setState('levelselect');
          }}
        />
      )}

      {state === 'levelselect' && (
        <LevelSelect
          onSelect={handleSelectLevel}
          onBack={() => {
            const data = gameDataRef.current;
            if (data) data.state = 'menu';
            setState('menu');
          }}
          maxUnlockedLevel={maxUnlockedLevel}
        />
      )}

      {(state === 'playing' || state === 'endless') && (
        <GameOverlay
          score={score}
          lives={lives}
          level={level}
          wave={state === 'endless' ? endlessWave : undefined}
        />
      )}

      {state === 'paused' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">PAUSED</h2>
          <p className="text-gray-400 text-[10px] sm:text-xs mb-4 sm:mb-6">Press P or ESC to resume</p>
          <button
            onClick={() => {
              const data = gameDataRef.current;
              if (data) {
                data.lastTime = 0;
                data.state = data.endlessWave > 0 ? 'endless' : 'playing';
                setState(data.state);
              }
            }}
            className="block w-36 sm:w-44 mx-auto mb-2 sm:mb-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-600/20 text-sm sm:text-base"
          >
            RESUME
          </button>
          <button
            onClick={() => {
              const data = gameDataRef.current;
              if (data) {
                data.state = 'menu';
                setState('menu');
              }
            }}
            className="block w-36 sm:w-44 mx-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-semibold rounded-lg transition-all text-sm sm:text-base"
          >
            QUIT TO MENU
          </button>
        </div>
      )}

      {state === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
          onMenu={handleRestart}
        />
      )}

      {state === 'levelcomplete' && (
        <LevelCompleteScreen
          score={score}
          level={level}
          onNext={handleNextLevel}
        />
      )}
    </div>
  );
}
