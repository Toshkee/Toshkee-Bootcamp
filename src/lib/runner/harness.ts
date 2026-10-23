import type { ExerciseTest } from "@/content/types";

/**
 * Pravi JavaScript koji izvršava korisnikov (već kompajliran) kod pa testove.
 * Isti kod koristi i browser (u Web Worker-u) i `scripts/check-content.ts` (u Node-u),
 * tako da su rešenja provereno ista tamo gde ih pišemo i tamo gde ih rešavaš.
 */

export interface LogLine {
  level: "log" | "info" | "warn" | "error";
  text: string;
}

export interface TestResult {
  name: string;
  pass: boolean;
  error?: string;
}

export interface RunResult {
  logs: LogLine[];
  tests: TestResult[];
  runtimeError?: string;
  timedOut?: boolean;
}

/** TypeScript (sa `moduleDetection: force`) dodaje `export {};` na kraj, a mi kod pokrećemo kao skriptu. */
export function stripModuleSyntax(js: string): string {
  return js.replace(/^\s*export\s*\{\s*\};?\s*$/gm, "");
}

/** Zajednički početak svakog programa: console koji hvata ispis, `expect` i registracija testova. */
export const PRELUDE = String.raw`
const __logs = [];
const logs = [];
const __fmt = (v, depth = 0) => {
  if (typeof v === "string") return depth === 0 ? v : JSON.stringify(v);
  if (typeof v === "function") return "[funkcija " + (v.name || "bez imena") + "]";
  if (typeof v === "undefined") return "undefined";
  if (typeof v === "bigint") return v + "n";
  if (typeof v === "symbol") return v.toString();
  if (v === null) return "null";
  if (typeof v === "object" && v.nodeType === 1 && v.tagName) {
    const t = (v.textContent || "").replace(/\s+/g, " ").trim();
    return "<" + v.tagName.toLowerCase() + ">" + (t ? " \"" + (t.length > 60 ? t.slice(0, 60) + "…" : t) + "\"" : "");
  }
  if (v instanceof Error) return v.name + ": " + v.message;
  if (v instanceof Date) return "Date(" + (isNaN(v.getTime()) ? "Invalid Date" : v.toISOString()) + ")";
  if (v instanceof Map) return "Map(" + v.size + ") {" + [...v].map(([k, x]) => __fmt(k, depth + 1) + " => " + __fmt(x, depth + 1)).join(", ") + "}";
  if (v instanceof Set) return "Set(" + v.size + ") {" + [...v].map((x) => __fmt(x, depth + 1)).join(", ") + "}";
  if (v instanceof Promise) return "Promise { <čeka> }";
  if (Array.isArray(v)) return depth > 3 ? "[...]" : "[" + v.map((x) => __fmt(x, depth + 1)).join(", ") + "]";
  if (typeof v === "object") {
    if (depth > 3) return "{...}";
    const entries = Object.entries(v);
    if (entries.length === 0) return "{}";
    return "{ " + entries.map(([k, x]) => k + ": " + __fmt(x, depth + 1)).join(", ") + " }";
  }
  return String(v);
};
const __push = (level) => (...args) => {
  const text = args.map((a) => __fmt(a)).join(" ");
  __logs.push({ level, text });
  logs.push(text);
};
const console = { log: __push("log"), info: __push("info"), warn: __push("warn"), error: __push("error"), debug: __push("log"), table: __push("log") };

const __eq = (a, b) => {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof Map && b instanceof Map) return a.size === b.size && [...a].every(([k, v]) => b.has(k) && __eq(v, b.get(k)));
  if (a instanceof Set && b instanceof Set) return a.size === b.size && [...a].every((v) => b.has(v));
  const ka = Object.keys(a).filter((k) => a[k] !== undefined);
  const kb = Object.keys(b).filter((k) => b[k] !== undefined);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => __eq(a[k], b[k]));
};
const __show = (v) => (typeof v === "string" ? JSON.stringify(v) : __fmt(v, 1));
class __Fail extends Error {}
function expect(actual) {
  const fail = (msg) => { throw new __Fail(msg); };
  const api = {
    toBe(expected) { if (!Object.is(actual, expected)) fail("Očekivano " + __show(expected) + ", a dobijeno " + __show(actual)); },
    toEqual(expected) { if (!__eq(actual, expected)) fail("Očekivano " + __show(expected) + ", a dobijeno " + __show(actual)); },
    toBeTruthy() { if (!actual) fail("Očekivana \"truthy\" vrednost, a dobijeno " + __show(actual)); },
    toBeFalsy() { if (actual) fail("Očekivana \"falsy\" vrednost, a dobijeno " + __show(actual)); },
    toBeTypeOf(type) { if (typeof actual !== type) fail("Očekivan tip " + type + ", a dobijeno " + typeof actual + " (" + __show(actual) + ")"); },
    toContain(item) {
      const ok = typeof actual === "string" ? actual.includes(item) : Array.isArray(actual) && actual.some((x) => __eq(x, item));
      if (!ok) fail("Očekivano da " + __show(actual) + " sadrži " + __show(item));
    },
    toHaveLength(n) { if (!actual || actual.length !== n) fail("Očekivana dužina " + n + ", a dobijeno " + (actual == null ? __show(actual) : actual.length)); },
    toBeGreaterThan(n) { if (!(actual > n)) fail("Očekivano više od " + n + ", a dobijeno " + __show(actual)); },
    toBeLessThan(n) { if (!(actual < n)) fail("Očekivano manje od " + n + ", a dobijeno " + __show(actual)); },
    toBeCloseTo(n, digits = 2) { if (Math.abs(actual - n) >= Math.pow(10, -digits) / 2) fail("Očekivano približno " + n + ", a dobijeno " + __show(actual)); },
    toBeInstanceOf(C) { if (!(actual instanceof C)) fail("Očekivana instanca " + C.name + ", a dobijeno " + __show(actual)); },
    toBeInTheDocument() { if (!actual || !actual.isConnected) fail("Element nije na ekranu"); },
    toHaveTextContent(text) {
      const t = actual && actual.textContent != null ? actual.textContent.replace(/\s+/g, " ").trim() : null;
      if (t === null) fail("toHaveTextContent očekuje element, a dobijeno " + __show(actual));
      const ok = text instanceof RegExp ? text.test(t) : t.includes(String(text));
      if (!ok) fail("Očekivan tekst " + __show(text) + ", a element sadrži " + JSON.stringify(t));
    },
    toHaveValue(v) { if (!actual || String(actual.value) !== String(v)) fail("Očekivana vrednost " + __show(v) + ", a polje ima " + (actual ? JSON.stringify(actual.value) : __show(actual))); },
    toBeChecked() { if (!actual || !actual.checked) fail("Očekivano je da bude štiklirano, ali nije"); },
    toBeDisabled() { if (!actual || !actual.disabled) fail("Očekivano je da bude onemogućeno (disabled), ali nije"); },
    toThrow(fragment) {
      if (typeof actual !== "function") fail("toThrow očekuje funkciju, npr. expect(() => nesto()).toThrow()");
      try { actual(); } catch (e) {
        if (fragment && !String(e && e.message).includes(fragment)) fail("Bačena je greška \"" + (e && e.message) + "\", a očekivana je poruka sa \"" + fragment + "\"");
        return;
      }
      fail("Očekivano je da funkcija baci grešku, ali nije");
    },
  };
  api.not = {};
  for (const key of Object.keys(api)) {
    if (key === "not") continue;
    api.not[key] = (...args) => {
      let passed = true;
      try { api[key](...args); } catch (e) { passed = false; }
      if (passed) fail("Očekivano je da NE važi: " + key + "(" + args.map(__show).join(", ") + ") za " + __show(actual));
    };
  }
  return api;
}
const __tests = [];
const __test = (name, fn) => __tests.push([name, fn]);
`;

/** Sklapa ceo program. Rezultat je telo funkcije koja vraća Promise<RunResult>. */
export function buildProgram(userJs: string, tests: ExerciseTest[]): string {
  const registrations = tests
    .map(
      (t) =>
        `__test(${JSON.stringify(t.name)}, async () => {\n${t.code}\n});`,
    )
    .join("\n");

  return `return (async () => {
${PRELUDE}
let __runtimeError;
try {
${stripModuleSyntax(userJs)}
;
${registrations}
} catch (e) {
  __runtimeError = (e && e.name ? e.name + ": " : "") + (e && e.message ? e.message : String(e));
}
const __results = [];
for (const [name, fn] of __tests) {
  try { await fn(); __results.push({ name, pass: true }); }
  catch (e) { __results.push({ name, pass: false, error: e && e.message ? e.message : String(e) }); }
}
if (__runtimeError) {
  const ran = new Set(__results.map((r) => r.name));
  for (const t of ${JSON.stringify(tests.map((t) => t.name))}) {
    if (!ran.has(t)) __results.push({ name: t, pass: false, error: "Kod je pukao pre ovog testa" });
  }
}
return { logs: __logs, tests: __results, runtimeError: __runtimeError };
})();`;
}
