"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";

export interface TocEntry {
  id: string;
  label: string;
  kind: "heading" | "exercise" | "quiz" | "terminal" | "code";
  /** za vežbe: id vežbe, da prikažemo ✓ */
  exerciseId?: string;
}

/** Tanka linija na vrhu koja pokazuje koliko je lekcije pročitano. */
export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-14 z-30 h-[2px] lg:top-0 lg:left-[272px]">
      <div className="h-full origin-left bg-hue transition-transform duration-150 ease-out" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

/** Pamti poslednju otvorenu lekciju (za "Nastavi" na početnoj). */
export function LessonTracker({ lessonKey }: { lessonKey: string }) {
  const visit = useProgress((s) => s.visitLesson);
  useEffect(() => visit(lessonKey), [lessonKey, visit]);
  return null;
}

/** Sadržaj lekcije sa desne strane, prati gde si (scroll-spy). */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(null);
  const ready = useIsClient();
  const solved = useProgress((s) => s.solved);

  useEffect(() => {
    const els = entries.map((e) => document.getElementById(e.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav aria-label="Na ovoj stranici" className="text-[13px]">
      <div className="mb-3 text-[11px] font-medium tracking-[0.08em] text-faint uppercase">Na ovoj stranici</div>
      <ul className="relative space-y-0.5 border-l border-line">
        {entries.map((e) => {
          const isActive = active === e.id;
          const isSolved = ready && e.exerciseId && solved[e.exerciseId];
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                className={cn(
                  "-ml-px flex items-center gap-2 border-l py-1 pl-3.5 leading-snug transition-colors",
                  isActive ? "border-hue text-fg" : "border-transparent text-faint hover:text-muted",
                  e.kind !== "heading" && "text-[12.5px]",
                )}
              >
                <span className="flex-1">{e.label}</span>
                {isSolved && <Check size={12} className="shrink-0 text-success" strokeWidth={3} />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
