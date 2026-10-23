/** Ključ dana u lokalnoj zoni: "2026-10-23". */
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Broj uzastopnih dana sa aktivnošću, zaključno sa danas (ili juče, ako danas još nema aktivnosti). */
export function streak(days: string[], today = new Date()): number {
  const set = new Set(days);
  const d = new Date(today);
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
