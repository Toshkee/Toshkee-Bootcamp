import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "union-i-narrowing",
  title: "Union tipovi i sužavanje (narrowing)",
  summary:
    "Kako se kaže „ovo ili ono” u TypeScriptu, kako jedna lista vrednosti postaje tip (`as const`), i kako TypeScript prati tvoje `if` provere da bi znao tačan tip.",
  minutes: 20,
  projects: ["ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `U \`BookingDoc\` polje \`trainingType\` nije \`string\`. Zašto? Zato što \`string\` dozvoljava **bilo koji** tekst: \`"lower"\`, ali i \`"lowr"\`, \`"Donji dio"\` ili \`""\`. A u bazi smeju da postoje samo tri vrednosti.

TypeScript ima način da kaže tačno to: *ova vrednost je **jedna od** ovih*. To se zove **union tip**, i piše se uspravnom crtom \`|\`, koja se čita kao „ili”.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao padajući meni",
      md: "`string` je polje u koje možeš da otkucaš šta hoćeš. Union tip je **padajući meni**: nudi tačno određene opcije i ništa drugo. Kad otkucaš opciju koje nema u meniju, TypeScript ti odmah kaže.",
    },
    {
      kind: "prose",
      md: `### Literal tipovi i union

Svaka konkretna vrednost može biti tip sama za sebe: tip \`'active'\` prihvata samo tekst \`'active'\`. To su **literal tipovi**. Sami nisu mnogo korisni, ali spojeni sa \`|\` daju precizan opis:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `type BookingStatus = 'active' | 'cancelled'

let status: BookingStatus = 'active'     // ✅
status = 'cancelled'                     // ✅
status = 'canceled'                      // ❌ Type '"canceled"' is not assignable
                                         //    to type 'BookingStatus'.

// Union može spojiti i različite tipove:
let lastStudio: StudioId | null = null   // studio ili "još nije izabran"
let id: string | number = 42`,
      highlight: [5],
      caption:
        "Američki i britanski pravopis (`canceled` / `cancelled`) je klasična greška. Sa union tipom je TypeScript uhvati odmah, a sa `string` bi se tiho zapisala u bazu.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Bonus: autocomplete",
      md: "Kad je tip union literala, editor ti posle otvorenog navodnika ponudi sve dozvoljene vrednosti. Ne moraš da pamtiš da li je `'freeSpot'` ili `'free_spot'`.",
    },
    {
      kind: "prose",
      md: `### as const: jedna lista, i vrednost i tip

Često ti trebaju **obe stvari**: lista studija kao prava vrednost (da je prikažeš u meniju ili proveriš unos), i tip \`StudioId\` (da TypeScript proverava kod). Mogao bi da ih napišeš dva puta, ali onda neko doda studio na jedno mesto i zaboravi drugo.

Tvoj ReformStudio to rešava elegantno: lista se piše **jednom**, a tip se izvodi iz nje.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/shared/config.ts",
      lang: "ts",
      startLine: 95,
      intro:
        "Ovaj obrazac se u `config.ts` ponavlja za studije, tipove treninga, pol i vrste utisaka. Kad ga jednom razumeš, prepoznaćeš ga svuda.",
      code: `export const STUDIO_IDS = ['fitness', 'pilates'] as const

export type StudioId = (typeof STUDIO_IDS)[number]

export const isStudioId = (value: unknown): value is StudioId =>
  STUDIO_IDS.includes(value as StudioId)

// ---- tipovi treninga --------------------------------------------------------

/** Ključevi tipova treninga; nazive („Donji dio”…) admin mijenja po studiju. */
export const TRAINING_TYPES = ['lower', 'upper', 'cardio'] as const

export type TrainingType = (typeof TRAINING_TYPES)[number]

export const isTrainingType = (value: unknown): value is TrainingType =>
  TRAINING_TYPES.includes(value as TrainingType)
`,
      steps: [
        {
          lines: 1,
          md: "Bez `as const`, TypeScript bi zaključio da je `STUDIO_IDS` tipa `string[]` (niz bilo kakvih tekstova, koji se može menjati). Sa `as const` tip postaje `readonly ['fitness', 'pilates']`: tačno ove dve vrednosti, tim redom, i niz se ne može menjati.",
        },
        {
          lines: 3,
          md: "Čita se iznutra ka spolja: `typeof STUDIO_IDS` uzima **tip** te konstante, a `[number]` znači *tip elementa na bilo kom brojčanom indeksu*. Rezultat: `'fitness' | 'pilates'`. Doda li se treći studio u listu, tip se sam proširi.",
        },
        {
          lines: [5, 6],
          md: "Ovo je **type guard** (čuvar tipa). Prima `unknown` (bilo šta, recimo parametar iz URL-a) i vraća `boolean`. Ali povratni tip `value is StudioId` kaže TypeScriptu više: *ako vratim `true`, posle toga tretiraj `value` kao `StudioId`*.",
        },
        {
          lines: 6,
          md: "`value as StudioId` je ovde nužan trik: `includes` na `readonly ['fitness', 'pilates']` prihvata samo te dve vrednosti, a `value` je `unknown`. `as` kaže TypeScriptu *veruj mi*, što je ovde bezbedno jer `includes` ionako samo poredi. O opasnostima `as` u lekciji o greškama.",
        },
        {
          lines: [11, 16],
          md: "Potpuno isti obrazac za tipove treninga: lista sa `as const`, tip izveden iz nje, i type guard. Odatle dolazi `TrainingType` koji se pojavljuje u `BookingDoc`.",
        },
      ],
    },
    {
      kind: "prose",
      md: `Isti trik postoji i za objekte. Kod objekta te obično zanimaju **ključevi**, pa se koristi \`keyof typeof\`:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `const COLLECTIONS = {
  users: 'users',
  sessions: 'sessions',
  bookings: 'bookings',
} as const

type CollectionKey = keyof typeof COLLECTIONS
// 'users' | 'sessions' | 'bookings'

type CollectionName = (typeof COLLECTIONS)[CollectionKey]
// vrednosti: 'users' | 'sessions' | 'bookings'`,
      highlight: [7, 10],
      caption:
        "`typeof X` daje tip vrednosti `X`, a `keyof` od tog tipa pravi union svih ključeva. Ovo je skraćena verzija `COLLECTIONS` iz tvog `types.ts`.",
    },
    {
      kind: "prose",
      md: `### Narrowing: TypeScript prati tvoje provere

Kad imaš vrednost tipa \`string | null\`, ne možeš odmah da pozoveš \`.toUpperCase()\`, jer možda je \`null\`. Ali čim napišeš \`if\` koji to proveri, TypeScript **unutar tog bloka suzi tip**. To se zove **narrowing** (sužavanje), i radi sa svim proverama koje već znaš iz JavaScripta:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `function primer(x: string | number, studio: StudioId | null, u: UserDoc) {
  // 1) typeof
  if (typeof x === 'string') {
    x.toUpperCase()          // ovde je x: string
  } else {
    x.toFixed(2)             // ovde je x: number
  }

  // 2) jednakost
  if (studio === null) return
  studio                     // posle ranog povratka: StudioId

  // 3) truthiness (da li je vrednost "istinita")
  if (u.gender) {
    u.gender                 // Gender, nije više undefined
  }

  // 4) in: da li objekat ima polje
  const s = membershipStatus(u.membership.fitness?.validUntil, new Date())
  if ('daysLeft' in s) {
    s.daysLeft               // samo varijante koje imaju daysLeft
  }
}`,
      highlight: [3, 10, 14, 20],
      caption:
        "Pređi mišem preko promenljive u različitim granama i videćeš različit tip. TypeScript ne pogađa: on prati tok koda.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zamka sa truthiness proverom",
      md: `\`if (membership.sessions)\` izgleda kao provera *da li polje postoji*, ali vrednost \`0\` je takođe „lažna” (falsy). Član sa nula uplaćenih termina bi bio tretiran kao da polje ne postoji. Isto važi za prazan string \`""\`.

Za brojeve uvek proveravaj eksplicitno: \`if (membership.sessions !== undefined)\`.`,
    },
    {
      kind: "prose",
      md: `### Rani povratak (early return)

Najčitljiviji način rada sa \`null\` i \`undefined\` je da ih **odmah na početku izbaciš**. Posle \`if (!x) return ...\` ostatak funkcije radi sa sigurnim tipom, bez ugnežđenih \`if\`-ova. Videćeš ovo u sledećem isečku.

### Discriminated union: objekti sa „etiketom”

Najmoćniji obrazac u ovoj lekciji. Kad union čine **objekti** koji imaju zajedničko polje sa literal vrednošću (najčešće \`kind\`, \`type\` ili \`status\`), TypeScript po tom polju zna koja je varijanta u pitanju. To polje se zove **diskriminator**.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/lib/rules.ts",
      lang: "ts",
      startLine: 31,
      intro:
        "Stanje članarine u aplikaciji. Ovu funkciju koriste Početna, Raspored i admin panel da odluče šta da prikažu.",
      code: `export type MembershipStatus =
  | { kind: 'none' }
  | { kind: 'expired'; validUntil: string }
  | { kind: 'expiring'; validUntil: string; daysLeft: number }
  | { kind: 'valid'; validUntil: string; daysLeft: number }

export const membershipStatus = (validUntil: string | undefined, now: Date): MembershipStatus => {
  if (!validUntil) return { kind: 'none' }
  const daysLeft = diffInDays(dayKey(now), validUntil)
  if (daysLeft < 0) return { kind: 'expired', validUntil }
  return { kind: daysLeft <= MEMBERSHIP_WARNING_DAYS ? 'expiring' : 'valid', validUntil, daysLeft }
}
`,
      steps: [
        {
          lines: [1, 5],
          md: "Četiri varijante, svaka sa poljem `kind`. Primeti da **samo neke** imaju `daysLeft`: kad članarine nema, nema smisla pričati o danima. Tip to tačno opisuje, umesto da svuda stavi `daysLeft?: number`.",
        },
        {
          lines: 7,
          md: "Parametar je `string | undefined` jer član možda nema članarinu u ovom studiju. Povratni tip je `MembershipStatus`, pa TypeScript proverava da svaki `return` vraća jednu od četiri varijante.",
        },
        {
          lines: 8,
          md: "**Rani povratak**: ako `validUntil` ne postoji, gotovo. Od sledeće linije TypeScript zna da je `validUntil` tipa `string`, pa ga bez greške prosleđuje u `diffInDays`.",
        },
        {
          lines: 10,
          md: "Varijanta `expired` traži `validUntil`, i on je tu (skraćeni zapis `{ validUntil }` je isto što i `{ validUntil: validUntil }`). Da je neko zaboravio polje, TypeScript bi prijavio grešku.",
        },
        {
          lines: 11,
          md: "`kind` se bira ternarnim operatorom, pa je njegov tip `'expiring' | 'valid'`. Obe varijante imaju ista polja, pa TypeScript prihvata objekat.",
        },
      ],
    },
    {
      kind: "prose",
      md: `Na mestu gde se \`MembershipStatus\` **koristi**, provera \`kind\` polja otključava polja te varijante:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `function poruka(status: MembershipStatus): string {
  status.daysLeft            // ❌ Property 'daysLeft' does not exist
                             //    on type 'MembershipStatus'.

  switch (status.kind) {
    case 'none':
      return 'Nema članarine'
    case 'expired':
      return 'Istekla ' + status.validUntil
    case 'expiring':
    case 'valid':
      return 'Još ' + status.daysLeft + ' dana'   // ✅ ovde postoji
    default: {
      const nemoguce: never = status   // proverava da su svi slučajevi pokriveni
      return nemoguce
    }
  }
}`,
      highlight: [2, 12, 14],
      caption:
        "`never` je tip koji nema nijednu vrednost. Ako neko kasnije doda peti `kind`, a zaboravi ovde `case`, linija 14 postaje greška. Tako ti TypeScript pokaže svako mesto koje treba ažurirati.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "Gde još ovo imaš",
      md: "U tvom kodu postoji desetak ovakvih tipova: `{ ok: true; value: ... } | { ok: false; errors: ... }` za validaciju formi u `admin/forms.ts`, `kind: 'checking' | 'ready' | 'done' ...` u `ResetPasswordScreen.tsx`, a u Looply-ju `ImportParseResult`. Kad AI piše rezultat koji može da uspe ili ne uspe, skoro uvek bira ovaj obrazac.",
    },
    {
      kind: "exercise",
      id: "ts-union-1",
      title: "Status rezervacije",
      lang: "ts",
      prompt: `TypeScript je uhvatio slovnu grešku u poređenju. Poruka kaže da se tipovi *„nemaju preklapanja”* (*have no overlap*): poredi se nešto što nikad ne može biti jednako.

**Zadatak:**
1. Popravi slovnu grešku.
2. Dodaj treći status \`'waitlist'\` u union \`BookingStatus\`, i neka \`oznakaStatusa\` za njega vrati \`"Na listi čekanja"\`.`,
      starter: `type BookingStatus = 'active' | 'cancelled'

function oznakaStatusa(status: BookingStatus): string {
  if (status === 'activ') return 'Aktivna'
  return 'Otkazana'
}

console.log(oznakaStatusa('active'))
`,
      solution: `type BookingStatus = 'active' | 'cancelled' | 'waitlist'

function oznakaStatusa(status: BookingStatus): string {
  if (status === 'active') return 'Aktivna'
  if (status === 'waitlist') return 'Na listi čekanja'
  return 'Otkazana'
}

console.log(oznakaStatusa('active'))
`,
      tests: [
        { name: "'active' daje \"Aktivna\"", code: "expect(oznakaStatusa('active')).toBe('Aktivna')" },
        { name: "'cancelled' daje \"Otkazana\"", code: "expect(oznakaStatusa('cancelled')).toBe('Otkazana')" },
        { name: "'waitlist' daje \"Na listi čekanja\"", code: "expect(oznakaStatusa('waitlist')).toBe('Na listi čekanja')" },
      ],
      hints: [
        "Uporedi `'activ'` sa vrednostima u `BookingStatus`. Fali jedno slovo.",
        "Novi status dodaješ u union: `'active' | 'cancelled' | 'waitlist'`.",
        "Dodaj `if (status === 'waitlist') return 'Na listi čekanja'` pre poslednjeg `return`.",
      ],
      explanation:
        "Sa `status: string` ova slovna greška bi prošla, a svaka rezervacija bi bila prikazana kao „Otkazana”. Union tip je pretvara u crvenu liniju pre pokretanja. Primeti i da posle dodavanja `'waitlist'` editor sam nudi tu vrednost u autocomplete-u.",
    },
    {
      kind: "exercise",
      id: "ts-union-2",
      title: "Studio iz URL-a",
      lang: "ts",
      prompt: `Parametar iz URL-a je \`string | null\`, a funkcija \`nazivStudija\` prima samo pravi \`StudioId\`. Trenutno je \`StudioId\` samo \`string\`, što je preširoko, i TypeScript prijavljuje dve greške.

**Zadatak:** napravi kao u tvom \`config.ts\`:
1. \`StudioId\` izvedi iz \`STUDIO_IDS\` (\`typeof ...[number]\`).
2. Neka \`isStudioId\` bude **type guard**: povratni tip \`value is StudioId\` umesto \`boolean\`.

Telo funkcije \`studioIzUrl\` ne moraš da menjaš.`,
      starter: `const STUDIO_IDS = ['fitness', 'pilates'] as const

type StudioId = string

function isStudioId(value: unknown): boolean {
  return STUDIO_IDS.includes(value as StudioId)
}

function nazivStudija(id: StudioId): string {
  return id === 'fitness' ? 'Reform Fitness' : 'Reform Pilates'
}

function studioIzUrl(param: string | null): string {
  if (isStudioId(param)) {
    return nazivStudija(param)
  }
  return 'Nepoznat studio'
}

console.log(studioIzUrl('pilates'))
`,
      solution: `const STUDIO_IDS = ['fitness', 'pilates'] as const

type StudioId = (typeof STUDIO_IDS)[number]

function isStudioId(value: unknown): value is StudioId {
  return STUDIO_IDS.includes(value as StudioId)
}

function nazivStudija(id: StudioId): string {
  return id === 'fitness' ? 'Reform Fitness' : 'Reform Pilates'
}

function studioIzUrl(param: string | null): string {
  if (isStudioId(param)) {
    return nazivStudija(param)
  }
  return 'Nepoznat studio'
}

console.log(studioIzUrl('pilates'))
`,
      tests: [
        { name: "studioIzUrl('fitness') daje \"Reform Fitness\"", code: "expect(studioIzUrl('fitness')).toBe('Reform Fitness')" },
        { name: "studioIzUrl('yoga') daje \"Nepoznat studio\"", code: "expect(studioIzUrl('yoga')).toBe('Nepoznat studio')" },
        { name: "studioIzUrl(null) daje \"Nepoznat studio\"", code: "expect(studioIzUrl(null)).toBe('Nepoznat studio')" },
        { name: "isStudioId(42) je false", code: "expect(isStudioId(42)).toBe(false)" },
      ],
      hints: [
        "Prva greška je u `includes`: niz sa `as const` prihvata samo `'fitness' | 'pilates'`, a `StudioId` je trenutno ceo `string`.",
        "`type StudioId = (typeof STUDIO_IDS)[number]`",
        "Druga greška nestaje kad TypeScript zna šta znači `true` iz `isStudioId`: `function isStudioId(value: unknown): value is StudioId { ... }`.",
      ],
      explanation:
        "Sa povratnim tipom `boolean`, TypeScript ne zna *šta* je `true` dokazalo, pa `param` posle `if`-a ostaje `string | null`. Sa `value is StudioId` provera postaje narrowing: unutar `if`-a je `param` tipa `StudioId`.",
    },
    {
      kind: "exercise",
      id: "ts-union-3",
      title: "Poruka o članarini",
      lang: "ts",
      prompt: `Ovo je pojednostavljen \`MembershipStatus\` iz tvog \`rules.ts\`. Funkcija \`poruka\` pokušava da pročita \`daysLeft\`, ali to polje nemaju sve varijante.

**Zadatak:** prepiši \`poruka\` tako da za svaki \`kind\` vrati odgovarajući tekst:
- \`'none'\` → \`"Nema članarine"\`
- \`'expired'\` → \`"Istekla je 2026-09-30"\` (sa pravim datumom iz \`validUntil\`)
- \`'valid'\` → \`"Važi još 12 dana"\` (sa pravim brojem iz \`daysLeft\`)`,
      starter: `type MembershipStatus =
  | { kind: 'none' }
  | { kind: 'expired'; validUntil: string }
  | { kind: 'valid'; validUntil: string; daysLeft: number }

function poruka(status: MembershipStatus): string {
  return 'Važi još ' + status.daysLeft + ' dana'
}

console.log(poruka({ kind: 'valid', validUntil: '2026-11-04', daysLeft: 12 }))
`,
      solution: `type MembershipStatus =
  | { kind: 'none' }
  | { kind: 'expired'; validUntil: string }
  | { kind: 'valid'; validUntil: string; daysLeft: number }

function poruka(status: MembershipStatus): string {
  switch (status.kind) {
    case 'none':
      return 'Nema članarine'
    case 'expired':
      return 'Istekla je ' + status.validUntil
    case 'valid':
      return 'Važi još ' + status.daysLeft + ' dana'
  }
}

console.log(poruka({ kind: 'valid', validUntil: '2026-11-04', daysLeft: 12 }))
`,
      tests: [
        { name: "none → \"Nema članarine\"", code: "expect(poruka({ kind: 'none' })).toBe('Nema članarine')" },
        {
          name: "expired → \"Istekla je 2026-09-30\"",
          code: "expect(poruka({ kind: 'expired', validUntil: '2026-09-30' })).toBe('Istekla je 2026-09-30')",
        },
        {
          name: "valid → \"Važi još 12 dana\"",
          code: "expect(poruka({ kind: 'valid', validUntil: '2026-11-04', daysLeft: 12 })).toBe('Važi još 12 dana')",
        },
      ],
      hints: [
        "Pre nego što pročitaš `daysLeft`, moraš da proveriš koja je varijanta. Diskriminator je polje `kind`.",
        "`switch (status.kind) { case 'none': ... case 'expired': ... case 'valid': ... }`",
        "Unutar `case 'expired':` TypeScript zna da `status` ima `validUntil`, a unutar `case 'valid':` da ima i `daysLeft`.",
      ],
      explanation:
        "Primeti da funkcija nema `return` posle `switch`-a, a TypeScript se ne buni: zna da su pokrivene sve tri varijante, pa kraj funkcije nikad ne može da se dostigne. Ako dodaš četvrtu varijantu u tip, odmah dobiješ grešku da funkcija ne vraća uvek `string`.",
    },
    {
      kind: "quiz",
      id: "ts-union-quiz",
      questions: [
        {
          q: "Koji je tip `TrainingType`?",
          code: `const TRAINING_TYPES = ['lower', 'upper', 'cardio'] as const
type TrainingType = (typeof TRAINING_TYPES)[number]`,
          codeLang: "ts",
          options: [
            "`string`",
            "`string[]`",
            "`'lower' | 'upper' | 'cardio'`",
            "`readonly ['lower', 'upper', 'cardio']`",
          ],
          answer: 2,
          why: "`typeof TRAINING_TYPES` je tip celog niza (`readonly [...]`), a `[number]` iz njega uzima tip jednog elementa. Pošto je niz `as const`, to su tačno tri literala.",
        },
        {
          q: "Šta bi se promenilo da u prvoj liniji **nema** `as const`?",
          code: `const TRAINING_TYPES = ['lower', 'upper', 'cardio']
type TrainingType = (typeof TRAINING_TYPES)[number]`,
          codeLang: "ts",
          options: [
            "Ništa, rezultat je isti",
            "`TrainingType` bi bio samo `string`",
            "Kod se ne bi kompajlirao",
            "`TrainingType` bi bio `'lower'`",
          ],
          answer: 1,
          why: "Bez `as const`, TypeScript zaključi da je niz `string[]` (jer se može menjati), pa je tip elementa samo `string`. Ceo smisao obrasca se gubi.",
        },
        {
          q: "Koji je tip `x` unutar `else` grane?",
          code: `function f(x: string | number | null) {
  if (typeof x === 'string') {
    // ...
  } else {
    x
  }
}`,
          codeLang: "ts",
          options: ["`number`", "`number | null`", "`string | number | null`", "`null`"],
          answer: 1,
          why: "`typeof x === 'string'` izbacuje samo `string`. U `else` grani ostaje sve ostalo: `number | null`. Tek dodatna provera (`x !== null`) bi ostavila čist `number`.",
        },
        {
          q: "Polje je `sessions?: number`. Zašto je `if (doc.sessions)` loša provera da li polje postoji?",
          options: [
            "Ne kompajlira se",
            "Vrednost `0` je falsy, pa bi se tretirala kao da polja nema",
            "`undefined` je truthy",
            "Nije loša, to je preporučen način",
          ],
          answer: 1,
          why: "`0`, `\"\"`, `null`, `undefined`, `NaN` i `false` su falsy. Za brojeve i tekst koristi `!== undefined` kad ti je bitno samo da li vrednost postoji.",
        },
        {
          q: "Šta znači povratni tip `value is StudioId`?",
          code: "const isStudioId = (value: unknown): value is StudioId => ...",
          codeLang: "ts",
          options: [
            "Funkcija vraća `StudioId`",
            "Funkcija baca grešku ako vrednost nije `StudioId`",
            "Funkcija vraća `boolean`, a `true` znači da TypeScript sme da tretira `value` kao `StudioId`",
            "Funkcija pretvara `value` u `StudioId`",
          ],
          answer: 2,
          why: "To je *type guard*. U runtime-u vraća običan `true` ili `false`, ali TypeScript koristi rezultat za narrowing: u `if (isStudioId(x))` grani `x` je `StudioId`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-ts-union-1",
      front: "Šta znači `type A = 'x' | 'y'`?",
      back: "Union literal tipova: vrednost tipa `A` može biti **samo** `'x'` ili `'y'`. Sve ostalo je greška.",
    },
    {
      id: "fc-ts-union-2",
      front: "Kako iz liste vrednosti dobiti union tip?",
      back: "`const LISTA = ['a', 'b'] as const` pa `type T = (typeof LISTA)[number]`, što daje `'a' | 'b'`.",
    },
    {
      id: "fc-ts-union-3",
      front: "Šta je narrowing?",
      back: "TypeScript prati provere (`typeof`, `===`, `in`, truthiness, type guard) i unutar grane sužava tip. Posle `if (x === null) return` vrednost `x` više nije `null`.",
    },
    {
      id: "fc-ts-union-4",
      front: "Šta je discriminated union?",
      back: "Union objekata sa zajedničkim literal poljem (npr. `kind`). Provera tog polja (`switch (s.kind)`) otključava polja konkretne varijante.",
    },
    {
      id: "fc-ts-union-5",
      front: "Čemu služi `const x: never = status` u `default` grani?",
      back: "Proverava da su pokriveni svi slučajevi. Ako se doda nova varijanta, a ne i `case`, ta linija postaje greška.",
    },
  ],
};

export default lesson;
