import type { ExerciseTest } from "@/content/types";
import { PRELUDE, type LogLine, type RunResult } from "./harness";

/**
 * React vežbe: tvoj kod se crta u pravom DOM-u (u browseru u skrivenom iframe-u, u
 * scripts/check-content.ts u jsdom-u), a testovi mogu da traže elemente i da klikću.
 * Isti kod radi u oba okruženja, pa je rešenje provereno isto gde ga pišemo i gde ga rešavaš.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReactEnv {
  React: any;
  jsxRuntime: any;
  createRoot: (el: Element, options?: any) => { render(node: unknown): void; unmount(): void };
  doc: Document;
  win: Window & typeof globalThis;
  /** Ostale biblioteke dostupne u vežbama: "zustand", "zustand/middleware", "react-router-dom"… */
  modules?: Record<string, unknown>;
}

type ZustandStore = { setState(state: unknown, replace?: boolean): void; getInitialState(): unknown };

/**
 * localStorage za vežbe, u memoriji. Vežbe NE smeju da diraju pravi localStorage:
 * tamo bootcamp čuva tvoj napredak (iframe sa pregledom deli isti origin sa aplikacijom).
 */
export function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, String(v)),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
  };
}

const namedToDestructure = (named: string) =>
  named
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("type "))
    .map((s) => s.replace(/\s+as\s+/, ": "))
    .join(", ");

/** `import { useState } from "react"` → `const { useState } = __require("react")`, a `export` se briše. */
export function rewriteModules(js: string): string {
  return js
    .replace(/^\s*import\s+type\s[^;]+;?[ \t]*$/gm, "")
    .replace(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s+["']([^"']+)["'];?/gm, 'const $1 = __require("$2");')
    .replace(
      /^\s*import\s+(\w+)\s*,\s*\{([^}]*)\}\s*from\s+["']([^"']+)["'];?/gm,
      (_, def, named, mod) => `const ${def} = __require("${mod}"); const { ${namedToDestructure(named)} } = __require("${mod}");`,
    )
    .replace(
      /^\s*import\s*\{([^}]*)\}\s*from\s+["']([^"']+)["'];?/gm,
      (_, named, mod) => `const { ${namedToDestructure(named)} } = __require("${mod}");`,
    )
    .replace(/^\s*import\s+(\w+)\s+from\s+["']([^"']+)["'];?/gm, 'const $1 = __require("$2");')
    .replace(/^\s*import\s+["'][^"']+["'];?/gm, "")
    .replace(/^(\s*)export\s+default\s+(?=(async\s+)?function\b|class\b)/gm, "$1")
    .replace(/^\s*export\s+default\s+[\w$]+;?[ \t]*$/gm, "")
    .replace(/^(\s*)export\s+(?=(const|let|var|function|class|async|interface|type)\b)/gm, "$1")
    .replace(/^\s*export\s*\{[^}]*\};?[ \t]*$/gm, "");
}

/**
 * `import` u vežbama. Zustand-ov `create` pratimo, da bi se svaki store vratio na početno
 * stanje između testova (inače bi test 2 video stanje koje je ostavio test 1).
 */
function makeRequire(env: ReactEnv, storage: Storage, stores: ZustandStore[] = []) {
  const modules: Record<string, unknown> = {
    react: env.React,
    "react/jsx-runtime": env.jsxRuntime,
    "react-dom/client": { createRoot: env.createRoot },
    ...env.modules,
  };
  const zustand = modules.zustand as { create: (init?: unknown) => unknown } | undefined;
  if (zustand) {
    const track = (store: unknown) => {
      stores.push(store as ZustandStore);
      return store;
    };
    const create = (init?: unknown) =>
      init === undefined ? (fn: unknown) => track(zustand.create(fn)) : track(zustand.create(init));
    modules.zustand = { ...zustand, create };
  }
  // persist podrazumevano piše u localStorage; u vežbama ga preusmeravamo na storage iz memorije
  const middleware = modules["zustand/middleware"] as
    | { persist: (fn: unknown, options: object) => unknown; createJSONStorage: (get: () => Storage) => unknown }
    | undefined;
  if (middleware) {
    const persist = (fn: unknown, options: object) =>
      middleware.persist(fn, { storage: middleware.createJSONStorage(() => storage), ...options });
    modules["zustand/middleware"] = { ...middleware, persist };
  }
  return (name: string) => {
    if (!(name in modules)) {
      throw new Error(`"${name}" nije dostupan u vežbama. Može: ${Object.keys(modules).filter((m) => !m.includes("/client") && !m.includes("jsx-runtime")).join(", ")}`);
    }
    return modules[name];
  };
}

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const matches = (text: string, m: string | RegExp) => (m instanceof RegExp ? m.test(text) : text === m);
const show = (m: string | RegExp) => (m instanceof RegExp ? String(m) : JSON.stringify(m));

const ROLES: Record<string, string> = {
  button: "button, [role=button], input[type=button], input[type=submit]",
  textbox:
    "input:not([type]), input[type=text], input[type=email], input[type=password], input[type=search], input[type=tel], input[type=url], textarea, [role=textbox]",
  checkbox: "input[type=checkbox], [role=checkbox]",
  radio: "input[type=radio], [role=radio]",
  spinbutton: "input[type=number]",
  combobox: "select, [role=combobox]",
  option: "option",
  heading: "h1, h2, h3, h4, h5, h6, [role=heading]",
  list: "ul, ol, [role=list]",
  listitem: "li, [role=listitem]",
  link: "a[href], [role=link]",
  img: "img, [role=img]",
  form: "form",
  paragraph: "p",
  alert: "[role=alert]",
  status: "[role=status]",
};

/** Upiti i akcije koje testovi koriste, po uzoru na React Testing Library. */
function createDom(env: ReactEnv, logs: LogLine[], storage: Storage, stores: ZustandStore[] = []) {
  const { React, createRoot, doc, win } = env;
  let mounted: { root: ReturnType<ReactEnv["createRoot"]>; el: HTMLElement }[] = [];
  let container: HTMLElement = doc.body;
  let renderError: unknown;
  let eventError: unknown;

  const tick = async (n = 3) => {
    for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0));
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

  // Greške iz onClick/onChange handlera
  const onError = (e: ErrorEvent) => {
    eventError = e.error ?? e.message;
    e.preventDefault();
  };
  // Forma bez preventDefault bi osvežila stranicu: to sprečavamo, ali te upozorimo
  const onSubmit = (e: Event) => {
    if (!e.defaultPrevented) {
      logs.push({ level: "warn", text: "⚠ Forma je poslata bez e.preventDefault(). U pravom browseru bi se stranica osvežila." });
      e.preventDefault();
    }
  };
  win.addEventListener("error", onError);
  doc.addEventListener("submit", onSubmit);

  const visibleText = () => norm(container.textContent).slice(0, 160) || "(prazno)";

  const allByText = (m: string | RegExp) => {
    const els = [...container.querySelectorAll<HTMLElement>("*")].filter((el) => matches(norm(el.textContent), m));
    // najdublji elementi: oni čije nijedno dete ne odgovara
    return els.filter((el) => ![...el.children].some((c) => matches(norm(c.textContent), m)));
  };

  const accessibleName = (el: HTMLElement) => {
    const aria = el.getAttribute("aria-label");
    if (aria) return norm(aria);
    const labels = (el as HTMLInputElement).labels;
    if (labels && labels.length) return norm([...labels].map((l) => l.textContent).join(" "));
    if (el instanceof win.HTMLImageElement) return norm(el.alt);
    if (el instanceof win.HTMLInputElement && (el.type === "submit" || el.type === "button")) return norm(el.value);
    const text = norm(el.textContent);
    if (text) return text;
    return norm(el.getAttribute("placeholder") ?? el.getAttribute("title"));
  };

  const allByRole = (role: string, opts?: { name?: string | RegExp }) => {
    const selector = ROLES[role];
    if (!selector) throw new Error(`Uloga "${role}" nije podržana u vežbama. Probaj: ${Object.keys(ROLES).join(", ")}`);
    const els = [...container.querySelectorAll<HTMLElement>(selector)];
    return opts?.name === undefined ? els : els.filter((el) => matches(accessibleName(el), opts.name!));
  };

  const one = <T,>(found: T[], what: string): T => {
    if (found.length === 0) throw new Error(`Nije pronađen ${what}. Na ekranu piše: "${visibleText()}"`);
    return found[0];
  };

  const screen = {
    getByText: (m: string | RegExp) => one(allByText(m), `element sa tekstom ${show(m)}`),
    getAllByText: (m: string | RegExp) => {
      const found = allByText(m);
      if (!found.length) throw new Error(`Nije pronađen nijedan element sa tekstom ${show(m)}. Na ekranu piše: "${visibleText()}"`);
      return found;
    },
    queryByText: (m: string | RegExp) => allByText(m)[0] ?? null,
    queryAllByText: (m: string | RegExp) => allByText(m),
    getByRole: (role: string, opts?: { name?: string | RegExp }) =>
      one(allByRole(role, opts), `element sa ulogom "${role}"${opts?.name !== undefined ? ` i imenom ${show(opts.name)}` : ""}`),
    getAllByRole: (role: string, opts?: { name?: string | RegExp }) => {
      const found = allByRole(role, opts);
      if (!found.length) throw new Error(`Nije pronađen nijedan element sa ulogom "${role}". Na ekranu piše: "${visibleText()}"`);
      return found;
    },
    queryByRole: (role: string, opts?: { name?: string | RegExp }) => allByRole(role, opts)[0] ?? null,
    queryAllByRole: (role: string, opts?: { name?: string | RegExp }) => allByRole(role, opts),
    getByLabelText: (m: string | RegExp) => {
      const viaLabel = [...container.querySelectorAll("label")]
        .filter((l) => matches(norm(l.textContent), m))
        .map((l) => l.control ?? l.querySelector("input, textarea, select"))
        .filter(Boolean) as HTMLElement[];
      const viaAria = [...container.querySelectorAll<HTMLElement>("[aria-label]")].filter((el) =>
        matches(norm(el.getAttribute("aria-label")), m),
      );
      return one([...viaLabel, ...viaAria], `element sa labelom ${show(m)}`);
    },
    getByPlaceholderText: (m: string | RegExp) =>
      one(
        [...container.querySelectorAll<HTMLElement>("[placeholder]")].filter((el) => matches(norm(el.getAttribute("placeholder")), m)),
        `polje sa placeholder-om ${show(m)}`,
      ),
    getByTestId: (id: string) =>
      one([...container.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`)], `element sa data-testid="${id}"`),
    get container() {
      return container;
    },
  };

  const assertEl = (el: unknown, action: string): HTMLElement => {
    if (!el || !(el as Node).nodeType) throw new Error(`${action}() očekuje element, npr. ${action}(screen.getByText("…"))`);
    return el as HTMLElement;
  };

  const afterEvent = async () => {
    await tick();
    if (eventError) {
      const e = eventError;
      eventError = undefined;
      throw new Error("Greška u handleru događaja: " + message(e));
    }
    if (renderError) throw new Error("Komponenta je pukla: " + message(renderError));
  };

  return {
    screen,
    tick,
    sleep,
    async render(Component: unknown, props?: Record<string, unknown>) {
      if (typeof Component !== "function") throw new Error("render() očekuje komponentu, npr. render(App)");
      const el = doc.createElement("div");
      doc.body.appendChild(el);
      container = el;
      renderError = undefined;
      const root = createRoot(el, {
        onUncaughtError: (e: unknown) => (renderError = e),
        onCaughtError: (e: unknown) => (renderError = e),
      });
      root.render(React.createElement(Component, props));
      mounted.push({ root, el });
      await tick();
      if (renderError) throw new Error("Komponenta je pukla: " + message(renderError));
      return { container: el };
    },
    async click(target: unknown) {
      const el = assertEl(target, "click");
      el.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true }));
      await afterEvent();
    },
    async type(target: unknown, text: string) {
      const el = assertEl(target, "type");
      const proto = el instanceof win.HTMLTextAreaElement ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, String(text));
      el.dispatchEvent(new win.Event("input", { bubbles: true }));
      await afterEvent();
    },
    async select(target: unknown, value: string) {
      const el = assertEl(target, "select");
      Object.getOwnPropertyDescriptor(win.HTMLSelectElement.prototype, "value")!.set!.call(el, value);
      el.dispatchEvent(new win.Event("change", { bubbles: true }));
      await afterEvent();
    },
    async cleanup() {
      for (const m of mounted) {
        m.root.unmount();
        m.el.remove();
      }
      mounted = [];
      container = doc.body;
      renderError = undefined;
      eventError = undefined;
      for (const store of stores) store.setState(store.getInitialState(), true);
      storage.clear();
      await tick(1);
    },
    dispose() {
      win.removeEventListener("error", onError);
      doc.removeEventListener("submit", onSubmit);
    },
  };
}

/** Pokreće React vežbu i testove. `js` je već kompajliran (TSX → JS). */
export async function runReactProgram(env: ReactEnv, js: string, tests: ExerciseTest[]): Promise<RunResult> {
  const logs: LogLine[] = [];
  const stores: ZustandStore[] = [];
  const storage = createMemoryStorage();
  const dom = createDom(env, logs, storage, stores);
  const registrations = tests
    .map((t) => `__test(${JSON.stringify(t.name)}, async () => {\n${t.code}\n});`)
    .join("\n");

  const body = `return (async () => {
${PRELUDE}
const { render, screen, click, type, select, tick, sleep } = __dom;
let __runtimeError;
try {
${rewriteModules(js)}
;
${registrations}
} catch (e) {
  __runtimeError = (e && e.name ? e.name + ": " : "") + (e && e.message ? e.message : String(e));
}
const __results = [];
for (const [name, fn] of __tests) {
  try { await fn(); __results.push({ name, pass: true }); }
  catch (e) { __results.push({ name, pass: false, error: e && e.message ? e.message : String(e) }); }
  finally { await __dom.cleanup(); }
}
if (__runtimeError) {
  const ran = new Set(__results.map((r) => r.name));
  for (const t of ${JSON.stringify(tests.map((t) => t.name))}) {
    if (!ran.has(t)) __results.push({ name: t, pass: false, error: "Kod je pukao pre ovog testa" });
  }
}
return { logs: __logs, tests: __results, runtimeError: __runtimeError };
})();`;

  try {
    const fn = new Function("__require", "__dom", "localStorage", "sessionStorage", body) as (
      req: unknown,
      dom: unknown,
      local: Storage,
      session: Storage,
    ) => Promise<RunResult>;
    const result = await fn(makeRequire(env, storage, stores), dom, storage, createMemoryStorage());
    return { ...result, logs: [...result.logs, ...logs] };
  } catch (e) {
    return { logs, tests: [], runtimeError: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
  } finally {
    await dom.cleanup();
    dom.dispose();
  }
}

/** Izvršava kod i vraća komponentu za pregled (bez testova). */
export function evaluateComponent(
  env: ReactEnv,
  js: string,
  name: string,
  /** Pregled čuva svoj storage između osvežavanja, pa persist može da se vidi na delu. */
  storage: Storage = createMemoryStorage(),
): { component?: unknown; logs: LogLine[]; error?: string } {
  const body = `${PRELUDE}
${rewriteModules(js)}
;
return { component: typeof ${name} === "function" ? ${name} : undefined, logs: __logs };`;
  try {
    const fn = new Function("__require", "localStorage", "sessionStorage", body) as (
      req: unknown,
      local: Storage,
      session: Storage,
    ) => { component?: unknown; logs: LogLine[] };
    const out = fn(makeRequire(env, storage), storage, createMemoryStorage());
    if (!out.component) return { logs: out.logs, error: `Nema komponente "${name}". Napiši function ${name}() { … }` };
    return out;
  } catch (e) {
    return { logs: [], error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
  }
}
