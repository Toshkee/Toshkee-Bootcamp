"use client";

import { ArrowRight, Layers, PartyPopper, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/plural";
import { useProgress } from "@/lib/progress";
import { GRADES, newCard, previewInterval, type Grade } from "@/lib/srs";
import { useIsClient } from "@/lib/use-is-client";
import { useNow } from "@/lib/use-now";

export interface ReviewCard {
  id: string;
  front: React.ReactNode;
  back: React.ReactNode;
  lessonTitle: string;
  lessonHref: string;
  moduleTitle: string;
  hue: string;
}

const GRADE_STYLE: Record<Grade, string> = {
  0: "hover:border-[color-mix(in_oklab,var(--danger)_45%,transparent)] hover:text-danger",
  1: "hover:border-[color-mix(in_oklab,var(--warn)_45%,transparent)] hover:text-warn",
  2: "hover:border-[color-mix(in_oklab,var(--success)_45%,transparent)] hover:text-success",
  3: "hover:border-[color-mix(in_oklab,var(--info)_45%,transparent)] hover:text-info",
};

export function Review({ cards }: { cards: ReviewCard[] }) {
  const ready = useIsClient();
  const state = useProgress((s) => s.cards);
  const grade = useProgress((s) => s.gradeCard);

  const now = useNow();
  const [session, setQueue] = useState<string[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  const owned = ready ? cards.filter((c) => state[c.id]) : [];

  const dueIds = (all: boolean) =>
    cards
      .filter((c) => state[c.id] && (all || state[c.id].due <= now))
      .sort((a, b) => state[a.id].due - state[b.id].due)
      .map((c) => c.id);

  // Sesija počinje sama čim se napredak učita: sve kartice kojima je došao red
  const queue = session ?? (ready ? dueIds(false) : null);

  const startSession = (all = false) => {
    setQueue(dueIds(all));
    setFlipped(false);
    setReviewed(0);
  };

  const current = queue && queue.length > 0 ? byId.get(queue[0]) : undefined;

  const answer = (g: Grade) => {
    if (!current || !queue) return;
    grade(current.id, g);
    setReviewed((n) => n + 1);
    setFlipped(false);
    // "Ponovo" vraća karticu na kraj današnje sesije
    setQueue(g === 0 ? [...queue.slice(1), current.id] : queue.slice(1));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || (e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped && ["1", "2", "3", "4"].includes(e.key)) {
        answer((Number(e.key) - 1) as Grade);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const nextDue = useMemo(() => {
    const dues = Object.values(state).map((c) => c.due).filter((d) => d > now);
    return dues.length ? Math.min(...dues) : undefined;
  }, [state, now]);

  const remaining = queue?.length ?? 0;
  const total = reviewed + remaining;

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-[#a78bfa] opacity-[0.10] blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-[680px] flex-col px-5 pt-10 pb-16 sm:px-8 lg:min-h-dvh lg:pt-16">
        <header className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[11.5px] font-medium tracking-[0.12em] text-faint uppercase">Ponavljanje</div>
            <h1 className="mt-2 font-display text-[44px] leading-none">Kartice</h1>
          </div>
          {ready && owned.length > 0 && (
            <div className="text-right text-[13px] text-faint">
              <div className="inline-flex items-center gap-1.5">
                <Layers size={13} /> {owned.length} {plural(owned.length, "kartica", "kartice", "kartica")} ukupno
              </div>
            </div>
          )}
        </header>

        {!ready || queue === null ? (
          <div className="mt-10 h-[340px] animate-pulse rounded-3xl bg-subtle" />
        ) : owned.length === 0 ? (
          <Empty
            title="Još nema kartica"
            text="Svaka završena lekcija dodaje 3 do 5 kartica sa najvažnijim pojmovima. Vraćaju se taman kad počneš da ih zaboravljaš."
            action={
              <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-[14px] font-medium text-bg">
                Na početnu <ArrowRight size={15} />
              </Link>
            }
          />
        ) : !current ? (
          <Empty
            icon={<PartyPopper size={22} />}
            title={reviewed > 0 ? "Gotovo za danas." : "Nema kartica za danas."}
            text={
              (reviewed > 0 ? `Ponovljeno: ${reviewed}. ` : "") +
              (nextDue ? `Sledeća kartica stiže ${formatDue(nextDue - now)}.` : "")
            }
            action={
              <button
                type="button"
                onClick={() => startSession(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-strong px-4 text-[14px] text-muted transition-colors hover:text-fg"
              >
                <RotateCw size={15} /> Ponovi sve svejedno
              </button>
            }
          />
        ) : (
          <div className="mt-10 flex flex-1 flex-col">
            <div className="mb-3 flex items-center gap-3 text-[12.5px] text-faint">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-fg transition-[width] duration-500" style={{ width: `${(reviewed / total) * 100}%` }} />
              </div>
              <span className="tabular-nums">
                {reviewed}/{total}
              </span>
            </div>

            {/* Kartica koja se okreće */}
            <div
              key={current.id + reviewed}
              className="animate-pop [perspective:1600px]"
              style={{ "--hue": current.hue } as React.CSSProperties}
            >
              <div
                className={cn(
                  "relative grid min-h-[340px] transition-transform duration-500 [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                  flipped && "[transform:rotateY(180deg)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="col-start-1 row-start-1 flex flex-col rounded-3xl border border-line bg-elev p-7 text-left shadow-card [backface-visibility:hidden] sm:p-9"
                  aria-label="Okreni karticu"
                >
                  <CardMeta card={current} />
                  <div className="flex flex-1 items-center py-6">{current.front}</div>
                  <div className="flex items-center gap-2 text-[12.5px] text-faint">
                    <Kbd>space</Kbd> ili klikni da vidiš odgovor
                  </div>
                </button>
                <div className="col-start-1 row-start-1 flex flex-col rounded-3xl border border-hue-soft bg-elev p-7 shadow-card [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-9">
                  <CardMeta card={current} />
                  <div className="mt-5 text-[15px] text-faint">{current.front}</div>
                  <div className="my-5 h-px bg-line" />
                  <div className="flex-1">{current.back}</div>
                </div>
              </div>
            </div>

            <div className={cn("mt-6 grid grid-cols-4 gap-2 transition-opacity duration-300", !flipped && "pointer-events-none opacity-0")}>
              {GRADES.map((g) => (
                <button
                  key={g.grade}
                  type="button"
                  onClick={() => answer(g.grade)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border border-line bg-elev px-2 py-3 text-[14px] font-medium transition-all active:scale-[0.97]",
                    GRADE_STYLE[g.grade],
                  )}
                >
                  {g.label}
                  <span className="flex items-center gap-1.5 text-[11.5px] font-normal text-faint">
                    <Kbd className="h-4 min-w-4 text-[10px]">{g.key}</Kbd>
                    {previewInterval(state[current.id] ?? newCard(), g.grade)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CardMeta({ card }: { card: ReviewCard }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-faint">
      <span className="size-2 rounded-full" style={{ background: card.hue }} />
      {card.moduleTitle}
      <span>·</span>
      <Link href={card.lessonHref} onClick={(e) => e.stopPropagation()} className="truncate hover:text-fg">
        {card.lessonTitle}
      </Link>
    </div>
  );
}

function Empty({ icon, title, text, action }: { icon?: React.ReactNode; title: string; text: string; action: React.ReactNode }) {
  return (
    <div className="animate-fade-up mt-10 flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-subtle text-muted">{icon ?? <Layers size={22} />}</span>
      <div className="mt-5 font-display text-[32px] leading-tight">{title}</div>
      {text && <p className="mt-2 max-w-sm text-[15px] text-muted">{text}</p>}
      <div className="mt-6">{action}</div>
    </div>
  );
}

function formatDue(diff: number) {
  const h = Math.round(diff / 3_600_000);
  if (h < 1) return "za par minuta";
  if (h < 24) return `za ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "sutra" : `za ${d} ${plural(d, "dan", "dana", "dana")}`;
}
