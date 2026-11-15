import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Blobs, Vignette, Enter } from '../anim';
import { Pill } from '../components/Pill';
import type { ThemeTokens } from '../theme';
import type { VideoConfig } from '../config';

export type OutroProps = {
  tokens: ThemeTokens;
  cfg: VideoConfig;
};

export const Outro: React.FC<OutroProps> = ({ tokens, cfg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Loop-friendly: redup di 0.4s terakhir supaya nyambung ke frame pertama
  const loopFade = interpolate(frame, [cfg.timing.outroSeconds * fps - 12, cfg.timing.outroSeconds * fps - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: tokens.base }}>
      <Blobs blobs={tokens.blobs} speed={0.7} />
      <Vignette />
      <AbsoluteFill style={{ opacity: loopFade }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: cfg.video.width,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: tokens.spacing.sm,
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontFamily,
              fontWeight: 700,
              fontSize: tokens.sizes.md,
              letterSpacing: '0.14em',
              color: tokens.dim,
            }}
          >
            {cfg.content.scoreLabel}
          </div>
          <Enter delay={4}>
            <div
              style={{
                fontFamily: tokens.fontFamily,
                fontWeight: 900,
                fontSize: tokens.sizes.hero,
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: tokens.text,
              }}
            >
              3 / 3
            </div>
          </Enter>
          <Enter delay={4 + 4 * 3}>
            <Pill solid tokens={tokens}>{cfg.content.ctaLabel}</Pill>
          </Enter>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};