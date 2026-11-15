import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Shake } from '../anim';
import type { ThemeTokens } from '../theme';

export type OptionCardProps = {
  label: string;
  text: string;
  state: 'idle' | 'correct' | 'wrong';
  delay: number;
  tokens: ThemeTokens;
};

const TIMER = 210;

export const OptionCard: React.FC<OptionCardProps> = ({ label, text, state, delay, tokens }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 220 } });
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';

  const bg =
    isCorrect ? 'rgba(34,197,94,0.12)' : isWrong ? 'rgba(239,68,68,0.10)' : 'rgba(255,255,255,0.03)';
  const border = isCorrect ? tokens.ok : isWrong ? tokens.bad : tokens.line;

  const row = (
    <>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isCorrect ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)',
          fontFamily: tokens.fontFamily,
          fontWeight: 700,
          fontSize: 24,
          color: tokens.text,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: tokens.fontFamily,
          fontWeight: 700,
          fontSize: tokens.sizes.sm,
          letterSpacing: '-0.01em',
          color: isCorrect ? tokens.ok : tokens.text,
        }}
      >
        {text}
      </div>
      {isCorrect && (
        <div
          style={{
            marginLeft: 'auto',
            fontFamily: tokens.fontFamily,
            fontWeight: 900,
            fontSize: tokens.sizes.sm,
            color: tokens.ok,
          }}
        >
          ✓
        </div>
      )}
      {isWrong && (
        <div
          style={{
            marginLeft: 'auto',
            fontFamily: tokens.fontFamily,
            fontWeight: 700,
            fontSize: tokens.sizes.md,
            color: 'rgba(239,68,68,0.45)',
          }}
        >
          ✕
        </div>
      )}
    </>
  );

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${tokens.sizes.sm * (1 - p)}px)`,
        width: '100%',
        maxWidth: 704,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 16,
        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
      }}
    >
      {isCorrect || isWrong ? (
        <Shake intense={isCorrect ? 1 : 0.7} start={TIMER}>
          {row}
        </Shake>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          {row}
        </div>
      )}
    </div>
  );
};