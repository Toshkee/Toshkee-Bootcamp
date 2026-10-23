import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "custom-hookovi",
  title: "Deljenje state-a i custom hook-ovi",
  summary:
    "Kako dve komponente dele isti state, čemu služe `useRef` i `useMemo`, kako se piše sopstveni hook i kako se u to uklapaju Zustand store-ovi iz ReformStudija i Looply-ja.",
  minutes: 22,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Do sada je svaka komponenta imala svoj state i brinula o sebi. Ali na pravom ekranu delovi moraju da **znaju jedni za druge**: klik na "Otkaži" u kartici termina otvara potvrdu koja je potpuno druga komponenta. Izabrana kartica "Predstojeći / Prošli" menja i kontrolu na vrhu i listu ispod nje.

U ovoj lekciji gledamo kako se state deli, i kako se logika koja se ponavlja (tajmeri, prekidači, čuvanje) spakuje u **tvoj sopstveni hook**, baš kao \`useNow\` u ReformStudiju ili \`useToday\` u Looply-ju.`,
    },
    {
      kind: "prose",
      md: `### Podizanje state-a (lifting state up)

Pravilo je kratko: **state živi u najbližem zajedničkom roditelju svih komponenti koje ga koriste.** Roditelj onda deci šalje dve stvari kroz props:

- **vrednost**, da je prikažu,
- **funkciju**, da jave kad nešto treba promeniti.

Podaci teku **nadole** (kroz props), a događaji **nagore** (kroz pozive funkcija). Dete samo nikad ne menja roditeljev state, nego ga *zamoli*.`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Podizanje.tsx",
      code: `// ❌ Svako dugme ima svoj state, zaglavlje ne zna ništa
function Stavka() {
  const [rezervisan, setRezervisan] = useState(false)
  // ...
}

// ✅ State je kod roditelja, deca dobijaju vrednost i funkciju
function Ekran() {
  const [rezervisani, setRezervisani] = useState<string[]>([])
  return (
    <>
      <Zaglavlje broj={rezervisani.length} />
      <Stavka
        rezervisan={rezervisani.includes("t1")}
        onRezervisi={() => setRezervisani([...rezervisani, "t1"])}
      />
    </>
  )
}`,
      highlight: [9, 12, 14, 15],
      caption:
        "Kad je state \"podignut\" u `Ekran`, i `Zaglavlje` i `Stavka` vide istu istinu. `Stavka` postaje obična komponenta koja samo crta ono što dobije.",
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao tabla na recepciji",
      md: "Kad svaki trener vodi rezervacije u svojoj svesci, niko nema celu sliku i brojevi se razilaze. Kad postoji jedna tabla na recepciji (roditelj), svi čitaju sa nje, a ko hoće promenu, javi recepciji. Tabla je jedini izvor istine.",
    },
    {
      kind: "prose",
      md: `Ovo već postoji u tvom kodu. \`BookingsScreen\` drži izabranu karticu i termin koji se otkazuje:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/screens/BookingsScreen.tsx (linije 84–92)",
      code: `        <SegmentedControl<Tab>
          label={t.bookings.title}
          value={tab}
          onChange={setTab}
          options={[
            { id: 'upcoming', label: t.bookings.upcoming, count: upcoming.length },
            { id: 'past', label: t.bookings.past, count: past.length },
          ]}
        />`,
      highlight: [3, 4],
      caption:
        "`SegmentedControl` nema svoj state: dobija `value={tab}` i `onChange={setTab}`. Setter ide pravo kao prop. Isti `tab` ekran koristi i da odluči koja lista se crta ispod.",
    },
    {
      kind: "prose",
      md: `Na isti način svaki \`BookingCard\` dobija \`onCancel={() => setCancelTarget(booking)}\` (videli smo to u lekciji o listama). Kartica ne zna ništa o potvrdi otkazivanja. Ona samo javi "klikli su na mene", a ekran upiše \`cancelTarget\` i otvori \`BottomSheet\`. State je na ekranu jer ga koriste **dve** komponente: kartica i potvrda.`,
    },
    {
      kind: "exercise",
      id: "react-hook-1",
      title: "Podigni state",
      lang: "tsx",
      prompt: `Svaka \`StavkaTermina\` sada čuva svoj state, pa zaglavlje uvek piše **Rezervisano: 0**. Podigni state u \`App\`:

1. U \`App\` napravi state \`rezervisani\`: niz id-jeva rezervisanih termina.
2. \`StavkaTermina\` više nema svoj state. Dobija \`rezervisan: boolean\` i \`onPrebaci: () => void\`.
3. Klik na **Rezerviši** dodaje id u niz, a klik na **Otkaži** ga uklanja.
4. \`Zaglavlje\` dobija pravi broj rezervisanih.`,
      starter: `import { useState } from "react"

interface Termin {
  id: string
  naziv: string
}

const TERMINI: Termin[] = [
  { id: "t1", naziv: "Pilates 09:00" },
  { id: "t2", naziv: "Reformer 18:00" },
  { id: "t3", naziv: "Mat 19:30" },
]

function Zaglavlje({ broj }: { broj: number }) {
  return <h2>Rezervisano: {broj}</h2>
}

function StavkaTermina({ termin }: { termin: Termin }) {
  // Ovaj state zna samo stavka. Zaglavlje ne može da ga vidi.
  const [rezervisan, setRezervisan] = useState(false)
  return (
    <li className="row">
      <span>{termin.naziv}</span>
      <button onClick={() => setRezervisan(!rezervisan)}>
        {rezervisan ? "Otkaži" : "Rezerviši"}
      </button>
    </li>
  )
}

export default function App() {
  return (
    <div className="stack">
      <Zaglavlje broj={0} />
      <ul>
        {TERMINI.map((t) => (
          <StavkaTermina key={t.id} termin={t} />
        ))}
      </ul>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

interface Termin {
  id: string
  naziv: string
}

const TERMINI: Termin[] = [
  { id: "t1", naziv: "Pilates 09:00" },
  { id: "t2", naziv: "Reformer 18:00" },
  { id: "t3", naziv: "Mat 19:30" },
]

function Zaglavlje({ broj }: { broj: number }) {
  return <h2>Rezervisano: {broj}</h2>
}

function StavkaTermina({
  termin,
  rezervisan,
  onPrebaci,
}: {
  termin: Termin
  rezervisan: boolean
  onPrebaci: () => void
}) {
  return (
    <li className="row">
      <span>{termin.naziv}</span>
      <button onClick={onPrebaci}>{rezervisan ? "Otkaži" : "Rezerviši"}</button>
    </li>
  )
}

export default function App() {
  const [rezervisani, setRezervisani] = useState<string[]>([])

  const prebaci = (id: string) => {
    if (rezervisani.includes(id)) setRezervisani(rezervisani.filter((x) => x !== id))
    else setRezervisani([...rezervisani, id])
  }

  return (
    <div className="stack">
      <Zaglavlje broj={rezervisani.length} />
      <ul>
        {TERMINI.map((t) => (
          <StavkaTermina
            key={t.id}
            termin={t}
            rezervisan={rezervisani.includes(t.id)}
            onPrebaci={() => prebaci(t.id)}
          />
        ))}
      </ul>
    </div>
  )
}
`,
      tests: [
        {
          name: "na početku piše \"Rezervisano: 0\"",
          code: `await render(App)
expect(screen.getByRole("heading")).toHaveTextContent("Rezervisano: 0")
expect(screen.getAllByRole("button", { name: "Rezerviši" })).toHaveLength(3)`,
        },
        {
          name: "rezervacija povećava broj u zaglavlju",
          code: `await render(App)
await click(screen.getAllByRole("button", { name: "Rezerviši" })[0])
expect(screen.getByRole("heading")).toHaveTextContent("Rezervisano: 1")
expect(screen.getAllByRole("button", { name: "Otkaži" })).toHaveLength(1)`,
        },
        {
          name: "dve rezervacije pa jedno otkazivanje",
          code: `await render(App)
await click(screen.getAllByRole("button", { name: "Rezerviši" })[0])
await click(screen.getAllByRole("button", { name: "Rezerviši" })[0])
expect(screen.getByRole("heading")).toHaveTextContent("Rezervisano: 2")
await click(screen.getAllByRole("button", { name: "Otkaži" })[0])
expect(screen.getByRole("heading")).toHaveTextContent("Rezervisano: 1")
expect(screen.getAllByRole("button", { name: "Rezerviši" })).toHaveLength(2)`,
        },
      ],
      hints: [
        "U `App`: `const [rezervisani, setRezervisani] = useState<string[]>([])`. Zaglavlju prosledi `rezervisani.length`.",
        "Funkcija u `App`-u: ako niz već sadrži id, izbaci ga sa `filter`, a ako ne, dodaj ga sa `[...rezervisani, id]`. Ne koristi `push`, state se ne menja na licu mesta.",
        "Svakoj stavki prosledi `rezervisan={rezervisani.includes(t.id)}` i `onPrebaci={() => prebaci(t.id)}`, a u stavci obriši `useState` i dugmetu daj `onClick={onPrebaci}`.",
      ],
      explanation:
        "State je sada na jednom mestu, pa zaglavlje i stavke ne mogu da se raziđu. Stavka je postala \"glupa\": samo crta ono što dobije i javlja klik nagore. Tako su napravljeni `BookingCard`, `SegmentedControl` i `FilterChips`.",
    },
    {
      kind: "prose",
      md: `### \`useRef\`: kutija koja ne izaziva crtanje

\`useRef\` ti daje objekat \`{ current: … }\` koji **preživi svako crtanje**, ali kad mu promeniš \`current\`, React **ne crta ponovo**. Koristi se za dve stvari:

1. **Pristup DOM elementu.** Daš \`ref={poljeRef}\` nekom elementu, i \`poljeRef.current\` postane taj \`<input>\`, pa možeš da pozoveš \`.focus()\`.
2. **Vrednost koju pamtiš, a ne prikazuješ**: id tajmera, prethodna adresa, poslednja verzija neke funkcije.

Pravilo palca: ako vrednost utiče na to **šta se vidi**, ona je state. Ako je samo beleška za tvoj kod, ona je ref.`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/lib/sheetHistory.ts (linije 90–94)",
      code: `export const useSheetHistory = (open: boolean, onClose: () => void) => {
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })`,
      highlight: [2, 4],
      caption:
        "Svaki sheet (donji panel) se zatvara i dugmetom \"Nazad\". Ref uvek drži **najnoviju** `onClose` funkciju, a efekat koji sluša \"Nazad\" ne mora da se ponovo pokreće svaki put kad roditelj napravi novu funkciju. Efekat bez niza ovde samo osvežava belešku posle svakog crtanja.",
    },
    {
      kind: "playground",
      id: "react-hook-peskovnik",
      title: "Ref protiv state-a",
      prompt:
        "Klikni **Fokusiraj polje**: ref pokazuje na pravi `<input>`. Zatim klikni nekoliko puta **Tihi klik**: broj se menja u ref-u, ali ekran se ne osvežava. Tek **Prikaži broj** (setState) natera React da ponovo nacrta i pokaže koliko je tihih klikova bilo.",
      lang: "tsx",
      code: `import { useRef, useState } from "react"

export default function App() {
  const poljeRef = useRef<HTMLInputElement>(null)
  const tihiKlikovi = useRef(0)
  const [prikazano, setPrikazano] = useState(0)

  return (
    <div className="stack">
      <input ref={poljeRef} placeholder="Ime člana" />
      <div className="row">
        <button onClick={() => poljeRef.current?.focus()}>Fokusiraj polje</button>
        <button className="secondary" onClick={() => (tihiKlikovi.current += 1)}>
          Tihi klik
        </button>
        <button className="secondary" onClick={() => setPrikazano(tihiKlikovi.current)}>
          Prikaži broj
        </button>
      </div>
      <p>Tihih klikova (poslednji put prikazano): {prikazano}</p>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### \`useMemo\`, ukratko

Izvedene vrednosti računaš pri svakom crtanju i to je skoro uvek sasvim dovoljno brzo. Ali ako je račun **skup** (sortiranje stotina članova), a crtanja ima mnogo (svako slovo u pretrazi), možeš da zapamtiš rezultat:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/admin/MembersScreen.tsx (linije 40–41)",
      code: `  // Redoslijed se računa jednom po učitanim podacima, ne pri svakom slovu pretrage.
  const sorted = useMemo(() => [...members].sort(byName), [members])`,
      caption:
        "`useMemo(fn, [zavisnosti])` pozove `fn` i zapamti rezultat. Ponovo računa tek kad se `members` promeni. Primeti i `[...members]`: kopija pre `sort`-a, da se ne dira niz iz store-a.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Ne memoizuj sve redom",
      md: "`useMemo` nije besplatan: i on troši memoriju i poredi zavisnosti. Koristi ga kad je račun stvarno težak ili kad ti treba isti objekat između crtanja (npr. kao zavisnost efekta). Looply ga koristi za filtriranje i sortiranje pretplata (`filterAndSortSubscriptions`), a za sitne račune, kao `upcoming.length`, ne treba.",
    },
    {
      kind: "prose",
      md: `### Tvoji sopstveni hook-ovi

Kad isti par \`useState\` + \`useEffect\` počneš da kopiraš iz komponente u komponentu, vreme je za **custom hook**. To je obična funkcija:

- ime joj počinje sa **\`use\`** (tako React i editor znaju da u njoj važe pravila hook-ova),
- unutra poziva druge hook-ove,
- vraća šta god treba: vrednost, niz \`[vrednost, funkcija]\`, objekat.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/lib/useNow.ts",
      lang: "ts",
      startLine: 1,
      intro:
        "Ceo fajl. Ekrani kao BookingsScreen samo napišu `const now = useNow()` i dobiju vreme koje se samo osvežava, pa se dugme \"Otkaži\" ugasi tačno kad istekne rok za otkazivanje.",
      code: `import { useEffect, useState } from 'react'

/**
 * Trenutno vrijeme koje se periodično osvježava, da bi se stanja koja zavise
 * od sata (rok za otkazivanje, prošli termini) mijenjala dok je aplikacija otvorena.
 */
export const useNow = (intervalMs = 30_000) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    const onVisible = () => {
      if (document.visibilityState === 'visible') setNow(new Date())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs])

  return now
}
`,
      steps: [
        {
          lines: 7,
          md: "Obična arrow funkcija čije ime počinje sa `use`. Parametar ima podrazumevanu vrednost: bez argumenta, vreme se osvežava svakih 30 sekundi (`30_000` je samo čitljiviji zapis broja 30000).",
        },
        {
          lines: 8,
          md: "Hook unutar hook-a. State sa lenjom početnom vrednošću, isto kao u Looply-jevom `useToday`.",
        },
        {
          lines: [10, 15],
          md: "Efekat iz prošle lekcije: interval koji osvežava vreme i slušanje `visibilitychange`, da se vreme odmah ažurira kad se vratiš u aplikaciju posle duže pauze.",
        },
        {
          lines: [16, 20],
          md: "Cleanup gasi oba, a `[intervalMs]` znači da se sve postavi iznova ako neko promeni interval.",
        },
        {
          lines: 22,
          md: "Spolja se vidi samo ovo: jedan `Date`. Komponenta ne zna ništa o intervalima i događajima. Važno: svaka komponenta koja pozove `useNow()` dobija **svoj** state i **svoj** interval. Hook deli **logiku**, a ne podatke.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Pravila hook-ova",
      md: `1. **Hook-ove pozivaj samo na vrhu komponente**, nikad unutar \`if\`-a, petlje ili posle ranog \`return\`-a.
2. **Hook-ove pozivaj samo iz komponenti ili iz drugih hook-ova**, ne iz običnih funkcija.

Zašto? React ne zna imena tvojih state-ova. Pamti ih **po redosledu poziva**: prvi \`useState\`, drugi \`useState\`, prvi \`useEffect\`… Ako se neki poziv nekad preskoči, sve posle njega dobije tuđe vrednosti. Zato u BookingsScreen-u svi hook-ovi stoje gore, a \`if (!studio) return null\` dolazi tek posle njih.`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `function Profil({ korisnik }: Props) {
  if (!korisnik) return null          // ❌ rani return PRE hook-a
  const [ime, setIme] = useState("")  //    ovaj hook se nekad preskoči

  if (korisnik.admin) {
    useEffect(() => { … })            // ❌ hook unutar if-a
  }
}`,
      highlight: [2, 6],
      caption: "Oba slučaja menjaju broj hook-ova između crtanja. Popravka: sve hook-ove podigni na vrh, a uslov stavi unutar efekta.",
    },
    {
      kind: "exercise",
      id: "react-hook-2",
      title: "useToggle",
      lang: "tsx",
      prompt: `Kartica članarine ima dva prekidača, i oba ponavljaju istu logiku: \`useState\` + funkcija koja okreće vrednost. Izvuci to u custom hook:

\`\`\`ts
function useToggle(pocetno = false): [boolean, () => void]
\`\`\`

Hook vraća trenutnu vrednost i funkciju koja je okreće (\`true\` ↔ \`false\`). Zatim prepiši \`App\` tako da koristi \`useToggle\` za oba prekidača. Ponašanje ekrana se ne menja.`,
      starter: `import { useState } from "react"

// Napiši useToggle ovde


export default function App() {
  const [detalji, setDetalji] = useState(false)
  const prebaciDetalje = () => setDetalji(!detalji)

  const [produzenje, setProduzenje] = useState(true)
  const prebaciProduzenje = () => setProduzenje(!produzenje)

  return (
    <div className="card stack">
      <h3>Članarina: 8 termina mesečno</h3>
      <button className="secondary" onClick={prebaciDetalje}>
        {detalji ? "Sakrij detalje" : "Prikaži detalje"}
      </button>
      {detalji && <p className="muted">Važi do kraja meseca. Neiskorišćeni termini se ne prenose.</p>}
      <button onClick={prebaciProduzenje}>
        Automatsko produženje: {produzenje ? "uključeno" : "isključeno"}
      </button>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

function useToggle(pocetno = false): [boolean, () => void] {
  const [ukljuceno, setUkljuceno] = useState(pocetno)
  const prebaci = () => setUkljuceno((v) => !v)
  return [ukljuceno, prebaci]
}

export default function App() {
  const [detalji, prebaciDetalje] = useToggle()
  const [produzenje, prebaciProduzenje] = useToggle(true)

  return (
    <div className="card stack">
      <h3>Članarina: 8 termina mesečno</h3>
      <button className="secondary" onClick={prebaciDetalje}>
        {detalji ? "Sakrij detalje" : "Prikaži detalje"}
      </button>
      {detalji && <p className="muted">Važi do kraja meseca. Neiskorišćeni termini se ne prenose.</p>}
      <button onClick={prebaciProduzenje}>
        Automatsko produženje: {produzenje ? "uključeno" : "isključeno"}
      </button>
    </div>
  )
}
`,
      tests: [
        { name: "postoji funkcija useToggle", code: `expect(typeof useToggle).toBe("function")` },
        {
          name: "useToggle(true) počinje od true i okreće se na klik",
          code: `const h = __require("react").createElement
function Proba() {
  const [ukljuceno, prebaci] = useToggle(true)
  return h("button", { onClick: prebaci }, ukljuceno ? "da" : "ne")
}
await render(Proba)
const dugme = screen.getByRole("button")
expect(dugme.textContent).toBe("da")
await click(dugme)
expect(dugme.textContent).toBe("ne")
await click(dugme)
expect(dugme.textContent).toBe("da")`,
        },
        {
          name: "useToggle() bez argumenta počinje od false",
          code: `const h = __require("react").createElement
function Proba() {
  const [ukljuceno] = useToggle()
  return h("p", null, String(ukljuceno))
}
await render(Proba)
expect(screen.getByText("false")).toBeInTheDocument()`,
        },
        {
          name: "kartica članarine i dalje radi",
          code: `await render(App)
expect(screen.queryAllByText(/Važi do kraja meseca/)).toHaveLength(0)
await click(screen.getByRole("button", { name: "Prikaži detalje" }))
expect(screen.getByText(/Važi do kraja meseca/)).toBeInTheDocument()
await click(screen.getByRole("button", { name: "Automatsko produženje: uključeno" }))
expect(screen.getByRole("button", { name: "Automatsko produženje: isključeno" })).toBeInTheDocument()`,
        },
      ],
      hints: [
        "Unutar hook-a je obična logika: `const [ukljuceno, setUkljuceno] = useState(pocetno)`.",
        "Funkcija za okretanje: `const prebaci = () => setUkljuceno((v) => !v)`. Oblik sa funkcijom uvek radi sa najnovijom vrednošću. Vrati `[ukljuceno, prebaci]`.",
        "U `App`-u zameni oba para sa `const [detalji, prebaciDetalje] = useToggle()` i `const [produzenje, prebaciProduzenje] = useToggle(true)`.",
      ],
      explanation:
        "Custom hook je samo funkcija sa `use` imenom koja poziva druge hook-ove. Dva poziva `useToggle` daju dva **nezavisna** state-a, jer hook deli logiku, a ne podatke. Povratni tip `[boolean, () => void]` je tuple, isti oblik kao kod `useState`.",
    },
    {
      kind: "prose",
      md: `### A šta ako state treba celoj aplikaciji?

Podizanje state-a radi dok su komponente blizu. Ali korisnik, studio, rezervacije i poruke trebaju desetinama komponenti na različitim ekranima. Kad bi se sve podiglo u \`App\`, morali bi da putuju kroz pet nivoa props-a.

Zato ReformStudio i Looply koriste **Zustand**: biblioteku koja pravi **hook čiji state je zajednički** za sve komponente koje ga pozovu. Ovo je najmanji store u ReformStudiju:`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/store/toastStore.ts",
      lang: "ts",
      startLine: 1,
      intro:
        "Ceo fajl. Ovo je store iz koga čita `Toaster` iz prošle lekcije. Detaljno o Zustand-u u modulu Stil i stanje, ovde samo vidimo da je to, na kraju krajeva, opet hook.",
      code: `import { create } from 'zustand'

export type ToastTone = 'success' | 'info' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface ToastState {
  toast: Toast | null
  show: (message: string, tone?: ToastTone) => void
  dismiss: () => void
}

let nextId = 1

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (message, tone = 'success') => set({ toast: { id: nextId++, message, tone } }),
  dismiss: () => set({ toast: null }),
}))

/** Prečica za pozive van React komponenti i u handlerima. */
export const toast = (message: string, tone?: ToastTone) =>
  useToastStore.getState().show(message, tone)
`,
      steps: [
        {
          lines: [11, 15],
          md: "Oblik store-a: jedan podatak (`toast`) i dve **akcije** koje ga menjaju. To je kao `useState`, samo što su vrednost i funkcije spakovane zajedno i dostupne svima.",
        },
        {
          lines: 19,
          md: "`create(...)` vraća **hook**, zato se zove `useToastStore`. Ime sa `use` nije slučajno: važe ista pravila hook-ova.",
        },
        {
          lines: [20, 22],
          md: "`set` je Zustand-ov setter: upiše nove vrednosti i obavesti sve komponente koje ih čitaju. Svaka nova poruka dobija nov `id` i nov objekat, pa efekat u `Toaster`-u (zavisnost `toast`) uvek krene iznova.",
        },
        {
          lines: [26, 27],
          md: "`getState()` čita store **van** Reacta. Zato BookingsScreen posle otkazivanja samo pozove `toast(t.bookings.cancelledToast)`, bez ikakvog prosleđivanja props-a.",
        },
      ],
    },
    {
      kind: "prose",
      md: `U komponenti se store čita sa **selektorom**: \`useToastStore((s) => s.toast)\`. Funkcija bira samo deo koji ti treba, i komponenta se ponovo crta **samo kad se taj deo promeni**. Zato BookingsScreen ima tri odvojena poziva, \`useMemberStore((s) => s.studio)\`, \`useMemberStore((s) => s.bookings)\` i \`useMemberStore((s) => s.cancel)\`, umesto jednog koji uzima ceo store.

A pošto su store hook-ovi obični hook-ovi, od njih se slažu tvoji. Looply tako pravi "pitanja" o stanju aplikacije:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "Looply · src/state/pro.ts (linije 7–15)",
      code: `export function useIsPro(): boolean {
  return useSettingsStore((s) => s.settings.proUnlocked);
}

export function useCanAddSubscription(): boolean {
  const isPro = useIsPro();
  const count = useSubscriptionStore((s) => s.subscriptions.length);
  return canAddSubscription(count, isPro);
}`,
      highlight: [6, 7, 8],
      caption:
        "Custom hook koji spaja dva store-a i jedno poslovno pravilo. Ekran samo pita `useCanAddSubscription()` i ne zna ni gde se čuva Pro status ni koliki je besplatni limit.",
    },
    {
      kind: "exercise",
      id: "react-hook-3",
      title: "Hook koji pamti",
      lang: "tsx",
      prompt: `Napravi hook \`useSacuvano(kljuc, pocetno)\` koji radi kao \`useState\`, ali **pamti vrednost** i kad komponenta nestane i ponovo se pojavi. U pravoj aplikaciji bi to bio \`localStorage\`, a ovde ga glumi \`Map\` pod imenom \`skladiste\` (ključ → JSON tekst).

1. Početna vrednost: ako \`skladiste\` ima nešto pod \`kljuc\`, vrati \`JSON.parse\` toga, a ako nema, \`pocetno\`. Koristi lenju početnu vrednost: \`useState(() => …)\`.
2. Funkcija koju hook vraća postavi state **i** upiše \`JSON.stringify(nova)\` u \`skladiste\`.

Hook je generički (\`<T>\`), pa radi i sa tekstom i sa brojevima.`,
      starter: `import { useState } from "react"

// Glumi localStorage: ključ → JSON tekst
const skladiste = new Map<string, string>()

function useSacuvano<T>(kljuc: string, pocetno: T): [T, (nova: T) => void] {
  // Sad samo glumi useState i ništa ne pamti. Popravi to.
  const [vrednost, setVrednost] = useState<T>(pocetno)
  return [vrednost, setVrednost]
}

export default function App() {
  const [napomena, setNapomena] = useSacuvano("napomena", "")
  return (
    <div className="stack">
      <label>
        Napomena za trenera
        <input value={napomena} onChange={(e) => setNapomena(e.target.value)} />
      </label>
      <p className="muted">Sačuvano: {napomena || "ništa"}</p>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

// Glumi localStorage: ključ → JSON tekst
const skladiste = new Map<string, string>()

function useSacuvano<T>(kljuc: string, pocetno: T): [T, (nova: T) => void] {
  const [vrednost, setVrednost] = useState<T>(() => {
    const sacuvano = skladiste.get(kljuc)
    return sacuvano !== undefined ? (JSON.parse(sacuvano) as T) : pocetno
  })

  const postavi = (nova: T) => {
    setVrednost(nova)
    skladiste.set(kljuc, JSON.stringify(nova))
  }

  return [vrednost, postavi]
}

export default function App() {
  const [napomena, setNapomena] = useSacuvano("napomena", "")
  return (
    <div className="stack">
      <label>
        Napomena za trenera
        <input value={napomena} onChange={(e) => setNapomena(e.target.value)} />
      </label>
      <p className="muted">Sačuvano: {napomena || "ništa"}</p>
    </div>
  )
}
`,
      tests: [
        {
          name: "kucanje menja polje",
          code: `skladiste.clear()
await render(App)
await type(screen.getByRole("textbox"), "Kasnim 5 min")
expect(screen.getByRole("textbox")).toHaveValue("Kasnim 5 min")
expect(screen.getByText("Sačuvano: Kasnim 5 min")).toBeInTheDocument()`,
        },
        {
          name: "vrednost se upisuje u skladište kao JSON",
          code: `skladiste.clear()
await render(App)
await type(screen.getByRole("textbox"), "Kasnim 5 min")
expect(skladiste.get("napomena")).toBe('"Kasnim 5 min"')`,
        },
        {
          name: "nova komponenta čita sačuvanu vrednost",
          code: `skladiste.clear()
await render(App)
await type(screen.getByRole("textbox"), "Dolazim ranije")
await render(App)
expect(screen.getByRole("textbox")).toHaveValue("Dolazim ranije")`,
        },
        {
          name: "radi i sa brojevima",
          code: `skladiste.clear()
skladiste.set("posete", "5")
const h = __require("react").createElement
function Brojac() {
  const [posete, setPosete] = useSacuvano("posete", 0)
  return h("button", { onClick: () => setPosete(posete + 1) }, "Posete: " + posete)
}
await render(Brojac)
expect(screen.getByRole("button")).toHaveTextContent("Posete: 5")
await click(screen.getByRole("button"))
expect(skladiste.get("posete")).toBe("6")`,
        },
      ],
      hints: [
        "Lenja početna vrednost: `useState<T>(() => { const sacuvano = skladiste.get(kljuc); … })`. `Map.get` vraća `undefined` kad ključa nema.",
        "Ako postoji: `return JSON.parse(sacuvano) as T`, a inače `return pocetno`.",
        "Umesto da vratiš `setVrednost` direktno, napravi `const postavi = (nova: T) => { setVrednost(nova); skladiste.set(kljuc, JSON.stringify(nova)) }` i vrati `[vrednost, postavi]`.",
      ],
      explanation:
        "Komponenta koja koristi `useSacuvano` ne zna ništa o skladištu: za nju je to običan `[vrednost, setVrednost]`. Kad se `skladiste` zameni pravim `localStorage`-om, nijedna komponenta ne mora da se menja. Zato ReformStudio i Looply čuvaju logiku u hook-ovima (`useNow`, `useToday`, `useIsPro`), a ekrani ostaju kratki.",
    },
    {
      kind: "quiz",
      id: "react-hook-quiz",
      questions: [
        {
          q: "Dve sestrinske komponente treba da prikazuju isti broj rezervacija. Gde treba da bude state?",
          options: [
            "U njihovom najbližem zajedničkom roditelju, koji ga prosleđuje kroz props",
            "U obe komponente, pa ih sinhronizovati efektom",
            "U jednoj od njih, a druga ga čita preko `useRef`",
            "U globalnoj promenljivoj van komponenti",
          ],
          answer: 0,
          why: "Podizanje state-a daje jedan izvor istine. Dva state-a koja se sinhronizuju efektom su uvek bar jedno crtanje u raskoraku.",
        },
        {
          q: "Šta se desi kad promeniš `ref.current`?",
          options: [
            "Vrednost se zapamti, ali React ne crta ponovo",
            "Komponenta se odmah ponovo nacrta",
            "Vrednost se izgubi pri sledećem crtanju",
            "React baci grešku",
          ],
          answer: 0,
          why: "Ref je kutija koja preživi crtanja, ali ne pokreće nova. Ako promena treba da se vidi na ekranu, koristi state.",
        },
        {
          q: "Zašto je ovo pogrešno?",
          code: `function Termin({ termin }: Props) {
  if (!termin) return null
  const [otvoren, setOtvoren] = useState(false)
  // ...
}`,
          codeLang: "tsx",
          options: [
            "Hook se poziva posle ranog `return`-a, pa se nekad preskoči i React pomeša redosled hook-ova",
            "`useState` ne sme da ima `false` kao početnu vrednost",
            "Komponenta ne sme da vrati `null`",
            "Nema greške",
          ],
          answer: 0,
          why: "React pamti hook-ove po redosledu poziva. Svi hook-ovi idu na vrh, pre bilo kog uslova, kao u BookingsScreen-u.",
        },
        {
          q: "Dve komponente pozovu `useToggle()`. Šta važi?",
          options: [
            "Svaka ima svoj, nezavisan state",
            "Dele isti state, jer je to isti hook",
            "Druga komponenta dobije grešku",
            "Samo prva radi",
          ],
          answer: 0,
          why: "Custom hook deli logiku, a ne podatke. Za zajednički state treba podizanje state-a ili store (npr. Zustand).",
        },
        {
          q: "Zašto BookingsScreen piše `useMemberStore((s) => s.bookings)` umesto da uzme ceo store?",
          options: [
            "Selektor bira samo deo store-a, pa se komponenta crta ponovo samo kad se taj deo promeni",
            "Zustand ne dozvoljava čitanje celog store-a",
            "Tako je kod kraći",
            "Da bi `bookings` bio `readonly`",
          ],
          answer: 0,
          why: "Bez selektora, svaka promena bilo čega u store-u (npr. obaveštenja) bi ponovo crtala ekran sa rezervacijama.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-hook-1",
      front: "Šta znači \"podići state\"?",
      back: "Premestiti state u najbližeg zajedničkog roditelja i deci proslediti vrednost i funkciju za promenu kroz props. Podaci idu nadole, događaji nagore.",
    },
    {
      id: "fc-react-hook-2",
      front: "`useRef` ili `useState`?",
      back: "Ako vrednost utiče na ono što se vidi, `useState`. Ako je samo beleška za kod (DOM element, id tajmera, poslednja funkcija), `useRef`: promena ne izaziva crtanje.",
    },
    {
      id: "fc-react-hook-3",
      front: "Šta je custom hook?",
      back: "Funkcija čije ime počinje sa `use` i koja poziva druge hook-ove. Deli logiku između komponenti, a svaka komponenta dobija svoj state.",
    },
    {
      id: "fc-react-hook-4",
      front: "Dva pravila hook-ova?",
      back: "1) Samo na vrhu komponente: ne u `if`-u, petlji ni posle ranog `return`-a. 2) Samo iz komponenti ili drugih hook-ova.",
    },
    {
      id: "fc-react-hook-5",
      front: "Šta je `useMemberStore((s) => s.studio)`?",
      back: "Zustand store hook sa selektorom: čita jedan deo zajedničkog state-a i ponovo crta komponentu samo kad se baš taj deo promeni.",
    },
  ],
};

export default lesson;
