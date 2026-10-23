import { ArrowLeft, ArrowRight, Clock, FolderGit2, KeyRound, ListChecks, SquareTerminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonBlocks, buildToc } from "@/components/lesson/blocks";
import { LessonTracker, ReadingProgress, Toc } from "@/components/lesson/lesson-chrome";
import { LessonFooter } from "@/components/lesson/lesson-footer";
import { InlineCode } from "@/components/ui/inline-code";
import { ModuleBadge } from "@/components/ui/module-icon";
import { allLessons, getLessonRef, lessonHref, projectInfo } from "@/content/curriculum";
import { pad } from "@/lib/nav";

export function generateStaticParams() {
  return allLessons.map((l) => ({ module: l.module.slug, lesson: l.lesson.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[module]/[lesson]">): Promise<Metadata> {
  const { module, lesson } = await params;
  const found = getLessonRef(module, lesson);
  return found ? { title: found.ref.lesson.title, description: found.ref.lesson.summary } : {};
}

export default function LessonPage({ params }: PageProps<"/learn/[module]/[lesson]">) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContent params={params} />
    </Suspense>
  );
}

function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pt-16 sm:px-8">
      <div className="h-4 w-48 animate-pulse rounded bg-subtle" />
      <div className="mt-6 h-14 w-4/5 animate-pulse rounded-lg bg-subtle" />
      <div className="mt-4 h-5 w-3/5 animate-pulse rounded bg-subtle" />
      <div className="mt-12 space-y-3">
        {[90, 100, 82, 95, 60].map((w, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-subtle" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

async function LessonContent({ params }: Pick<PageProps<"/learn/[module]/[lesson]">, "params">) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const found = getLessonRef(moduleSlug, lessonSlug);
  if (!found) notFound();
  const { ref, prev, next } = found;
  const { module: mod, lesson } = ref;

  const exercises = lesson.blocks.filter((b) => b.kind === "exercise");
  const quizzes = lesson.blocks.flatMap((b) => (b.kind === "quiz" ? [{ id: b.id, total: b.questions.length }] : []));
  const terminals = lesson.blocks.flatMap((b) => (b.kind === "terminal" ? [{ id: b.id, total: b.steps.length }] : []));

  return (
    <div className="relative" style={{ "--hue": mod.hue } as React.CSSProperties}>
      <ReadingProgress />
      <LessonTracker lessonKey={ref.key} />

      {/* Atmosfera modula */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px] overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.13] blur-[90px] dark:opacity-[0.16]"
          style={{ background: `radial-gradient(closest-side, ${mod.hue}, transparent)` }}
        />
        <div className="dot-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      </div>

      <div className="relative mx-auto flex max-w-[1160px] gap-14 px-5 sm:px-8 xl:px-10">
        <article className="mx-auto min-w-0 max-w-[760px] flex-1 pt-10 pb-24 lg:pt-16 xl:mx-0">
          <header className="animate-fade-up mb-12">
            <div className="mb-6 flex items-center gap-2 text-[13px] text-muted">
              <Link href={`/learn/${mod.slug}`} className="flex items-center gap-2 transition-colors hover:text-fg">
                <ModuleBadge name={mod.icon} hue={mod.hue} size={22} />
                <span className="font-mono text-[12px] text-faint">{pad(mod.index)}</span>
                {mod.title}
              </Link>
              <span className="text-faint">/</span>
              <span className="text-faint">
                Lekcija {ref.number} od {mod.lessons.length}
              </span>
            </div>
            <h1 className="font-display text-[42px] leading-[1.02] tracking-[-0.015em] text-balance sm:text-[58px]">
              {lesson.title}
            </h1>
            <p className="mt-4 max-w-[60ch] text-[18px] leading-relaxed text-pretty text-muted"><InlineCode text={lesson.summary} /></p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <Chip icon={<Clock size={13} />}>{lesson.minutes} min</Chip>
              {exercises.length > 0 && (
                <Chip icon={<KeyRound size={13} />}>
                  {exercises.length} {exercises.length === 1 ? "vežba" : "vežbe"}
                </Chip>
              )}
              {terminals.length > 0 && <Chip icon={<SquareTerminal size={13} />}>Terminal</Chip>}
              {quizzes.length > 0 && <Chip icon={<ListChecks size={13} />}>Kviz</Chip>}
              {lesson.projects.map((p) => (
                <Chip key={p} icon={<FolderGit2 size={13} />} hue>
                  {projectInfo[p].label}
                </Chip>
              ))}
            </div>
          </header>

          <LessonBlocks lesson={lesson} />

          <LessonFooter
            lessonKey={ref.key}
            cardIds={lesson.flashcards.map((c) => c.id)}
            exerciseIds={exercises.map((e) => (e.kind === "exercise" ? e.id : ""))}
            quizIds={quizzes}
            terminals={terminals}
            moduleHref={`/learn/${mod.slug}`}
            moduleTitle={mod.title}
            next={
              next && {
                title: next.lesson.title,
                href: lessonHref(next),
                moduleTitle: next.module.title,
                hue: next.module.hue,
                sameModule: next.module.slug === mod.slug,
              }
            }
          />

          <nav className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link href={lessonHref(prev)} className="group rounded-xl p-3 transition-colors hover:bg-subtle">
                <div className="flex items-center gap-1.5 text-[12px] text-faint">
                  <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" /> Prethodna
                </div>
                <div className="mt-0.5 text-[14.5px] font-medium">{prev.lesson.title}</div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={lessonHref(next)} className="group rounded-xl p-3 text-right transition-colors hover:bg-subtle">
                <div className="flex items-center justify-end gap-1.5 text-[12px] text-faint">
                  Sledeća <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="mt-0.5 text-[14.5px] font-medium">{next.lesson.title}</div>
              </Link>
            )}
          </nav>
        </article>

        <aside className="hidden w-[210px] shrink-0 xl:block">
          <div className="sticky top-0 max-h-dvh overflow-y-auto pt-16 pb-10">
            <Toc entries={buildToc(lesson)} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Chip({ icon, children, hue }: { icon: React.ReactNode; children: React.ReactNode; hue?: boolean }) {
  return (
    <span
      className={
        hue
          ? "inline-flex items-center gap-1.5 rounded-full border border-hue-soft bg-hue-soft px-2.5 py-1 text-hue-strong"
          : "inline-flex items-center gap-1.5 rounded-full border border-line bg-elev/60 px-2.5 py-1"
      }
    >
      <span className="opacity-70">{icon}</span>
      {children}
    </span>
  );
}
