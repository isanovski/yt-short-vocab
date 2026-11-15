import wave
import struct
import math
import os

SR = 44100
DURATION = 38  # seconds
TOTAL_SAMPLES = SR * DURATION

def load_wav(path):
    w = wave.open(path, 'rb')
    n_channels = w.getnchannels()
    sampwidth = w.getsampwidth()
    framerate = w.getframerate()
    n_frames = w.getnframes()
    raw = w.readframes(n_frames)
    w.close()
    samples = []
    for i in range(0, len(raw), sampwidth * n_channels):
        frame = raw[i:i+sampwidth*n_channels]
        val = struct.unpack('<h', frame[:sampwidth])[0] / 32768.0
        samples.append(val)
    return samples

def gen_sine(freq, dur, vol=0.8, fade=0.02):
    """Generate a sine wave tone."""
    n = int(SR * dur)
    samples = []
    for i in range(n):
        t = i / SR
        env = 1.0
        if t < fade:
            env = t / fade
        if t > dur - fade:
            env = (dur - t) / fade
        samples.append(math.sin(2 * math.pi * freq * t) * env * vol)
    return samples

def gen_square(freq, dur, vol=0.7, fade=0.01):
    """Generate a square wave (more aggressive/readable)."""
    n = int(SR * dur)
    samples = []
    for i in range(n):
        t = i / SR
        env = 1.0
        if t < fade:
            env = t / fade
        if t > dur - fade:
            env = (dur - t) / fade
        sq = 1.0 if math.sin(2 * math.pi * freq * t) > 0 else -1.0
        samples.append(sq * env * vol)
    return samples

def gen_noise_sweep(dur, vol=0.6, fade=0.05):
    """Generate white noise sweep (whoosh sound)."""
    n = int(SR * dur)
    samples = []
    for i in range(n):
        t = i / SR
        env = 1.0
        if t < fade:
            env = t / fade
        if t > dur - fade:
            env = (dur - t) / fade
        # Sweep noise frequency: low to high then fade
        noise = (math.sin(2 * math.pi * 200 * t) * 0.3 +
                 math.sin(2 * math.pi * 800 * t * (1 + t)) * 0.4 +
                 math.sin(2 * math.pi * 3000 * t * t) * 0.3)
        samples.append(noise * env * vol)
    return samples

def gen_arpeggio(notes, dur_per_note, vol=0.7):
    """Generate ascending arpeggio (for correct answer)."""
    samples = []
    for note_freq in notes:
        note_samples = gen_sine(note_freq, dur_per_note, vol=vol, fade=0.03)
        samples.extend(note_samples)
    return samples

def gen_fanfare(dur, vol=0.8):
    """Generate a celebratory fanfare (outro)."""
    # C major arpeggio + root
    notes = [523.25, 659.25, 783.99, 1046.50]  # C E G C
    samples = gen_arpeggio(notes, dur/len(notes), vol=vol)
    # Pad with root note
    root_samples = gen_sine(523.25, dur - len(samples)/SR, vol=vol*0.5, fade=0.2)
    samples.extend(root_samples)
    return samples

mix = [[0.0] * TOTAL_SAMPLES for _ in range(2)]

def add_at(sound, start_sample, gain=1.0):
    for i, val in enumerate(sound):
        idx = start_sample + i
        if idx >= TOTAL_SAMPLES:
            break
        mix[0][idx] += val * gain
        mix[1][idx] += val * gain

# ---------------- Background music (louder, more prominent) ----------------
for i in range(TOTAL_SAMPLES):
    t = i / SR
    # Bass line
    bass_note = 110.0 * (2 ** (math.floor(t / 4) % 4 / 12))
    bass = 0.25 * math.sin(2 * math.pi * bass_note * t)
    # Melody (higher, more present)
    melody_idx = math.floor(t / 6) % 8
    melody_freqs = [220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]
    melody = 0.15 * math.sin(2 * math.pi * melody_freqs[melody_idx] * t)
    # Pad
    pad = 0.1 * math.sin(2 * math.pi * 55.0 * t) + 0.1 * math.sin(2 * math.pi * 82.41 * t)
    bg = bass + melody + pad
    if t < 1.0:
        bg *= t
    if t > DURATION - 1.0:
        bg *= (DURATION - t)
    mix[0][i] += bg * 0.6
    mix[1][i] += bg * 0.6

# ---------------- SFX (much louder) ----------------
# Intro whoosh at 0.5s
whoosh = gen_noise_sweep(1.0, vol=1.0)
add_at(whoosh, int(0.5 * SR), 0.9)

# Q1 timer ticks: 4s, 5s, 6s, 7s, 8s, 9s (sharp square beeps)
for t in [4.0, 5.0, 6.0, 7.0, 8.0, 9.0]:
    tick = gen_square(1200, 0.08, vol=0.9)
    add_at(tick, int(t * SR), 0.8)
# Q1 reveal ding at 10s (arpeggio)
ding = gen_arpeggio([880, 1108.73, 1318.51], 0.15, vol=1.0)
add_at(ding, int(10.0 * SR), 1.0)

# Q2 timer ticks: 14s-19s
for t in [14.0, 15.0, 16.0, 17.0, 18.0, 19.0]:
    tick = gen_square(1200, 0.08, vol=0.9)
    add_at(tick, int(t * SR), 0.8)
# Q2 reveal ding at 20s
add_at(ding, int(20.0 * SR), 1.0)

# Q3 timer ticks: 24s-29s
for t in [24.0, 25.0, 26.0, 27.0, 28.0, 29.0]:
    tick = gen_square(1200, 0.08, vol=0.9)
    add_at(tick, int(t * SR), 0.8)
# Q3 reveal ding at 30s
add_at(ding, int(30.0 * SR), 1.0)

# Outro fanfare at 33s
fanfare = gen_fanfare(4.0, vol=0.9)
add_at(fanfare, int(33.0 * SR), 0.9)

# Clamp
for ch in range(2):
    for i in range(TOTAL_SAMPLES):
        v = mix[ch][i]
        if v > 1.0: v = 1.0
        if v < -1.0: v = -1.0
        mix[ch][i] = v

out = wave.open('audio/sfx/full_mix_v3.wav', 'wb')
out.setnchannels(2)
out.setsampwidth(2)
out.setframerate(SR)
for i in range(TOTAL_SAMPLES):
    for ch in range(2):
        val = int(mix[ch][i] * 32767)
        out.writeframes(struct.pack('<h', val))
out.close()

print("Audio mix v3 written: audio/sfx/full_mix_v3.wav")
print(f"Duration: {DURATION}s, Samples: {TOTAL_SAMPLES}")
