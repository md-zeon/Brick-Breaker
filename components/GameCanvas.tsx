'use client';

import { useEffect, useRef, useState } from 'react';
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
  const gameDataRef = useRef<GameData | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseXRef = useRef<number>(CANVAS_WIDTH / 2);
  const keysRef = useRef({ left: false, right: false });

  const [state, setState] = useState<GameData['state']>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(0);
  const [endlessWave, setEndlessWave] = useState(0);

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

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      mouseXRef.current = (e.clientX - rect.left) * scaleX;
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

    const handlePointerDown = () => {
      const data = gameDataRef.current;
      if (!data) return;
      if ((data.state === 'playing' || data.state === 'endless') && data.ball.stuck) {
        launchBall(data.ball);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
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
    <div className="relative select-none" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        style={{ background: '#0A090F', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6">PAUSED</h2>
          <p className="text-gray-300 text-sm mb-4">Press P or ESC to resume · M to quit</p>
          <button
            onClick={() => {
              const data = gameDataRef.current;
              if (data) {
                data.lastTime = 0;
                data.state = data.endlessWave > 0 ? 'endless' : 'playing';
                setState(data.state);
              }
            }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mb-3"
          >
            Resume
          </button>
          <button
            onClick={() => {
              const data = gameDataRef.current;
              if (data) {
                data.state = 'menu';
                setState('menu');
              }
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Quit to Menu
          </button>
        </div>
      )}

      {state === 'gameover' && (
        <GameOverScreen score={score} highScore={highScore} onRestart={handleRestart} />
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
