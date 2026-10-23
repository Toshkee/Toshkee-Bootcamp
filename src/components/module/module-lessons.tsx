"use client";

import { ArrowRight, Check, Clock } from "lucide-react";
import Link from "next/link";
import { InlineCode } from "@/components/ui/inline-code";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/cn";
import type { NavModule } from "@/lib/nav";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";

export function ModuleLessons({ module }: { module: NavModule }) {
  const ready = useIsClient();
  const completed = useProgress((s) => s.completed);
  const solved = useProgress((s) => s.solved);
  const done = ready ? module.lessons.filter((l) => completed[l.key]).length : 0;
  const nextKey = ready ? module.lessons.find((l) => !completed[l.key])?.key : module.lessons[0]?.key;

  if (module.lessons.length === 0) {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
        Lekcije za ovaj modul se još pišu.
      </div>
    );
  }

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[13px] font-medium tracking-[0.08em] text-faint uppercase">Lekcije</h2>
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <ProgressRing value={module.lessons.length ? done / module.lessons.length : 0} size={18} />
          {done}/{module.lessons.length} završeno
        </div>
      </div>
      <ol className="relative">
        <span aria-hidden className="absolute top-6 bottom-6 left-[27px] w-px bg-line" />
        {module.lessons.map((l, i) => {
          const isDone = ready && !!completed[l.key];
          const isNext = l.key === nextKey;
          const exDone = ready ? l.exerciseIds.filter((id) => solved[id]).length : 0;
          return (
            <li key={l.key} className="animate-fade-up relative" style={{ animationDelay: `${i * 50}ms` }}>
              <Link
                href={l.href}
                className={cn(
                  "group flex items-start gap-5 rounded-2xl p-3.5 transition-colors hover:bg-elev",
                  isNext && "bg-elev shadow-card ring-1 ring-line",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid size-[30px] shrink-0 place-items-center rounded-full border text-[12.5px] font-semibold transition-colors",
                    isDone && "border-transparent bg-hue text-bg",
                    isNext && !isDone && "border-hue bg-bg text-hue-strong",
                    !isDone && !isNext && "border-line-strong bg-bg text-faint",
                  )}
                >
                  {isDone ? <Check size={15} strokeWidth={3} /> : i + 1}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-semibold tracking-tight">{l.title}</span>
                    {isNext && (
                      <span className="rounded-full bg-hue-soft px-2 py-0.5 text-[11px] font-medium text-hue-strong">
                        {done === 0 ? "Počni ovde" : "Sledeća"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-muted"><InlineCode text={l.summary} /></p>
                  <div className="mt-2 flex items-center gap-3 text-[12.5px] text-faint">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {l.minutes} min
                    </span>
                    {l.exerciseIds.length > 0 && (
                      <span>
                        Vežbe {exDone}/{l.exerciseIds.length}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1.5 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
