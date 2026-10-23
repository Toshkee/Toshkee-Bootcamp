"use client";

import { Check, Lightbulb, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";

export interface TerminalStepView {
  task: React.ReactNode;
  accept: string[];
  output: string;
  hint: React.ReactNode;
  cwd?: string;
}

type Line =
  | { kind: "cmd"; cwd: string; text: string }
  | { kind: "out"; text: string }
  | { kind: "miss"; text: string }
  | { kind: "note"; text: string };

const USER = "toshkee@MacBook";

export function Terminal({
  id,
  title,
  intro,
  cwd: startCwd = "~",
  steps,
}: {
  id: string;
  title: string;
  intro?: React.ReactNode;
  cwd?: string;
  steps: TerminalStepView[];
}) {
  const ready = useIsClient();
  const savedSteps = useProgress((s) => s.terminals[id] ?? 0);
  const advance = useProgress((s) => s.advanceTerminal);
  const resetSaved = useProgress((s) => s.resetTerminal);

  // Dok se ne otkuca prva komanda, nastavljamo od sačuvanog koraka
  const [localStep, setStep] = useState<number | null>(null);
  const step = localStep ?? (ready ? savedSteps : 0);
  const [typed, setLines] = useState<Line[] | null>(null);
  const lines: Line[] = useMemo(
    () =>
      typed ??
      (step > 0 ? [{ kind: "note", text: `# nastavljamo od koraka ${Math.min(step + 1, steps.length)}` }] : []),
    [typed, step, steps.length],
  );
  const [input, setInput] = useState("");
  const [misses, setMisses] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const patterns = useMemo(
    () => steps.map((s) => s.accept.map((src) => new RegExp(`^(?:${src})$`))),
    [steps],
  );

  const cwdAt = (n: number) => {
    let cwd = startCwd;
    for (let i = 0; i < n; i++) cwd = steps[i].cwd ?? cwd;
    return cwd;
  };
  const cwd = cwdAt(step);
  const done = step >= steps.length;

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const submit = () => {
    const text = input.trim();
    setInput("");
    setHistoryIdx(-1);
    if (!text) {
      setLines([...lines, { kind: "cmd", cwd, text: "" }]);
      return;
    }
    setHistory((h) => [text, ...h]);

    if (done) {
      setLines([...lines, { kind: "cmd", cwd, text }, { kind: "note", text: "# sve je završeno, pritisni ↺ za ponovo" }]);
      return;
    }

    const ok = patterns[step].some((re) => re.test(text.replace(/\s+/g, " ")));
    if (ok) {
      const isClear = /^clear$/.test(text);
      const out = steps[step].output;
      setLines(isClear ? [] : [...lines, { kind: "cmd", cwd, text }, ...(out ? [{ kind: "out" as const, text: out }] : [])]);
      setStep(step + 1);
      setMisses(0);
      setHintOpen(false);
      advance(id, step + 1);
    } else if (text === "clear") {
      setLines([]);
    } else {
      setLines([
        ...lines,
        { kind: "cmd", cwd, text },
        { kind: "miss", text: "Nije baš to što ovaj korak traži. Pokušaj ponovo." },
      ]);
      setMisses(misses + 1);
      if (misses + 1 >= 2) setHintOpen(true);
    }
  };

  const reset = () => {
    setStep(0);
    setLines([]);
    setMisses(0);
    setHintOpen(false);
    resetSaved(id);
    inputRef.current?.focus();
  };

  return (
    <section className="my-10">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h4 className="text-[1.1rem] font-semibold tracking-tight">{title}</h4>
        <span className="text-[12.5px] text-faint tabular-nums">
          {Math.min(step, steps.length)}/{steps.length} komandi
        </span>
      </div>
      {intro && <div className="mb-4 text-[15px] text-muted">{intro}</div>}

      {/* Lista koraka */}
      <ol className="mb-3 space-y-1.5">
        {steps.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li
              key={i}
              className={cn(
                "flex gap-3 rounded-xl border px-3.5 py-2.5 text-[14.5px] transition-all duration-300",
                state === "current" && "border-hue-soft bg-hue-soft",
                state === "done" && "border-transparent text-muted",
                state === "todo" && "border-transparent text-faint",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
                  state === "done" && "bg-hue text-bg",
                  state === "current" && "bg-fg text-bg",
                  state === "todo" && "border border-line-strong",
                )}
              >
                {state === "done" ? <Check size={12} strokeWidth={3.5} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn(state === "done" && "line-through decoration-line-strong")}>{s.task}</div>
                {state === "current" && hintOpen && (
                  <div className="animate-fade-up mt-2 flex gap-2 text-[13.5px] text-muted">
                    <Lightbulb size={14} className="mt-0.5 shrink-0 text-warn" />
                    <div>{s.hint}</div>
                  </div>
                )}
              </div>
              {state === "current" && !hintOpen && (
                <button
                  type="button"
                  onClick={() => setHintOpen(true)}
                  className="h-6 shrink-0 self-start rounded-md px-2 text-[12px] text-faint hover:bg-subtle hover:text-fg"
                >
                  Hint
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {/* Prozor terminala, uvek taman kao pravi */}
      <div
        className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0d] shadow-card"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="relative flex h-9 items-center border-b border-white/[0.07] bg-[#161618] px-3.5">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[12px] text-white/40">zsh — {cwd}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              reset();
            }}
            className="ml-auto grid size-6 place-items-center rounded text-white/35 hover:bg-white/10 hover:text-white/80"
            title="Počni ispočetka"
          >
            <RotateCcw size={13} />
          </button>
        </div>
        <div ref={bodyRef} className="max-h-[340px] min-h-[180px] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-[1.7] text-[#e4e4e7]">
          <div className="text-white/35">Last login: {ready ? new Date().toDateString() : ""} on ttys001</div>
          {lines.map((l, i) =>
            l.kind === "cmd" ? (
              <div key={i} className="whitespace-pre-wrap">
                <Prompt cwd={l.cwd} />
                {l.text}
              </div>
            ) : l.kind === "out" ? (
              <div key={i} className="whitespace-pre-wrap text-[#c4c4cc]">
                {l.text}
              </div>
            ) : l.kind === "miss" ? (
              <div key={i} className="text-[#fbbf24]">
                ✗ {l.text}
              </div>
            ) : (
              <div key={i} className="text-white/35">
                {l.text}
              </div>
            ),
          )}
          {done ? (
            <div className="mt-1 text-[#34d399]">✓ Svi koraci završeni. Bravo!</div>
          ) : null}
          <div className="flex items-center">
            <Prompt cwd={cwd} />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  const i = Math.min(history.length - 1, historyIdx + 1);
                  if (i >= 0) {
                    setHistoryIdx(i);
                    setInput(history[i]);
                  }
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const i = historyIdx - 1;
                  setHistoryIdx(Math.max(-1, i));
                  setInput(i >= 0 ? history[i] : "");
                }
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Komanda"
              className="min-w-0 flex-1 bg-transparent text-[#e4e4e7] caret-[#34d399] outline-none"
              placeholder={step === 0 && lines.length === 0 ? "kucaj ovde i pritisni Enter" : ""}
            />
          </div>
        </div>
      </div>
      {misses > 0 && !done && (
        <p className="mt-2 text-[12.5px] text-faint">Savet: ↑ vraća prethodnu komandu, pa je samo ispraviš.</p>
      )}
    </section>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="mr-2 shrink-0 select-none">
      <span className="text-[#34d399]">{USER}</span> <span className="text-[#60a5fa]">{cwd}</span>{" "}
      <span className="text-white/50">%</span>
    </span>
  );
}
