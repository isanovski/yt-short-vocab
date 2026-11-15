import React from 'react';
import { interpolate, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ThemeTokens } from '../theme';

export type TimerProps = {
  tokens: ThemeTokens;
  revealed: boolean;
  secs: number;
  barPct: number;
  punch: number;
};

export const Timer: React.FC<TimerProps> = ({ tokens, revealed, secs, barPct, punch }) => (
  <div
    style={{
      marginTop: tokens.spacing.xl,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    }}
  >
    <div
      style={{
        width: tokens.sizes.xl,
        height: tokens.sizes.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: tokens.fontFamily,
        fontWeight: 900,
        fontSize: tokens.sizes.md,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        color: revealed ? tokens.ok : tokens.hero,
        transform: `scale(${punch})`,
      }}
    >
      {revealed ? '✓' : `${secs}`}
    </div>
    <div
      style={{
        width: 320,
        height: tokens.spacing.xs,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${barPct}%`,
          borderRadius: 999,
          background: revealed ? tokens.ok : tokens.hero,
        }}
      />
    </div>
  </div>
);