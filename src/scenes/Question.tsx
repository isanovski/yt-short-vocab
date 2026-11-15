import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Blobs, Vignette, Enter, Shake, PopIn } from '../anim';
import { HookLabel } from '../components/HookLabel';
import { Timer } from '../components/Timer';
import { OptionCard } from '../components/OptionCard';
import { CorrectBanner } from '../components/CorrectBanner';
import type { ThemeTokens } from '../theme';
import type { VideoConfig, Word } from '../config';

export type QuestionProps = {
  tokens: ThemeTokens;
  cfg: VideoConfig;
  word: Word;
  index: number;
};

export const Question: React.FC<QuestionProps> = ({ tokens, cfg, word, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealed = frame >= cfg.timing.timerSeconds * fps;
  const revealP = spring({
    frame: frame - cfg.timing.timerSeconds * fps,
    fps,
    config: { damping: 16, stiffness: 240 },
  });
  const secs = Math.ceil(Math.max(0, cfg.timing.timerSeconds * fps - frame) / fps);
  const barPct = revealed
    ? 100
    : interpolate(frame, [0, cfg.timing.timerSeconds * fps], [100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      });

  const secFrac = frame % fps;
  const punch = revealed
    ? 1
    : interpolate(secFrac, [0, 3, 9], [1.2, 1.1, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      });

  // Pattern interrupt: soal ke-2 dibuka dengan void cut singkat
  const interrupt = index === 1
    ? interpolate(frame, [0, 4, 9], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const heroSize = tokens.sizes.hero;

  return (
    <AbsoluteFill style={{ backgroundColor: tokens.base }}>
      <Blobs blobs={tokens.blobs} speed={0.6} />
      <Vignette />

      {/* Hook label di atas */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: cfg.video.width,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Enter delay={0} distance={tokens.spacing.md}>
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
              color: index === 0 ? tokens.warn : tokens.dim,
            }}
          >
            {hookFor(index)}
          </div>
        </Enter>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: cfg.video.width,
          height: cfg.video.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* Kata kunci + jawaban */}
        <div
          style={{
            minHeight: 208,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: tokens.spacing.sm,
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontFamily,
              fontWeight: 900,
              fontSize: heroSize,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: tokens.text,
            }}
          >
            {word.idn}
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamily,
              fontWeight: 900,
              fontSize: tokens.sizes.lg,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: tokens.ok,
              opacity: revealed ? revealP : 0,
              transform: `translateY(${tokens.spacing.sm * (1 - revealP)}px)`,
            }}
          >
            {word.correct}
          </div>
        </div>

        {/* Timer — ukuran tetap, angka punch tiap detik */}
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
              color: revealed ? tokens.ok : secFrac < 3 ? tokens.warn : tokens.hero,
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
          {/* Instruksi mikir — soft pressure, hilang saat reveal */}
          <div
            style={{
              marginTop: tokens.spacing.xs,
              height: tokens.sizes.md,
              display: 'flex',
              alignItems: 'center',
              fontFamily: tokens.fontFamily,
              fontWeight: 700,
              fontSize: tokens.sizes.md,
              letterSpacing: '0.14em',
              color: tokens.dim,
              opacity: revealed ? 0 : 0.85,
            }}
          >
            {cfg.content.pauseLabel}
          </div>
        </div>

        {/* Opsi A–D, muncul berurutan */}
        <div
          style={{
            marginTop: tokens.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.sm,
            alignItems: 'center',
            width: '100%',
          }}
        >
          {word.opts.map((opt, i) => {
            const state = !revealed ? 'idle' : opt === word.correct ? 'correct' : 'wrong';
            return (
              <OptionCard
                key={opt}
                label={['A', 'B', 'C', 'D'][i]}
                text={opt}
                state={state}
                delay={i * 3}
                tokens={tokens}
              />
            );
          })}
        </div>

        {/* Banner jawaban benar — motion halus (PopIn), bukan shake */}
        {revealed && revealP > 0.5 && (
          <div
            style={{
              marginTop: tokens.spacing.xl,
              height: tokens.spacing.xxl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CorrectBanner
              text={word.correct}
              tokens={tokens}
              delay={cfg.timing.timerSeconds * fps + 10}
              revealP={revealP}
            />
          </div>
        )}
      </div>

      {/* Pattern interrupt: satu beat gelap saat masuk soal 2 */}
      {interrupt > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            opacity: interrupt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontFamily,
              fontWeight: 900,
              fontSize: tokens.sizes.xl,
              letterSpacing: '-0.02em',
              color: tokens.hero,
            }}
          >
            {hookFor(index)}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

function hookFor(index: number): string {
  if (index === 0) return '9 DARI 10 GAGAL';
  return `SOAL ${index + 1} DARI 3`;
}