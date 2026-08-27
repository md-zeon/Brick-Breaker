'use client';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
}

export default function GameOverScreen({ score, highScore, onRestart, onMenu }: GameOverScreenProps) {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg overflow-hidden">
      <div className="text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-3 sm:mb-4">GAME OVER</h2>

        <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Final Score</p>
        <p className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">{score.toLocaleString()}</p>

        {isNewHighScore && (
          <p className="text-yellow-400 text-xs sm:text-sm mb-3 sm:mb-4 animate-pulse">NEW HIGH SCORE!</p>
        )}

        <p className="text-gray-500 text-[10px] sm:text-xs mb-4 sm:mb-6">
          Best: {highScore.toLocaleString()}
        </p>

        <button
          onClick={onRestart}
          className="block w-36 sm:w-44 mx-auto mb-2 sm:mb-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
        >
          RESTART
        </button>
        <button
          onClick={onMenu}
          className="block w-36 sm:w-44 mx-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
}
