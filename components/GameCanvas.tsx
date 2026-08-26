'use client';

import { useEffect, useRef, useState } from 'react';
import { GameData } from '@/lib/game/types';
import {
  createGameData,
  startGame,
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    gameDataRef.current = createGameData(CANVAS_WIDTH, CANVAS_HEIGHT);
    setState(gameDataRef.current.state);
    setHighScore(gameDataRef.current.highScore);

    const syncUI = (data: GameData) => {
      setState(data.state);
      setScore(data.score);
      setLives(data.lives);
      setLevel(data.level);
      setHighScore(data.highScore);
    };

    const loop = () => {
      const data = gameDataRef.current;
      if (!data) return;

      if (data.state === 'playing' && keysRef.current.left) {
        mouseXRef.current = Math.max(0, mouseXRef.current - 8);
      }
      if (data.state === 'playing' && keysRef.current.right) {
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

      if (e.code === 'Space' && data.state === 'playing') {
        e.preventDefault();
        if (data.ball.stuck) launchBall(data.ball);
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (data.state === 'playing') data.state = 'paused';
        else if (data.state === 'paused') data.state = 'playing';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
    };

    const handlePointerDown = () => {
      const data = gameDataRef.current;
      if (!data) return;
      if (data.state === 'playing' && data.ball.stuck) {
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
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-lg"
        style={{ background: '#0A090F' }}
      />

      {state === 'menu' && (
        <MenuScreen
          highScore={highScore}
          onStart={handleStart}
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
        />
      )}

      {state === 'playing' && (
        <GameOverlay score={score} lives={lives} level={level} />
      )}

      {state === 'paused' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6">PAUSED</h2>
          <p className="text-gray-300 text-sm mb-4">Press P or ESC to resume</p>
          <button
            onClick={() => {
              const data = gameDataRef.current;
              if (data) data.state = 'playing';
            }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Resume
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
