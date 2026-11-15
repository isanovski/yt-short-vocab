import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Question } from '../scenes/Question';
import { VOCAB_CONFIG } from '../config/default.ts';
import { makeTheme } from '../theme';
import type { ThemeTokens } from '../theme';

export const VocabQuiz: React.FC = () => {
  const cfg = VOCAB_CONFIG;
  const tokens = makeTheme(cfg);

  return (
    <AbsoluteFill style={{ backgroundColor: tokens.base }}>
      {cfg.content.words.map((w, i) => (
        <Question key={w.idn} tokens={tokens} cfg={cfg} word={w} index={i} />
      ))}
    </AbsoluteFill>
  );
};