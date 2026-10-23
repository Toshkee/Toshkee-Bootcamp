import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "komponente-i-jsx",
  title: "Komponente i JSX",
  summary:
    "Šta je React komponenta, kako se piše JSX i kako se od malih komponenti slaže ceo ekran, kao u ReformStudiju.",
  minutes: 18,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Otvori bilo koji ekran u ReformStudiju: listu termina, profil, kartice sa članarinom. Svaki od njih je složen od malih delova: \`BookingCard\`, \`Badge\`, \`EmptyState\`, \`Button\`… Svaki taj deo je **React komponenta**.

Komponenta je obična JavaScript **funkcija koja vraća opis dela ekrana**. React pozove tvoju funkciju, vidi šta je vratila i to nacrta u browseru. Kad se podaci promene, pozove je ponovo i ažurira samo ono što se promenilo.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao LEGO kockice",
      md: "Svaka komponenta je jedna kockica: dugme, bedž, kartica. Od kockica slažeš veće delove (kartica termina), a od njih ceo ekran. Kockicu napraviš jednom, a koristiš je gde god ti treba.",
    },
    {
      kind: "prose",
      md: `### Najmanja komponenta

Ovo je kompletna React komponenta:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Pozdrav.tsx",
      code: `function Pozdrav() {
  return <h1>Zdravo, Reform!</h1>
}

// Koristiš je kao HTML tag:
<Pozdrav />`,
      highlight: [1, 2],
      caption:
        "Ime počinje **velikim slovom**, a funkcija vraća nešto što izgleda kao HTML. To \"nešto\" je **JSX**.",
    },
    {
      kind: "prose",
      md: `Dva pravila koja važe za svaku komponentu:

- **Ime počinje velikim slovom.** \`<Pozdrav />\` je tvoja komponenta, a \`<pozdrav />\` bi React shvatio kao (nepostojeći) HTML tag.
- **Vraća JSX** (ili \`null\`, kad ne treba ništa da se prikaže).`,
    },
    {
      kind: "prose",
      md: `### JSX: liči na HTML, ali je JavaScript

JSX izgleda kao HTML, ali se pretvara u JavaScript pozive. Zato ima nekoliko razlika koje te na početku sigurno saplitaju:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Kartica.tsx",
      code: `function Kartica() {
  const studio = "Fitness"
  const slobodno = 6 - 4

  return (
    <div className="card">
      <h2>{studio.toUpperCase()}</h2>
      <p>Slobodnih mesta: {slobodno}</p>
      <img src="/logo.png" alt="Logo" />
      <button onClick={() => alert("Rezervisano!")}>Rezerviši</button>
    </div>
  )
}`,
      highlight: [6, 7, 9, 10],
      caption:
        "`className` umesto `class`, `{...}` za JavaScript izraze, svaki tag zatvoren (`<img />`), događaji u camelCase-u (`onClick`).",
    },
    {
      kind: "prose",
      md: `Pravila, jedno po jedno:

1. **\`className\` umesto \`class\`**, jer je \`class\` rezervisana reč u JavaScriptu.
2. **Vitičaste zagrade \`{ }\`** ubacuju bilo koji JavaScript *izraz*: promenljivu, račun, poziv funkcije. Ne i \`if\` ili \`for\`, jer to nisu izrazi.
3. **Svaki tag mora biti zatvoren.** \`<img>\` i \`<input>\` pišeš kao \`<img />\` i \`<input />\`.
4. **Jedan roditelj.** Komponenta vraća jedan element. Ako ti ne treba omotač, koristi prazan tag \`<>…</>\` (Fragment).
5. **Događaji su camelCase** (\`onClick\`, \`onChange\`) i primaju **funkciju**, a ne string.
6. **\`style\` prima objekat**: \`style={{ color: "red", marginTop: 8 }}\`. Spoljne zagrade su za JavaScript, a unutrašnje su sam objekat.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: zagrade posle return",
      md: "Ako JSX počinje u novom redu posle `return`, obavezno ga stavi u zagrade: `return ( … )`. Bez njih JavaScript vrati `undefined` i ništa se ne prikaže.",
    },
    {
      kind: "playground",
      id: "react-jsx-peskovnik",
      title: "Probaj JSX",
      prompt:
        "Ovo je pravi React. Menjaj tekst, promenljive i brojeve, i gledaj kako se pregled ispod osvežava dok kucaš. Probaj da promeniš `className` u `class` i pređi mišem preko crvene linije.",
      lang: "tsx",
      code: `function App() {
  const studio = "Pilates"
  const kapacitet = 6
  const zauzeto = 4

  return (
    <div className="card">
      <h2>{studio}</h2>
      <p>Slobodnih mesta: {kapacitet - zauzeto} od {kapacitet}</p>
      <p className="muted">Danas u {18}:00</p>
      <button>Rezerviši</button>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Komponente u komponentama

Prava snaga dolazi kad komponente koriste jedna drugu. \`App\` ne mora sve da crta sama, nego slaže manje komponente kao kockice:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "App.tsx",
      code: `function Zaglavlje() {
  return <h1>Reform Studio</h1>
}

function Termin() {
  return <div className="card">Fitness · 18:00</div>
}

function App() {
  return (
    <>
      <Zaglavlje />
      <Termin />
      <Termin />
    </>
  )
}`,
      highlight: [11, 12, 13, 14, 15],
      caption:
        "`Termin` je napisan jednom, a prikazan dva puta. U sledećoj lekciji ga učimo da prima podatke (props), pa da svaki prikaže drugi termin.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/EmptyState.tsx",
      lang: "tsx",
      startLine: 1,
      intro:
        "Ovo je prazno stanje iz ReformStudija, ono što vidiš kad, na primer, nemaš nijednu rezervaciju. Cela komponenta ima 20 linija.",
      code: `import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  body?: string
  action?: ReactNode
}

export const EmptyState = ({ icon: Icon, title, body, action }: EmptyStateProps) => (
  <div className="flex animate-screen-in flex-col items-center rounded-[28px] border border-dashed border-brand-400/70 bg-white/50 px-8 py-10 text-center">
    <span className="flex size-14 items-center justify-center rounded-full bg-brand-200 text-ink-900">
      <Icon size={24} strokeWidth={1.75} />
    </span>
    <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
    {body && <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{body}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)
`,
      steps: [
        {
          lines: [4, 9],
          md: "Interfejs opisuje šta komponenta **prima spolja**: ikonicu, naslov, opcioni tekst i opciono dugme. To su **props**, tema sledeće lekcije. `ReactNode` je tip za \"bilo šta što React ume da nacrta\".",
        },
        {
          lines: 11,
          md: "Komponenta je **arrow funkcija** sačuvana u konstanti. Ime počinje velikim slovom, a `export` je čini dostupnom drugim ekranima. Primeti `icon: Icon`: preimenovanje pri destrukturiranju, jer komponenta u JSX-u mora početi velikim slovom.",
        },
        {
          lines: [12, 14],
          md: "Obični HTML tagovi sa `className`. Dugačke klase su **Tailwind**, o njima u modulu Stil i stanje. `<Icon size={24} />` crta komponentu ikonice koju je pozivalac prosledio.",
        },
        {
          lines: 15,
          md: "`{title}` ubacuje vrednost promenljive u JSX. Šta god pozivalac prosledi kao naslov, pojaviće se ovde.",
        },
        {
          lines: [16, 17],
          md: "`{body && <p>…</p>}` znači: ako `body` postoji, nacrtaj paragraf, a ako ne, ništa. To je **uslovno crtanje**, radimo ga detaljno u lekciji o listama i uslovima.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "A Looply?",
      md: "Looply je pisan u **React Native**-u: isti React, iste komponente i hook-ovi, ali umesto HTML tagova koristi gotove mobilne blokove: `<View>` umesto `<div>`, `<Text>` umesto `<p>`, `<Pressable>` umesto `<button>`. Sve što ovde naučiš važi i tamo. Menjaju se samo kockice na dnu.",
    },
    {
      kind: "exercise",
      id: "react-jsx-1",
      title: "Tvoja prva komponenta",
      lang: "tsx",
      prompt: `Napravi komponentu \`Pozdrav\` koja vraća naslov \`<h1>\` sa tekstom **Zdravo, Reform!**, pa je prikaži unutar \`App\`.

Pregled ispod se osvežava dok kucaš, a dugme **Pokreni** proverava testove.`,
      starter: `// 1. Napravi komponentu Pozdrav ovde


export default function App() {
  return (
    <div>
      {/* 2. Prikaži <Pozdrav /> ovde */}
      <p>Dobro došli u studio.</p>
    </div>
  )
}
`,
      solution: `function Pozdrav() {
  return <h1>Zdravo, Reform!</h1>
}

export default function App() {
  return (
    <div>
      <Pozdrav />
      <p>Dobro došli u studio.</p>
    </div>
  )
}
`,
      tests: [
        { name: "postoji komponenta Pozdrav", code: 'expect(typeof Pozdrav).toBe("function")' },
        {
          name: "Pozdrav crta naslov \"Zdravo, Reform!\"",
          code: 'await render(Pozdrav)\nexpect(screen.getByRole("heading")).toHaveTextContent("Zdravo, Reform!")',
        },
        {
          name: "App prikazuje pozdrav i poruku",
          code: 'await render(App)\nexpect(screen.getByRole("heading", { name: "Zdravo, Reform!" })).toBeInTheDocument()\nexpect(screen.getByText("Dobro došli u studio.")).toBeInTheDocument()',
        },
      ],
      hints: [
        "Komponenta je funkcija sa imenom koje počinje velikim slovom: `function Pozdrav() { return … }`.",
        "U `App` je koristiš kao tag: `<Pozdrav />`, odmah iznad `<p>`.",
      ],
      explanation:
        "To je ceo trik: funkcija koja vraća JSX postaje novi \"tag\" koji možeš da koristiš koliko god puta hoćeš.",
    },
    {
      kind: "exercise",
      id: "react-jsx-2",
      title: "Popravi JSX",
      lang: "tsx",
      prompt: `Ova komponenta je pisana kao čist HTML, pa je TypeScript pun crvenih linija. Pređi mišem preko svake greške i popravi JSX:

- \`class\` → \`className\`
- zatvori tagove koji nisu zatvoreni
- komponenta mora da vrati **jedan** roditeljski element`,
      starter: `export default function App() {
  return (
    <h2 class="naslov">Profil</h2>
    <input placeholder="Ime i prezime">
    <img src="/vezbe/avatar.svg" alt="Avatar">
  )
}
`,
      solution: `export default function App() {
  return (
    <div>
      <h2 className="naslov">Profil</h2>
      <input placeholder="Ime i prezime" />
      <img src="/vezbe/avatar.svg" alt="Avatar" />
    </div>
  )
}
`,
      tests: [
        {
          name: "prikazuje naslov \"Profil\" sa klasom naslov",
          code: 'await render(App)\nconst h = screen.getByRole("heading", { name: "Profil" })\nexpect(h.className).toBe("naslov")',
        },
        {
          name: "prikazuje polje za ime",
          code: 'await render(App)\nexpect(screen.getByPlaceholderText("Ime i prezime")).toBeInTheDocument()',
        },
        {
          name: "prikazuje avatar",
          code: 'await render(App)\nexpect(screen.getByRole("img", { name: "Avatar" })).toBeInTheDocument()',
        },
      ],
      hints: [
        "Kreni od prve crvene linije. Tri `<h2>`, `<input>` i `<img>` taga jedan do drugog nisu jedan element: obmotaj ih u `<div>…</div>` (ili `<>…</>`).",
        "`<input …>` i `<img …>` nemaju zatvarajući tag, pa ih zatvori kosom crtom na kraju: `<input … />`.",
      ],
      explanation:
        "Kad kopiraš HTML sa interneta u React, ovo su baš tri stvari koje uvek moraš da popraviš. VS Code ti ih podvuče, isto kao ovde.",
    },
    {
      kind: "exercise",
      id: "react-jsx-3",
      title: "JavaScript unutar JSX-a",
      lang: "tsx",
      prompt: `Kartica termina treba da izračuna i prikaže podatke iz promenljivih. Umesto upisanih vrednosti, iskoristi \`{ }\`:

- naslov prikazuje \`studio\` **velikim slovima** (\`FITNESS\`)
- paragraf prikazuje **Slobodnih mesta: 2**, izračunato kao \`kapacitet - zauzeto\`
- treći red prikazuje **Početak: 18:00**, iz promenljive \`vreme\``,
      starter: `export default function App() {
  const studio = "fitness"
  const kapacitet = 6
  const zauzeto = 4
  const vreme = "18:00"

  return (
    <div className="card">
      <h2>studio</h2>
      <p>Slobodnih mesta: ?</p>
      <p>Početak: ?</p>
    </div>
  )
}
`,
      solution: `export default function App() {
  const studio = "fitness"
  const kapacitet = 6
  const zauzeto = 4
  const vreme = "18:00"

  return (
    <div className="card">
      <h2>{studio.toUpperCase()}</h2>
      <p>Slobodnih mesta: {kapacitet - zauzeto}</p>
      <p>Početak: {vreme}</p>
    </div>
  )
}
`,
      tests: [
        {
          name: "naslov je \"FITNESS\"",
          code: 'await render(App)\nexpect(screen.getByRole("heading")).toHaveTextContent("FITNESS")',
        },
        {
          name: "prikazuje \"Slobodnih mesta: 2\"",
          code: 'await render(App)\nexpect(screen.getByText("Slobodnih mesta: 2")).toBeInTheDocument()',
        },
        {
          name: "prikazuje \"Početak: 18:00\"",
          code: 'await render(App)\nexpect(screen.getByText("Početak: 18:00")).toBeInTheDocument()',
        },
      ],
      hints: [
        "Sve unutar `{ }` je JavaScript. `{studio}` prikazuje vrednost, a `studio` bez zagrada je samo tekst.",
        "Velika slova: `{studio.toUpperCase()}`. Račun: `{kapacitet - zauzeto}`.",
      ],
      explanation:
        "Vitičaste zagrade su vrata između JSX-a i JavaScripta. Kroz njih prolazi svaka vrednost koju vidiš na ekranu tvojih aplikacija.",
    },
    {
      kind: "quiz",
      id: "react-jsx-quiz",
      questions: [
        {
          q: "Šta je React komponenta?",
          options: [
            "Funkcija koja vraća JSX (opis dela ekrana)",
            "HTML fajl sa posebnim tagovima",
            "CSS klasa za raspored elemenata",
            "Objekat sa podacima iz baze",
          ],
          answer: 0,
          why: "Komponenta je obična funkcija. React je poziva i crta ono što vrati.",
        },
        {
          q: "Zašto ovaj kod ne prikazuje komponentu?",
          code: `function kartica() {
  return <div>Termin</div>
}

<kartica />`,
          codeLang: "tsx",
          options: [
            "Ime počinje malim slovom, pa React misli da je to HTML tag",
            "Nedostaje `export`",
            "`<div>` ne sme da se koristi u komponenti",
            "Komponenta mora da vrati string",
          ],
          answer: 0,
          why: "Mala slova su rezervisana za HTML tagove (`div`, `p`…). Tvoje komponente uvek počinju velikim slovom.",
        },
        {
          q: "Kako se u JSX-u dodaje CSS klasa?",
          options: ["`className=\"card\"`", "`class=\"card\"`", "`css=\"card\"`", "`style=\"card\"`"],
          answer: 0,
          why: "`class` je rezervisana reč u JavaScriptu, pa JSX koristi `className`.",
        },
        {
          q: "Šta prikazuje `<p>{2 + 3}</p>`, a šta `<p>2 + 3</p>`?",
          options: [
            "Prvi prikazuje 5, drugi tekst \"2 + 3\"",
            "Oba prikazuju 5",
            "Oba prikazuju \"2 + 3\"",
            "Prvi je greška",
          ],
          answer: 0,
          why: "Samo ono što je u `{ }` se izvršava kao JavaScript. Sve van zagrada je običan tekst.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-jsx-1",
      front: "Šta je React komponenta?",
      back: "Funkcija čije ime počinje velikim slovom i koja vraća JSX. Koristi se kao tag: `<Kartica />`.",
    },
    {
      id: "fc-react-jsx-2",
      front: "Kako ubaciti JavaScript vrednost u JSX?",
      back: "Vitičastim zagradama: `<p>{ime}</p>`, `<p>{a - b}</p>`.",
    },
    {
      id: "fc-react-jsx-3",
      front: "Koje su tri najčešće razlike JSX-a u odnosu na HTML?",
      back: "`className` umesto `class`, svaki tag zatvoren (`<img />`), i jedan roditeljski element (ili `<>…</>`).",
    },
    {
      id: "fc-react-jsx-4",
      front: "Čemu služi `<>…</>`?",
      back: "To je **Fragment**: grupiše više elemenata bez dodatnog `<div>`-a u DOM-u.",
    },
  ],
};

export default lesson;
