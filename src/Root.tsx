import React from 'react';
import { Composition } from 'remotion';
import { VocabQuiz } from './compositions/VocabQuiz';
import { VOCAB_CONFIG } from './config';

const cfg = VOCAB_CONFIG;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VocabQuiz"
    component={VocabQuiz}
    durationInFrames={
      (cfg.timing.introSeconds +
        (cfg.timing.timerSeconds + cfg.timing.revealSeconds) * cfg.content.words.length +
        cfg.timing.outroSeconds) *
      cfg.video.fps
    }
    fps={cfg.video.fps}
    width={cfg.video.width}
    height={cfg.video.height}
  />
);