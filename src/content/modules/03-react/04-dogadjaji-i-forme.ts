import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "dogadjaji-i-forme",
  title: "Događaji i forme",
  summary:
    "Kako React reaguje na klik i kucanje, šta je kontrolisan input i kako se pravi forma sa validacijom i porukama o greškama, na primeru `TextField`-a i promene lozinke iz ReformStudija.",
  minutes: 22,
  projects: ["ReformStudio", "PlazaHome"],
  blocks: [
    {
      kind: "prose",
      md: `Sad znaš da props donose podatke, a state ih pamti. Ostaje pitanje: **kako korisnik uopšte menja state?** Kroz **događaje**: klik, kucanje, štikliranje, slanje forme.

Skoro svaki ekran u ReformStudiju ima neku formu: prijava, registracija, izmena profila, promena lozinke. Sve rade na istom principu, koji ćeš do kraja ove lekcije umeti da napišeš bez pomoći.`,
    },
    {
      kind: "prose",
      md: `### Događaji i event objekat

Događaje već znaš iz JSX lekcije: \`onClick\`, \`onChange\`, \`onSubmit\`… u camelCase-u, i primaju **funkciju**. React tu funkciju pozove kad se događaj desi i prosledi joj **event objekat**, sa svim detaljima o tome šta se desilo:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Dogadjaji.tsx",
      code: `import { useState, type ChangeEvent, type SubmitEvent } from "react"

function Pretraga() {
  const [upit, setUpit] = useState("")

  // Inline: TypeScript sam zna tip za \`e\`
  // <input onChange={(e) => setUpit(e.target.value)} />

  // Posebna funkcija: tip pišeš ti
  const promeni = (e: ChangeEvent<HTMLInputElement>) => {
    setUpit(e.target.value)   // šta je trenutno upisano u polje
  }

  const posalji = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()        // ne osvežavaj stranicu
    console.log("Tražim:", upit)
  }

  return (
    <form onSubmit={posalji}>
      <input value={upit} onChange={promeni} />
    </form>
  )
}`,
      highlight: [7, 10, 11, 14, 15],
      caption:
        "`e.target` je element na kom se događaj desio, pa je `e.target.value` tekst iz polja. Tipovi događaja (`ChangeEvent`, `SubmitEvent`, `MouseEvent`) uvoze se iz `react` kao generici sa tipom elementa. Stariji `FormEvent` je u React 19 tipovima označen kao zastareo (deprecated).",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Pusti TypeScript da pogađa",
      md: "Kad handler pišeš direktno u JSX-u (`onChange={(e) => …}`), tip za `e` se zaključi sam. Tip pišeš samo kad handler izdvojiš u posebnu funkciju. Ako ne znaš koji tip treba, napiši ga inline, pa pređi mišem preko `e` i VS Code ti ga pokaže.",
    },
    {
      kind: "prose",
      md: `### Kontrolisan input

U običnom HTML-u, input sam čuva ono što je upisano. U Reactu se skoro uvek radi drugačije: **vrednost polja drži state**, a input je samo prikazuje. To se zove **kontrolisan input** i ima dva obavezna dela:

- \`value={upit}\`: polje uvek prikazuje vrednost iz state-a
- \`onChange={(e) => setUpit(e.target.value)}\`: svako kucanje ažurira state

Krug izgleda ovako: korisnik otkuca slovo → \`onChange\` → \`setUpit\` → novo crtanje → input prikaže novi \`upit\`. Deluje kao zaobilazni put, ali zato **u svakom trenutku znaš šta piše u polju**, bez čitanja DOM-a. Možeš da ga obrišeš (\`setUpit("")\`), proveriš, skratiš ili prikažeš brojač karaktera.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao displej u liftu",
      md: "Displej u liftu ne odlučuje na kom je spratu, on samo prikazuje ono što mu kaže lift. Kontrolisan input je displej, a state je lift: pritisak na taster je samo **zahtev** (\"hoću ovo slovo\"), state ga prihvati, a polje prikaže rezultat.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: value bez onChange",
      md: "`<input value={ime} />` bez `onChange` je polje u koje **ne možeš da kucaš**: svako crtanje vrati vrednost iz state-a, a state se nikad ne menja. React u konzoli upozori na to. Uvek idu u paru: `value` + `onChange` (ili `checked` + `onChange` za checkbox).",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/TextField.tsx",
      lang: "tsx",
      startLine: 4,
      intro:
        "`TextField` je polje koje koriste sve forme u ReformStudiju: labela, input i poruka o grešci u jednom. Ovo je njegov početak.",
      code: `interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  /** Element na desnoj strani polja, npr. dugme za prikaz lozinke. */
  trailing?: ReactNode
}

export const TextField = ({
  label,
  value,
  onChange,
  error,
  trailing,
  className,
  ...props
}: TextFieldProps) => {
  const id = useId()
  const errorId = \`\${id}-error\`

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block pl-1 text-[13px] font-semibold text-ink-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
`,
      steps: [
        {
          lines: [1, 8],
          md: "Polje prima sve što prima običan `<input>` (`InputHTMLAttributes`), **osim** `onChange`, koji `Omit` izbaci i definiše jednostavnije: `(value: string) => void`. Pozivalac dobija samo tekst, bez event objekta.",
        },
        {
          lines: [10, 18],
          md: "Destrukturiranje sa `...props`: sve ostalo (`type`, `placeholder`, `autoComplete`…) kasnije se raširi na `<input>`.",
        },
        {
          lines: [19, 20],
          md: "`useId()` je hook koji napravi jedinstven id, pa i deset polja na istom ekranu ima svako svoj. Od njega se pravi i id poruke o grešci.",
        },
        {
          lines: [24, 26],
          md: "`htmlFor={id}` (u JSX-u umesto HTML-ovog `for`) povezuje labelu sa inputom: klik na labelu fokusira polje, a čitač ekrana pročita labelu kad uđeš u polje.",
        },
        {
          lines: [28, 31],
          md: "Kontrolisan input: `value` stiže kroz props, a `onChange` izvuče `event.target.value` i pošalje ga **naviše**. State ne živi u `TextField`-u, nego u formi koja ga koristi. Props naniže, događaji naviše.",
        },
        {
          lines: [32, 33],
          md: "Kad postoji greška, polje se označi kao neispravno i poveže sa porukom ispod sebe (`errorId`). Samu poruku crta kraj komponente: `{error && <p id={errorId} …>{error}</p>}`.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Checkbox i select

Isti princip, uz dve razlike:

- **Checkbox** ne koristi \`value\`, nego \`checked\`, a novu vrednost čitaš iz \`e.target.checked\` (boolean).
- **Select** radi kao input: \`value\` + \`onChange\` sa \`e.target.value\`. Izabrana opcija je ona čiji \`value\` odgovara state-u.`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Podesavanja.tsx",
      code: `const [podsetnik, setPodsetnik] = useState(false)
const [trening, setTrening] = useState("Pilates")

<label>
  <input
    type="checkbox"
    checked={podsetnik}
    onChange={(e) => setPodsetnik(e.target.checked)}
  />
  Podseti me dan ranije
</label>

<label htmlFor="trening">Trening</label>
<select id="trening" value={trening} onChange={(e) => setTrening(e.target.value)}>
  <option value="Pilates">Pilates</option>
  <option value="Fitness">Fitness</option>
</select>`,
      highlight: [7, 8, 14],
      caption:
        "Labela može i da **obuhvati** checkbox, pa klik na tekst štiklira polje. Za select je bolje `htmlFor` + `id`, jer bi obuhvaćena labela \"pokupila\" i tekst svih opcija.",
    },
    {
      kind: "playground",
      id: "react-forme-peskovnik",
      title: "Forma uživo",
      prompt:
        "Kucaj, štikliraj i biraj, pa gledaj kako se state ispod menja u istom trenutku. Probaj da obrišeš `onChange` sa inputa i vidi da više ne možeš da kucaš.",
      lang: "tsx",
      code: `import { useState } from "react"

function App() {
  const [ime, setIme] = useState("")
  const [trening, setTrening] = useState("Pilates")
  const [podsetnik, setPodsetnik] = useState(false)

  return (
    <div className="stack">
      <label htmlFor="ime">Ime</label>
      <input id="ime" value={ime} onChange={(e) => setIme(e.target.value)} placeholder="Kako se zoveš?" />

      <label htmlFor="trening">Trening</label>
      <select id="trening" value={trening} onChange={(e) => setTrening(e.target.value)}>
        <option value="Pilates">Pilates</option>
        <option value="Fitness">Fitness</option>
        <option value="Joga">Joga</option>
      </select>

      <label>
        <input type="checkbox" checked={podsetnik} onChange={(e) => setPodsetnik(e.target.checked)} />
        Podseti me dan ranije
      </label>

      <div className="card">
        <small>State:</small>
        <pre>{JSON.stringify({ ime, trening, podsetnik }, null, 2)}</pre>
      </div>
      <button className="secondary" onClick={() => setIme("")}>Obriši ime</button>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Slanje forme: \`onSubmit\` i \`preventDefault\`

Forma se šalje kad korisnik klikne dugme \`type="submit"\` **ili pritisne Enter** u polju. Zato se logika slanja stavlja na \`onSubmit\` same forme, a ne na \`onClick\` dugmeta: tako pokriva oba slučaja.

Stari HTML posle slanja forme **ponovo učita stranicu**. U React aplikaciji to bi obrisalo sav state. Zato prva linija skoro svakog submit handlera glasi \`event.preventDefault()\`: "ne radi ono što browser inače radi, slanje preuzima moj kod".`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: dugme bez type",
      md: "Unutar `<form>`, **svako** `<button>` bez `type` je podrazumevano `type=\"submit\"`. Dugme \"Otkaži\" ili \"Prikaži lozinku\" bi tako poslalo formu! Zato ReformStudio `Button` ima `type = 'button'` kao podrazumevanu vrednost, a `PasswordField` piše `type=\"button\"` na svom oku. Submit je samo ono dugme kome to izričito napišeš.",
    },
    {
      kind: "prose",
      md: `### Validacija i poruke o greškama

Obrazac koji koristi svaka forma u ReformStudiju:

1. Vrednosti polja su u state-u (jedan objekat ili više state-ova).
2. Greške su **u posebnom state-u**, objektu \`{ polje: "poruka" }\`.
3. Na submit: \`preventDefault\`, proveri sva polja, upiši pronađene greške i **prekini** (\`return\`) ako ih ima.
4. Kad korisnik počne da ispravlja polje, njegova greška nestaje.
5. Ispod svakog polja: \`{greske.ime && <p>{greske.ime}</p>}\`.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/ChangePasswordSheet.tsx",
      lang: "tsx",
      startLine: 16,
      intro:
        "Promena lozinke iz Profila. Komponenta je kratka, a ima sve: state za polja, greške, slanje i validaciju.",
      code: `export const ChangePasswordSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState<Record<Field, string>>({ current: '', next: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string | null>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const close = () => {
    if (saving) return
    setForm({ current: '', next: '' })
    setErrors({})
    setFormError(null)
    onClose()
  }

  const field = (name: Field) => ({
    value: form[name],
    error: errors[name],
    onChange: (value: string) => {
      setForm((current) => ({ ...current, [name]: value }))
      setErrors((current) => ({ ...current, [name]: null }))
    },
  })

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = {
      current: rules.required(form.current),
      next:
        rules.password(form.next) ??
        (form.next === form.current ? t.profile.password.same : null),
    }
    setErrors(found)
    setFormError(null)
    if (found.current || found.next) return
`,
      steps: [
        {
          lines: [2, 5],
          md: "Četiri komada state-a: vrednosti oba polja (`Field` je `'current' | 'next'`), greške po polju, opšta greška (npr. nema interneta) i `saving` dok zahtev traje. `Record` i `Partial` su utility tipovi iz TypeScript modula.",
        },
        {
          lines: [7, 13],
          md: "Zatvaranje sve vrati na početak: prazna polja, bez grešaka. Dok se čuva (`saving`), zatvaranje se ignoriše.",
        },
        {
          lines: [15, 22],
          md: "Pametan pomoćnik: `field('current')` vrati `{ value, error, onChange }`, tačno ono što `PasswordField` prima. U JSX-u se raširi: `<PasswordField {...field('current')} />`. `onChange` menja samo to polje (`[name]: value`) i **briše njegovu grešku** čim korisnik krene da kuca.",
        },
        {
          lines: [24, 25],
          md: "Submit handler. Prva stvar: `preventDefault()`, da se stranica ne osveži. Tip `FormEvent` je stariji naziv: u React 19 tipovima je označen kao zastareo, a novi kod piše `SubmitEvent`.",
        },
        {
          lines: [26, 31],
          md: "Validacija: svako pravilo vrati poruku o grešci ili `null`. Nova lozinka ne sme biti prazna, kratka, ni ista kao stara.",
        },
        {
          lines: [32, 34],
          md: "Greške idu u state (pa se prikažu ispod polja), a ako postoji bar jedna, `return` prekida slanje. Do servera se stiže samo sa ispravnim podacima.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Onemogući dugme dok traje slanje

Kad korisnik klikne **Sačuvaj**, a server odgovara sekundu-dve, prirodno je da klikne ponovo. Rezultat: dva ista zahteva. Rešenje je jednostavno: dok traje slanje, dugme je \`disabled\`. ReformStudio za to ima \`loading={saving}\` na svom \`Button\`-u (on interno postavi \`disabled\` i prikaže spinner), a PlazaHome kontakt forma to radi direktno:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "PlazaHome · src/components/contact-form.tsx (isečak)",
      code: `<button
  type="submit"
  disabled={status === "sending"}
  className="btn btn-primary w-full disabled:opacity-60 sm:w-auto"
>
  {status === "sending" ? "Šaljem…" : "Pošalji upit"}
</button>`,
      highlight: [3, 6],
      caption:
        "`status` je state tipa `\"idle\" | \"sending\" | \"sent\" | \"error\"`. I `disabled` i tekst dugmeta se **izračunaju** iz njega, nema posebnog state-a za dugme.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "A PlazaHome bez value i onChange?",
      md: "Polja u PlazaHome kontakt formi nisu kontrolisana: nemaju `value` ni `onChange`. Na submit, forma pročita sve odjednom: `Object.fromEntries(new FormData(form))`. To je **nekontrolisana** forma i sasvim je u redu kad ti vrednosti ne trebaju dok korisnik kuca (bez brojača, bez žive provere). Čim treba da reaguješ na svako slovo, prelaziš na kontrolisana polja.",
    },
    {
      kind: "exercise",
      id: "react-forme-1",
      title: "Napomena za trenera",
      lang: "tsx",
      prompt: `Napravi kontrolisano polje za napomenu:

- tekst iz \`<textarea>\` čuva se u state-u (\`value\` + \`onChange\`)
- ispod piše **Preostalo: N**, gde je N = \`MAX\` minus broj upisanih karaktera
- dugme **Obriši** prazni polje`,
      starter: `import { useState } from "react"

const MAX = 100

export default function App() {
  return (
    <div className="stack">
      <label htmlFor="napomena">Napomena za trenera</label>
      <textarea id="napomena" rows={3} />
      <small>Preostalo: {MAX}</small>
      <button className="secondary">Obriši</button>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

const MAX = 100

export default function App() {
  const [napomena, setNapomena] = useState("")

  return (
    <div className="stack">
      <label htmlFor="napomena">Napomena za trenera</label>
      <textarea
        id="napomena"
        rows={3}
        value={napomena}
        onChange={(e) => setNapomena(e.target.value)}
      />
      <small>Preostalo: {MAX - napomena.length}</small>
      <button className="secondary" onClick={() => setNapomena("")}>
        Obriši
      </button>
    </div>
  )
}
`,
      tests: [
        {
          name: "na početku piše \"Preostalo: 100\"",
          code: 'await render(App)\nexpect(screen.getByText("Preostalo: 100")).toBeInTheDocument()',
        },
        {
          name: "kucanje smanjuje brojač",
          code: 'await render(App)\nconst polje = screen.getByLabelText("Napomena za trenera")\nawait type(polje, "Boli me koleno")\nexpect(polje).toHaveValue("Boli me koleno")\nexpect(screen.getByText("Preostalo: 86")).toBeInTheDocument()',
        },
        {
          name: "Obriši prazni polje i vraća brojač",
          code: 'await render(App)\nconst polje = screen.getByLabelText("Napomena za trenera")\nawait type(polje, "Kasnim 5 minuta")\nawait click(screen.getByRole("button", { name: "Obriši" }))\nexpect(polje).toHaveValue("")\nexpect(screen.getByText("Preostalo: 100")).toBeInTheDocument()',
        },
      ],
      hints: [
        "Dodaj state: `const [napomena, setNapomena] = useState(\"\")`.",
        "Na `<textarea>`: `value={napomena}` i `onChange={(e) => setNapomena(e.target.value)}`. Brojač je `{MAX - napomena.length}`.",
        "Dugme: `onClick={() => setNapomena(\"\")}`. Pošto polje prikazuje state, prazan state znači prazno polje.",
      ],
      explanation:
        "Brojač i brisanje rade samo zato što je polje kontrolisano: tekst je u state-u, pa ga možeš meriti i menjati odakle god hoćeš.",
    },
    {
      kind: "exercise",
      id: "react-forme-2",
      title: "Podešavanja rezervacije",
      lang: "tsx",
      prompt: `Select i checkbox su na ekranu, ali ništa ne pamte. Poveži ih sa state-om:

- \`trening\` (string, početno \`"Pilates"\`) ide na \`<select>\` preko \`value\` i \`onChange\`
- \`podsetnik\` (boolean, početno \`false\`) ide na checkbox preko \`checked\` i \`onChange\`
- rezime ispod prikazuje npr. **Joga · podsetnik uključen** ili **Pilates · podsetnik isključen**`,
      starter: `import { useState } from "react"

export default function App() {
  return (
    <div className="stack">
      <label htmlFor="trening">Trening</label>
      <select id="trening">
        <option value="Pilates">Pilates</option>
        <option value="Fitness">Fitness</option>
        <option value="Joga">Joga</option>
      </select>

      <label>
        <input type="checkbox" />
        Podseti me dan ranije
      </label>

      <p>Pilates · podsetnik isključen</p>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

export default function App() {
  const [trening, setTrening] = useState("Pilates")
  const [podsetnik, setPodsetnik] = useState(false)

  return (
    <div className="stack">
      <label htmlFor="trening">Trening</label>
      <select id="trening" value={trening} onChange={(e) => setTrening(e.target.value)}>
        <option value="Pilates">Pilates</option>
        <option value="Fitness">Fitness</option>
        <option value="Joga">Joga</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={podsetnik}
          onChange={(e) => setPodsetnik(e.target.checked)}
        />
        Podseti me dan ranije
      </label>

      <p>
        {trening} · podsetnik {podsetnik ? "uključen" : "isključen"}
      </p>
    </div>
  )
}
`,
      tests: [
        {
          name: "na početku: \"Pilates · podsetnik isključen\"",
          code: 'await render(App)\nexpect(screen.getByText("Pilates · podsetnik isključen")).toBeInTheDocument()\nexpect(screen.getByLabelText("Podseti me dan ranije").checked).toBe(false)',
        },
        {
          name: "izbor Joge menja rezime",
          code: 'await render(App)\nconst izbor = screen.getByLabelText("Trening")\nawait select(izbor, "Joga")\nexpect(izbor).toHaveValue("Joga")\nexpect(screen.getByText("Joga · podsetnik isključen")).toBeInTheDocument()',
        },
        {
          name: "štikliranje uključuje podsetnik",
          code: 'await render(App)\nconst polje = screen.getByLabelText("Podseti me dan ranije")\nawait click(polje)\nexpect(polje).toBeChecked()\nexpect(screen.getByText("Pilates · podsetnik uključen")).toBeInTheDocument()',
        },
        {
          name: "drugi klik ga isključuje",
          code: 'await render(App)\nconst polje = screen.getByLabelText("Podseti me dan ranije")\nawait click(polje)\nawait click(polje)\nexpect(polje).not.toBeChecked()\nexpect(screen.getByText("Pilates · podsetnik isključen")).toBeInTheDocument()',
        },
      ],
      hints: [
        "Dva state-a: `useState(\"Pilates\")` i `useState(false)`.",
        "Select: `value={trening} onChange={(e) => setTrening(e.target.value)}`. Checkbox: `checked={podsetnik} onChange={(e) => setPodsetnik(e.target.checked)}`.",
        "Rezime: `{trening} · podsetnik {podsetnik ? \"uključen\" : \"isključen\"}`.",
      ],
      explanation:
        "Checkbox se razlikuje samo po imenu: `checked` umesto `value` i `e.target.checked` umesto `e.target.value`. Rezime nema svoj state, nego se izračuna iz dva postojeća.",
    },
    {
      kind: "exercise",
      id: "react-forme-3",
      title: "Prijava za probni trening",
      lang: "tsx",
      prompt: `Forma ima kontrolisana polja, ali ne proverava ništa i osvežava stranicu. Dovrši je po uzoru na \`ChangePasswordSheet\`:

1. U \`posalji\` pozovi \`e.preventDefault()\`.
2. Proveri polja i upiši greške u \`greske\`:
   - ime kraće od 2 znaka (posle \`trim()\`) → **Upiši ime i prezime.**
   - email bez \`@\` → **Email nije ispravan.**
3. Ako ima grešaka, prekini. Inače \`setPoslato(true)\`.
4. Ispod svakog polja prikaži njegovu grešku u \`<p className="error">\`.
5. Kucanje u polje briše **samo njegovu** grešku.
6. Dugme **Pošalji** je onemogućeno dok su **oba** polja prazna.`,
      starter: `import { useState, type SubmitEvent } from "react"

type Greske = { ime?: string; email?: string }

export default function App() {
  const [ime, setIme] = useState("")
  const [email, setEmail] = useState("")
  const [greske, setGreske] = useState<Greske>({})
  const [poslato, setPoslato] = useState(false)

  const posalji = (e: SubmitEvent<HTMLFormElement>) => {
    // 1. spreči osvežavanje
    // 2. proveri polja i upiši greške
    // 3. ako ima grešaka, prekini
    setPoslato(true)
  }

  return (
    <form onSubmit={posalji} noValidate>
      <h3>Probni trening</h3>

      <label htmlFor="ime">Ime i prezime</label>
      <input id="ime" value={ime} onChange={(e) => setIme(e.target.value)} />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <button type="submit">Pošalji</button>
      {poslato && <p role="status">Hvala, {ime.trim()}! Javljamo se uskoro.</p>}
    </form>
  )
}
`,
      solution: `import { useState, type SubmitEvent } from "react"

type Greske = { ime?: string; email?: string }

export default function App() {
  const [ime, setIme] = useState("")
  const [email, setEmail] = useState("")
  const [greske, setGreske] = useState<Greske>({})
  const [poslato, setPoslato] = useState(false)

  const posalji = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nadjene: Greske = {}
    if (ime.trim().length < 2) nadjene.ime = "Upiši ime i prezime."
    if (!email.includes("@")) nadjene.email = "Email nije ispravan."
    setGreske(nadjene)
    if (Object.keys(nadjene).length > 0) return
    setPoslato(true)
  }

  return (
    <form onSubmit={posalji} noValidate>
      <h3>Probni trening</h3>

      <label htmlFor="ime">Ime i prezime</label>
      <input
        id="ime"
        value={ime}
        onChange={(e) => {
          setIme(e.target.value)
          setGreske((g) => ({ ...g, ime: undefined }))
        }}
      />
      {greske.ime && <p className="error">{greske.ime}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setGreske((g) => ({ ...g, email: undefined }))
        }}
      />
      {greske.email && <p className="error">{greske.email}</p>}

      <button type="submit" disabled={ime === "" && email === ""}>
        Pošalji
      </button>
      {poslato && <p role="status">Hvala, {ime.trim()}! Javljamo se uskoro.</p>}
    </form>
  )
}
`,
      tests: [
        {
          name: "prazna forma: Pošalji je onemogućeno",
          code: 'await render(App)\nexpect(screen.getByRole("button", { name: "Pošalji" })).toBeDisabled()\nawait type(screen.getByLabelText("Ime i prezime"), "M")\nexpect(screen.getByRole("button", { name: "Pošalji" })).not.toBeDisabled()',
        },
        {
          name: "neispravna polja prikazuju obe greške i ne šalju",
          code: 'await render(App)\nawait type(screen.getByLabelText("Ime i prezime"), "M")\nawait type(screen.getByLabelText("Email"), "mila")\nawait click(screen.getByRole("button", { name: "Pošalji" }))\nexpect(screen.getByText("Upiši ime i prezime.")).toBeInTheDocument()\nexpect(screen.getByText("Email nije ispravan.")).toBeInTheDocument()\nexpect(screen.queryByRole("status")).toBe(null)',
        },
        {
          name: "kucanje u polje briše samo njegovu grešku",
          code: 'await render(App)\nawait type(screen.getByLabelText("Ime i prezime"), "M")\nawait type(screen.getByLabelText("Email"), "mila")\nawait click(screen.getByRole("button", { name: "Pošalji" }))\nawait type(screen.getByLabelText("Ime i prezime"), "Mila Perić")\nexpect(screen.queryByText("Upiši ime i prezime.")).toBe(null)\nexpect(screen.getByText("Email nije ispravan.")).toBeInTheDocument()',
        },
        {
          name: "ispravna forma prikazuje zahvalnicu",
          code: 'await render(App)\nawait type(screen.getByLabelText("Ime i prezime"), "  Mila Perić ")\nawait type(screen.getByLabelText("Email"), "mila@primer.rs")\nawait click(screen.getByRole("button", { name: "Pošalji" }))\nexpect(screen.getByRole("status")).toHaveTextContent("Hvala, Mila Perić! Javljamo se uskoro.")\nexpect(screen.queryByText("Email nije ispravan.")).toBe(null)',
        },
      ],
      hints: [
        "Napravi prazan objekat `const nadjene: Greske = {}`, pa za svako pravilo koje ne prolazi upiši poruku: `if (ime.trim().length < 2) nadjene.ime = \"Upiši ime i prezime.\"`.",
        "Posle provere: `setGreske(nadjene)`, pa `if (Object.keys(nadjene).length > 0) return`. Ispod polja: `{greske.ime && <p className=\"error\">{greske.ime}</p>}`.",
        "U `onChange` pozovi dva settera: `setIme(e.target.value)` i `setGreske((g) => ({ ...g, ime: undefined }))`. Dugme: `disabled={ime === \"\" && email === \"\"}`.",
      ],
      explanation:
        "Ovo je ceo obrazac formi iz ReformStudija u malom: kontrolisana polja, greške u posebnom state-u, `preventDefault`, provera pa rani `return`, i brisanje greške čim korisnik krene da je ispravlja.",
    },
    {
      kind: "quiz",
      id: "react-forme-quiz",
      questions: [
        {
          q: "Šta čini input \"kontrolisanim\"?",
          options: [
            "`value` iz state-a i `onChange` koji taj state menja",
            "Samo atribut `value`",
            "Atribut `required`",
            "To što je unutar `<form>`",
          ],
          answer: 0,
          why: "Kontrolisan input prikazuje state, a svako kucanje ide kroz `onChange` u state. Bez `onChange` polje je zaključano.",
        },
        {
          q: "Zašto submit handler počinje sa `e.preventDefault()`?",
          options: [
            "Da browser ne osveži stranicu i ne obriše state",
            "Da bi se pokrenula validacija",
            "Da bi dugme postalo onemogućeno",
            "Bez toga se `onSubmit` ne poziva",
          ],
          answer: 0,
          why: "Podrazumevano ponašanje forme je slanje i ponovno učitavanje stranice. U React aplikaciji slanje preuzima tvoj kod (npr. `fetch`), pa to ponašanje gasiš.",
        },
        {
          q: "Kako se čita nova vrednost checkbox-a u `onChange`?",
          options: ["`e.target.checked`", "`e.target.value`", "`e.checked`", "`e.target.selected`"],
          answer: 0,
          why: "Checkbox je boolean, pa koristi `checked` (i u JSX-u i u event-u). `value` checkbox-a je fiksni string i ne menja se klikom.",
        },
        {
          q: "U formi je dugme \"Prikaži lozinku\" bez `type`. Šta se desi kad se klikne?",
          code: `<form onSubmit={posalji}>
  <input type="password" />
  <button onClick={() => setVidljivo(true)}>Prikaži lozinku</button>
</form>`,
          codeLang: "tsx",
          options: [
            "Pokaže lozinku i **pošalje formu**, jer je dugme podrazumevano `submit`",
            "Samo pokaže lozinku",
            "Ništa, dugmići u formi ne reaguju na `onClick`",
            "TypeScript prijavi grešku",
          ],
          answer: 0,
          why: "Dugme bez `type` unutar forme je `submit`. Zato `PasswordField` piše `type=\"button\"`, a ReformStudio `Button` ima `type = 'button'` kao podrazumevano.",
        },
        {
          q: "Gde je najbolje čuvati poruke o greškama forme?",
          options: [
            "U posebnom state-u, npr. `{ ime?: string; email?: string }`",
            "Direktno u DOM-u, preko `document.getElementById`",
            "U `value` polja",
            "U `console.log`",
          ],
          answer: 0,
          why: "Greške su podaci kao i svi drugi: kad su u state-u, React ih sam prikaže ispod polja i skloni kad ih obrišeš.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-forme-1",
      front: "Kako izgleda kontrolisan input?",
      back: "`<input value={ime} onChange={(e) => setIme(e.target.value)} />`. Polje prikazuje state, a kucanje menja state.",
    },
    {
      id: "fc-react-forme-2",
      front: "Čemu služi `e.preventDefault()` u `onSubmit`?",
      back: "Sprečava podrazumevano ponašanje browsera: slanje forme i ponovno učitavanje stranice, koje bi obrisalo state.",
    },
    {
      id: "fc-react-forme-3",
      front: "Koja je razlika između checkbox-a i običnog inputa u Reactu?",
      back: "Checkbox koristi `checked={…}` i `e.target.checked` (boolean), a input `value={…}` i `e.target.value` (string).",
    },
    {
      id: "fc-react-forme-4",
      front: "Koji je redosled u submit handleru sa validacijom?",
      back: "`preventDefault()` → proveri polja → `setGreske(nadjene)` → `return` ako ima grešaka → tek onda šalji.",
    },
    {
      id: "fc-react-forme-5",
      front: "Kako sprečiti dupli klik na \"Sačuvaj\"?",
      back: "State `saving` (ili `status`) i `disabled={saving}` na dugmetu dok zahtev traje.",
    },
  ],
};

export default lesson;
