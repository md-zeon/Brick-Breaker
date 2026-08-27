'use client';

import { useState } from 'react';
import { LEVELS } from '@/lib/game/levels';

interface LevelSelectProps {
  onSelect: (level: number) => void;
  onBack: () => void;
  maxUnlockedLevel: number;
}

const PAGE_SIZE = 50;

export default function LevelSelect({ onSelect, onBack, maxUnlockedLevel }: LevelSelectProps) {
  const initialPage = Math.floor(maxUnlockedLevel / PAGE_SIZE);
  const [page, setPage] = useState(initialPage);
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, LEVELS.length);
  const visible = LEVELS.slice(start, end);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg overflow-hidden">
      <div className="text-center w-full max-h-full overflow-hidden px-2 sm:px-4 py-2 sm:py-3">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">SELECT LEVEL</h2>

        {LEVELS.length > PAGE_SIZE && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-2 sm:px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded text-xs sm:text-sm transition-colors"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-xs sm:text-sm self-center">
              {start + 1}–{end} of {LEVELS.length}
            </span>
            <button
              onClick={() => setPage(Math.min(Math.ceil(LEVELS.length / PAGE_SIZE) - 1, page + 1))}
              disabled={end >= LEVELS.length}
              className="px-2 sm:px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded text-xs sm:text-sm transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 sm:gap-1.5 mb-3 sm:mb-4 max-h-[280px] sm:max-h-[340px] overflow-y-auto">
          {visible.map((lvl, i) => {
            const idx = start + i;
            const num = idx + 1;
            const isBoss = lvl.isBoss;
            const isLocked = idx > maxUnlockedLevel;
            const isCurrent = idx === maxUnlockedLevel;
            return (
              <button
                key={idx}
                onClick={() => !isLocked && onSelect(idx)}
                disabled={isLocked}
                className={`w-9 h-9 sm:w-11 sm:h-11 font-bold rounded-lg transition-all text-[10px] sm:text-xs ${
                  isLocked
                    ? 'bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800'
                    : isCurrent
                      ? isBoss
                        ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)] scale-110'
                        : 'bg-purple-600 hover:bg-purple-500 text-white border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)] scale-110'
                      : isBoss
                        ? 'bg-red-700 hover:bg-red-600 text-white border border-red-400'
                        : 'bg-gray-700 hover:bg-purple-600 text-white'
                }`}
                title={isLocked ? 'Locked' : lvl.name}
              >
                {isLocked ? '🔒' : num}
              </button>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
