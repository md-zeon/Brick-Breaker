'use client';

import { LEVELS } from '@/lib/game/levels';

interface LevelSelectProps {
  onSelect: (level: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ onSelect, onBack }: LevelSelectProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-6">SELECT LEVEL</h2>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {LEVELS.map((lvl, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className="w-12 h-12 bg-gray-700 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors text-sm"
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
