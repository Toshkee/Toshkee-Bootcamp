import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "react-router",
  title: "React Router: od ekrana do ekrana",
  summary:
    "Kako ReformStudio prelazi sa ekrana na ekran bez osvežavanja stranice: tabela ruta, `Link` i `NavLink` za tab bar, `useNavigate`, parametri u adresi, layout-i sa `Outlet`-om i čuvari ruta.",
  minutes: 25,
  projects: ["ReformStudio", "PlazaHome", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Otvori ReformStudio i dodirni tab **Raspored**. Adresa se promeni iz \`/pocetna\` u \`/raspored\`, ekran se zameni, a stranica se **ne učitava ponovo**: nema belog bljeska, tab bar ostaje na mestu, a podaci iz store-a su i dalje tu. Pritisni strelicu nazad u browseru i vratiš se na Početnu, opet bez učitavanja.

To je **rutiranje na klijentu** (client-side routing). ReformStudio je **SPA** (Single Page Application): server šalje samo jednu HTML stranicu, \`index.html\`, i jedan JavaScript paket. Sve "stranice" su zapravo React komponente, a biblioteka **React Router** gleda adresu i odlučuje koju od njih da nacrta.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao televizor i kanali",
      md: "Televizor je jedan (`index.html`), a adresa je broj kanala. Kad promeniš kanal, ne kupuješ novi televizor: isti ekran samo prikaže drugi program. React Router je prijemnik koji pročita broj kanala (`/raspored`) i pusti odgovarajuću emisiju (`<ScheduleScreen />`).",
    },
    {
      kind: "prose",
      md: `### Šta se dešava ispod haube

Klasičan sajt na svaki klik traži od servera novu HTML stranicu. Browser baci sve što je imao u memoriji i crta od nule.

U SPA-u se koristi **History API** browsera: JavaScript može da promeni adresu (\`history.pushState\`) **bez ikakvog zahteva serveru**. React Router na klik promeni adresu, pa ponovo nacrta samo deo ekrana koji od nje zavisi. Sve ostalo (Zustand store, veza sa Firebase-om, tab bar) ostaje netaknuto.

Jedna posledica: kad neko otvori \`/raspored\` direktno (osveži stranicu ili klikne link iz mejla), server mora da vrati isti \`index.html\`, a ne grešku 404. Zato u ReformStudijevom \`firebase.json\` stoji ovaj red:`,
    },
    {
      kind: "code",
      lang: "json",
      filename: "firebase.json",
      code: `"rewrites": [{ "source": "**", "destination": "/index.html" }],`,
      caption:
        "\"Za bilo koju adresu (`**`) vrati `index.html`.\" Kad se aplikacija učita, React Router pročita adresu i sam nacrta pravi ekran.",
    },
    {
      kind: "prose",
      md: `### Tri osnovna dela

Najmanja tabela ruta izgleda ovako:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "App.tsx",
      code: `import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pocetna" element={<HomeScreen />} />
        <Route path="/raspored" element={<ScheduleScreen />} />
        <Route path="/profil" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  )
}`,
      highlight: [5, 6, 7],
    },
    {
      kind: "prose",
      md: `- **\`<BrowserRouter>\`** obmotava celu aplikaciju i povezuje React sa adresnom trakom. Sve što koristi rutiranje (linkovi, hook-ovi) mora biti **unutar** njega.
- **\`<Routes>\`** pogleda trenutnu adresu i između svoje dece izabere **jednu** rutu koja joj odgovara.
- **\`<Route path element>\`** znači: "kad je adresa \`path\`, nacrtaj \`element\`". \`element\` je JSX (\`<HomeScreen />\`), a ne samo ime komponente.

Redosled ruta nije bitan: React Router sam bira najprecizniju. Ako postoje \`/termini/novi\` i \`/termini/:id\`, adresa \`/termini/novi\` uvek ide na prvu, bez obzira na to koja je napisana gore.`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "BrowserRouter ili MemoryRouter?",
      md: "`BrowserRouter` čita i piše pravu adresu u browseru, i to koristi ReformStudio. `MemoryRouter` čuva istoriju **samo u memoriji**, pa se adresna traka ne menja. Koristi se u testovima i u pregledima, kao što su vežbe u ovom bootcampu (pregled radi u iframe-u i ne sme da dira pravu adresu). Sve ostalo (`Routes`, `Link`, hook-ovi) radi potpuno isto. Kad treba da počne na određenoj adresi, `MemoryRouter` dobija `initialEntries={[\"/raspored\"]}`.",
    },
    {
      kind: "prose",
      md: `### Putanje na jednom mestu

Da li je Raspored na \`/raspored\` ili na \`/termini\`? Ako je putanja upisana kao string na deset mesta, jedna slovna greška (\`/rasporde\`) pravi link koji vodi nikuda, a TypeScript to ne vidi. Zato ReformStudio drži sve putanje u jednom objektu:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "src/lib/routes.ts",
      code: `export const ROUTES = {
  /** Ulazni ekran: izbor studija. */
  entry: '/',
  login: '/prijava',
  register: '/registracija',
  /** Link iz mejla za novu lozinku (Firebase → Templates → action URL), PLAN 7.5. */
  resetPassword: '/nova-lozinka',
  /** Obavještenje o privatnosti; otvara se i bez prijave i bez izabranog studija (PLAN 8.8). */
  privacy: '/privatnost',
  home: '/pocetna',
  schedule: '/raspored',
  bookings: '/termini',
  profile: '/profil',
  notifications: '/obavjestenja',
  weight: '/kilaza',
} as const`,
      highlight: [10, 11, 12, 13, 16],
      caption:
        "`as const` pretvara vrednosti u tačne tipove (`'/raspored'`, a ne bilo koji `string`). Svuda u aplikaciji piše `ROUTES.schedule`: kad se putanja promeni, menja se na jednom mestu, a pogrešno ime (`ROUTES.shedule`) TypeScript odmah podvuče.",
    },
    {
      kind: "prose",
      md: `### Link: prelazak bez učitavanja

U običnom HTML-u link je \`<a href="/raspored">\`. U SPA-u je to zamka: klik na \`<a>\` kaže browseru da učita novu stranicu sa servera, pa se cela aplikacija pokreće ispočetka.

Zato React Router ima komponentu **\`<Link>\`**:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `import { Link } from "react-router-dom"

<Link to={ROUTES.schedule}>Raspored</Link>`,
      caption:
        "`Link` u DOM-u i dalje crta pravi `<a href=\"/raspored\">`, pa rade desni klik, \"otvori u novom tabu\" i čitači ekrana. Razlika je samo u kliku: `Link` zaustavi browser (`preventDefault`) i umesto učitavanja promeni adresu kroz History API.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: <a href> unutar aplikacije",
      md: "Kod izgleda ispravno i čak radi, ali svaki klik ponovo učita celu aplikaciju: Zustand store se isprazni, prijava se proverava iznova, uvodni ekran se opet vidi. Ako primetiš bljesak pri prelasku sa ekrana na ekran, potraži `<a href>` koji treba da bude `<Link to>`. Za spoljne adrese (`https://…`, `mailto:`) običan `<a>` je ispravan izbor.",
    },
    {
      kind: "prose",
      md: `### NavLink: link koji zna gde si

Tab bar ima jedan zahtev više: tab ekrana na kom se nalaziš treba da izgleda drugačije. Za to postoji **\`<NavLink>\`**. To je isti \`Link\`, ali uvek zna da li je **aktivan**, odnosno da li trenutna adresa odgovara njegovom \`to\`:

- aktivnom linku sam doda klasu \`active\` i atribut \`aria-current="page"\` (čitač ekrana kaže "trenutna stranica")
- \`className\` i \`children\` mogu da budu **funkcije** koje dobijaju \`{ isActive }\`, pa izgled biraš sam
- link je aktivan i na adresama **ispod** svoje: tab \`/raspored\` svetli i na \`/raspored/t1\`. Prop \`end\` to isključuje, pa je link aktivan samo na tačno svojoj adresi.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/TabBar.tsx",
      lang: "tsx",
      startLine: 48,
      intro:
        "Ovo je tab bar ReformStudija, ona plutajuća traka na dnu sa Početnom, Rasporedom, Terminima i Profilom. Svaki tab je jedan `NavLink`.",
      code: `        {tabs.map(({ to, label, icon: Icon, badge, badgeLabel }) => (
          <li key={to} className="min-w-0 flex-1">
            <NavLink
              to={to}
              // Dodir na tab na kojem si vraća na vrh, kao u nativnim aplikacijama; na vrhu
              // dodir radi kao i do sada (npr. Raspored se vraća na današnji dan).
              onClick={(event) => {
                if (pathname !== to || scrollY === 0) return
                event.preventDefault()
                scrollTo({ top: 0, behavior: scrollBehavior() })
              }}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[22px] py-1.5 transition-colors duration-300',
                  isActive ? 'bg-ink-900 text-brand-50' : 'text-ink-500 hover:text-ink-700',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2.25 : 1.9} />
`,
      steps: [
        {
          lines: [1, 2],
          md: "Tabovi stižu kao niz iz `AppShell`-a, npr. `{ to: ROUTES.home, label: t.tabs.home, icon: House }`. Putanja `to` je i `key`, jer je svaka putanja jedinstvena.",
        },
        {
          lines: [3, 4],
          md: "`<NavLink to={to}>`: link ka ekranu taba. Vrednost dolazi iz `ROUTES`, pa ovde nema nijednog ručno upisanog stringa.",
        },
        {
          lines: [5, 11],
          md: "Lep detalj: dodir na tab na kom si već, dok je ekran skrolovan, ne menja adresu. `event.preventDefault()` zaustavi navigaciju, a ekran se glatko vrati na vrh, kao u nativnim aplikacijama. To radi jer je `NavLink` ispod haube običan `<a>`, a klik na njega običan događaj.",
        },
        {
          lines: [12, 17],
          md: "`className` je **funkcija** koja dobija `{ isActive }`. Aktivan tab dobija tamnu pozadinu (`bg-ink-900 text-brand-50`), a ostali sivi tekst. `cn` je mala pomoćna funkcija koja spaja klase u jedan string.",
        },
        {
          lines: [19, 22],
          md: "I deca mogu da budu funkcija sa istim `{ isActive }`: aktivna ikonica dobija deblju liniju (`2.25` umesto `1.9`). Uz to, NavLink sam dodaje `aria-current=\"page\"`, pa čitač ekrana zna koji je tab trenutni.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### useNavigate: navigacija iz koda

\`Link\` služi kad korisnik **klikne na link**. Ali ekran često treba da se promeni **posle neke akcije**: prijava je uspela, rezervacija je sačuvana, studio je izabran. Tada nema linka, nego treba funkcija. To je hook **\`useNavigate\`**:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `const navigate = useNavigate()

navigate("/raspored")                    // idi na adresu (novi unos u istoriji)
navigate("/termini", { replace: true }) // idi, ali ZAMENI trenutni unos
navigate(-1)                             // korak nazad, kao strelica u browseru`,
      caption:
        "Iz lekcije o Tailwind-u već znaš `StudioPill`: `onClick={() => navigate(ROUTES.entry)}` vodi na izbor studija. To je najprostiji oblik.",
    },
    {
      kind: "prose",
      md: `### Push ili replace?

Istorija browsera je **gomila kartica**. \`navigate("/x")\` stavi novu karticu na vrh, a strelica nazad je skine. \`{ replace: true }\` ne dodaje karticu, nego **zameni** onu na vrhu, pa ekran sa kog se krenulo nestaje iz istorije.

Kada to treba? Kad bi povratak na prethodni ekran bio besmislen ili zbunjujući. ReformStudio posle rezervacije vodi na Moje termine ovako:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/components/SessionSheet.tsx",
      code: `  // Zamjenjuje unos termina u istoriji: „Nazad” iz Mojih termina vodi u raspored, ne u ovaj sheet.
  const goToBookings = () => {
    onClose()
    navigate(ROUTES.bookings, { replace: true })
  }`,
      highlight: [4],
      caption:
        "Komentar kaže tačno zašto: Nazad iz Mojih termina treba da vodi u raspored, a ne u sheet sa već rezervisanim terminom. Registracija radi isto: posle uspeha `navigate(ROUTES.login, { replace: true, … })`, da Nazad sa prijave ne vrati na formular koji je već poslat.",
    },
    {
      kind: "prose",
      md: `\`navigate(-1)\` ima jednu zamku: šta ako ekran nema "prethodni"? Kad se stranica otvori direktno (osvežavanjem ili linkom iz mejla), u istoriji nema ničega iz aplikacije. Zato ulazni ekran ReformStudija proverava pre nego što se vrati:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/screens/EntryScreen.tsx",
      code: `  const goBack = () => {
    if (!returnTo || !user) return
    select(returnTo)
    // Nazad na ekran sa kog je došao; bez istorije (npr. osvježena stranica) na Početnu.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate(homeRoute(user), { replace: true })
  }`,
      highlight: [5, 6, 7],
      caption:
        "`idx` je redni broj unosa koji React Router upisuje u istoriju. Ako je veći od nule, postoji ekran pre ovog i `navigate(-1)` ima gde da vrati. Ako nije, ide na Početnu, i to sa `replace`.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "navigate se ne poziva tokom crtanja",
      md: "`navigate(…)` ide u handler (`onClick`, posle `await` u `onSubmit`) ili u `useEffect`, nikad direktno u telo komponente. Ako odluka o preusmeravanju pada **dok se crta** (npr. korisnik nije prijavljen), vrati komponentu `<Navigate to={…} replace />`. O tome malo niže.",
    },
    {
      kind: "prose",
      md: `### Parametri u adresi: \`:id\`

Admin panel ReformStudija ima ekran za svakog člana. Ne postoji posebna ruta za svakog člana, nego **jedna** ruta sa promenljivim delom:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/admin/index.tsx",
      code: `const AdminArea = () => (
  <Routes>
    <Route element={<AdminShell />}>
      <Route path="clanovi" element={<MembersScreen />} />
      <Route path="clanovi/:uid" element={<MemberScreen />} />
      <Route path="raspored" element={<AdminScheduleScreen />} />
      <Route path="raspored/sablon" element={<TemplateScreen />} />
      <Route path="pozivi" element={<InvitesScreen />} />
      <Route path="pozivi/novi" element={<NewInviteScreen />} />
      <Route path="profil" element={<ProfileScreen />} />
      <Route path="obavjestenja" element={<AdminNotificationsScreen />} />
      <Route path="*" element={<Navigate to={ADMIN_ROUTES.members} replace />} />
    </Route>
  </Routes>
)`,
      highlight: [5],
      caption:
        "`clanovi/:uid` odgovara adresama `/admin/clanovi/mila`, `/admin/clanovi/x7Kq2`… Dvotačka znači \"ovde stoji bilo šta, i to se zove `uid`\". Putanje nemaju `/` na početku jer su **relativne**: nastavljaju se na `/admin/*` iz `App.tsx`.",
    },
    {
      kind: "prose",
      md: "Ekran detalja čita taj deo adrese hook-om **`useParams`**:",
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/admin/MemberScreen.tsx",
      code: `/** Detalj člana: kontakt, članarina po studiju, plan ishrane, kilaža, predstojeći termini. */
export const MemberScreen = () => {
  const { uid = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()`,
      highlight: [3],
      caption:
        "`useParams()` vraća objekat sa svim `:parametrima` rute. Vrednost je uvek **string**, ili `undefined` ako parametra nema, zato `= ''` kao podrazumevana vrednost. Kad treba broj, pretvori ga: `Number(id)`. Link ka ovom ekranu pravi pomoćna funkcija iz `routes.ts`: `ADMIN_ROUTES.member('mila')` vraća `'/admin/clanovi/mila'`.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Adresu može da upiše bilo ko",
      md: "`:uid` iz adrese ne mora da postoji u bazi: link je mogao da zastari, a neko je mogao i sam da ga izmisli. Zato `MemberScreen` traži člana sa `members.find((member) => member.id === uid)`, a ekran detalja uvek ima granu za \"nije pronađeno\". Bez nje bi `user.name` pukao na `undefined`.",
    },
    {
      kind: "prose",
      md: `### Query string: \`useSearchParams\`

Deo adrese posle \`?\` je **query string**: \`/raspored?dan=2026-10-23&termin=abc\`. On ne bira ekran, nego nosi **podešavanja** tog ekrana: izabran dan, tekst pretrage, filter. Čita se hook-om \`useSearchParams\`, koji liči na \`useState\`, samo što stanje živi u adresi:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/screens/ResetPasswordScreen.tsx",
      code: `export const ResetPasswordScreen = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const mode = params.get('mode')
  const code = params.get('oobCode') ?? ''`,
      highlight: [3, 4, 5],
      caption:
        "`params.get('mode')` vraća vrednost ili `null`. Ovaj ekran se otvara iz mejla za novu lozinku, a Firebase u link upisuje `?mode=resetPassword&oobCode=…`.",
    },
    {
      kind: "prose",
      md: `Zašto stanje u adresi, a ne u \`useState\`? Komentar iz ReformStudijevog \`MembersScreen.tsx\` to kaže u jednoj rečenici: pretraga i filter su u adresi, *pa povratak iz detalja člana vraća istu listu*. \`useState\` nestaje čim ekran nestane, a adresa ostaje u istoriji. Promena ide preko \`setParams\`, obično sa \`{ replace: true }\`, da svako otkucano slovo pretrage ne pravi novi unos u istoriji.`,
    },
    {
      kind: "playground",
      id: "router-peskovnik",
      title: "Mini ReformStudio",
      prompt:
        "Pravi React Router, u `MemoryRouter`-u. Pošto pregled nema adresnu traku, gornji red ispisuje trenutnu adresu preko `useLocation`. Klikni tabove i termine i prati adresu. Primeti da tab Raspored ostaje aktivan i na detalju termina. Probaj: dodaj treći tab `/profil`, promeni `initialEntries` u `[\"/raspored/t2\"]`, ili `[\"/nesto\"]`.",
      lang: "tsx",
      code: `import { MemoryRouter, Routes, Route, NavLink, Link, useLocation, useNavigate, useParams } from "react-router-dom"

const ROUTES = {
  home: "/pocetna",
  schedule: "/raspored",
} as const

const TERMINI = [
  { id: "t1", naziv: "Pilates", vreme: "18:00" },
  { id: "t2", naziv: "Reformer", vreme: "19:00" },
]

function Adresa() {
  const { pathname } = useLocation()
  return <p className="muted">Adresa: {pathname}</p>
}

function TabBar() {
  return (
    <nav className="row">
      <NavLink to={ROUTES.home} className={({ isActive }) => (isActive ? "badge" : "")}>
        Početna
      </NavLink>
      <NavLink to={ROUTES.schedule} className={({ isActive }) => (isActive ? "badge" : "")}>
        Raspored
      </NavLink>
    </nav>
  )
}

function Raspored() {
  return (
    <div className="stack">
      <h2>Raspored</h2>
      {TERMINI.map((t) => (
        <Link key={t.id} to={\`\${ROUTES.schedule}/\${t.id}\`}>
          {t.vreme} · {t.naziv}
        </Link>
      ))}
    </div>
  )
}

function Termin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const termin = TERMINI.find((t) => t.id === id)

  return (
    <div className="card stack">
      <h2>{termin ? termin.naziv : "Termin ne postoji"}</h2>
      {termin && <p>Početak: {termin.vreme}</p>}
      <button className="secondary" onClick={() => navigate(-1)}>
        Nazad
      </button>
    </div>
  )
}

export default function App() {
  return (
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <Adresa />
      <TabBar />
      <Routes>
        <Route path={ROUTES.home} element={<h2>Početna</h2>} />
        <Route path={ROUTES.schedule} element={<Raspored />} />
        <Route path={\`\${ROUTES.schedule}/:id\`} element={<Termin />} />
        <Route path="*" element={<h2>Stranica ne postoji</h2>} />
      </Routes>
    </MemoryRouter>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Ugnežđene rute i \`Outlet\`

Početna, Raspored, Termini i Profil imaju isti tab bar na dnu. Bilo bi loše da svaki ekran sam crta \`<TabBar />\`: pri svakom prelasku traka bi se uništila i napravila iznova.

Rešenje je **layout ruta**: \`Route\` **bez \`path\`-a**, sa drugim rutama unutra. Njen \`element\` je okvir, a na mestu gde treba da se pojavi ekran rute deteta stoji **\`<Outlet />\`**:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `function Okvir() {
  return (
    <>
      <main>
        <Outlet /> {/* ovde dolazi Početna, Raspored… */}
      </main>
      <TabBar />
    </>
  )
}

<Routes>
  <Route element={<Okvir />}>
    <Route path="/pocetna" element={<HomeScreen />} />
    <Route path="/raspored" element={<ScheduleScreen />} />
  </Route>
</Routes>`,
      highlight: [5, 13],
      caption:
        "Na `/raspored` React Router nacrta `Okvir`, a na mesto `<Outlet />` stavi `ScheduleScreen`. Pri prelasku na `/pocetna` okvir **ostaje**, menja se samo sadržaj Outlet-a. Tako radi ReformStudijev `AppShell`: crta okvir sa tab barom, a ekran taba ide u `<Outlet />`.",
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao ram za sliku",
      md: "Layout je ram koji visi na zidu, a `Outlet` je otvor u ramu. Kad menjaš ekran, menjaš sliku, a ram ostaje gde je bio. Ram može da bude i u drugom ramu: u ReformStudiju je `PhoneColumn` (kolona širine telefona) spoljni ram, a `AppShell` (tab bar) unutrašnji.",
    },
    {
      kind: "prose",
      md: `### Čuvari ruta: \`<Navigate replace />\`

Neki ekrani smeju da se vide samo pod uslovom: Početna samo kad je član prijavljen, Prijava samo kad **nije**. Rešenje je ista layout ruta, samo što umesto okvira vraća **odluku**: ili \`<Outlet />\` (prolaz), ili \`<Navigate />\` (preusmeravanje).`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/components/AppShell.tsx",
      code: `/** Ekrani dostupni samo bez prijave (prijava, registracija). */
export const PublicOnly = () => {
  const user = useAuthStore((s) => s.user)
  return user ? <Navigate to={homeRoute(user)} replace /> : <Outlet />
}`,
      highlight: [4],
      caption:
        "Prijavljen korisnik koji otvori `/prijava` odmah ode na svoju početnu. Neprijavljen prolazi do ekrana za prijavu.",
    },
    {
      kind: "prose",
      md: `\`<Navigate to={…} />\` je komponenta koja, čim se nacrta, uradi \`navigate(to)\`. Koristi se baš tamo gde odluka pada **tokom crtanja**, gde se \`navigate\` ne sme pozvati direktno.

Isti obrazac radi i u obrnutom smeru. U \`AppShell\` stoji \`if (!user) return <Navigate to={ROUTES.entry} replace />\`, pa neprijavljen korisnik nikad ne vidi tab bar, a \`RequireStudio\` u \`App.tsx\` vraća na izbor studija svakoga ko studio još nije izabrao.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zaboravljen replace i Nazad koji \"ne radi\"",
      md: "Bez `replace` preusmeravanje ostavi zaštićenu adresu u istoriji. Korisnik pritisne Nazad, vrati se na `/pocetna`, čuvar ga opet pošalje na `/prijava`, i tako u krug: izgleda kao da dugme Nazad ne radi. Sa `replace` zaštićena adresa nikad ne uđe u istoriju. Pravilo: **preusmeravanje skoro uvek ide sa `replace`**.",
    },
    {
      kind: "prose",
      md: `### Adresa koja ne postoji: \`path="*"\`

Zvezdica odgovara **bilo kojoj** adresi, ali se bira tek kad nijedna preciznija ruta ne odgovara. Zato je \`<Route path="*" element={<NotFound />} />\` mesto za 404 ekran.

ReformStudio umesto 404 ekrana vraća na početak: \`<Route path="*" element={<Navigate to={ROUTES.entry} replace />} />\`. Admin panel radi isto, samo ka listi članova. A \`/admin/*\` znači "\`/admin\` i sve ispod": te adrese preuzima poseban \`<Routes>\` iz \`src/admin/index.tsx\`.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/App.tsx",
      lang: "tsx",
      startLine: 120,
      intro:
        "Sad možeš da pročitaš celu tabelu ruta ReformStudija. Ovo je srce aplikacije: svaki ekran, svaki čuvar i svaki okvir na jednom mestu.",
      code: `  return (
    <BrowserRouter>
      <Routes>
        {Gallery && (
          <Route
            path={\`\${DEV_GALLERY}/*\`}
            element={
              <Suspense>
                <Gallery />
              </Suspense>
            }
          />
        )}
        <Route element={<PhoneColumn />}>
          <Route path={ROUTES.entry} element={<EntryScreen />} />
          {/* Link iz mejla se otvara i bez izabranog studija i bez prijave (PLAN 7.5). */}
          <Route path={ROUTES.resetPassword} element={<ResetPasswordScreen />} />
          <Route path={ROUTES.privacy} element={<PrivacyScreen />} />
          <Route element={<RequireStudio />}>
            <Route element={<PublicOnly />}>
              <Route path={ROUTES.login} element={<LoginScreen />} />
              <Route path={ROUTES.register} element={<RegisterScreen />} />
            </Route>
            <Route element={<AppShell />}>
              <Route path={ROUTES.home} element={<HomeScreen />} />
              <Route path={ROUTES.schedule} element={<ScheduleScreen />} />
              <Route path={ROUTES.bookings} element={<BookingsScreen />} />
              <Route path={ROUTES.profile} element={<ProfileScreen />} />
              <Route path={ROUTES.notifications} element={<NotificationsScreen />} />
              <Route path={ROUTES.weight} element={<WeightScreen />} />
            </Route>
            <Route
              path={\`\${ADMIN_BASE}/*\`}
              element={
                <Suspense fallback={<ScreenSkeleton />}>
                  <AdminArea />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.entry} replace />} />
        </Route>
      </Routes>
      <Toaster />
      <RotateNotice />
    </BrowserRouter>
  )
`,
      steps: [
        {
          lines: [2, 3],
          md: "`BrowserRouter` obmotava sve, a `Routes` bira jednu rutu. `Toaster` i `RotateNotice` (redovi 44–45) su van `Routes`, pa se vide na svakom ekranu.",
        },
        {
          lines: [14, 18],
          md: "`<Route element={<PhoneColumn />}>` nema `path`: to je **layout ruta**. `PhoneColumn` crta kolonu širine telefona sa `<Outlet />` unutra. Ulaz, nova lozinka i privatnost su otvoreni za sve, bez studija i bez prijave.",
        },
        {
          lines: [19, 23],
          md: "Dva **čuvara**, jedan u drugom. `RequireStudio`: bez izabranog studija nazad na ulaz. `PublicOnly`: prijava i registracija samo za neprijavljene.",
        },
        {
          lines: [24, 31],
          md: "`AppShell` je i čuvar (neprijavljen ide na ulaz) i okvir sa tab barom. Šest ekrana deli isti tab bar, a svaki se crta u njegov `<Outlet />`.",
        },
        {
          lines: [32, 39],
          md: "`/admin/*`: sve ispod `/admin` ide u admin panel, koji ima svoju tabelu ruta (`clanovi/:uid` i ostale). `lazy` + `Suspense` znače da član nikad ne preuzima kod admin panela.",
        },
        {
          lines: 41,
          md: "Sve što ne odgovara nijednoj ruti vraća se na ulaz, sa `replace`, da pogrešna adresa ne ostane u istoriji.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "A Next.js i Looply?",
      md: "PlazaHome (Next.js) i Looply (expo-router) nemaju tabelu ruta u kodu: **putanja je folder**. U PlazaHome-u je fajl `src/app/o-nama/page.tsx` automatski stranica `/o-nama`, a `src/app/not-found.tsx` je 404. U Looply-ju je `src/app/subscription/[id].tsx` isto što i `path=\"/subscription/:id\"`, parametar se čita sa `useLocalSearchParams()` umesto `useParams()`, a `(tabs)/_layout.tsx` je okvir sa tab barom, kao `AppShell` sa `Outlet`-om. Ideje su iste (rute, parametri, layout-i, navigacija iz koda), menja se samo mesto gde se pišu. Next.js stiže u posebnom modulu.",
    },
    {
      kind: "exercise",
      id: "router-1",
      title: "Tab bar sa dve rute",
      lang: "tsx",
      prompt: `Napravi najmanji ReformStudio: dva ekrana i tab bar.

- Unutar \`<MemoryRouter>\` dodaj \`<Routes>\` sa dve rute: \`ROUTES.home\` crta \`<Pocetna />\`, a \`ROUTES.schedule\` crta \`<Raspored />\`.
- U \`<nav>\` dodaj dva **\`NavLink\`**-a sa tekstom **Početna** i **Raspored**. Koristi putanje iz \`ROUTES\`, ne upisuj stringove ručno.

Aplikacija počinje na \`/pocetna\` (to radi \`initialEntries\`). Klikći tabove u pregledu: aktivni tab dobija \`aria-current="page"\`, a to proveravaju i testovi.`,
      starter: `import { MemoryRouter, Routes, Route, NavLink } from "react-router-dom"

const ROUTES = {
  home: "/pocetna",
  schedule: "/raspored",
} as const

function Pocetna() {
  return <h1>Početna</h1>
}

function Raspored() {
  return <h1>Raspored</h1>
}

export default function App() {
  return (
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <nav className="row">
        {/* 1. Dva NavLink-a: Početna i Raspored */}
      </nav>

      {/* 2. Routes sa dve rute */}
    </MemoryRouter>
  )
}
`,
      solution: `import { MemoryRouter, Routes, Route, NavLink } from "react-router-dom"

const ROUTES = {
  home: "/pocetna",
  schedule: "/raspored",
} as const

function Pocetna() {
  return <h1>Početna</h1>
}

function Raspored() {
  return <h1>Raspored</h1>
}

export default function App() {
  return (
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <nav className="row">
        <NavLink to={ROUTES.home}>Početna</NavLink>
        <NavLink to={ROUTES.schedule}>Raspored</NavLink>
      </nav>

      <Routes>
        <Route path={ROUTES.home} element={<Pocetna />} />
        <Route path={ROUTES.schedule} element={<Raspored />} />
      </Routes>
    </MemoryRouter>
  )
}
`,
      tests: [
        {
          name: "na početku se vidi ekran Početna",
          code: `await render(App)
expect(screen.getByRole("heading", { name: "Početna" })).toBeInTheDocument()`,
        },
        {
          name: "tabovi Početna i Raspored vode na /pocetna i /raspored",
          code: `await render(App)
expect(screen.getByRole("link", { name: "Početna" }).getAttribute("href")).toBe("/pocetna")
expect(screen.getByRole("link", { name: "Raspored" }).getAttribute("href")).toBe("/raspored")`,
        },
        {
          name: "klik na Raspored menja ekran",
          code: `await render(App)
await click(screen.getByRole("link", { name: "Raspored" }))
expect(screen.getByRole("heading", { name: "Raspored" })).toBeInTheDocument()
expect(screen.queryByRole("heading", { name: "Početna" })).toBe(null)`,
        },
        {
          name: "aktivni tab ima aria-current=\"page\"",
          code: `await render(App)
const pocetna = screen.getByRole("link", { name: "Početna" })
const raspored = screen.getByRole("link", { name: "Raspored" })
expect(pocetna.getAttribute("aria-current")).toBe("page")
expect(raspored.getAttribute("aria-current")).toBe(null)
await click(raspored)
expect(raspored.getAttribute("aria-current")).toBe("page")
expect(pocetna.getAttribute("aria-current")).toBe(null)`,
        },
      ],
      hints: [
        "Ruta: `<Route path={ROUTES.home} element={<Pocetna />} />`. Obe rute idu unutar jednog `<Routes>…</Routes>`.",
        "Tab: `<NavLink to={ROUTES.schedule}>Raspored</NavLink>`. Klasu `active` i `aria-current` NavLink dodaje sam.",
        "I `<nav>` i `<Routes>` moraju biti **unutar** `<MemoryRouter>`, inače linkovi i rute ne znaju za adresu.",
      ],
      explanation:
        "Ovo je kostur ReformStudija u malom: putanje iz jednog objekta, `Routes` bira ekran, a `NavLink` sam zna koji je tab aktivan. `aria-current` nije tu zbog testova: na osnovu njega čitač ekrana kaže \"trenutna stranica\".",
    },
    {
      kind: "exercise",
      id: "router-2",
      title: "Detalj termina sa :id",
      lang: "tsx",
      prompt: `Lista termina već postoji. Napravi ekran detalja i 404:

- U \`Rute\` dodaj rutu \`/termini/:id\` koja crta \`<Detalj />\`.
- U \`Detalj\` pročitaj \`id\` sa \`useParams()\` i pronađi termin u nizu \`TERMINI\`. Prikaži naslov (\`<h1>\`) sa nazivom i paragraf **Početak: 18:00** (sa vremenom tog termina). Ako termin ne postoji, prikaži **Termin ne postoji**.
- Dodaj rutu \`*\` koja crta naslov **Stranica ne postoji**.

Testovi crtaju \`App\`, ali i samu komponentu \`Rute\` u \`MemoryRouter\`-u sa drugom početnom adresom (npr. \`/termini/t2\`), kao da je neko otvorio link direktno. Zato je \`Rute\` izdvojena i ima \`export\`.`,
      starter: `import { MemoryRouter, Routes, Route, Link, useParams } from "react-router-dom"

const TERMINI = [
  { id: "t1", naziv: "Pilates", vreme: "18:00" },
  { id: "t2", naziv: "Reformer", vreme: "19:00" },
]

function Lista() {
  return (
    <div className="stack">
      <h1>Termini</h1>
      {TERMINI.map((t) => (
        <Link key={t.id} to={\`/termini/\${t.id}\`}>
          {t.naziv}
        </Link>
      ))}
    </div>
  )
}

function Detalj() {
  // 1. Pročitaj id iz adrese i pronađi termin
  return <h1>?</h1>
}

export function Rute() {
  return (
    <Routes>
      <Route path="/termini" element={<Lista />} />
      {/* 2. Ruta za detalj: /termini/:id */}
      {/* 3. Ruta za sve ostalo: * */}
    </Routes>
  )
}

export default function App() {
  return (
    <MemoryRouter initialEntries={["/termini"]}>
      <Rute />
    </MemoryRouter>
  )
}
`,
      solution: `import { MemoryRouter, Routes, Route, Link, useParams } from "react-router-dom"

const TERMINI = [
  { id: "t1", naziv: "Pilates", vreme: "18:00" },
  { id: "t2", naziv: "Reformer", vreme: "19:00" },
]

function Lista() {
  return (
    <div className="stack">
      <h1>Termini</h1>
      {TERMINI.map((t) => (
        <Link key={t.id} to={\`/termini/\${t.id}\`}>
          {t.naziv}
        </Link>
      ))}
    </div>
  )
}

function Detalj() {
  const { id } = useParams()
  const termin = TERMINI.find((t) => t.id === id)

  if (!termin) return <p className="error">Termin ne postoji</p>

  return (
    <div className="card">
      <h1>{termin.naziv}</h1>
      <p>Početak: {termin.vreme}</p>
    </div>
  )
}

export function Rute() {
  return (
    <Routes>
      <Route path="/termini" element={<Lista />} />
      <Route path="/termini/:id" element={<Detalj />} />
      <Route path="*" element={<h1>Stranica ne postoji</h1>} />
    </Routes>
  )
}

export default function App() {
  return (
    <MemoryRouter initialEntries={["/termini"]}>
      <Rute />
    </MemoryRouter>
  )
}
`,
      tests: [
        {
          name: "klik na termin u listi otvara njegov detalj",
          code: `await render(App)
await click(screen.getByRole("link", { name: "Pilates" }))
expect(screen.getByRole("heading", { name: "Pilates" })).toBeInTheDocument()
expect(screen.getByText("Početak: 18:00")).toBeInTheDocument()`,
        },
        {
          name: "detalj čita id iz adrese (/termini/t2)",
          code: `const h = __require("react").createElement
const { MemoryRouter } = __require("react-router-dom")
await render(() => h(MemoryRouter, { initialEntries: ["/termini/t2"] }, h(Rute)))
expect(screen.getByRole("heading", { name: "Reformer" })).toBeInTheDocument()
expect(screen.getByText("Početak: 19:00")).toBeInTheDocument()`,
        },
        {
          name: "nepostojeći termin (/termini/xyz) prikazuje poruku",
          code: `const h = __require("react").createElement
const { MemoryRouter } = __require("react-router-dom")
await render(() => h(MemoryRouter, { initialEntries: ["/termini/xyz"] }, h(Rute)))
expect(screen.getByText("Termin ne postoji")).toBeInTheDocument()`,
        },
        {
          name: "nepoznata adresa (/nesto) prikazuje 404",
          code: `const h = __require("react").createElement
const { MemoryRouter } = __require("react-router-dom")
await render(() => h(MemoryRouter, { initialEntries: ["/nesto"] }, h(Rute)))
expect(screen.getByRole("heading", { name: "Stranica ne postoji" })).toBeInTheDocument()`,
        },
      ],
      hints: [
        "Ruta za detalj: `<Route path=\"/termini/:id\" element={<Detalj />} />`. Ime posle dvotačke postaje ključ u objektu koji vraća `useParams()`.",
        "U `Detalj`: `const { id } = useParams()`, pa `const termin = TERMINI.find((t) => t.id === id)`. Ako je `termin` `undefined`, vrati `<p>Termin ne postoji</p>` pre glavnog `return`-a.",
        "404: `<Route path=\"*\" element={<h1>Stranica ne postoji</h1>} />`. Redosled nije bitan, zvezdica se bira tek kad ništa drugo ne odgovara.",
      ],
      explanation:
        "Jedna ruta sa `:id` pokriva sve termine, a `find` sa granom za \"ne postoji\" štiti od adresa koje je neko izmislio. Admin panel ReformStudija radi isto sa `clanovi/:uid`. Primeti i da TypeScript zna da je `termin` posle `if (!termin) return …` sigurno definisan, pa `termin.naziv` ne pravi grešku.",
    },
    {
      kind: "exercise",
      id: "router-3",
      title: "Čuvar, prijava i okvir sa tabovima",
      lang: "tsx",
      prompt: `Poslednji korak je obrazac iz ReformStudijevog \`App.tsx\`. Tabela ruta u \`Rute\` je već gotova, a ti popuni tri komponente:

1. **\`Okvir\`**: ispod tabova prikaži ekran rute deteta.
2. **\`SamoPrijavljeni\`**: ako \`prijavljen\` nije \`true\`, preusmeri na \`ROUTES.login\` (sa \`replace\`). Inače pusti dalje.
3. **\`Prijava\`**: na klik na **Prijavi se** pozovi \`onPrijava()\`, pa idi na \`ROUTES.home\` sa \`{ replace: true }\`, da dugme Nazad ne vrati na prijavu.

Aplikacija počinje na \`/pocetna\`, pa neprijavljen korisnik treba odmah da završi na prijavi. Neki testovi crtaju \`Rute\` u svom \`MemoryRouter\`-u, uz pomoćnu komponentu koja čita adresu ili pritiska Nazad. U ReformStudiju \`prijavljen\` dolazi iz Zustand store-a, a ovde je \`useState\`, da vežba ostane kratka.`,
      starter: `import { useState } from "react"
import { MemoryRouter, Routes, Route, Navigate, Outlet, NavLink, useNavigate } from "react-router-dom"

const ROUTES = {
  login: "/prijava",
  home: "/pocetna",
  profile: "/profil",
} as const

// Okvir sa tab barom, kao AppShell
function Okvir() {
  return (
    <div className="stack">
      <nav className="row">
        <NavLink to={ROUTES.home}>Početna</NavLink>
        <NavLink to={ROUTES.profile}>Profil</NavLink>
      </nav>
      {/* 1. Ovde treba da se pojavi ekran rute deteta */}
    </div>
  )
}

// 2. Čuvar: prijavljen → prolaz, neprijavljen → ROUTES.login (sa replace)
function SamoPrijavljeni({ prijavljen }: { prijavljen: boolean }) {
  return <Outlet />
}

function Prijava({ onPrijava }: { onPrijava: () => void }) {
  // 3. Posle onPrijava() idi na ROUTES.home, sa replace
  return (
    <div className="card stack">
      <h1>Prijava</h1>
      <button onClick={onPrijava}>Prijavi se</button>
    </div>
  )
}

export function Rute() {
  const [prijavljen, setPrijavljen] = useState(false)

  return (
    <Routes>
      <Route path={ROUTES.login} element={<Prijava onPrijava={() => setPrijavljen(true)} />} />
      <Route element={<SamoPrijavljeni prijavljen={prijavljen} />}>
        <Route element={<Okvir />}>
          <Route path={ROUTES.home} element={<h1>Početna</h1>} />
          <Route path={ROUTES.profile} element={<h1>Profil</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <Rute />
    </MemoryRouter>
  )
}
`,
      solution: `import { useState } from "react"
import { MemoryRouter, Routes, Route, Navigate, Outlet, NavLink, useNavigate } from "react-router-dom"

const ROUTES = {
  login: "/prijava",
  home: "/pocetna",
  profile: "/profil",
} as const

// Okvir sa tab barom, kao AppShell
function Okvir() {
  return (
    <div className="stack">
      <nav className="row">
        <NavLink to={ROUTES.home}>Početna</NavLink>
        <NavLink to={ROUTES.profile}>Profil</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

function SamoPrijavljeni({ prijavljen }: { prijavljen: boolean }) {
  return prijavljen ? <Outlet /> : <Navigate to={ROUTES.login} replace />
}

function Prijava({ onPrijava }: { onPrijava: () => void }) {
  const navigate = useNavigate()

  const prijaviSe = () => {
    onPrijava()
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <div className="card stack">
      <h1>Prijava</h1>
      <button onClick={prijaviSe}>Prijavi se</button>
    </div>
  )
}

export function Rute() {
  const [prijavljen, setPrijavljen] = useState(false)

  return (
    <Routes>
      <Route path={ROUTES.login} element={<Prijava onPrijava={() => setPrijavljen(true)} />} />
      <Route element={<SamoPrijavljeni prijavljen={prijavljen} />}>
        <Route element={<Okvir />}>
          <Route path={ROUTES.home} element={<h1>Početna</h1>} />
          <Route path={ROUTES.profile} element={<h1>Profil</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <MemoryRouter initialEntries={[ROUTES.home]}>
      <Rute />
    </MemoryRouter>
  )
}
`,
      tests: [
        {
          name: "neprijavljen korisnik sa /profil završi na adresi /prijava",
          code: `const h = __require("react").createElement
const { MemoryRouter, useLocation } = __require("react-router-dom")
function Adresa() {
  return h("p", { "data-testid": "adresa" }, useLocation().pathname)
}
// <Navigate> preusmerava tek posle crtanja, pa test malo sačeka
const sacekaj = async (nadji) => { for (let i = 0; i < 30 && !nadji(); i++) await sleep(10) }
await render(() => h(MemoryRouter, { initialEntries: ["/profil"] }, h(Rute), h(Adresa)))
await sacekaj(() => screen.queryByRole("heading", { name: "Prijava" }))
expect(screen.getByRole("heading", { name: "Prijava" })).toBeInTheDocument()
expect(screen.getByTestId("adresa").textContent).toBe("/prijava")
expect(screen.queryByRole("heading", { name: "Profil" })).toBe(null)`,
        },
        {
          name: "posle prijave se vidi Početna u okviru sa tabovima",
          code: `const sacekaj = async (nadji) => { for (let i = 0; i < 30 && !nadji(); i++) await sleep(10) }
await render(App)
await sacekaj(() => screen.queryByRole("button", { name: "Prijavi se" }))
await click(screen.getByRole("button", { name: "Prijavi se" }))
await sacekaj(() => screen.queryByRole("heading", { name: "Početna" }))
expect(screen.getByRole("heading", { name: "Početna" })).toBeInTheDocument()
expect(screen.getByRole("link", { name: "Profil" })).toBeInTheDocument()`,
        },
        {
          name: "tab Profil menja ekran unutar okvira i postaje aktivan",
          code: `const sacekaj = async (nadji) => { for (let i = 0; i < 30 && !nadji(); i++) await sleep(10) }
await render(App)
await sacekaj(() => screen.queryByRole("button", { name: "Prijavi se" }))
await click(screen.getByRole("button", { name: "Prijavi se" }))
await sacekaj(() => screen.queryByRole("link", { name: "Profil" }))
await click(screen.getByRole("link", { name: "Profil" }))
await sacekaj(() => screen.queryByRole("heading", { name: "Profil" }))
expect(screen.getByRole("heading", { name: "Profil" })).toBeInTheDocument()
expect(screen.getByRole("link", { name: "Profil" }).getAttribute("aria-current")).toBe("page")`,
        },
        {
          name: "Nazad posle prijave ne vraća na prijavu (replace)",
          code: `const h = __require("react").createElement
const { MemoryRouter, useNavigate } = __require("react-router-dom")
function Nazad() {
  const navigate = useNavigate()
  return h("button", { onClick: () => navigate(-1) }, "Nazad")
}
const sacekaj = async (nadji) => { for (let i = 0; i < 30 && !nadji(); i++) await sleep(10) }
await render(() => h(MemoryRouter, { initialEntries: ["/pocetna"] }, h(Rute), h(Nazad)))
await sacekaj(() => screen.queryByRole("button", { name: "Prijavi se" }))
await click(screen.getByRole("button", { name: "Prijavi se" }))
await sacekaj(() => screen.queryByRole("heading", { name: "Početna" }))
await click(screen.getByRole("button", { name: "Nazad" }))
// ako Nazad vodi na prijavu, ona se pojavi u ovih 300 ms
await sacekaj(() => screen.queryByRole("heading", { name: "Prijava" }))
expect(screen.queryByRole("heading", { name: "Prijava" })).toBe(null)
expect(screen.getByRole("heading", { name: "Početna" })).toBeInTheDocument()`,
        },
      ],
      hints: [
        "`Okvir`: zameni komentar sa `<Outlet />`. Tu React Router stavlja `<h1>Početna</h1>` ili `<h1>Profil</h1>`, zavisno od adrese.",
        "Čuvar je jedan red: `return prijavljen ? <Outlet /> : <Navigate to={ROUTES.login} replace />`.",
        "U `Prijava`: `const navigate = useNavigate()` na vrhu komponente, a u handleru dugmeta prvo `onPrijava()`, pa `navigate(ROUTES.home, { replace: true })`.",
      ],
      explanation:
        "Ovo je ReformStudijev obrazac u malom: `RequireStudio` i `PublicOnly` su čuvari kao `SamoPrijavljeni`, `AppShell` je `Okvir`, a uspešna prijava preusmerava sa `replace`. Čuvar ne crta ekran prijave sam, nego **menja adresu**, pa adresa uvek odgovara onome što je na ekranu, i posle osvežavanja i posle dugmeta Nazad.",
    },
    {
      kind: "quiz",
      id: "router-quiz",
      questions: [
        {
          q: "Šta se desi kad u ReformStudiju korisnik klikne `<a href=\"/raspored\">` umesto `<Link to=\"/raspored\">`?",
          options: [
            "Ništa posebno, rade potpuno isto",
            "Browser ponovo učita celu aplikaciju, pa se gubi sve što je bilo u memoriji",
            "React prijavi grešku jer `<a>` nije dozvoljen",
            "Raspored se otvori u novom tabu",
          ],
          answer: 1,
          why: "`<a>` traži novu stranicu od servera. `Link` crta isti `<a>`, ali presretne klik i promeni adresu kroz History API, bez učitavanja.",
        },
        {
          q: "Ruta je `path=\"/termini/:id\"`, a adresa `/termini/42`. Šta vraća `useParams()`?",
          options: ["`{ id: 42 }`", "`\"42\"`", "`{ id: \"42\" }`", "`[\"termini\", \"42\"]`"],
          answer: 2,
          why: "Objekat čiji je ključ ime posle dvotačke. Vrednost je uvek string, pa za broj treba `Number(id)`.",
        },
        {
          q: "Zašto čuvar vraća `<Navigate to=\"/prijava\" replace />`, a ne isto bez `replace`?",
          options: [
            "Bez `replace` komponenta `Navigate` ne radi",
            "Da bi se stranica osvežila",
            "Da prelazak bude brži",
            "Da zaštićena adresa ne ostane u istoriji, pa Nazad ne vrti korisnika u krug",
          ],
          answer: 3,
          why: "Bez `replace` Nazad vraća na zaštićenu adresu, čuvar opet preusmeri na prijavu, i tako u krug.",
        },
        {
          q: "Šta radi `<Outlet />` u layout ruti kao što je `AppShell`?",
          options: [
            "Označava mesto gde se crta ekran rute deteta",
            "Vodi korisnika na spoljni sajt",
            "Zaustavlja rutiranje dok se podaci ne učitaju",
            "Pravi novu adresu u istoriji",
          ],
          answer: 0,
          why: "Layout (okvir sa tab barom) ostaje, a u `Outlet` React Router stavlja ekran koji odgovara adresi.",
        },
        {
          q: "Koju rutu `Routes` bira za adresu `/nesto-sto-ne-postoji`?",
          code: `<Routes>
  <Route path="/pocetna" element={<Pocetna />} />
  <Route path="/termini/:id" element={<Termin />} />
  <Route path="*" element={<NotFound />} />
</Routes>`,
          codeLang: "tsx",
          options: [
            "`Pocetna`, jer je prva",
            "`NotFound`",
            "`Termin`, sa `id` = \"nesto-sto-ne-postoji\"",
            "Nijednu, ekran ostaje prazan",
          ],
          answer: 1,
          why: "`/termini/:id` odgovara samo adresama koje počinju sa `/termini/`. Zvezdica hvata sve što nijedna preciznija ruta nije uhvatila.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-router-1",
      front: "Šta je SPA i rutiranje na klijentu?",
      back: "Jedna HTML stranica. JavaScript menja adresu kroz History API i crta drugi ekran, bez novog učitavanja sa servera. Server zato za svaku adresu vraća isti `index.html`.",
    },
    {
      id: "fc-router-2",
      front: "`Link` ili `NavLink`?",
      back: "Oba menjaju adresu bez učitavanja. `NavLink` uz to zna da li je aktivan: dodaje klasu `active` i `aria-current=\"page\"`, a `className` može biti funkcija `({ isActive }) => …`. Zato je za tab bar.",
    },
    {
      id: "fc-router-3",
      front: "`navigate(\"/x\")`, `navigate(\"/x\", { replace: true })`, `navigate(-1)`?",
      back: "Dodaje novi unos u istoriju / zamenjuje trenutni unos (Nazad ne vraća na stari ekran) / korak nazad, kao strelica u browseru.",
    },
    {
      id: "fc-router-4",
      front: "Kako se čita `:id` iz adrese, a kako `?dan=…`?",
      back: "`const { id } = useParams()` (uvek string ili `undefined`). Query: `const [params] = useSearchParams()`, pa `params.get(\"dan\")` (string ili `null`).",
    },
    {
      id: "fc-router-5",
      front: "Kako izgleda čuvar rute?",
      back: "Layout ruta bez `path`-a koja vraća `uslov ? <Outlet /> : <Navigate to=\"/prijava\" replace />`. U ReformStudiju: `RequireStudio`, `PublicOnly`, `AppShell`.",
    },
  ],
};

export default lesson;
