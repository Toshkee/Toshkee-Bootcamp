import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "zustand-osnove",
  title: "Zustand: zajedničko stanje",
  summary:
    "Kada `useState` i props više nisu dovoljni: kako se pravi tipiziran Zustand store, kako ga komponente čitaju selektorima, kako ga menjaju akcije i kako mu se pristupa van Reacta, kao u ReformStudiju i Looply-ju.",
  minutes: 20,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `U lekciji o custom hook-ovima \`toastStore\` iz ReformStudija se pojavio samo usput, uz rečenicu \"to je, na kraju krajeva, opet hook\". Sada ide prava priča.

Pogledaj šta sve u ReformStudiju zavisi od istih podataka:

- studio izabran na ulaznom ekranu boji **celu** aplikaciju i određuje koje termine vidiš,
- broj predstojećih rezervacija stoji na **tab baru**, a same rezervacije na ekranu **Rezervacije** i na **Početnoj**,
- tačkica na **zvoncu** zna da li ima nepročitanih obaveštenja, a ona se čitaju na sasvim drugom ekranu.

Ti podaci ne pripadaju nijednoj komponenti. Pripadaju **aplikaciji**. Za takve podatke tvoji projekti koriste **Zustand**.`,
    },
    {
      kind: "prose",
      md: `### Problem: prop drilling

Sa onim što već znaš, zajednički state se podiže u najbližeg zajedničkog roditelja. Za podatke koje koristi cela aplikacija to je sam vrh, \`App\`, pa vrednost mora da putuje kroz svaki nivo između:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Busenje.tsx",
      code: `function App() {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([])
  return <Okvir rezervacije={rezervacije} setRezervacije={setRezervacije} />
}

function Okvir({ rezervacije, setRezervacije }: OkvirProps) {
  // Okviru rezervacije ne trebaju, samo ih prosleđuje dalje
  return (
    <>
      <TabBar rezervacije={rezervacije} />
      <Ekran rezervacije={rezervacije} setRezervacije={setRezervacije} />
    </>
  )
}

function TabBar({ rezervacije }: { rezervacije: Rezervacija[] }) {
  return <Bedz broj={rezervacije.length} />
}`,
      highlight: [3, 6, 10, 11],
      caption:
        "Ovo se zove **prop drilling** (bušenje kroz props): `Okvir` ne koristi rezervacije, ali mora da ih primi i prosledi. Svaki novi zajednički podatak znači izmenu u svim komponentama na putu.",
    },
    {
      kind: "prose",
      md: `Problem nije samo kucanje. Kad se \`rezervacije\` promene, React ponovo crta \`App\` i sve ispod njega, iako je novi broj potreban samo bedžu i jednom ekranu.

Zustand rešava oba problema: podaci žive **van stabla komponenti**, a svaka komponenta se direktno \"pretplati\" na deo koji joj treba.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao oglasna tabla u studiju",
      md: "Props su poruka koja ide iz ruke u ruku: od recepcije do trenera, preko pet ljudi kojima ona ne treba. Store je **oglasna tabla na zidu**: ko treba nešto da zna, pogleda direktno, a ko ima pravo, upiše novu informaciju. Selektor je dogovor \"javi mi samo kad se promeni raspored za pilates\", pa te ostale izmene na tabli ne prekidaju.",
    },
    {
      kind: "prose",
      md: `### Prvi store

Store se pravi funkcijom \`create\` iz paketa \`zustand\`. Ovo je kompletan store za korpu termina:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "korpa.ts",
      code: `import { create } from "zustand"

interface KorpaState {
  // podaci
  termini: string[]
  // akcije: funkcije koje menjaju podatke
  dodaj: (termin: string) => void
  isprazni: () => void
}

export const useKorpa = create<KorpaState>()((set) => ({
  termini: [],
  dodaj: (termin) => set((s) => ({ termini: [...s.termini, termin] })),
  isprazni: () => set({ termini: [] }),
}))`,
      highlight: [3, 11, 13, 14],
      caption:
        "Interfejs opisuje **i podatke i akcije**. `create` dobija funkciju koja vraća početni objekat, a rezultat je **hook** `useKorpa`.",
    },
    {
      kind: "prose",
      md: `Deo po deo:

- **\`interface KorpaState\`** opisuje sve što store ima: podatke (\`termini\`) i **akcije** (\`dodaj\`, \`isprazni\`). Akcije su obične funkcije koje žive u store-u, odmah pored podataka koje menjaju.
- **\`create<KorpaState>()(…)\`**: generik kaže TypeScript-u kakav je store. Primeti **dva para zagrada**: prvo \`create<KorpaState>()\`, pa tek onda \`((set) => …)\`. O razlogu na kraju lekcije.
- **\`(set) => ({ … })\`** vraća početno stanje. Zustand ti daje \`set\`, funkciju koja menja store i javlja svim komponentama koje ga čitaju.
- Rezultat je **hook**, zato ime počinje sa \`use\`. Pravila hook-ova važe i ovde: poziva se na vrhu komponente.

Nema \`Provider\`-a oko aplikacije, nema podešavanja. Store se uveze i koristi gde god treba.`,
    },
    {
      kind: "prose",
      md: `### Čitanje: selektori

Komponenta čita store tako što pozove hook sa **selektorom**, funkcijom koja iz celog stanja izabere ono što joj treba:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Korpa.tsx",
      code: `function Bedz() {
  const broj = useKorpa((s) => s.termini.length)
  return <span className="badge">{broj}</span>
}

function DugmeDodaj({ termin }: { termin: string }) {
  const dodaj = useKorpa((s) => s.dodaj)
  return <button onClick={() => dodaj(termin)}>Dodaj {termin}</button>
}`,
      highlight: [2, 7],
      caption:
        "`Bedz` i `DugmeDodaj` mogu biti bilo gde u aplikaciji. Nema props-a između njih i nema zajedničkog roditelja sa state-om.",
    },
    {
      kind: "prose",
      md: `Šta se tačno dešava kad neko klikne **Dodaj**:

1. \`dodaj(termin)\` pozove \`set\`, a store dobije nov niz \`termini\`.
2. Zustand za **svaku** komponentu koja čita store ponovo pozove njen selektor i uporedi rezultat sa prethodnim (\`Object.is\`, isto kao React za state).
3. \`Bedz\` dobije \`1\` umesto \`0\`, pa se ponovo crta. \`DugmeDodaj\` dobije **istu** funkciju \`dodaj\` kao pre, pa se **ne crta**.

To je cela tajna selektora: **komponenta se crta ponovo samo kad se promeni ono što je izabrala.** Zato ReformStudio piše jedan poziv po podatku. Ovo je početak \`AppShell\`-a, okvira oko svih ekrana za članove:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/components/AppShell.tsx (linije 213–221)",
      code: `const user = useAuthStore((s) => s.user)
const studioId = useStudioStore((s) => s.studio)
const status = useMemberStore((s) => s.status)
const loadedFor = useMemberStore((s) => s.studioId)
const bookings = useMemberStore((s) => s.bookings)
const missing = useMemberStore((s) => s.failed.length > 0)
const error = useMemberStore((s) => s.error)
const load = useMemberStore((s) => s.load)
const refresh = useMemberStore((s) => s.refresh)`,
      highlight: [6, 8, 9],
      caption:
        "Tri store-a, devet malih pretplata. `missing` ne bira ceo niz `failed`, nego samo `true` ili `false`, pa se okvir ne crta ponovo dok se odgovor ne promeni. `load` i `refresh` su akcije: njihova referenca se nikad ne menja, pa nikad ni ne izazivaju crtanje.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Dve česte greške sa selektorima",
      md: `**Bez selektora.** \`const { studio } = useStudioStore()\` radi, ali se komponenta pretplati na **ceo** store i crta se ponovo pri **svakoj** izmeni bilo čega u njemu. Za mali \`studioStore\` to je svejedno, a za \`memberStore\` sa rezervacijama, obaveštenjima i kilažom nije.

**Selektor koji svaki put pravi nov objekat ili niz**, npr. \`useStore((s) => ({ a: s.a, b: s.b }))\` ili \`useStore((s) => s.lista.filter(…))\`. Nov objekat nikad nije \`Object.is\` jednak starom, pa u Zustand-u 5 React upada u beskonačnu petlju (\"Maximum update depth exceeded\"). Rešenje: dva odvojena selektora, selektor koji vraća broj ili \`boolean\` (kao \`missing\` gore), ili \`useShallow\` iz \`zustand/react/shallow\`.`,
    },
    {
      kind: "playground",
      id: "zustand-osnove-peskovnik",
      title: "Dva suseda, jedan store",
      prompt:
        "`Pozdrav` i `Zvonce` su susedi bez ijednog props-a, a dele isti store. Klikni **Stigla poruka** i gledaj konzolu: crta se samo `Zvonce`. Klikni **Promeni ime**: sada samo `Pozdrav`. Onda u `Pozdrav` zameni selektor sa `const { ime } = useObavestenja()` i klikni **Stigla poruka** ponovo.",
      lang: "tsx",
      code: `import { create } from "zustand"

interface Obavestenja {
  ime: string
  neprocitane: number
  stigla: () => void
  procitajSve: () => void
}

const useObavestenja = create<Obavestenja>()((set) => ({
  ime: "Ana",
  neprocitane: 2,
  stigla: () => set((s) => ({ neprocitane: s.neprocitane + 1 })),
  procitajSve: () => set({ neprocitane: 0 }),
}))

// Obična funkcija van Reacta, kao push poruka koja stigne sama
function promeniImeSpolja() {
  const sada = useObavestenja.getState().ime
  useObavestenja.setState({ ime: sada === "Ana" ? "Marko" : "Ana" })
}

function Pozdrav() {
  const ime = useObavestenja((s) => s.ime)
  console.log("crta se Pozdrav")
  return <h3>Zdravo, {ime}!</h3>
}

function Zvonce() {
  const broj = useObavestenja((s) => s.neprocitane)
  console.log("crta se Zvonce")
  return <span className="badge">Nepročitano: {broj}</span>
}

function Kontrole() {
  const stigla = useObavestenja((s) => s.stigla)
  const procitajSve = useObavestenja((s) => s.procitajSve)
  return (
    <div className="row">
      <button onClick={stigla}>Stigla poruka</button>
      <button className="secondary" onClick={procitajSve}>Pročitaj sve</button>
      <button className="secondary" onClick={promeniImeSpolja}>Promeni ime</button>
      <button className="secondary" onClick={() => console.log(useObavestenja.getState())}>
        getState()
      </button>
    </div>
  )
}

function App() {
  return (
    <div className="stack">
      <div className="card row">
        <Pozdrav />
        <Zvonce />
      </div>
      <Kontrole />
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Akcije: \`set\`, \`get\` i dva oblika izmene

Akcije menjaju store kroz \`set\`. Evo tri prava primera, iz tri tvoja projekta:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "Tri oblika",
      code: `// ReformStudio · studioStore.ts — objekat: "upiši ova polja"
leave: () => {
  applyTheme(null)
  set({ studio: null })
},

// Bootcamp · progress.ts — funkcija: "evo trenutnog stanja, vrati izmenu"
touch: () => set((s) => ({ days: withToday(s.days) })),

// Looply · subscriptionStore.ts — get(): trenutno stanje unutar akcije
async remove(id) {
  await getServices().subscriptions.remove(id, new Date());
  set({ subscriptions: get().subscriptions.filter((s) => s.id !== id) });
  await refreshSnapshots();
},`,
      highlight: [4, 8, 13],
    },
    {
      kind: "prose",
      md: `- **\`set({ … })\`** prima samo polja koja se menjaju. Zustand ih **spoji** sa ostatkom store-a: \`set({ studio: null })\` ne briše akcije \`select\` i \`leave\`. To je razlika u odnosu na \`useState\`, gde setter **zamenjuje** celu vrednost.
- **\`set((s) => …)\`** se koristi kad nova vrednost zavisi od stare. Funkcija dobija trenutno stanje i vraća samo ono što se menja.
- **\`get()\`** vraća trenutno stanje bilo gde u akciji. Posebno je važan **posle \`await\`-a**: dok se čekala baza, store se možda promenio, pa Looply listu čita tek posle brisanja, a ne na početku akcije.

Da bi \`get\` bio dostupan, dodaj ga u parametre: \`create<State>()((set, get) => ({ … }))\`.`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "Zustand-ov set deluje odmah",
      md: "Kod `useState` vrednost je \"fotografija\", a nova se vidi tek u sledećem crtanju. Zustand-ov store nije deo crtanja: posle `set(…)` već sledeća linija koda, `get()` ili `useStore.getState()`, **vidi novo stanje**. Komponente se ponovo crtaju malo kasnije, ali podaci su promenjeni odmah.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Spajanje je samo na prvom nivou",
      md: "`set` spaja samo polja na vrhu store-a. Ako je u store-u objekat, kao `settings` u Looply-ju, onda `set({ settings: { theme: 'dark' } })` **zameni ceo objekat** i izgubi valutu, jezik i sve ostalo. Zato Looply piše `set({ settings: { ...previous, ...patch } })`: prvo raširi stara podešavanja, pa preko njih nova.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/store/studioStore.ts",
      lang: "ts",
      startLine: 43,
      intro:
        "Store koji pamti u kom studiju je aplikacija. Mali je, ali ima sve: tipove, početnu vrednost, dve akcije i sporedne efekte. Komentari su tvoji, iz koda.",
      code: `interface StudioState {
  /** Studio u kojem je aplikacija trenutno; \`null\` dok se ne izabere (ulazni ekran). */
  studio: StudioId | null
  select: (studio: StudioId) => void
  /** Povratak na ulazni ekran: tema postaje neutralna, a posljednji izbor ostaje zapamćen. */
  leave: () => void
}

const initial = ALWAYS_SHOW_ENTRY ? null : readRemembered()
applyTheme(initial)

export const useStudioStore = create<StudioState>()((set) => ({
  studio: initial,

  select: (studio) => {
    remember(studio)
    applyTheme(studio)
    set({ studio })
  },

  leave: () => {
    applyTheme(null)
    set({ studio: null })
  },
}))
`,
      steps: [
        {
          lines: [1, 7],
          md: "Interfejs: jedan podatak i dve akcije. `StudioId | null` je precizniji od `string`: TypeScript zna tačno koji studiji postoje, a `null` znači \"još nije izabran\".",
        },
        {
          lines: [9, 10],
          md: "Početna vrednost se računa **jednom**, kad se fajl učita: `readRemembered()` pročita poslednji izbor iz `localStorage`-a. Tema se primeni odmah, pre nego što se React uopšte pokrene.",
        },
        {
          lines: [12, 13],
          md: "`create<StudioState>()` sa dva para zagrada, pa početno stanje. Akcijama ovde treba samo `set`, zato `get` nije u parametrima.",
        },
        {
          lines: [15, 19],
          md: "`select` prvo uradi sporedne efekte (zapamti izbor, promeni CSS temu), pa `set({ studio })`. Parametar `studio` nije tipiziran ponovo: TypeScript ga zna iz interfejsa. Svaka komponenta sa `useStudioStore((s) => s.studio)` se zatim ponovo crta.",
        },
        {
          lines: [21, 24],
          md: "`leave` vrati temu na neutralnu i upiše `null`. Namerno **ne** zove `remember`: posle povratka na ulazni ekran, poslednji izbor ostaje zapamćen, baš kao što kaže komentar u liniji 47.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Van Reacta: \`getState\`, \`setState\`, \`subscribe\`

Hook sme da se pozove samo u komponenti. Ali store nije vezan za React: \`useStudioStore\` je istovremeno i hook i objekat sa metodama.

| Metoda | Šta radi | Gde je u tvom kodu |
|---|---|---|
| \`useStore.getState()\` | trenutno stanje, bez pretplate | \`toast()\` u \`toastStore\`-u, \`clearSessionData\` u \`authStore\`-u |
| \`useStore.setState({ … })\` | upis spolja, isto spajanje kao \`set\` | \`usePushStore\` u \`src/lib/push.ts\` |
| \`useStore.subscribe(fn)\` | poziva \`fn\` posle svake izmene | Firebase API prati promenu studija |

Kad store treba da se menja iz drugog store-a ili iz obične funkcije, ovo je put:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio · src/store/authStore.ts (linije 39–44)",
      code: `/** Kad nalog nestane (odjava, istekla sesija), podaci prethodnog naloga ne smiju ostati. */
const clearSessionData = () => {
  useMemberStore.getState().clear()
  useAdminStore.getState().clear()
  clearNutritionCache()
}`,
      highlight: [3, 4],
      caption:
        "`authStore` ne crta ništa, pa ne može da koristi hook. Zato preko `getState()` uzme **akciju** iz drugog store-a i pozove je. Isto radi i `toast(…)` iz lekcije o custom hook-ovima.",
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio · src/lib/push.ts (linije 68–73)",
      code: `export const usePushStore = create<PushStore>()(() => ({ state: null, busy: false }))

const setState = (state: PushState) => {
  usePushStore.setState({ state })
  return state
}`,
      highlight: [1, 4],
      caption:
        "Store **bez ijedne akcije**, samo podaci. Logika za push obaveštenja je u običnim funkcijama istog fajla, koje store pune preko `setState`. Komponente (`PushCard`, `ProfileScreen`) samo čitaju `usePushStore((s) => s.state)`.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "getState u komponenti?",
      md: "U JSX-u uvek koristi hook sa selektorom, inače se ekran ne osveži kad se store promeni. `getState()` u komponenti ima smisla samo kad vrednost treba **jednom**, u trenutku: u handleru za klik ili za početnu vrednost. Looply-jev formular za novu pretplatu tako uzme valutu samo pri otvaranju: `const { currency, defaultReminderDays } = useSettingsStore.getState().settings;`.",
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "src/state/bootstrap.ts",
      lang: "ts",
      startLine: 18,
      intro:
        "Pokretanje Looply-ja. Pre prvog ekrana, ova funkcija napuni oba store-a sačuvanim podacima, bez ijedne komponente i bez ijednog hook-a.",
      code: `export async function bootstrapApp(): Promise<void> {
  const deviceLanguage = detectLanguage(getLocales());
  await initI18n(deviceLanguage);

  const db = await openAppDatabase();
  const services = {
    db,
    subscriptions: createSqliteSubscriptionRepository(db),
    settings: createSqliteSettingsRepository(db),
  };
  setServices(services);

  const settings = await services.settings.load();
  // A language saved by the user always wins over the device language.
  const language = settings.language ?? deviceLanguage;
  if (language !== deviceLanguage) await changeAppLanguage(language);
  useSettingsStore.getState().hydrate({ ...settings, language });

  const [subscriptions, snapshots] = await Promise.all([
    services.subscriptions.list(),
    services.subscriptions.listSnapshots(),
  ]);
  useSubscriptionStore.getState().hydrate(subscriptions, snapshots);
}
`,
      steps: [
        {
          lines: [1, 3],
          md: "Obična `async` funkcija, ne komponenta. Poziva se jednom, pri pokretanju aplikacije. Prvo jezik, da bi i eventualna greška sa bazom bila prikazana na pravom jeziku.",
        },
        {
          lines: [5, 11],
          md: "Otvara SQLite bazu na telefonu i pravi \"servise\" za čitanje i pisanje. `setServices` ih zapamti, pa ih akcije store-a kasnije uzimaju sa `getServices()`. Store ne mora da zna ni da li je baza SQLite ni gde je.",
        },
        {
          lines: [13, 16],
          md: "Učita sačuvana podešavanja i odluči jezik: izbor korisnika uvek pobeđuje jezik telefona.",
        },
        {
          lines: 17,
          md: "Ključna linija: `getState()` daje akcije store-a i van Reacta, pa `hydrate` upiše podešavanja u store. Kad se prvi ekran nacrta, `useSettingsStore((s) => s.settings.theme)` već vraća pravu temu.",
        },
        {
          lines: [19, 23],
          md: "Pretplate i njihova istorija se čitaju **paralelno** (`Promise.all`), pa ide isti trik sa `subscriptionStore`-om. \"Hydrate\" je uobičajeno ime za akciju koja prazan store napuni sačuvanim podacima.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Tipiziranje store-a

Sve što TypeScript treba da zna o store-u stoji u jednom interfejsu:

- **podaci** sa tačnim tipovima: \`studio: StudioId | null\`, a ne samo \`string\`,
- **akcije** sa potpisom: \`select: (studio: StudioId) => void\`, a za \`async\` akcije \`Promise<void>\`,
- unutar \`create\` parametri akcija se **ne tipiziraju ponovo**: \`select: (studio) => { … }\` već zna da je \`studio\` tipa \`StudioId\`.

A dva para zagrada? \`create<KorpaState>()(…)\` je takozvani \"curried\" oblik: prvi poziv fiksira tip, a drugi prima funkciju. Looply piše kraće, \`create<SettingsState>((set, get) => …)\`, i za jednostavan store i to radi. Ali čim se doda middleware kao \`persist\` (sledeća lekcija), TypeScript bez praznih zagrada ne ume da poveže tipove. Zato je pravilo jednostavno: **uvek \`create<Tip>()(…)\`**, kao u ReformStudiju i u samom Bootcampu.`,
    },
    {
      kind: "exercise",
      id: "zustand-osnove-1",
      title: "Korpa termina",
      lang: "tsx",
      prompt: `Komponente \`Ponuda\` i \`Korpa\` su susedi i ne dele nijedan prop. Poveži ih preko store-a:

1. Napiši akcije u \`useKorpa\`:
   - \`dodaj(termin)\` dodaje termin na kraj, ali **isti termin ne dodaje dva puta**
   - \`ukloni(termin)\` ga skida iz korpe
   - \`isprazni()\` prazni korpu
2. U \`Ponudi\`, klik na termin poziva \`dodaj\`.
3. U \`Korpi\`, prikaži termine iz store-a, a dugmad **×** i **Isprazni** neka pozivaju \`ukloni\` i \`isprazni\`.`,
      starter: `import { create } from "zustand"

interface KorpaState {
  termini: string[]
  dodaj: (termin: string) => void
  ukloni: (termin: string) => void
  isprazni: () => void
}

export const useKorpa = create<KorpaState>()((set) => ({
  termini: [],
  // TODO: napiši akcije pomoću set
  dodaj: (termin) => {},
  ukloni: (termin) => {},
  isprazni: () => {},
}))

const PONUDA = ["Pilates 18:00", "Reformer 19:00", "Mat 20:00"]

function Ponuda() {
  // TODO: uzmi akciju dodaj iz store-a
  return (
    <div className="row">
      {PONUDA.map((termin) => (
        <button key={termin} className="secondary">
          {termin}
        </button>
      ))}
    </div>
  )
}

function Korpa() {
  // TODO: uzmi termine i akcije iz store-a
  const termini: string[] = []

  return (
    <div className="card stack">
      <strong>U korpi: {termini.length}</strong>
      <ul>
        {termini.map((termin) => (
          <li key={termin} className="row">
            <span>{termin}</span>
            <button className="secondary" aria-label={\`Ukloni \${termin}\`}>×</button>
          </li>
        ))}
      </ul>
      <button>Isprazni</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <Ponuda />
      <Korpa />
    </div>
  )
}
`,
      solution: `import { create } from "zustand"

interface KorpaState {
  termini: string[]
  dodaj: (termin: string) => void
  ukloni: (termin: string) => void
  isprazni: () => void
}

export const useKorpa = create<KorpaState>()((set) => ({
  termini: [],
  dodaj: (termin) =>
    set((s) => ({
      termini: s.termini.includes(termin) ? s.termini : [...s.termini, termin],
    })),
  ukloni: (termin) => set((s) => ({ termini: s.termini.filter((t) => t !== termin) })),
  isprazni: () => set({ termini: [] }),
}))

const PONUDA = ["Pilates 18:00", "Reformer 19:00", "Mat 20:00"]

function Ponuda() {
  const dodaj = useKorpa((s) => s.dodaj)
  return (
    <div className="row">
      {PONUDA.map((termin) => (
        <button key={termin} className="secondary" onClick={() => dodaj(termin)}>
          {termin}
        </button>
      ))}
    </div>
  )
}

function Korpa() {
  const termini = useKorpa((s) => s.termini)
  const ukloni = useKorpa((s) => s.ukloni)
  const isprazni = useKorpa((s) => s.isprazni)

  return (
    <div className="card stack">
      <strong>U korpi: {termini.length}</strong>
      <ul>
        {termini.map((termin) => (
          <li key={termin} className="row">
            <span>{termin}</span>
            <button className="secondary" aria-label={\`Ukloni \${termin}\`} onClick={() => ukloni(termin)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <button onClick={isprazni}>Isprazni</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <Ponuda />
      <Korpa />
    </div>
  )
}
`,
      tests: [
        {
          name: "dodaj() upisuje termin u store",
          code: `useKorpa.getState().dodaj("Pilates 18:00")
expect(useKorpa.getState().termini).toEqual(["Pilates 18:00"])`,
        },
        {
          name: "isti termin se ne dodaje dva puta",
          code: `useKorpa.getState().dodaj("Mat 20:00")
useKorpa.getState().dodaj("Mat 20:00")
expect(useKorpa.getState().termini).toEqual(["Mat 20:00"])`,
        },
        {
          name: "ukloni() i isprazni() rade",
          code: `const { dodaj, ukloni, isprazni } = useKorpa.getState()
dodaj("Pilates 18:00")
dodaj("Mat 20:00")
ukloni("Pilates 18:00")
expect(useKorpa.getState().termini).toEqual(["Mat 20:00"])
isprazni()
expect(useKorpa.getState().termini).toEqual([])`,
        },
        {
          name: "klik u Ponudi menja Korpu, bez props-a",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Pilates 18:00" }))
await click(screen.getByRole("button", { name: "Mat 20:00" }))
expect(screen.getByText("U korpi: 2")).toBeInTheDocument()
expect(screen.getAllByRole("listitem")).toHaveLength(2)`,
        },
        {
          name: "× i Isprazni rade iz Korpe",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Pilates 18:00" }))
await click(screen.getByRole("button", { name: "Reformer 19:00" }))
await click(screen.getByRole("button", { name: "Ukloni Pilates 18:00" }))
expect(screen.getByText("U korpi: 1")).toBeInTheDocument()
await click(screen.getByRole("button", { name: "Isprazni" }))
expect(screen.getByText("U korpi: 0")).toBeInTheDocument()`,
        },
      ],
      hints: [
        "Najlakša je `isprazni: () => set({ termini: [] })`. Za `dodaj` i `ukloni` nova vrednost zavisi od stare, pa koristi oblik sa funkcijom: `set((s) => ({ termini: … }))`.",
        "`ukloni`: `s.termini.filter((t) => t !== termin)`. `dodaj`: ako `s.termini.includes(termin)`, vrati isti niz, inače `[...s.termini, termin]`.",
        "U komponentama: `const dodaj = useKorpa((s) => s.dodaj)` pa `onClick={() => dodaj(termin)}`. U `Korpi` zameni `const termini: string[] = []` sa `useKorpa((s) => s.termini)`.",
      ],
      explanation:
        "`App` nema nijedan `useState`, a `Ponuda` i `Korpa` se ipak savršeno razumeju. Akcije su u store-u, pa svaka komponenta uzme samo ono što joj treba: `Ponuda` jednu funkciju, a `Korpa` niz i dve funkcije. Pravilo za nizove je isto kao kod `useState`-a: uvek nov niz (`filter`, spread), nikad `push`.",
    },
    {
      kind: "exercise",
      id: "zustand-osnove-2",
      title: "Samo ono što ti treba",
      lang: "tsx",
      prompt: `Sve tri komponente čitaju **ceo** store (\`useClan()\` bez selektora), pa se \`Pozdrav\` i \`Zvonce\` crtaju ponovo čak i kad se promeni samo tema. Konzola to pokazuje: klikni **Promeni temu** i gledaj.

1. Napiši akciju \`procitajSve\`: broj nepročitanih postaje 0.
2. U svakoj komponenti zameni destrukturiranje celog store-a **selektorima**, po jedan za svaku vrednost i akciju.

Ne briši \`console.log\` linije: testovi po njima broje crtanja.`,
      starter: `import { create } from "zustand"

interface ClanState {
  ime: string
  neprocitane: number
  tema: "svetla" | "tamna"
  procitajSve: () => void
  promeniTemu: () => void
}

export const useClan = create<ClanState>()((set) => ({
  ime: "Ana",
  neprocitane: 2,
  tema: "svetla",
  procitajSve: () => {
    // TODO
  },
  promeniTemu: () => set((s) => ({ tema: s.tema === "svetla" ? "tamna" : "svetla" })),
}))

function Pozdrav() {
  const { ime } = useClan()
  console.log("crtam Pozdrav")
  return <h3>Zdravo, {ime}!</h3>
}

function Zvonce() {
  const { neprocitane, procitajSve } = useClan()
  console.log("crtam Zvonce")
  return (
    <div className="row">
      <span>Nepročitano: {neprocitane}</span>
      <button className="secondary" onClick={procitajSve}>Pročitaj sve</button>
    </div>
  )
}

function Tema() {
  const { tema, promeniTemu } = useClan()
  return (
    <div className="row">
      <span>Tema: {tema}</span>
      <button onClick={promeniTemu}>Promeni temu</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="card stack">
      <Pozdrav />
      <Zvonce />
      <Tema />
    </div>
  )
}
`,
      solution: `import { create } from "zustand"

interface ClanState {
  ime: string
  neprocitane: number
  tema: "svetla" | "tamna"
  procitajSve: () => void
  promeniTemu: () => void
}

export const useClan = create<ClanState>()((set) => ({
  ime: "Ana",
  neprocitane: 2,
  tema: "svetla",
  procitajSve: () => set({ neprocitane: 0 }),
  promeniTemu: () => set((s) => ({ tema: s.tema === "svetla" ? "tamna" : "svetla" })),
}))

function Pozdrav() {
  const ime = useClan((s) => s.ime)
  console.log("crtam Pozdrav")
  return <h3>Zdravo, {ime}!</h3>
}

function Zvonce() {
  const neprocitane = useClan((s) => s.neprocitane)
  const procitajSve = useClan((s) => s.procitajSve)
  console.log("crtam Zvonce")
  return (
    <div className="row">
      <span>Nepročitano: {neprocitane}</span>
      <button className="secondary" onClick={procitajSve}>Pročitaj sve</button>
    </div>
  )
}

function Tema() {
  const tema = useClan((s) => s.tema)
  const promeniTemu = useClan((s) => s.promeniTemu)
  return (
    <div className="row">
      <span>Tema: {tema}</span>
      <button onClick={promeniTemu}>Promeni temu</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="card stack">
      <Pozdrav />
      <Zvonce />
      <Tema />
    </div>
  )
}
`,
      tests: [
        {
          name: "prikazuje ime i broj nepročitanih",
          code: `await render(App)
expect(screen.getByRole("heading", { name: "Zdravo, Ana!" })).toBeInTheDocument()
expect(screen.getByText("Nepročitano: 2")).toBeInTheDocument()`,
        },
        {
          name: "Pročitaj sve postavlja broj na 0",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Pročitaj sve" }))
expect(screen.getByText("Nepročitano: 0")).toBeInTheDocument()
expect(useClan.getState().neprocitane).toBe(0)`,
        },
        {
          name: "poruka koja stigne spolja (setState) osvežava zvonce",
          code: `await render(App)
useClan.setState({ neprocitane: 5 })
await tick()
expect(screen.getByText("Nepročitano: 5")).toBeInTheDocument()`,
        },
        {
          name: "promena teme ne crta ponovo Pozdrav",
          code: `await render(App)
const pre = logs.filter((l) => l === "crtam Pozdrav").length
expect(pre).toBeGreaterThan(0)
await click(screen.getByRole("button", { name: "Promeni temu" }))
expect(screen.getByText("Tema: tamna")).toBeInTheDocument()
expect(logs.filter((l) => l === "crtam Pozdrav").length).toBe(pre)`,
        },
        {
          name: "promena teme ne crta ponovo Zvonce",
          code: `await render(App)
const pre = logs.filter((l) => l === "crtam Zvonce").length
expect(pre).toBeGreaterThan(0)
await click(screen.getByRole("button", { name: "Promeni temu" }))
expect(screen.getByText("Tema: tamna")).toBeInTheDocument()
expect(logs.filter((l) => l === "crtam Zvonce").length).toBe(pre)`,
        },
      ],
      hints: [
        "`procitajSve: () => set({ neprocitane: 0 })`. Nova vrednost ne zavisi od stare, pa je dovoljan objekat.",
        "Umesto `const { ime } = useClan()` piši `const ime = useClan((s) => s.ime)`. Jedan selektor po vrednosti.",
        "I akcije se biraju selektorom: `const procitajSve = useClan((s) => s.procitajSve)`. Akcija se nikad ne menja, pa ne izaziva crtanje.",
      ],
      explanation:
        "Bez selektora komponenta reaguje na **sve**, a sa selektorom samo na svoje. Ovde je razlika par linija u konzoli, ali u `HomeScreen`-u ReformStudija, koji ima sedam selektora nad `memberStore`-om, to je razlika između ekrana koji se crta kad treba i ekrana koji se crta pri svakom novom obaveštenju.",
    },
    {
      kind: "exercise",
      id: "zustand-osnove-3",
      title: "Rezervacije: get() i getState()",
      lang: "tsx",
      prompt: `Ekran je gotov, a store nije. Napiši:

1. **\`rezervisi(id)\`**: ako termin postoji, ima slobodnih mesta i **nije** već rezervisan, smanji \`slobodno\` za 1, dodaj \`id\` u \`moje\` i vrati \`true\`. Inače ne menjaj ništa i vrati \`false\`.
2. **\`otkazi(id)\`**: ako je termin u \`moje\`, ukloni ga i vrati mu jedno mesto. Ako nije, ne radi ništa.
3. **\`otkaziSve()\`**: obična funkcija **van** store-a i van komponenti (kao \`clearSessionData\` u ReformStudiju) koja otkaže sve rezervacije. Dugme **Otkaži sve** je već povezano sa njom.

Za proveru u akcijama koristi \`get()\`.`,
      starter: `import { create } from "zustand"

interface Termin {
  id: string
  naziv: string
  slobodno: number
}

interface RezervacijeState {
  termini: Termin[]
  /** id-jevi termina koje je član rezervisao */
  moje: string[]
  /** Vraća true ako je rezervacija uspela. */
  rezervisi: (id: string) => boolean
  otkazi: (id: string) => void
}

export const useRezervacije = create<RezervacijeState>()((set, get) => ({
  termini: [
    { id: "t1", naziv: "Pilates 18:00", slobodno: 2 },
    { id: "t2", naziv: "Reformer 19:00", slobodno: 1 },
    { id: "t3", naziv: "Mat 20:00", slobodno: 0 },
  ],
  moje: [],

  rezervisi: (id) => {
    // TODO: proveri pomoću get(), pa set
    return false
  },

  otkazi: (id) => {
    // TODO
  },
}))

// TODO: obična funkcija (ne komponenta) koja otkazuje sve rezervacije
export function otkaziSve() {}

function Termini() {
  const termini = useRezervacije((s) => s.termini)
  const moje = useRezervacije((s) => s.moje)
  const rezervisi = useRezervacije((s) => s.rezervisi)
  const otkazi = useRezervacije((s) => s.otkazi)

  return (
    <ul>
      {termini.map((t) => {
        const mojTermin = moje.includes(t.id)
        return (
          <li key={t.id} className="row">
            <span>{t.naziv} · slobodno: {t.slobodno}</span>
            {mojTermin ? (
              <button className="secondary" aria-label={\`Otkaži \${t.naziv}\`} onClick={() => otkazi(t.id)}>
                Otkaži
              </button>
            ) : (
              <button
                aria-label={\`Rezerviši \${t.naziv}\`}
                disabled={t.slobodno === 0}
                onClick={() => rezervisi(t.id)}
              >
                Rezerviši
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Zaglavlje() {
  const broj = useRezervacije((s) => s.moje.length)
  return (
    <div className="row">
      <strong>Moje rezervacije: {broj}</strong>
      <button className="secondary" onClick={otkaziSve}>Otkaži sve</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="card stack">
      <Zaglavlje />
      <Termini />
    </div>
  )
}
`,
      solution: `import { create } from "zustand"

interface Termin {
  id: string
  naziv: string
  slobodno: number
}

interface RezervacijeState {
  termini: Termin[]
  /** id-jevi termina koje je član rezervisao */
  moje: string[]
  /** Vraća true ako je rezervacija uspela. */
  rezervisi: (id: string) => boolean
  otkazi: (id: string) => void
}

export const useRezervacije = create<RezervacijeState>()((set, get) => ({
  termini: [
    { id: "t1", naziv: "Pilates 18:00", slobodno: 2 },
    { id: "t2", naziv: "Reformer 19:00", slobodno: 1 },
    { id: "t3", naziv: "Mat 20:00", slobodno: 0 },
  ],
  moje: [],

  rezervisi: (id) => {
    const { termini, moje } = get()
    const termin = termini.find((t) => t.id === id)
    if (!termin || termin.slobodno === 0 || moje.includes(id)) return false
    set({
      termini: termini.map((t) => (t.id === id ? { ...t, slobodno: t.slobodno - 1 } : t)),
      moje: [...moje, id],
    })
    return true
  },

  otkazi: (id) => {
    const { termini, moje } = get()
    if (!moje.includes(id)) return
    set({
      termini: termini.map((t) => (t.id === id ? { ...t, slobodno: t.slobodno + 1 } : t)),
      moje: moje.filter((m) => m !== id),
    })
  },
}))

export function otkaziSve() {
  const { moje, otkazi } = useRezervacije.getState()
  for (const id of moje) otkazi(id)
}

function Termini() {
  const termini = useRezervacije((s) => s.termini)
  const moje = useRezervacije((s) => s.moje)
  const rezervisi = useRezervacije((s) => s.rezervisi)
  const otkazi = useRezervacije((s) => s.otkazi)

  return (
    <ul>
      {termini.map((t) => {
        const mojTermin = moje.includes(t.id)
        return (
          <li key={t.id} className="row">
            <span>{t.naziv} · slobodno: {t.slobodno}</span>
            {mojTermin ? (
              <button className="secondary" aria-label={\`Otkaži \${t.naziv}\`} onClick={() => otkazi(t.id)}>
                Otkaži
              </button>
            ) : (
              <button
                aria-label={\`Rezerviši \${t.naziv}\`}
                disabled={t.slobodno === 0}
                onClick={() => rezervisi(t.id)}
              >
                Rezerviši
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Zaglavlje() {
  const broj = useRezervacije((s) => s.moje.length)
  return (
    <div className="row">
      <strong>Moje rezervacije: {broj}</strong>
      <button className="secondary" onClick={otkaziSve}>Otkaži sve</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="card stack">
      <Zaglavlje />
      <Termini />
    </div>
  )
}
`,
      tests: [
        {
          name: "rezervisi() smanjuje broj mesta i pamti termin",
          code: `expect(useRezervacije.getState().rezervisi("t1")).toBe(true)
const s = useRezervacije.getState()
expect(s.moje).toEqual(["t1"])
expect(s.termini.find((t) => t.id === "t1")?.slobodno).toBe(1)`,
        },
        {
          name: "isti termin ne može dva puta",
          code: `const { rezervisi } = useRezervacije.getState()
expect(rezervisi("t1")).toBe(true)
expect(rezervisi("t1")).toBe(false)
expect(useRezervacije.getState().termini.find((t) => t.id === "t1")?.slobodno).toBe(1)
expect(useRezervacije.getState().moje).toEqual(["t1"])`,
        },
        {
          name: "pun termin se ne rezerviše",
          code: `expect(useRezervacije.getState().rezervisi("t3")).toBe(false)
expect(useRezervacije.getState().moje).toEqual([])`,
        },
        {
          name: "otkazi() vraća mesto, a nerezervisan termin ne dira",
          code: `const { rezervisi, otkazi } = useRezervacije.getState()
rezervisi("t2")
expect(useRezervacije.getState().termini.find((t) => t.id === "t2")?.slobodno).toBe(0)
otkazi("t2")
otkazi("t1")
const s = useRezervacije.getState()
expect(s.moje).toEqual([])
expect(s.termini.map((t) => t.slobodno)).toEqual([2, 1, 0])`,
        },
        {
          name: "otkaziSve() radi van komponente",
          code: `const { rezervisi } = useRezervacije.getState()
rezervisi("t1")
rezervisi("t2")
expect(useRezervacije.getState().moje).toHaveLength(2)
otkaziSve()
const s = useRezervacije.getState()
expect(s.moje).toEqual([])
expect(s.termini.map((t) => t.slobodno)).toEqual([2, 1, 0])`,
        },
        {
          name: "ekran prati rezervacije",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Rezerviši Pilates 18:00" }))
expect(screen.getByText("Moje rezervacije: 1")).toBeInTheDocument()
expect(screen.getByText("Pilates 18:00 · slobodno: 1")).toBeInTheDocument()
await click(screen.getByRole("button", { name: "Otkaži sve" }))
expect(screen.getByText("Moje rezervacije: 0")).toBeInTheDocument()
expect(screen.getByText("Pilates 18:00 · slobodno: 2")).toBeInTheDocument()`,
        },
      ],
      hints: [
        "Na početku akcije uzmi trenutno stanje: `const { termini, moje } = get()`, pa nađi termin: `termini.find((t) => t.id === id)`.",
        "Ako termina nema, `slobodno` je 0 ili je `id` već u `moje`, vrati `false`. Inače `set({ termini: termini.map(…), moje: [...moje, id] })` i vrati `true`. U `map`-u menjaš samo termin sa tim `id`-jem: `{ ...t, slobodno: t.slobodno - 1 }`.",
        "`otkaziSve`: `const { moje, otkazi } = useRezervacije.getState()`, pa `for (const id of moje) otkazi(id)`.",
      ],
      explanation:
        "Akcija sme i da vrati vrednost (ovde `boolean`), pa onaj ko je pozove zna da li je uspelo. `get()` je ključan: i provera i izmena gledaju najnovije stanje. U `otkaziSve` svaki `otkazi` odmah menja store, pa sledeći krug petlje već vidi novo stanje, jer Zustand-ov `set` deluje odmah. A dugme samo pozove običnu funkciju, kao što ReformStudio posle otkazivanja pozove `toast(…)`.",
    },
    {
      kind: "quiz",
      id: "zustand-osnove-quiz",
      questions: [
        {
          q: "Šta vraća `create<KorpaState>()((set) => ({ … }))`?",
          options: [
            "Hook (`useKorpa`) koji ima i metode `getState`, `setState` i `subscribe`",
            "Objekat sa podacima, koji se prosleđuje kroz props",
            "Komponentu `Provider` koja mora da obmota aplikaciju",
            "Promise koji se ispuni kad je store spreman",
          ],
          answer: 0,
          why: "Zustand ne traži `Provider`. Hook se uveze i pozove gde god treba, a metode na njemu služe za rad van Reacta.",
        },
        {
          q: "Šta nije u redu sa ovom komponentom?",
          code: `function Pozdrav() {
  const { ime } = useClan()
  return <h3>Zdravo, {ime}!</h3>
}`,
          codeLang: "tsx",
          options: [
            "Crta se ponovo pri svakoj izmeni store-a, čak i kad se `ime` ne promeni",
            "Ne radi: bez selektora hook vraća `undefined`",
            "Ne radi: destrukturiranje store-a nije dozvoljeno",
            "Sve je u redu, ovo je preporučen način",
          ],
          answer: 0,
          why: "Bez selektora hook vraća ceo store i pretplati komponentu na sve. Sa `useClan((s) => s.ime)` crta se samo kad se promeni ime.",
        },
        {
          q: "Store ima `studio`, `select` i `leave`. Šta je u store-u posle `set({ studio: null })`?",
          options: [
            "Sve tri stvari; promenjen je samo `studio`",
            "Samo `studio: null`; akcije su obrisane",
            "Ništa, store je vraćen na početak",
            "Greška, jer `set` mora da dobije funkciju",
          ],
          answer: 0,
          why: "`set` spaja objekat sa postojećim stanjem, na prvom nivou. Zato se uvek prosleđuju samo polja koja se menjaju.",
        },
        {
          q: "Store sadrži `settings: { theme: 'light', currency: 'EUR' }`. Kakav je `settings` posle ove linije?",
          code: `set({ settings: { theme: 'dark' } })`,
          codeLang: "ts",
          options: [
            "`{ theme: 'dark' }`: valuta je izgubljena",
            "`{ theme: 'dark', currency: 'EUR' }`",
            "Ostaje `{ theme: 'light', currency: 'EUR' }`",
            "`set` baci grešku",
          ],
          answer: 0,
          why: "Spajanje radi samo na prvom nivou store-a, pa se `settings` zameni novim objektom. Ispravno je `{ ...get().settings, theme: 'dark' }`, kao u Looply-ju. U TypeScript-u bi ovu grešku podvukao i tip, jer novom objektu fali `currency`.",
        },
        {
          q: "Kako `authStore` prazni `memberStore` pri odjavi, iako nije komponenta?",
          options: [
            "`useMemberStore.getState().clear()`",
            "`useMemberStore((s) => s.clear)()`",
            "Prosledi `clear` kroz props",
            "Ne može; store sme da menja samo sebe",
          ],
          answer: 0,
          why: "Hook sme samo u komponenti. `getState()` radi svuda: u drugim store-ovima, u običnim funkcijama i u handlerima.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-zustand-osnove-1",
      front: "Kako izgleda najmanji tipiziran Zustand store?",
      back: "`create<State>()((set) => ({ podatak: …, akcija: () => set({ … }) }))`. Interfejs `State` opisuje i podatke i akcije.",
    },
    {
      id: "fc-zustand-osnove-2",
      front: "Šta je selektor i zašto je važan?",
      back: "Funkcija `(s) => s.nesto` u `useStore(…)`. Komponenta se ponovo crta samo kad se izabrana vrednost promeni (`Object.is`).",
    },
    {
      id: "fc-zustand-osnove-3",
      front: "`set({ … })` ili `set((s) => …)`?",
      back: "Objekat kad je nova vrednost poznata, funkcija kad zavisi od stare. Oba spajaju rezultat sa store-om, samo na prvom nivou.",
    },
    {
      id: "fc-zustand-osnove-4",
      front: "Čemu služi `get()` u store-u?",
      back: "Čita trenutno stanje unutar akcije, naročito posle `await`-a, kad se store možda promenio dok se čekalo.",
    },
    {
      id: "fc-zustand-osnove-5",
      front: "Kako se store koristi van React komponente?",
      back: "`useStore.getState()` za čitanje i pozivanje akcija, `useStore.setState({ … })` za upis, `useStore.subscribe(fn)` za praćenje izmena.",
    },
  ],
};

export default lesson;
