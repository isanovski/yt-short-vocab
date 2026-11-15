export const VOCAB_CONFIG = {
  video: {
    id: 'vocab-quiz-v21',
    title: 'English Vocabulary Quiz',
    fps: 30,
    width: 1080,
    height: 1920,
    durationSeconds: 35,
  },
  theme: {
    base: '#020617',
    surface: '#0B1120',
    hero: '#06B6D4',
    violet: '#8B5CF6',
    text: '#F8FAFC',
    dim: '#94A3B8',
    ok: '#22C55E',
    bad: '#EF4444',
    warn: '#FBBF24',
    line: 'rgba(255,255,255,0.10)',
  },
  typography: {
    fontFamily: 'Inter',
    sizes: { sm: 44, md: 56, lg: 70, xl: 88, hero: 110 },
    spacing: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, xxl: 64 },
  },
  background: {
    type: 'blobs',
    blobs: [
      { size: 760, color: '#06B6D4', opacity: 0.2, speed: 0.35 },
      { size: 620, color: '#8B5CF6', opacity: 0.18, speed: 0.28 },
      { size: 420, color: '#FBBF24', opacity: 0.07, speed: 0.22 },
    ],
  },
  content: {
    type: 'quiz',
    words: [
      { idn: 'Meski', correct: 'Despite', opts: ['Because', 'Although', 'Since', 'Despite'] },
      { idn: 'Berarti', correct: 'Significant', opts: ['Minor', 'Significant', 'Trivial', 'Small'] },
      { idn: 'Penting', correct: 'Essential', opts: ['Optional', 'Essential', 'Useless', 'Minor'] },
    ],
    introHook: '9 DARI 10 GAGAL',
    pauseLabel: 'JAWAB DULU SEBELUM DIBUKA',
    scoreLabel: 'BENAR BERAPA DARI 3?',
    ctaLabel: 'TULIS SKOR DI KOMENTAR',
  },
  timing: {
    timerSeconds: 7,
    revealSeconds: 3,
    outroSeconds: 5,
  },
  audio: {
    bgmGain: 0.6,
    sfxGain: 1.0,
  },
  output: {
    filename: 'vocab-quiz-final.mp4',
    crf: 22,
  },
} as const;
