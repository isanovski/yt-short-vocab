/* Palet warna untuk ENGLISH WORD LAB.
   Semua palet berbasis terang + teks gelap supaya struktur desain tetap konsisten;
   yang berubah tiap video hanya rasa warnanya.
   Dipilih acak per render oleh src/lib/rng.ts (seed bisa dipatok di config). */

export type Palette = {
  readonly name: string;
  /** latar utama */
  readonly base: string;
  /** teks utama & border tegas */
  readonly ink: string;
  /** highlight jawaban benar + kotak intro */
  readonly accent: string;
  /** blob kedua + tanda salah */
  readonly accent2: string;
  /** ring timer saat menghitung */
  readonly accent3: string;
  /** teks sekunder */
  readonly muted: string;
};

export const PALETTES: readonly Palette[] = [
  {
    name: 'citrus',
    base: '#F7F4EC',
    ink: '#101828',
    accent: '#D7F36B',
    accent2: '#FF8552',
    accent3: '#5B7CFA',
    muted: '#697386',
  },
  {
    name: 'berry',
    base: '#FDF3F7',
    ink: '#22112B',
    accent: '#F9A8D4',
    accent2: '#A78BFA',
    accent3: '#7C3AED',
    muted: '#6B5A78',
  },
  {
    name: 'ocean',
    base: '#EFF6FF',
    ink: '#0B1B33',
    accent: '#67E8F9',
    accent2: '#3B82F6',
    accent3: '#0EA5E9',
    muted: '#5B7288',
  },
  {
    name: 'sand',
    base: '#FAF3E8',
    ink: '#1F1A14',
    accent: '#FCD34D',
    accent2: '#F97316',
    accent3: '#B45309',
    muted: '#7A6A55',
  },
  {
    name: 'mint',
    base: '#F0FBF5',
    ink: '#0C1F17',
    accent: '#86EFAC',
    accent2: '#10B981',
    accent3: '#059669',
    muted: '#4F7061',
  },
  {
    name: 'lavender',
    base: '#F5F3FF',
    ink: '#1B1633',
    accent: '#C4B5FD',
    accent2: '#8B5CF6',
    accent3: '#6366F1',
    muted: '#635C82',
  },
  {
    name: 'coral',
    base: '#FFF5F2',
    ink: '#231010',
    accent: '#FDA4AF',
    accent2: '#FB7185',
    accent3: '#F43F5E',
    muted: '#866060',
  },
  {
    name: 'graphite',
    base: '#F4F5F7',
    ink: '#0F172A',
    accent: '#A5F3FC',
    accent2: '#64748B',
    accent3: '#334155',
    muted: '#5A6577',
  },
];
