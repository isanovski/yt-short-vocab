# eng-short — English Word Lab (YouTube Shorts)

Remotion project untuk Shorts kuis kosakata bahasa Inggris: 1080×1920 @30fps, **38 detik**
(3s intro + 3 kata × [7s timer + 3s reveal] + 5s outro). Tanpa GPU, render ~8 menit di VPS 2 vCPU.

Desain sengaja editorial-terang: latar terang, teks gelap, dan **warna dipilih acak tiap render**.

## Struktur

```
src/
├── index.ts                     # entry Remotion
├── Root.tsx                     # komposisi VocabQuiz + hitung durasi
├── compositions/VocabQuiz.tsx   # seluruh scene (intro, soal, outro)
├── lib/rng.ts                   # RNG deterministik dari seed (mulberry32)
├── config/
│   ├── default.ts               # KONFIGURASI VIDEO (kata, mode, seed, timing)
│   ├── palettes.ts              # 8 palet warna terkurasi (dipilih acak)
│   ├── wordbank.ts              # 24 kosakata B2–C1 untuk mode acak
│   ├── types.ts                 # tipe VideoConfig
│   └── index.ts                 # re-export + getTotalFrames()
├── theme.ts                     # (legacy, tidak dipakai komposisi baru)
├── anim/ components/ scenes/    # (legacy dari versi kuis sebelumnya)
audio/
├── gen_wordlab_mix.py           # generator BGM + SFX (38s, sinkron timer)
└── sfx/wordlab_mix.wav          # hasil mix yang dipakai render
```

## Aturan desain

- **Semua elemen di tengah** (kata, ring timer, kartu opsi, outro). Tidak ada hook, badge "1/3",
  label "translate this", atau teks bantu di scene kuis.
- **Kartu opsi tanpa huruf A–D** — hanya katanya.
- **Jawaban benar ditandai sekali**: kartu jadi warna aksen + border tegas, kartu lain diredupkan.
  Tidak ada banner "JAWABAN BENAR", tidak ada contoh kalimat.
- **Timer ring mengosongkan** (countdown), lalu jadi ✓ saat reveal.
- Motion kalem: satu spring masuk (`damping 18, stiffness 220`), stagger 2 frame per kartu.
- Safe zone YouTube Shorts: teks hanya di `y ∈ [380, 1540]`.

## Warna acak tiap video

Palet dipilih acak dari `src/config/palettes.ts` setiap render, dan dicatat di log:

```
[wordlab] seed=1757900000000-482913 palette=ocean words=Impartial / Abundant / Tenacious
```

- Mau warna lain? Render ulang — ada 8 palet.
- Mau mengulang warna & kata yang sama? Set `VOCAB_SEED`:

```bash
VOCAB_SEED=ocean-1 ./node_modules/.bin/remotion render src/index.ts VocabQuiz out/v.mp4 --concurrency=1
```

- Mau permanen? Isi `video.seed` di `src/config/default.ts` dengan string apa pun.

## Alur bikin video baru

1. **Tanyakan dulu ke user** mau kosakata apa (tema atau daftar kata). Jangan pilih sendiri.
2. Pilih mode di `src/config/default.ts`:
   - `content.mode: 'fixed'` → tulis kata pilihan user di `content.words`
     (`{ idn, correct, opts: [4 opsi] }`; distractor sebaiknya mirip supaya tidak mudah).
   - `content.mode: 'random'` + `content.randomCount: 3` → ambil acak dari `src/config/wordbank.ts`.
3. Warna tidak perlu diatur — otomatis acak (isi `video.seed` kalau mau dikunci).
4. Render + mix audio:

```bash
cd /home/ubuntu/eng-short
rm -rf node_modules/.cache node_modules/.remotion
./node_modules/.bin/remotion render src/index.ts VocabQuiz out/nama.mp4 --concurrency=1 --log=error
python3 audio/gen_wordlab_mix.py
ffmpeg -y -i out/nama.mp4 -i audio/sfx/wordlab_mix.wav \
  -c:v copy -c:a aac -b:a 192k -shortest -map 0:v:0 -map 1:a:0 out/nama-final.mp4
```

## Audio

`audio/gen_wordlab_mix.py` membuat semuanya dari nol (stdlib Python saja):

- BGM pad akor (Am–F–C–G), loop, gain rendah.
- `tick` tiap detik countdown; 3 tick terakhir lebih tegas.
- `ding` arpeggio tepat di frame reveal (t = 10s, 20s, 30s).
- `whoosh` di awal tiap soal + intro; `riser` menjelang soal pertama.
- `fanfare` di awal outro (t = 33s). Output 38s, peak ~0.89.

## Perintah lain

```bash
npx tsc --noEmit                     # cek tipe (harus bersih)
./node_modules/.bin/remotion still src/index.ts VocabQuiz out/cek.png --frame=150
ffprobe -v error -show_entries format=duration,size -of default=nw=1 out/nama-final.mp4
```

**Penting:** kalau hasil render masih terlihat seperti kode lama, hapus cache bundler:
`rm -rf node_modules/.cache node_modules/.remotion`.

## License

All Rights Reserved — lihat `LICENSE`.