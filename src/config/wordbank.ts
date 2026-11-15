/* Bank kosakata B2–C1 untuk ENGLISH WORD LAB.
   Semua distractor sengaja mirip (awalan/akhiran sama) supaya benar-benar menguji
   pemahaman, bukan tebak-tebakan. Format mengikuti Word di src/config/types.ts. */

import type { Word } from './types';

export const WORD_BANK: readonly Word[] = [
  { idn: 'Tidak memihak', correct: 'Impartial', opts: ['Impartial', 'Partial', 'Impassive', 'Imperative'] },
  { idn: 'Berlimpah', correct: 'Abundant', opts: ['Abundant', 'Abandoned', 'Absurd', 'Adamant'] },
  { idn: 'Gigih', correct: 'Tenacious', opts: ['Tenacious', 'Tedious', 'Terrific', 'Tentative'] },
  { idn: 'Berkurang', correct: 'Diminish', opts: ['Diminish', 'Demolish', 'Distinguish', 'Dismantle'] },
  { idn: 'Ragu-ragu', correct: 'Hesitant', opts: ['Hesitant', 'Hereditary', 'Heretical', 'Hazardous'] },
  { idn: 'Menghindari', correct: 'Avert', opts: ['Avert', 'Assert', 'Advert', 'Abort'] },
  { idn: 'Menyeluruh', correct: 'Comprehensive', opts: ['Comprehensive', 'Compulsory', 'Competitive', 'Complicated'] },
  { idn: 'Sementara', correct: 'Ephemeral', opts: ['Ephemeral', 'Eternal', 'Ancient', 'Permanent'] },
  { idn: 'Tidak jelas', correct: 'Ambiguous', opts: ['Ambiguous', 'Ambitious', 'Amphibious', 'Amicable'] },
  { idn: 'Kemunduran', correct: 'Setback', opts: ['Setback', 'Settle', 'Setup', 'Severe'] },
  { idn: 'Menyebabkan', correct: 'Induce', opts: ['Induce', 'Deduce', 'Reduce', 'Produce'] },
  { idn: 'Tahan lama', correct: 'Durable', opts: ['Durable', 'Dutiful', 'Dubious', 'Dual'] },
  { idn: 'Teliti', correct: 'Meticulous', opts: ['Meticulous', 'Miraculous', 'Melodious', 'Monotonous'] },
  { idn: 'Peka', correct: 'Susceptible', opts: ['Susceptible', 'Sustainable', 'Suspicious', 'Successive'] },
  { idn: 'Menyerah', correct: 'Relinquish', opts: ['Relinquish', 'Refurbish', 'Replenish', 'Reestablish'] },
  { idn: 'Mengurangi', correct: 'Mitigate', opts: ['Mitigate', 'Meditate', 'Motivate', 'Migrate'] },
  { idn: 'Tiba-tiba', correct: 'Abrupt', opts: ['Abrupt', 'Abrasive', 'Absorbent', 'Abstract'] },
  { idn: 'Berlebihan', correct: 'Exorbitant', opts: ['Exorbitant', 'Exuberant', 'Exotic', 'Exempt'] },
  { idn: 'Rajin', correct: 'Diligent', opts: ['Diligent', 'Divergent', 'Different', 'Diffident'] },
  { idn: 'Menguntungkan', correct: 'Lucrative', opts: ['Lucrative', 'Ludicrous', 'Luminous', 'Lukewarm'] },
  { idn: 'Banyak bicara', correct: 'Garrulous', opts: ['Garrulous', 'Gregarious', 'Glorious', 'Gracious'] },
  { idn: 'Sulit diatur', correct: 'Unruly', opts: ['Unruly', 'Uneasy', 'Uncanny', 'Unwary'] },
  { idn: 'Menyamarkan', correct: 'Obfuscate', opts: ['Obfuscate', 'Clarify', 'Simplify', 'Explain'] },
  { idn: 'Meramalkan', correct: 'Anticipate', opts: ['Anticipate', 'Antiquate', 'Antagonize', 'Annotate'] },
];