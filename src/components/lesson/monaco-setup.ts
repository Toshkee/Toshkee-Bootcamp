"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { RunResult } from "@/lib/runner/harness";

let configured = false;
let reactTypes: Promise<void> = Promise.resolve();

/**
 * Tipovi biblioteka (React, Zustand, React Router) za autocomplete i proveru u .tsx vežbama.
 * Kopira ih scripts/copy-monaco-types.mjs u public/monaco-types, zajedno sa manifest.json.
 */
async function loadLibraryTypes(monaco: Monaco) {
  const res = await fetch("/monaco-types/manifest.json");
  if (!res.ok) return;
  const files = (await res.json()) as [string, string][];
  await Promise.all(
    files.map(async ([url, path]) => {
      const file = await fetch(url);
      if (file.ok) monaco.typescript.typescriptDefaults.addExtraLib(await file.text(), path);
    }),
  );
}

/** Jednom po stranici: TypeScript podešavanja (ista kao u scripts/check-content.ts) i teme. */
export function configureMonaco(monaco: Monaco) {
  if (configured) return;
  configured = true;
  // Samo u dev režimu: pristup editoru iz konzole, za proveru vežbi
  if (process.env.NODE_ENV !== "production") (window as unknown as { __monaco: Monaco }).__monaco = monaco;

  const ts = monaco.typescript;
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    // svaki fajl je zaseban modul, pa se promenljive iz različitih vežbi ne sudaraju
    moduleDetection: 3,
    strict: true,
    allowNonTsExtensions: true,
    // isto kao u scripts/check-content.ts; Monaco traži imena fajlova, a ne "es2022"
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
  };
  ts.typescriptDefaults.setCompilerOptions({
    ...options,
    jsx: ts.JsxEmit.ReactJSX,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
  });
  reactTypes = loadLibraryTypes(monaco).catch(() => undefined);
  ts.javascriptDefaults.setCompilerOptions({ ...options, allowJs: true, checkJs: false });
  ts.typescriptDefaults.setEagerModelSync(true);
  ts.javascriptDefaults.setEagerModelSync(true);

  const shared = {
    "editorLineNumber.foreground": "#52525b",
    "editorIndentGuide.background1": "#80808018",
    "editorIndentGuide.activeBackground1": "#80808040",
    "scrollbarSlider.background": "#80808026",
    "scrollbarSlider.hoverBackground": "#80808040",
  };
  monaco.editor.defineTheme("bootcamp-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "758575", fontStyle: "italic" },
      { token: "keyword", foreground: "4d9375" },
      { token: "string", foreground: "c98a7d" },
      { token: "number", foreground: "4c9a91" },
      { token: "type", foreground: "5da994" },
      { token: "identifier", foreground: "dbd7caee" },
    ],
    colors: {
      ...shared,
      "editor.background": "#0d0d10",
      "editor.foreground": "#dbd7ca",
      "editorGutter.background": "#0d0d10",
      "editor.lineHighlightBackground": "#ffffff06",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.activeForeground": "#a1a1aa",
      "editor.selectionBackground": "#4f8ff740",
      "editorCursor.foreground": "#f4f4f5",
      "editorWidget.background": "#17171b",
      "editorWidget.border": "#ffffff1f",
      "editorHoverWidget.background": "#17171b",
      "editorHoverWidget.border": "#ffffff1f",
      "editorSuggestWidget.background": "#17171b",
      "editorSuggestWidget.border": "#ffffff1f",
      "editorSuggestWidget.selectedBackground": "#ffffff12",
    },
  });
  monaco.editor.defineTheme("bootcamp-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "a0ada0", fontStyle: "italic" },
      { token: "keyword", foreground: "1e754f" },
      { token: "string", foreground: "b56959" },
      { token: "number", foreground: "2f798a" },
      { token: "type", foreground: "2e8f82" },
    ],
    colors: {
      ...shared,
      "editorLineNumber.foreground": "#a1a1aa",
      "editor.background": "#ffffff",
      "editorGutter.background": "#ffffff",
      "editor.lineHighlightBackground": "#00000005",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.activeForeground": "#3f3f46",
      "editor.selectionBackground": "#4f8ff733",
      "editorWidget.background": "#ffffff",
      "editorWidget.border": "#0000001f",
      "editorHoverWidget.background": "#ffffff",
      "editorHoverWidget.border": "#0000001f",
    },
  });

  // Prati temu aplikacije
  const sync = () =>
    monaco.editor.setTheme(document.documentElement.classList.contains("dark") ? "bootcamp-dark" : "bootcamp-light");
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

export const currentMonacoTheme = () =>
  typeof document !== "undefined" && !document.documentElement.classList.contains("dark")
    ? "bootcamp-light"
    : "bootcamp-dark";

export interface TsProblem {
  line: number;
  message: string;
}

type MessageChain = { messageText: string; next?: MessageChain[] };
const flatten = (m: string | MessageChain, indent = 0): string =>
  typeof m === "string"
    ? m
    : `${"  ".repeat(indent)}${m.messageText}${(m.next ?? []).map((n) => "\n" + flatten(n, indent + 1)).join("")}`;

/** Kompajlira model u JavaScript i vraća TypeScript greške. */
export async function compileModel(
  monaco: Monaco,
  model: editor.ITextModel,
  lang: "ts" | "js" | "tsx",
): Promise<{ js: string; problems: TsProblem[] }> {
  if (lang === "tsx") await reactTypes;
  const uri = model.uri;
  if (lang === "js") {
    const getWorker = await monaco.typescript.getJavaScriptWorker();
    const worker = await getWorker(uri);
    const syntax = await worker.getSyntacticDiagnostics(uri.toString());
    return { js: model.getValue(), problems: syntax.map((d: Diag) => toProblem(model, d)) };
  }
  const getWorker = await monaco.typescript.getTypeScriptWorker();
  const worker = await getWorker(uri);
  const file = uri.toString();
  const [syntax, semantic, emit] = await Promise.all([
    worker.getSyntacticDiagnostics(file),
    worker.getSemanticDiagnostics(file),
    worker.getEmitOutput(file),
  ]);
  const js = emit.outputFiles.find((f: { name: string; text: string }) => f.name.endsWith(".js"))?.text ?? "";
  const problems = [...syntax, ...semantic].filter((d: Diag) => d.category === 1).map((d: Diag) => toProblem(model, d));
  return { js, problems };
}

type Diag = { start?: number; category: number; messageText: string | MessageChain };

function toProblem(model: editor.ITextModel, d: Diag): TsProblem {
  return {
    line: d.start != null ? model.getPositionAt(d.start).lineNumber : 0,
    message: flatten(d.messageText as string | MessageChain),
  };
}

export type { RunResult };
