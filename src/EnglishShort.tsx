import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ---------------- Design tokens ---------------- */
const C = {
  navy: '#0B1026',
  navy2: '#151B3D',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  mint: '#10B981',
  amber: '#F59E0B',
  pink: '#EC4899',
  sky: '#38BDF8',
  white: '#FFFFFF',
  muted: '#A5B4FC',
};

const FONT = '"DejaVu Sans", "Noto Sans", sans-serif';

/* ---------------- Shared building blocks ---------------- */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  return (
    <AbsoluteFill
      style={{
        opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(${seed}deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)`,
        pointerEvents: 'none',
      }}
    />
  );
};

const Blobs: React.FC<{tint?: string}> = ({tint = C.violet}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: tint,
          filter: 'blur(120px)',
          opacity: 0.55,
          top: -260 + Math.sin(t * 0.6) * 70,
          left: -300 + Math.cos(t * 0.5) * 90,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: C.indigo,
          filter: 'blur(130px)',
          opacity: 0.5,
          bottom: -220 + Math.cos(t * 0.7) * 80,
          right: -260 + Math.sin(t * 0.45) * 100,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: C.sky,
          filter: 'blur(140px)',
          opacity: 0.3,
          top: 700 + Math.sin(t * 0.9) * 120,
          left: 320 + Math.cos(t * 0.8) * 120,
        }}
      />
    </AbsoluteFill>
  );
};

const PopIn: React.FC<{
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'scale';
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay = 0, from = 'bottom', children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, mass: 0.55, stiffness: 130},
  });
  const dx = from === 'left' ? -120 * (1 - p) : from === 'right' ? 120 * (1 - p) : 0;
  const dy = from === 'bottom' ? 90 * (1 - p) : 0;
  const sc = from === 'scale' ? 0.6 + 0.4 * p : 1;
  return (
    <div
      style={{
        opacity: p,
        transform: `translate(${dx}px, ${dy}px) scale(${sc})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 12,
        background: 'rgba(255,255,255,0.12)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, (frame / total) * 100)}%`,
          background: `linear-gradient(90deg, ${C.indigo}, ${C.pink})`,
        }}
      />
    </div>
  );
};

const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = C.mint,
}) => (
  <div
    style={{
      display: 'inline-block',
      padding: '14px 30px',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.10)',
      border: `2px solid ${color}`,
      color,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 4,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

/* ---------------- Scene 1: Hook ---------------- */
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = ['BISA', 'BAHASA', 'INGGRIS?'];
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 20%, ${C.navy2}, ${C.navy} 70%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <Blobs tint={C.violet} />
      <Grain />
      <div style={{zIndex: 2, textAlign: 'center'}}>
        {words.map((w, i) => {
          const p = spring({
            frame: frame - i * 8,
            fps,
            config: {damping: 11, mass: 0.5, stiffness: 150},
          });
          return (
            <div
              key={w}
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: i === 2 ? 118 : 96,
                lineHeight: 1.05,
                color: i === 2 ? C.amber : C.white,
                opacity: p,
                transform: `translateY(${70 * (1 - p)}px) scale(${0.85 + 0.15 * p})`,
                letterSpacing: -2,
              }}
            >
              {w}
            </div>
          );
        })}
        <PopIn delay={34} style={{marginTop: 44}}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 36,
              color: C.muted,
              lineHeight: 1.5,
            }}
          >
            Mulai dari nol — 3 menit sehari
          </div>
        </PopIn>
        <PopIn delay={52} from="scale" style={{marginTop: 56}}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              padding: '24px 46px',
              borderRadius: 999,
              background: `linear-gradient(120deg, ${C.indigo}, ${C.pink})`,
              color: C.white,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 40,
              boxShadow: '0 24px 70px rgba(124,58,237,0.55)',
            }}
          >
            MULAI
            <span style={{fontSize: 34}}>→</span>
          </div>
        </PopIn>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 2: Greetings ---------------- */
const GreetingCard: React.FC<{
  delay: number;
  word: string;
  meaning: string;
  accent: string;
  tag: string;
}> = ({delay, word, meaning, accent, tag}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - delay, fps: 30, config: {damping: 14, mass: 0.6, stiffness: 110}});
  const float = Math.sin((frame - delay) / 26) * 6;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateX(${140 * (1 - p)}px) translateY(${float}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        background: 'rgba(255,255,255,0.96)',
        borderRadius: 34,
        padding: '30px 34px',
        boxShadow: '0 26px 60px rgba(0,0,0,0.35)',
        borderLeft: `14px solid ${accent}`,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 26,
          background: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 40,
          color: C.white,
          flexShrink: 0,
        }}
      >
        {word.slice(0, 1)}
      </div>
      <div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 54, color: C.navy}}>{word}</div>
          <div style={{fontFamily: FONT, fontSize: 24, color: accent, fontWeight: 700}}>{tag}</div>
        </div>
        <div style={{fontFamily: FONT, fontSize: 30, color: '#4B5563', marginTop: 4}}>{meaning}</div>
      </div>
    </div>
  );
};

const SceneGreetings: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, #221447 100%)`,
        padding: '130px 70px',
      }}
    >
      <Blobs tint={C.indigo} />
      <Grain />
      <div style={{zIndex: 2}}>
        <PopIn>
          <Kicker>Lesson 1</Kicker>
        </PopIn>
        <PopIn delay={8} style={{marginTop: 26}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.white, lineHeight: 1}}>
            GREETINGS
          </div>
        </PopIn>
        <PopIn delay={16} style={{marginTop: 12}}>
          <div style={{fontFamily: FONT, fontSize: 34, color: C.muted}}>Sapaan dasar</div>
        </PopIn>

        <div style={{marginTop: 120, display: 'flex', flexDirection: 'column', gap: 46}}>
          <GreetingCard delay={30} word="Hello" meaning="Halo (netral, aman dipakai kapan saja)" accent={C.indigo} tag="FORMAL" />
          <GreetingCard delay={46} word="Hi" meaning="Hai (santai, ke teman)" accent={C.pink} tag="CASUAL" />
          <GreetingCard delay={62} word="Good morning" meaning="Selamat pagi (sampai jam 12)" accent={C.mint} tag="TIME-BASED" />
        </div>

        <PopIn delay={86} style={{marginTop: 56}}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 28,
              color: C.muted,
              borderLeft: `6px solid ${C.amber}`,
              paddingLeft: 22,
            }}
          >
            Tips: “Hi” lebih akrab, “Hello” lebih aman untuk orang baru.
          </div>
        </PopIn>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 3: Introduce yourself ---------------- */
const StickKid: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - delay, fps: 30, config: {damping: 12, stiffness: 120}});
  const bob = Math.sin((frame - delay) / 18) * 8;
  return (
    <svg width={230} height={330} viewBox="0 0 230 330" style={{opacity: p, transform: `translateY(${bob}px)`}}>
      <circle cx={115} cy={62} r={46} fill="#FFE8B0" stroke={C.navy} strokeWidth={8} />
      <line x1={115} y1={108} x2={115} y2={214} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
      <line x1={115} y1={140} x2={60} y2={186} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
      <line x1={115} y1={140} x2={176} y2={122} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
      <line x1={115} y1={214} x2={72} y2={292} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
      <line x1={115} y1={214} x2={158} y2={292} stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
      <circle cx={98} cy={54} r={5} fill={C.navy} />
      <circle cx={134} cy={54} r={5} fill={C.navy} />
      <path d="M96 76 Q115 92 134 76" stroke={C.navy} strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  );
};

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const bubble = spring({frame: frame - 26, fps: 30, config: {damping: 13, stiffness: 110}});
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(200deg, #1B1035 0%, ${C.navy} 80%)`,
        padding: '130px 70px',
      }}
    >
      <Blobs tint={C.pink} />
      <Grain />
      <div style={{zIndex: 2}}>
        <PopIn>
          <Kicker color={C.sky}>Lesson 2</Kicker>
        </PopIn>
        <PopIn delay={8} style={{marginTop: 26}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.white, lineHeight: 1.02}}>
            INTRODUCE
            <br />
            YOURSELF
          </div>
        </PopIn>

        <div style={{display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 60}}>
          <StickKid delay={20} />
          <div
            style={{
              opacity: bubble,
              transform: `translateY(${40 * (1 - bubble)}px) scale(${0.9 + 0.1 * bubble})`,
              background: C.white,
              borderRadius: 34,
              borderBottomLeftRadius: 6,
              padding: '34px 38px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
              marginBottom: 40,
              flex: 1,
            }}
          >
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.navy}}>My name is Budi.</div>
            <div style={{fontFamily: FONT, fontSize: 28, color: '#6B7280', marginTop: 10}}>
              Nama saya Budi.
            </div>
          </div>
        </div>

        <div style={{marginTop: 56, display: 'flex', flexDirection: 'column', gap: 30}}>
          {[
            {id: 1, en: 'I am from Indonesia.', idn: 'Saya dari Indonesia.', c: C.mint},
            {id: 2, en: 'I am a student.', idn: 'Saya seorang pelajar.', c: C.amber},
          ].map((row, i) => (
            <PopIn key={row.id} delay={58 + i * 20} from="right">
              <div
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '2px solid rgba(255,255,255,0.16)',
                  borderRadius: 26,
                  padding: '24px 30px',
                  borderLeft: `10px solid ${row.c}`,
                }}
              >
                <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.white}}>{row.en}</div>
                <div style={{fontFamily: FONT, fontSize: 26, color: C.muted, marginTop: 6}}>{row.idn}</div>
              </div>
            </PopIn>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 4: How are you ---------------- */
const SceneHowAreYou: React.FC = () => {
  const frame = useCurrentFrame();
  const qIn = spring({frame, fps: 30, config: {damping: 12, stiffness: 120}});
  const aIn = spring({frame: frame - 60, fps: 30, config: {damping: 12, stiffness: 120}});
  const pulse = 1 + Math.sin(frame / 9) * 0.015;
  return (
    <AbsoluteFill
      style={{background: `linear-gradient(150deg, #06281F 0%, ${C.navy} 75%)`, padding: '130px 70px'}}
    >
      <Blobs tint={C.mint} />
      <Grain />
      <div style={{zIndex: 2}}>
        <PopIn>
          <Kicker color={C.mint}>Lesson 3</Kicker>
        </PopIn>
        <PopIn delay={8} style={{marginTop: 26}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.white, lineHeight: 1.02}}>
            HOW ARE
            <br />
            YOU?
          </div>
        </PopIn>

        <div style={{marginTop: 70}}>
          <div
            style={{
              opacity: qIn,
              transform: `scale(${(0.9 + 0.1 * qIn) * pulse})`,
              background: `linear-gradient(120deg, ${C.sky}, ${C.indigo})`,
              borderRadius: 36,
              padding: '40px 40px',
              boxShadow: '0 26px 70px rgba(56,189,248,0.4)',
            }}
          >
            <div style={{fontFamily: FONT, fontSize: 24, color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: 3}}>
              ASK
            </div>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.white, marginTop: 8}}>
              How are you?
            </div>
            <div style={{fontFamily: FONT, fontSize: 28, color: 'rgba(255,255,255,0.9)', marginTop: 6}}>
              Apa kabar?
            </div>
          </div>

          <div style={{marginTop: 40}}>
            <div
              style={{
                opacity: aIn,
                transform: `translateY(${60 * (1 - aIn)}px)`,
                background: `linear-gradient(120deg, ${C.mint}, #0E9F6E)`,
                borderRadius: 36,
                padding: '40px 40px',
                boxShadow: '0 26px 70px rgba(16,185,129,0.4)',
              }}
            >
              <div style={{fontFamily: FONT, fontSize: 24, color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: 3}}>
                ANSWER
              </div>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.white, marginTop: 8}}>
                I&apos;m fine, thank you.
              </div>
              <div style={{fontFamily: FONT, fontSize: 28, color: 'rgba(255,255,255,0.9)', marginTop: 6}}>
                Kabar baik, terima kasih.
              </div>
            </div>
          </div>

          <PopIn delay={96} style={{marginTop: 44}}>
            <div style={{fontFamily: FONT, fontSize: 27, color: C.muted, borderLeft: `6px solid ${C.amber}`, paddingLeft: 22}}>
              Alternatif: “Not bad”, “Pretty good”, “I&apos;m okay”.
            </div>
          </PopIn>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 5: Quiz ---------------- */
const OptionRow: React.FC<{
  delay: number;
  label: string;
  text: string;
  state: 'idle' | 'correct' | 'wrong';
}> = ({delay, label, text, state}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - delay, fps: 30, config: {damping: 14, stiffness: 110}});
  const bg =
    state === 'correct' ? `linear-gradient(120deg, ${C.mint}, #059669)` :
    state === 'wrong' ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.08)';
  const border =
    state === 'correct' ? C.mint : state === 'wrong' ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.2)';
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${50 * (1 - p)}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: bg,
        border: `3px solid ${border}`,
        borderRadius: 28,
        padding: '28px 30px',
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 20,
          background: state === 'correct' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 34,
          color: C.white,
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.white}}>{text}</div>
      {state === 'correct' && (
        <div style={{marginLeft: 'auto', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white}}>✓</div>
      )}
    </div>
  );
};

const SceneQuiz: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = frame >= 150;
  return (
    <AbsoluteFill
      style={{background: `linear-gradient(170deg, #1A0B2E 0%, ${C.navy} 75%)`, padding: '130px 70px'}}
    >
      <Blobs tint={C.amber} />
      <Grain />
      <div style={{zIndex: 2}}>
        <PopIn>
          <Kicker color={C.amber}>Quiz Time</Kicker>
        </PopIn>
        <PopIn delay={8} style={{marginTop: 26}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 76, color: C.white, lineHeight: 1.05}}>
            PILIH JAWABAN
            <br />
            YANG BENAR
          </div>
        </PopIn>

        <PopIn delay={22} style={{marginTop: 56}}>
          <div
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '2px solid rgba(255,255,255,0.16)',
              borderRadius: 28,
              padding: '34px 34px',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 50,
              color: C.white,
            }}
          >
            ___ are you?
          </div>
        </PopIn>

        <div style={{marginTop: 56, display: 'flex', flexDirection: 'column', gap: 32}}>
          <OptionRow delay={40} label="A" text="What" state={reveal ? 'wrong' : 'idle'} />
          <OptionRow delay={52} label="B" text="How" state={reveal ? 'correct' : 'idle'} />
          <OptionRow delay={64} label="C" text="Who" state={reveal ? 'wrong' : 'idle'} />
        </div>

        {reveal && (
          <PopIn delay={158} style={{marginTop: 40}}>
            <div
              style={{
                background: 'rgba(16,185,129,0.14)',
                border: `2px solid ${C.mint}`,
                borderRadius: 24,
                padding: '26px 30px',
                fontFamily: FONT,
                fontSize: 30,
                color: '#D1FAE5',
                lineHeight: 1.45,
              }}
            >
              “How are you?” = menanyakan kabar. “What” untuk benda, “Who” untuk orang.
            </div>
          </PopIn>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 6: Outro ---------------- */
const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  const colors = [C.amber, C.pink, C.mint, C.sky, C.violet];
  const bits = Array.from({length: 34}, (_, i) => {
    const x = (i * 137) % 1080;
    const speed = 4 + (i % 7);
    const y = ((frame * speed + i * 90) % 2200) - 200;
    const rot = frame * (i % 5 + 1) * 2;
    return {x, y, rot, c: colors[i % colors.length], s: 12 + (i % 4) * 6};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {bits.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s * 1.6,
            background: b.c,
            borderRadius: 3,
            transform: `rotate(${b.rot}deg)`,
            opacity: 0.85,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 12, stiffness: 110}});
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, #2A1152, ${C.navy} 72%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 90,
      }}
    >
      <Blobs tint={C.pink} />
      <Confetti />
      <Grain />
      <div style={{zIndex: 3, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 104,
            color: C.white,
            lineHeight: 1.05,
            opacity: p,
            transform: `scale(${0.85 + 0.15 * p})`,
          }}
        >
          PRAKTIK
          <br />
          <span style={{color: C.amber}}>TIAP HARI</span>
        </div>
        <PopIn delay={16} style={{marginTop: 44}}>
          <div style={{fontFamily: FONT, fontSize: 34, color: C.muted, lineHeight: 1.6}}>
            3 kalimat ini cukup buat mulai:
            <br />
            <span style={{color: C.white, fontWeight: 700}}>
              “Hello, my name is …”
              <br />
              “How are you?”
              <br />
              “I&apos;m fine, thank you.”
            </span>
          </div>
        </PopIn>
        <PopIn delay={34} from="scale" style={{marginTop: 54}}>
          <div
            style={{
              display: 'inline-block',
              padding: '22px 44px',
              borderRadius: 999,
              background: `linear-gradient(120deg, ${C.mint}, ${C.sky})`,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 36,
              color: C.navy,
            }}
          >
            FOLLOW UNTUK PART 2
          </div>
        </PopIn>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Main ---------------- */
export const EnglishShort: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.navy, fontFamily: FONT}}>
      <ProgressBar total={1320} />

      <Sequence from={0} durationInFrames={120}>
        <SceneHook />
      </Sequence>
      <Sequence from={120} durationInFrames={240}>
        <SceneGreetings />
      </Sequence>
      <Sequence from={360} durationInFrames={240}>
        <SceneIntro />
      </Sequence>
      <Sequence from={600} durationInFrames={240}>
        <SceneHowAreYou />
      </Sequence>
      <Sequence from={840} durationInFrames={300}>
        <SceneQuiz />
      </Sequence>
      <Sequence from={1140} durationInFrames={180}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
