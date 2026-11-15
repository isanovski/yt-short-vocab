import type { Theme, Typography, Background, VideoConfig } from './config';

export type ThemeTokens = Theme & Typography & Background;

export function makeTheme(cfg: VideoConfig): ThemeTokens {
  return {
    base: cfg.theme.base,
    surface: '#0B1120',
    line: cfg.theme.line,
    hero: cfg.theme.hero,
    violet: '#8B5CF6',
    text: cfg.theme.text,
    dim: '#94A3B8',
    ok: cfg.theme.ok,
    bad: cfg.theme.bad,
    warn: cfg.theme.warn,
    fontFamily: cfg.typography.fontFamily,
    sizes: cfg.typography.sizes,
    spacing: cfg.typography.spacing,
    blobs: cfg.background.blobs,
    type: 'blobs',
  };
}