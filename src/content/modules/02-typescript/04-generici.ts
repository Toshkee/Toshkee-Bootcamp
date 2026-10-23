import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "generici",
  title: "Generici: tipovi sa parametrom",
  summary:
    "Šta znači `<T>`, kako rade `Array<T>`, `Promise<T>` i `Record<K, V>`, i kako tvoj kod koristi generike u Zustand store-ovima, `useState` i Firestore pomoćnim funkcijama.",
  minutes: 20,
  projects: ["Looply", "ReformStudio", "Pasted"],
  blocks: [
    {
      kind: "prose",
      md: `Uglaste zagrade \`< >\` se u tvom kodu pojavljuju stalno: \`useState<string | null>(null)\`, \`create<SettingsState>(...)\`, \`Promise<void>\`, \`Record<StudioId, number>\`. To su **generici**, i deluju strašno samo dok ne shvatiš jednu stvar:

**Generik je tip koji prima drugi tip kao argument.** Kao što funkcija prima vrednost u običnim zagradama \`( )\`, generički tip prima tip u uglastim \`< >\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kutija sa nalepnicom",
      md: "`Array` je kutija. Ali kutija za šta? `Array<string>` je kutija na kojoj piše *samo tekstovi*, a `Array<BookingDoc>` kutija na kojoj piše *samo rezervacije*. Kutija se ponaša isto (možeš da dodaš, izvadiš, prebrojiš), a nalepnica kaže TypeScriptu šta će izaći kad nešto izvadiš.",
    },
    {
      kind: "prose",
      md: `### Generici koje već koristiš

Neke generike koristiš svaki dan, čak i bez tog imena:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `// Niz: dva zapisa za istu stvar
const tokeni: string[] = []
const tokeni2: Array<string> = []

// Promise<T>: "obećanje da će stići T"
async function buyPro(): Promise<boolean> { /* ... */ }
const uspeh = await buyPro()        // uspeh: boolean

// Record<K, V>: objekat čiji su ključevi K, a vrednosti V
const kapacitet: Record<StudioId, number> = {
  fitness: 5,
  pilates: 5,
}

// Map<K, V>: isto, ali kao Map struktura
const poDanu = new Map<string, BookingDoc[]>()`,
      highlight: [3, 6, 10, 16],
      caption:
        "`buyPro` je iz Looply-ja (`src/state/pro.ts`), a `Record<StudioId, number>` je skraćen `DEFAULT_CAPACITY` iz ReformStudio `config.ts`.",
    },
    {
      kind: "prose",
      md: `Primeti \`Promise<boolean>\`: \`async\` funkcija **uvek** vraća Promise, a generički parametar kaže šta dobijaš posle \`await\`. Zato \`Promise<void>\` znači *nešto će se završiti, ali ništa ne vraća*.

\`Record<StudioId, number>\` je posebno koristan: TypeScript traži da objekat ima **svaki** ključ iz \`StudioId\`. Kad dodaš treći studio u \`STUDIO_IDS\`, svaki takav \`Record\` u projektu postane greška dok ne dopišeš vrednost za novi studio.`,
    },
    {
      kind: "prose",
      md: `### Zašto ne samo any?

Zamisli funkciju koja vraća prvi element niza. Bez generika imaš dve loše opcije: da napišeš posebnu funkciju za svaki tip, ili da koristiš \`any\` i izgubiš svaku proveru.`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `// ❌ any: radi, ali TypeScript "zaboravi" tip
function prviAny(niz: any[]): any {
  return niz[0]
}
const a = prviAny(["Ana", "Marko"])   // a: any
a.toFixed(2)                          // nema greške, a pući će u runtime-u

// ✅ generik: T je "rupa" koja se popuni tipom pri pozivu
function prvi<T>(niz: T[]): T | undefined {
  return niz[0]
}
const b = prvi(["Ana", "Marko"])      // b: string | undefined
const c = prvi([3, 7, 12])            // c: number | undefined`,
      highlight: [6, 9, 12, 13],
      caption:
        "`<T>` posle imena funkcije uvodi **parametar tipa**. Pri pozivu TypeScript pogleda argument (`string[]`) i zaključi `T = string`. Ne moraš da pišeš `prvi<string>(...)`.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "Zašto baš T?",
      md: "`T` je samo konvencija (od *Type*), kao `i` u `for` petlji. Može bilo koje ime. Kad ih ima više, često se koriste `K` (key), `V` (value) ili opisna imena kao `TState`.",
    },
    {
      kind: "prose",
      md: `### Kad generik moraš da napišeš sam: useState

Najčešće TypeScript sam zaključi \`T\` iz argumenta. Ali ponekad argument **ne govori dovoljno**. Klasičan primer je \`useState\` sa početnom vrednošću \`null\`:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Pasted/src/components/media/Cursor.tsx",
      code: `const [label, setLabel] = useState<string | null>(null);

// Bez <string | null>, TypeScript bi iz useState(null) zaključio
// da je stanje UVEK null:
const [losa, setLosa] = useState(null)
setLosa("View")   // ❌ Argument of type '"View"' is not assignable
                  //    to parameter of type 'SetStateAction<null>'.`,
      highlight: [1, 6],
      caption:
        "Prva linija je iz tvog Pasted sajta. Pravilo: kad je početna vrednost `null`, `[]` ili `{}`, napiši generik. Kad je `false`, `0` ili `''`, inferencija je dovoljna.",
    },
    {
      kind: "prose",
      md: `### Zustand: create<State>()

U Looply-ju svaki store počinje sa \`create<NekiState>(...)\`. Tu generik kaže Zustand-u kakav je oblik stanja, a Zustand to onda koristi da tipizuje \`set\`, \`get\` i svaki hook koji čita store.`,
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "src/state/settingsStore.ts",
      lang: "ts",
      startLine: 8,
      intro: "Store sa podešavanjima aplikacije (jezik, valuta...). Prati kako jedan interfejs tipizuje sve ispod.",
      code: `interface SettingsState {
  settings: AppSettings;
  hydrate(settings: AppSettings): void;
  /** Applies the change immediately and persists it; reverts if saving fails. */
  update(patch: Partial<AppSettings>): Promise<void>;
  reset(): void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  hydrate(settings) {
    set({ settings });
  },

  async update(patch) {
    const previous = get().settings;
    set({ settings: { ...previous, ...patch } });
`,
      steps: [
        {
          lines: [1, 7],
          md: "Interfejs opisuje ceo store: podatke (`settings`) i akcije (`hydrate`, `update`, `reset`). Metode u interfejsu mogu da se pišu kao `ime(parametri): povratniTip`.",
        },
        {
          lines: 5,
          md: "Dva generika u jednoj liniji. `Partial<AppSettings>` je `AppSettings` u kome su **sva polja opciona** (možeš da pošalješ samo `{ currency: 'EUR' }`), o tome u sledećoj lekciji. `Promise<void>` kaže da je akcija asinhrona i ne vraća vrednost.",
        },
        {
          lines: 9,
          md: "`create<SettingsState>(...)`: ovde se `T` popunjava ručno, jer Zustand ne može da pogodi tip stanja iz funkcije koja ga tek pravi. Od ove tačke, `set` prima samo delove `SettingsState`, a `get()` vraća ceo `SettingsState`.",
        },
        {
          lines: [12, 14],
          md: "`hydrate(settings)` nema tip parametra, a ipak nema greške *implicit any*. TypeScript ga uzima iz interfejsa (`settings: AppSettings`). To se zove **kontekstualno tipizovanje**: tip dolazi iz mesta gde se funkcija koristi.",
        },
        {
          lines: [16, 18],
          md: "Isto za `update(patch)`: `patch` je `Partial<AppSettings>`. `get().settings` je `AppSettings`, pa spajanje `{ ...previous, ...patch }` daje pun objekat podešavanja.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Pisanje sopstvenih generika

Generik pišeš kad funkcija ili tip **radi isto za bilo koji tip**, a želiš da sačuvaš informaciju o tom tipu. Tvoj ReformStudio backend ima savršen primer: Firestore vraća dokument i njegov ID odvojeno, a tebi treba objekat koji ima oba.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/lib/db.ts",
      lang: "ts",
      startLine: 98,
      intro: "Tri generika u 15 linija. Koriste se u skoro svakom handler-u backend-a.",
      code: `export type WithId<T> = T & { id: string }

/** Dokument sa ID-jem, ili \`null\` ako ne postoji. */
export const withId = <T>(snapshot: {
  id: string
  exists: boolean
  data(): T | undefined
}): WithId<T> | null => {
  const data = snapshot.data()
  return snapshot.exists && data ? { ...data, id: snapshot.id } : null
}

/** Svi dokumenti upita, sa ID-jem. */
export const allWithId = <T>(snapshot: QuerySnapshot<T>): WithId<T>[] =>
  snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
`,
      steps: [
        {
          lines: 1,
          md: "**Generički tip**. `T & { id: string }` znači *sva polja iz `T` **i** polje `id`* (`&` se zove *intersection*). `WithId<BookingDoc>` je rezervacija sa ID-jem, `WithId<UserDoc>` korisnik sa ID-jem. Jedan tip, beskonačno upotreba.",
        },
        {
          lines: 4,
          md: "Kod arrow funkcije, `<T>` stoji **pre zagrade sa parametrima**: `<T>(snapshot) => ...`. To je ista ideja kao `function withId<T>(...)`.",
        },
        {
          lines: [5, 7],
          md: "Parametar je opisan na licu mesta: bilo koji objekat sa `id`, `exists` i metodom `data()` koja vraća `T` ili `undefined`. Kad proslediš Firestore snapshot rezervacije, TypeScript iz `data()` zaključi `T = BookingDoc`.",
        },
        {
          lines: [8, 10],
          md: "Povratni tip `WithId<T> | null`: ili dokument sa ID-jem, ili `null` ako ne postoji. Pozivalac **mora** da obradi `null` pre upotrebe, pa ne može slučajno da čita polja nepostojećeg dokumenta.",
        },
        {
          lines: [14, 15],
          md: "`allWithId` radi isto za ceo upit. `QuerySnapshot<T>` je Firestore-ov generički tip, a rezultat je `WithId<T>[]`, niz. U `handlers/schedule.ts` vidiš ga kao `allWithId(slots)` bez ikakvih `< >`, jer TypeScript sve zaključi sam.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Ograničenje: T extends ...

Ponekad \`T\` ne sme biti baš bilo šta. U Looply-ju, \`SegmentedControl\` (dugmad tipa *Lista / Mesec* na ekranu kalendara) prima opcije čije su vrednosti tekstovi:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Looply/src/components/ui/SegmentedControl.tsx",
      code: `export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedControlProps<T>) {`,
      highlight: [1, 9, 13],
      caption:
        "`T extends string` znači: *T može biti bilo koji tekstualni tip*, recimo `'list' | 'month'`. Zahvaljujući tome, `onChange` u komponenti koja koristi `SegmentedControl` dobija baš `'list' | 'month'`, a ne običan `string`.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Ne pravi generik bez potrebe",
      md: "Ako se `T` pojavljuje **samo na jednom mestu** u potpisu, generik ništa ne povezuje i ne treba ti. Generik ima smisla kad povezuje ulaz i izlaz (*šta uđe kao `T`, izađe kao `T`*) ili dva parametra međusobno. AI ponekad generiše `<T>` gde bi običan tip bio jasniji.",
    },
    {
      kind: "exercise",
      id: "ts-generici-1",
      title: "Poslednji element",
      lang: "ts",
      prompt: `Napiši generičku funkciju \`poslednji\` koja vraća poslednji element niza, ili \`undefined\` ako je niz prazan.

Linije ispod funkcije **ne menjaj**: one proveravaju da funkcija radi sa brojevima i sa tekstom. Linija sa \`// @ts-expect-error\` je test za tipove: ona *očekuje* grešku u sledećoj liniji. Ako tvoja funkcija vraća \`any\`, greške neće biti, i TypeScript će se buniti da je \`@ts-expect-error\` nepotreban.`,
      starter: `function poslednji(niz) {
  // TODO
}

const zadnjiBroj = poslednji([3, 7, 12])
const duplo: number = (zadnjiBroj ?? 0) * 2

const zadnjeIme = poslednji(["Ana", "Marko"])
const veliko: string = (zadnjeIme ?? "").toUpperCase()

// @ts-expect-error: broj ne sme da se dodeli tekstu
const pogresno: string = poslednji([1, 2, 3])

console.log(duplo, veliko)
`,
      solution: `function poslednji<T>(niz: T[]): T | undefined {
  return niz[niz.length - 1]
}

const zadnjiBroj = poslednji([3, 7, 12])
const duplo: number = (zadnjiBroj ?? 0) * 2

const zadnjeIme = poslednji(["Ana", "Marko"])
const veliko: string = (zadnjeIme ?? "").toUpperCase()

// @ts-expect-error: broj ne sme da se dodeli tekstu
const pogresno: string = poslednji([1, 2, 3])

console.log(duplo, veliko)
`,
      tests: [
        { name: "poslednji([3, 7, 12]) vraća 12", code: "expect(poslednji([3, 7, 12])).toBe(12)" },
        { name: "poslednji([\"Ana\", \"Marko\"]) vraća \"Marko\"", code: 'expect(poslednji(["Ana", "Marko"])).toBe("Marko")' },
        { name: "prazan niz daje undefined", code: "expect(poslednji([])).toBe(undefined)" },
        { name: "ispisuje 24 MARKO", code: 'expect(logs).toContain("24 MARKO")' },
      ],
      hints: [
        "Potpis generičke funkcije: `function poslednji<T>(niz: T[]): ...`",
        "Povratni tip je `T | undefined`, jer prazan niz nema poslednji element.",
        "Telo: `return niz[niz.length - 1]`. Za prazan niz to je `niz[-1]`, što je `undefined`.",
      ],
      explanation:
        "`T` povezuje ulaz i izlaz: ako uđe `number[]`, izlazi `number | undefined`. Sa `any` bi `pogresno` tiho dobio broj iako je obećan tekst, a to je baš vrsta greške koju TypeScript treba da hvata.",
    },
    {
      kind: "exercise",
      id: "ts-generici-2",
      title: "Grupisanje po ključu",
      lang: "ts",
      prompt: `Potpis funkcije \`grupisi\` je već napisan, a ti napiši telo. Funkcija dobija niz stavki bilo kog tipa i funkciju \`kljucZa\` koja za svaku stavku kaže u koju grupu ide. Vraća \`Record<string, T[]>\`: objekat čiji je ključ ime grupe, a vrednost niz stavki u toj grupi.

Na primer, rezervacije grupisane po studiju: \`{ fitness: [r1, r3], pilates: [r2] }\`.`,
      starter: `interface Rezervacija {
  id: string
  studio: string
}

function grupisi<T>(stavke: T[], kljucZa: (stavka: T) => string): Record<string, T[]> {
  const grupe: Record<string, T[]> = {}
  // TODO: za svaku stavku izračunaj ključ i dodaj stavku u grupu
  return grupe
}

const rezervacije: Rezervacija[] = [
  { id: "r1", studio: "fitness" },
  { id: "r2", studio: "pilates" },
  { id: "r3", studio: "fitness" },
]
const poStudiju = grupisi(rezervacije, (r) => r.studio)
console.log(Object.keys(poStudiju))
`,
      solution: `interface Rezervacija {
  id: string
  studio: string
}

function grupisi<T>(stavke: T[], kljucZa: (stavka: T) => string): Record<string, T[]> {
  const grupe: Record<string, T[]> = {}
  for (const stavka of stavke) {
    const kljuc = kljucZa(stavka)
    if (!grupe[kljuc]) grupe[kljuc] = []
    grupe[kljuc].push(stavka)
  }
  return grupe
}

const rezervacije: Rezervacija[] = [
  { id: "r1", studio: "fitness" },
  { id: "r2", studio: "pilates" },
  { id: "r3", studio: "fitness" },
]
const poStudiju = grupisi(rezervacije, (r) => r.studio)
console.log(Object.keys(poStudiju))
`,
      tests: [
        {
          name: "fitness grupa ima r1 i r3",
          code: 'expect(poStudiju.fitness.map((r) => r.id)).toEqual(["r1", "r3"])',
        },
        {
          name: "pilates grupa ima r2",
          code: 'expect(poStudiju.pilates.map((r) => r.id)).toEqual(["r2"])',
        },
        {
          name: "radi i sa tekstovima (po prvom slovu)",
          code: 'expect(grupisi(["ana", "aca", "bole"], (s) => s[0])).toEqual({ a: ["ana", "aca"], b: ["bole"] })',
        },
        { name: "prazan niz daje prazan objekat", code: "expect(grupisi([], (x) => String(x))).toEqual({})" },
      ],
      hints: [
        "Prođi kroz stavke sa `for (const stavka of stavke) { ... }`.",
        "Unutar petlje: `const kljuc = kljucZa(stavka)`. Ako `grupe[kljuc]` još ne postoji, napravi prazan niz.",
        "`if (!grupe[kljuc]) grupe[kljuc] = []` pa `grupe[kljuc].push(stavka)`.",
      ],
      explanation:
        "Pređi mišem preko `r` u `(r) => r.studio`: TypeScript zna da je `Rezervacija`, jer je `T` zaključen iz prvog argumenta. Zato ti nudi `r.studio` i odbija `r.studijo`. Ista funkcija radi i za tekstove, a TypeScript svaki put zna tačan tip.",
    },
    {
      kind: "exercise",
      id: "ts-generici-3",
      title: "Mini Zustand",
      lang: "ts",
      prompt: `Ovo je minijaturna verzija Zustand-ovog \`create\`. Trenutno koristi \`any\`, pa TypeScript ne proverava ništa, i ne prihvata \`<BrojacState>\` (greška *Expected 0 type arguments*).

**Zadatak:** napravi \`napraviStore\` generičkom: dodaj parametar tipa \`S\` i zameni svaki \`any\` sa \`S\`. Kad uspeš, nestaće i greška kod \`@ts-expect-error\` (sada TypeScript zaista vidi da \`'puno'\` nije broj).`,
      starter: `function napraviStore(pocetno: any) {
  let stanje = pocetno
  return {
    get: () => stanje,
    set: (izmena: (staro: any) => any) => {
      stanje = izmena(stanje)
    },
  }
}

interface BrojacState {
  broj: number
  korak: number
}

const store = napraviStore<BrojacState>({ broj: 0, korak: 2 })
store.set((s) => ({ ...s, broj: s.broj + s.korak }))
console.log(store.get().broj)

function nikadNePozivaj() {
  // @ts-expect-error: broj mora biti number
  store.set((s) => ({ ...s, broj: "puno" }))
}
`,
      solution: `function napraviStore<S>(pocetno: S) {
  let stanje = pocetno
  return {
    get: () => stanje,
    set: (izmena: (staro: S) => S) => {
      stanje = izmena(stanje)
    },
  }
}

interface BrojacState {
  broj: number
  korak: number
}

const store = napraviStore<BrojacState>({ broj: 0, korak: 2 })
store.set((s) => ({ ...s, broj: s.broj + s.korak }))
console.log(store.get().broj)

function nikadNePozivaj() {
  // @ts-expect-error: broj mora biti number
  store.set((s) => ({ ...s, broj: "puno" }))
}
`,
      tests: [
        { name: "posle jednog set-a broj je 2", code: "expect(store.get().broj).toBe(2)" },
        {
          name: "drugi store sa drugim tipom radi nezavisno",
          code: 'const s2 = napraviStore({ ime: "Ana" })\ns2.set((s) => ({ ime: s.ime + "!" }))\nexpect(s2.get().ime).toBe("Ana!")\nexpect(store.get().broj).toBe(2)',
        },
        { name: "ispisuje 2", code: 'expect(logs).toContain("2")' },
      ],
      hints: [
        "Parametar tipa se dodaje posle imena funkcije: `function napraviStore<S>(pocetno: S)`.",
        "I `izmena` treba da zna tip: `(staro: S) => S`.",
        "`stanje` ne moraš da tipizuješ: TypeScript ga zaključi iz `pocetno`, koje je sad `S`.",
      ],
      explanation:
        "Ovo je suština `create<SettingsState>()` iz Looply-ja: jedan generički parametar, i sve unutar store-a (`get`, `set`, callback-ovi) zna tačan oblik stanja. Primeti da `s` u `store.set((s) => ...)` nema anotaciju, a ipak je `BrojacState`.",
    },
    {
      kind: "quiz",
      id: "ts-generici-quiz",
      questions: [
        {
          q: "Šta je `Array<BookingDoc>`?",
          options: [
            "Jedan `BookingDoc` objekat",
            "Isto što i `BookingDoc[]`",
            "Niz bilo čega, `BookingDoc` je samo komentar",
            "Funkcija koja pravi `BookingDoc`",
          ],
          answer: 1,
          why: "`T[]` i `Array<T>` su dva zapisa za isti tip. Kraći zapis `T[]` je češći u praksi.",
        },
        {
          q: "Koji je tip `x`?",
          code: `async function ucitaj(): Promise<number> { return 42 }

async function main() {
  const x = await ucitaj()
}`,
          codeLang: "ts",
          options: ["`Promise<number>`", "`number`", "`any`", "`void`"],
          answer: 1,
          why: "`await` „otpakuje” Promise. Bez `await`, `ucitaj()` bi bio `Promise<number>`.",
        },
        {
          q: "Zašto `useState(null)` bez generika pravi problem?",
          options: [
            "Ne pravi problem, TypeScript pogodi tip kasnije",
            "TypeScript zaključi da je stanje uvek `null`, pa `setX(\"tekst\")` postaje greška",
            "React ne dozvoljava `null` kao početnu vrednost",
            "Stanje postaje `any`",
          ],
          answer: 1,
          why: "Inferencija gleda samo početnu vrednost. Zato pišeš `useState<string | null>(null)`: kažeš unapred koje sve vrednosti stanje može imati.",
        },
        {
          q: "Šta TypeScript traži za ovaj objekat?",
          code: "const labele: Record<'lower' | 'upper' | 'cardio', string> = { ... }",
          codeLang: "ts",
          options: [
            "Bilo koji objekat sa tekstualnim vrednostima",
            "Tačno ključeve `lower`, `upper` i `cardio`, svaki sa tekstom",
            "Bar jedan od tri ključa",
            "Niz od tri teksta",
          ],
          answer: 1,
          why: "`Record<K, V>` traži **svaki** ključ iz `K`. Ako fali `cardio`, greška je `Property 'cardio' is missing`. Kad treba da ključevi budu opcioni, koristi se `Partial<Record<K, V>>`.",
        },
        {
          q: "Koji je tip `rez` ako je `snap` Firestore snapshot sa `data(): UserDoc | undefined`?",
          code: "const rez = withId(snap)",
          codeLang: "ts",
          options: [
            "`UserDoc`",
            "`WithId<UserDoc>`",
            "`WithId<UserDoc> | null`",
            "`any`",
          ],
          answer: 2,
          why: "TypeScript iz `data()` zaključi `T = UserDoc`, a `withId` vraća `WithId<T> | null`. Pre čitanja polja moraš proveriti da `rez` nije `null`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-ts-generici-1",
      front: "Šta znači `<T>` u `function prvi<T>(niz: T[]): T`?",
      back: "`T` je parametar tipa: „rupa” koju TypeScript popuni pri pozivu, najčešće iz argumenta. Povezuje ulaz i izlaz.",
    },
    {
      id: "fc-ts-generici-2",
      front: "Kada moraš ručno da napišeš generik u `useState`?",
      back: "Kad početna vrednost ne govori ceo tip: `useState<string | null>(null)`, `useState<Booking[]>([])`.",
    },
    {
      id: "fc-ts-generici-3",
      front: "Šta je `Record<K, V>`?",
      back: "Objekat čiji su ključevi tipa `K`, a vrednosti tipa `V`. Sa union ključem (`Record<StudioId, number>`) traži svaki ključ.",
    },
    {
      id: "fc-ts-generici-4",
      front: "Šta radi `create<SettingsState>()` u Zustand-u?",
      back: "Kaže Zustand-u oblik stanja, pa su `set`, `get` i hook `useSettingsStore` tipizovani prema `SettingsState`.",
    },
    {
      id: "fc-ts-generici-5",
      front: "Šta znači `T extends string`?",
      back: "Ograničenje: `T` može biti bilo koji tip koji je tekst (npr. `'list' | 'month'`), ali ne broj ili objekat.",
    },
  ],
};

export default lesson;
