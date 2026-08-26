import GameCanvas from '@/components/GameCanvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050508] p-4">
      <GameCanvas />
    </main>
  );
}
