import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { VOCAB_CONFIG } from '../config/default.ts';
import { PALETTES } from '../config/palettes.ts';
import { WORD_BANK } from '../config/wordbank.ts';
import { pickOne, rngFromSeed, sample } from '../lib/rng.ts';
import type { Word } from '../config/types.ts';

/* ============================================================
   ENGLISH WORD LAB — vocab quiz Short (1080×1920 @30fps, 38s)
   3s intro + 3 kata × (7s timer + 3s reveal) + 5s outro.

   Warna: palet dipilih ACAK tiap render (config.video.seed = 'auto').
           Isi seed dengan string tertentu untuk mengunci warna yang sama.
   Kata  : config.content.mode = 'fixed'  → pakai daftar words pilihan user
           config.content.mode = 'random' → ambil acak dari WORD_BANK
   Safe zone: y ∈ [380, 1540]
   ============================================================ */

/* ---------- resolusi warna & kata (sekali per render) ----------
   Prioritas seed: env VOCAB_SEED → config.video.seed → acak.
   Pakai VOCAB_SEED untuk mengulang video dengan warna & kata yang sama. */
const seed =
  process.env.VOCAB_SEED ??
  (VOCAB_CONFIG.video.seed === 'auto'
    ? `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
    : VOCAB_CONFIG.video.seed);
const rng = rngFromSeed(seed);
const palette = pickOne(PALETTES, rng);
const words: Word[] =
  VOCAB_CONFIG.content.mode === 'random'
    ? sample(WORD_BANK, VOCAB_CONFIG.content.randomCount, rng)
    : [...VOCAB_CONFIG.content.words];

// eslint-disable-next-line no-console
console.log(
  `[wordlab] seed=${seed} palette=${palette.name} words=${words.map((w) => w.correct).join(' / ')}`
);

const COLORS = {
  base: palette.base,
  ink: palette.ink,
  accent: palette.accent,
  accent2: palette.accent2,
  accent3: palette.accent3,
  muted: palette.muted,
  white: '#FFFFFF',
};

/* warna turunan dari ink supaya border/shadow ikut palet */
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const inkRgb = rgb(COLORS.ink);
const baseRgb = rgb(COLORS.base);
const INK = (a: number) => `rgba(${inkRgb[0]},${inkRgb[1]},${inkRgb[2]},${a})`;
const BASE = (a: number) => `rgba(${baseRgb[0]},${baseRgb[1]},${baseRgb[2]},${a})`;

const FONT = loadFont('normal', {
  weights: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
}).fontFamily;

const FPS = 30;
/* Semua timing dibaca dari config supaya ubah durasi tidak perlu sentuh kode. */
const INTRO = VOCAB_CONFIG.timing.introSeconds * FPS;
const TIMER = VOCAB_CONFIG.timing.timerSeconds * FPS;
const REVEAL = VOCAB_CONFIG.timing.revealSeconds * FPS;
const PER_Q = TIMER + REVEAL;
const OUTRO = VOCAB_CONFIG.timing.outroSeconds * FPS;

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => Easing.out(Easing.cubic)(clamp(n));

const Text: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => <div style={{ fontFamily: FONT, ...style }}>{children}</div>;

/* ---------------- background ---------------- */
const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.base, overflow: 'hidden' }}>
      {/* tekstur titik halus, drift sangat lambat */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          backgroundImage: `radial-gradient(${INK(0.08)} 1.6px, transparent 1.6px)`,
          backgroundSize: '36px 36px',
          transform: `translateY(${Math.sin(t * 0.35) * 10}px)`,
        }}
      />

      {/* blob warna */}
      <div
        style={{
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: COLORS.accent,
          opacity: 0.46,
          top: -320 + Math.sin(t * 0.5) * 24,
          right: -250,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 430,
          height: 430,
          borderRadius: '50%',
          background: COLORS.accent2,
          opacity: 0.2,
          bottom: -200 - Math.sin(t * 0.42) * 22,
          left: -140,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: COLORS.accent3,
          opacity: 0.09,
          top: 300 + Math.cos(t * 0.3) * 26,
          left: -150,
        }}
      />

      {/* ruang bersih di tengah supaya konten tidak bersaing dengan tekstur */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(58% 42% at 50% 46%, ${BASE(0.95)} 0%, ${BASE(0.62)} 48%, ${BASE(0)} 78%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- intro ---------------- */
const Intro: React.FC<{ local: number }> = ({ local }) => {
  const line1 = clamp(spring({ frame: local, fps: FPS, config: { damping: 16, stiffness: 200 } }));
  const boxW = clamp(
    spring({ frame: local - 9, fps: FPS, config: { damping: 20, stiffness: 170 } })
  );
  const sub = ease((local - 24) / 12);
  const out = clamp((local - (INTRO - 8)) / 8);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - out,
        transform: `scale(${1 + out * 0.04})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 380,
        paddingBottom: 380,
        boxSizing: 'border-box',
      }}
    >
      <Text
        style={{
          opacity: line1,
          transform: `translateY(${(1 - line1) * 26}px)`,
          fontSize: 100,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: COLORS.ink,
        }}
      >
        3 kata.
      </Text>

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          transform: 'rotate(-1.8deg)',
        }}
      >
        <div
          style={{
            background: COLORS.accent,
            borderRadius: 26,
            padding: '12px 34px',
            opacity: boxW,
            transform: `scaleX(${0.6 + 0.4 * boxW})`,
            boxShadow: `0 18px 36px ${INK(0.1)}`,
          }}
        >
          <Text
            style={{
              fontSize: 92,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: COLORS.ink,
            }}
          >
            Siap jawab?
          </Text>
        </div>
      </div>

      <Text
        style={{
          opacity: sub,
          transform: `translateY(${(1 - sub) * 18}px)`,
          marginTop: 34,
          fontSize: 30,
          fontWeight: 800,
          color: COLORS.muted,
        }}
      >
        Tebak artinya sebelum ring habis.
      </Text>
    </AbsoluteFill>
  );
};

/* ---------------- timer ring ---------------- */
const Timer: React.FC<{ local: number; revealed: boolean }> = ({ local, revealed }) => {
  const remaining = Math.max(0, Math.ceil((TIMER - local) / FPS));
  const progress = clamp(local / TIMER);
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ width: 128, height: 128, position: 'relative', flexShrink: 0 }}>
      <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke={INK(0.12)} strokeWidth="9" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={revealed ? COLORS.accent2 : COLORS.accent3}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={revealed ? 0 : c * progress}
        />
      </svg>
      <Text
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          fontWeight: 900,
          color: COLORS.ink,
        }}
      >
        {revealed ? '✓' : remaining}
      </Text>
    </div>
  );
};

/* ---------------- kartu opsi: tanpa huruf, cuma kata ---------------- */
const Option: React.FC<{
  text: string;
  correct: boolean;
  revealed: boolean;
  index: number;
  local: number;
}> = ({ text, correct, revealed, index, local }) => {
  const p = clamp(
    spring({ frame: local - index * 2 + 18, fps: FPS, config: { damping: 18, stiffness: 220 } })
  );
  const ok = revealed && correct;
  const bad = revealed && !correct;
  const sinceReveal = Math.max(0, local - TIMER);
  const pulse = ok ? 1 + 0.02 * Math.sin(clamp(sinceReveal / 20) * Math.PI) : 1;

  return (
    <div
      style={{
        opacity: p * (bad ? 0.58 : 1),
        transform: `translateY(${(1 - p) * 26}px) scale(${pulse})`,
        height: 106,
        borderRadius: 24,
        border: `2.5px solid ${ok ? COLORS.ink : INK(0.1)}`,
        background: ok ? COLORS.accent : COLORS.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: ok ? `0 16px 34px ${INK(0.16)}` : `0 8px 20px ${INK(0.05)}`,
      }}
    >
      <Text style={{ fontSize: 41, fontWeight: 800, color: COLORS.ink, letterSpacing: '-0.015em' }}>
        {text}
      </Text>
    </div>
  );
};

/* ---------------- question scene (semua center) ---------------- */
const Question: React.FC<{ index: number; local: number }> = ({ index, local }) => {
  const word = words[index];
  const revealed = local >= TIMER;
  const enter = ease((local + 6) / 10);

  return (
    <AbsoluteFill
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 26}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 380,
        paddingBottom: 380,
        boxSizing: 'border-box',
      }}
    >
      {/* panel kata: jangkar visual komposisi */}
      <div
        style={{
          background: COLORS.white,
          border: `2px solid ${INK(0.08)}`,
          borderRadius: 34,
          padding: '30px 46px',
          boxShadow: `0 24px 48px ${INK(0.07)}`,
          maxWidth: 940,
        }}
      >
        <Text
          style={{
            fontSize: word.idn.length > 12 ? 78 : 98,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            color: COLORS.ink,
            textAlign: 'center',
          }}
        >
          {word.idn}
        </Text>
      </div>

      <div style={{ marginTop: 36 }}>
        <Timer local={local} revealed={revealed} />
      </div>

      <div
        style={{
          marginTop: 40,
          width: 940,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {word.opts.map((opt, i) => (
          <Option
            key={opt}
            text={opt}
            correct={opt === word.correct}
            revealed={revealed}
            index={i}
            local={local}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- outro ---------------- */
const Outro: React.FC<{ local: number }> = ({ local }) => {
  const p = ease((local + 10) / 18);
  const fade = clamp((OUTRO - local) / 8);
  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 380,
        paddingBottom: 380,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
        <Text
          style={{
            fontSize: 88,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: '-0.055em',
            color: COLORS.ink,
          }}
        >
          Keep learning.
        </Text>
        <div
          style={{
            marginTop: 44,
            background: COLORS.ink,
            borderRadius: 26,
            padding: '26px 34px',
            boxShadow: `0 18px 40px ${INK(0.18)}`,
          }}
        >
          <Text style={{ fontSize: 30, lineHeight: 1.4, fontWeight: 800, color: COLORS.base }}>
            {words.map((w) => w.correct).join(' · ')}
          </Text>
        </div>
        <Text style={{ marginTop: 34, fontSize: 28, fontWeight: 800, color: COLORS.muted }}>
          Simpan kuis ini, ulang besok.
        </Text>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- composition ---------------- */
export const VocabQuiz: React.FC = () => {
  const frame = useCurrentFrame();
  const qStart = INTRO;
  const qEnd = INTRO + words.length * PER_Q;

  let scene: React.ReactNode;
  if (frame < qStart) {
    scene = <Intro local={frame} />;
  } else if (frame < qEnd) {
    const rel = frame - qStart;
    const index = Math.min(Math.floor(rel / PER_Q), words.length - 1);
    scene = <Question index={index} local={rel - index * PER_Q} />;
  } else {
    scene = <Outro local={frame - qEnd} />;
  }

  return (
    <AbsoluteFill>
      <Background frame={frame} />
      {scene}
    </AbsoluteFill>
  );
};