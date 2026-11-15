import React from 'react';
import { spring, interpolate, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { Blobs, Vignette } from './Blobs';

export { Blobs, Vignette };

const ENTER = { damping: 18, stiffness: 220 };

/** Masuk: naik + scale-in, lalu diam. Semua elemen pakai ini. */
export const Enter: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, distance = 48, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: ENTER });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${distance * (1 - p)}px) scale(${0.94 + 0.06 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Goyang halus di pojok — hanya untuk kartu jawaban. Meredam setelah ~0.7s. */
export const Shake: React.FC<{ children: React.ReactNode; intense?: number; start?: number }> = ({
  children,
  intense = 1,
  start = 0,
}) => {
  const frame = Math.max(0, useCurrentFrame() - start);
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: ENTER });
  const decay = interpolate(frame, [0, 20, 34], [1, 0.35, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const amp = p * decay * intense;
  const x = Math.sin(frame * 0.42) * 6 * amp;
  const y = Math.cos(frame * 0.38) * 4 * amp;
  const rot = Math.sin(frame * 0.3) * 1.5 * amp;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/** Pop in dari bawah, lalu diam. */
export const PopIn: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: ENTER });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${48 * (1 - p)}px) scale(${0.94 + 0.06 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};