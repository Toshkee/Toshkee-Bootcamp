import type { Lesson } from "@/content/types";

/** Regex (kao tekst za test) koji prihvata `bg-(--brand)` i `bg-[var(--brand)]`. */
const varKlasa = (prefiks: string, ime: string) => `/^${prefiks}-(\\(--${ime}\\)|\\[var\\(--${ime}\\)\\])$/`;

const lesson: Lesson = {
  slug: "teme-i-tokeni",
  title: "Teme i dizajn tokeni",
  summary:
    "Odakle dolaze klase kao `bg-brand-200` i `text-petrol`: `@theme` u CSS-u, CSS promenljive, teme po studiju sa `data-studio` i kako se od tokena i mapa slaže komponenta dizajn sistema.",
  minutes: 22,
  projects: ["ReformStudio", "PlazaHome"],
  blocks: [
    {
      kind: "prose",
      md: `U prošle dve lekcije stalno se pojavljuju klase kojih nema u Tailwind dokumentaciji: \`bg-brand-200\`, \`text-ink-500\`, \`border-petrol\`, \`shadow-card\`, \`animate-pop\`. Niko ih nije izmislio usput. Svaka je definisana na **jednom mestu**, i o tom mestu je ova lekcija.

Takve vrednosti se zovu **dizajn tokeni**: imenovane odluke o izgledu. Umesto "ona svetlozelena, #edf3cb", kod kaže \`brand-300\`. Kad se boja promeni, menja se jedan red, a ne trista komponenti.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao lepeza boja u prodavnici farbe",
      md: "Majstor ne kaže \"ofarbaj u onu svetlozelenu\", nego navede šifru sa lepeze. Šifra je dogovor: svi znaju na koju boju se misli, a ako proizvođač malo promeni recepturu, svaki zid sa tom šifrom dobije novu nijansu. Tokeni su lepeza tvog projekta: `petrol`, `sand`, `ink-900`.",
    },
    {
      kind: "prose",
      md: `### Tailwind v4: podešavanja su u CSS-u

U starijim projektima (Tailwind v3) podešavanja su bila u fajlu \`tailwind.config.js\`. U v4, koji koriste i ReformStudio i PlazaHome, **sve je u CSS fajlu**. Prvi red uključi ceo Tailwind, a blok \`@theme\` dodaje ili menja tokene:`,
    },
    {
      kind: "code",
      lang: "css",
      filename: "globals.css",
      code: `@import "tailwindcss";

@theme {
  --color-petrol: #26546c;
  --font-sans: "Albert Sans", sans-serif;
  --radius-base: 2px;
}`,
      highlight: [4],
      caption:
        "Tri reda, a dobijaš `bg-petrol`, `text-petrol`, `border-petrol`, `ring-petrol`…, zatim `font-sans` sa novim fontom i `rounded-base`.",
    },
    {
      kind: "prose",
      md: `Svaka promenljiva u \`@theme\` ima **prefiks** koji kaže Tailwind-u kakve klase da napravi:

| Promenljiva u \`@theme\` | Klase koje nastaju |
|---|---|
| \`--color-petrol\` | \`bg-petrol\`, \`text-petrol\`, \`border-petrol\`, \`fill-petrol\`… |
| \`--font-sans\` | \`font-sans\` |
| \`--text-statement\` | \`text-statement\` (veličina teksta) |
| \`--spacing-gutter\` | \`px-gutter\`, \`gap-gutter\`, \`w-gutter\`… |
| \`--radius-base\` | \`rounded-base\` |
| \`--shadow-card\` | \`shadow-card\` |
| \`--animate-pop\` | \`animate-pop\` |

Pravilo je uvek isto: **prefiks bira vrstu klase, a ostatak imena postaje ime klase.** \`--color-brand-200\` postaje \`brand-200\` u svim klasama za boju: \`bg-brand-200\`, \`text-brand-200/60\`, \`border-brand-200\`…`,
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "src/app/globals.css",
      lang: "css",
      startLine: 1,
      intro:
        "Početak glavnog CSS fajla PlazaHome sajta. Ovih 65 redova određuju svaku boju, veličinu teksta i razmak koje vidiš na sajtu.",
      code: `@import "tailwindcss";

/*
 * Dizajn tokeni — jedino mjesto za boje, tipografiju i razmake.
 * Svijetla, mirna osnova; petrolej plava (#26546C, podloga logotipa) je boja brenda,
 * zlatna iz logotipa samo kao detalj na tamnim površinama.
 */
@theme {
  --color-*: initial;
  --color-paper: #f8f6f2;
  --color-sand: #efeae2;
  --color-white: #ffffff;
  --color-ink: #16191b;
  /* Sekundarni tekst: 5,8:1 na paper, 5,3:1 na sand. */
  --color-muted: #5a6164;
  --color-line: #ddd6cb;
  /* Petrolej: 7,6:1 na paper; bijelo na petroleju 8,2:1. */
  --color-petrol: #26546c;
  --color-petrol-dark: #1d4356;
  /* Zlatna: znak u podnožju (8,7:1 na night); svijetla zlatna za mali tekst na petroleju (5,3:1). */
  --color-gold: #c4b288;
  --color-gold-light: #ddd0ad;
  --color-night: #121618;
  --color-error: #a8402c;

  --font-sans: var(--font-albert), ui-sans-serif, system-ui, sans-serif;

  /* Tipografska skala, fluidno od 360px do 1440px. */
  --text-*: initial;
  --text-xs: 0.75rem;
  --text-xs--line-height: 1.5;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.55;
  --text-base: clamp(1rem, 0.97rem + 0.12vw, 1.0625rem);
  --text-base--line-height: 1.65;
  --text-lg: clamp(1.0625rem, 1rem + 0.28vw, 1.25rem);
  --text-lg--line-height: 1.55;
  --text-xl: clamp(1.1875rem, 1.12rem + 0.3vw, 1.375rem);
  --text-xl--line-height: 1.35;
  /* Veliki naslovi su tanki (300), kao linije u logotipu. */
  --text-2xl: clamp(2rem, 1.5rem + 2.2vw, 3.5rem);
  --text-2xl--line-height: 1.08;
  --text-3xl: clamp(2.5rem, 1.7rem + 3.4vw, 4.75rem);
  --text-3xl--line-height: 1.02;
  --text-4xl: clamp(2.875rem, 1.6rem + 5.4vw, 6.5rem);
  --text-4xl--line-height: 0.98;
  /* Velika rečenica (izjava, utisak klijenta). */
  --text-statement: clamp(1.625rem, 1.2rem + 1.8vw, 2.75rem);
  --text-statement--line-height: 1.22;

  --spacing: 0.25rem;
  /* Bočni razmak: 20px na telefonu, 40px na desktopu. */
  --spacing-gutter: clamp(1.25rem, 0.6rem + 2.6vw, 2.5rem);
  /* Razmak između sekcija: 64px na telefonu, 176px na desktopu (mnogo vazduha, kao u katalogu). */
  --spacing-section: clamp(4rem, 1.667rem + 10.37vw, 11rem);
  --spacing-header: 4rem;
  /* Prostor na dnu stranice za dugme brzog kontakta na telefonu. */
  --spacing-bar: 5rem;

  --radius-*: initial;
  --radius-base: 2px;
  --radius-full: 9999px;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
`,
      steps: [
        {
          lines: 1,
          md: "`@import \"tailwindcss\"`: jedan red uvodi ceo Tailwind, sve klase iz prethodnih lekcija.",
        },
        {
          lines: [8, 9],
          md: "`--color-*: initial` **briše sve Tailwind-ove boje**. Posle ovoga `bg-red-500` i `text-gray-600` više ne postoje. To je namerno: na sajtu smeju da se koriste samo boje brenda, pa slučajna siva ne može ni da se napiše.",
        },
        {
          lines: [10, 24],
          md: "Paleta sajta: papir, pesak, mastilo, petrolej, zlatna. Imena opisuju **ulogu** (`muted` je sporedni tekst, `line` su linije), a ne nijansu. Komentari beleže kontrast (npr. 7,6:1), da se zna da su boje proverene za čitljivost.",
        },
        {
          lines: 26,
          md: "Font: `--font-sans` pokazuje na `--font-albert`, promenljivu koju pravi `next/font` u `layout.tsx`. Pošto je `font-sans` podrazumevani font, ceo sajt dobije Albert Sans bez ijedne klase.",
        },
        {
          lines: [28, 49],
          md: "Tipografska skala opet kreće od `initial`, pa sajt ima samo svoje veličine. `clamp(min, željeno, max)` čini da tekst raste sa širinom ekrana, bez ijedne `md:` klase. `--text-xl--line-height` je par: uz `text-xl` automatski dolazi i visina reda.",
        },
        {
          lines: [51, 64],
          md: "`--spacing: 0.25rem` je jedinica skale (zato je `p-4` = 1rem). Imenovani razmaci prave nove klase: `--spacing-section` daje `py-section`, koji koristi i stranica Kontakt (`<section className=\"container-page py-section\">`). Zaobljenja opet kreću od nule: postoje samo `rounded-base` (2px) i `rounded-full`, jer su oštre ivice deo stila brenda.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Token ili [proizvoljna vrednost]?",
      md: "Ako ti u kodu treba `bg-[#26546c]`, to je znak da fali token. Proizvoljne vrednosti su za stvari koje se javljaju jednom (`lg:w-[38%]` u listi proizvoda). Boja ili razmak koji se ponavljaju idu u `@theme`, inače će se jednog dana menjati na dvadeset mesta.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "@utility: svoja klasa",
      md: "PlazaHome ima i klase koje rade više stvari odjednom: `container-page`, `btn`, `eyebrow`. Napisane su u istom fajlu, kao `@utility container-page { … }`, i ponašaju se kao prave Tailwind klase (rade i sa `hover:`, `md:`…). Koristi ih štedljivo: većina stila i dalje treba da bude u običnim klasama, tamo gde se vidi.",
    },
    {
      kind: "prose",
      md: `### CSS promenljive: vrednost koja se nasleđuje

Svaki token iz \`@theme\` je u pozadini obična **CSS promenljiva** (custom property). CSS promenljiva počinje sa dve crtice, a čita se sa \`var()\`:`,
    },
    {
      kind: "code",
      lang: "css",
      filename: "kartica.css",
      code: `.kartica {
  --brand: #edf3cb;           /* definicija */
  background: var(--brand);   /* upotreba */
}`,
    },
    {
      kind: "prose",
      md: `Ključna osobina: promenljiva se **nasleđuje** naniže kroz HTML stablo, kao boja teksta. Postavljena na \`<html>\`, vidi je cela stranica. Postavljena na jednu karticu, vide je samo ta kartica i sve unutar nje. Svaki element može da je **pregazi** svojom vrednošću, i tada svi ispod njega vide novu.

Na tome stoji ceo sistem tema u ReformStudiju.`,
    },
    {
      kind: "prose",
      md: `### Teme po studiju u ReformStudiju

ReformStudio ima dva studija, Fitness (zeleni) i Pilates (roze), i ista aplikacija treba da izgleda drugačije u svakom. Umesto dve verzije svake komponente, rešenje ima dva sloja:

1. **\`src/styles/theme.css\`**: sirove vrednosti. Za svaki studio isti nazivi promenljivih (\`--brand-300\`, \`--ink-900\`…), a druge boje.
2. **\`src/index.css\`**: \`@theme inline\` od tih promenljivih pravi Tailwind tokene (\`--color-brand-300: var(--brand-300)\`).

Komponente koriste samo \`bg-brand-300\` i \`text-ink-900\`, i ne znaju ni da postoje dva studija.`,
    },
    {
      kind: "code",
      lang: "css",
      filename: "ReformStudio · src/styles/theme.css (skraćeno)",
      code: `/* Prije izbora studija: neutralno. */
:root {
  --brand-300: #d4d4d4;
  --ink-900: #1f1f1f;
  /* … */
}

/*
 * Atribut stoji na <html> (cijela aplikacija), ali radi i na bilo kom elementu —
 * tako kartice na ulaznom ekranu nose boju svog studija dok je ostatak neutralan.
 */
[data-studio='fitness'] {
  --brand-300: #edf3cb;
  --ink-900: #282820;
  /* … */
}

[data-studio='pilates'] {
  --brand-300: #f9c9de;
  --ink-900: #3f2c26;
  /* … */
}`,
      highlight: [12, 18],
      caption:
        "Iste promenljive, tri skupa vrednosti. Kad se izabere studio, `src/store/studioStore.ts` samo postavi atribut (`root.dataset.studio = studio`) i odjednom važi drugi blok. Pravi fajl ima dvadesetak promenljivih u svakom bloku i generiše ga skripta, pa se ne menja ručno.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/index.css",
      lang: "css",
      startLine: 1,
      intro: "Drugi sloj: kako sirove promenljive postaju klase. Ovo je početak glavnog CSS fajla ReformStudija.",
      code: `@import 'tailwindcss';
@import './styles/theme.css';

/*
 * Boje su semantičke i iste za oba studija: \`brand-*\` je svijetla boja studija sa nijansama,
 * \`ink-*\` tamna. Vrijednosti dolaze iz CSS varijabli koje mijenja atribut \`data-studio\`
 * (vidi styles/theme.css), pa svaka klasa — bg-brand-100, text-ink-500… — radi u obje teme.
 */
@theme inline {
  --color-brand-50: var(--brand-50);
  --color-brand-100: var(--brand-100);
  --color-brand-200: var(--brand-200);
  --color-brand-300: var(--brand-300);
  --color-brand-400: var(--brand-400);
  --color-brand-500: var(--brand-500);
  --color-brand-600: var(--brand-600);
  --color-brand-700: var(--brand-700);

  --color-ink-50: var(--ink-50);
  --color-ink-100: var(--ink-100);
  --color-ink-200: var(--ink-200);
  --color-ink-300: var(--ink-300);
  --color-ink-400: var(--ink-400);
  --color-ink-500: var(--ink-500);
  --color-ink-600: var(--ink-600);
  --color-ink-700: var(--ink-700);
  --color-ink-900: var(--ink-900);

  /* Greška nije boja studija — ista je u obje teme. */
  --color-danger-100: var(--danger-100);
  --color-danger-500: var(--danger-500);
  --color-danger-700: var(--danger-700);

  --shadow-card: var(--studio-shadow-card);
  --shadow-float: var(--studio-shadow-float);
  --shadow-sheet: var(--studio-shadow-sheet);
  --shadow-column: var(--studio-shadow-column);
}
`,
      steps: [
        {
          lines: [1, 2],
          md: "Prvo ceo Tailwind, pa fajl sa sirovim vrednostima tema (`theme.css` iz bloka iznad).",
        },
        {
          lines: [4, 8],
          md: "Komentar objašnjava ideju: boje su **semantičke**. `brand` je \"svetla boja studija\", a `ink` \"tamna boja studija\", koji god studio da je izabran. Komponenta nikad ne kaže \"zelena\".",
        },
        {
          lines: 9,
          md: "`@theme inline` umesto `@theme`. Bez `inline`, klasa `bg-brand-200` bi čitala `var(--color-brand-200)`, promenljivu koja se izračuna jednom, na `<html>`. Sa `inline`, Tailwind upiše `var(--brand-200)` direktno u klasu, pa se vrednost čita na **samom elementu**. Zato `data-studio` radi i na jednoj kartici, a ne samo na celoj stranici.",
        },
        {
          lines: [10, 27],
          md: "Dve skale: `brand-50`…`700` i `ink-50`…`900`. Svaki red pravi jednu boju za sve klase: `bg-brand-200`, `text-ink-500`, `border-ink-900/10`…",
        },
        {
          lines: [29, 32],
          md: "Izuzetak: boje greške. Crvena ostaje crvena u oba studija, pa `theme.css` ima samo jedan skup `--danger-*` vrednosti.",
        },
        {
          lines: [34, 37],
          md: "Tokeni nisu samo boje: `shadow-card` i `shadow-column` dobijaju senku obojenu tamnijom nijansom boje studija (maslinasta u Fitness-u, roze u Pilatesu).",
        },
      ],
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/screens/EntryScreen.tsx (isečak)",
      code: `<button
  type="button"
  data-studio={id}
  onClick={onSelect}
  style={{ animationDelay: \`\${delay}s\`, '--card-tilt': tilt } as CSSProperties}
  className={cn(
    'flex max-h-[240px] min-h-[168px] flex-1 basis-0 flex-col rounded-[32px] bg-brand-300 p-6 text-left text-ink-900 shadow-card transition duration-200 active:scale-[0.985]',
    revealed ? 'animate-card-in' : 'opacity-0',
  )}
>`,
      highlight: [3, 5],
      caption:
        "Ulazni ekran: dve kartice, po jedna za svaki studio, dok je ostatak ekrana neutralan. Svaka nosi `data-studio`, pa ista klasa `bg-brand-300` daje zelenu na jednoj i roze na drugoj kartici. `'--card-tilt': tilt` postavlja CSS promenljivu direktno kroz `style`, a animacija `card-in` je čita, pa kartica uleti blago zakrenuta.",
    },
    {
      kind: "prose",
      md: `### CSS promenljive direktno u klasama

Ponekad vrednost stiže iz podataka (boja koju je admin izabrao, kašnjenje po stavci) i ne može unapred da bude token. Tailwind v4 ume da čita promenljivu direktno, bez \`@theme\`:

| Klasa | CSS |
|---|---|
| \`bg-(--brand)\` | \`background-color: var(--brand)\` |
| \`bg-[var(--brand)]\` | isto, duži zapis |
| \`text-(--ink)\` | \`color: var(--ink)\` |
| \`border-(--brand)\` | \`border-color: var(--brand)\` |

A vrednost promenljive postaviš kroz \`style\`. TypeScript ne zna za tvoja \`--\` imena, pa mu sa \`as CSSProperties\` kažeš da je objekat ipak ispravan stil:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Kartica.tsx",
      code: `import type { CSSProperties } from "react"

<div
  style={{ "--brand": "#f9c9de" } as CSSProperties}
  className="rounded-3xl bg-(--brand) p-6"
>
  <button className="bg-black text-(--brand)">Rezerviši</button>
</div>`,
      highlight: [4, 5, 7],
      caption:
        "Promenljiva je postavljena na `<div>`, a čitaju je i on i dugme unutar njega. Bez `as CSSProperties` TypeScript prijavi da `\"--brand\"` nije poznato CSS svojstvo.",
    },
    {
      kind: "prose",
      md: "PlazaHome za to ima malu pomoćnu funkciju, da se `as` ne piše na svakom mestu. Ona stoji iza `style={vars({ \"--delay\": … })}` sa stranice Kontakt:",
    },
    {
      kind: "code",
      lang: "ts",
      filename: "PlazaHome · src/lib/style.ts",
      code: `import type { CSSProperties } from "react";

/** Inline CSS promjenljive za animacije, npr. \`vars({ "--delay": "0.2s" })\`. */
export function vars(values: Record<\`--\${string}\`, string | number>): CSSProperties {
  return values as CSSProperties;
}`,
      highlight: [4],
      caption:
        "Tip ključa dozvoljava samo imena koja počinju sa `--`, pa `vars({ \"--delay\": \"0.2s\" })` prolazi, a `vars({ delay: \"0.2s\" })` ne. `as` je napisan jednom, unutar funkcije.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "bg-(--brand), a ne bg-[--brand]",
      md: "U Tailwind-u v3 promenljiva se pisala `bg-[--brand]`. U v4 ispravan oblik je `bg-(--brand)`, sa običnim zagradama, ili duže `bg-[var(--brand)]`. Stari zapis se još viđa u primerima na internetu i u predlozima AI asistenata, pa obrati pažnju kad ga vidiš.",
    },
    {
      kind: "playground",
      id: "tw-teme-peskovnik",
      title: "Probaj teme",
      tailwind: true,
      prompt:
        "Klikni na nazive tema i gledaj kako se kartica prefarba, iako se nijedna klasa ne menja: menjaju se samo vrednosti promenljivih. Zatim promeni neku hex boju, dodaj treću temu (npr. `joga`) u objekat `teme`, ili napravi `bg-(--brand)/50` da vidiš da i providnost radi.",
      lang: "tsx",
      code: `import { useState, type CSSProperties } from "react"

// Kao theme.css u ReformStudiju: ista imena, druge vrednosti
const teme = {
  neutralno: { "--brand": "#e8e8e8", "--akcenat": "#6a6a6a", "--ink": "#1f1f1f" },
  fitness: { "--brand": "#edf3cb", "--akcenat": "#69710b", "--ink": "#282820" },
  pilates: { "--brand": "#f9c9de", "--akcenat": "#a04574", "--ink": "#3f2c26" },
}

type Tema = keyof typeof teme

function App() {
  const [tema, setTema] = useState<Tema>("fitness")

  return (
    <div style={teme[tema] as CSSProperties} className="max-w-sm space-y-4">
      <div className="flex gap-2">
        {(Object.keys(teme) as Tema[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTema(t)}
            className={
              t === tema
                ? "rounded-full bg-(--ink) px-3 py-1 text-sm font-bold text-(--brand)"
                : "rounded-full border border-black/10 px-3 py-1 text-sm"
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-(--brand) p-6 text-(--ink) transition-colors duration-300">
        <p className="text-xs font-bold tracking-widest uppercase opacity-70">Danas · 18:00</p>
        <h2 className="mt-1 text-2xl font-extrabold">Reformer</h2>
        <p className="mt-2 text-sm">
          Slobodno: <span className="font-bold text-(--akcenat)">2 mesta</span>
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-(--ink) px-5 py-2.5 text-sm font-semibold text-(--brand) transition active:scale-95"
        >
          Rezerviši
        </button>
      </div>
    </div>
  )
}
`,
    },
    {
      kind: "exercise",
      id: "tw-teme-1",
      title: "Boja studija iz promenljive",
      lang: "tsx",
      tailwind: true,
      prompt: `\`Kartica\` dobija boju studija kroz prop \`boja\` (hex string), ali je za sada ne koristi: obe kartice su sive.

- Na spoljni \`<div>\` (onaj sa \`data-testid="kartica"\`) postavi CSS promenljivu \`--brand\` iz propa: \`style={{ "--brand": boja } as CSSProperties}\`.
- Pozadina kartice neka čita tu promenljivu: \`bg-(--brand)\` (ili \`bg-[var(--brand)]\`) **umesto** \`bg-gray-100\`.
- Dugme "Rezerviši" ostaje crno, ali tekst neka bude u boji studija: \`text-(--brand)\` **umesto** \`text-white\`.

\`CSSProperties\` je već uvezen.`,
      starter: `import type { CSSProperties } from "react"

interface KarticaProps {
  studio: string
  boja: string
}

function Kartica({ studio, boja }: KarticaProps) {
  return (
    <div data-testid="kartica" className="rounded-3xl bg-gray-100 p-6">
      <p className="text-xs font-bold tracking-widest text-black/60 uppercase">Studio</p>
      <h2 className="mt-1 text-2xl font-extrabold">{studio}</h2>
      <button className="mt-4 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
        Rezerviši
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Kartica studio="Fitness" boja="#edf3cb" />
      <Kartica studio="Pilates" boja="#f9c9de" />
    </div>
  )
}
`,
      solution: `import type { CSSProperties } from "react"

interface KarticaProps {
  studio: string
  boja: string
}

function Kartica({ studio, boja }: KarticaProps) {
  return (
    <div
      data-testid="kartica"
      style={{ "--brand": boja } as CSSProperties}
      className="rounded-3xl bg-(--brand) p-6"
    >
      <p className="text-xs font-bold tracking-widest text-black/60 uppercase">Studio</p>
      <h2 className="mt-1 text-2xl font-extrabold">{studio}</h2>
      <button className="mt-4 rounded-full bg-black px-4 py-2 text-sm font-semibold text-(--brand)">
        Rezerviši
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Kartica studio="Fitness" boja="#edf3cb" />
      <Kartica studio="Pilates" boja="#f9c9de" />
    </div>
  )
}
`,
      tests: [
        {
          name: "kartica postavlja --brand iz propa boja",
          code: 'await render(Kartica, { studio: "Joga", boja: "#abcdef" })\nexpect(screen.getByTestId("kartica").style.getPropertyValue("--brand")).toBe("#abcdef")',
        },
        {
          name: "pozadina čita --brand umesto sive",
          code: `await render(Kartica, { studio: "Joga", boja: "#abcdef" })\nconst kartica = screen.getByTestId("kartica")\nexpect(kartica).toHaveClass(${varKlasa("bg", "brand")})\nexpect(kartica).not.toHaveClass("bg-gray-100")`,
        },
        {
          name: "tekst dugmeta je u boji brenda",
          code: `await render(Kartica, { studio: "Joga", boja: "#abcdef" })\nconst dugme = screen.getByRole("button", { name: "Rezerviši" })\nexpect(dugme).toHaveClass(${varKlasa("text", "brand")})\nexpect(dugme).not.toHaveClass("text-white")`,
        },
        {
          name: "App: Fitness i Pilates imaju svoje boje",
          code: 'await render(App)\nconst kartice = screen.container.querySelectorAll(\'[data-testid="kartica"]\')\nexpect(kartice).toHaveLength(2)\nexpect(kartice[0].style.getPropertyValue("--brand")).toBe("#edf3cb")\nexpect(kartice[1].style.getPropertyValue("--brand")).toBe("#f9c9de")',
        },
      ],
      hints: [
        "Na `<div data-testid=\"kartica\">` dodaj atribut `style={{ \"--brand\": boja } as CSSProperties}`. Spoljne vitičaste zagrade su JSX, unutrašnje su objekat.",
        "U `className` kartice zameni `bg-gray-100` sa `bg-(--brand)`.",
        "Na dugmetu zameni `text-white` sa `text-(--brand)`. Dugme vidi promenljivu jer je unutar kartice.",
      ],
      explanation:
        "Promenljiva se postavlja jednom, na roditelju, a čita je svako dete kome treba. Isto rade ReformStudio kartice na ulaznom ekranu, samo što vrednosti ne stižu kroz `style`, nego iz `theme.css` preko `data-studio`.",
    },
    {
      kind: "prose",
      md: `### Tema kao skup promenljivih

Jedna promenljiva je boja, a **skup** promenljivih je tema. U ReformStudiju skupove drži \`theme.css\`, a \`data-studio\` bira koji važi. U vežbi nema CSS fajla, pa ulogu \`theme.css\` igra mapa \`Record<Studio, CSSProperties>\`, a vrednosti stižu kroz \`style\`. Ideja je ista: komponente pišu samo \`bg-(--brand)\` i \`text-(--ink)\`, a tema odlučuje šta to znači.`,
    },
    {
      kind: "exercise",
      id: "tw-teme-2",
      title: "Prekidač teme",
      lang: "tsx",
      tailwind: true,
      prompt: `Napravi prekidač između Fitness i Pilates teme, po uzoru na ReformStudio.

1. U mapi \`teme\` dopuni \`pilates\`: \`"--brand": "#f9c9de"\` i \`"--ink": "#3f2c26"\` (vrednosti iz pravog \`theme.css\`).
2. Omotač (\`data-testid="tema"\`) dobija \`data-studio={studio}\` i \`style={teme[studio]}\`.
3. Omotač boji pozadinu i tekst iz promenljivih: \`bg-(--brand)\` i \`text-(--ink)\`, umesto sivih klasa.
4. Dugme "Rezerviši" je obrnuto: pozadina \`bg-(--ink)\`, tekst \`text-(--brand)\`.

Dugmad Fitness i Pilates već menjaju \`studio\`. Kad sve povežeš, klik prefarba celu karticu.`,
      starter: `import { useState, type CSSProperties } from "react"

type Studio = "fitness" | "pilates"

const teme: Record<Studio, CSSProperties> = {
  fitness: { "--brand": "#edf3cb", "--ink": "#282820" } as CSSProperties,
  pilates: {} as CSSProperties, // 1. dopuni
}

const studiji: { id: Studio; naziv: string }[] = [
  { id: "fitness", naziv: "Fitness" },
  { id: "pilates", naziv: "Pilates" },
]

export default function App() {
  const [studio, setStudio] = useState<Studio>("fitness")

  return (
    // 2. i 3.
    <div data-testid="tema" className="max-w-sm rounded-3xl bg-gray-100 p-6 text-gray-900">
      <div className="flex gap-2">
        {studiji.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={studio === s.id}
            onClick={() => setStudio(s.id)}
            className={
              studio === s.id
                ? "rounded-full bg-white px-3 py-1 text-sm font-bold"
                : "rounded-full px-3 py-1 text-sm font-semibold opacity-60"
            }
          >
            {s.naziv}
          </button>
        ))}
      </div>
      <h2 className="mt-6 text-2xl font-extrabold">Danas u 18:00</h2>
      <p className="mt-1 text-sm opacity-70">Slobodna su još 2 mesta.</p>
      {/* 4. */}
      <button type="button" className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white">
        Rezerviši
      </button>
    </div>
  )
}
`,
      solution: `import { useState, type CSSProperties } from "react"

type Studio = "fitness" | "pilates"

const teme: Record<Studio, CSSProperties> = {
  fitness: { "--brand": "#edf3cb", "--ink": "#282820" } as CSSProperties,
  pilates: { "--brand": "#f9c9de", "--ink": "#3f2c26" } as CSSProperties,
}

const studiji: { id: Studio; naziv: string }[] = [
  { id: "fitness", naziv: "Fitness" },
  { id: "pilates", naziv: "Pilates" },
]

export default function App() {
  const [studio, setStudio] = useState<Studio>("fitness")

  return (
    <div
      data-testid="tema"
      data-studio={studio}
      style={teme[studio]}
      className="max-w-sm rounded-3xl bg-(--brand) p-6 text-(--ink) transition-colors duration-300"
    >
      <div className="flex gap-2">
        {studiji.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={studio === s.id}
            onClick={() => setStudio(s.id)}
            className={
              studio === s.id
                ? "rounded-full bg-white px-3 py-1 text-sm font-bold"
                : "rounded-full px-3 py-1 text-sm font-semibold opacity-60"
            }
          >
            {s.naziv}
          </button>
        ))}
      </div>
      <h2 className="mt-6 text-2xl font-extrabold">Danas u 18:00</h2>
      <p className="mt-1 text-sm opacity-70">Slobodna su još 2 mesta.</p>
      <button type="button" className="mt-4 rounded-full bg-(--ink) px-5 py-2.5 text-sm font-semibold text-(--brand)">
        Rezerviši
      </button>
    </div>
  )
}
`,
      tests: [
        {
          name: "na početku je tema fitness",
          code: 'await render(App)\nconst tema = screen.getByTestId("tema")\nexpect(tema.getAttribute("data-studio")).toBe("fitness")\nexpect(tema.style.getPropertyValue("--brand")).toBe("#edf3cb")',
        },
        {
          name: "omotač čita pozadinu i tekst iz promenljivih",
          code: `await render(App)\nexpect(screen.getByTestId("tema")).toHaveClass(${varKlasa("bg", "brand")}, ${varKlasa("text", "ink")})`,
        },
        {
          name: "dugme Rezerviši koristi obrnute boje teme",
          code: `await render(App)\nexpect(screen.getByRole("button", { name: "Rezerviši" })).toHaveClass(${varKlasa("bg", "ink")}, ${varKlasa("text", "brand")})`,
        },
        {
          name: "klik na Pilates menja celu temu",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: "Pilates" }))\nconst tema = screen.getByTestId("tema")\nexpect(tema.getAttribute("data-studio")).toBe("pilates")\nexpect(tema.style.getPropertyValue("--brand")).toBe("#f9c9de")\nexpect(tema.style.getPropertyValue("--ink")).toBe("#3f2c26")',
        },
      ],
      hints: [
        "Mapa: `pilates: { \"--brand\": \"#f9c9de\", \"--ink\": \"#3f2c26\" } as CSSProperties`.",
        "Na omotač dodaj `data-studio={studio}` i `style={teme[studio]}`, a u `className` zameni `bg-gray-100 text-gray-900` sa `bg-(--brand) text-(--ink)`.",
        "Dugme \"Rezerviši\": `bg-(--ink)` umesto `bg-black` i `text-(--brand)` umesto `text-white`.",
      ],
      explanation:
        "Nijedna klasa se ne menja kad se promeni studio: menja se samo skup vrednosti koji važi. U pravom projektu bi `data-studio` sam bio dovoljan, jer CSS (`[data-studio='pilates'] { … }`) bira vrednosti. Ovde ih nosi `style`, a `data-studio` ostaje kao oznaka koju vidiš i u DevTools-u.",
    },
    {
      kind: "prose",
      md: `### Fontovi i animacije su takođe tokeni

\`@theme\` nije samo za boje. ReformStudio u drugom bloku istog fajla definiše font i sve animacije:`,
    },
    {
      kind: "code",
      lang: "css",
      filename: "ReformStudio · src/index.css (isečak)",
      code: `@theme {
  --font-sans:
    'Manrope Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;

  --animate-screen-in: screen-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  --animate-pop: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  /* … */

  @keyframes pop {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  /* … */
}`,
      highlight: [6, 9],
      caption:
        "`--animate-pop` pravi klasu `animate-pop`, a `@keyframes pop` unutar `@theme` opisuje sam pokret: od 60% veličine do pune, uz mali odskok (`cubic-bezier` sa 1.56 nakratko prebaci preko 100%). Strelica na kartici studija se pojavi sa `animate-pop`, a svaki ekran ulazi sa `animate-screen-in`.",
    },
    {
      kind: "prose",
      md: `PlazaHome font učitava preko Next.js-a, u tri koraka:

1. \`localFont({ …, variable: "--font-albert" })\` u \`src/app/layout.tsx\` napravi CSS promenljivu sa fontom.
2. \`<html className={sans.variable}>\` tu promenljivu postavi na celu stranicu.
3. \`--font-sans: var(--font-albert), …\` u \`@theme\` je poveže sa Tailwind-om.

Nijedna komponenta ne mora da zna kako se font zove. Isto važi za boje, razmake i animacije: **ime je u kodu, vrednost je u temi.**`,
    },
    {
      kind: "prose",
      md: `### Komponenta dizajn sistema

Tokeni su reči, a komponente su rečenice. **Dizajn sistem** je skup oba: tokeni kažu koje boje i razmaci postoje, a komponente (\`Button\`, \`Badge\`, \`TextField\`) kažu kako se od njih slaže dugme ili bedž. Ostatak aplikacije onda samo bira: \`<Button variant="outline" size="sm">\`.

Mape \`variants\` i \`sizes\` iz \`Button.tsx\` su bile tema prošle lekcije. Evo i ostatka, same komponente:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/components/Button.tsx (isečak)",
      code: `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  loading?: boolean
  icon?: ReactNode
}

export const Button = ({
  variant,
  size,
  block,
  loading,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={buttonClass({ variant, size, block }, className)}
    {...props}
  >
    {loading ? <Spinner /> : icon}
    {children}
  </button>
)`,
      highlight: [1, 15, 20, 22, 23],
    },
    {
      kind: "prose",
      md: `Četiri odluke koje vredi zapamtiti:

- **\`extends ButtonHTMLAttributes<HTMLButtonElement>\`**: \`Button\` prima sve što prima običan \`<button>\` (\`onClick\`, \`disabled\`, \`aria-label\`…), plus svoje propse (\`StyleProps\` su \`variant\`, \`size\` i \`block\`).
- **\`type = 'button'\`**: običan \`<button>\` unutar forme je \`submit\` i pošalje formu. Ovako to mora da se traži namerno.
- **\`disabled={disabled || loading}\`**: dok se nešto učitava, dugme je onemogućeno, pa ga \`disabled:\` klase iz \`buttonClass\` same izblede.
- **\`...props\`**: sve ostalo ide dalje na \`<button>\`, bez nabrajanja jedno po jedno.`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Kad je vreme za komponentu",
      md: "Ekrani ne bi trebalo ručno da pišu `bg-ink-900 text-brand-50 h-12 px-6 rounded-full font-semibold…`. Kad istu kombinaciju klasa napišeš treći put, to je znak da joj treba komponenta, ili nova varijanta postojeće.",
    },
    {
      kind: "exercise",
      id: "tw-teme-3",
      title: "Dugme iz dizajn sistema",
      lang: "tsx",
      tailwind: true,
      prompt: `Napravi \`Dugme\`, malu verziju ReformStudio \`Button\`-a. Tipovi, \`cn\` i \`DugmeProps\` su već tu.

1. Napiši mapu **\`varijante\`** (\`Record<Varijanta, string>\`): svaka varijanta ima svoju pozadinu/ivicu i boju teksta, i **svoju \`hover:\` klasu**. Varijanta \`outline\` mora da ima klasu \`border\`.
2. Napiši mapu **\`velicine\`** (\`Record<Velicina, string>\`): tri **različita** stringa (npr. visina, razmak sa strane i veličina teksta).
3. U \`Dugme\` primi \`varijanta\` (podrazumevano \`"primary"\`), \`velicina\` (podrazumevano \`"md"\`), \`block\`, \`className\` i \`...props\`, pa složi klase sa \`cn(...)\`:
   - osnovne klase, među njima bar jedna \`disabled:…\`
   - \`varijante[varijanta]\` i \`velicine[velicina]\`
   - \`w-full\` samo kad je \`block\`
   - \`className\` koji stiže spolja
4. \`{...props}\` prosledi na \`<button>\`, da bi radili \`onClick\`, \`disabled\` i \`children\`.`,
      starter: `import type { ButtonHTMLAttributes } from "react"

type Varijanta = "primary" | "outline" | "danger"
type Velicina = "sm" | "md" | "lg"

function cn(...klase: (string | false | null | undefined)[]) {
  return klase.filter(Boolean).join(" ")
}

// 1. const varijante: Record<Varijanta, string> = { … }
// 2. const velicine: Record<Velicina, string> = { … }

interface DugmeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varijanta?: Varijanta
  velicina?: Velicina
  block?: boolean
}

// 3. i 4.
export function Dugme({ children }: DugmeProps) {
  return <button className="rounded-full bg-black px-6 py-3 font-semibold text-white">{children}</button>
}

export default function App() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Dugme>Rezerviši</Dugme>
      <Dugme varijanta="outline" velicina="sm">
        Detalji termina
      </Dugme>
      <Dugme varijanta="danger">Otkaži termin</Dugme>
      <Dugme velicina="lg" block>
        Plati članarinu
      </Dugme>
      <Dugme disabled>Popunjeno</Dugme>
    </div>
  )
}
`,
      solution: `import type { ButtonHTMLAttributes } from "react"

type Varijanta = "primary" | "outline" | "danger"
type Velicina = "sm" | "md" | "lg"

function cn(...klase: (string | false | null | undefined)[]) {
  return klase.filter(Boolean).join(" ")
}

const varijante: Record<Varijanta, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700",
  outline: "border border-black/15 bg-white text-zinc-900 hover:border-black/40",
  danger: "bg-red-700 text-white hover:bg-red-800",
}

const velicine: Record<Velicina, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-base",
}

interface DugmeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varijanta?: Varijanta
  velicina?: Velicina
  block?: boolean
}

export function Dugme({
  varijanta = "primary",
  velicina = "md",
  block = false,
  className,
  type = "button",
  ...props
}: DugmeProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-45",
        varijante[varijanta],
        velicine[velicina],
        block && "w-full",
        className,
      )}
      {...props}
    />
  )
}

export default function App() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Dugme>Rezerviši</Dugme>
      <Dugme varijanta="outline" velicina="sm">
        Detalji termina
      </Dugme>
      <Dugme varijanta="danger">Otkaži termin</Dugme>
      <Dugme velicina="lg" block>
        Plati članarinu
      </Dugme>
      <Dugme disabled>Popunjeno</Dugme>
    </div>
  )
}
`,
      tests: [
        {
          name: "mape imaju klase za svaku vrednost, a veličine su različite",
          code: 'for (const v of ["primary", "outline", "danger"]) expect(varijante[v].trim().length > 0).toBe(true)\nconst vel = ["sm", "md", "lg"].map((v) => velicine[v].trim())\nexpect(vel.every((s) => s.length > 0)).toBe(true)\nexpect(new Set(vel).size).toBe(3)',
        },
        {
          name: "svaka varijanta ima hover:, a outline ima border",
          code: 'for (const v of ["primary", "outline", "danger"]) expect(varijante[v].split(/\\s+/).some((k) => k.startsWith("hover:"))).toBe(true)\nexpect(varijante.outline.split(/\\s+/)).toContain("border")',
        },
        {
          name: "bez propsa: varijanta primary i veličina md",
          code: 'await render(Dugme, { children: "Sačuvaj" })\nconst klase = (varijante.primary + " " + velicine.md).split(/\\s+/).filter(Boolean)\nexpect(screen.getByRole("button", { name: "Sačuvaj" })).toHaveClass(...klase)',
        },
        {
          name: "varijanta i veličina stižu iz propsa",
          code: 'await render(Dugme, { varijanta: "danger", velicina: "lg", children: "Obriši" })\nconst dugme = screen.getByRole("button", { name: "Obriši" })\nexpect(dugme).toHaveClass(...(varijante.danger + " " + velicine.lg).split(/\\s+/).filter(Boolean))\nconst samoPrimary = varijante.primary.split(/\\s+/).filter((k) => k && !varijante.danger.split(/\\s+/).includes(k))\nfor (const k of samoPrimary) expect(dugme).not.toHaveClass(k)',
        },
        {
          name: "block dodaje w-full, a className stiže spolja",
          code: 'await render(Dugme, { block: true, className: "mt-4", children: "Plati" })\nexpect(screen.getByRole("button", { name: "Plati" })).toHaveClass("w-full", "mt-4")\nawait render(Dugme, { children: "Detalji" })\nexpect(screen.getByRole("button", { name: "Detalji" })).not.toHaveClass("w-full")',
        },
        {
          name: "disabled i onClick prolaze kroz ...props",
          code: 'await render(Dugme, { disabled: true, children: "Popunjeno" })\nconst off = screen.getByRole("button", { name: "Popunjeno" })\nexpect(off).toBeDisabled()\nexpect(off).toHaveClass(/^disabled:/)\nlet klikovi = 0\nawait render(Dugme, { onClick: () => { klikovi++ }, children: "Rezerviši" })\nawait click(screen.getByRole("button", { name: "Rezerviši" }))\nexpect(klikovi).toBe(1)',
        },
      ],
      hints: [
        "Mape, npr: `primary: \"bg-zinc-900 text-white hover:bg-zinc-700\"`, `outline: \"border border-black/15 bg-white hover:border-black/40\"`, a veličine `sm: \"h-10 px-4 text-sm\"`, `md: \"h-12 px-6\"`, `lg: \"h-14 px-7 text-base\"`.",
        "Potpis: `function Dugme({ varijanta = \"primary\", velicina = \"md\", block = false, className, ...props }: DugmeProps)`. `children` je unutar `props`.",
        "`<button className={cn(\"inline-flex … disabled:opacity-45\", varijante[varijanta], velicine[velicina], block && \"w-full\", className)} {...props} />`. Po želji dodaj i `type = \"button\"` kao u ReformStudiju.",
      ],
      explanation:
        "Ovo je ceo recept za komponentu dizajn sistema: **mape** za izbore (varijanta, veličina), **`cn`** za uslove (`block`, `className`), **varijante** za stanja (`hover:`, `disabled:`) i **`...props`** da komponenta ostane pravo dugme. ReformStudio `Button` ima osam varijanti i spinner, ali je složen tačno ovako.",
    },
    {
      kind: "quiz",
      id: "tw-teme-quiz",
      questions: [
        {
          q: "U `@theme` piše `--color-petrol: #26546c;`. Šta time nastaje?",
          options: [
            "Klase `bg-petrol`, `text-petrol`, `border-petrol`… za sve što prima boju",
            "Samo klasa `color-petrol`",
            "Klasa `bg-color-petrol`",
            "Ništa, mora i `tailwind.config.js`",
          ],
          answer: 0,
          why: "Prefiks `--color-` kaže Tailwind-u da je to boja, a ostatak (`petrol`) postaje ime u svim klasama za boju. U v4 nema potrebe za `tailwind.config.js`.",
        },
        {
          q: "Šta radi `--color-*: initial;` u PlazaHome-u?",
          options: [
            "Briše sve podrazumevane Tailwind boje, pa ostaju samo boje brenda",
            "Vraća boje na početne vrednosti posle greške",
            "Postavlja sve boje na crnu",
            "Uključuje tamnu temu",
          ],
          answer: 0,
          why: "Posle toga `bg-red-500` više ne postoji. Tako se na sajtu mogu koristiti samo boje iz palete brenda.",
        },
        {
          q: "Zašto ReformStudio koristi `@theme inline`, a ne samo `@theme`?",
          options: [
            "Da klasa čita `var(--brand-200)` na samom elementu, pa `data-studio` radi i na jednoj kartici",
            "Da CSS fajl bude kraći",
            "Zato što `@theme` ne radi sa bojama",
            "Da boje ne mogu da se menjaju",
          ],
          answer: 0,
          why: "Bez `inline`, vrednost se izračuna jednom na `<html>` i nasledi se naniže. Sa `inline`, svaki element čita svoju vrednost, pa kartica sa `data-studio=\"pilates\"` bude roze i kad je ostatak ekrana neutralan.",
        },
        {
          q: "Koja klasa u Tailwind-u v4 daje pozadinu iz CSS promenljive `--brand`?",
          options: ["`bg-(--brand)`", "`bg-brand-var`", "`bg-{--brand}`", "`background-(--brand)`"],
          answer: 0,
          why: "`bg-(--brand)` je kratak zapis za `bg-[var(--brand)]`. Isto važi za `text-(--ink)`, `border-(--brand)`…",
        },
        {
          q: "Zašto TypeScript ovde prijavi grešku?",
          code: '<div style={{ "--brand": boja }} />',
          codeLang: "tsx",
          options: [
            "`CSSProperties` ne zna za imena koja počinju sa `--`, pa treba `as CSSProperties`",
            "CSS promenljive ne rade u React-u",
            "Vrednost mora da bude broj",
            "`style` prima string, a ne objekat",
          ],
          answer: 0,
          why: "React CSS promenljive u `style` prosledi bez problema, ali tip `CSSProperties` ih ne poznaje. `as CSSProperties` (ili PlazaHome-ova funkcija `vars`) to rešava.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-tw-teme-1",
      front: "Šta je dizajn token?",
      back: "Imenovana odluka o izgledu (`petrol`, `brand-300`, `shadow-card`). Kod koristi ime, a vrednost se menja na jednom mestu.",
    },
    {
      id: "fc-tw-teme-2",
      front: "Kako `@theme` pravi klase?",
      back: "Prefiks promenljive bira vrstu klase: `--color-sand` → `bg-sand`, `text-sand`…; `--font-sans` → `font-sans`; `--spacing-section` → `py-section`; `--animate-pop` → `animate-pop`.",
    },
    {
      id: "fc-tw-teme-3",
      front: "Zašto ReformStudio piše `@theme inline`?",
      back: "Klasa tada sadrži `var(--brand-200)` direktno, pa se vrednost čita na samom elementu. Tako `data-studio` na jednoj kartici menja boje samo te kartice.",
    },
    {
      id: "fc-tw-teme-4",
      front: "Kako ReformStudio menja temu studija?",
      back: "`theme.css` ima iste promenljive sa drugim vrednostima za `[data-studio='fitness']` i `[data-studio='pilates']`. Izbor studija samo postavi `data-studio` na `<html>`.",
    },
    {
      id: "fc-tw-teme-5",
      front: "Kako se u v4 koristi CSS promenljiva u klasi?",
      back: "`bg-(--brand)` (ili `bg-[var(--brand)]`), a vrednost se postavi kroz `style={{ \"--brand\": \"#…\" } as CSSProperties}`.",
    },
  ],
};

export default lesson;
