export type Blob = {
  size: number;
  color: string;
  opacity: number;
  speed: number;
};

export type Word = {
  idn: string;
  correct: string;
  opts: string[];
};

export type ContentType = 'quiz' | 'vocab';

export type Theme = {
  base: string;
  surface: string;
  hero: string;
  violet: string;
  text: string;
  dim: string;
  ok: string;
  bad: string;
  warn: string;
  line: string;
};

export type Typography = {
  fontFamily: string;
  sizes: { sm: number; md: number; lg: number; xl: number; hero: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
};

export type Background = {
  type: 'blobs';
  blobs: Blob[];
};

export type Content = {
  type: ContentType;
  words: Word[];
  introHook: string;
  pauseLabel: string;
  scoreLabel: string;
  ctaLabel: string;
};

export type Timing = {
  timerSeconds: number;
  revealSeconds: number;
  outroSeconds: number;
};

export type Audio = {
  bgmGain: number;
  sfxGain: number;
};

export type Output = {
  filename: string;
  crf: number;
};

export type VideoConfig = {
  video: {
    id: string;
    title: string;
    fps: number;
    width: number;
    height: number;
    durationSeconds: number;
  };
  theme: Theme;
  typography: Typography;
  background: Background;
  content: Content;
  timing: Timing;
  audio: Audio;
  output: Output;
};