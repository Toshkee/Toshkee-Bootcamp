"use client";

import Editor, { type Monaco } from "@monaco-editor/react";
import {
  Check,
  CircleDashed,
  KeyRound,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  TerminalSquare,
  X,
} from "lucide-react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import type { ExerciseTest } from "@/content/types";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";
import { runInWorker } from "@/lib/runner/browser";
import { buildProgram, type RunResult } from "@/lib/runner/harness";
import { useIsClient } from "@/lib/use-is-client";
import { Burst } from "./burst";
import { compileModel, configureMonaco, currentMonacoTheme, type TsProblem } from "./monaco-setup";

interface Outcome extends RunResult {
  problems: TsProblem[];
  pass: boolean;
  needNoTypeErrors: boolean;
}

export function Exercise({
  id,
  number,
  title,
  lang,
  starter,
  solution,
  solutionHtml,
  tests,
  requireNoTypeErrors,
  prompt,
  hints,
  explanation,
}: {
  id: string;
  number: number;
  title: string;
  lang: "ts" | "js";
  starter: string;
  solution: string;
  solutionHtml: string;
  tests: ExerciseTest[];
  requireNoTypeErrors?: boolean;
  prompt: React.ReactNode;
  hints: React.ReactNode[];
  explanation?: React.ReactNode;
}) {
  const ready = useIsClient();
  const solvedAt = useProgress((s) => s.solved[id]);
  const markSolved = useProgress((s) => s.markSolved);
  const saveDraft = useProgress((s) => s.saveDraft);

  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [height, setHeight] = useState(() => editorHeight(starter));
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [tab, setTab] = useState<"tests" | "console">("tests");
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [celebrate, setCelebrate] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const solved = ready && !!solvedAt;
  const needNoTypeErrors = requireNoTypeErrors ?? lang === "ts";

  const run = useCallback(async () => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model || running) return;
    setRunning(true);
    try {
      const { js, problems } = await compileModel(monaco, model, lang);
      const result = await runInWorker(buildProgram(js, tests));
      const pass =
        !result.timedOut &&
        !result.runtimeError &&
        result.tests.length === tests.length &&
        result.tests.every((t) => t.pass) &&
        (!needNoTypeErrors || problems.length === 0);
      setOutcome({ ...result, problems, pass, needNoTypeErrors });
      setAttempts((a) => a + 1);
      if (!pass && result.logs.length > 0 && result.tests.every((t) => t.pass)) setTab("tests");
      if (pass) {
        if (!useProgress.getState().solved[id]) setCelebrate((c) => c + 1);
        markSolved(id);
      }
    } finally {
      setRunning(false);
    }
  }, [id, lang, markSolved, needNoTypeErrors, running, tests]);

  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const reset = () => {
    editorRef.current?.setValue(starter);
    setOutcome(null);
  };

  const insertSolution = () => {
    editorRef.current?.setValue(solution);
    setShowSolution(false);
  };

  const passedCount = outcome?.tests.filter((t) => t.pass).length ?? 0;

  return (
    <section className="relative my-10 overflow-hidden rounded-2xl border border-line bg-elev shadow-card">
      {/* Zadatak */}
      <div className="px-5 pt-5 pb-4 sm:px-6">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fg px-2.5 py-0.5 text-[11.5px] font-semibold tracking-wide text-bg">
            <KeyRound size={11.5} strokeWidth={2.5} />
            VEŽBA {number}
          </span>
          <StatusPill solved={solved} outcome={outcome} />
        </div>
        <h3 className="mb-2 text-[1.35rem] font-semibold tracking-tight">{title}</h3>
        <div className="text-[15.5px]">{prompt}</div>

        {hintsShown > 0 && (
          <div className="mt-4 space-y-2">
            {hints.slice(0, hintsShown).map((h, i) => (
              <div
                key={i}
                className="animate-fade-up flex gap-3 rounded-xl border border-[color-mix(in_oklab,var(--warn)_25%,transparent)] bg-[color-mix(in_oklab,var(--warn)_7%,transparent)] px-3.5 py-2.5 text-[14.5px]"
              >
                <Lightbulb size={15} className="mt-1 shrink-0 text-warn" />
                <div>
                  <span className="mr-1.5 text-[12px] font-semibold text-warn">Hint {i + 1}</span>
                  {h}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="border-t border-line bg-code">
        <div className="flex h-11 items-center gap-1 border-b border-line px-2 sm:px-3">
          <span className="ml-1 flex items-center gap-2 font-mono text-[12.5px] text-muted">
            <span
              className={cn(
                "rounded px-1 py-px text-[10px] font-bold",
                lang === "ts" ? "bg-[#3178c6] text-white" : "bg-[#f7df1e] text-black",
              )}
            >
              {lang.toUpperCase()}
            </span>
            vezba.{lang}
          </span>
          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarButton
              onClick={() => setHintsShown((n) => Math.min(hints.length, n + 1))}
              disabled={hintsShown >= hints.length}
              title="Prikaži sledeći hint"
            >
              <Lightbulb size={14} />
              <span className="hidden sm:inline">
                Hint{hints.length > 1 && ` ${Math.min(hintsShown + 1, hints.length)}/${hints.length}`}
              </span>
            </ToolbarButton>
            <ToolbarButton onClick={() => setShowSolution((s) => !s)} title="Pogledaj rešenje">
              <Sparkles size={14} />
              <span className="hidden sm:inline">Rešenje</span>
            </ToolbarButton>
            <ToolbarButton onClick={reset} title="Vrati početni kod">
              <RotateCcw size={14} />
            </ToolbarButton>
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="ml-1.5 inline-flex h-8 items-center gap-2 rounded-lg bg-fg pr-2 pl-3 text-[13px] font-medium text-bg transition-[opacity,transform] hover:opacity-90 active:scale-[0.97] disabled:opacity-60"
            >
              {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
              Pokreni
              <span className="hidden items-center gap-0.5 rounded bg-bg/15 px-1 py-px font-mono text-[10.5px] sm:flex">⌘↵</span>
            </button>
          </div>
        </div>

        <div style={{ height }} className="relative">
          <Editor
            height={height}
            path={`file:///vezbe/${id}.${lang}`}
            defaultLanguage={lang === "ts" ? "typescript" : "javascript"}
            defaultValue={useProgress.getState().drafts[id] ?? starter}
            theme={currentMonacoTheme()}
            beforeMount={configureMonaco}
            loading={<EditorSkeleton />}
            onMount={(ed, monaco) => {
              editorRef.current = ed;
              monacoRef.current = monaco;
              setHeight(editorHeight(ed.getValue()));
              ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
            }}
            onChange={(value = "") => {
              setHeight(editorHeight(value));
              clearTimeout(saveTimer.current);
              saveTimer.current = setTimeout(() => saveDraft(id, value), 400);
            }}
            options={{
              fontFamily: monoFont(),
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              renderLineHighlight: "line",
              padding: { top: 14, bottom: 14 },
              tabSize: 2,
              automaticLayout: true,
              fixedOverflowWidgets: true,
              stickyScroll: { enabled: false },
              scrollbar: { alwaysConsumeMouseWheel: false, verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              lineNumbersMinChars: 3,
              glyphMargin: false,
              folding: false,
              guides: { indentation: true },
              bracketPairColorization: { enabled: true },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>
      </div>

      {showSolution && (
        <div className="animate-fade-up border-t border-line bg-subtle/40">
          <div className="flex items-center justify-between px-5 pt-3 sm:px-6">
            <span className="text-[12.5px] font-medium text-muted">
              {attempts === 0 && !solved ? "Vredi probati bar jednom pre gledanja, ali evo rešenja:" : "Jedno moguće rešenje"}
            </span>
            <button
              type="button"
              onClick={insertSolution}
              className="h-7 rounded-md border border-line-strong px-2.5 text-[12px] text-muted transition-colors hover:text-fg"
            >
              Ubaci u editor
            </button>
          </div>
          <div className="code-static" dangerouslySetInnerHTML={{ __html: solutionHtml }} />
        </div>
      )}

      {/* Rezultat */}
      <div className="border-t border-line">
        <div className="flex items-center gap-1 px-3 pt-2 sm:px-4">
          <TabButton active={tab === "tests"} onClick={() => setTab("tests")}>
            Testovi
            <span className="ml-1.5 text-faint tabular-nums">
              {outcome ? `${passedCount}/${tests.length}` : tests.length}
            </span>
          </TabButton>
          <TabButton active={tab === "console"} onClick={() => setTab("console")}>
            Konzola
            {outcome && outcome.logs.length > 0 && <span className="ml-1.5 text-faint tabular-nums">{outcome.logs.length}</span>}
          </TabButton>
          {!outcome && (
            <span className="ml-auto hidden items-center gap-1.5 pr-1 text-[12px] text-faint sm:flex">
              Pokreni sa <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd>
            </span>
          )}
        </div>

        <div className="px-5 pt-2 pb-5 sm:px-6">
          {tab === "tests" ? (
            <div className="space-y-3">
              {outcome?.timedOut && (
                <Problem title="Kod se izvršava predugo">
                  Prekinut je posle 4 sekunde. Najverovatnije imaš beskonačnu petlju.
                </Problem>
              )}
              {outcome?.runtimeError && <Problem title="Greška pri izvršavanju">{outcome.runtimeError}</Problem>}
              {outcome && outcome.needNoTypeErrors && outcome.problems.length > 0 && (
                <Problem title={`TypeScript prijavljuje ${outcome.problems.length === 1 ? "grešku" : `${outcome.problems.length} greške`}`}>
                  <ul className="mt-1 space-y-1">
                    {outcome.problems.map((p, i) => (
                      <li key={i} className="font-mono text-[12.5px] whitespace-pre-wrap">
                        <button
                          type="button"
                          className="mr-2 rounded bg-danger/10 px-1 text-danger hover:bg-danger/20"
                          onClick={() => {
                            editorRef.current?.revealLineInCenter(p.line);
                            editorRef.current?.setPosition({ lineNumber: p.line, column: 1 });
                            editorRef.current?.focus();
                          }}
                        >
                          L{p.line}
                        </button>
                        {p.message}
                      </li>
                    ))}
                  </ul>
                </Problem>
              )}
              <ul className="space-y-1.5">
                {tests.map((t, i) => {
                  const r = outcome?.tests.find((x) => x.name === t.name);
                  return (
                    <li key={i} className="flex gap-2.5 text-[14px]">
                      <span className="mt-[3px] shrink-0">
                        {!r ? (
                          <CircleDashed size={16} className="text-faint" />
                        ) : r.pass ? (
                          <span className="grid size-4 place-items-center rounded-full bg-success text-bg">
                            <Check size={11} strokeWidth={3.5} />
                          </span>
                        ) : (
                          <span className="grid size-4 place-items-center rounded-full bg-danger text-bg">
                            <X size={11} strokeWidth={3.5} />
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className={cn(!r ? "text-muted" : r.pass ? "text-fg" : "text-fg")}>{t.name}</div>
                        {r && !r.pass && r.error && (
                          <div className="mt-0.5 font-mono text-[12.5px] break-words text-danger">{r.error}</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="min-h-16 rounded-lg border border-line bg-code p-3 font-mono text-[12.5px] leading-relaxed">
              {!outcome || outcome.logs.length === 0 ? (
                <span className="flex items-center gap-2 text-faint">
                  <TerminalSquare size={14} /> Ovde se pojavljuje sve što ispišeš sa console.log(...)
                </span>
              ) : (
                outcome.logs.map((l, i) => (
                  <div
                    key={i}
                    className={cn(
                      "border-b border-line py-0.5 whitespace-pre-wrap last:border-0",
                      l.level === "error" && "text-danger",
                      l.level === "warn" && "text-warn",
                    )}
                  >
                    {l.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {outcome?.pass && (
          <div className="animate-fade-up relative mx-4 mb-4 rounded-xl border border-[color-mix(in_oklab,var(--success)_30%,transparent)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] p-4 sm:mx-5">
            <div className="flex items-center gap-2 font-semibold text-success">
              <span className="relative grid size-6 place-items-center rounded-full bg-success text-bg">
                <Check size={14} strokeWidth={3.5} />
                <Burst trigger={celebrate} />
              </span>
              Rešeno! Svi testovi prolaze.
            </div>
            {explanation && <div className="mt-2 text-[14.5px] text-muted">{explanation}</div>}
          </div>
        )}
        {outcome && !outcome.pass && attempts >= 2 && hintsShown < hints.length && (
          <div className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-subtle/50 px-4 py-2.5 text-[13.5px] text-muted sm:mx-5">
            Zapelo je? Nema sramote, i profesionalci koriste hintove.
            <button
              type="button"
              onClick={() => setHintsShown((n) => n + 1)}
              className="shrink-0 rounded-md bg-fg px-2.5 py-1 text-[12.5px] font-medium text-bg"
            >
              Daj hint
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusPill({ solved, outcome }: { solved: boolean; outcome: Outcome | null }) {
  if (solved)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--success)_14%,transparent)] px-2 py-0.5 text-[11.5px] font-medium text-success">
        <Check size={11} strokeWidth={3} /> Rešeno
      </span>
    );
  if (outcome)
    return <span className="rounded-full bg-subtle px-2 py-0.5 text-[11.5px] font-medium text-muted">U toku</span>;
  return null;
}

function ToolbarButton({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] text-muted transition-colors hover:bg-subtle hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative h-9 rounded-md px-2.5 text-[13px] font-medium transition-colors",
        active ? "text-fg" : "text-faint hover:text-muted",
      )}
    >
      {children}
      {active && <span className="absolute inset-x-2.5 -bottom-px h-[2px] rounded-full bg-fg" />}
    </button>
  );
}

function Problem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[color-mix(in_oklab,var(--danger)_28%,transparent)] bg-[color-mix(in_oklab,var(--danger)_7%,transparent)] px-3.5 py-2.5 text-[13.5px]">
      <div className="font-semibold text-danger">{title}</div>
      <div className="mt-0.5 text-fg/80">{children}</div>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex h-full w-full flex-col gap-2.5 bg-code px-12 py-4">
      {[62, 44, 78, 30, 55].map((w, i) => (
        <div key={i} className="h-3 animate-pulse rounded bg-subtle" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

const editorHeight = (code: string) => Math.min(520, Math.max(150, code.split("\n").length * 22 + 30));

const monoFont = () => {
  if (typeof document === "undefined") return "ui-monospace, Menlo, monospace";
  const geist = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
  return `${geist ? geist + ", " : ""}ui-monospace, SFMono-Regular, Menlo, monospace`;
};
