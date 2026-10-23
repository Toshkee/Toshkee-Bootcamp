"use client";

import { ArrowRight, Check, Flame, FolderGit2, KeyRound, Layers, Lock, Repeat2, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { InlineCode } from "@/components/ui/inline-code";
import { ModuleBadge } from "@/components/ui/module-icon";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/cn";
import { dayKey, streak } from "@/lib/dates";
import type { NavModule } from "@/lib/nav";
import { pad } from "@/lib/nav";
import { plural } from "@/lib/plural";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";
import { useNow } from "@/lib/use-now";

export interface ProjectCard {
  id: string;
  label: string;
  kind: string;
  lessons: number;
}

export function Dashboard({ nav, projects }: { nav: NavModule[]; projects: ProjectCard[] }) {
  const ready = useIsClient();
  const completed = useProgress((s) => s.completed);
  const solved = useProgress((s) => s.solved);
  const cards = useProgress((s) => s.cards);
  const days = useProgress((s) => s.days);
  const lastLesson = useProgress((s) => s.lastLesson);

  const active = nav.filter((m) => !m.upcoming);
  const lessons = active.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m })));
  const totalExercises = lessons.reduce((n, l) => n + l.exerciseIds.length, 0);

  const now = useNow();
  const stats = useMemo(() => {
    return {
      lessonsDone: ready ? lessons.filter((l) => completed[l.key]).length : 0,
      exercisesDone: ready ? lessons.flatMap((l) => l.exerciseIds).filter((id) => solved[id]).length : 0,
      due: ready ? Object.values(cards).filter((c) => c.due <= now).length : 0,
      totalCards: ready ? Object.keys(cards).length : 0,
      streak: ready ? streak(days) : 0,
    };
  }, [ready, lessons, completed, solved, cards, days, now]);

  const continueLesson = useMemo(() => {
    if (!ready) return lessons[0];
    const last = lessons.find((l) => l.key === lastLesson);
    if (last && !completed[last.key]) return last;
    return lessons.find((l) => !completed[l.key]);
  }, [ready, lessons, lastLesson, completed]);

  const started = ready && (Object.keys(completed).length > 0 || Object.keys(solved).length > 0 || !!lastLesson);
  const allDone = ready && lessons.length > 0 && !continueLesson;

  return (
    <div className="relative">
      {/* Hero pozadina */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden">
        <div className="absolute -top-48 left-[10%] size-[520px] rounded-full bg-[#4f8ff7] opacity-[0.10] blur-[110px]" />
        <div className="absolute -top-32 right-[5%] size-[420px] rounded-full bg-[#34d399] opacity-[0.08] blur-[110px]" />
        <div className="absolute top-20 left-[45%] size-[360px] rounded-full bg-[#facc15] opacity-[0.06] blur-[120px]" />
        <div className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-[1120px] px-5 pt-10 pb-24 sm:px-8 lg:pt-16">
        {/* Hero */}
        <section className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-fade-up">
            <div className="mb-5 h-5 text-[13px] text-faint">
              {ready && new Date().toLocaleDateString("sr-Latn-RS", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="font-display text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[72px]">
              Uči na <em className="text-muted">svom</em> kodu.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-muted">
              Svaka lekcija koristi prave isečke iz tvojih projekata, od ReformStudija i Looply-ja do portfolija. Čitaš, kucaš,
              pokrećeš i ponavljaš, dok ne postane tvoje.
            </p>
          </div>

          <div className="animate-fade-up [animation-delay:80ms]">
            {allDone ? (
              <div className="rounded-2xl border border-line bg-elev p-6 shadow-card">
                <Trophy className="text-warn" />
                <div className="mt-3 font-display text-3xl">Sve dostupne lekcije su završene.</div>
                <p className="mt-1 text-muted">Nastavi sa ponavljanjem kartica dok novi moduli ne stignu.</p>
              </div>
            ) : (
              continueLesson && (
                <Link
                  href={continueLesson.href}
                  className="group relative block overflow-hidden rounded-2xl border border-line bg-elev p-6 shadow-card transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ "--hue": continueLesson.module.hue } as React.CSSProperties}
                >
                  <div
                    className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-45"
                    style={{ background: continueLesson.module.hue }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2 text-[12.5px] font-medium text-hue-strong">
                      <ModuleBadge name={continueLesson.module.icon} hue={continueLesson.module.hue} size={22} />
                      {started ? "Nastavi" : "Počni ovde"} · {pad(continueLesson.module.index)} {continueLesson.module.title}
                    </div>
                    <div className="mt-4 text-[26px] leading-tight font-semibold tracking-tight">{continueLesson.title}</div>
                    <p className="mt-2 line-clamp-2 text-[14.5px] text-muted"><InlineCode text={continueLesson.summary} /></p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[13px] text-faint">{continueLesson.minutes} min</span>
                      <span className="inline-flex h-10 items-center gap-2 rounded-full bg-fg pr-2 pl-4 text-[14px] font-medium text-bg">
                        {started ? "Nastavi lekciju" : "Kreni"}
                        <span className="grid size-6 place-items-center rounded-full bg-bg/15 transition-transform group-hover:translate-x-0.5">
                          <ArrowRight size={14} />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>

        {/* Statistika */}
        <section className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={<Check size={15} />} label="Lekcije" value={stats.lessonsDone} total={lessons.length} />
          <Stat icon={<KeyRound size={15} />} label="Rešene vežbe" value={stats.exercisesDone} total={totalExercises} />
          <Stat
            icon={<Flame size={15} />}
            label="Niz dana"
            value={stats.streak}
            suffix={plural(stats.streak, "dan", "dana", "dana")}
            accent={stats.streak > 0 ? "#fb923c" : undefined}
          />
          <Link href="/review" className="group">
            <Stat
              icon={<Repeat2 size={15} />}
              label="Kartice za danas"
              value={stats.due}
              suffix={stats.totalCards ? `od ${stats.totalCards}` : undefined}
              accent={stats.due > 0 ? "#a78bfa" : undefined}
              arrow
            />
          </Link>
        </section>

        {ready ? <Heatmap days={days} /> : <div className="mt-3 h-[124px] rounded-2xl border border-line bg-elev/70" />}

        {/* Mapa modula */}
        <section id="mapa" className="mt-20 scroll-mt-20">
          <SectionTitle eyebrow="Put" title="Mapa bootcampa" sub="12 modula, sve tehnologije koje smo koristili zajedno. Novi moduli se otključavaju kako napreduješ." />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nav.map((m, i) => (
              <ModuleCard key={m.slug} module={m} completed={ready ? completed : {}} delay={i * 40} />
            ))}
          </div>
        </section>

        {/* Projekti */}
        <section className="mt-20">
          <SectionTitle eyebrow="Materijal" title="Tvoji projekti" sub="Odavde dolaze primeri. Svaki isečak koda u lekcijama ima link koji ga otvara na pravom mestu u editoru." />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-line bg-elev/60 p-4">
                <div className="flex items-center gap-2 text-[14.5px] font-semibold">
                  <FolderGit2 size={15} className="text-faint" />
                  {p.label}
                </div>
                <div className="mt-1 text-[12.5px] text-muted">{p.kind}</div>
                <div className="mt-3 text-[12px] text-faint">
                  {p.lessons > 0 ? `${p.lessons} ${plural(p.lessons, "lekcija koristi", "lekcije koriste", "lekcija koristi")} ovaj kod` : "Stiže u kasnijim modulima"}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-[11.5px] font-medium tracking-[0.12em] text-faint uppercase">{eyebrow}</div>
      <h2 className="mt-2 font-display text-[40px] leading-none tracking-[-0.01em]">{title}</h2>
      <p className="mt-3 text-[15.5px] text-muted">{sub}</p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  total,
  suffix,
  accent,
  arrow,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  suffix?: string;
  accent?: string;
  arrow?: boolean;
}) {
  return (
    <div className="relative h-full rounded-2xl border border-line bg-elev/70 p-4 transition-colors group-hover:border-line-strong sm:p-5">
      <div className="flex items-center gap-2 text-[12.5px] text-muted">
        <span style={{ color: accent }} className={cn(!accent && "text-faint")}>
          {icon}
        </span>
        {label}
        {arrow && <ArrowRight size={13} className="ml-auto text-faint transition-transform group-hover:translate-x-0.5" />}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[34px] leading-none font-semibold tracking-tight tabular-nums">{value}</span>
        {total !== undefined && <span className="text-[15px] text-faint tabular-nums">/ {total}</span>}
        {suffix && <span className="text-[14px] text-faint">{suffix}</span>}
      </div>
      {total !== undefined && total > 0 && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-fg transition-[width] duration-700"
            style={{ width: `${(value / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Heatmap({ days }: { days: string[] }) {
  const WEEKS = 20;
  const set = new Set(days);
  const today = new Date();
  // počni od ponedeljka pre WEEKS nedelja
  const start = new Date(today);
  const weekday = (today.getDay() + 6) % 7;
  start.setDate(today.getDate() - weekday - (WEEKS - 1) * 7);

  const columns = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = dayKey(date);
      return { key, active: set.has(key), future: date > today, isToday: key === dayKey(today) };
    }),
  );

  return (
    <section className="mt-3 flex flex-col gap-4 rounded-2xl border border-line bg-elev/70 p-5 sm:flex-row sm:items-center">
      <div className="sm:w-48">
        <div className="text-[13px] font-medium">Aktivnost</div>
        <div className="mt-0.5 text-[12.5px] text-faint">Poslednjih {WEEKS} nedelja. Svaki dan sa vežbom, kvizom ili karticom se računa.</div>
      </div>
      <div className="flex flex-1 justify-end gap-[3px] overflow-hidden">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {col.map((c) => (
              <span
                key={c.key}
                title={c.key}
                className={cn(
                  "size-[11px] rounded-[3px] transition-colors",
                  c.future ? "bg-transparent" : c.active ? "bg-success" : "bg-line",
                  c.isToday && "ring-1 ring-fg/40 ring-offset-1 ring-offset-elev",
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ModuleCard({
  module: m,
  completed,
  delay,
}: {
  module: NavModule;
  completed: Record<string, number>;
  delay: number;
}) {
  const done = m.lessons.filter((l) => completed[l.key]).length;
  const total = m.lessons.length;
  const minutes = m.lessons.reduce((n, l) => n + l.minutes, 0);

  const body = (
    <div
      className={cn(
        "animate-fade-up group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        m.upcoming
          ? "border-dashed border-line bg-transparent"
          : "border-line bg-elev shadow-card hover:-translate-y-0.5 hover:border-line-strong",
      )}
      style={{ animationDelay: `${delay}ms`, "--hue": m.hue } as React.CSSProperties}
    >
      {!m.upcoming && (
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: m.hue }}
        />
      )}
      <div className="relative flex items-start justify-between">
        <ModuleBadge name={m.icon} hue={m.hue} size={38} dim={m.upcoming} />
        {m.upcoming ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-faint">
            <Lock size={10} /> Uskoro
          </span>
        ) : (
          total > 0 && (
            <ProgressRing value={done / total} size={34} stroke={3}>
              <span className="text-[10px] font-semibold tabular-nums">
                {done}/{total}
              </span>
            </ProgressRing>
          )
        )}
      </div>
      <div className="relative mt-5 font-mono text-[11.5px] text-faint">{pad(m.index)}</div>
      <div className={cn("relative mt-0.5 text-[19px] font-semibold tracking-tight", m.upcoming && "text-muted")}>{m.title}</div>
      <div className="relative mt-1 text-[13.5px] text-muted">{m.tagline}</div>
      <div className="relative mt-auto pt-5">
        {m.upcoming ? (
          <div className="flex flex-wrap gap-1.5">
            {m.topics?.slice(0, 4).map((t) => (
              <span key={t} className="rounded-md bg-subtle px-1.5 py-0.5 text-[11.5px] text-faint">
                {t}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[12.5px] text-faint">
            <span className="inline-flex items-center gap-1">
              <Layers size={12} /> {total} {plural(total, "lekcija", "lekcije", "lekcija")}
            </span>
            <span>·</span>
            <span>~{minutes} min</span>
          </div>
        )}
      </div>
    </div>
  );

  return m.upcoming ? body : (
    <Link href={m.href} className="block h-full">
      {body}
    </Link>
  );
}
