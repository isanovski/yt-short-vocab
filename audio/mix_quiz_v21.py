"""Mix audio untuk Vocab Quiz v21 (35s, 9:16).

Struktur waktu (detik):
  0–7    soal 1 timer    | BGM duck, tick tiap detik
  7–10   soal 1 reveal   | BGM naik + ding
 10–17   soal 2 timer    | start: hit interrupt, lalu duck + tick
 17–20   soal 2 reveal   | BGM naik + ding
 20–27   soal 3 timer    | duck + tick
 27–30   soal 3 reveal   | BGM naik + ding
 30–35   outro           | fanfare + BGM naik
"""
import math
import struct
import wave

SR = 44100
DURATION = 35
N = SR * DURATION

# ---------- generator nada ----------
def env(i, n, fade=0.01):
    t = i / SR
    dur = n / SR
    if t < fade:
        return t / fade
    if t > dur - fade:
        return max(0.0, (dur - t) / fade)
    return 1.0


def sine(freq, dur, vol=0.8, fade=0.02):
    n = int(SR * dur)
    return [math.sin(2 * math.pi * freq * i / SR) * env(i, n, fade) * vol for i in range(n)]


def square(freq, dur, vol=0.8, fade=0.005):
    n = int(SR * dur)
    return [
        (1.0 if math.sin(2 * math.pi * freq * i / SR) > 0 else -1.0) * env(i, n, fade) * vol
        for i in range(n)
    ]


def noise_sweep(dur, vol=0.8):
    n = int(SR * dur)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        # low-pass filtered noise, cutoff naik -> "whoosh"
        k = 0.02 + 0.35 * (t / dur)
        rnd = (math.sin(i * 12.9898) * 43758.5453) % 1.0 * 2 - 1
        prev = prev + k * (rnd - prev)
        out.append(prev * env(i, n, 0.05) * vol)
    return out


def arpeggio(freqs, per_note, vol=0.9):
    out = []
    for f in freqs:
        out.extend(sine(f, per_note, vol, 0.03))
    return out


def thud(freq=80, dur=0.35, vol=0.9):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        f = freq * (1 - 0.5 * (t / dur))  # pitch drop
        out.append(math.sin(2 * math.pi * f * t) * (1 - t / dur) ** 2 * vol)
    return out


# ---------- buffer ----------
mix = [[0.0] * N, [0.0] * N]


def add(sound, at, gain=1.0):
    start = int(at * SR)
    for i, v in enumerate(sound):
        j = start + i
        if j >= N:
            break
        mix[0][j] += v * gain
        mix[1][j] += v * gain


# ---------- BGM dengan ducking ----------
# Duck saat timer (-9 dB), penuh saat reveal & outro
REVEALS = [(7, 10), (17, 20), (27, 30)]
QUIZ_END = 30


def bg_gain(t):
    if t >= QUIZ_END:
        return 0.62
    for a, b in REVEALS:
        if a <= t < b:
            return 0.62
    return 0.24  # sedang mikir = lebih pelan


for i in range(N):
    t = i / SR
    bass_note = 110.0 * (2 ** ((int(t / 4) % 4) / 12))
    bass = 0.22 * math.sin(2 * math.pi * bass_note * t)
    scale = [220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0]
    melody = 0.12 * math.sin(2 * math.pi * scale[int(t / 6) % 8] * t)
    pad = 0.08 * math.sin(2 * math.pi * 55.0 * t) + 0.08 * math.sin(2 * math.pi * 82.41 * t)
    g = bg_gain(t)
    if t < 1.0:
        g *= t
    if t > DURATION - 1.2:
        g *= max(0.0, (DURATION - t) / 1.2)
    mix[0][i] += (bass + melody + pad) * g
    mix[1][i] += (bass + melody + pad) * g

# ---------- SFX ----------
# tick tiap detik selama timer (bukan saat reveal)
for q_start in (0, 10, 20):
    for s in range(6):
        t = q_start + s + 1  # 1..6 detik dari soal
        add(square(1300, 0.06, 0.7), t, 0.85)

# ding arpeggio saat reveal
DING = arpeggio([880, 1108.73, 1318.51], 0.13, 0.85)
for t in (7, 17, 27):
    add(DING, t, 1.0)

# hit/void ketukan saat masuk soal 2 (pattern interrupt)
add(thud(90, 0.4, 0.9), 10.0, 1.0)
add(noise_sweep(0.35, 0.5), 10.0, 0.7)

# sweep kecil tiap soal baru
add(noise_sweep(0.25, 0.35), 20.0, 0.5)

# fanfare outro
add(arpeggio([523.25, 659.25, 783.99, 1046.5], 0.16, 0.8), QUIZ_END, 0.9)

# ---------- normalisasi + tulis ----------
peak = max(max(abs(v) for v in mix[0]), max(abs(v) for v in mix[1]))
gain = 0.92 / peak if peak > 0 else 1.0

out = wave.open('audio/sfx/quiz_v21.wav', 'wb')
out.setnchannels(2)
out.setsampwidth(2)
out.setframerate(SR)
frames = bytearray()
for i in range(N):
    for ch in (0, 1):
        v = mix[ch][i] * gain
        v = max(-1.0, min(1.0, v))
        frames += struct.pack('<h', int(v * 32767))
out.writeframes(bytes(frames))
out.close()

print(f'audio/sfx/quiz_v21.wav · {DURATION}s · peak gain {gain:.2f}')