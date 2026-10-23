import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "useeffect",
  title: "useEffect: povezivanje sa spoljnim svetom",
  summary:
    "Šta je sporedni efekat, kako `useEffect` i niz zavisnosti odlučuju kada se kod izvršava, zašto je čišćenje obavezno i kako se učitavaju podaci bez klasičnih bagova.",
  minutes: 22,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Do sada su tvoje komponente radile jednu stvar: od props-a i state-a **izračunaju JSX**. To je čisto crtanje: isti ulaz, isti izlaz, bez ikakvih posledica van komponente.

Ali prava aplikacija stalno priča sa svetom van Reacta. Toaster u ReformStudiju posle par sekundi sam skloni poruku, pa mu treba **tajmer**. \`useNow\` osvežava sat kad se vratiš u aplikaciju, pa sluša **događaj browsera**. Looply svake ponoći prebaci "danas" na sledeći dan. Na pokretanju se proverava ko je prijavljen, što je **poziv servera**.

Sve to su **sporedni efekti** (side effects): stvari koje se dešavaju *pored* crtanja i diraju nešto van komponente. Za njih postoji hook \`useEffect\`.`,
    },
    {
      kind: "prose",
      md: `### Osnovni oblik

\`useEffect\` prima funkciju i poziva je **posle** crtanja, kad je ekran već ažuriran:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Naslov.tsx",
      code: `import { useEffect, useState } from "react"

function Korpa() {
  const [broj, setBroj] = useState(0)

  useEffect(() => {
    document.title = "Rezervacije (" + broj + ")"
  }, [broj])

  return <button onClick={() => setBroj(broj + 1)}>Dodaj ({broj})</button>
}`,
      highlight: [6, 7, 8],
      caption:
        "React prvo nacrta dugme, pa onda pokrene efekat koji menja naslov taba. Drugi argument, `[broj]`, je **niz zavisnosti**.",
    },
    {
      kind: "prose",
      md: `Zašto \`document.title = …\` ne ide direktno u telo komponente? Zato što React sme da pozove tvoju funkciju kad god hoće, i više puta, pa telo komponente mora da ostane čisto računanje. Efekat je **dogovoreno mesto** za sve što dira spoljni svet, i React tačno zna kada da ga pokrene i kada da ga počisti.`,
    },
    {
      kind: "prose",
      md: `### Niz zavisnosti: kada se efekat pokreće

Drugi argument odlučuje **koliko često** se efekat izvršava. Tri varijante:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `useEffect(() => {
  // posle SVAKOG crtanja
})

useEffect(() => {
  // samo jednom, posle prvog crtanja (kad se komponenta pojavi)
}, [])

useEffect(() => {
  // posle prvog crtanja + svaki put kad se promeni studio ili datum
}, [studio, datum])`,
      highlight: [3, 7, 11],
      caption:
        "Bez niza: uvek. Prazan niz: jednom. Niz sa vrednostima: kad se bilo koja od njih promeni (React ih poredi sa prethodnim crtanjem).",
    },
    {
      kind: "prose",
      md: `Pravilo za popunjavanje niza je jednostavno: **svaka vrednost iz komponente (props, state, funkcija iz komponente) koju efekat koristi ide u niz.** Ne biraš ti kada efekat treba da se pokrene, nego zavisnosti to odrede same. Ovo je ceo hook \`useAppBadge\` iz ReformStudija, koji broj nepročitanih obaveštenja upisuje na ikonicu aplikacije:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/lib/useAppBadge.ts (linije 8–13)",
      code: `export const useAppBadge = (unread: number | null) => {
  useEffect(() => {
    if (unread === null) return
    void setBadge(navigator, unread)
  }, [unread])
}`,
      highlight: [3, 5],
      caption:
        "Efekat koristi `unread`, pa je `unread` u nizu. Stigne novo obaveštenje, broj se promeni, efekat se ponovo pokrene i bedž na ikonici se osveži. Dok obaveštenja nisu učitana (`null`), efekat odmah izlazi.",
    },
    {
      kind: "prose",
      md: `### Čišćenje (cleanup)

Ako efekat nešto **uključi** (tajmer, slušanje događaja, pretplatu), mora i da to **isključi**. Za to efekat vraća funkciju, i React je poziva:

- **pre sledećeg pokretanja** istog efekta (kad se zavisnost promeni), i
- kad komponenta **nestane sa ekrana** (unmount).`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `useEffect(() => {
  const id = setInterval(() => setSekunde((s) => s + 1), 1000)
  window.addEventListener("online", osvezi)

  return () => {
    clearInterval(id)
    window.removeEventListener("online", osvezi)
  }
}, [])`,
      highlight: [5, 6, 7, 8],
      caption: "Šta god uključiš u efektu, isključi u funkciji koju efekat vrati. Par za par.",
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao prijava na adresu",
      md: "Kad se useliš u stan, prijaviš se na struju i internet (efekat). Kad se iseliš, odjaviš se (cleanup). Ako zaboraviš odjavu, računi i dalje stižu na adresu u kojoj više niko ne živi. Isto se dešava sa tajmerom bez `clearInterval`: radi i kad komponente odavno nema.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/Toaster.tsx",
      lang: "tsx",
      startLine: 48,
      intro:
        "Toaster prikazuje kratke poruke tipa \"Termin je otkazan\" i sam ih skloni posle nekoliko sekundi. Ceo taj mehanizam je jedan mali efekat.",
      code: `export const Toaster = () => {
  const toast = useToastStore((s) => s.toast)
  const dismiss = useToastStore((s) => s.dismiss)
  // Sheet drži polja i dugmad pri dnu: poruka tada ide gore, iznad zatamnjenog dijela.
  const sheetOpen = useSheetOpen()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismiss, DURATION_MS[toast.tone])
    return () => clearTimeout(timer)
  }, [toast, dismiss])
`,
      steps: [
        {
          lines: [2, 3],
          md: "Trenutna poruka i funkcija koja je sklanja dolaze iz Zustand store-a. Kako `useToastStore(...)` radi, vidimo u sledećoj lekciji. Za sada: `toast` je ili objekat poruke ili `null`.",
        },
        {
          lines: 8,
          md: "Rani izlaz: kad nema poruke, nema ni tajmera. Efekat ništa ne uključuje, pa ništa ne vraća.",
        },
        {
          lines: 9,
          md: "Uključuje tajmer koji posle `DURATION_MS[toast.tone]` milisekundi pozove `dismiss`. Greške stoje duže od običnih poruka, zato trajanje zavisi od tona.",
        },
        {
          lines: 10,
          md: "Čišćenje. Zamisli da stigne nova poruka pre nego što stara istekne: React prvo pozove ovaj cleanup (stari tajmer se gasi), pa pokrene efekat ponovo sa novim tajmerom. Bez toga bi stari tajmer sklonio novu poruku prerano.",
        },
        {
          lines: 11,
          md: "Zavisnosti su `toast` i `dismiss`, jer efekat koristi obe. Svaka nova poruka je nov objekat, pa svaka dobija svoj pun tajmer.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "Zašto se u razvoju efekat pokrene dvaput?",
      md: "ReformStudio je u `main.tsx` obmotan u `<StrictMode>`. U razvoju StrictMode namerno uradi *pokreni efekat → počisti → pokreni ponovo*, da bi odmah otkrio efekte bez čišćenja. Ako ti nešto radi duplo samo na `npm run dev`, a u produkciji ne, skoro sigurno fali cleanup.",
    },
    {
      kind: "playground",
      id: "react-effect-peskovnik",
      title: "Gledaj efekat i čišćenje uživo",
      prompt:
        "Klikni **Sakrij sat** i **Prikaži sat**, pa promeni brzinu. U dnevniku vidiš tačno kada React pokreće efekat i kada ga čisti. Zatim obriši ceo `return () => { … }` iz efekta i promeni brzinu nekoliko puta: stari intervali nastavljaju da rade i sat počne da juri.",
      lang: "tsx",
      code: `import { useEffect, useState } from "react"

type Dnevnik = (izmena: (stari: string[]) => string[]) => void

function Sat({ brzina, setDnevnik }: { brzina: number; setDnevnik: Dnevnik }) {
  const [sekunde, setSekunde] = useState(0)

  useEffect(() => {
    const zapisi = (red: string) => setDnevnik((d) => [...d.slice(-5), red])
    zapisi("▶ efekat: pokrećem interval na " + brzina + " ms")
    const id = setInterval(() => setSekunde((s) => s + 1), brzina)

    return () => {
      zapisi("■ cleanup: gasim interval na " + brzina + " ms")
      clearInterval(id)
    }
  }, [brzina, setDnevnik])

  return <h2>Otkucaja: {sekunde}</h2>
}

export default function App() {
  const [prikazan, setPrikazan] = useState(true)
  const [brzina, setBrzina] = useState(1000)
  const [dnevnik, setDnevnik] = useState<string[]>([])

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => setPrikazan(!prikazan)}>
          {prikazan ? "Sakrij sat" : "Prikaži sat"}
        </button>
        <button className="secondary" onClick={() => setBrzina(brzina === 1000 ? 250 : 1000)}>
          Brzina: {brzina} ms
        </button>
      </div>
      {prikazan && <Sat brzina={brzina} setDnevnik={setDnevnik} />}
      <pre className="card">{dnevnik.join("\\n")}</pre>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `Primeti da je \`setDnevnik\` u nizu zavisnosti, a efekat se ipak ne pokreće stalno. Setter funkcije iz \`useState\` su **stabilne**: React ti pri svakom crtanju daje istu funkciju, pa se "promena" nikad ne desi.`,
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "src/hooks/useToday.ts",
      lang: "ts",
      startLine: 10,
      intro:
        "Looply računa koja plaćanja dospevaju \"danas\". Ali ako aplikaciju ostaviš otvorenu preko noći, \"danas\" mora samo da se prebaci na sledeći dan. Ovaj efekat radi baš to, i to sa dva izvora: tajmer do ponoći i povratak u aplikaciju.",
      code: `export function useToday(): ISODate {
  const [today, setToday] = useState<ISODate>(() => todayLocal());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => setToday(todayLocal());
    const scheduleMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
      timer = setTimeout(() => {
        refresh();
        scheduleMidnight();
      }, nextMidnight.getTime() - now.getTime());
    };
    scheduleMidnight();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  return today;
}
`,
      steps: [
        {
          lines: 2,
          md: "State sa **lenjom početnom vrednošću**: `useState(() => todayLocal())` računa datum samo pri prvom crtanju, a ne pri svakom.",
        },
        {
          lines: [4, 6],
          md: "Efekat sa praznim nizom, `[]` u liniji 23: pokreće se jednom, kad se komponenta pojavi. `timer` je `let` jer će se menjati svake noći.",
        },
        {
          lines: [7, 15],
          md: "Izračuna koliko je milisekundi do ponoći (plus 5 sekundi rezerve) i postavi tajmer. Kad tajmer okine, osveži datum i **zakaže sledeću ponoć**. Funkcija poziva samu sebe, pa lanac traje dok god je ekran otvoren.",
        },
        {
          lines: [16, 18],
          md: "`AppState` je React Native verzija `visibilitychange` događaja iz browsera: javlja kad se aplikacija vrati iz pozadine. Telefon je možda spavao preko ponoći, pa se datum tada osveži.",
        },
        {
          lines: [19, 22],
          md: "Čišćenje gasi **oba** izvora: poslednji tajmer i slušanje `AppState`-a. Par za par, isto kao `setTimeout`/`clearTimeout` u Toaster-u.",
        },
        {
          lines: 25,
          md: "Ovo je ceo trik custom hook-a: spolja vidiš samo `const today = useToday()`, a sva ova mašinerija je sakrivena unutra. O tome detaljno u sledećoj lekciji.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Učitavanje podataka

Najčešći efekat u praksi: komponenta se pojavi, treba joj podatak sa servera. Podatak ne stiže odmah, a može i da ne stigne. Zato se uz sam podatak čuvaju još dva stanja: **da li se učitava** i **da li je pukla greška**.`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Termini.tsx",
      code: `function Termini({ studio }: { studio: string }) {
  const [termini, setTermini] = useState<Termin[]>([])
  const [ucitava, setUcitava] = useState(true)
  const [greska, setGreska] = useState<string | null>(null)

  useEffect(() => {
    let ignorisi = false
    setUcitava(true)
    ucitajTermine(studio)
      .then((lista) => { if (!ignorisi) setTermini(lista) })
      .catch((e) => { if (!ignorisi) setGreska(String(e)) })
      .finally(() => { if (!ignorisi) setUcitava(false) })
    return () => { ignorisi = true }
  }, [studio])

  if (ucitava) return <p>Učitavanje…</p>
  if (greska) return <p className="error">{greska}</p>
  return <ul>{termini.map((t) => <li key={t.id}>{t.naziv}</li>)}</ul>
}`,
      highlight: [7, 10, 13, 14],
      caption:
        "Tri stanja, tri izgleda ekrana. Zastavica `ignorisi` štiti od zakasnelih odgovora, o tome odmah ispod.",
    },
    {
      kind: "prose",
      md: `Dve stvari koje nisu očigledne:

1. **Funkcija efekta ne sme biti \`async\`.** \`async\` funkcija uvek vraća Promise, a efekat sme da vrati samo cleanup funkciju (ili ništa). Zato se koristi \`.then()\`, ili se unutar efekta napravi \`async\` funkcija pa odmah pozove.
2. **Zastavica \`ignorisi\`.** Ako korisnik brzo promeni studio, stigne prvi odgovor za stari studio *posle* drugog. Bez zastavice bi stari podaci pregazili nove. Sa njom, cleanup starog efekta podigne zastavicu i njegov zakasneli odgovor se jednostavno baci.

ReformStudio za ovo ima store (\`useMemberStore\`), pa ekrani retko sami zovu server. Ali kad se aplikacija pokrene, \`App\` jednom pokrene proveru prijave:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/App.tsx (linije 116–118)",
      code: `  useEffect(() => {
    void init()
  }, [init])`,
      caption:
        "`init` je funkcija iz store-a i uvek je ista, pa se efekat pokrene samo jednom. `void` znači \"namerno ne čekam ovaj Promise\": store sam čuva stanje učitavanja i greške.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Tri klasična baga sa efektima",
      md: `- **Beskonačna petlja.** Efekat bez niza zavisnosti koji menja state: crtanje → efekat → setState → crtanje → efekat… Isto se desi kad je u nizu objekat ili niz koji se pravi iznova pri svakom crtanju.
- **Zaboravljena zavisnost.** Efekat koristi \`studio\`, a niz je \`[]\`. Prvi put radi, a kad korisnik promeni studio, i dalje vidi stare termine. Editor (ESLint pravilo \`react-hooks/exhaustive-deps\`) te upozori na ovo, slušaj ga.
- **Odgovor stiže prekasno.** Komponenta je nestala ili su se zavisnosti promenile, a stari \`fetch\` tek tada stigne i upiše svoj rezultat. Rešenje je cleanup sa zastavicom \`ignorisi\`.`,
    },
    {
      kind: "prose",
      md: `### Možda ti efekat uopšte ne treba

Najčešća greška nije pogrešan efekat, nego **efekat koji ne treba da postoji**. Ako se nešto može *izračunati* iz props-a i state-a, izračunaj ga direktno pri crtanju:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `// ❌ Dupli state + efekat koji ga sinhronizuje
const [predstojeci, setPredstojeci] = useState<Booking[]>([])
useEffect(() => {
  setPredstojeci(bookings.filter((b) => isUpcoming(b, now)))
}, [bookings, now])

// ✅ Samo izračunaj
const predstojeci = bookings.filter((b) => isUpcoming(b, now))`,
      highlight: [8],
      caption:
        "Prva verzija crta dvaput (prvo staru listu, pa novu) i ima dva izvora istine koji mogu da se raziđu. Druga je kraća, brža i uvek tačna. Ovako i BookingsScreen računa `upcoming` i `past`.",
    },
    {
      kind: "prose",
      md: `Još dva slučaja gde efekat **nije** odgovor:

- **Reakcija na klik.** "Kad korisnik klikne Rezerviši, pošalji zahtev" ide u \`onClick\` handler, ne u efekat koji prati neki state. Efekti su za sinhronizaciju sa spoljnim svetom, a ne za događaje.
- **Resetovanje state-a kad se promeni prop.** Umesto efekta koji briše formu kad se promeni \`clanId\`, daj komponenti \`key={clanId}\` i React će je sam napraviti iznova, kao \`key={tab}\` u BookingsScreen-u.

Dobro pitanje pre svakog \`useEffect\`-a: **"s kojim spoljnim sistemom ovde sinhronizujem?"** Ako je odgovor "ni sa kojim", verovatno ti ne treba.`,
    },
    {
      kind: "exercise",
      id: "react-effect-1",
      title: "Poruka koja sama nestaje",
      lang: "tsx",
      prompt: `Napravi mali Toaster. Komponenta \`Obavestenje\` prikazuje poruku i treba da je **sama sakrije** posle \`trajanje\` milisekundi.

- Dodaj \`useEffect\` koji pokrene \`setTimeout\` i posle \`trajanje\` ms postavi \`vidljivo\` na \`false\`.
- Vrati cleanup koji gasi tajmer (\`clearTimeout\`).
- Popuni niz zavisnosti.

Dugme **Prikaži ponovo** u \`App\`-u menja \`key\`, pa se \`Obavestenje\` napravi iznova. Probaj ga kad poruka nestane.`,
      starter: `import { useEffect, useState } from "react"

export function Obavestenje({ poruka, trajanje }: { poruka: string; trajanje: number }) {
  const [vidljivo, setVidljivo] = useState(true)

  // Ovde dodaj useEffect sa tajmerom i čišćenjem

  if (!vidljivo) return null
  return (
    <div className="card" role="status">
      {poruka}
    </div>
  )
}

export default function App() {
  const [broj, setBroj] = useState(0)
  return (
    <div className="stack">
      <button onClick={() => setBroj(broj + 1)}>Prikaži ponovo</button>
      <Obavestenje key={broj} poruka="Termin je rezervisan." trajanje={2000} />
    </div>
  )
}
`,
      solution: `import { useEffect, useState } from "react"

export function Obavestenje({ poruka, trajanje }: { poruka: string; trajanje: number }) {
  const [vidljivo, setVidljivo] = useState(true)

  useEffect(() => {
    const tajmer = setTimeout(() => setVidljivo(false), trajanje)
    return () => clearTimeout(tajmer)
  }, [trajanje])

  if (!vidljivo) return null
  return (
    <div className="card" role="status">
      {poruka}
    </div>
  )
}

export default function App() {
  const [broj, setBroj] = useState(0)
  return (
    <div className="stack">
      <button onClick={() => setBroj(broj + 1)}>Prikaži ponovo</button>
      <Obavestenje key={broj} poruka="Termin je rezervisan." trajanje={2000} />
    </div>
  )
}
`,
      tests: [
        {
          name: "poruka se prikaže odmah",
          code: `await render(Obavestenje, { poruka: "Sačuvano.", trajanje: 30 })
expect(screen.getByRole("status")).toHaveTextContent("Sačuvano.")`,
        },
        {
          name: "poruka nestane posle isteka vremena",
          code: `await render(Obavestenje, { poruka: "Sačuvano.", trajanje: 30 })
await sleep(80)
expect(screen.queryAllByRole("status")).toHaveLength(0)`,
        },
        {
          name: "pre isteka vremena poruka je i dalje tu",
          code: `await render(Obavestenje, { poruka: "Sačuvano.", trajanje: 300 })
await sleep(30)
expect(screen.getByRole("status")).toBeInTheDocument()`,
        },
        {
          name: "\"Prikaži ponovo\" vraća poruku",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Prikaži ponovo" }))
expect(screen.getByRole("status")).toHaveTextContent("Termin je rezervisan.")`,
        },
      ],
      hints: [
        "Kostur: `useEffect(() => { … }, [trajanje])`, iznad `if (!vidljivo) return null`. Hook-ovi moraju da stoje pre bilo kog ranog `return`-a.",
        "Unutar efekta: `const tajmer = setTimeout(() => setVidljivo(false), trajanje)`.",
        "Na kraju efekta vrati čišćenje: `return () => clearTimeout(tajmer)`. Tako i Toaster u ReformStudiju gasi stari tajmer kad stigne nova poruka.",
      ],
      explanation:
        "Isti obrazac kao u `Toaster.tsx`: efekat uključi tajmer, cleanup ga isključi, a niz zavisnosti kaže kada se sve ponavlja. Bez cleanup-a bi tajmer okinuo i posle nestanka komponente, i to je tačno ona vrsta bagova koju StrictMode traži.",
    },
    {
      kind: "exercise",
      id: "react-effect-2",
      title: "Učitavanje, greška, podaci",
      lang: "tsx",
      prompt: `Funkcija \`ucitajTermine\` glumi server: posle 30 ms vrati tri termina, a za studio \`"nepoznat"\` odbije sa greškom **Studio ne postoji**.

Komponenta \`Termini\` već ima tri state-a, ali niko ne poziva server, pa zauvek piše "Učitavanje…". Dodaj \`useEffect\` koji:

1. pozove \`ucitajTermine(studio)\`,
2. kad stignu podaci, upiše ih u \`termini\`,
3. kad pukne, upiše poruku greške u \`greska\` (ekran tada prikazuje **Greška: Studio ne postoji**),
4. u oba slučaja na kraju postavi \`ucitava\` na \`false\`.

Niz zavisnosti ne zaboravi.`,
      starter: `import { useEffect, useState } from "react"

interface Termin {
  id: string
  naziv: string
}

// Lažni server: odgovara posle 30 ms
function ucitajTermine(studio: string): Promise<Termin[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (studio === "nepoznat") reject(new Error("Studio ne postoji"))
      else
        resolve([
          { id: "a", naziv: "Pilates 09:00" },
          { id: "b", naziv: "Reformer 18:00" },
          { id: "c", naziv: "Mat 19:30" },
        ])
    }, 30)
  })
}

export function Termini({ studio }: { studio: string }) {
  const [termini, setTermini] = useState<Termin[]>([])
  const [ucitava, setUcitava] = useState(true)
  const [greska, setGreska] = useState<string | null>(null)

  // Ovde dodaj useEffect koji učitava termine

  if (ucitava) return <p>Učitavanje…</p>
  if (greska) return <p className="error" role="alert">Greška: {greska}</p>
  return (
    <ul>
      {termini.map((t) => (
        <li key={t.id}>{t.naziv}</li>
      ))}
    </ul>
  )
}

export default function App() {
  return <Termini studio="centar" />
}
`,
      solution: `import { useEffect, useState } from "react"

interface Termin {
  id: string
  naziv: string
}

// Lažni server: odgovara posle 30 ms
function ucitajTermine(studio: string): Promise<Termin[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (studio === "nepoznat") reject(new Error("Studio ne postoji"))
      else
        resolve([
          { id: "a", naziv: "Pilates 09:00" },
          { id: "b", naziv: "Reformer 18:00" },
          { id: "c", naziv: "Mat 19:30" },
        ])
    }, 30)
  })
}

export function Termini({ studio }: { studio: string }) {
  const [termini, setTermini] = useState<Termin[]>([])
  const [ucitava, setUcitava] = useState(true)
  const [greska, setGreska] = useState<string | null>(null)

  useEffect(() => {
    ucitajTermine(studio)
      .then((lista) => setTermini(lista))
      .catch((e) => setGreska(e instanceof Error ? e.message : String(e)))
      .finally(() => setUcitava(false))
  }, [studio])

  if (ucitava) return <p>Učitavanje…</p>
  if (greska) return <p className="error" role="alert">Greška: {greska}</p>
  return (
    <ul>
      {termini.map((t) => (
        <li key={t.id}>{t.naziv}</li>
      ))}
    </ul>
  )
}

export default function App() {
  return <Termini studio="centar" />
}
`,
      tests: [
        {
          name: "na početku piše \"Učitavanje…\"",
          code: `await render(Termini, { studio: "centar" })
expect(screen.getByText("Učitavanje…")).toBeInTheDocument()`,
        },
        {
          name: "posle učitavanja prikazuje tri termina",
          code: `await render(Termini, { studio: "centar" })
await sleep(80)
expect(screen.queryAllByText("Učitavanje…")).toHaveLength(0)
expect(screen.getAllByRole("listitem")).toHaveLength(3)
expect(screen.getByText("Reformer 18:00")).toBeInTheDocument()`,
        },
        {
          name: "greška sa servera se prikazuje",
          code: `await render(Termini, { studio: "nepoznat" })
await sleep(80)
expect(screen.getByRole("alert")).toHaveTextContent("Greška: Studio ne postoji")
expect(screen.queryAllByText("Učitavanje…")).toHaveLength(0)`,
        },
      ],
      hints: [
        "Kostur: `useEffect(() => { ucitajTermine(studio).then(…).catch(…).finally(…) }, [studio])`.",
        "U `.then` upiši listu: `.then((lista) => setTermini(lista))`. U `.catch` stiže bilo šta što je bačeno, pa proveri da li je to `Error`: `.catch((e) => setGreska(e instanceof Error ? e.message : String(e)))`.",
        "`.finally(() => setUcitava(false))` se izvrši i posle uspeha i posle greške. Niz zavisnosti je `[studio]`, jer efekat koristi `studio`.",
      ],
      explanation:
        "Tri state-a (podaci, učitavanje, greška) su standardni par za svaki poziv servera. Efekat ne sme biti `async`, pa se koristi lanac `.then/.catch/.finally`. U sledećoj vežbi rešavamo i šta se desi kad se `studio` promeni dok zahtev još traje.",
    },
    {
      kind: "exercise",
      id: "react-effect-3",
      title: "Promena studija bez trke",
      lang: "tsx",
      prompt: `Sada se studio bira iz padajuće liste. Lažni server za **Centar** odgovara sporo (40 ms), a za **Novi Beograd** brzo (10 ms). Efekat u starteru ima dva baga:

1. **Zaboravljena zavisnost**: posle promene studija ništa se ne učitava ponovo.
2. **Trka**: kad popraviš prvi bag, probaj da odmah prebaciš na Novi Beograd. Brzi odgovor stigne prvi, pa ga spori odgovor za Centar pregazi, i na ekranu ostanu pogrešni termini.

Popravi oba: dodaj prave zavisnosti i zastavicu \`ignorisi\` koju cleanup podiže.`,
      starter: `import { useEffect, useState } from "react"

const TERMINI: Record<string, string[]> = {
  "Centar": ["Centar · Pilates 09:00", "Centar · Reformer 18:00"],
  "Novi Beograd": ["Novi Beograd · Mat 08:00", "Novi Beograd · Reformer 17:00", "Novi Beograd · Yoga 20:00"],
}
const KASNJENJE: Record<string, number> = { "Centar": 40, "Novi Beograd": 10 }

// Lažni server: neki studiji odgovaraju sporije od drugih
function ucitajTermine(studio: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TERMINI[studio] ?? []), KASNJENJE[studio] ?? 20)
  })
}

export default function App() {
  const [studio, setStudio] = useState("Centar")
  const [termini, setTermini] = useState<string[]>([])

  useEffect(() => {
    ucitajTermine(studio).then((lista) => setTermini(lista))
  }, [])

  return (
    <div className="stack">
      <label>
        Studio
        <select value={studio} onChange={(e) => setStudio(e.target.value)}>
          <option>Centar</option>
          <option>Novi Beograd</option>
        </select>
      </label>
      <ul>
        {termini.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
`,
      solution: `import { useEffect, useState } from "react"

const TERMINI: Record<string, string[]> = {
  "Centar": ["Centar · Pilates 09:00", "Centar · Reformer 18:00"],
  "Novi Beograd": ["Novi Beograd · Mat 08:00", "Novi Beograd · Reformer 17:00", "Novi Beograd · Yoga 20:00"],
}
const KASNJENJE: Record<string, number> = { "Centar": 40, "Novi Beograd": 10 }

// Lažni server: neki studiji odgovaraju sporije od drugih
function ucitajTermine(studio: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TERMINI[studio] ?? []), KASNJENJE[studio] ?? 20)
  })
}

export default function App() {
  const [studio, setStudio] = useState("Centar")
  const [termini, setTermini] = useState<string[]>([])

  useEffect(() => {
    let ignorisi = false
    ucitajTermine(studio).then((lista) => {
      if (!ignorisi) setTermini(lista)
    })
    return () => {
      ignorisi = true
    }
  }, [studio])

  return (
    <div className="stack">
      <label>
        Studio
        <select value={studio} onChange={(e) => setStudio(e.target.value)}>
          <option>Centar</option>
          <option>Novi Beograd</option>
        </select>
      </label>
      <ul>
        {termini.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
`,
      tests: [
        {
          name: "na početku učita termine Centra",
          code: `await render(App)
await sleep(80)
expect(screen.getAllByRole("listitem")).toHaveLength(2)
expect(screen.getByText("Centar · Pilates 09:00")).toBeInTheDocument()`,
        },
        {
          name: "promena studija učitava nove termine",
          code: `await render(App)
await sleep(80)
await select(screen.getByRole("combobox"), "Novi Beograd")
await sleep(50)
expect(screen.getAllByRole("listitem")).toHaveLength(3)
expect(screen.getByText("Novi Beograd · Yoga 20:00")).toBeInTheDocument()`,
        },
        {
          name: "brza promena: zakasneli odgovor za Centar ne pregazi Novi Beograd",
          code: `await render(App)
await select(screen.getByRole("combobox"), "Novi Beograd")
await sleep(100)
expect(screen.queryAllByText("Centar · Pilates 09:00")).toHaveLength(0)
expect(screen.getAllByRole("listitem")).toHaveLength(3)`,
        },
      ],
      hints: [
        "Prvi bag: efekat koristi `studio`, a niz je `[]`. Šta mora da piše u nizu?",
        "Drugi bag: na početku efekta napravi `let ignorisi = false`, a u `.then` upiši listu samo `if (!ignorisi)`.",
        "Efekat na kraju vraća cleanup: `return () => { ignorisi = true }`. Kad se studio promeni, React pozove cleanup starog efekta, pa njegov zakasneli odgovor bude ignorisan.",
      ],
      explanation:
        "Svaki put kad se `studio` promeni, React počisti stari efekat (zastavica tog starog efekta postaje `true`) i pokrene novi sa svojom, čistom zastavicom. Svaki efekat ima **svoju** promenljivu `ignorisi`, zahvaljujući closure-u. Isti obrazac se koristi za svaki `fetch` koji zavisi od nečega što korisnik može da promeni.",
    },
    {
      kind: "quiz",
      id: "react-effect-quiz",
      questions: [
        {
          q: "Kada se pokreće efekat sa praznim nizom zavisnosti, `useEffect(fn, [])`?",
          options: [
            "Jednom, posle prvog crtanja komponente",
            "Pre svakog crtanja",
            "Posle svakog crtanja",
            "Nikad, dok ga ne pozoveš ručno",
          ],
          answer: 0,
          why: "Prazan niz znači \"nema zavisnosti koje se mogu promeniti\", pa se efekat pokrene samo kad se komponenta pojavi. Njegov cleanup se pokrene kad nestane.",
        },
        {
          q: "Šta je problem sa ovim kodom?",
          code: `useEffect(() => {
  setBroj(broj + 1)
})`,
          codeLang: "tsx",
          options: [
            "Beskonačna petlja: svako crtanje pokrene efekat, a efekat izazove novo crtanje",
            "Nedostaje cleanup",
            "`setBroj` ne sme da se zove u efektu",
            "Nema problema",
          ],
          answer: 0,
          why: "Bez niza zavisnosti efekat se pokreće posle svakog crtanja, a `setBroj` traži novo crtanje. Krug se nikad ne završava.",
        },
        {
          q: "Kada React poziva funkciju koju efekat vrati (cleanup)?",
          options: [
            "Pre sledećeg pokretanja tog efekta i kad komponenta nestane",
            "Samo kad se aplikacija zatvori",
            "Odmah posle efekta",
            "Nikad, služi samo za dokumentaciju",
          ],
          answer: 0,
          why: "Tako Toaster gasi stari tajmer kad stigne nova poruka, i tako `useToday` gasi tajmer i slušanje kad ekran nestane.",
        },
        {
          q: "Komponenta ima state `ime` i `prezime`. Kako je najbolje dobiti `punoIme`?",
          options: [
            "`const punoIme = ime + \" \" + prezime` direktno u telu komponente",
            "Poseban state `punoIme` i efekat koji ga ažurira",
            "`useEffect` koji menja `document.title`",
            "Ref koji se ažurira u efektu",
          ],
          answer: 0,
          why: "Sve što se može izračunati iz props-a i state-a, računaj pri crtanju. Efekat bi samo dodao jedno nepotrebno crtanje i drugi izvor istine.",
        },
        {
          q: "Zašto se piše `useEffect(() => { ucitaj().then(…) }, [x])`, a ne `useEffect(async () => { await ucitaj() }, [x])`?",
          options: [
            "`async` funkcija vraća Promise, a efekat sme da vrati samo cleanup funkciju ili ništa",
            "`await` ne radi u Reactu",
            "`async` funkcije su sporije",
            "Nema razlike, oba su ispravna",
          ],
          answer: 0,
          why: "React očekuje da efekat vrati funkciju za čišćenje. Promise nije funkcija. Ako baš želiš `await`, napravi `async` funkciju unutar efekta i odmah je pozovi.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-effect-1",
      front: "Šta je sporedni efekat (side effect)?",
      back: "Sve što komponenta radi van samog crtanja JSX-a: tajmeri, slušanje događaja, pozivi servera, menjanje `document.title`, bedž na ikonici.",
    },
    {
      id: "fc-react-effect-2",
      front: "Tri oblika niza zavisnosti?",
      back: "Bez niza: posle svakog crtanja. `[]`: jednom, kad se komponenta pojavi. `[a, b]`: na početku i kad god se `a` ili `b` promeni.",
    },
    {
      id: "fc-react-effect-3",
      front: "Čemu služi funkcija koju efekat vrati?",
      back: "To je cleanup: gasi ono što je efekat uključio (`clearTimeout`, `removeEventListener`, odjava). React je poziva pre sledećeg pokretanja i pri nestanku komponente.",
    },
    {
      id: "fc-react-effect-4",
      front: "Kako sprečiti da zakasneli odgovor servera pregazi novije podatke?",
      back: "`let ignorisi = false` u efektu, `if (!ignorisi) setX(…)` u `.then`, a cleanup vraća `() => { ignorisi = true }`.",
    },
    {
      id: "fc-react-effect-5",
      front: "Kad ti `useEffect` NE treba?",
      back: "Kad se vrednost može izračunati iz props-a i state-a (računaj pri crtanju) i kad reaguješ na klik (to ide u handler).",
    },
  ],
};

export default lesson;
