"use client";

import { ArrowRight, Check, CircleHelp, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";
import { Burst } from "./burst";

export interface QuizQuestionView {
  q: React.ReactNode;
  codeHtml?: string;
  options: React.ReactNode[];
  answer: number;
  why: React.ReactNode;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function Quiz({ id, title, questions }: { id: string; title?: string; questions: QuizQuestionView[] }) {
  const ready = useIsClient();
  const saved = useProgress((s) => s.quizzes[id]);
  const answerQuiz = useProgress((s) => s.answerQuiz);
  const resetQuiz = useProgress((s) => s.resetQuiz);
  const answers = (ready && saved) || {};

  const firstUnanswered = questions.findIndex((_, i) => answers[i] === undefined);
  // Dok ništa ne kliknemo, prikazuje se prvo neodgovoreno pitanje (ili rezultat)
  const [pinned, setCurrent] = useState<number | null>(null);
  const current = pinned ?? (firstUnanswered === -1 ? questions.length : firstUnanswered);
  const [celebrate, setCelebrate] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  const showingSummary = current >= questions.length;
  const q = questions[Math.min(current, questions.length - 1)];
  const chosen = answers[current];
  const answered = chosen !== undefined;
  const score = questions.filter((qq, i) => answers[i] === qq.answer).length;

  const choose = (i: number) => {
    if (answered || showingSummary) return;
    setCurrent(current);
    answerQuiz(id, current, i);
    if (i === q.answer) setCelebrate((c) => c + 1);
  };

  const next = () => setCurrent(current + 1);

  const onKey = (e: React.KeyboardEvent) => {
    if (showingSummary) return;
    const n = Number(e.key);
    if (n >= 1 && n <= q.options.length) {
      e.preventDefault();
      choose(n - 1);
    } else if (e.key === "Enter" && answered) {
      e.preventDefault();
      next();
    }
  };

  return (
    <section
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKey}
      className="my-10 overflow-hidden rounded-2xl border border-line bg-elev shadow-card outline-none"
    >
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5 sm:px-6">
        <span className="grid size-7 place-items-center rounded-lg bg-hue-soft text-hue-strong">
          <CircleHelp size={15} />
        </span>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">{title ?? "Proveri razumevanje"}</div>
          <div className="text-[12px] text-faint">
            {questions.length} {questions.length === 1 ? "pitanje" : "pitanja"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {questions.map((qq, i) => {
            const a = answers[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Pitanje ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-6" : "w-3",
                  a === undefined ? "bg-line-strong" : a === qq.answer ? "bg-success" : "bg-danger",
                  i === current && a === undefined && "bg-fg",
                )}
              />
            );
          })}
        </div>
      </div>

      {showingSummary ? (
        <div className="animate-fade-up flex flex-col items-center px-6 py-10 text-center">
          <div className="relative">
            <ProgressRing value={score / questions.length} size={84} stroke={6} color={score === questions.length ? "var(--success)" : "var(--hue)"}>
              <span className="text-xl font-semibold tabular-nums">
                {score}/{questions.length}
              </span>
            </ProgressRing>
          </div>
          <div className="mt-4 font-display text-3xl">
            {score === questions.length ? "Savršeno." : score >= questions.length / 2 ? "Dobro ide." : "Vredi ponoviti."}
          </div>
          <p className="mt-1 max-w-sm text-[14.5px] text-muted">
            {score === questions.length
              ? "Sve tačno. Ovo gradivo ti je jasno."
              : "Klikni na crvene tačkice gore da vidiš objašnjenja, pa probaj ponovo."}
          </p>
          <button
            type="button"
            onClick={() => {
              resetQuiz(id);
              setCurrent(0);
              rootRef.current?.focus();
            }}
            className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong px-3.5 text-[13.5px] text-muted transition-colors hover:text-fg"
          >
            <RotateCcw size={14} /> Ponovi kviz
          </button>
        </div>
      ) : (
        <div key={current} className="animate-fade-up px-5 pt-5 pb-5 sm:px-6">
          <div className="mb-1 text-[12px] font-medium text-faint tabular-nums">
            Pitanje {current + 1} od {questions.length}
          </div>
          <div className="text-[17px] leading-relaxed font-medium">{q.q}</div>
          {q.codeHtml && (
            <div className="code-static mt-3 overflow-hidden rounded-xl border border-line bg-code [&_pre]:py-3" dangerouslySetInnerHTML={{ __html: q.codeHtml }} />
          )}

          <div className="mt-4 grid gap-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.answer;
              const isChosen = i === chosen;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[15px] transition-all",
                    !answered && "border-line hover:-translate-y-px hover:border-line-strong hover:bg-subtle/60 active:translate-y-0",
                    answered && isCorrect && "border-[color-mix(in_oklab,var(--success)_45%,transparent)] bg-[color-mix(in_oklab,var(--success)_9%,transparent)]",
                    answered && isChosen && !isCorrect && "border-[color-mix(in_oklab,var(--danger)_45%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)]",
                    answered && !isCorrect && !isChosen && "border-line opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "relative grid size-7 shrink-0 place-items-center rounded-lg border font-mono text-[12px] font-semibold transition-colors",
                      !answered && "border-line-strong text-faint group-hover:border-fg group-hover:text-fg",
                      answered && isCorrect && "border-transparent bg-success text-bg",
                      answered && isChosen && !isCorrect && "border-transparent bg-danger text-bg",
                      answered && !isCorrect && !isChosen && "border-line text-faint",
                    )}
                  >
                    {answered && isCorrect ? (
                      <Check size={14} strokeWidth={3} />
                    ) : answered && isChosen ? (
                      <X size={14} strokeWidth={3} />
                    ) : (
                      LETTERS[i]
                    )}
                    {answered && isCorrect && isChosen && <Burst trigger={celebrate} count={12} />}
                  </span>
                  <span className="min-w-0 flex-1">{opt}</span>
                  {!answered && <Kbd className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex">{i + 1}</Kbd>}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="animate-fade-up mt-4 rounded-xl bg-subtle/60 px-4 py-3">
              <div className={cn("mb-1 text-[13px] font-semibold", chosen === q.answer ? "text-success" : "text-danger")}>
                {chosen === q.answer ? "Tačno!" : "Nije tačno."}
              </div>
              <div className="text-[14.5px] leading-relaxed text-muted">{q.why}</div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="hidden items-center gap-1.5 text-[12px] text-faint sm:flex">
              {answered ? (
                <>
                  <Kbd>↵</Kbd> dalje
                </>
              ) : (
                <>
                  <Kbd>1</Kbd>–<Kbd>{q.options.length}</Kbd> za odgovor
                </>
              )}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={!answered}
              className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-fg px-4 text-[13.5px] font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              {current === questions.length - 1 ? "Rezultat" : "Sledeće"} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
