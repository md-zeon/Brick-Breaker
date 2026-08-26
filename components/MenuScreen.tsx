'use client';

interface MenuScreenProps {
  highScore: number;
  onStart: () => void;
  onStartEndless: () => void;
  onLevelSelect: () => void;
}

export default function MenuScreen({ highScore, onStart, onStartEndless, onLevelSelect }: MenuScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
          BRICK BREAKER
        </h1>
        <div className="flex justify-center gap-1 mb-6">
          {['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#5542FF'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ background: c }} />
          ))}
        </div>

        <button
          onClick={onStart}
          className="block w-48 mx-auto mb-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          START GAME
        </button>

        <button
          onClick={onLevelSelect}
          className="block w-48 mx-auto mb-3 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          SELECT LEVEL
        </button>

        <button
          onClick={onStartEndless}
          className="block w-48 mx-auto mb-6 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
        >
          ENDLESS MODE
        </button>

        {highScore > 0 && (
          <p className="text-gray-400 text-sm mb-6">
            High Score: <span className="text-yellow-400 font-bold">{highScore.toLocaleString()}</span>
          </p>
        )}

        <div className="text-gray-500 text-xs space-y-1">
          <p>← → or Mouse — Move Paddle</p>
          <p>SPACE — Launch Ball</p>
          <p>P — Pause</p>
        </div>
      </div>
    </div>
  );
}
