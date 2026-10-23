"use client";

import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import type { ExerciseTest } from "@/content/types";
import type { RunResult } from "./harness";
import { runReactProgram, type ReactEnv } from "./react-harness";

/** Osnovni stil za pregled React vežbi: da i "goli" HTML izgleda pristojno. */
export const PREVIEW_CSS = `
:root { color-scheme: light; --fg: #0a0a0b; --muted: #6b6b73; --bg: #ffffff; --soft: #f4f4f3; --line: rgba(0,0,0,.11); }
.dark { color-scheme: dark; --fg: #f4f4f5; --muted: #a1a1aa; --bg: #0d0d10; --soft: #17171b; --line: rgba(255,255,255,.12); }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
#root { padding: 20px; }
h1, h2, h3, h4 { margin: 0 0 .5em; line-height: 1.2; letter-spacing: -.01em; }
h1 { font-size: 1.6em; } h2 { font-size: 1.3em; } h3 { font-size: 1.1em; }
p { margin: 0 0 .6em; }
ul, ol { margin: .25em 0 .75em; padding-left: 1.3em; } li { margin: .2em 0; }
button { font: inherit; font-weight: 500; padding: .45em .95em; border-radius: 9px; border: 1px solid transparent; background: var(--fg); color: var(--bg); cursor: pointer; }
button:hover { opacity: .88; } button:disabled { opacity: .4; cursor: not-allowed; }
button.secondary { background: transparent; color: var(--fg); border-color: var(--line); }
input, textarea, select { font: inherit; padding: .45em .7em; border-radius: 9px; border: 1px solid var(--line); background: transparent; color: inherit; outline: none; }
input:focus, textarea:focus, select:focus { border-color: var(--fg); }
input[type=checkbox], input[type=radio] { width: 1em; height: 1em; accent-color: var(--fg); }
label { display: inline-flex; gap: .45em; align-items: center; }
form { display: flex; flex-direction: column; gap: .6em; align-items: flex-start; }
.card { border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; background: var(--soft); }
.row { display: flex; gap: .6em; align-items: center; flex-wrap: wrap; }
.stack { display: flex; flex-direction: column; gap: .6em; }
.muted, small { color: var(--muted); }
.badge { display: inline-block; font-size: .78em; font-weight: 600; padding: .1em .55em; border-radius: 99px; background: var(--fg); color: var(--bg); }
.error { color: #ef4444; }
`;

export const browserReactEnv = (doc: Document, win: Window): ReactEnv => ({
  React,
  jsxRuntime,
  createRoot: createRoot as ReactEnv["createRoot"],
  doc,
  win: win as ReactEnv["win"],
});

/** Testovi se izvršavaju u skrivenom iframe-u, da ne diraju pregled ni ostatak stranice. */
export async function runReactInFrame(js: string, tests: ExerciseTest[]): Promise<RunResult> {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;height:600px;border:0;visibility:hidden";
  document.body.appendChild(frame);
  const doc = frame.contentDocument!;
  doc.open();
  doc.write("<!doctype html><html><head></head><body></body></html>");
  doc.close();
  try {
    const timeout = new Promise<RunResult>((resolve) =>
      setTimeout(() => resolve({ logs: [], tests: [], timedOut: true }), 6000),
    );
    return await Promise.race([runReactProgram(browserReactEnv(doc, frame.contentWindow!), js, tests), timeout]);
  } finally {
    frame.remove();
  }
}
