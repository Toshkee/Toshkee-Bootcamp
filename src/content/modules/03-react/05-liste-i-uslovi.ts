import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "liste-i-uslovi",
  title: "Liste i uslovno crtanje",
  summary:
    "Kako se niz podataka pretvara u listu na ekranu, zašto svaka stavka traži `key` i kako se crta samo ono što treba, uključujući prazna stanja.",
  minutes: 20,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Skoro svaki ekran u tvojim aplikacijama je, u suštini, **lista**: rezervacije u ReformStudiju, filteri iznad rasporeda, pretplate i plaćanja u Looply-ju. Podaci stižu kao niz objekata, a na ekranu treba da se pojavi po jedna kartica za svaki.

Druga stvar koja se stalno ponavlja je **uslov**: prikaži dugme samo ako je termin budući, prikaži poruku samo ako je lista prazna, ne prikazuj ništa dok studio nije izabran. U ovoj lekciji spajamo oba: kako se niz pretvara u JSX i kako se odlučuje šta se uopšte crta.`,
    },
    {
      kind: "prose",
      md: `### Od niza do liste: \`.map()\`

U lekciji o nizovima \`.map()\` je pretvarao svaki element niza u nešto drugo. U Reactu radi potpuno isto, samo što je to "nešto drugo" **JSX**:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ListaTermina.tsx",
      code: `const termini = [
  { id: "t1", naziv: "Pilates", vreme: "09:00" },
  { id: "t2", naziv: "Reformer", vreme: "18:00" },
]

function ListaTermina() {
  return (
    <ul>
      {termini.map((termin) => (
        <li key={termin.id}>
          {termin.naziv} · {termin.vreme}
        </li>
      ))}
    </ul>
  )
}`,
      highlight: [9, 10, 11, 12, 13],
      caption:
        "`.map()` vraća **niz JSX elemenata**, a React ume da nacrta niz: jedan `<li>` za svaki termin.",
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao kalup za kolače",
      md: "Funkcija u `.map()` je kalup: napraviš ga jednom (`<li>` sa nazivom i vremenom), a React ga utisne u testo za svaki element niza. Dva termina, dva kolačića. Sto termina, sto kolačića, i kod se ne menja.",
    },
    {
      kind: "prose",
      md: `Primeti dve sitnice. Prvo, \`.map()\` stoji unutar \`{ }\`, jer je to JavaScript izraz. Drugo, arrow funkcija vraća JSX u **običnim zagradama** \`(termin) => ( … )\`, pa ne treba \`return\`. Ako napišeš vitičaste \`(termin) => { <li>…</li> }\`, funkcija ne vraća ništa i lista ostane prazna.`,
    },
    {
      kind: "prose",
      md: `### Ključ: \`key\`

Svaki element koji nastaje u \`.map()\` mora da dobije prop \`key\`. React ga ne prikazuje, nego ga koristi kao **ime stavke**. Kad se lista promeni (nešto dodaš, obrišeš ili presložiš), React po ključevima zna koja stavka je koja, pa ažurira samo ono što se zaista promenilo.

Dobar ključ je:

- **jedinstven** među braćom u istoj listi (dva termina ne smeju imati isti \`key\`),
- **stabilan**: ista stavka ima isti ključ pri svakom crtanju.

Najbolji kandidat je skoro uvek **\`id\` iz podataka**: \`booking.id\`, \`subscription.id\`. Ako nema \`id\`-ja, može i nešto drugo što je jedinstveno, kao kod Looply-ja gde je ključ ukupnog iznosa \`sum.currency\` (po jedan red za svaku valutu).`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zašto ne indeks?",
      md: "`items.map((x, i) => <li key={i}>…)` ućutka upozorenje, ali indeks nije ime stavke, nego **mesto** u listi. Kad dodaš novi element na vrh, svi indeksi se pomere, pa React misli da je prva stavka i dalje ista, samo sa drugim tekstom. Ako stavke imaju svoj state (otkucan tekst, otvoren meni, štiklirano polje), on ostane na pogrešnom redu. `Math.random()` je još gori: novi ključ pri svakom crtanju znači da React svaki put baci staru stavku i napravi novu.",
    },
    {
      kind: "playground",
      id: "react-liste-peskovnik",
      title: "Uhvati bag sa indeksom",
      prompt:
        "Upiši napomenu u polje pored **Ane**, pa klikni **Dodaj na vrh**. Dok je kvačica uključena (`key` je indeks), tvoja napomena ostaje u prvom redu, kod pogrešnog člana. Isključi kvačicu (`key` je `id`), probaj ponovo i gledaj kako napomena putuje zajedno sa Anom.",
      lang: "tsx",
      code: `import { useState } from "react"

interface Clan {
  id: number
  ime: string
}

export default function App() {
  const [clanovi, setClanovi] = useState<Clan[]>([
    { id: 1, ime: "Ana" },
    { id: 2, ime: "Marko" },
  ])
  const [kljucJeIndeks, setKljucJeIndeks] = useState(true)

  const dodajNaVrh = () => {
    const novi = { id: Date.now(), ime: "Novi član " + clanovi.length }
    setClanovi([novi, ...clanovi])
  }

  return (
    <div className="stack">
      <label>
        <input
          type="checkbox"
          checked={kljucJeIndeks}
          onChange={(e) => setKljucJeIndeks(e.target.checked)}
        />
        key = indeks
      </label>
      <button onClick={dodajNaVrh}>Dodaj na vrh</button>
      <ul>
        {clanovi.map((clan, i) => (
          <li key={kljucJeIndeks ? i : clan.id} className="row">
            <strong>{clan.ime}</strong>
            <input placeholder="napomena" />
          </li>
        ))}
      </ul>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Prvo pripremi podatke, pa crtaj

Retko kad crtaš niz baš onakav kakav stiže. Obično treba samo deo (termini ovog studija), i to nekim redom (od najranijeg). To radiš **običnim JavaScriptom u telu komponente**, pre \`return\`-a. Ovako to radi ekran sa rezervacijama u ReformStudiju:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/screens/BookingsScreen.tsx (linije 45–52)",
      code: `  if (!studio) return null

  const mine = bookings.filter((b) => b.studioId === studio.id)
  const upcoming = mine.filter((b) => isUpcoming(b, now)).sort(byStart)
  const past = mine
    .filter((b) => !isUpcoming(b, now))
    .sort(byStart)
    .reverse()`,
      highlight: [1, 3, 4],
      caption:
        "Prvo **rani izlaz** ako studio nije izabran, pa tri izvedena niza: moje rezervacije, buduće (od najranije) i prošle (od najnovije). Ništa od ovoga nije state: računa se iznova pri svakom crtanju.",
    },
    {
      kind: "prose",
      md: `Ovde se vide sva tri alata koja znaš iz JavaScript modula: \`.filter()\` bira, \`.sort()\` ređa, \`.reverse()\` okreće. Pošto \`.filter()\` vraća **novi** niz, \`.sort()\` posle njega ne dira originalne podatke iz store-a.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Pazi: sort menja niz",
      md: "`.sort()` i `.reverse()` menjaju niz **na licu mesta**. `props.termini.sort(...)` bi presložio niz koji ti je neko drugi dao (props ili state), a to je u Reactu zabranjeno. Ako pre `sort`-a nema `filter`-a, napravi kopiju: `[...termini].sort(...)`, ili koristi noviji `termini.toSorted(...)` koji uvek vraća novi niz.",
    },
    {
      kind: "prose",
      md: `### Uslovno crtanje: tri alata

JSX ne prihvata \`if\` unutar \`{ }\`, jer \`if\` nije izraz. Zato se koriste tri obrasca, svaki za svoju situaciju:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Uslovi.tsx",
      code: `function Termin({ termin, korisnik }: Props) {
  // 1. Rani izlaz: nema podataka, nema ni komponente
  if (!korisnik) return null

  return (
    <div className="card">
      <h3>{termin.naziv}</h3>

      {/* 2. && : prikaži ILI ništa */}
      {termin.popunjen && <span className="badge">Popunjeno</span>}

      {/* 3. Ternarni operator: ovo ILI ono */}
      {termin.rezervisan ? <button>Otkaži</button> : <button>Rezerviši</button>}
    </div>
  )
}`,
      highlight: [3, 10, 13],
      caption:
        "`return null` znači \"ne crtaj ništa\". `uslov && <X />` crta `<X />` samo kad je uslov tačan. `uslov ? <A /> : <B />` bira jedno od dva.",
    },
    {
      kind: "prose",
      md: `Kako da izabereš:

- **\`if (…) return null\`** kad cela komponenta nema smisla bez nečega. BookingsScreen ne može ništa da prikaže bez studija, pa odmah izlazi.
- **\`&&\`** kad je druga opcija "ništa": bedž, poruka o grešci, opcioni opis.
- **\`? :\`** kad postoje dve verzije istog mesta: dugme "Otkaži" ili "Rezerviši", lista ili poruka da je lista prazna.`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Looply · src/app/(tabs)/calendar.tsx (linije 193–199)",
      code: `          {dayPayments.length > 0 ? (
            dayPayments.map((payment) => <PaymentRow key={payment.key} payment={payment} today={today} />)
          ) : (
            <AppText variant="callout" tone="secondary" style={styles.inset}>
              {t('calendar.noPaymentsDay')}
            </AppText>
          )}`,
      caption:
        "Looply u kalendaru: ako izabrani dan ima plaćanja, crta po jedan `PaymentRow` za svako, a ako nema, poruku da tog dana nema plaćanja. `AppText` je React Native verzija `<p>`-a.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zamka sa nulom: `0 &&`",
      md: "`{termini.length && <Lista />}` izgleda logično, ali kad je lista prazna, `termini.length` je `0`. Izraz `0 && …` vraća baš `0`, a React **brojeve crta**, pa se na ekranu pojavi usamljena nula. `false`, `null` i `undefined` React preskače, ali `0` ne. Zato uslov uvek pretvori u pravi `boolean`: `termini.length > 0 && …`.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/screens/BookingsScreen.tsx",
      lang: "tsx",
      startLine: 94,
      intro:
        "Ovo je srce ekrana \"Moji termini\": kartica \"Predstojeći\" sa listom rezervacija i praznim stanjem. Tu je skoro sve iz ove lekcije na jednom mestu. Duge klase su Tailwind, o njima u modulu Stil i stanje.",
      code: `        <div key={tab} className="mt-5 animate-screen-in space-y-4">
          {tab === 'upcoming' && (
            <>
              {upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  title={typeLabel(studio, booking.trainingType)}
                  now={now}
                  onCancel={() => setCancelTarget(booking)}
                  onReschedule={() =>
                    navigate(
                      scheduleUrl({
                        reschedule: booking.id,
                        day: dayKey(new Date(booking.startsAt)),
                      }),
                    )
                  }
                />
              ))}
              {upcoming.length === 0 && (
                <EmptyState
                  icon={CalendarHeart}
                  title={t.bookings.emptyUpcomingTitle}
                  body={t.bookings.emptyUpcomingBody}
                  action={
                    <ButtonLink to={ROUTES.schedule}>{t.bookings.emptyUpcomingCta}</ButtonLink>
                  }
                />
              )}
            </>
          )}
`,
      steps: [
        {
          lines: 1,
          md: "`key={tab}` na elementu koji **nije** u listi. Trik: kad se ključ promeni (klik na drugu karticu), React smatra da je to potpuno nov element, pa ga ponovo napravi i animacija ulaska (`animate-screen-in`) krene iznova. Promena ključa = nova komponenta od nule.",
        },
        {
          lines: [2, 3],
          md: "`tab === 'upcoming' && (…)`: ceo blok se crta samo dok je izabrana kartica \"Predstojeći\". Prazan tag `<>` je Fragment, jer `&&` sme da vrati samo jedan element, a ovde ih ima dva (lista i prazno stanje).",
        },
        {
          lines: [4, 6],
          md: "Klasičan `.map()`: za svaku rezervaciju po jedan `BookingCard`. Ključ je `booking.id`, stabilan i jedinstven, pravo iz baze.",
        },
        {
          lines: [10, 18],
          md: "Svaka kartica dobija svoje funkcije. Arrow funkcija **pamti** `booking` iz svog kruga `.map()`-a, pa dugme \"Otkaži\" na trećoj kartici zna da otkazuje baš treću rezervaciju.",
        },
        {
          lines: [21, 30],
          md: "Prazno stanje. Uslov je `upcoming.length === 0`, dakle pravi `boolean`, pa nema zamke sa nulom. Korisnik bez rezervacija ne vidi prazan ekran, nego objašnjenje i dugme koje vodi na raspored.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Prazna stanja nisu sitnica

Prazna lista je **najčešći** ekran koji novi korisnik vidi: tek se registrovao i još nema nijednu rezervaciju. Ako tada vidi belu površinu, misli da aplikacija ne radi. Zato ReformStudio ima posebnu komponentu \`EmptyState\` (iz prve lekcije) sa ikonicom, naslovom, objašnjenjem i dugmetom "šta sad".

Pravilo: **svaka lista koja može biti prazna treba da ima prazno stanje.** I lista koja se tek učitava treba svoju poruku, o tome u sledećoj lekciji.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/FilterChips.tsx",
      lang: "tsx",
      startLine: 29,
      intro:
        "Filteri u jednom redu (\"Svi\", \"Aktivni\", \"Istekli\"…). Komponenta ne zna unapred koliko ima čipova: crta ih iz niza koji dobije kroz props.",
      code: `    {chips.map(({ id, label: chipLabel, count }) => (
      <button
        key={id}
        type="button"
        aria-pressed={value === id}
        onClick={() => onChange(id)}
        className={cn(
          // 36 px visine, a dodirna površina 44 px (UX-42); red ima py-1 za proširenje.
          'relative after:absolute after:inset-x-0 after:-inset-y-1 flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors duration-300',
          value === id
            ? 'border-ink-900 bg-ink-900 font-bold text-brand-50'
            : 'border-ink-900/10 bg-white font-semibold text-ink-700',
        )}
      >
        {chipLabel}
        {count !== undefined && (
          <span
            className={cn('text-xs tabular-nums', value === id ? 'text-brand-300' : 'text-ink-500')}
          >
            {count}
          </span>
        )}
      </button>
    ))}
`,
      steps: [
        {
          lines: 1,
          md: "Destrukturiranje odmah u parametru: iz svakog čipa uzima `id`, `label` (preimenovan u `chipLabel`, jer je `label` već zauzet propom cele grupe) i opcioni `count`.",
        },
        {
          lines: [3, 6],
          md: "`key={id}`: ključ je id filtera (`'all'`, `'active'`…), jedinstven i stabilan. `aria-pressed` govori čitaču ekrana koji je čip uključen, a klik javlja roditelju koji je izabran.",
        },
        {
          lines: [10, 12],
          md: "Ternarni operator unutar klasa: izabran čip je taman, ostali su beli. Isti obrazac kao u JSX-u, samo što bira string umesto elementa.",
        },
        {
          lines: [16, 22],
          md: "`count !== undefined && …`, a ne `count && …`. Da piše `count &&`, filter sa nula članova bi umesto lepo stilizovanog broja prikazao golu nulu bez stila. Ovako se i `0` prikaže kako treba, a broj izostane samo kad ga zaista nema.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "react-liste-1",
      title: "Lista termina",
      lang: "tsx",
      prompt: `U nizu \`termini\` su tri današnja termina. Nacrtaj ih kao listu: unutar \`<ul>\` po jedan \`<li>\` za svaki termin, sa tekstom u obliku **Pilates · 09:00** (naziv, razmak, tačka u sredini, razmak, vreme).

Ne zaboravi \`key\`.`,
      starter: `const termini = [
  { id: "t1", naziv: "Pilates", vreme: "09:00" },
  { id: "t2", naziv: "Reformer", vreme: "18:00" },
  { id: "t3", naziv: "Mat", vreme: "19:30" },
]

export default function App() {
  return (
    <div className="card">
      <h2>Danas u studiju</h2>
      <ul>
        {/* Ovde nacrtaj termine pomoću termini.map(...) */}
      </ul>
    </div>
  )
}
`,
      solution: `const termini = [
  { id: "t1", naziv: "Pilates", vreme: "09:00" },
  { id: "t2", naziv: "Reformer", vreme: "18:00" },
  { id: "t3", naziv: "Mat", vreme: "19:30" },
]

export default function App() {
  return (
    <div className="card">
      <h2>Danas u studiju</h2>
      <ul>
        {termini.map((termin) => (
          <li key={termin.id}>
            {termin.naziv} · {termin.vreme}
          </li>
        ))}
      </ul>
    </div>
  )
}
`,
      tests: [
        {
          name: "crta tri stavke liste",
          code: `await render(App)
expect(screen.getAllByRole("listitem")).toHaveLength(3)`,
        },
        {
          name: "prva stavka je \"Pilates · 09:00\"",
          code: `await render(App)
expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Pilates · 09:00")`,
        },
        {
          name: "poslednja stavka je \"Mat · 19:30\"",
          code: `await render(App)
expect(screen.getByText("Mat · 19:30")).toBeInTheDocument()`,
        },
      ],
      hints: [
        "Unutar `<ul>` otvori vitičaste zagrade i pozovi `termini.map((termin) => ( … ))`.",
        "Funkcija vraća jedan `<li>`: `<li key={termin.id}>{termin.naziv} · {termin.vreme}</li>`.",
        "Ako ne vidiš ništa, proveri zagrade posle strelice: `=> ( … )` vraća JSX, a `=> { … }` bez `return` ne vraća ništa.",
      ],
      explanation:
        "To je obrazac koji ćeš pisati stotinama puta: `niz.map(x => <Stavka key={x.id} … />)`. Ključ je `id` iz podataka, jer je jedinstven i ne menja se kad se lista presloži.",
    },
    {
      kind: "exercise",
      id: "react-liste-2",
      title: "Samo aktivne rezervacije",
      lang: "tsx",
      preview: "App",
      prompt: `Komponenta \`Rezervacije\` dobija niz rezervacija kroz props. Sada crta sve redom, a treba da:

1. prikaže **samo aktivne** (\`status === "aktivna"\`), **sortirane po vremenu** (najranija prva; vreme je string \`"HH:MM"\`, pa \`a.vreme.localeCompare(b.vreme)\` radi posao),
2. u naslovu piše broj aktivnih, npr. **Aktivne: 2**,
3. kad nema nijedne aktivne, umesto liste prikaže paragraf **Nemaš nijednu aktivnu rezervaciju.**,
4. red **Otkazanih: N** prikaže **samo kad ih ima**. Pazi na zamku sa nulom!`,
      starter: `interface Rezervacija {
  id: string
  naziv: string
  vreme: string
  status: "aktivna" | "otkazana"
}

export function Rezervacije({ rezervacije }: { rezervacije: Rezervacija[] }) {
  const otkazane = rezervacije.filter((r) => r.status === "otkazana")

  return (
    <div className="card">
      <h2>Aktivne: ?</h2>
      <ul>
        {rezervacije.map((r) => (
          <li key={r.id}>
            {r.vreme} · {r.naziv}
          </li>
        ))}
      </ul>
      {otkazane.length && <p className="muted">Otkazanih: {otkazane.length}</p>}
    </div>
  )
}

export default function App() {
  return (
    <Rezervacije
      rezervacije={[
        { id: "r1", naziv: "Reformer", vreme: "18:00", status: "aktivna" },
        { id: "r2", naziv: "Pilates", vreme: "09:00", status: "aktivna" },
        { id: "r3", naziv: "Mat", vreme: "12:00", status: "otkazana" },
      ]}
    />
  )
}
`,
      solution: `interface Rezervacija {
  id: string
  naziv: string
  vreme: string
  status: "aktivna" | "otkazana"
}

export function Rezervacije({ rezervacije }: { rezervacije: Rezervacija[] }) {
  const otkazane = rezervacije.filter((r) => r.status === "otkazana")
  const aktivne = rezervacije
    .filter((r) => r.status === "aktivna")
    .sort((a, b) => a.vreme.localeCompare(b.vreme))

  return (
    <div className="card">
      <h2>Aktivne: {aktivne.length}</h2>
      {aktivne.length > 0 ? (
        <ul>
          {aktivne.map((r) => (
            <li key={r.id}>
              {r.vreme} · {r.naziv}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nemaš nijednu aktivnu rezervaciju.</p>
      )}
      {otkazane.length > 0 && <p className="muted">Otkazanih: {otkazane.length}</p>}
    </div>
  )
}

export default function App() {
  return (
    <Rezervacije
      rezervacije={[
        { id: "r1", naziv: "Reformer", vreme: "18:00", status: "aktivna" },
        { id: "r2", naziv: "Pilates", vreme: "09:00", status: "aktivna" },
        { id: "r3", naziv: "Mat", vreme: "12:00", status: "otkazana" },
      ]}
    />
  )
}
`,
      tests: [
        {
          name: "prikazuje samo aktivne, od najranije",
          code: `await render(App)
const stavke = screen.getAllByRole("listitem")
expect(stavke).toHaveLength(2)
expect(stavke[0]).toHaveTextContent("09:00 · Pilates")
expect(stavke[1]).toHaveTextContent("18:00 · Reformer")`,
        },
        {
          name: "naslov prikazuje broj aktivnih",
          code: `await render(App)
expect(screen.getByRole("heading")).toHaveTextContent("Aktivne: 2")
expect(screen.getByText("Otkazanih: 1")).toBeInTheDocument()`,
        },
        {
          name: "bez aktivnih prikazuje prazno stanje",
          code: `await render(Rezervacije, { rezervacije: [{ id: "x", naziv: "Mat", vreme: "12:15", status: "otkazana" }] })
expect(screen.queryAllByRole("listitem")).toHaveLength(0)
expect(screen.getByText("Nemaš nijednu aktivnu rezervaciju.")).toBeInTheDocument()`,
        },
        {
          name: "bez otkazanih nema ni reda \"Otkazanih\" ni usamljene nule",
          code: `const { container } = await render(Rezervacije, {
  rezervacije: [{ id: "y", naziv: "Pilates", vreme: "18:15", status: "aktivna" }],
})
expect(screen.queryAllByText(/Otkazanih/)).toHaveLength(0)
expect(container.textContent).not.toContain("0")`,
        },
      ],
      hints: [
        "Napravi izveden niz pre `return`-a: `const aktivne = rezervacije.filter(…).sort(…)`. Pošto `filter` vraća novi niz, `sort` posle njega je bezbedan.",
        "Za listu ili prazno stanje koristi ternarni operator: `{aktivne.length > 0 ? <ul>…</ul> : <p>…</p>}`.",
        "Starter ima zamku: `otkazane.length && …` kad je dužina `0` crta nulu. Promeni uslov u `otkazane.length > 0 && …`.",
      ],
      explanation:
        "Isti redosled kao u BookingsScreen-u: prvo izvedeš nizove iz podataka (filter, sort), pa crtaš. Ternarni operator bira između liste i praznog stanja, a `> 0` pretvara broj u pravi `boolean` da nula ne procuri na ekran.",
    },
    {
      kind: "exercise",
      id: "react-liste-3",
      title: "Filter čipovi",
      lang: "tsx",
      prompt: `Napravi red filtera iznad rasporeda, kao \`FilterChips\` u ReformStudiju:

1. Iz niza \`CIPOVI\` nacrtaj po jedno dugme za svaki čip (tekst dugmeta je \`label\`). Izabrano dugme ima \`aria-pressed={true}\`, ostala \`false\`.
2. Klik na dugme menja \`filter\`.
3. Lista prikazuje samo termine izabranog tipa (\`"sve"\` prikazuje sve).
4. Ako za izabrani filter nema termina, umesto liste prikaži **Nema termina za ovaj filter.**`,
      starter: `import { useState } from "react"

type Tip = "reformer" | "mat" | "yoga"
type Filter = "sve" | Tip

interface Termin {
  id: string
  naziv: string
  tip: Tip
  vreme: string
}

const TERMINI: Termin[] = [
  { id: "t1", naziv: "Reformer početni", tip: "reformer", vreme: "09:00" },
  { id: "t2", naziv: "Mat pilates", tip: "mat", vreme: "10:30" },
  { id: "t3", naziv: "Reformer napredni", tip: "reformer", vreme: "18:00" },
  { id: "t4", naziv: "Mat za leđa", tip: "mat", vreme: "19:30" },
]

const CIPOVI: { id: Filter; label: string }[] = [
  { id: "sve", label: "Sve" },
  { id: "reformer", label: "Reformer" },
  { id: "mat", label: "Mat" },
  { id: "yoga", label: "Yoga" },
]

export default function App() {
  const [filter, setFilter] = useState<Filter>("sve")

  return (
    <div className="stack">
      <div className="row">
        {/* 1. Ovde nacrtaj dugmad iz CIPOVI */}
      </div>
      <ul>
        {TERMINI.map((t) => (
          <li key={t.id}>
            {t.vreme} · {t.naziv}
          </li>
        ))}
      </ul>
    </div>
  )
}
`,
      solution: `import { useState } from "react"

type Tip = "reformer" | "mat" | "yoga"
type Filter = "sve" | Tip

interface Termin {
  id: string
  naziv: string
  tip: Tip
  vreme: string
}

const TERMINI: Termin[] = [
  { id: "t1", naziv: "Reformer početni", tip: "reformer", vreme: "09:00" },
  { id: "t2", naziv: "Mat pilates", tip: "mat", vreme: "10:30" },
  { id: "t3", naziv: "Reformer napredni", tip: "reformer", vreme: "18:00" },
  { id: "t4", naziv: "Mat za leđa", tip: "mat", vreme: "19:30" },
]

const CIPOVI: { id: Filter; label: string }[] = [
  { id: "sve", label: "Sve" },
  { id: "reformer", label: "Reformer" },
  { id: "mat", label: "Mat" },
  { id: "yoga", label: "Yoga" },
]

export default function App() {
  const [filter, setFilter] = useState<Filter>("sve")
  const vidljivi = filter === "sve" ? TERMINI : TERMINI.filter((t) => t.tip === filter)

  return (
    <div className="stack">
      <div className="row">
        {CIPOVI.map((cip) => (
          <button
            key={cip.id}
            className={filter === cip.id ? "" : "secondary"}
            aria-pressed={filter === cip.id}
            onClick={() => setFilter(cip.id)}
          >
            {cip.label}
          </button>
        ))}
      </div>
      {vidljivi.length > 0 ? (
        <ul>
          {vidljivi.map((t) => (
            <li key={t.id}>
              {t.vreme} · {t.naziv}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Nema termina za ovaj filter.</p>
      )}
    </div>
  )
}
`,
      tests: [
        {
          name: "crta po jedno dugme za svaki čip",
          code: `await render(App)
expect(screen.getAllByRole("button")).toHaveLength(4)
expect(screen.getByRole("button", { name: "Sve" }).getAttribute("aria-pressed")).toBe("true")
expect(screen.getByRole("button", { name: "Mat" }).getAttribute("aria-pressed")).toBe("false")`,
        },
        {
          name: "klik na \"Reformer\" prikazuje samo reformer termine",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Reformer" }))
const stavke = screen.getAllByRole("listitem")
expect(stavke).toHaveLength(2)
expect(stavke[1]).toHaveTextContent("Reformer napredni")
expect(screen.getByRole("button", { name: "Reformer" }).getAttribute("aria-pressed")).toBe("true")`,
        },
        {
          name: "filter bez termina prikazuje prazno stanje",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Yoga" }))
expect(screen.queryAllByRole("listitem")).toHaveLength(0)
expect(screen.getByText("Nema termina za ovaj filter.")).toBeInTheDocument()`,
        },
        {
          name: "\"Sve\" vraća sve termine",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Mat" }))
await click(screen.getByRole("button", { name: "Sve" }))
expect(screen.getAllByRole("listitem")).toHaveLength(4)`,
        },
      ],
      hints: [
        "Dugmad: `CIPOVI.map((cip) => <button key={cip.id} aria-pressed={filter === cip.id} onClick={() => setFilter(cip.id)}>{cip.label}</button>)`.",
        "Pre `return`-a izvedi listu: `const vidljivi = filter === \"sve\" ? TERMINI : TERMINI.filter((t) => t.tip === filter)`, pa crtaj `vidljivi` umesto `TERMINI`.",
        "Za prazno stanje: `{vidljivi.length > 0 ? <ul>…</ul> : <p>Nema termina za ovaj filter.</p>}`.",
      ],
      explanation:
        "State čuva samo **izbor** (`filter`), a vidljiva lista se izvodi iz njega pri svakom crtanju. Ne treba ti poseban state za filtrirani niz: on bi samo mogao da se raskorači sa izborom. Isto tako radi i `FilterChips`: roditelj drži `value`, a čipovi se crtaju iz niza.",
    },
    {
      kind: "quiz",
      id: "react-liste-quiz",
      questions: [
        {
          q: "Šta je najbolji `key` za karticu rezervacije u listi?",
          options: [
            "`booking.id` iz baze",
            "Indeks iz `.map((b, i) => …)`",
            "`Math.random()`",
            "Naziv treninga, npr. `\"Pilates\"`",
          ],
          answer: 0,
          why: "Ključ mora biti jedinstven i stabilan. `id` je oba. Indeks se pomera kad se lista promeni, `Math.random()` je nov pri svakom crtanju, a dva termina mogu imati isti naziv.",
        },
        {
          q: "Šta se prikaže kad je `poruke` prazan niz?",
          code: `<div>{poruke.length && <Lista poruke={poruke} />}</div>`,
          codeLang: "tsx",
          options: ["Cifra `0`", "Ništa", "Prazna lista", "Greška"],
          answer: 0,
          why: "`0 && …` vraća `0`, a React brojeve crta. Ispravno je `poruke.length > 0 && …`.",
        },
        {
          q: "Zašto ova lista ostaje prazna?",
          code: `{termini.map((t) => {
  <li key={t.id}>{t.naziv}</li>
})}`,
          codeLang: "tsx",
          options: [
            "Vitičaste zagrade posle strelice traže `return`, a njega nema",
            "`key` mora biti broj",
            "`.map()` ne radi u JSX-u",
            "Nedostaje `<ul>` oko `.map()`-a",
          ],
          answer: 0,
          why: "`=> { … }` je telo funkcije: bez `return` vraća `undefined`. Uz obične zagrade, `=> ( … )`, JSX se vraća automatski.",
        },
        {
          q: "Komponenta nema šta da prikaže dok korisnik nije prijavljen. Koji je najčistiji način?",
          options: [
            "`if (!korisnik) return null` na početku komponente",
            "`{korisnik && …}` oko svakog elementa posebno",
            "Sakriti je CSS-om",
            "Baciti grešku",
          ],
          answer: 0,
          why: "Rani izlaz sa `return null` kaže \"ova komponenta sad ne crta ništa\" na jednom mestu, kao `if (!studio) return null` u BookingsScreen-u.",
        },
        {
          q: "Zašto je `props.termini.sort(…)` u telu komponente loša ideja?",
          options: [
            "`sort` menja originalni niz, a props se ne smeju menjati",
            "`sort` ne radi sa objektima",
            "React zabranjuje metode nizova u komponentama",
            "Sortiranje mora da ide u CSS",
          ],
          answer: 0,
          why: "`sort` i `reverse` rade na licu mesta. Napravi kopiju (`[...termini].sort(…)`), koristi `toSorted`, ili sortiraj rezultat `filter`-a, koji je već nov niz.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-liste-1",
      front: "Kako se niz pretvara u listu elemenata u JSX-u?",
      back: "`{niz.map((x) => <li key={x.id}>{x.naziv}</li>)}`. `.map()` vraća niz JSX elemenata, a React ga crta.",
    },
    {
      id: "fc-react-liste-2",
      front: "Kakav treba da bude `key`?",
      back: "Jedinstven među braćom i stabilan između crtanja. Najčešće `id` iz podataka. Indeks samo ako se lista nikad ne menja.",
    },
    {
      id: "fc-react-liste-3",
      front: "Tri načina za uslovno crtanje?",
      back: "`if (…) return null` (cela komponenta), `uslov && <X />` (ovo ili ništa), `uslov ? <A /> : <B />` (ovo ili ono).",
    },
    {
      id: "fc-react-liste-4",
      front: "Zašto `{lista.length && <X />}` ponekad prikaže `0`?",
      back: "`0 && …` vraća `0`, a React crta brojeve. Piši `lista.length > 0 && <X />`.",
    },
    {
      id: "fc-react-liste-5",
      front: "Šta se desi kad se promeni `key` elementa?",
      back: "React ga smatra novim elementom: staru komponentu baci (sa svim njenim state-om) i napravi novu od nule.",
    },
  ],
};

export default lesson;
