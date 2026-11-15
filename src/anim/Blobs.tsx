import React from 'react';
import { useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import type { Blob } from '../config';

export const Blobs: React.FC<{ blobs: readonly Blob[]; speed?: number }> = ({
  blobs,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * speed;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {blobs.map((b, i) => {
        const x = Math.sin(t * 0.35 + i) * 60;
        const y = Math.cos(t * 0.3 + i) * 50;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              background: b.color,
              filter: `blur(${Math.round(b.size * 0.16)}px)`,
              opacity: b.opacity,
              top: -b.size / 2 + y,
              left: -b.size / 2 + x,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, transparent 45%, #020617 100%)`,
    }}
  />
);