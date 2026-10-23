/**
 * Pojednostavljen SM-2 algoritam za kartice: što bolje znaš karticu, to se ređe vraća.
 */

export interface CardState {
  /** Kada je kartica ponovo na redu (ms). */
  due: number;
  /** Trenutni razmak u danima. */
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
}

export type Grade = 0 | 1 | 2 | 3;

export const GRADES: { grade: Grade; label: string; key: string }[] = [
  { grade: 0, label: "Ponovo", key: "1" },
  { grade: 1, label: "Teško", key: "2" },
  { grade: 2, label: "Dobro", key: "3" },
  { grade: 3, label: "Lako", key: "4" },
];

const DAY = 24 * 60 * 60 * 1000;
const MINUTE = 60 * 1000;

export const newCard = (now = Date.now()): CardState => ({
  due: now,
  interval: 0,
  ease: 2.5,
  reps: 0,
  lapses: 0,
});

export function schedule(card: CardState, grade: Grade, now = Date.now()): CardState {
  const { reps, lapses } = card;
  let { interval, ease } = card;

  if (grade === 0) {
    return { due: now + MINUTE, interval: 0, ease: Math.max(1.3, ease - 0.2), reps: 0, lapses: lapses + 1 };
  }

  if (grade === 1) {
    interval = Math.max(1, interval * 1.2);
    ease = Math.max(1.3, ease - 0.15);
  } else if (grade === 2) {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : interval * ease;
  } else {
    interval = reps === 0 ? 3 : interval * ease * 1.3;
    ease += 0.15;
  }

  interval = Math.round(interval * 10) / 10;
  return { due: now + interval * DAY, interval, ease, reps: reps + 1, lapses };
}

/** Kako će izgledati sledeći razmak, za prikaz ispod dugmeta ("za 3 d"). */
export function previewInterval(card: CardState, grade: Grade): string {
  const next = schedule(card, grade, 0);
  const ms = next.due;
  if (ms < DAY) return "< 1 min";
  const days = Math.round(ms / DAY);
  if (days < 30) return `${days} d`;
  return `${Math.round(days / 30)} mes`;
}
