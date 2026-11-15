import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Question } from '../scenes/Question';
import { loadConfig } from '../config';
import { makeTheme } from '../theme';
import type { ThemeTokens } from '../theme';

export const VocabQuiz: React.FC = () => {
  const cfg = loadConfig();
  const tokens = makeTheme(cfg);

  return (
    <AbsoluteFill style={{ backgroundColor: tokens.base }}>
      {cfg.content.words.map((w, i) => (
        <Question key={w.idn} tokens={tokens} cfg={cfg} word={w} index={i} />
      ))}
    </AbsoluteFill>
  );
};