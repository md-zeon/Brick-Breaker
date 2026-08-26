'use client';

import { LEVELS } from '@/lib/game/levels';

interface LevelCompleteScreenProps {
  score: number;
  level: number;
  onNext: () => void;
}

export default function LevelCompleteScreen({ score, level, onNext }: LevelCompleteScreenProps) {
  const isLastLevel = level >= LEVELS.length - 1;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-500 mb-4">LEVEL COMPLETE!</h2>

        <p className="text-gray-400 text-sm mb-1">Level {level + 1}</p>
        <p className="text-2xl font-bold text-white mb-6">{score.toLocaleString()}</p>

        <button
          onClick={onNext}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          {isLastLevel ? 'BACK TO MENU' : 'NEXT LEVEL'}
        </button>
      </div>
    </div>
  );
}
