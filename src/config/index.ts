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
export { VOCAB_CONFIG } from './default.ts';

export function getTotalFrames(cfg: VideoConfig): number {
  const { fps } = cfg.video;
  const { timerSeconds, revealSeconds, outroSeconds } = cfg.timing;
  const perQ = timerSeconds + revealSeconds;
  const totalFrames = 3 * perQ * fps + outroSeconds * fps;
  return totalFrames;
}