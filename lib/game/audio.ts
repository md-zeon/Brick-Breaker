let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', volume: number = 0.15) {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playHit() {
  playTone(520, 0.08, 'square', 0.1);
}

export function playBreak() {
  playTone(300, 0.12, 'sawtooth', 0.12);
  setTimeout(() => playTone(200, 0.1, 'square', 0.08), 30);
}

export function playBounce() {
  playTone(440, 0.06, 'sine', 0.08);
}

export function playPowerUp() {
  playTone(600, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(800, 0.1, 'sine', 0.1), 60);
}

export function playLoseLife() {
  playTone(200, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playTone(150, 0.4, 'sawtooth', 0.1), 100);
}

export function playLevelComplete() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 100);
  });
}

export function playGameOver() {
  const notes = [400, 350, 300, 200];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sawtooth', 0.1), i * 150);
  });
}

export function playCombo(level: number) {
  const freq = 400 + level * 50;
  playTone(Math.min(freq, 1200), 0.1, 'sine', 0.1);
}
