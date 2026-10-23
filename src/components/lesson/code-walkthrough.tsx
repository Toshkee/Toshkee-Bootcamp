"use client";

import { ArrowLeft, ArrowRight, Eye, EyeOff, FolderGit2, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";
import type { Token } from "@/lib/highlight";

export interface WalkthroughStep {
  from: number;
  to: number;
  body: React.ReactNode;
}

export function CodeWalkthrough({
  projectLabel,
  file,
  startLine,
  editorHref,
  intro,
  lines,
  steps,
}: {
  projectLabel: string;
  file: string;
  startLine: number;
  editorHref: string;
  intro?: React.ReactNode;
  lines: Token[][];
  steps: WalkthroughStep[];
}) {
  const [active, setActive] = useState(0);
  const [focusMode, setFocusMode] = useState(true);
  const codeRef = useRef<HTMLDivElement>(null);
  const step = steps[active];

  const go = (i: number) => setActive(Math.max(0, Math.min(steps.length - 1, i)));

  // Skroluj kod (samo unutar okvira) do aktivnih linija
  useEffect(() => {
    const box = codeRef.current;
    const el = box?.querySelector<HTMLElement>(`[data-line="${step.from}"]`);
    if (!box || !el) return;
    const top = el.offsetTop - box.clientHeight / 3;
    box.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [step.from]);

  const lineOwner = (n: number) => steps.findIndex((s) => n >= s.from && n <= s.to);
  const stepStarts = new Map(steps.map((s, i) => [s.from, i]));
  const gutter = String(startLine + lines.length).length;

  return (
    <figure
      className="group/walk my-9 overflow-hidden rounded-2xl border border-line bg-elev shadow-card outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(active + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(active - 1);
        }
      }}
    >
      {/* Zaglavlje: projekat i fajl */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hue-soft bg-hue-soft px-2.5 py-0.5 text-[12px] font-medium text-hue-strong">
          <FolderGit2 size={12.5} />
          Iz tvog koda · {projectLabel}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-muted" title={file}>
          {file}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFocusMode((f) => !f)}
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] text-faint transition-colors hover:bg-subtle hover:text-fg"
            title={focusMode ? "Prikaži ceo kod jednako" : "Zatamni ostatak koda"}
          >
            {focusMode ? <Eye size={13} /> : <EyeOff size={13} />}
            <span className="hidden sm:inline">{focusMode ? "Ceo kod" : "Fokus"}</span>
          </button>
          <a
            href={editorHref}
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] text-faint transition-colors hover:bg-subtle hover:text-fg"
            title="Otvori ovaj fajl u VS Code-u"
          >
            <SquareArrowOutUpRight size={13} />
            <span className="hidden sm:inline">Otvori u editoru</span>
          </a>
        </div>
      </div>

      {intro && <div className="border-b border-line px-4 py-3.5 text-[14.5px] leading-relaxed text-muted sm:px-5">{intro}</div>}

      {/* Kod */}
      <div ref={codeRef} className="relative max-h-[380px] overflow-auto bg-code py-3 font-mono text-[13.5px] leading-[1.75]">
        <div className="min-w-max">
          {lines.map((tokens, i) => {
            const n = i + 1;
            const owner = lineOwner(n);
            const isActive = n >= step.from && n <= step.to;
            const startsStep = stepStarts.get(n);
            return (
              <div
                key={n}
                data-line={n}
                onClick={() => owner !== -1 && go(owner)}
                className={cn(
                  "relative flex pr-6 transition-[opacity,background-color] duration-300",
                  owner !== -1 && "cursor-pointer",
                  isActive ? "bg-hue-soft" : focusMode && "opacity-35 hover:opacity-70",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0 bottom-0 left-0 w-[2px] transition-colors",
                    isActive ? "bg-hue" : "bg-transparent",
                  )}
                />
                <span className="flex w-9 shrink-0 items-center justify-center">
                  {startsStep !== undefined && (
                    <span
                      className={cn(
                        "grid size-[18px] place-items-center rounded-full text-[10px] font-semibold transition-colors",
                        startsStep === active ? "bg-hue text-bg" : "bg-subtle text-faint ring-1 ring-line-strong",
                      )}
                    >
                      {startsStep + 1}
                    </span>
                  )}
                </span>
                <span
                  className={cn("shrink-0 pr-4 text-right select-none", isActive ? "text-hue-strong" : "text-faint")}
                  style={{ width: `${gutter + 2}ch` }}
                >
                  {startLine + i}
                </span>
                <span className="whitespace-pre">
                  {tokens.length === 0
                    ? " "
                    : tokens.map((t, j) => (
                        <span key={j} style={{ "--shiki-light": t.light, "--shiki-dark": t.dark } as React.CSSProperties} className="tok">
                          {t.content}
                        </span>
                      ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Objašnjenje koraka */}
      <div className="border-t border-line">
        <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
          <div className="flex flex-1 items-center gap-1.5" role="tablist" aria-label="Koraci">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Korak ${i + 1}`}
                onClick={() => go(i)}
                className="group/dot flex h-4 flex-1 items-center"
              >
                <span
                  className={cn(
                    "h-1 w-full rounded-full transition-colors duration-300",
                    i <= active ? "bg-hue" : "bg-line-strong group-hover/dot:bg-faint",
                  )}
                />
              </button>
            ))}
          </div>
          <span className="text-[12px] text-faint tabular-nums">
            {active + 1}/{steps.length}
          </span>
        </div>
        <div key={active} className="animate-fade-up px-4 pt-3 pb-4 sm:px-5">
          <div className="mb-1.5 text-[12px] font-medium text-hue-strong">
            {step.from === step.to ? `Linija ${startLine + step.from - 1}` : `Linije ${startLine + step.from - 1}–${startLine + step.to - 1}`}
          </div>
          <div className="min-h-[3.5rem]">{step.body}</div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-line bg-subtle/30 px-4 py-2.5 sm:px-5">
          <span className="hidden items-center gap-1.5 text-[12px] text-faint sm:flex">
            <Kbd>←</Kbd>
            <Kbd>→</Kbd> ili klikni na liniju
          </span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-fg disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowLeft size={14} /> Nazad
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === steps.length - 1}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-fg px-3 text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
            >
              Dalje <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}
