import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "state",
  title: "State i useState",
  summary:
    "Zašto obična promenljiva ne menja ekran, kako `useState` pamti vrednosti između crtanja i kako se bezbedno menjaju brojevi, objekti i nizovi, kao u `PasswordField`-u i Looply onboardingu.",
  minutes: 20,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Props stižu spolja i komponenta ih ne menja. Ali ekran mora i sam da reaguje: klikneš oko pored lozinke i ona se pokaže, izabereš Netflix u Looply-ju i on postane označen, klikneš **Rezerviši** i broj zauzetih mesta poraste.

Za podatke koje komponenta **sama pamti i menja** React ima **state** (stanje). Ova lekcija objašnjava zašto ti treba i kako se koristi.`,
    },
    {
      kind: "prose",
      md: `### Zašto obična promenljiva ne radi

Prvi pokušaj koji svako napravi:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Brojac.tsx",
      code: `function Brojac() {
  let zauzeto = 0

  return (
    <button onClick={() => {
      zauzeto = zauzeto + 1
      console.log(zauzeto) // 1, 2, 3… u konzoli
    }}>
      Zauzeto: {zauzeto}   {/* na ekranu zauvek 0 */}
    </button>
  )
}`,
      highlight: [2, 6, 9],
      caption: "Konzola broji, a ekran stoji na nuli. Dva razloga, oba važna.",
    },
    {
      kind: "prose",
      md: `1. **React ne zna da se nešto promenilo.** Promena obične promenljive ne govori Reactu da ponovo nacrta komponentu. Ekran je slika napravljena pri poslednjem crtanju i ostaje takva.
2. **Čak i kad bi ponovo nacrtao, krenulo bi od nule.** Komponenta je funkcija. Svako crtanje je **novi poziv** te funkcije, pa se \`let zauzeto = 0\` izvrši ponovo i sve lokalne promenljive počnu ispočetka.

Treba nam, dakle, vrednost koja **preživi između poziva** i promena koja **javi Reactu da ponovo crta**. To je tačno ono što daje \`useState\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao trener sa beležnicom",
      md: "Komponenta je trener koji svaki put dolazi \"ispočetka\" i ne pamti ništa napamet. State je **beležnica koju čuva React**. Na početku svakog crtanja React mu doda beležnicu (\"zauzeto: 3\"), a kad trener upiše novu vrednost (setter), React zakaže novi trening, tj. novo crtanje sa novim brojem.",
    },
    {
      kind: "prose",
      md: `### \`useState\`

\`useState\` je **hook**: posebna React funkcija koja počinje sa \`use\` i poziva se na vrhu komponente. Uvozi se iz Reacta:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Brojac.tsx",
      code: `import { useState } from "react"

function Brojac() {
  const [zauzeto, setZauzeto] = useState(0)

  return (
    <button onClick={() => setZauzeto(zauzeto + 1)}>
      Zauzeto: {zauzeto}
    </button>
  )
}`,
      highlight: [4, 7],
      caption:
        "`useState(0)` vraća niz od dva elementa: **trenutnu vrednost** i **setter**, funkciju koja je menja. Raspakujemo ih destrukturiranjem niza.",
    },
    {
      kind: "prose",
      md: `Šta se tačno dešava:

- \`0\` je **početna vrednost**. Koristi se samo pri prvom crtanju. Posle toga React pamti poslednju vrednost.
- Imena su po tvom izboru, a dogovor je \`[nešto, setNešto]\`: \`[visible, setVisible]\`, \`[saving, setSaving]\`, \`[picked, setPicked]\`.
- \`const\` je ispravno: unutar jednog crtanja \`zauzeto\` se zaista ne menja. Novu vrednost dobijaš tek u **sledećem** pozivu komponente.
- TypeScript tip zaključi iz početne vrednosti (\`0\` → \`number\`). Kad početna vrednost ne govori dovoljno, prosledi tip kao generik: \`useState<string[]>([])\`, \`useState<number | null>(null)\`.

### Ciklus jednog klika

1. Korisnik klikne → pozove se \`setZauzeto(1)\`.
2. React zapamti \`1\` i **zakaže novo crtanje**.
3. React ponovo pozove \`Brojac()\`. Ovog puta \`useState\` vrati \`1\`.
4. Funkcija vrati novi JSX sa \`Zauzeto: 1\`, a React u browseru promeni **samo taj tekst**.`,
    },
    {
      kind: "playground",
      id: "react-state-peskovnik",
      title: "Promenljiva protiv state-a",
      prompt:
        "Klikni oba dugmeta po nekoliko puta. Gornje broji samo u konzoli, donje i na ekranu. Onda klikni donje, pa gornje: gornje se \"vrati\" na 0, jer svako novo crtanje ponovo izvrši `let klikova = 0`.",
      lang: "tsx",
      code: `import { useState } from "react"

function SaPromenljivom() {
  let klikova = 0
  return (
    <button className="secondary" onClick={() => {
      klikova = klikova + 1
      console.log("promenljiva:", klikova)
    }}>
      Promenljiva: {klikova}
    </button>
  )
}

function SaStateom() {
  const [klikova, setKlikova] = useState(0)
  return (
    <button onClick={() => setKlikova(klikova + 1)}>
      State: {klikova}
    </button>
  )
}

function App() {
  return (
    <div className="stack">
      <SaPromenljivom />
      <SaStateom />
    </div>
  )
}
`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/PasswordField.tsx",
      lang: "tsx",
      startLine: 17,
      intro:
        "Polje za lozinku sa okom koje je pokazuje i sakriva. Ceo \"mehanizam\" je jedan `boolean` u state-u.",
      code: `export const PasswordField = ({ label = t.auth.password, ...props }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      label={label}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
          className="flex size-11 items-center justify-center rounded-full text-ink-400 transition hover:text-ink-700"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      }
      {...props}
    />
  )
}
`,
      steps: [
        {
          lines: 1,
          md: "Ovo već znaš iz lekcije o props: podrazumevana vrednost za `label` i `...props` za sve ostalo (`value`, `onChange`, `error`…).",
        },
        {
          lines: 2,
          md: "State: `visible` počinje kao `false` (lozinka sakrivena). Ovo pamti **samo ovo polje**: dva `PasswordField`-a na istom ekranu imaju svaki svoju beležnicu.",
        },
        {
          lines: 7,
          md: "State odlučuje šta se crta. Kad je `visible` `true`, input je običan tekst, inače `password` (tačkice).",
        },
        {
          lines: 11,
          md: "Klik pozove setter sa **funkcijom**: \"uzmi trenutnu vrednost i obrni je\". O tom obliku (`current => !current`) malo niže.",
        },
        {
          lines: [12, 15],
          md: "I opis za čitače ekrana i ikonica prate isti state. Ne menjaš ih ručno: promeniš `visible`, a React ponovo nacrta sve što od njega zavisi.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Funkcijski update: \`setN(n => n + 1)\`

Unutar jednog crtanja, state je **fotografija**: \`zauzeto\` ima jednu vrednost od početka do kraja funkcije. Setter ne menja tu fotografiju, nego zakazuje sledeću. Zato ovo ne radi kako očekuješ:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `// zauzeto je 0
const dodajDva = () => {
  setZauzeto(zauzeto + 1) // setZauzeto(0 + 1)
  setZauzeto(zauzeto + 1) // setZauzeto(0 + 1), opet!
}
// posle klika: 1, a ne 2

const dodajDvaIspravno = () => {
  setZauzeto((n) => n + 1) // 0 → 1
  setZauzeto((n) => n + 1) // 1 → 2
}`,
      highlight: [3, 4, 9, 10],
      caption:
        "Kad setteru proslediš **funkciju**, React joj da najnoviju vrednost, uključujući promene koje još nisu nacrtane.",
    },
    {
      kind: "prose",
      md: `Pravilo: **kad nova vrednost zavisi od stare, prosledi funkciju.** \`setVisible((current) => !current)\` iz \`PasswordField\`-a je baš to. Kad je nova vrednost potpuno nova (\`setSaving(true)\`, \`setQuery("")\`), dovoljno je proslediti je direktno.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: console.log odmah posle settera",
      md: "`setZauzeto(5); console.log(zauzeto)` ispiše **staru** vrednost. Setter ne menja promenljivu u ovom crtanju, nego zakazuje novo. Novu vrednost vidiš tek kad se komponenta ponovo nacrta.",
    },
    {
      kind: "prose",
      md: `### Objekti i nizovi: uvek nova kopija

React upoređuje staru i novu vrednost state-a sa \`Object.is\`. Za objekte i nizove to znači: **da li je to isti objekat u memoriji?** Ako promeniš postojeći niz (\`push\`) i prosledi ga setteru, React vidi isti niz i zaključi da nema promene. Ekran se ne osveži.

Zato se objekti i nizovi u state-u **nikad ne menjaju**, već se pravi nova kopija, najčešće spread operatorom:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `// Objekat: kopiraj sve, pa pregazi jedno polje
setForm((current) => ({ ...current, firstName: "Ana" }))

// Niz: dodaj na kraj
setPicked([...picked, "Spotify"])

// Niz: ukloni
setPicked(picked.filter((ime) => ime !== "Spotify"))

// Niz: izmeni jedan element
setTermini(termini.map((t) => (t.id === id ? { ...t, otkazan: true } : t)))`,
      highlight: [2, 5, 8, 11],
      caption:
        "`...current` raširi sva postojeća polja u novi objekat. `filter` i `map` već vraćaju nov niz, pa su savršeni za state. ReformStudio formulari rade baš prvi red: `setForm((current) => ({ ...current, [name]: value }))`.",
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "src/app/onboarding.tsx",
      lang: "tsx",
      startLine: 52,
      intro:
        "Onboarding u Looply-ju: biraš servise koje već plaćaš. Izabrani su u state-u kao niz imena: `const [picked, setPicked] = useState<string[]>([]);` (linija 37). Ovo je funkcija koju poziva `Chip` iz prošle lekcije.",
      code: `  const togglePreset = (name: string) => {
    if (picked.includes(name)) setPicked(picked.filter((other) => other !== name));
    // The free version holds a limited number, so no more can be picked than it can save.
    else if (isPro || picked.length < FREE_SUBSCRIPTION_LIMIT) setPicked([...picked, name]);
    else haptics.warning();
  };
`,
      steps: [
        {
          lines: 1,
          md: "Jedna funkcija za oba smera: ako je servis izabran, skida ga, a ako nije, dodaje. Klasičan **toggle** nad nizom.",
        },
        {
          lines: 2,
          md: "Uklanjanje: `filter` vrati **nov** niz bez tog imena. Postojeći `picked` ostaje netaknut.",
        },
        {
          lines: [3, 4],
          md: "Dodavanje: `[...picked, name]` je nov niz sa svim starim imenima i novim na kraju. Uz to je i pravilo: besplatna verzija ima ograničen broj, pa se dodaje samo ako ima mesta.",
        },
        {
          lines: 5,
          md: "Nema mesta: ništa se ne menja, samo telefon upozoravajuće zavibrira. State ostaje isti, pa nema ni novog crtanja.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: push pa set",
      md: "`picked.push(name); setPicked(picked)` izgleda logično, ali ne radi: to je **isti** niz, pa React preskoči crtanje. Uvek prosledi nov niz: `setPicked([...picked, name])`.",
    },
    {
      kind: "prose",
      md: `### Više komada state-a

Komponenta može imati koliko god hoćeš \`useState\` poziva. Ovako počinje \`ProfileScreen\` u ReformStudiju:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/screens/ProfileScreen.tsx (isečak)",
      code: `const [editOpen, setEditOpen] = useState(false)
const [form, setForm] = useState<Form>({ firstName: '', lastName: '', phone: '' })
const [errors, setErrors] = useState<Errors>({})
const [saving, setSaving] = useState(false)
const [genderOpen, setGenderOpen] = useState(false)
const [passwordOpen, setPasswordOpen] = useState(false)
const [feedbackOpen, setFeedbackOpen] = useState(false)`,
      highlight: [2, 3],
      caption:
        "Svaki prozorčić (sheet) ima svoj `boolean` toggle. Polja formulara su zajedno u jednom objektu, jer se uvek koriste zajedno. Greške su u drugom objektu.",
    },
    {
      kind: "prose",
      md: `Kako da odlučiš: vrednosti koje se menjaju **nezavisno** drži odvojeno (\`saving\` nema veze sa \`genderOpen\`). Vrednosti koje uvek idu **zajedno** (polja jednog formulara) drži u jednom objektu.

I još jedno pravilo za hook-ove: pozivaj ih **na vrhu komponente**, nikad unutar \`if\`-a, petlje ili funkcije za klik. React prepoznaje koji state je koji po **redosledu** poziva, pa redosled mora biti isti pri svakom crtanju.`,
    },
    {
      kind: "exercise",
      id: "react-state-1",
      title: "Brojač koji se zaista menja",
      lang: "tsx",
      prompt: `Klik na **Rezerviši** menja promenljivu, ali ekran stoji na nuli. Prepravi komponentu da koristi \`useState\`:

- prikaz je **Zauzeto: N od 6**
- svaki klik povećava broj za 1
- kad je termin pun (6 od 6), dugme je onemogućeno (\`disabled\`)`,
      starter: `import { useState } from "react"

export default function App() {
  const kapacitet = 6
  let zauzeto = 0

  return (
    <div className="card stack">
      <h3>Pilates · 18:00</h3>
      <p>Zauzeto: {zauzeto} od {kapacitet}</p>
      <button
        onClick={() => {
          zauzeto = zauzeto + 1
          console.log("zauzeto:", zauzeto)
        }}
      >
        Rezerviši
      </button>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

export default function App() {
  const kapacitet = 6
  const [zauzeto, setZauzeto] = useState(0)

  return (
    <div className="card stack">
      <h3>Pilates · 18:00</h3>
      <p>Zauzeto: {zauzeto} od {kapacitet}</p>
      <button onClick={() => setZauzeto((n) => n + 1)} disabled={zauzeto >= kapacitet}>
        Rezerviši
      </button>
    </div>
  )
}
`,
      tests: [
        {
          name: "na početku piše \"Zauzeto: 0 od 6\"",
          code: 'await render(App)\nexpect(screen.getByText("Zauzeto: 0 od 6")).toBeInTheDocument()',
        },
        {
          name: "dva klika → \"Zauzeto: 2 od 6\"",
          code: 'await render(App)\nconst dugme = screen.getByRole("button", { name: "Rezerviši" })\nawait click(dugme)\nawait click(dugme)\nexpect(screen.getByText("Zauzeto: 2 od 6")).toBeInTheDocument()',
        },
        {
          name: "posle 6 klikova dugme je onemogućeno",
          code: 'await render(App)\nconst dugme = screen.getByRole("button", { name: "Rezerviši" })\nfor (let i = 0; i < 6; i++) await click(dugme)\nexpect(screen.getByText("Zauzeto: 6 od 6")).toBeInTheDocument()\nexpect(dugme).toBeDisabled()',
        },
      ],
      hints: [
        "Zameni `let zauzeto = 0` sa `const [zauzeto, setZauzeto] = useState(0)`.",
        "Na klik pozovi setter: `onClick={() => setZauzeto((n) => n + 1)}`. Promenljivu više ne menjaš direktno.",
        "Za pun termin dodaj na dugme `disabled={zauzeto >= kapacitet}`.",
      ],
      explanation:
        "Setter je jedini način da React sazna za promenu. Primeti i `disabled`: ne pamtiš posebno da li je dugme aktivno, nego ga **izračunaš** iz state-a pri svakom crtanju.",
    },
    {
      kind: "exercise",
      id: "react-state-2",
      title: "Grupna rezervacija",
      lang: "tsx",
      prompt: `Dugme **Dodaj dve osobe** dodaje samo jednu. Popravi ga **funkcijskim update-om**, tako da i dalje poziva setter dva puta.

Popravi i **Ukloni osobu**: broj nikad ne sme pasti ispod 1.`,
      starter: `import { useState } from "react"

export default function App() {
  const [osobe, setOsobe] = useState(1)

  const dodajJednu = () => setOsobe(osobe + 1)

  const dodajDve = () => {
    setOsobe(osobe + 1)
    setOsobe(osobe + 1)
  }

  const ukloni = () => setOsobe(osobe - 1)

  return (
    <div className="card stack">
      <p>Osoba: {osobe}</p>
      <div className="row">
        <button onClick={dodajJednu}>Dodaj osobu</button>
        <button onClick={dodajDve}>Dodaj dve osobe</button>
        <button className="secondary" onClick={ukloni}>Ukloni osobu</button>
      </div>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

export default function App() {
  const [osobe, setOsobe] = useState(1)

  const dodajJednu = () => setOsobe((n) => n + 1)

  const dodajDve = () => {
    setOsobe((n) => n + 1)
    setOsobe((n) => n + 1)
  }

  const ukloni = () => setOsobe((n) => Math.max(1, n - 1))

  return (
    <div className="card stack">
      <p>Osoba: {osobe}</p>
      <div className="row">
        <button onClick={dodajJednu}>Dodaj osobu</button>
        <button onClick={dodajDve}>Dodaj dve osobe</button>
        <button className="secondary" onClick={ukloni}>Ukloni osobu</button>
      </div>
    </div>
  )
}
`,
      tests: [
        {
          name: "\"Dodaj dve osobe\" od 1 pravi 3",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: "Dodaj dve osobe" }))\nexpect(screen.getByText("Osoba: 3")).toBeInTheDocument()',
        },
        {
          name: "jedna pa dve osobe → 4",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: "Dodaj osobu" }))\nawait click(screen.getByRole("button", { name: "Dodaj dve osobe" }))\nexpect(screen.getByText("Osoba: 4")).toBeInTheDocument()',
        },
        {
          name: "broj ne pada ispod 1",
          code: 'await render(App)\nconst ukloni = screen.getByRole("button", { name: "Ukloni osobu" })\nawait click(ukloni)\nawait click(ukloni)\nexpect(screen.getByText("Osoba: 1")).toBeInTheDocument()',
        },
        {
          name: "dve osobe pa ukloni jednu → 2",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: "Dodaj dve osobe" }))\nawait click(screen.getByRole("button", { name: "Ukloni osobu" }))\nexpect(screen.getByText("Osoba: 2")).toBeInTheDocument()',
        },
      ],
      hints: [
        "U `dodajDve`, oba puta je `osobe` ista \"fotografija\" (1), pa oba poziva kažu `setOsobe(2)`.",
        "Prosledi funkciju: `setOsobe((n) => n + 1)`. React joj svaki put da najnoviju vrednost.",
        "Za donju granicu: `setOsobe((n) => Math.max(1, n - 1))`.",
      ],
      explanation:
        "Kad nova vrednost zavisi od stare, funkcijski update je uvek siguran izbor, bez obzira na to koliko se puta setter pozove u jednom kliku.",
    },
    {
      kind: "exercise",
      id: "react-state-3",
      title: "Izaberi pretplate",
      lang: "tsx",
      prompt: `Mini verzija Looply onboardinga. Klik na servis treba da ga **doda** u izabrane, a ponovni klik da ga **ukloni**. Trenutni kod menja postojeći niz (\`push\`), pa se ekran ne osvežava.

Prepravi \`prebaci\` tako da:

- ukloni servis ako je već izabran (\`filter\`)
- inače ga doda na kraj (\`[...izabrani, ime]\`), ali **samo ako je izabrano manje od 3**

Prikaz ispod dugmića već je napisan.`,
      starter: `import { useState } from "react"

const SERVISI = ["Netflix", "Spotify", "YouTube Premium", "iCloud+"]
const LIMIT = 3

export default function App() {
  const [izabrani, setIzabrani] = useState<string[]>([])

  const prebaci = (ime: string) => {
    izabrani.push(ime)
    setIzabrani(izabrani)
  }

  return (
    <div className="stack">
      <div className="row">
        {SERVISI.map((ime) => (
          <button
            key={ime}
            aria-pressed={izabrani.includes(ime)}
            className={izabrani.includes(ime) ? "" : "secondary"}
            onClick={() => prebaci(ime)}
          >
            {ime}
          </button>
        ))}
      </div>
      <p>Izabrano: {izabrani.length}</p>
      <p className="muted">{izabrani.join(", ")}</p>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

const SERVISI = ["Netflix", "Spotify", "YouTube Premium", "iCloud+"]
const LIMIT = 3

export default function App() {
  const [izabrani, setIzabrani] = useState<string[]>([])

  const prebaci = (ime: string) => {
    if (izabrani.includes(ime)) setIzabrani(izabrani.filter((i) => i !== ime))
    else if (izabrani.length < LIMIT) setIzabrani([...izabrani, ime])
  }

  return (
    <div className="stack">
      <div className="row">
        {SERVISI.map((ime) => (
          <button
            key={ime}
            aria-pressed={izabrani.includes(ime)}
            className={izabrani.includes(ime) ? "" : "secondary"}
            onClick={() => prebaci(ime)}
          >
            {ime}
          </button>
        ))}
      </div>
      <p>Izabrano: {izabrani.length}</p>
      <p className="muted">{izabrani.join(", ")}</p>
    </div>
  )
}
`,
      tests: [
        {
          name: "klik na Netflix ga izabere",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: "Netflix" }))\nexpect(screen.getByText("Izabrano: 1")).toBeInTheDocument()\nexpect(screen.getByRole("button", { name: "Netflix" }).getAttribute("aria-pressed")).toBe("true")',
        },
        {
          name: "drugi klik ga skida",
          code: 'await render(App)\nconst netflix = screen.getByRole("button", { name: "Netflix" })\nawait click(netflix)\nawait click(netflix)\nexpect(screen.getByText("Izabrano: 0")).toBeInTheDocument()\nexpect(netflix.getAttribute("aria-pressed")).toBe("false")',
        },
        {
          name: "redosled je redosled klikova",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: "Spotify" }))\nawait click(screen.getByRole("button", { name: "Netflix" }))\nexpect(screen.getByText("Spotify, Netflix")).toBeInTheDocument()',
        },
        {
          name: "najviše 3 izabrana",
          code: 'await render(App)\nfor (const ime of ["Netflix", "Spotify", "YouTube Premium", "iCloud+"]) await click(screen.getByRole("button", { name: ime }))\nexpect(screen.getByText("Izabrano: 3")).toBeInTheDocument()\nexpect(screen.getByRole("button", { name: "iCloud+" }).getAttribute("aria-pressed")).toBe("false")',
        },
      ],
      hints: [
        "Prvo proveri: `if (izabrani.includes(ime))` → ukloni, inače → dodaj.",
        "Ukloni: `setIzabrani(izabrani.filter((i) => i !== ime))`. Dodaj: `setIzabrani([...izabrani, ime])`.",
        "Limit: dodaj samo `else if (izabrani.length < LIMIT)`. Ako je puno, ne radi ništa.",
      ],
      explanation:
        "Ovo je skoro red po red `togglePreset` iz Looply-ja. `filter` i spread uvek prave nov niz, pa React vidi promenu i ponovo crta. `aria-pressed` i klasa se samo izračunaju iz niza.",
    },
    {
      kind: "quiz",
      id: "react-state-quiz",
      questions: [
        {
          q: "Zašto `let broj = 0` sa `broj++` na klik ne menja ekran?",
          options: [
            "React ne zna za promenu, a i svako crtanje ponovo izvrši `let broj = 0`",
            "Zato što `let` mora biti `const`",
            "Zato što `++` ne radi u JSX-u",
            "Radi, samo sporije",
          ],
          answer: 0,
          why: "Obična promenljiva ne zakazuje novo crtanje, a i ne preživljava ga. State radi oba: pamti vrednost i javlja Reactu.",
        },
        {
          q: "Šta vraća `useState(false)`?",
          options: [
            "Niz: trenutnu vrednost i funkciju koja je menja",
            "Samo vrednost `false`",
            "Objekat `{ value, setValue }`",
            "Promise koji se ispuni kad se vrednost promeni",
          ],
          answer: 0,
          why: "Zato se piše `const [visible, setVisible] = useState(false)`, destrukturiranjem niza.",
        },
        {
          q: "`osobe` je 1. Koliko je posle klika?",
          code: `const dodaj = () => {
  setOsobe(osobe + 1)
  setOsobe(osobe + 1)
  setOsobe(osobe + 1)
}`,
          codeLang: "tsx",
          options: ["2", "4", "3", "1"],
          answer: 0,
          why: "Sva tri poziva vide istu \"fotografiju\" `osobe = 1`, pa sva tri kažu `setOsobe(2)`. Sa `setOsobe((n) => n + 1)` bilo bi 4.",
        },
        {
          q: "Koji kod ispravno dodaje servis u niz u state-u?",
          options: [
            "`setPicked([...picked, ime])`",
            "`picked.push(ime); setPicked(picked)`",
            "`picked[picked.length] = ime`",
            "`setPicked(picked.push(ime))`",
          ],
          answer: 0,
          why: "Treba nov niz. `push` menja postojeći (pa React ne vidi promenu), a uz to vraća dužinu, ne niz.",
        },
        {
          q: "Kako se piše toggle (uključi/isključi) sa state-om?",
          options: [
            "`setOpen((current) => !current)`",
            "`open = !open`",
            "`setOpen(open = !open)`",
            "`useState(!open)`",
          ],
          answer: 0,
          why: "Nova vrednost zavisi od stare, pa je funkcijski update najsigurniji. Isto kao `setVisible((current) => !current)` u `PasswordField`-u.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-state-1",
      front: "Šta je state?",
      back: "Vrednost koju komponenta pamti između crtanja. Kad je promeniš setterom, React ponovo nacrta komponentu sa novom vrednošću.",
    },
    {
      id: "fc-react-state-2",
      front: "Kako izgleda `useState` za listu stringova koja počinje prazna?",
      back: "`const [picked, setPicked] = useState<string[]>([])`. Generik je potreban jer iz `[]` TypeScript ne zna šta će biti u nizu.",
    },
    {
      id: "fc-react-state-3",
      front: "Kada koristiti `setN((n) => n + 1)` umesto `setN(n + 1)`?",
      back: "Kad nova vrednost zavisi od stare. Funkcija dobija najnoviju vrednost, čak i kad se setter pozove više puta u jednom kliku.",
    },
    {
      id: "fc-react-state-4",
      front: "Kako se menja objekat ili niz u state-u?",
      back: "Pravi se nova kopija: `{ ...obj, polje: x }`, `[...niz, x]`, `niz.filter(…)`, `niz.map(…)`. Nikad `push` ili direktna dodela.",
    },
    {
      id: "fc-react-state-5",
      front: "Gde smeju da se pozivaju hook-ovi kao `useState`?",
      back: "Samo na vrhu komponente, uvek istim redom. Nikad unutar `if`-a, petlje ili handlera za klik.",
    },
  ],
};

export default lesson;
