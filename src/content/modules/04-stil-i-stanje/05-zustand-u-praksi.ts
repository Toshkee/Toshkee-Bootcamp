import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "zustand-u-praksi",
  title: "Zustand u praksi: async, persist i organizacija",
  summary:
    "Kako store priča sa serverom (učitavanje, greška, optimistične izmene), kako `persist` pamti stanje posle osvežavanja, šta ne treba čuvati u store-u i kako odlučiti gde neki podatak živi, uz primere iz ReformStudija, Looply-ja i samog Bootcampa.",
  minutes: 22,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Store-ovi iz prošle lekcije su živeli samo u memoriji i menjali se trenutno. Pravi store-ovi u tvojim projektima rade više: **pitaju server i čekaju odgovor**, **preživljavaju greške**, a neki **pamte stanje** i posle zatvaranja aplikacije. \`memberStore\` u ReformStudiju ima 361 liniju, i skoro sve su baš o tome.

U ovoj lekciji redom: async akcije sa učitavanjem i greškom, optimistične izmene, \`persist\` (i kako sam Bootcamp pamti tvoj napredak), izvedene vrednosti, i na kraju kako odlučiti gde neki podatak uopšte treba da živi.`,
    },
    {
      kind: "prose",
      md: `### Async akcija: učitava se, stiglo je, puklo je

Akcija u store-u može da bude \`async\`. Zustand tu nema ništa posebno: \`set\` se pozove **pre** \`await\`-a, da ekran odmah pokaže učitavanje, i **posle**, kad stigne odgovor ili greška.`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "clanarina.ts",
      code: `interface ClanarinaState {
  status: "idle" | "loading" | "ready" | "error"
  clanarina: Clanarina | null
  greska: string | null
  ucitaj: () => Promise<void>
}

export const useClanarina = create<ClanarinaState>()((set) => ({
  status: "idle",
  clanarina: null,
  greska: null,

  ucitaj: async () => {
    set({ status: "loading", greska: null })
    try {
      const clanarina = await api.clanarina()
      set({ clanarina, status: "ready" })
    } catch (e) {
      set({ status: "error", greska: e instanceof Error ? e.message : "Nešto nije u redu" })
    }
  },
}))`,
      highlight: [2, 14, 17, 19],
      caption:
        "Tri `set`-a, tri trenutka: pre čekanja, posle uspeha, posle greške. U interfejsu akcija vraća `Promise<void>`, jer je `async`.",
    },
    {
      kind: "prose",
      md: "Ekran onda samo čita `status` i bira šta da nacrta. Učitavanje se pokreće iz `useEffect`-a, isto kao u `AppShell`-u ReformStudija (`if (isMember && studioId && loadedFor !== studioId) void load(studioId)`):",
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Clanarina.tsx",
      code: `function Clanarina() {
  const status = useClanarina((s) => s.status)
  const clanarina = useClanarina((s) => s.clanarina)
  const greska = useClanarina((s) => s.greska)
  const ucitaj = useClanarina((s) => s.ucitaj)

  useEffect(() => {
    void ucitaj()
  }, [ucitaj])

  if (status === "idle" || status === "loading") return <p>Učitavanje…</p>
  if (status === "error") return <p role="alert">{greska}</p>
  return <p>Važi do {clanarina?.vaziDo}</p>
}`,
      highlight: [8, 11, 12],
      caption:
        "`void` ispred poziva kaže \"znam da ovo vraća Promise i namerno ga ne čekam\". Akcija sama hvata svoje greške, pa nema šta da se čeka.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Jedan status umesto tri boolean-a",
      md: "Sa `isLoading`, `isError` i `isReady` lako nastane nemoguće stanje: i učitava se i greška je. Jedno polje sa unijom `'idle' | 'loading' | 'ready' | 'error'` može biti tačno jedno od četiri. `memberStore` ima baš takvo polje, a `AppShell` po njemu bira da li crta učitavanje, grešku sa dugmetom \"Pokušaj ponovo\" ili ekran.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: async akcija bez catch-a",
      md: "Ako `await` baci grešku, a nema `try/catch`-a, `set({ status: 'ready' })` se nikad ne izvrši i ekran **zauvek** stoji na učitavanju. ReformStudio ide i korak dalje: zahtev koji \"visi\" bez odgovora prekida se posle 20 sekundi (`LOAD_TIMEOUT_MS`), pa i spora mreža završi greškom, a ne beskonačnim čekanjem.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/store/memberStore.ts",
      lang: "ts",
      startLine: 240,
      intro:
        "Akcija `load` iz `memberStore`-a učitava sve podatke člana za izabrani studio. Isti obrazac kao gore, plus dve zaštite koje pravi svet traži.",
      code: `    load: async (studioId) => {
      if (get().status === 'loading' && get().studioId === studioId) return
      const mine = ++run
      startedAt = Date.now()
      // Rezervacije, pozivi, obavještenja i kilaža pripadaju članu, ne studiju: ostaju na
      // ekranu dok stiže drugi studio. Studio i termini ne.
      set({ studio: null, sessions: [], status: 'loading', studioId, failed: [], error: null })

      const { data, errors } = await fetchAll(studioId)
      if (mine !== run) return

      const failed = failedKeys(errors)
      const coreError = CORE.find((key) => key in errors)
      if (coreError) {
        const error = errors[coreError]
        set({ status: 'error', failed, error })
        reportError(error)
        return
      }
      const inbox = data.notifications ? mergeFirstPage(data.notifications) : {}
      set({ ...data, ...inbox, status: 'ready', failed, error: null })
    },
`,
      steps: [
        {
          lines: 2,
          md: "Zaštita od duplog učitavanja: ako se isti studio već učitava, novi zahtev nije potreban. `get()` čita trenutno stanje unutar akcije.",
        },
        {
          lines: [3, 4],
          md: "`run` je brojač van stanja, obična promenljiva unutar funkcije koja pravi store. Svako učitavanje dobije svoj broj, a `mine` ga zapamti. Zašto, vidi se u liniji 10.",
        },
        {
          lines: [5, 7],
          md: "`set` **pre** `await`-a: ekran odmah prelazi u učitavanje. Studio i termini se brišu, jer pripadaju starom studiju, a rezervacije i obaveštenja ostaju, jer pripadaju članu. Komentar kaže baš to.",
        },
        {
          lines: [9, 10],
          md: "Čekanje na server. Posle `await`-a sledi provera `mine !== run`: ako je u međuvremenu krenulo **novije** učitavanje (član je brzo promenio studio), ovaj stariji odgovor se baca, da ne prepiše novije podatke.",
        },
        {
          lines: [12, 19],
          md: "Greške: ako je palo nešto bez čega ekran ne može (`CORE`: studio, termini, rezervacije), `status` postaje `'error'`. Ako je pala samo dopuna, npr. kilaža, to se zapiše u `failed`, a ekran radi dalje.",
        },
        {
          lines: [20, 21],
          md: "Uspeh: sve što je stiglo ide u store **jednim** `set`-om, zajedno sa `status: 'ready'`. Jedan `set` znači jedno obaveštenje komponentama, pa ekran nikad ne vidi \"pola\" podataka.",
        },
      ],
    },
    {
      kind: "prose",
      md: "Unutar `fetchAll` šest zahteva ide paralelno kroz `Promise.all`, ali svaki je umotan u malu pomoćnu funkciju:",
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio · src/store/memberStore.ts (linije 114–122)",
      code: `type Outcome<T> = { ok: true; value: T } | { ok: false; error: unknown }

const settle = async <T>(run: () => Promise<T>): Promise<Outcome<T>> => {
  try {
    return { ok: true, value: await withTimeout(run, LOAD_TIMEOUT_MS) }
  } catch (error) {
    return { ok: false, error }
  }
}`,
      highlight: [1, 5, 7],
      caption:
        "`settle` nikad ne baca grešku, nego vrati `{ ok: true, value }` ili `{ ok: false, error }`. Zato `Promise.all` ne pada ceo kad padne jedan zahtev: obaveštenja koja nisu stigla ne ruše prikaz termina.",
    },
    {
      kind: "prose",
      md: `### Optimistične izmene

Kad korisnik nešto promeni, postoje dva puta:

- **Pesimistično:** sačekaj server, pa tek onda promeni store. Looply tako radi sa pretplatama, a komentar u \`subscriptionStore\`-u kaže i zašto: *\"state changes only after the write succeeds, so the UI never shows data that was not saved.\"*
- **Optimistično:** promeni store **odmah**, pa čuvaj u pozadini. Ako čuvanje ne uspe, **vrati** staro i javi grešku. Ekran deluje trenutno, bez čekanja.

Optimistično ima smisla za male izmene koje skoro uvek uspeju: prekidač u podešavanjima, \"označi kao pročitano\". Pesimistično je bolje kad server ima poslednju reč: ReformStudio rezervaciju termina prikaže tek kad je server potvrdi, jer se termin u međuvremenu možda popunio.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Dva konobara",
      md: "Optimističan konobar zapiše porudžbinu i odmah donese vodu i hleb. Ako kuhinja javi da nema ribe, vrati se, izvini i ispravi porudžbinu. Pesimističan konobar ode do kuhinje i vrati se tek kad je sve potvrđeno. Prvi deluje brže, a drugi nikad ne mora da se izvinjava.",
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "src/state/settingsStore.ts",
      lang: "ts",
      startLine: 16,
      intro:
        "Looply-jeva podešavanja: tema, valuta, podsetnici, jezik. Prekidač mora da reaguje odmah, pa je `update` optimističan.",
      code: `export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  hydrate(settings) {
    set({ settings });
  },

  async update(patch) {
    const previous = get().settings;
    set({ settings: { ...previous, ...patch } });
    try {
      if (patch.language && patch.language !== previous.language) await changeAppLanguage(patch.language);
      await getServices().settings.save(patch);
    } catch (error) {
      set({ settings: previous });
      if (previous.language && patch.language && patch.language !== previous.language) {
        await changeAppLanguage(previous.language);
      }
      throw error;
    }
  },

  reset() {
    set({ settings: DEFAULT_SETTINGS });
  },
}));
`,
      steps: [
        {
          lines: 1,
          md: "Ovde je `create<SettingsState>(…)` bez praznih zagrada (bez middleware-a to radi), a akcije su napisane kao metode objekta, `hydrate(settings) { … }`, umesto arrow funkcija. Oba oblika rade isto.",
        },
        {
          lines: [4, 6],
          md: "`hydrate` puni store pri pokretanju. To je ona linija iz `bootstrapApp` u prošloj lekciji.",
        },
        {
          lines: [9, 10],
          md: "Koraci 1 i 2: zapamti prethodno stanje, pa odmah upiši novo. Ugnježdeni objekat se spaja ručno, `{ ...previous, ...patch }`. Ekran se osveži pre nego što išta stigne do baze.",
        },
        {
          lines: [11, 13],
          md: "Korak 3, spori deo: promena jezika i upis u SQLite bazu, preko servisa iz `getServices()`.",
        },
        {
          lines: [14, 19],
          md: "Ako bilo šta pukne: vrati `previous`, vrati i jezik, pa **ponovo baci grešku** (`throw error`), da ekran koji je pozvao `update` može da prikaže poruku.",
        },
        {
          lines: [23, 25],
          md: "`reset` vraća podrazumevana podešavanja, jednim `set`-om.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "Ista ideja u ReformStudiju",
      md: "`markRead` u `memberStore`-u radi isto za obaveštenja. Komentar u interfejsu sve kaže u dve rečenice: *\"Tačka nestaje odmah; ako server ne potvrdi, vraća se. Nikad ne baca grešku.\"* Razlika u odnosu na Looply je u poslednjoj rečenici: tačkica koja se vratila nije razlog za poruku na ekranu, pa se greška ne baca dalje.",
    },
    {
      kind: "prose",
      md: `### \`persist\`: stanje koje preživi osvežavanje

Store živi u memoriji: osveži stranicu i sve počinje ispočetka. Za podatke koji moraju da ostanu (podešavanja, korpa, napredak) Zustand ima **middleware** \`persist\`: omotač oko store-a koji posle svakog \`set\`-a upiše stanje u \`localStorage\`, a pri pokretanju ga pročita nazad.`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "korpa.ts",
      code: `import { create } from "zustand"
import { persist } from "zustand/middleware"

interface KorpaState {
  termini: string[]
  otvorena: boolean // panel korpe je otvoren
  dodaj: (termin: string) => void
  prebaci: () => void
}

export const useKorpa = create<KorpaState>()(
  persist(
    (set) => ({
      termini: [],
      otvorena: false,
      dodaj: (termin) => set((s) => ({ termini: [...s.termini, termin] })),
      prebaci: () => set((s) => ({ otvorena: !s.otvorena })),
    }),
    {
      name: "korpa",
      partialize: (s) => ({ termini: s.termini }),
    },
  ),
)`,
      highlight: [2, 12, 20, 21],
      caption:
        "`persist(…)` obmotava istu funkciju `(set) => ({ … })` kao i do sada. Drugi argument su opcije.",
    },
    {
      kind: "prose",
      md: `- **\`name\`** je ključ u \`localStorage\`-u. Pod njim stoji JSON: \`{"state":{"termini":["Pilates 18:00"]},"version":0}\`. Akcije se ne čuvaju: funkcije ne mogu u JSON, a i ne treba, jer dolaze iz koda.
- **\`partialize\`** bira **šta** se čuva. Otvoren panel, učitavanje i greške su stvari trenutka: posle osvežavanja korpa treba da bude puna, ali zatvorena.
- Sada su dva para zagrada obavezna: \`create<KorpaState>()(persist(…))\`. Bez njih TypeScript ne ume da poveže tip store-a sa middleware-om i prijavi grešku.`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "persist u vežbama",
      md: "U vežbama ovde `localStorage` je izolovan peskovnik u memoriji. Testovi mogu da pogledaju šta je upisano, a tvoj pravi napredak u Bootcampu ostaje netaknut.",
    },
    {
      kind: "prose",
      md: `### Ovako Bootcamp pamti tvoj napredak

Svaka rešena vežba, odgovor u kvizu i kartica za ponavljanje u ovoj aplikaciji su u **jednom** Zustand store-u sa \`persist\`-om. Ovo je skraćen \`src/lib/progress.ts\`, iz aplikacije koju upravo koristiš:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "Toshkee-Bootcamp · src/lib/progress.ts (skraćeno)",
      code: `export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,

      touch: () => set((s) => ({ days: withToday(s.days) })),

      visitLesson: (key) => set({ lastLesson: key }),

      // … completeLesson, uncompleteLesson

      markSolved: (id) =>
        set((s) => ({
          solved: { ...s.solved, [id]: s.solved[id] ?? Date.now() },
          days: withToday(s.days),
        })),

      saveDraft: (id, code) => set((s) => ({ drafts: { ...s.drafts, [id]: code } })),

      // … kvizovi, terminal, kartice

      resetAll: () => set(initial),
    }),
    { name: "bootcamp-progress", version: 1 },
  ),
);`,
      highlight: [2, 4, 22, 24],
    },
    {
      kind: "prose",
      md: `- **\`...initial\`**: početno stanje je izdvojeno u konstantu, pa ga \`resetAll\` (brisanje celog napretka) samo ponovo upiše.
- **\`markSolved\`** koristi \`set((s) => …)\` i spread na dva nivoa, jer su \`solved\` i \`days\` objekat i niz unutar store-a. \`?? Date.now()\` čuva vreme **prvog** rešavanja, pa ponovno rešavanje ne pomera datum.
- **\`saveDraft\`** pamti tvoj kod u svakoj vežbi. Zato ga zatekneš i kad se vratiš sutra.
- **\`version: 1\`**: kad se oblik stanja promeni, verzija se poveća i doda se \`migrate\` funkcija koja prevede staro u novo. Bez toga bi stari sačuvani podaci mogli da ne odgovaraju novom kodu.

Probaj: otvori DevTools (Cmd + Option + I), pa **Application** → **Local Storage** → ključ \`bootcamp-progress\`. To je ceo tvoj napredak, kao JSON.`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "Tri načina pamćenja u tvojim projektima",
      md: `Ni ReformStudio ni Looply ne koriste \`persist\`, i za to imaju dobar razlog:

- **ReformStudio** pamti samo izabrani studio, jedan string, ručno: \`localStorage.getItem('reform.studio')\` u \`try/catch\`-u, jer \"localStorage može da baci grešku\" (komentar iz \`studioStore\`-a). Temu mora da primeni pre nego što se React pokrene, a sve ostalo je ionako na serveru.
- **Looply** čuva sve u SQLite bazi na telefonu, a store je samo ogledalo koje \`bootstrapApp\` napuni pri pokretanju.
- **Bootcamp** nema ni server ni bazu, pa je \`persist\` u \`localStorage\` najjednostavnije rešenje.

\`persist\` je pravi izbor kad ceo store, ili njegov veći deo, treba da preživi osvežavanje u browseru.`,
    },
    {
      kind: "playground",
      id: "zustand-praksa-peskovnik",
      title: "persist na delu",
      prompt:
        "Promeni temu i podsetnik. Zatim izmeni bilo šta u kodu, na primer tekst dugmeta: pregled se pokreće iz početka i store se pravi ponovo, a vrednosti ostaju, jer ih `persist` pročita iz `localStorage`-a. Onda u opcije dodaj `partialize: (s) => ({ tema: s.tema })` i gledaj kako `danaPre` nestane iz JSON-a.",
      lang: "tsx",
      code: `import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Podesavanja {
  tema: "svetla" | "tamna"
  danaPre: number
  setTema: (tema: "svetla" | "tamna") => void
  promeni: (za: number) => void
}

const usePodesavanja = create<Podesavanja>()(
  persist(
    (set) => ({
      tema: "svetla",
      danaPre: 1,
      setTema: (tema) => set({ tema }),
      promeni: (za) => set((s) => ({ danaPre: Math.max(0, s.danaPre + za) })),
    }),
    { name: "looply-demo" },
  ),
)

function Kontrole() {
  const tema = usePodesavanja((s) => s.tema)
  const danaPre = usePodesavanja((s) => s.danaPre)
  const setTema = usePodesavanja((s) => s.setTema)
  const promeni = usePodesavanja((s) => s.promeni)

  return (
    <div className={tema === "tamna" ? "dark card stack" : "card stack"} style={{ color: "var(--fg)" }}>
      <div className="row">
        <span>Tema: {tema}</span>
        <button className="secondary" onClick={() => setTema(tema === "svetla" ? "tamna" : "svetla")}>
          Promeni temu
        </button>
      </div>
      <div className="row">
        <span>Podsetnik: {danaPre} dan(a) pre plaćanja</span>
        <button className="secondary" onClick={() => promeni(-1)}>-1</button>
        <button className="secondary" onClick={() => promeni(1)}>+1</button>
      </div>
    </div>
  )
}

function Sacuvano() {
  // Čita iste vrednosti, samo da bi se osvežila posle svake izmene
  const tema = usePodesavanja((s) => s.tema)
  const danaPre = usePodesavanja((s) => s.danaPre)
  const json = localStorage.getItem("looply-demo")

  return (
    <div className="stack">
      <p className="muted">U memoriji: {tema}, {danaPre}</p>
      <p className="muted">U localStorage-u, pod ključem "looply-demo":</p>
      <code>{json ?? "(još ništa)"}</code>
    </div>
  )
}

function App() {
  return (
    <div className="stack">
      <Kontrole />
      <Sacuvano />
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Izvedene vrednosti: izračunaj, ne čuvaj

Broj nepročitanih obaveštenja, ukupan mesečni iznos pretplata, broj predstojećih rezervacija: sve to **može da se izračuna** iz podataka koji su već u store-u. Takve vrednosti ne treba čuvati posebno. Svaka sačuvana kopija je obećanje da će biti ažurirana u **svakoj** akciji koja menja original, a prva zaboravljena akcija pravi bag u kome bedž kaže 3, a lista prikazuje 2.

\`AppShell\` računa sve tri stvari na licu mesta:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/components/AppShell.tsx (isečci)",
      code: `const missing = useMemberStore((s) => s.failed.length > 0)
// …
const unread = useMemberStore((s) => s.notifications.filter((n) => !n.read).length)
// …
const upcomingCount = bookings.filter(
  (b) => b.studioId === studioId && isUpcoming(b, now),
).length`,
      highlight: [1, 3, 5],
      caption:
        "Prve dve se računaju **u selektoru** i vraćaju `boolean` i broj, pa se okvir crta ponovo samo kad se odgovor promeni. Treća zavisi od trenutnog vremena (`now` iz `useNow`), pa se računa **u komponenti**, pri svakom crtanju.",
    },
    {
      kind: "prose",
      md: "Looply radi isto sa novcem: početni ekran uzme `subscriptions` i `currency` iz dva store-a, pa sve zbirove (mesečno, godišnje, sledeće plaćanje) izračuna u jednom `useMemo`-u. Nijedan zbir ne postoji u store-u.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Izvedeno u selektoru: samo broj, tekst ili boolean",
      md: "Primeti da `unread` završava sa `.length`. Selektor `useStore((s) => s.lista.filter(…))` bi pri svakom pozivu vratio **nov niz**, a to u Zustand-u 5 ruši komponentu beskonačnom petljom. Kad ti treba filtriran niz, uzmi ceo niz selektorom, a filtriraj u komponenti (uz `useMemo` ako je skupo).",
    },
    {
      kind: "prose",
      md: `### Jedan veliki store ili više malih?

ReformStudio ima pet store-ova u \`src/store\` (\`authStore\`, \`studioStore\`, \`memberStore\`, \`adminStore\`, \`toastStore\`) i još dva mala, pored logike kojoj pripadaju (\`usePushStore\` i \`useUpdateStore\` u \`src/lib\`). Looply ima dva: \`settingsStore\` i \`subscriptionStore\`. Nijedan projekat nema jedan \"glavni\" store. Pravila koja se iz toga vide:

- **Deli po temi i po životnom veku.** Ono što se briše zajedno, živi zajedno. Pri odjavi \`clearSessionData\` prazni \`memberStore\` i \`adminStore\`, ali ne i \`studioStore\`: izabrani studio preživi odjavu.
- **Mali store je lakši za čitanje i za testove.** \`toastStore\` ima 27 linija i razume se za minut.
- **Store-ovi sarađuju bez trećeg store-a.** Looply-jev \`pro.ts\` spaja \`settingsStore\` i \`subscriptionStore\` u jedan hook, \`useCanAddSubscription()\`, a \`authStore\` zove akcije drugih preko \`getState()\`.
- **Pazi na uvoz u krug.** Ako A uvozi B, a B uvozi A, nešto će pri učitavanju biti \`undefined\`. Zato \`memberStore\` ne uvozi \`authStore\`, nego mu \`authStore\` preda funkciju preko \`setUserSync\` (komentar: \"da se store-ovi ne uvoze ukrug\").`,
    },
    {
      kind: "prose",
      md: `### \`useState\`, props ili store?

Za kraj priče o stanju, jedna tabela za svaku odluku:

| Situacija | Gde | Primer iz tvog koda |
|---|---|---|
| Treba samo jednoj komponenti | \`useState\` | \`visible\` u \`PasswordField\`-u, polja forme u \`ProfileScreen\`-u |
| Treba roditelju i deci odmah ispod | podigni state, prosledi props | izabrana kartica \"Predstojeći / Prošli\" u \`BookingsScreen\`-u |
| Treba udaljenim delovima ili na više ekrana | Zustand store | \`useMemberStore\`, \`useStudioStore\` |
| Treba kodu van Reacta (push, pokretanje, drugi store) | store + \`getState()\` | \`toast()\`, \`bootstrapApp\` |
| Mora da preživi osvežavanje | \`persist\` ili baza | \`bootcamp-progress\`, Looply SQLite |
| Može da se izračuna iz postojećeg | nigde, izračunaj | \`unread\`, \`upcomingCount\` |`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Kreni od najmanjeg",
      md: "Počni sa `useState`. Kad isti prop počne da prolazi kroz komponentu koja ga ne koristi, ili kad dva udaljena ekrana zatraže isti podatak, tada ga preseli u store. Forma za profil u ReformStudiju je dobar primer granice: korisnik je u `authStore`-u, ali polja koja menjaš su lokalni `useState`, a u store idu tek posle čuvanja, kroz `updateProfile`.",
    },
    {
      kind: "exercise",
      id: "zustand-praksa-1",
      title: "Učitaj raspored",
      lang: "tsx",
      prompt: `Lažni server \`api.termini(studio)\` odgovara posle 30 ms, a za nepoznat studio (\`Joga\`) vraća grešku. Akcija \`ucitaj\` trenutno ne prati ništa: nema učitavanja, a greška pukne dalje.

1. U \`ucitaj\`, **pre** čekanja postavi \`status: "loading"\` i obriši staru grešku.
2. Posle uspeha upiši termine i \`status: "ready"\`.
3. Grešku uhvati (\`try/catch\`): \`status: "error"\` i \`greska\` = poruka greške. Akcija ne sme da baci grešku dalje.
4. U \`App\`: dok je \`status\` \`"loading"\`, prikaži **Učitavanje…**, a kad je \`"error"\`, prikaži grešku u \`<p role="alert">\`.`,
      starter: `import { create } from "zustand"

// Lažni server: odgovara posle 30 ms. Za nepoznat studio vraća grešku.
const RASPORED: Record<string, string[]> = {
  Fitness: ["Fitness 17:00", "Fitness 19:00"],
  Pilates: ["Pilates 9:00", "Pilates 18:00", "Pilates 20:00"],
}

const api = {
  termini(studio: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const termini = RASPORED[studio]
        if (termini) resolve(termini)
        else reject(new Error("Studio trenutno ne radi"))
      }, 30)
    })
  },
}

interface RasporedState {
  status: "idle" | "loading" | "ready" | "error"
  termini: string[]
  greska: string | null
  ucitaj: (studio: string) => Promise<void>
}

export const useRaspored = create<RasporedState>()((set) => ({
  status: "idle",
  termini: [],
  greska: null,

  ucitaj: async (studio) => {
    // TODO: status, try/catch, greska
    const termini = await api.termini(studio)
    set({ termini })
  },
}))

export default function App() {
  const status = useRaspored((s) => s.status)
  const termini = useRaspored((s) => s.termini)
  const greska = useRaspored((s) => s.greska)
  const ucitaj = useRaspored((s) => s.ucitaj)

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => ucitaj("Fitness")}>Fitness</button>
        <button onClick={() => ucitaj("Pilates")}>Pilates</button>
        <button className="secondary" onClick={() => ucitaj("Joga")}>Joga</button>
      </div>

      {/* TODO: "Učitavanje…" dok se čeka, greška u <p role="alert"> */}

      <ul>
        {termini.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
`,
      solution: `import { create } from "zustand"

// Lažni server: odgovara posle 30 ms. Za nepoznat studio vraća grešku.
const RASPORED: Record<string, string[]> = {
  Fitness: ["Fitness 17:00", "Fitness 19:00"],
  Pilates: ["Pilates 9:00", "Pilates 18:00", "Pilates 20:00"],
}

const api = {
  termini(studio: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const termini = RASPORED[studio]
        if (termini) resolve(termini)
        else reject(new Error("Studio trenutno ne radi"))
      }, 30)
    })
  },
}

interface RasporedState {
  status: "idle" | "loading" | "ready" | "error"
  termini: string[]
  greska: string | null
  ucitaj: (studio: string) => Promise<void>
}

export const useRaspored = create<RasporedState>()((set) => ({
  status: "idle",
  termini: [],
  greska: null,

  ucitaj: async (studio) => {
    set({ status: "loading", greska: null })
    try {
      const termini = await api.termini(studio)
      set({ termini, status: "ready" })
    } catch (e) {
      // termini: [] da stari raspored ne stoji pored greške
      set({ status: "error", termini: [], greska: e instanceof Error ? e.message : "Nešto nije u redu" })
    }
  },
}))

export default function App() {
  const status = useRaspored((s) => s.status)
  const termini = useRaspored((s) => s.termini)
  const greska = useRaspored((s) => s.greska)
  const ucitaj = useRaspored((s) => s.ucitaj)

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => ucitaj("Fitness")}>Fitness</button>
        <button onClick={() => ucitaj("Pilates")}>Pilates</button>
        <button className="secondary" onClick={() => ucitaj("Joga")}>Joga</button>
      </div>

      {status === "loading" && <p className="muted">Učitavanje…</p>}
      {status === "error" && <p role="alert" className="error">{greska}</p>}

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
          name: "dok se čeka, status je loading, a posle toga ready",
          code: `const p = useRaspored.getState().ucitaj("Pilates")
const tokom = useRaspored.getState().status
await p
expect(tokom).toBe("loading")
expect(useRaspored.getState().status).toBe("ready")
expect(useRaspored.getState().termini).toHaveLength(3)`,
        },
        {
          name: "greška: status error i poruka, a akcija ne puca",
          code: `let puklo = false
try {
  await useRaspored.getState().ucitaj("Joga")
} catch {
  puklo = true
}
expect(puklo).toBe(false)
expect(useRaspored.getState().status).toBe("error")
expect(useRaspored.getState().greska).toBe("Studio trenutno ne radi")`,
        },
        {
          name: "novo učitavanje briše staru grešku",
          code: `await useRaspored.getState().ucitaj("Joga").catch(() => {})
await useRaspored.getState().ucitaj("Fitness")
expect(useRaspored.getState().greska).toBe(null)
expect(useRaspored.getState().status).toBe("ready")`,
        },
        {
          name: "ekran prikazuje Učitavanje…, pa termine",
          code: `await render(App)
await click(screen.getByRole("button", { name: "Pilates" }))
const poruka = screen.queryByText(/^Učitavanje/)
await sleep(80)
expect(poruka).toBeTruthy()
expect(screen.queryByText(/^Učitavanje/)).toBe(null)
expect(screen.getAllByRole("listitem")).toHaveLength(3)`,
        },
        {
          name: "ekran prikazuje grešku u role=\"alert\"",
          code: `await useRaspored.getState().ucitaj("Joga").catch(() => {})
await render(App)
expect(screen.getByRole("alert")).toHaveTextContent("Studio trenutno ne radi")`,
        },
      ],
      hints: [
        "Prva linija akcije, pre `await`-a: `set({ status: \"loading\", greska: null })`.",
        "`await` stavi u `try { … } catch (e) { … }`. U `try`, posle odgovora: `set({ termini, status: \"ready\" })`. U `catch`: `set({ status: \"error\", greska: e instanceof Error ? e.message : \"Greška\" })`.",
        "U JSX-u: `{status === \"loading\" && <p>Učitavanje…</p>}` i `{status === \"error\" && <p role=\"alert\">{greska}</p>}`.",
      ],
      explanation:
        "Akcija nikad ne baca grešku dalje: greška postaje deo stanja (`status: \"error\"` i `greska`), a ekran je samo prikaže. Isto obećanje daje `refresh` u `memberStore`-u (\"Nikad ne baca grešku\"). Zato dugme može da pozove `ucitaj(…)` bez ikakvog `try/catch`-a. U rešenju `catch` briše i stare termine, da raspored drugog studija ne stoji ispod greške.",
    },
    {
      kind: "exercise",
      id: "zustand-praksa-2",
      title: "Pauziraj pretplatu",
      lang: "tsx",
      prompt: `Mini Looply. Klik na **Pauziraj** sada čeka server (pesimistično), a kad server odbije (HBO Max uvek odbije), greška pukne dalje. Uz to, iznos **Mesečno** je sačuvan u store-u i nikad se ne menja.

1. Prepravi \`promeniStatus\` da bude **optimistična**: zapamti prethodne pretplate, **odmah** promeni status (i obriši staru grešku), pa tek onda čekaj \`api.sacuvaj\`.
2. Ako server odbije: vrati prethodne pretplate i upiši poruku u \`greska\`. Akcija ne baca grešku dalje.
3. Obriši \`ukupno\` iz store-a. Neka ga \`Ukupno\` **izračuna** iz aktivnih pretplata, u selektoru.`,
      starter: `import { create } from "zustand"

type Status = "aktivna" | "pauzirana"

interface Pretplata {
  id: string
  naziv: string
  cena: number
  status: Status
}

// Lažni server: čuva posle 30 ms, ali HBO Max uvek odbije.
const api = {
  sacuvaj(id: string, status: Status): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === "hbo") reject(new Error("Server nije dostupan"))
        else resolve()
      }, 30)
    })
  },
}

interface PretplateState {
  pretplate: Pretplata[]
  ukupno: number
  greska: string | null
  promeniStatus: (id: string, status: Status) => Promise<void>
}

export const usePretplate = create<PretplateState>()((set, get) => ({
  pretplate: [
    { id: "netflix", naziv: "Netflix", cena: 1200, status: "aktivna" },
    { id: "spotify", naziv: "Spotify", cena: 800, status: "aktivna" },
    { id: "hbo", naziv: "HBO Max", cena: 900, status: "aktivna" },
  ],
  ukupno: 2900,
  greska: null,

  // Sada je pesimistično: čeka server, a greška pukne dalje.
  promeniStatus: async (id, status) => {
    await api.sacuvaj(id, status)
    set({
      pretplate: get().pretplate.map((p) => (p.id === id ? { ...p, status } : p)),
    })
  },
}))

function Ukupno() {
  const ukupno = usePretplate((s) => s.ukupno)
  return (
    <p>
      <strong>Mesečno: {ukupno} din</strong>
    </p>
  )
}

function Greska() {
  const greska = usePretplate((s) => s.greska)
  return greska ? <p role="alert" className="error">{greska}</p> : null
}

function Lista() {
  const pretplate = usePretplate((s) => s.pretplate)
  const promeniStatus = usePretplate((s) => s.promeniStatus)

  return (
    <ul>
      {pretplate.map((p) => {
        const aktivna = p.status === "aktivna"
        return (
          <li key={p.id} className="row">
            <span>{p.naziv} · {p.cena} din</span>
            <span className="badge">{p.status}</span>
            <button
              className="secondary"
              aria-label={\`\${aktivna ? "Pauziraj" : "Nastavi"} \${p.naziv}\`}
              onClick={() => promeniStatus(p.id, aktivna ? "pauzirana" : "aktivna")}
            >
              {aktivna ? "Pauziraj" : "Nastavi"}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function App() {
  return (
    <div className="card stack">
      <Ukupno />
      <Greska />
      <Lista />
    </div>
  )
}
`,
      solution: `import { create } from "zustand"

type Status = "aktivna" | "pauzirana"

interface Pretplata {
  id: string
  naziv: string
  cena: number
  status: Status
}

// Lažni server: čuva posle 30 ms, ali HBO Max uvek odbije.
const api = {
  sacuvaj(id: string, status: Status): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === "hbo") reject(new Error("Server nije dostupan"))
        else resolve()
      }, 30)
    })
  },
}

interface PretplateState {
  pretplate: Pretplata[]
  greska: string | null
  promeniStatus: (id: string, status: Status) => Promise<void>
}

export const usePretplate = create<PretplateState>()((set, get) => ({
  pretplate: [
    { id: "netflix", naziv: "Netflix", cena: 1200, status: "aktivna" },
    { id: "spotify", naziv: "Spotify", cena: 800, status: "aktivna" },
    { id: "hbo", naziv: "HBO Max", cena: 900, status: "aktivna" },
  ],
  greska: null,

  promeniStatus: async (id, status) => {
    // 1. zapamti, 2. promeni odmah
    const prethodne = get().pretplate
    set({
      pretplate: prethodne.map((p) => (p.id === id ? { ...p, status } : p)),
      greska: null,
    })
    try {
      await api.sacuvaj(id, status)
    } catch (e) {
      // 3. server je odbio: vrati kako je bilo
      set({ pretplate: prethodne, greska: e instanceof Error ? e.message : "Čuvanje nije uspelo" })
    }
  },
}))

function Ukupno() {
  const ukupno = usePretplate((s) =>
    s.pretplate.filter((p) => p.status === "aktivna").reduce((zbir, p) => zbir + p.cena, 0),
  )
  return (
    <p>
      <strong>Mesečno: {ukupno} din</strong>
    </p>
  )
}

function Greska() {
  const greska = usePretplate((s) => s.greska)
  return greska ? <p role="alert" className="error">{greska}</p> : null
}

function Lista() {
  const pretplate = usePretplate((s) => s.pretplate)
  const promeniStatus = usePretplate((s) => s.promeniStatus)

  return (
    <ul>
      {pretplate.map((p) => {
        const aktivna = p.status === "aktivna"
        return (
          <li key={p.id} className="row">
            <span>{p.naziv} · {p.cena} din</span>
            <span className="badge">{p.status}</span>
            <button
              className="secondary"
              aria-label={\`\${aktivna ? "Pauziraj" : "Nastavi"} \${p.naziv}\`}
              onClick={() => promeniStatus(p.id, aktivna ? "pauzirana" : "aktivna")}
            >
              {aktivna ? "Pauziraj" : "Nastavi"}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function App() {
  return (
    <div className="card stack">
      <Ukupno />
      <Greska />
      <Lista />
    </div>
  )
}
`,
      tests: [
        {
          name: "promena se vidi odmah, pre odgovora servera",
          code: `const p = usePretplate.getState().promeniStatus("spotify", "pauzirana")
const odmah = usePretplate.getState().pretplate.find((x) => x.id === "spotify")?.status
await p
expect(odmah).toBe("pauzirana")
expect(usePretplate.getState().pretplate.find((x) => x.id === "spotify")?.status).toBe("pauzirana")`,
        },
        {
          name: "kad server odbije, promena se vraća i upiše se greška",
          code: `const p = usePretplate.getState().promeniStatus("hbo", "pauzirana")
const odmah = usePretplate.getState().pretplate.find((x) => x.id === "hbo")?.status
let puklo = false
try {
  await p
} catch {
  puklo = true
}
expect(odmah).toBe("pauzirana")
expect(usePretplate.getState().pretplate.find((x) => x.id === "hbo")?.status).toBe("aktivna")
expect(usePretplate.getState().greska).toBe("Server nije dostupan")
expect(puklo).toBe(false)`,
        },
        {
          name: "nova promena briše staru grešku",
          code: `await usePretplate.getState().promeniStatus("hbo", "pauzirana").catch(() => {})
await usePretplate.getState().promeniStatus("netflix", "pauzirana")
expect(usePretplate.getState().greska).toBe(null)`,
        },
        {
          name: "Mesečno se odmah računa iz aktivnih pretplata",
          code: `await render(App)
expect(screen.getByText("Mesečno: 2900 din")).toBeInTheDocument()
await click(screen.getByRole("button", { name: "Pauziraj Spotify" }))
const odmah = screen.queryByText("Mesečno: 2100 din")
await sleep(80)
expect(odmah).toBeTruthy()
expect(screen.getByText("Mesečno: 2100 din")).toBeInTheDocument()`,
        },
        {
          name: "ukupno se ne čuva u store-u",
          code: `expect("ukupno" in usePretplate.getState()).toBe(false)`,
        },
        {
          name: "greška se vidi na ekranu, a HBO Max je i dalje aktivan",
          code: `await usePretplate.getState().promeniStatus("hbo", "pauzirana").catch(() => {})
await render(App)
expect(screen.getByRole("alert")).toHaveTextContent("Server nije dostupan")
expect(screen.getByRole("button", { name: "Pauziraj HBO Max" })).toBeInTheDocument()`,
        },
      ],
      hints: [
        "Na početku: `const prethodne = get().pretplate`, pa odmah `set({ pretplate: prethodne.map(…), greska: null })`. Tek onda `await api.sacuvaj(id, status)`.",
        "`await` stavi u `try/catch`. U `catch`: `set({ pretplate: prethodne, greska: e instanceof Error ? e.message : \"…\" })`, bez `throw`.",
        "Obriši `ukupno` iz interfejsa i iz store-a. U `Ukupno`: `usePretplate((s) => s.pretplate.filter((p) => p.status === \"aktivna\").reduce((zbir, p) => zbir + p.cena, 0))`. Selektor vraća broj, pa je bezbedan.",
      ],
      explanation:
        "Ovo su tri koraka Looply-jevog `update`-a: zapamti, promeni odmah, vrati ako ne uspe. Razlika je u kraju: ovde se greška ne baca dalje, nego postaje stanje, kao kod `markRead` u ReformStudiju. Vraćanje cele liste (`prethodne`) je najjednostavnije, ali bi poništilo i neku drugu izmenu napravljenu u istih 30 ms; preciznije je vratiti samo tu jednu stavku. A iznos više ne može da se raziđe sa listom, jer ne postoji kao zaseban podatak.",
    },
    {
      kind: "exercise",
      id: "zustand-praksa-3",
      title: "Podešavanja koja se pamte",
      lang: "tsx",
      prompt: `Podešavanja rade, ali se zaborave pri svakom osvežavanju. Dodaj \`persist\`:

1. Obmotaj store sa \`persist(…)\` i stavi ključ \`name: "podesavanja"\`.
2. Pamte se **samo** \`jezik\` i \`tema\`. \`meniOtvoren\` je stvar trenutka i ne ide u \`localStorage\` (\`partialize\`).

Ekran ne treba menjati.`,
      starter: `import { create } from "zustand"
import { persist } from "zustand/middleware"

type Jezik = "sr" | "en"
type Tema = "svetla" | "tamna"

interface PodesavanjaState {
  jezik: Jezik
  tema: Tema
  /** Samo za ovaj trenutak: posle osvežavanja meni treba da bude zatvoren. */
  meniOtvoren: boolean
  setJezik: (jezik: Jezik) => void
  setTema: (tema: Tema) => void
  prebaciMeni: () => void
}

// TODO: obmotaj sa persist(…), ključ "podesavanja", čuvaj samo jezik i temu
export const usePodesavanja = create<PodesavanjaState>()((set) => ({
  jezik: "sr",
  tema: "svetla",
  meniOtvoren: false,
  setJezik: (jezik) => set({ jezik }),
  setTema: (tema) => set({ tema }),
  prebaciMeni: () => set((s) => ({ meniOtvoren: !s.meniOtvoren })),
}))

export default function App() {
  const jezik = usePodesavanja((s) => s.jezik)
  const tema = usePodesavanja((s) => s.tema)
  const meniOtvoren = usePodesavanja((s) => s.meniOtvoren)
  const setJezik = usePodesavanja((s) => s.setJezik)
  const setTema = usePodesavanja((s) => s.setTema)
  const prebaciMeni = usePodesavanja((s) => s.prebaciMeni)

  return (
    <div className="card stack">
      <div className="row">
        <label htmlFor="jezik">Jezik</label>
        <select id="jezik" value={jezik} onChange={(e) => setJezik(e.target.value as Jezik)}>
          <option value="sr">Srpski</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="row">
        <span>Tema: {tema}</span>
        <button className="secondary" onClick={() => setTema(tema === "svetla" ? "tamna" : "svetla")}>
          Promeni temu
        </button>
      </div>
      <button onClick={prebaciMeni}>Meni</button>
      {meniOtvoren && <p className="muted">Meni je otvoren</p>}
    </div>
  )
}
`,
      solution: `import { create } from "zustand"
import { persist } from "zustand/middleware"

type Jezik = "sr" | "en"
type Tema = "svetla" | "tamna"

interface PodesavanjaState {
  jezik: Jezik
  tema: Tema
  /** Samo za ovaj trenutak: posle osvežavanja meni treba da bude zatvoren. */
  meniOtvoren: boolean
  setJezik: (jezik: Jezik) => void
  setTema: (tema: Tema) => void
  prebaciMeni: () => void
}

export const usePodesavanja = create<PodesavanjaState>()(
  persist(
    (set) => ({
      jezik: "sr",
      tema: "svetla",
      meniOtvoren: false,
      setJezik: (jezik) => set({ jezik }),
      setTema: (tema) => set({ tema }),
      prebaciMeni: () => set((s) => ({ meniOtvoren: !s.meniOtvoren })),
    }),
    {
      name: "podesavanja",
      partialize: (s) => ({ jezik: s.jezik, tema: s.tema }),
    },
  ),
)

export default function App() {
  const jezik = usePodesavanja((s) => s.jezik)
  const tema = usePodesavanja((s) => s.tema)
  const meniOtvoren = usePodesavanja((s) => s.meniOtvoren)
  const setJezik = usePodesavanja((s) => s.setJezik)
  const setTema = usePodesavanja((s) => s.setTema)
  const prebaciMeni = usePodesavanja((s) => s.prebaciMeni)

  return (
    <div className="card stack">
      <div className="row">
        <label htmlFor="jezik">Jezik</label>
        <select id="jezik" value={jezik} onChange={(e) => setJezik(e.target.value as Jezik)}>
          <option value="sr">Srpski</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="row">
        <span>Tema: {tema}</span>
        <button className="secondary" onClick={() => setTema(tema === "svetla" ? "tamna" : "svetla")}>
          Promeni temu
        </button>
      </div>
      <button onClick={prebaciMeni}>Meni</button>
      {meniOtvoren && <p className="muted">Meni je otvoren</p>}
    </div>
  )
}
`,
      tests: [
        {
          name: "izbor jezika se upisuje u localStorage pod ključem \"podesavanja\"",
          code: `usePodesavanja.getState().setJezik("en")
const sacuvano = JSON.parse(localStorage.getItem("podesavanja") ?? "null")
expect(sacuvano?.state?.jezik).toBe("en")`,
        },
        {
          name: "čuvaju se jezik i tema, ali ne i meniOtvoren",
          code: `usePodesavanja.getState().prebaciMeni()
usePodesavanja.getState().setTema("tamna")
const sacuvano = JSON.parse(localStorage.getItem("podesavanja") ?? "null")
expect(sacuvano?.state?.tema).toBe("tamna")
expect(sacuvano?.state?.jezik).toBe("sr")
expect("meniOtvoren" in sacuvano.state).toBe(false)`,
        },
        {
          name: "posle osvežavanja jezik i tema se vraćaju",
          code: `await render(App)
await select(screen.getByLabelText("Jezik"), "en")
await click(screen.getByRole("button", { name: "Promeni temu" }))
const sacuvano = localStorage.getItem("podesavanja")
expect(sacuvano).toBeTruthy()
// "Osvežavanje": memorija se vrati na početak, a localStorage ostaje
usePodesavanja.setState({ jezik: "sr", tema: "svetla" })
localStorage.setItem("podesavanja", sacuvano)
await usePodesavanja.persist.rehydrate()
await tick()
expect(screen.getByLabelText("Jezik")).toHaveValue("en")
expect(screen.getByText("Tema: tamna")).toBeInTheDocument()`,
        },
        {
          name: "posle osvežavanja meni je zatvoren",
          code: `usePodesavanja.getState().prebaciMeni()
usePodesavanja.getState().setJezik("en")
const sacuvano = localStorage.getItem("podesavanja")
expect(sacuvano).toBeTruthy()
usePodesavanja.setState(usePodesavanja.getInitialState(), true)
localStorage.setItem("podesavanja", sacuvano)
await usePodesavanja.persist.rehydrate()
await render(App)
expect(screen.getByLabelText("Jezik")).toHaveValue("en")
expect(screen.queryByText("Meni je otvoren")).toBe(null)`,
        },
      ],
      hints: [
        "Obmotaj funkciju: `create<PodesavanjaState>()(persist((set) => ({ … }), { name: \"podesavanja\" }))`. Pazi na zagrade: `persist(` se zatvara tek posle objekta sa opcijama.",
        "U opcije dodaj `partialize: (s) => ({ jezik: s.jezik, tema: s.tema })`.",
      ],
      explanation:
        "To je ceo `persist`: omotač i dve opcije. Isti oblik ima `useProgress` u Bootcampu (`{ name: \"bootcamp-progress\", version: 1 }`), samo bez `partialize`, jer tamo treba sačuvati sve. U testovima `persist.rehydrate()` glumi osvežavanje stranice: ponovo pročita `localStorage` i upiše ga u store. Pošto `meniOtvoren` nije sačuvan, ostaje početni `false`.",
    },
    {
      kind: "quiz",
      id: "zustand-praksa-quiz",
      questions: [
        {
          q: "Zašto `memberStore` ima jedno polje `status: 'idle' | 'loading' | 'ready' | 'error'` umesto `isLoading` i `isError`?",
          options: [
            "Jedno polje ne može biti u dva stanja odjednom, a dva boolean-a mogu (i učitava se i greška je)",
            "Zato što Zustand ne podržava boolean vrednosti",
            "Zato što se string brže upoređuje",
            "Nema razlike, stvar je ukusa",
          ],
          answer: 0,
          why: "Unija dozvoljava tačno jedno od četiri stanja, pa nemoguće kombinacije ne mogu ni da nastanu.",
        },
        {
          q: "Šta je optimistična izmena?",
          options: [
            "Store se menja odmah, a vraća se na staro ako server odbije",
            "Store se menja tek kad server potvrdi",
            "Izmena se ne šalje serveru",
            "Izmena se ponavlja dok ne uspe",
          ],
          answer: 0,
          why: "Tako rade Looply-jev `update` podešavanja i `markRead` u ReformStudiju. Suprotno, `subscriptionStore` prvo upiše u bazu, pa tek onda menja store.",
        },
        {
          q: "Šta radi `partialize: (s) => ({ tema: s.tema })` u opcijama `persist`-a?",
          options: [
            "U localStorage upisuje samo `tema`; ostala polja žive samo u memoriji",
            "Briše iz store-a sva polja osim `tema`",
            "Deli store na dva manja",
            "Čuva `tema` na serveru",
          ],
          answer: 0,
          why: "Store i dalje ima sva polja. `partialize` samo bira šta ide u JSON pod ključem iz `name`.",
        },
        {
          q: "Zašto ova linija u Zustand-u 5 pravi problem?",
          code: `const aktivne = usePretplate((s) => s.pretplate.filter((p) => p.status === "aktivna"))`,
          codeLang: "tsx",
          options: [
            "`filter` svaki put vraća nov niz, pa React misli da se stanje stalno menja i upada u beskonačnu petlju",
            "`filter` je spor i ne sme u selektor",
            "Selektor mora da vrati string",
            "Nema problema",
          ],
          answer: 0,
          why: "Uzmi ceo niz selektorom pa filtriraj u komponenti (uz `useMemo` po potrebi), vrati broj kao `AppShell` (`.length`), ili koristi `useShallow`.",
        },
        {
          q: "Tekst u polju za pretragu na ekranu Rezervacije. Gde mu je mesto?",
          options: [
            "U `useState`-u tog ekrana",
            "U novom Zustand store-u sa `persist`-om",
            "U `memberStore`-u, pored rezervacija",
            "Ručno u `localStorage`-u",
          ],
          answer: 0,
          why: "Treba samo jednom ekranu i ne mora da preživi osvežavanje. Store je za podatke koje dele udaljeni delovi aplikacije.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-zustand-praksa-1",
      front: "Kako izgleda async akcija sa statusom?",
      back: "`set({ status: 'loading' })`, pa `await` u `try`-u i `set({ podaci, status: 'ready' })`, a u `catch`-u `set({ status: 'error', greska })`.",
    },
    {
      id: "fc-zustand-praksa-2",
      front: "Optimistična izmena u tri koraka?",
      back: "1) zapamti staro (`const previous = get().x`), 2) odmah `set` novo, 3) ako čuvanje padne, `set` staro i prijavi grešku.",
    },
    {
      id: "fc-zustand-praksa-3",
      front: "Kako se dodaje `persist`?",
      back: "`create<State>()(persist((set) => ({ … }), { name: 'kljuc', partialize: (s) => ({ … }) }))`, uz `import { persist } from 'zustand/middleware'`.",
    },
    {
      id: "fc-zustand-praksa-4",
      front: "Izvedena vrednost: čuvati ili računati?",
      back: "Računati: u selektoru ako je rezultat broj, tekst ili boolean, inače u komponenti. Sačuvana kopija se lako raziđe sa originalom.",
    },
    {
      id: "fc-zustand-praksa-5",
      front: "`useState`, props ili store?",
      back: "Jedna komponenta: `useState`. Roditelj i bliska deca: props. Udaljeni delovi, više ekrana ili kod van Reacta: store. Mora da preživi osvežavanje: `persist` ili baza.",
    },
  ],
};

export default lesson;
