import React from 'react';
import { PopIn } from '../anim';
import type { ThemeTokens } from '../theme';

export type CorrectBannerProps = {
  text: string;
  tokens: ThemeTokens;
  delay: number;
  revealP: number;
};

export const CorrectBanner: React.FC<CorrectBannerProps> = ({
  text,
  tokens,
  delay,
  revealP,
}) => (
  <PopIn delay={delay}>
    <div
      style={{
        background: `linear-gradient(135deg,${tokens.ok},#16a34a)`,
        borderRadius: 24,
        padding: `${tokens.sizes.sm}px ${tokens.sizes.md}px`,
        display: 'inline-block',
        boxShadow: '0 30px 90px rgba(34,197,94,0.5)',
      }}
    >
      <div
        style={{
          fontFamily: tokens.fontFamily,
          fontWeight: 900,
          fontSize: tokens.sizes.xl,
          color: tokens.base,
          textAlign: 'center',
        }}
      >
        JAWABAN BENAR: {text}
      </div>
    </div>
  </PopIn>
);