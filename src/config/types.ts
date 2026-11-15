export type Blob = {
  readonly size: number;
  readonly color: string;
  readonly opacity: number;
  readonly speed: number;
};

export type Word = {
  readonly idn: string;
  readonly correct: string;
  readonly opts: readonly string[];
};

export type ContentType = 'quiz' | 'vocab';

export type Theme = {
  readonly base: string;
  readonly surface: string;
  readonly hero: string;
  readonly violet: string;
  readonly text: string;
  readonly dim: string;
  readonly ok: string;
  readonly bad: string;
  readonly warn: string;
  readonly line: string;
};

export type Typography = {
  readonly fontFamily: string;
  readonly sizes: { readonly sm: number; readonly md: number; readonly lg: number; readonly xl: number; readonly hero: number };
  readonly spacing: { readonly xs: number; readonly sm: number; readonly md: number; readonly lg: number; readonly xl: number; readonly xxl: number };
};

export type Background = {
  readonly type: 'blobs';
  readonly blobs: readonly Blob[];
};

export type Content = {
  readonly type: ContentType;
  readonly words: readonly Word[];
  readonly introHook: string;
  readonly pauseLabel: string;
  readonly scoreLabel: string;
  readonly ctaLabel: string;
};

export type Timing = {
  readonly timerSeconds: number;
  readonly revealSeconds: number;
  readonly outroSeconds: number;
};

export type Audio = {
  readonly bgmGain: number;
  readonly sfxGain: number;
};

export type Output = {
  readonly filename: string;
  readonly crf: number;
};

export type VideoConfig = {
  readonly video: {
    readonly id: string;
    readonly title: string;
    readonly fps: number;
    readonly width: number;
    readonly height: number;
    readonly durationSeconds: number;
  };
  readonly theme: Theme;
  readonly typography: Typography;
  readonly background: Background;
  readonly content: Content;
  readonly timing: Timing;
  readonly audio: Audio;
  readonly output: Output;
};