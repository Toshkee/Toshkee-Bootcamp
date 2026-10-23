/**
 * Format sadržaja bootcampa. Svaka lekcija je niz blokova koji se prikazuju redom.
 * Sve mora biti serijalizabilno (bez funkcija i RegExp-ova), jer ide iz server u client komponente.
 */

export type ProjectId =
  | "ReformStudio"
  | "Looply"
  | "PlazaHome"
  | "Pasted"
  | "my-portfolio"
  | "vaky-content"
  | "milenaspajic"
  | "Bojanka";

export type CodeLang =
  | "ts"
  | "tsx"
  | "js"
  | "jsx"
  | "json"
  | "bash"
  | "css"
  | "html"
  | "python"
  | "text";

/** Markdown tekst: **bold**, `inline kod`, liste, linkovi. Bez naslova većih od ###. */
export type Markdown = string;

export interface ProseBlock {
  kind: "prose";
  md: Markdown;
}

export interface CalloutBlock {
  kind: "callout";
  /** info = dodatna informacija, tip = savet, warn = česta greška, analogy = poređenje iz stvarnog života */
  tone: "info" | "tip" | "warn" | "analogy";
  title?: string;
  md: Markdown;
}

export interface CodeBlock {
  kind: "code";
  lang: CodeLang;
  code: string;
  filename?: string;
  caption?: Markdown;
  /** Linije koje treba istaći (1-based). */
  highlight?: number[];
}

/** Pravi isečak iz tvog projekta, objašnjen korak po korak. */
export interface FromYourCodeBlock {
  kind: "fromYourCode";
  project: ProjectId;
  /** Putanja unutar projekta, npr. "functions/src/shared/ids.ts" */
  file: string;
  lang: CodeLang;
  /** Broj linije u originalnom fajlu od koje isečak počinje (za prikaz). */
  startLine?: number;
  code: string;
  intro?: Markdown;
  /** Koraci objašnjenja. `lines` su 1-based i relativne u odnosu na `code` (ne na originalni fajl). */
  steps: { lines: [number, number] | number; md: Markdown }[];
}

export interface ExerciseTest {
  /** Šta test proverava, na srpskom, npr. "saberi(2, 3) vraća 5" */
  name: string;
  /**
   * JavaScript koji se izvršava posle tvog koda, u istom scope-u (testovi su async, `await` radi).
   * Dostupno: expect(x).toBe(y) / toEqual / toBeTruthy / toBeFalsy / toContain / toHaveLength / toThrow / toBeTypeOf,
   * i `logs` (niz stringova svega što je ispisano preko console.log).
   *
   * U "tsx" vežbama još i: `await render(App, props?)`, `screen.getByText / getAllByText / queryByText /
   * getByRole(role, { name }) / getAllByRole / queryByRole / getByLabelText / getByPlaceholderText / getByTestId`,
   * `await click(el)`, `await type(el, "tekst")`, `await select(el, "vrednost")`, `await tick()`, `await sleep(ms)`,
   * i matcher-i toBeInTheDocument / toHaveTextContent / toHaveValue / toBeChecked / toBeDisabled /
   * toHaveClass("rounded-lg", /^p[xy]?-\d+$/) (string = tačna klasa, RegExp = bilo koja klasa koja odgovara).
   * Posle svakog testa sve se demontira, Zustand store-ovi se vraćaju na početno stanje i localStorage se briše,
   * pa svaki test počinje sa render(...).
   *
   * U "tsx" vežbama mogu da se importuju: "react", "zustand", "zustand/middleware" i "react-router-dom"
   * (u vežbama koristi MemoryRouter, ne BrowserRouter).
   */
  code: string;
}

export interface ExerciseBlock {
  kind: "exercise";
  /** Jedinstven u celom bootcampu, npr. "ts-basics-1" */
  id: string;
  title: string;
  prompt: Markdown;
  /** "tsx" = React vežba: kod se crta u živom pregledu, a `import ... from "react"` radi. */
  lang: "ts" | "js" | "tsx";
  /** Samo za "tsx": koja komponenta se prikazuje u pregledu. Default: "App". */
  preview?: string;
  /** Samo za "tsx": pregled učitava Tailwind (klase rade kao u tvojim projektima). */
  tailwind?: boolean;
  starter: string;
  solution: string;
  /** Ako je true, vežba prolazi samo ako TypeScript ne prijavljuje nijednu grešku. Default: true za "ts". */
  requireNoTypeErrors?: boolean;
  tests: ExerciseTest[];
  hints: Markdown[];
  /** Kratko objašnjenje posle rešavanja: zašto je rešenje takvo. */
  explanation?: Markdown;
}

/** Peskovnik: React kod sa živim pregledom, bez testova. Za igranje i eksperimente. */
export interface PlaygroundBlock {
  kind: "playground";
  id: string;
  title: string;
  prompt?: Markdown;
  lang: "tsx";
  code: string;
  /** Koja komponenta se prikazuje. Default: "App". */
  preview?: string;
  /** Pregled učitava Tailwind. */
  tailwind?: boolean;
}

export interface QuizQuestion {
  q: Markdown;
  /** Opcioni kod uz pitanje. */
  code?: string;
  codeLang?: CodeLang;
  options: Markdown[];
  /** Indeks tačnog odgovora (0-based). */
  answer: number;
  /** Objašnjenje koje se prikazuje posle odgovora. */
  why: Markdown;
}

export interface QuizBlock {
  kind: "quiz";
  id: string;
  title?: string;
  questions: QuizQuestion[];
}

export interface TerminalStep {
  /** Šta korisnik treba da uradi, npr. "Napravi folder `moj-projekat`." */
  task: Markdown;
  /** Prihvaćene komande kao RegExp izvor (bez /.../), poredi se sa trim-ovanim unosom. */
  accept: string[];
  /** Šta terminal "ispiše" kad je komanda tačna. */
  output: string;
  hint: Markdown;
  /** Promena putanje u promptu posle ove komande (npr. "~/projekti/moj-projekat"). */
  cwd?: string;
}

/** Simulirani terminal: korisnik kuca komande, mi proveravamo i "ispisujemo" rezultat. */
export interface TerminalBlock {
  kind: "terminal";
  id: string;
  title: string;
  intro?: Markdown;
  /** Početna putanja u promptu, default "~" */
  cwd?: string;
  steps: TerminalStep[];
}

export type Block =
  | ProseBlock
  | CalloutBlock
  | CodeBlock
  | FromYourCodeBlock
  | ExerciseBlock
  | PlaygroundBlock
  | QuizBlock
  | TerminalBlock;

export interface Flashcard {
  /** Jedinstven u celom bootcampu. */
  id: string;
  front: Markdown;
  back: Markdown;
}

export interface Lesson {
  /** slug u URL-u, npr. "zasto-typescript" */
  slug: string;
  title: string;
  /** Jedna rečenica: šta ćeš znati posle lekcije. */
  summary: string;
  minutes: number;
  /** Projekti iz kojih lekcija uzima primere. */
  projects: ProjectId[];
  blocks: Block[];
  flashcards: Flashcard[];
}

export interface Module {
  slug: string;
  /** Redni broj za prikaz ("00", "01"...) */
  index: number;
  title: string;
  tagline: string;
  description: string;
  /** Ime lucide ikone */
  icon: ModuleIcon;
  /** Boja modula (CSS boja), koristi se za akcente. */
  hue: string;
  lessons: Lesson[];
}

export type ModuleIcon =
  | "terminal"
  | "braces"
  | "file-type"
  | "atom"
  | "palette"
  | "layers"
  | "flame"
  | "rocket"
  | "flask"
  | "smartphone"
  | "sparkles"
  | "bot";

/** Modul koji tek dolazi: prikazuje se u mapi kao zaključan. */
export interface UpcomingModule {
  slug: string;
  index: number;
  title: string;
  tagline: string;
  icon: ModuleIcon;
  hue: string;
  projects: ProjectId[];
  topics: string[];
}
