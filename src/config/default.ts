import type { VideoConfig } from './types';

export const VOCAB_CONFIG: VideoConfig = {
  video: {
    id: 'vocab-quiz',
    title: 'English Vocabulary Quiz',
    fps: 30,
    width: 1080,
    height: 1920,
    durationSeconds: 38,
    seed: 'auto',
  },
  theme: {
    base: '#0A0616',
    surface: '#140C26',
    hero: '#A78BFA',
    violet: '#F472B6',
    text: '#F8FAFC',
    dim: '#A1A1B5',
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
      { size: 760, color: '#A78BFA', opacity: 0.22, speed: 0.35 },
      { size: 620, color: '#F472B6', opacity: 0.16, speed: 0.28 },
      { size: 420, color: '#22D3EE', opacity: 0.08, speed: 0.22 },
    ],
  },
  content: {
    type: 'quiz',
    /* mode 'fixed' → pakai daftar words di bawah (hasil pilihan user).
       mode 'random' → ambil randomCount kata dari src/config/wordbank.ts */
    mode: 'fixed',
    randomCount: 3,
    words: [
      {
        idn: 'Tidak memihak',
        correct: 'Impartial',
        opts: ['Impartial', 'Partial', 'Impassive', 'Imperative'],
      },
      {
        idn: 'Berlimpah',
        correct: 'Abundant',
        opts: ['Abundant', 'Abandoned', 'Absurd', 'Adamant'],
      },
      {
        idn: 'Gigih',
        correct: 'Tenacious',
        opts: ['Tenacious', 'Tedious', 'Terrific', 'Tentative'],
      },
    ],
    introHook: '9 DARI 10 GAGAL',
    pauseLabel: 'JAWAB DULU SEBELUM DIBUKA',
    scoreLabel: 'BENAR BERAPA DARI 3?',
    ctaLabel: 'TULIS SKOR DI KOMENTAR',
  },
  timing: {
    introSeconds: 3,
    timerSeconds: 5,
    revealSeconds: 2,
    outroSeconds: 4,
  },
  audio: {
    bgmGain: 0.6,
    sfxGain: 1.0,
  },
  output: {
    filename: 'vocab-quiz-violet.mp4',
    crf: 22,
  },
} as const;
