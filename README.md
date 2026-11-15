# eng-short — Faceless YouTube Shorts Motion Graphics

Remotion-based motion graphics for animated quiz/vocab Shorts (1080×1920 @30fps).
Code-driven, deterministic, GPU-free. Config-driven: swap `config/default.json`
to make a new video without touching code.

## What it is

A Remotion project that renders a vocabulary quiz Short:

1. **Intro hook** (frame 0): `"9 DARI 10 GAGAL"` (or custom hook from config)
2. **3 questions** × (7s timer + 3s reveal): word → answer + green banner
3. **Outro** (5s): `KAMU BENAR BERAPA?` + score + CTA

Total: **35 seconds**. All text centered in YouTube Shorts safe zone. Audio (BGM + SFX) mixed from Python.

## Repo layout

```
eng-short/
├── src/
│   ├── index.ts              # Remotion entry (registers Root)
│   ├── Root.tsx              # Composition wrapper
│   ├── config.ts             # VideoConfig type + loadConfig()
│   ├── theme.ts              # makeTheme(cfg) → ThemeTokens
│   ├── anim/
│   │   ├── index.ts          # Enter, Shake, PopIn
│   │   └── Blobs.tsx         # Animated background blobs + vignette
│   ├── components/
│   │   ├── HookLabel.tsx     # Top hook pill ("9 DARI 10 GAGAL")
│   │   ├── Timer.tsx         # Countdown + progress bar with punch
│   │   ├── OptionCard.tsx    # A/B/C/D card with correct/wrong state + shake
│   │   ├── CorrectBanner.tsx # "JAWABAN BENAR: X" reveal banner
│   │   └── Pill.tsx          # Rounded button (MULAI / FOLLOW)
│   ├── scenes/
│   │   ├── Intro.tsx         # Intro screen (currently INTRO=0, skipped)
│   │   ├── Question.tsx      # Quiz question: word, timer, options, banner
│   │   └── Outro.tsx         # Score + CTA (loop-friendly fade)
│   └── compositions/
│       └── VocabQuiz.tsx     # Main composition: loads config, maps words → scenes
├── config/
│   └── default.json          # THE file to edit for a new video
├── audio/
│   └── mix_quiz_v21.py       # Generates full_mix_v3.wav (BGM + SFX)
├── out/
│   └── vocab-quiz-final.mp4  # Latest render
├── README.md
├── .gitignore
├── package.json
├── tsconfig.json
└── LICENSE
```

## How to make a new video

1. **Copy `config/default.json` to `config/<your-video>.json`**.
2. Edit `config/<your-video>.json`:
   - Change `VOCAB.content.words` (idn/correct/opts) for new quiz words.
   - Change `VOCAB.content.introHook`, `pauseLabel`, `scoreLabel`, `ctaLabel`.
   - Change `VOCAB.theme.*` colors for a different look.
   - Change `VOCAB.background.blobs` colors/speeds for different motion.
   - Change `VOCAB.timing.*` for different pacing.
3. **Regenerate audio** (optional):
   ```bash
   python audio/mix_quiz_v21.py
   ```
4. **Render**:
   ```bash
   ./node_modules/.bin/remotion render src/index.ts VocabQuiz out/<your-video>.mp4 --concurrency=1
   ```
5. **Mux audio**:
   ```bash
   ffmpeg -y -i out/<your-video>.mp4 -i audio/sfx/full_mix_v3.wav \
     -c:v copy -c:a aac -b:a 192k -shortest -map 0:v:0 -map 1:a:0 out/<your-video>-final.mp4
   ```

## Key design decisions

- **No intro screen** — hook appears at frame 0 as a pill label above the first question (retention best practice).
- **Single color theme** — one hero color per frame; blobs add motion without distraction.
- **Timer punch** — number scales 1.2× each second (squash & stretch) synced to tick SFX.
- **Pattern interrupt** — question 2 opens with a black flash + hook text (resets attention at ~10s).
- **Cognitive relief** — card shake decays after ~0.7s; reveal banner slides in smoothly.
- **Loop-friendly outro** — fades to black in last 0.4s so it loops back to frame 0.

## Safe zone

All text stays within x∈[0,960], y∈[380,1540] (YouTube Shorts template: top/bottom dead 380px, right dead 120px).

## License

MIT