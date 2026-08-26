'use client';

import { useState } from 'react';
import { LEVELS } from '@/lib/game/levels';

interface LevelSelectProps {
  onSelect: (level: number) => void;
  onBack: () => void;
}

const PAGE_SIZE = 50;

export default function LevelSelect({ onSelect, onBack }: LevelSelectProps) {
  const [page, setPage] = useState(0);
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, LEVELS.length);
  const visible = LEVELS.slice(start, end);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
      <div className="text-center w-full max-h-full overflow-hidden px-4 py-3">
        <h2 className="text-xl font-bold text-white mb-3">SELECT LEVEL</h2>

        {LEVELS.length > PAGE_SIZE && (
          <div className="flex justify-center gap-2 mb-3">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded text-sm transition-colors"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm self-center">
              {start + 1}–{end} of {LEVELS.length}
            </span>
            <button
              onClick={() => setPage(Math.min(Math.ceil(LEVELS.length / PAGE_SIZE) - 1, page + 1))}
              disabled={end >= LEVELS.length}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded text-sm transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        <div className="grid grid-cols-10 gap-1.5 mb-4 max-h-[340px] overflow-y-auto">
          {visible.map((lvl, i) => {
            const num = start + i + 1;
            const isBoss = lvl.isBoss;
            return (
              <button
                key={start + i}
                onClick={() => onSelect(start + i)}
                className={`w-11 h-11 font-bold rounded-lg transition-colors text-xs ${
                  isBoss
                    ? 'bg-red-700 hover:bg-red-600 text-white border border-red-400'
                    : 'bg-gray-700 hover:bg-purple-600 text-white'
                }`}
                title={lvl.name}
              >
                {num}
              </button>
            );
          })}
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
