import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "utility-tipovi",
  title: "Utility tipovi: novi tipovi od postojećih",
  summary:
    "Kako da od jednog tipa izvedeš varijante umesto da ga kopiraš: `keyof`, `typeof`, `Partial`, `Pick`, `Omit`, `Required`, `ReturnType` i `satisfies`.",
  minutes: 18,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Imaš \`interface UserDoc\` sa desetak polja. Sad ti trebaju varijante tog tipa:

- forma za izmenu profila menja samo **neka** polja,
- funkcija za prikaz imena treba **samo** \`firstName\` i \`lastName\`,
- za novog člana \`id\` i \`createdAt\` još **ne postoje**.

Prva ideja je da napišeš nove interfejse i prepišeš polja. Problem: kad sutra dodaš polje u \`UserDoc\`, kopije ostanu stare. Umesto kopiranja, TypeScript ima **utility tipove**: generike iz prethodne lekcije koji od postojećeg tipa prave novi.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao filteri na fotografiji",
      md: "Original fotografije se ne menja, a ti primeniš filter: crno-belo, isečak, zamućena pozadina. `Partial<UserDoc>`, `Pick<UserDoc, 'firstName'>` i `Omit<UserDoc, 'email'>` su filteri nad istim tipom. Kad se original promeni, svaki filter automatski radi nad novom verzijom.",
    },
    {
      kind: "prose",
      md: `### keyof i typeof

Ova dva operatora su sirovina za sve ostalo:

- **\`keyof Tip\`** daje union svih ključeva tipa.
- **\`typeof vrednost\`** (u poziciji tipa) daje tip neke **vrednosti**. Upoznali smo ga kod \`typeof STUDIO_IDS\`.`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `type Form = { firstName: string; lastName: string; phone: string }

type FormKey = keyof Form
// 'firstName' | 'lastName' | 'phone'

const DEFAULT_SETTINGS = { currency: 'RSD', language: 'sr', reminders: true }
type Settings = typeof DEFAULT_SETTINGS
// { currency: string; language: string; reminders: boolean }`,
      highlight: [3, 7],
      caption:
        "`typeof` je zgodan kad vrednost već postoji, pa ne želiš da isti oblik pišeš dva puta.",
    },
    {
      kind: "prose",
      md: `### Partial i Record: forma sa greškama

\`Partial<T>\` pravi kopiju tipa u kojoj su **sva polja opciona**. Idealno za greške u formi: na početku nema nijedne, a kasnije neka polja imaju poruku, a neka ne.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/screens/ProfileScreen.tsx",
      lang: "tsx",
      startLine: 41,
      intro: "Početak ekrana Profil. Prve dve linije su mala lekcija iz utility tipova.",
      code: `type Form = { firstName: string; lastName: string; phone: string }
type Errors = Partial<Record<keyof Form, string>>
export const ProfileScreen = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const logout = useAuthStore((s) => s.logout)
  const studioId = useStudioStore((s) => s.studio)

  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState<Form>({ firstName: '', lastName: '', phone: '' })
  const [errors, setErrors] = useState<Errors>({})
`,
      steps: [
        {
          lines: 1,
          md: "`Form` opisuje polja koja korisnik menja. Napisano je sa `type` u jednoj liniji, što je sasvim u redu za mali, lokalni tip.",
        },
        {
          lines: 2,
          md: "Čitaj **iznutra ka spolja**: `keyof Form` je `'firstName' | 'lastName' | 'phone'`. `Record<..., string>` pravi objekat sa ta tri ključa i tekstom kao vrednošću (porukom greške). `Partial<...>` čini sva tri opcionim. Rezultat: `{ firstName?: string; lastName?: string; phone?: string }`.",
        },
        {
          lines: [5, 8],
          md: "Ovde nema nijednog tipa, a sve je tipizovano. Store je napravljen sa `create<State>()`, pa TypeScript zna šta je `s.user` ili `s.logout`. Generici iz prethodne lekcije u praksi.",
        },
        {
          lines: 10,
          md: "`useState(false)` bez generika: iz `false` je jasno da je stanje `boolean`.",
        },
        {
          lines: [11, 12],
          md: "Ovde generik **treba**. Za `form` on garantuje da početni objekat ima sva tri polja. Za `errors` je ključan: bez `<Errors>`, tip stanja bi bio `{}` (*prazan objekat*), pa bi već `errors[name]` u funkciji `field` ispod bio greška: TypeScript ne bi znao da u tom objektu uopšte mogu da postoje polja forme. A pošto je `Errors` `Partial`, prazan objekat je ispravna početna vrednost.",
        },
      ],
    },
    {
      kind: "prose",
      md: `Nekoliko linija niže u istom fajlu, \`keyof Form\` se koristi kao tip parametra. Funkcija \`field\` prima **samo** ime postojećeg polja:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio/src/screens/ProfileScreen.tsx",
      code: `  const field = (name: keyof Form) => ({
    value: form[name],
    error: errors[name],
    onChange: (value: string) => {
      setForm((current) => ({ ...current, [name]: value }))
      setErrors((current) => ({ ...current, [name]: undefined }))
    },
  })`,
      highlight: [1],
      caption:
        "`field('phone')` radi, a `field('telefon')` je greška. Doda li se polje u `Form`, `field` ga odmah prihvata.",
    },
    {
      kind: "prose",
      md: `### Pick i Omit: uzmi ili izbaci polja

- **\`Pick<T, 'a' | 'b'>\`**: novi tip sa **samo** navedenim poljima.
- **\`Omit<T, 'a' | 'b'>\`**: novi tip sa **svim poljima osim** navedenih.

Tvoj kod ih koristi na dva tipična načina: da funkcija traži **samo ono što joj treba**, i da props komponente nasledi sve osim nekoliko polja.`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `// functions/src/shared/notifications.ts
// Link ka terminu treba samo id i startsAt, ne ceo termin:
export const sessionLink = (session: Pick<NotifiedSession, 'id' | 'startsAt'>) =>
  \`\${NOTIFICATION_ROUTES.schedule}?\${scheduleSearch(session)}\`

// src/components/TextField.tsx
// Sve što ima <input>, osim onChange, koji TextField definiše drugačije:
interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {

// src/admin/MemberEmailSheet.tsx
// Forma unutar sheet-a dobija sve props osim 'open':
const EmailForm = ({ uid, email, onClose }: Omit<MemberEmailSheetProps, 'open'>) => {`,
      highlight: [3, 8, 12],
      caption:
        "Tri prava primera iz ReformStudija. `Pick` na parametru ima bonus: u testovima ne moraš da praviš ceo `NotifiedSession`, dovoljan je `{ id, startsAt }`.",
    },
    {
      kind: "prose",
      md: `### Required, Readonly, NonNullable

Ređi, ali dobro je da ih prepoznaš:

- **\`Required<T>\`** je suprotno od \`Partial\`: sva polja postaju obavezna.
- **\`Readonly<T>\`** sva polja čini \`readonly\`. U \`config.ts\`: \`Readonly<Record<StudioId, number>>\` za podrazumevani kapacitet, da ga niko ne izmeni u runtime-u.
- **\`NonNullable<T>\`** izbacuje \`null\` i \`undefined\` iz uniona. U Looply-ju: \`NonNullable<BrandIcon['glyph']>\`, tj. *glyph, ali onaj koji sigurno postoji*.

Primeti zapis \`BrandIcon['glyph']\`: uglaste zagrade na **tipu** daju tip jednog polja. Isto kao \`(typeof palettes)[Tone]\` u isečku ispod.

### ReturnType: tip onoga što funkcija vraća

Ponekad ne znaš (ili ne želiš da zavisiš od toga) šta tačno funkcija vraća. \`ReturnType<typeof fn>\` to izračuna:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio/src/admin/AdminSessionSheet.tsx",
      code: `const capacityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)`,
      caption:
        "`setTimeout` u browseru vraća `number`, a u Node-u objekat `Timeout`. Umesto da pogađaš, `ReturnType<typeof setTimeout>` uvek daje tačan tip za okruženje u kome se kod kompajlira. AI ovo često piše, i sad znaš zašto.",
    },
    {
      kind: "prose",
      md: `Za \`async\` funkcije, \`ReturnType\` daje \`Promise<...>\`. Da dobiješ ono što je unutra, dodaje se \`Awaited\`: u \`handlers/schedule.ts\` postoji \`Awaited<ReturnType<typeof templateCandidates>>\`. Slično, \`Parameters<typeof fn>\` daje tipove parametara kao niz.

### satisfies: proveri, ali ne proširuj

Anotacija \`const x: Tip = ...\` radi dve stvari: proveri vrednost **i** promeni tip promenljive u \`Tip\`. Ponekad ti treba samo prvo. Za to postoji **\`satisfies\`**: proveri da vrednost odgovara tipu, ali zadrži precizniji tip koji je TypeScript zaključio.`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `type Tone = 'brand' | 'ink'

// Sa anotacijom: tip postaje Record<Tone, Record<string, string>>
const a: Record<Tone, Record<string, string>> = { brand: { face: 'x' }, ink: { face: 'y' } }
a.brand.face     // string
a.brand.fejs     // ✅ nema greške?! Record<string, ...> prihvata svaki ključ

// Sa satisfies: provera je ista, ali tip ostaje tačan
const b = { brand: { face: 'x' }, ink: { face: 'y' } } satisfies Record<Tone, Record<string, string>>
b.brand.face     // string
b.brand.fejs     // ❌ Property 'fejs' does not exist`,
      highlight: [6, 11],
      caption:
        "`satisfies` je i dalje stroga provera: ako fali `ink`, dobijaš grešku. Ali posle provere, `b` zadržava tačan oblik iz koda.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/Avatar.tsx",
      lang: "tsx",
      startLine: 40,
      intro:
        "Boje crtanog avatara, po temi. `Tone` je definisan na vrhu fajla kao `type Tone = 'brand' | 'ink'`.",
      code: `const palettes = {
  brand: {
    face: 'fill-brand-50',
    shade: 'fill-brand-200',
    shirt: 'fill-brand-500',
    hair: 'fill-ink-900',
  },
  ink: {
    face: 'fill-brand-100',
    shade: 'fill-brand-300',
    shirt: 'fill-brand-400',
    hair: 'fill-brand-600',
  },
} satisfies Record<Tone, Record<string, string>>

type Palette = (typeof palettes)[Tone]
`,
      steps: [
        {
          lines: [1, 13],
          md: "Običan objekat: za svaku temu po četiri Tailwind klase. Bez anotacije tipa na `const palettes`.",
        },
        {
          lines: 14,
          md: "`satisfies` proverava dve stvari: da postoje **obe** teme (`Record<Tone, ...>`) i da su sve vrednosti tekstovi. Da neko obriše `ink` ili napiše broj umesto klase, greška je odmah tu.",
        },
        {
          lines: 14,
          md: "Ali tip `palettes` **ostaje** tačan: TypeScript i dalje zna da paleta ima baš `face`, `shade`, `shirt` i `hair`. Sa anotacijom `: Record<...>` to bi se izgubilo i `c.hiar` ne bi bila greška.",
        },
        {
          lines: 16,
          md: "Odmah se to i koristi: `typeof palettes` je tip objekta, a `[Tone]` uzima tip vrednosti za bilo koju temu. `Palette` je zato `{ face: string; shade: string; shirt: string; hair: string }`, izveden, a ne prepisan.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "tip",
      title: "as const satisfies",
      md: "U Looply-ju (`src/app/pro.tsx`) postoji i kombinacija: `{ limit: 'pro.reasonLimit', ... } as const satisfies Record<ProFeature, string>`. `as const` zadrži tačne tekstove kao literal tipove, a `satisfies` proveri da je pokriven svaki `ProFeature`. Kad se doda nova Pro funkcija, ovaj objekat postaje greška dok se ne doda i njen tekst.",
    },
    {
      kind: "exercise",
      id: "ts-utility-1",
      title: "Izmena podešavanja",
      lang: "ts",
      prompt: `Funkcija \`primeniIzmene\` treba da primi **samo polja koja se menjaju** (kao \`update(patch)\` u Looply store-u), i vrati nova podešavanja.

**Zadatak:**
1. Promeni tip parametra \`izmene\` tako da sva polja budu opciona (poziv sa samo \`{ valuta: 'EUR' }\` sada prijavljuje grešku).
2. Neka funkcija vrati **nov** objekat: stara podešavanja prepisana izmenama. Original ne sme da se promeni.`,
      starter: `interface Podesavanja {
  valuta: string
  jezik: string
  podsetnici: boolean
}

function primeniIzmene(podesavanja: Podesavanja, izmene: Podesavanja): Podesavanja {
  return podesavanja
}

const pocetna: Podesavanja = { valuta: "RSD", jezik: "sr", podsetnici: true }
const nova = primeniIzmene(pocetna, { valuta: "EUR" })
console.log(nova.valuta, nova.jezik)
`,
      solution: `interface Podesavanja {
  valuta: string
  jezik: string
  podsetnici: boolean
}

function primeniIzmene(podesavanja: Podesavanja, izmene: Partial<Podesavanja>): Podesavanja {
  return { ...podesavanja, ...izmene }
}

const pocetna: Podesavanja = { valuta: "RSD", jezik: "sr", podsetnici: true }
const nova = primeniIzmene(pocetna, { valuta: "EUR" })
console.log(nova.valuta, nova.jezik)
`,
      tests: [
        { name: "valuta je promenjena u EUR", code: 'expect(nova.valuta).toBe("EUR")' },
        { name: "ostala polja su sačuvana", code: 'expect(nova.jezik).toBe("sr")\nexpect(nova.podsetnici).toBe(true)' },
        { name: "original je netaknut", code: 'expect(pocetna.valuta).toBe("RSD")\nexpect(nova === pocetna).toBe(false)' },
        {
          name: "radi i sa više izmena odjednom",
          code: 'expect(primeniIzmene(pocetna, { jezik: "en", podsetnici: false })).toEqual({ valuta: "RSD", jezik: "en", podsetnici: false })',
        },
      ],
      hints: [
        "Greška kaže da `{ valuta: 'EUR' }` nema `jezik` i `podsetnici`. Koji utility tip čini sva polja opcionim?",
        "`izmene: Partial<Podesavanja>`",
        "Spajanje objekata: `return { ...podesavanja, ...izmene }`. Polja iz `izmene` prepisuju ona iz `podesavanja`, jer dolaze kasnije.",
      ],
      explanation:
        "Ovo je tačno ono što radi `update(patch: Partial<AppSettings>)` u Looply-ju: `{ ...previous, ...patch }`. `Partial` dozvoljava da se pošalje bilo koji podskup polja, a i dalje odbija nepostojeća polja i pogrešne tipove.",
    },
    {
      kind: "exercise",
      id: "ts-utility-2",
      title: "Pick i Omit za člana",
      lang: "ts",
      prompt: `Ceo kod već radi u runtime-u, ali TypeScript prijavljuje greške jer su tipovi preširoki.

**Zadatak:** popravi **samo tipove** (ne tela funkcija):
1. \`NoviClan\` je \`Clan\` **bez** polja \`id\` i \`kreiran\` (njih dodaje server).
2. \`punoIme\` treba da prihvati bilo koji objekat koji ima **samo** \`ime\` i \`prezime\`.`,
      starter: `interface Clan {
  id: string
  ime: string
  prezime: string
  telefon: string
  kreiran: string
}

type NoviClan = Clan

function napraviClana(podaci: NoviClan, id: string, danas: string): Clan {
  return { ...podaci, id, kreiran: danas }
}

function punoIme(osoba: Clan): string {
  return osoba.ime + " " + osoba.prezime
}

const marko = napraviClana({ ime: "Marko", prezime: "Ilić", telefon: "060…" }, "u7", "2026-10-23")
console.log(punoIme(marko))
console.log(punoIme({ ime: "Ana", prezime: "Petrović" }))
`,
      solution: `interface Clan {
  id: string
  ime: string
  prezime: string
  telefon: string
  kreiran: string
}

type NoviClan = Omit<Clan, "id" | "kreiran">

function napraviClana(podaci: NoviClan, id: string, danas: string): Clan {
  return { ...podaci, id, kreiran: danas }
}

function punoIme(osoba: Pick<Clan, "ime" | "prezime">): string {
  return osoba.ime + " " + osoba.prezime
}

const marko = napraviClana({ ime: "Marko", prezime: "Ilić", telefon: "060…" }, "u7", "2026-10-23")
console.log(punoIme(marko))
console.log(punoIme({ ime: "Ana", prezime: "Petrović" }))
`,
      tests: [
        { name: "napraviClana dodaje id i kreiran", code: 'expect(marko.id).toBe("u7")\nexpect(marko.kreiran).toBe("2026-10-23")' },
        { name: "punoIme(marko) je \"Marko Ilić\"", code: 'expect(punoIme(marko)).toBe("Marko Ilić")' },
        { name: "ispisuje oba imena", code: 'expect(logs).toEqual(["Marko Ilić", "Ana Petrović"])' },
      ],
      hints: [
        "Greške su na pozivima: objektima fale `id` i `kreiran`, odnosno `telefon`, `id` i `kreiran`.",
        "`Omit<Clan, 'id' | 'kreiran'>` daje sve osim ta dva polja.",
        "`Pick<Clan, 'ime' | 'prezime'>` daje samo ta dva polja. Pun `Clan` i dalje prolazi, jer ima i njih.",
      ],
      explanation:
        "Primeti da `punoIme(marko)` radi i posle `Pick`: TypeScript proverava da objekat ima **bar** tražena polja. Zato je `Pick` na parametru tako koristan: funkcija postaje upotrebljiva sa više vrsta objekata, a i dalje je potpuno proverena.",
    },
    {
      kind: "exercise",
      id: "ts-utility-3",
      title: "Svaki tip treninga",
      lang: "ts",
      prompt: `TypeScript prijavljuje tri greške. Dve kažu da nešto fali (*Property 'cardio' is missing...* i *Type '{}' is missing the following properties...*), a treća, u funkciji \`naziv\`, nestaje čim popraviš prvu.

**Zadatak:**
1. \`NAZIVI\` koristi \`satisfies\` da proveri da postoji naziv za **svaki** tip treninga. Dodaj ono što fali (\`cardio\` je \`"Kardio"\`).
2. Dovrši \`brojPoTipu\`: prebroji koliko puta se svaki tip pojavljuje u nizu. Rezultat mora imati **sva tri** ključa, i kad je broj 0.`,
      starter: `const TIPOVI = ["lower", "upper", "cardio"] as const
type TipTreninga = (typeof TIPOVI)[number]

const NAZIVI = {
  lower: "Donji deo",
  upper: "Gornji deo",
} satisfies Record<TipTreninga, string>

function naziv(tip: TipTreninga): string {
  return NAZIVI[tip]
}

function brojPoTipu(tipovi: TipTreninga[]): Record<TipTreninga, number> {
  return {}
}

console.log(naziv("cardio"))
console.log(brojPoTipu(["lower", "cardio", "lower"]))
`,
      solution: `const TIPOVI = ["lower", "upper", "cardio"] as const
type TipTreninga = (typeof TIPOVI)[number]

const NAZIVI = {
  lower: "Donji deo",
  upper: "Gornji deo",
  cardio: "Kardio",
} satisfies Record<TipTreninga, string>

function naziv(tip: TipTreninga): string {
  return NAZIVI[tip]
}

function brojPoTipu(tipovi: TipTreninga[]): Record<TipTreninga, number> {
  const brojac: Record<TipTreninga, number> = { lower: 0, upper: 0, cardio: 0 }
  for (const tip of tipovi) {
    brojac[tip]++
  }
  return brojac
}

console.log(naziv("cardio"))
console.log(brojPoTipu(["lower", "cardio", "lower"]))
`,
      tests: [
        { name: "naziv(\"cardio\") je \"Kardio\"", code: 'expect(naziv("cardio")).toBe("Kardio")' },
        {
          name: "brojPoTipu broji tačno",
          code: 'expect(brojPoTipu(["lower", "cardio", "lower"])).toEqual({ lower: 2, upper: 0, cardio: 1 })',
        },
        { name: "prazan niz daje sve nule", code: "expect(brojPoTipu([])).toEqual({ lower: 0, upper: 0, cardio: 0 })" },
      ],
      hints: [
        "Prva greška: `NAZIVI` nema ključ `cardio`, a `Record<TipTreninga, string>` traži sva tri.",
        "Za brojač napravi objekat koji odmah ima sva tri ključa: `{ lower: 0, upper: 0, cardio: 0 }`.",
        "Pa u petlji `for (const tip of tipovi) brojac[tip]++`, i vrati `brojac`.",
      ],
      explanation:
        "`Record` sa union ključem je TypeScriptov način da kaže *ništa ne sme da fali*. Kad sutra dodaš `'mobility'` u `TIPOVI`, oba mesta postaju greška dok ih ne ažuriraš. To je tačno ono što radi `DEFAULT_TRAINING_TYPE_LABELS` u tvom `config.ts`.",
    },
    {
      kind: "quiz",
      id: "ts-utility-quiz",
      questions: [
        {
          q: "Šta je `keyof { a: string; b: number }`?",
          options: ["`string | number`", "`'a' | 'b'`", "`['a', 'b']`", "`{ a: string; b: number }`"],
          answer: 1,
          why: "`keyof` daje union **ključeva** (imena polja), ne vrednosti.",
        },
        {
          q: "Koja linija prijavljuje grešku?",
          code: `type Form = { ime: string; telefon: string }
type Errors = Partial<Record<keyof Form, string>>

const e1: Errors = {}
const e2: Errors = { telefon: "Neispravan broj" }
const e3: Errors = { email: "Obavezno polje" }`,
          codeLang: "ts",
          options: ["Linija 4", "Linija 5", "Linija 6", "Nijedna"],
          answer: 2,
          why: "`Partial` dozvoljava da polja fale (linije 4 i 5 su u redu), ali ne dozvoljava **nova** polja. `email` nije ključ u `Form`.",
        },
        {
          q: "Šta je `Omit<UserDoc, 'email' | 'phone'>`?",
          options: [
            "Tip sa samo `email` i `phone`",
            "`UserDoc` u kome su `email` i `phone` opcioni",
            "`UserDoc` bez polja `email` i `phone`",
            "Greška, `Omit` prima samo jedno polje",
          ],
          answer: 2,
          why: "`Omit` izbacuje navedena polja, a `Pick` zadržava samo njih. Oba primaju union ključeva.",
        },
        {
          q: "Koja je glavna razlika između `const x: T = {...}` i `const x = {...} satisfies T`?",
          options: [
            "`satisfies` ne proverava ništa",
            "Oba proveravaju, ali `satisfies` zadržava precizniji tip koji je TypeScript zaključio",
            "`satisfies` radi samo sa nizovima",
            "Anotacija radi samo u `.tsx` fajlovima",
          ],
          answer: 1,
          why: "Anotacija „proširi” tip promenljive na `T`. `satisfies` samo proveri da vrednost odgovara `T`, a promenljiva zadržava tačan oblik (npr. konkretna imena polja).",
        },
        {
          q: "Zašto `useRef<ReturnType<typeof setTimeout> | null>(null)` umesto `useRef<number | null>(null)`?",
          options: [
            "Jer je kraće",
            "Jer `setTimeout` u Node-u i browseru ne vraća isti tip, pa `ReturnType` uzima tačan tip za okruženje",
            "Jer `setTimeout` vraća string",
            "Nema razlike, to je stvar ukusa",
          ],
          answer: 1,
          why: "U browseru `setTimeout` vraća `number`, a u Node-u `Timeout` objekat. Kad su u projektu tipovi za oba okruženja, `number` može biti pogrešan. `ReturnType` uvek kaže istinu.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-ts-utility-1",
      front: "Šta radi `Partial<T>`?",
      back: "Pravi kopiju `T` u kojoj su sva polja opciona. Tipično za izmene (`patch`) i greške forme.",
    },
    {
      id: "fc-ts-utility-2",
      front: "`Pick` ili `Omit`?",
      back: "`Pick<T, 'a' | 'b'>` zadržava **samo** navedena polja. `Omit<T, 'a' | 'b'>` zadržava **sva osim** navedenih.",
    },
    {
      id: "fc-ts-utility-3",
      front: "Kako se čita `Partial<Record<keyof Form, string>>`?",
      back: "Iznutra ka spolja: ključevi `Form`, pa objekat sa tim ključevima i tekstom kao vrednošću, pa sva polja opciona.",
    },
    {
      id: "fc-ts-utility-4",
      front: "Šta radi `satisfies`?",
      back: "Proverava da vrednost odgovara tipu, ali ne menja zaključeni tip promenljive. Dobijaš i proveru i precizan tip.",
    },
    {
      id: "fc-ts-utility-5",
      front: "Šta je `ReturnType<typeof fn>`?",
      back: "Tip vrednosti koju `fn` vraća. Za `async` funkcije dodaj `Awaited<...>` da dobiješ ono što je u Promise-u.",
    },
  ],
};

export default lesson;
