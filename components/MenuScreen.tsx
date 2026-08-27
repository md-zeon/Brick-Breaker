'use client';

interface MenuScreenProps {
  highScore: number;
  onStart: () => void;
  onStartEndless: () => void;
  onLevelSelect: () => void;
}

export default function MenuScreen({ highScore, onStart, onStartEndless, onLevelSelect }: MenuScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg overflow-hidden">
      <div className="text-center w-full px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 tracking-wider">
          BRICK BREAKER
        </h1>
        <div className="flex justify-center gap-1 mb-4 sm:mb-8">
          {['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#5542FF'].map((c, i) => (
            <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>

        <button
          onClick={onStart}
          className="block w-40 sm:w-48 mx-auto mb-2 sm:mb-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-600/20 text-sm sm:text-base"
        >
          START GAME
        </button>

        <button
          onClick={onLevelSelect}
          className="block w-40 sm:w-48 mx-auto mb-2 sm:mb-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-semibold rounded-lg transition-all text-sm sm:text-base"
        >
          SELECT LEVEL
        </button>

        <button
          onClick={onStartEndless}
          className="block w-40 sm:w-48 mx-auto mb-4 sm:mb-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-orange-600/20 text-sm sm:text-base"
        >
          ENDLESS MODE
        </button>

        {highScore > 0 && (
          <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
            High Score: <span className="text-yellow-400 font-bold">{highScore.toLocaleString()}</span>
          </p>
        )}

        <div className="text-gray-400 text-[10px] sm:text-xs space-y-0.5 sm:space-y-1">
          <p>← → or Mouse — Move Paddle</p>
          <p>SPACE — Launch Ball</p>
          <p>P / ESC — Pause</p>
        </div>
      </div>
    </div>
  );
}
