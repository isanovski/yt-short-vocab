import React from 'react';
import { Composition } from 'remotion';
import { VocabQuiz } from './compositions/VocabQuiz';
import { loadConfig } from './config';

const cfg = loadConfig();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VocabQuiz"
    component={VocabQuiz}
    durationInFrames={
      cfg.timing.timerSeconds * cfg.video.fps * cfg.content.words.length +
      cfg.timing.outroSeconds * cfg.video.fps
    }
    fps={cfg.video.fps}
    width={cfg.video.width}
    height={cfg.video.height}
  />
);