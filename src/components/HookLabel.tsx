import React from 'react';
import { Enter } from '../anim';
import type { ThemeTokens } from '../theme';

export type HookLabelProps = {
  text: string;
  tokens: ThemeTokens;
  delay?: number;
};

export const HookLabel: React.FC<HookLabelProps> = ({ text, tokens, delay = 0 }) => (
  <Enter delay={delay} distance={tokens.spacing.md}>
    <div
      style={{
        padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
        borderRadius: 999,
        border: `1.5px solid ${tokens.line}`,
        background: 'rgba(255,255,255,0.04)',
        fontFamily: tokens.fontFamily,
        fontWeight: 700,
        fontSize: tokens.sizes.md,
        letterSpacing: '0.08em',
        color: tokens.warn,
      }}
    >
      {text}
    </div>
  </Enter>
);