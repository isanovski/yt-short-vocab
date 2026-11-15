#!/usr/bin/env python3
"""Mix audio untuk ENGLISH WORD LAB (35s).

Timing HARUS sama dengan komposisi Remotion:
  3 soal x (7s timer + 3s reveal) + 5s outro = 35s
  - tick  : tiap detik countdown (7 tick per soal), 3 tick terakhir lebih keras
  - ding  : tepat di frame reveal (t = soal + 7s)
  - whoosh: di awal tiap soal
  - fanfare: di awal outro (t = 30s)
"""

import argparse
import array
import math
import pathlib
import random
import re
import wave

SR = 44100

CONFIG_PATH = pathlib.Path(__file__).resolve().parent.parent / "src" / "config" / "default.ts"
OUT_PATH = pathlib.Path(__file__).resolve().parent / "sfx" / "wordlab_mix.wav"


def read_config():
    """Baca timing & jumlah kata dari src/config/default.ts.

    Sumber tunggal kebenaran: kalau timer/outro diubah di config, SFX ikut pindah
    otomatis sehingga tick selalu jatuh di detik yang sama dengan ring timer.
    """
    text = CONFIG_PATH.read_text()
    if not text:
        raise SystemExit(f"config kosong: {CONFIG_PATH}")

    def num(key, default):
        m = re.search(rf"{key}\s*:\s*([0-9]+(?:\.[0-9]+)?)", text)
        return float(m.group(1)) if m else float(default)

    intro = num("introSeconds", 3)
    timer = num("timerSeconds", 5)
    reveal = num("revealSeconds", 2)
    outro = num("outroSeconds", 4)

    mode_match = re.search(r"mode\s*:\s*'(\w+)'", text)
    mode = mode_match.group(1) if mode_match else "fixed"
    if mode == "random":
        questions = int(num("randomCount", 3))
    else:
        questions = len(re.findall(r"\bidn\s*:", text))

    return intro, timer, reveal, outro, max(1, questions)


INTRO, TIMER, REVEAL, OUTRO, QUESTIONS = read_config()

parser = argparse.ArgumentParser(description="Mix audio ENGLISH WORD LAB")
parser.add_argument("--out", default=str(OUT_PATH))
args = parser.parse_args()
OUT = pathlib.Path(args.out)

PER_Q = TIMER + REVEAL
DUR = INTRO + QUESTIONS * PER_Q + OUTRO
N = int(SR * DUR)
OUTRO_AT = INTRO + QUESTIONS * PER_Q
TIMER_I = int(TIMER)

left = [0.0] * N
right = [0.0] * N


def add(start, samples, pan=0.0):
    """pan: -1 kiri, 0 tengah, +1 kanan."""
    i0 = int(start * SR)
    gl = math.sqrt((1 - pan) / 2)
    gr = math.sqrt((1 + pan) / 2)
    for k, s in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            left[i] += s * gl
            right[i] += s * gr


def env(i, n, attack=0.005, release=0.04):
    a = int(attack * SR)
    r = int(release * SR)
    if i < a:
        return i / a
    if i > n - r:
        return max(0.0, (n - i) / r)
    return 1.0


def tone(freq, dur, amp, kind="sine"):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        if kind == "square":
            v = 1.0 if math.sin(2 * math.pi * freq * t) >= 0 else -1.0
        else:
            v = math.sin(2 * math.pi * freq * t)
        out.append(v * amp * env(i, n))
    return out


def tick(amp):
    n = int(0.035 * SR)
    out = []
    for i in range(n):
        t = i / SR
        v = 1.0 if math.sin(2 * math.pi * 1500 * t) >= 0 else -1.0
        out.append(v * amp * env(i, n, 0.001, 0.02))
    return out


def ding():
    out = []
    for idx, f in enumerate((880.0, 1108.73, 1318.51)):
        n = int(0.30 * SR)
        base = idx * 0.055
        for i in range(n):
            t = i / SR
            a = math.exp(-6.0 * t)
            out.append((base + t, math.sin(2 * math.pi * f * t) * 0.17 * a))
    # render dengan offset manual
    total = int(0.55 * SR)
    buf = [0.0] * total
    for pos, v in out:
        i = int(pos * SR)
        if i < total:
            buf[i] += v
    return buf


def whoosh():
    n = int(0.34 * SR)
    buf = []
    prev = 0.0
    for i in range(n):
        x = random.uniform(-1, 1)
        prev = prev * 0.72 + x * 0.28  # lowpass sederhana
        p = i / n
        a = math.sin(math.pi * p) ** 2
        buf.append(prev * 0.16 * a)
    return buf


def fanfare():
    notes = (523.25, 659.25, 783.99, 1046.50)
    total = int(1.15 * SR)
    buf = [0.0] * total
    for idx, f in enumerate(notes):
        start = int(idx * 0.10 * SR)
        n = int(0.60 * SR)
        for i in range(n):
            t = i / SR
            a = math.exp(-4.0 * t)
            j = start + i
            if j < total:
                buf[j] += math.sin(2 * math.pi * f * t) * 0.13 * a
    return buf


# ---------- BGM: pad akor, loop sampai 35s ----------
CHORDS = (
    (220.00, 261.63, 329.63),  # Am
    (174.61, 220.00, 261.63),  # F
    (261.63, 329.63, 392.00),  # C
    (196.00, 246.94, 293.66),  # G
)
BAR = 2.5
t = 0.0
ci = 0
while t < DUR:
    chord = CHORDS[ci % len(CHORDS)]
    bar = min(BAR, DUR - t)
    n = int(bar * SR)
    for f in chord:
        for det, pan in ((0.997, -0.25), (1.0, 0.0), (1.003, 0.25)):
            buf = []
            for i in range(n):
                tt = i / SR
                trem = 1.0 + 0.16 * math.sin(2 * math.pi * 0.35 * tt)
                a = env(i, n, 0.12, 0.18)
                buf.append(math.sin(2 * math.pi * f * det * tt) * 0.028 * a * trem)
            add(t, buf, pan)
    # bass root satu oktaf di bawah
    bass = []
    for i in range(n):
        tt = i / SR
        a = env(i, n, 0.06, 0.15)
        bass.append(math.sin(2 * math.pi * (chord[0] / 2) * tt) * 0.05 * a)
    add(t, bass, 0.0)
    t += bar
    ci += 1

# ---------- intro ----------
def riser(dur=2.0):
    """Noise sweep naik menjelang soal pertama."""
    n = int(dur * SR)
    buf = []
    prev = 0.0
    for i in range(n):
        p = i / n
        x = random.uniform(-1, 1)
        prev = prev * 0.85 + x * 0.15
        buf.append(prev * 0.10 * (p ** 1.6))
    return buf


add(0.0, whoosh(), 0.0)
add(INTRO - 2.0, riser(2.0), 0.0)

# ---------- SFX per soal ----------
for q in range(QUESTIONS):
    q_start = INTRO + q * PER_Q

    # whoosh di awal soal
    add(q_start, whoosh(), 0.0)

    # tick tiap detik countdown; 3 terakhir lebih tegas
    for k in range(TIMER_I):
        amp = 0.30 if k >= TIMER_I - 3 else 0.16
        add(q_start + k, tick(amp), 0.0)

    # ding tepat saat reveal
    add(q_start + TIMER, ding(), 0.0)

# ---------- outro ----------
add(OUTRO_AT, whoosh(), 0.0)
add(OUTRO_AT, fanfare(), 0.0)

# ---------- master: soft clip + normalisasi ----------
peak = 0.0
for i in range(N):
    left[i] = math.tanh(left[i] * 1.15)
    right[i] = math.tanh(right[i] * 1.15)
    peak = max(peak, abs(left[i]), abs(right[i]))

gain = 0.89 / peak if peak > 0 else 1.0
data = array.array("h")
for i in range(N):
    data.append(int(max(-1.0, min(1.0, left[i] * gain)) * 32767))
    data.append(int(max(-1.0, min(1.0, right[i] * gain)) * 32767))

with wave.open(str(OUT), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())

print(
    f"ok: {OUT.name} {DUR:.1f}s (intro {INTRO:g} + {QUESTIONS}×{PER_Q:g} + outro {OUTRO:g}) "
    f"peak={peak:.3f} gain={gain:.3f}"
)