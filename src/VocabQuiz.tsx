import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';

/* ============================================================
   VOCAB QUIZ — YouTube Shorts 9:16
   1080×1920 @30fps · 38 detik
   Intro 3s · 3 soal × (7s timer + 3s reveal) · Outro 5s

   SISTEM DESAIN — satu bahasa untuk semua scene:
   • Warna    : 1 base gelap + 1 surface + 1 accent
   • Type     : skala 1.25× → 44 / 56 / 70 / 88 / 110
   • Spacing  : kelipatan 8 → 8 / 16 / 24 / 32 / 48 / 64
   • Motion   : 1 spring masuk, 1 easing bar, 1 shake
   • Safe zone: template Reformat.video → x∈[0,960], y∈[380,1540]
   ============================================================ */

const {fontFamily: FONT} = loadFont('normal', {
  weights: ['400', '700', '900'],
  subsets: ['latin'],
});

/* ---------------- warna ---------------- */
const C = {
  base: '#020617',
  surface: '#0B1120',
  line: 'rgba(255,255,255,0.10)',
  hero: '#06B6D4',
  violet: '#8B5CF6',
  text: '#F8FAFC',
  dim: '#94A3B8',
  ok: '#22C55E',
  bad: '#EF4444',
  warn: '#FBBF24',
};

/* ---------------- skala ---------------- */
const T = {sm: 44, md: 56, lg: 70, xl: 88, hero: 110};
const S = {xs: 8, sm: 16, md: 24, lg: 32, xl: 48, xxl: 64};

/* ---------------- motion ---------------- */
const ENTER = {damping: 18, stiffness: 220};
const STAGGER = 3;

/* ---------------- safe zone ---------------- */
const SAFE = {left: 0, right: 960, top: 380, bottom: 1540};
const BOX: React.CSSProperties = {
  position: 'absolute',
  left: SAFE.left,
  width: SAFE.right - SAFE.left,
  top: SAFE.top,
  bottom: 1920 - SAFE.bottom,
};
const CENTER: React.CSSProperties = {
  ...BOX,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

/* ---------------- waktu ---------------- */
const FPS = 30;
const TIMER = 7 * FPS;         // 7 detik mikir
const REVEAL = 3 * FPS;        // 3 detik reveal
const PER_Q = TIMER + REVEAL;
const OUTRO = 150;             // 5 detik
const TOTAL = 3 * PER_Q + OUTRO; // 1050 frame = 35 s

const HOOK = '9 DARI 10 GAGAL';
const PAUSE_LABEL = 'JAWAB DULU SEBELUM DIBUKA';
const SCORE_LABEL = 'BENAR BERAPA DARI 3?';
const CTA_LABEL = 'TULIS SKOR DI KOMENTAR';
const hookFor = (index: number) => index === 0 ? HOOK : `SOAL ${index + 1} DARI 3`;

/* ---------------- konten ---------------- */
type Word = {idn: string; correct: string; opts: string[]};

const VOCAB: Word[] = [
  {idn: 'Meski', correct: 'Despite', opts: ['Because', 'Although', 'Since', 'Despite']},
  {idn: 'Berarti', correct: 'Significant', opts: ['Minor', 'Significant', 'Trivial', 'Small']},
  {idn: 'Penting', correct: 'Essential', opts: ['Optional', 'Essential', 'Useless', 'Minor']},
];

const fit = (len: number, big: number, small: number, limit: number) =>
  len > limit ? small : big;

/* ============================================================
   BACKGROUND — satu komposisi, dipakai semua scene
   ============================================================ */

const Blobs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const blob = (size: number, color: string, opacity: number, style: React.CSSProperties) => (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${Math.round(size * 0.16)}px)`,
        opacity,
        ...style,
      }}
    />
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {blob(760, C.hero, 0.2, {top: -200 + Math.sin(t * 0.35) * 50, left: -220 + Math.cos(t * 0.3) * 60})}
      {blob(620, C.violet, 0.18, {bottom: -160 + Math.cos(t * 0.28) * 50, right: -180 + Math.sin(t * 0.32) * 60})}
      {blob(420, C.warn, 0.07, {top: 120 + Math.sin(t * 0.22) * 40, left: 80 + Math.cos(t * 0.26) * 40})}
    </AbsoluteFill>
  );
};

/** Vignette: fokus ke tengah, teks lebih terbaca. */
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, transparent 45%, ${C.base} 100%)`,
    }}
  />
);

/* ============================================================
   ANIMASI — tiga primitif saja
   ============================================================ */

/** Masuk: naik + scale-in, lalu diam. Semua elemen pakai ini. */
const Enter: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay = 0, distance = S.xl, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: ENTER});
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

/** Goyang halus di pojok — HANYA kartu jawaban. Meredam setelah ~0.7s (cognitive relief). */
const Shake: React.FC<{children: React.ReactNode; intense?: number; start?: number}> = ({
  children,
  intense = 1,
  start = 0,
}) => {
  const frame = useCurrentFrame() - start;
  const {fps} = useVideoConfig();
  const p = spring({frame: Math.max(0, frame), fps, config: ENTER});
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
        gap: S.sm,
        width: '100%',
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================
   KARTU OPSI
   ============================================================ */

type OptState = 'idle' | 'correct' | 'wrong';

const Option: React.FC<{label: string; text: string; state: OptState; delay: number}> = ({
  label,
  text,
  state,
  delay,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: ENTER});
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';

  const row = (
    <>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isCorrect ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: S.md,
          color: C.text,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: T.sm,
          letterSpacing: '-0.01em',
          color: isCorrect ? C.ok : C.text,
        }}
      >
        {text}
      </div>
      {isCorrect && (
        <div style={{marginLeft: 'auto', fontFamily: FONT, fontWeight: 900, fontSize: T.sm, color: C.ok}}>
          ✓
        </div>
      )}
      {isWrong && (
        <div style={{marginLeft: 'auto', fontFamily: FONT, fontWeight: 700, fontSize: T.md, color: 'rgba(239,68,68,0.45)'}}>
          ✕
        </div>
      )}
    </>
  );

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${S.sm * (1 - p)}px)`,
        width: '100%',
        maxWidth: 704,
        background: isCorrect
          ? 'rgba(34,197,94,0.12)'
          : isWrong
          ? 'rgba(239,68,68,0.08)'
          : 'rgba(255,255,255,0.03)',
        border: `2px solid ${isCorrect ? C.ok : isWrong ? C.bad : C.line}`,
        borderRadius: 16,
        padding: `${S.sm}px ${S.md}px`,
      }}
    >
      {isCorrect || isWrong ? (
        <Shake intense={isCorrect ? 1 : 0.7} start={TIMER}>{row}</Shake>
      ) : (
        <div style={{display: 'flex', alignItems: 'center', gap: S.sm}}>{row}</div>
      )}
    </div>
  );
};

/* ============================================================
   SOAL
   ============================================================ */

const Question: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame(); // relatif ke <Sequence>
  const word = VOCAB[index];

  const revealed = frame >= TIMER;
  const revealP = spring({frame: frame - TIMER, fps: FPS, config: ENTER});
  const secs = Math.ceil(Math.max(0, TIMER - frame) / FPS);
  const barPct = revealed
    ? 100
    : interpolate(frame, [0, TIMER], [100, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      });

  const heroSize = fit(word.idn.length, T.hero, T.lg, 10);

  // punch tiap detik: angka timer "nabrak" pas ganti nilai (squash & stretch)
  const secFrac = frame % FPS;
  const punch = revealed ? 1 : interpolate(secFrac, [0, 3, 9], [1.2, 1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // pattern interrupt: soal ke-2 dibuka dengan void cut singkat
  const interrupt = index === 1
    ? interpolate(frame, [0, 4, 9], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  return (
    <AbsoluteFill style={{backgroundColor: C.base}}>
      <Blobs />
      <Vignette />

      {/* label skor / hook — kecil, di atas, dalam safe zone */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: SAFE.top,
          width: SAFE.right - SAFE.left,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Enter delay={0} distance={S.md}>
          <div
            style={{
              padding: `${S.xs}px ${S.md}px`,
              borderRadius: 999,
              border: `1.5px solid ${C.line}`,
              background: 'rgba(255,255,255,0.04)',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: S.md,
              letterSpacing: '0.08em',
              color: index === 0 ? C.warn : C.dim,
            }}
          >
            {hookFor(index)}
          </div>
        </Enter>
      </div>

      <div style={CENTER}>
        {/* kata kunci + jawaban */}
        <div
          style={{
            minHeight: 208,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: S.sm,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: heroSize,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: C.text,
            }}
          >
            {word.idn}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: T.lg,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: C.ok,
              opacity: revealed ? revealP : 0,
              transform: `translateY(${S.sm * (1 - revealP)}px)`,
            }}
          >
            {word.correct}
          </div>
        </div>

        {/* timer — ukuran tetap, angka punch tiap detik */}
        <div
          style={{
            marginTop: S.xl,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: S.sm,
          }}
        >
          <div
            style={{
              width: S.xxl,
              height: T.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: T.md,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              color: revealed ? C.ok : secFrac < 3 ? C.warn : C.hero,
              transform: `scale(${punch})`,
            }}
          >
            {revealed ? '✓' : secs}
          </div>
          <div
            style={{
              width: 320,
              height: S.xs,
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
                background: revealed ? C.ok : C.hero,
              }}
            />
          </div>

          {/* instruksi mikir — soft pressure, hilang saat reveal */}
          <div
            style={{
              marginTop: S.xs,
              height: S.md,
              display: 'flex',
              alignItems: 'center',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: S.md,
              letterSpacing: '0.14em',
              color: C.dim,
              opacity: revealed ? 0 : 0.85,
            }}
          >
            {PAUSE_LABEL}
          </div>
        </div>

        {/* pilihan A–D, muncul berurutan */}
        <div
          style={{
            marginTop: S.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: S.sm,
            alignItems: 'center',
            width: '100%',
          }}
        >
          {word.opts.map((opt, i) => {
            const state: OptState = !revealed
              ? 'idle'
              : opt === word.correct
              ? 'correct'
              : 'wrong';
            return (
              <Option
                key={opt}
                label={['A', 'B', 'C', 'D'][i]}
                text={opt}
                state={state}
                delay={i * STAGGER}
              />
            );
          })}
        </div>
      </div>

      {/* pattern interrupt: satu beat gelap saat masuk soal 2 */}
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
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: T.xl,
              letterSpacing: '-0.02em',
              color: C.hero,
            }}
          >
            {hookFor(index)}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ============================================================
   SCENE
   ============================================================ */

const Pill: React.FC<{children: React.ReactNode; solid?: boolean}> = ({children, solid}) => (
  <div
    style={{
      padding: `${S.sm}px ${S.xl}px`,
      borderRadius: 999,
      background: solid ? C.hero : 'transparent',
      border: solid ? 'none' : `2px solid ${C.hero}`,
      color: solid ? C.base : C.hero,
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: T.sm,
      letterSpacing: '0.02em',
    }}
  >
    {children}
  </div>
);

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  // loop-friendly: redup di 0.4s terakhir supaya nyambung ke frame pertama
  const loopFade = interpolate(frame, [OUTRO - 12, OUTRO - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.base}}>
      <Blobs />
      <Vignette />
      <AbsoluteFill style={{opacity: loopFade}}>
        <div style={{...CENTER, justifyContent: 'center', gap: S.xl}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: S.sm,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: S.md,
                letterSpacing: '0.14em',
                color: C.dim,
              }}
            >
              {SCORE_LABEL}
            </div>
            <Enter delay={4}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: T.hero,
                  lineHeight: 1.02,
                  letterSpacing: '-0.03em',
                  color: C.text,
                }}
              >
                3 / 3
              </div>
            </Enter>
          </div>
          <Enter delay={4 + 4 * STAGGER}>
            <Pill solid>{CTA_LABEL}</Pill>
          </Enter>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ============================================================
   ROOT
   ============================================================ */

export const VocabQuiz: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.base, fontFamily: FONT}}>
    {VOCAB.map((w, i) => (
      <Sequence key={w.idn} from={i * PER_Q} durationInFrames={PER_Q}>
        <Question index={i} />
      </Sequence>
    ))}

    <Sequence from={VOCAB.length * PER_Q} durationInFrames={OUTRO}>
      <Outro />
    </Sequence>
  </AbsoluteFill>
);

export const VOCAB_TOTAL_FRAMES = TOTAL;