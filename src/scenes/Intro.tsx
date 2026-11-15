import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Blobs, Vignette, Enter } from '../anim';
import { Pill } from '../components/Pill';
import type { ThemeTokens } from '../theme';
import type { VideoConfig } from '../config';

export type IntroProps = {
  tokens: ThemeTokens;
  cfg: VideoConfig;
};

export const Intro: React.FC<IntroProps> = ({ tokens, cfg }) => (
  <AbsoluteFill style={{ backgroundColor: tokens.base }}>
    <Blobs blobs={tokens.blobs} speed={0.8} />
    <Vignette />
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: cfg.video.width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Enter delay={4}>
        <div
          style={{
            fontFamily: tokens.fontFamily,
            fontWeight: 900,
            fontSize: tokens.sizes.hero,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: tokens.text,
          }}
        >
          IMPROVE YOUR
          <br />
          <span style={{ color: tokens.hero }}>ENGLISH VOCABULARY</span>
        </div>
      </Enter>
      <Enter delay={4 + 6} style={{ marginTop: tokens.spacing.xl }}>
        <Pill solid tokens={tokens}>MULAI</Pill>
      </Enter>
    </div>
  </AbsoluteFill>
);