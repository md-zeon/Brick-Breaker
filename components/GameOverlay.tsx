'use client';

interface GameOverlayProps {
  score: number;
  lives: number;
  level: number;
}

export default function GameOverlay({ score, lives, level }: GameOverlayProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-2 pointer-events-none">
      <div className="text-white text-sm font-mono">
        Score: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
      </div>
      <div className="text-white text-sm font-mono">
        Level: <span className="text-purple-400 font-bold">{level + 1}</span>
      </div>
      <div className="text-white text-sm font-mono">
        {Array.from({ length: lives }).map((_, i) => (
          <span key={i} className="text-red-500">♥</span>
        ))}
      </div>
    </div>
  );
}
