'use client';

import { LEVELS } from '@/lib/game/levels';

interface LevelCompleteScreenProps {
  score: number;
  level: number;
  onNext: () => void;
}

export default function LevelCompleteScreen({ score, level, onNext }: LevelCompleteScreenProps) {
  const isLastLevel = level >= LEVELS.length - 1;
  const levelName = LEVELS[level]?.name || '';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg overflow-hidden">
      <div className="text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-1 sm:mb-2">LEVEL COMPLETE!</h2>

        <p className="text-gray-400 text-xs sm:text-sm mb-1">Level {level + 1}{levelName ? ` — ${levelName}` : ''}</p>
        <p className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{score.toLocaleString()}</p>

        <button
          onClick={onNext}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-600/20 text-sm sm:text-base"
        >
          {isLastLevel ? 'BACK TO MENU' : 'NEXT LEVEL'}
        </button>
      </div>
    </div>
  );
}
