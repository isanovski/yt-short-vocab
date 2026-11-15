import wave
import struct
import math
import os

SR = 44100
DURATION = 38  # seconds
TOTAL_SAMPLES = SR * DURATION

# Load SFX
def load_wav(path):
    w = wave.open(path, 'rb')
    n_channels = w.getnchannels()
    sampwidth = w.getsampwidth()
    framerate = w.getframerate()
    n_frames = w.getnframes()
    raw = w.readframes(n_frames)
    w.close()
    # Convert to mono float samples
    samples = []
    for i in range(0, len(raw), sampwidth * n_channels):
        frame = raw[i:i+sampwidth*n_channels]
        # Take first channel (mono)
        val = struct.unpack('<h', frame[:sampwidth])[0] / 32768.0
        samples.append(val)
    return samples

tick = load_wav('audio/sfx/tick.wav')
ding = load_wav('audio/sfx/ding.wav')
whoosh = load_wav('audio/sfx/whoosh.wav')
chime = load_wav('audio/sfx/chime.wav')

# Mix buffer (stereo)
mix = [[0.0] * TOTAL_SAMPLES for _ in range(2)]

def add_at(sound, start_sample, gain=1.0):
    for i, val in enumerate(sound):
        idx = start_sample + i
        if idx >= TOTAL_SAMPLES:
            break
        mix[0][idx] += val * gain
        mix[1][idx] += val * gain

# Intro whoosh at 0.5s
add_at(whoosh, int(0.5 * SR), 0.7)

# Q1 timer ticks: 4s, 5s, 6s, 7s, 8s, 9s (composition time)
for t in [4.0, 5.0, 6.0, 7.0, 8.0, 9.0]:
    add_at(tick, int(t * SR), 0.6)
# Q1 reveal ding at 10s
add_at(ding, int(10.0 * SR), 0.8)

# Q2 timer ticks: 14s, 15s, 16s, 17s, 18s, 19s
for t in [14.0, 15.0, 16.0, 17.0, 18.0, 19.0]:
    add_at(tick, int(t * SR), 0.6)
# Q2 reveal ding at 20s
add_at(ding, int(20.0 * SR), 0.8)

# Q3 timer ticks: 24s, 25s, 26s, 27s, 28s, 29s
for t in [24.0, 25.0, 26.0, 27.0, 28.0, 29.0]:
    add_at(tick, int(t * SR), 0.6)
# Q3 reveal ding at 30s
add_at(ding, int(30.0 * SR), 0.8)

# Outro chime at 33s
add_at(chime, int(33.0 * SR), 0.8)

# Clamp to prevent clipping
for ch in range(2):
    for i in range(TOTAL_SAMPLES):
        v = mix[ch][i]
        if v > 1.0: v = 1.0
        if v < -1.0: v = -1.0
        mix[ch][i] = v

# Write output WAV
out = wave.open('audio/sfx/full_mix.wav', 'wb')
out.setnchannels(2)
out.setsampwidth(2)
out.setframerate(SR)
for i in range(TOTAL_SAMPLES):
    for ch in range(2):
        val = int(mix[ch][i] * 32767)
        out.writeframes(struct.pack('<h', val))
out.close()

print("Audio mix written: audio/sfx/full_mix.wav")
print(f"Duration: {DURATION}s, Samples: {TOTAL_SAMPLES}")
