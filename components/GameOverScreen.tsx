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
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">GAME OVER</h2>

        <p className="text-gray-400 text-sm mb-2">Final Score</p>
        <p className="text-4xl font-bold text-white mb-4">{score.toLocaleString()}</p>

        {isNewHighScore && (
          <p className="text-yellow-400 text-sm mb-4 animate-pulse">NEW HIGH SCORE!</p>
        )}

        <p className="text-gray-500 text-xs mb-6">
          Best: {highScore.toLocaleString()}
        </p>

        <button
          onClick={onRestart}
          className="block w-44 mx-auto mb-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          RESTART
        </button>
        <button
          onClick={onMenu}
          className="block w-44 mx-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
}
