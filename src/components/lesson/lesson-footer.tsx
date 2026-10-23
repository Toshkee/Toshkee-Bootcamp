"use client";

import { ArrowRight, Check, Layers, PartyPopper, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/plural";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";
import { Burst } from "./burst";

export function LessonFooter({
  lessonKey,
  cardIds,
  exerciseIds,
  quizIds,
  terminals,
  next,
  moduleHref,
  moduleTitle,
}: {
  lessonKey: string;
  cardIds: string[];
  exerciseIds: string[];
  quizIds: { id: string; total: number }[];
  terminals: { id: string; total: number }[];
  next?: { title: string; href: string; moduleTitle: string; hue: string; sameModule: boolean };
  moduleHref: string;
  moduleTitle: string;
}) {
  const ready = useIsClient();
  const completedAt = useProgress((s) => s.completed[lessonKey]);
  const solved = useProgress((s) => s.solved);
  const quizzes = useProgress((s) => s.quizzes);
  const terminalProgress = useProgress((s) => s.terminals);
  const complete = useProgress((s) => s.completeLesson);
  const uncomplete = useProgress((s) => s.uncompleteLesson);
  const [celebrate, setCelebrate] = useState(0);

  const done = ready && !!completedAt;

  const checklist = [
    ...(exerciseIds.length
      ? [{ label: "Vežbe", value: exerciseIds.filter((id) => solved[id]).length, total: exerciseIds.length }]
      : []),
    ...(terminals.length
      ? [
          {
            label: "Terminal",
            value: terminals.filter((t) => (terminalProgress[t.id] ?? 0) >= t.total).length,
            total: terminals.length,
          },
        ]
      : []),
    ...(quizIds.length
      ? [
          {
            label: "Kviz",
            value: quizIds.filter((q) => Object.keys(quizzes[q.id] ?? {}).length >= q.total).length,
            total: quizIds.length,
          },
        ]
      : []),
  ];
  const allDone = ready && checklist.every((c) => c.value >= c.total);

  return (
    <section className="mt-16 mb-8">
      {!done ? (
        <div className="rounded-2xl border border-line bg-elev p-6 shadow-card sm:p-8">
          <div className="font-display text-[2rem] leading-tight">Kraj lekcije</div>
          <p className="mt-1 text-[15px] text-muted">
            {allDone
              ? "Sve je urađeno. Označi lekciju kao završenu i kartice iz nje ulaze u ponavljanje."
              : "Kad prođeš vežbe i kviz, označi lekciju kao završenu. Kartice iz nje tada ulaze u ponavljanje."}
          </p>
          {checklist.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {checklist.map((c) => {
                const ok = ready && c.value >= c.total;
                return (
                  <span
                    key={c.label}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px]",
                      ok
                        ? "border-[color-mix(in_oklab,var(--success)_35%,transparent)] text-success"
                        : "border-line text-muted",
                    )}
                  >
                    {ok ? <Check size={13} strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-faint" />}
                    {c.label}
                    <span className="tabular-nums opacity-70">
                      {ready ? c.value : 0}/{c.total}
                    </span>
                  </span>
                );
              })}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              complete(lessonKey, cardIds);
              setCelebrate((c) => c + 1);
            }}
            className={cn(
              "mt-6 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[15px] font-medium transition-all active:scale-[0.98]",
              allDone ? "bg-hue text-bg shadow-[0_8px_30px_-8px_var(--hue)] hover:brightness-110" : "bg-fg text-bg hover:opacity-90",
            )}
          >
            <Check size={17} strokeWidth={2.75} />
            Završi lekciju
          </button>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-hue-soft bg-elev p-6 shadow-card sm:p-8">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--hue)" }}
          />
          <div className="relative flex items-start gap-4">
            <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-hue text-bg">
              <PartyPopper size={20} />
              <Burst trigger={celebrate} count={20} />
            </span>
            <div className="flex-1">
              <div className="font-display text-[2rem] leading-tight">Lekcija završena</div>
              <p className="mt-1 flex items-center gap-1.5 text-[14.5px] text-muted">
                <Layers size={14} />
                {cardIds.length} {plural(cardIds.length, "kartica dodata", "kartice dodate", "kartica dodato")} u ponavljanje.
              </p>
            </div>
          </div>
          {next ? (
            <Link
              href={next.href}
              className="group relative mt-6 flex items-center gap-4 rounded-xl border border-line bg-subtle/50 p-4 transition-colors hover:border-line-strong hover:bg-subtle"
              style={{ "--hue": next.hue } as React.CSSProperties}
            >
              <div className="flex-1">
                <div className="text-[12px] font-medium text-faint">
                  {next.sameModule ? "Sledeća lekcija" : `Sledeći modul · ${next.moduleTitle}`}
                </div>
                <div className="mt-0.5 text-[17px] font-semibold tracking-tight">{next.title}</div>
              </div>
              <span className="grid size-10 place-items-center rounded-full bg-fg text-bg transition-transform group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </Link>
          ) : (
            <Link
              href={moduleHref}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-[14px] font-medium text-bg"
            >
              Nazad na modul {moduleTitle} <ArrowRight size={15} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => uncomplete(lessonKey)}
            className="relative mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-faint hover:text-muted"
          >
            <Undo2 size={12} /> Označi kao nezavršenu
          </button>
        </div>
      )}
    </section>
  );
}
