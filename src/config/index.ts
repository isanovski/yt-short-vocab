import type {
  Blob,
  Word,
  ContentType,
  Theme,
  Typography,
  Background,
  Content,
  Timing,
  Audio,
  Output,
  VideoConfig,
} from './types';

export {
  Blob,
  Word,
  ContentType,
  Theme,
  Typography,
  Background,
  Content,
  Timing,
  Audio,
  Output,
  VideoConfig,
};
export { VOCAB_CONFIG } from './default';

export function loadConfig(configPath?: string): VideoConfig {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cfg = require(configPath || './default') as VideoConfig;
  return cfg;
}

export function getTotalFrames(cfg: VideoConfig): number {
  const { fps } = cfg.video;
  const { timerSeconds, revealSeconds, outroSeconds } = cfg.timing;
  const perQ = timerSeconds + revealSeconds;
  const totalFrames = 3 * perQ * fps + outroSeconds * fps;
  return totalFrames;
}