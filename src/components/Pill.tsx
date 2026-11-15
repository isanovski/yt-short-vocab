import React from 'react';
import { Enter } from '../anim';
import type { ThemeTokens } from '../theme';

export type PillProps = {
  children: React.ReactNode;
  solid?: boolean;
  tokens: ThemeTokens;
  delay?: number;
  style?: React.CSSProperties;
};

export const Pill: React.FC<PillProps> = ({ children, solid, tokens, delay = 0, style }) => (
  <Enter delay={delay} distance={tokens.spacing.md}>
    <div
      style={{
        padding: `${tokens.sizes.sm}px ${tokens.sizes.xl}px`,
        borderRadius: 999,
        background: solid ? tokens.hero : 'transparent',
        border: solid ? 'none' : `2px solid ${tokens.hero}`,
        color: solid ? tokens.base : tokens.hero,
        fontFamily: tokens.fontFamily,
        fontWeight: 900,
        fontSize: tokens.sizes.sm,
        letterSpacing: '0.02em',
        ...style,
      }}
    >
      {children}
    </div>
  </Enter>
);