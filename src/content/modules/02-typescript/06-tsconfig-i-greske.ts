import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "tsconfig-i-greske",
  title: "tsconfig i čitanje grešaka",
  summary:
    "Šta podešava `tsconfig.json`, kako se pokreće provera tipova iz terminala, kako se čitaju najčešće TypeScript greške, i zašto su `any`, `as`, `!` i `@ts-ignore` izlazi za nuždu.",
  minutes: 20,
  projects: ["ReformStudio", "PlazaHome"],
  blocks: [
    {
      kind: "prose",
      md: `Kad AI napiše ili izmeni kod, prva stvar koju vidiš često nije aplikacija, nego **crvena linija** u editoru ili spisak grešaka u terminalu. Ova lekcija je o tome kako da te greške pročitaš sam, umesto da ih samo kopiraš nazad u chat.

Ali prvo: ko odlučuje šta je greška? **\`tsconfig.json\`**, konfiguracioni fajl koji kaže TypeScriptu koje fajlove da proverava i koliko strogo.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao pravilnik takmičenja",
      md: "TypeScript je sudija, a `tsconfig.json` pravilnik. Isti potez (recimo parametar bez tipa) je po jednom pravilniku dozvoljen, a po strožem prekršaj. Svi tvoji projekti koriste stroga pravila (`strict: true`), i to je dobro: sudija koji više vidi hvata više grešaka pre korisnika.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "tsconfig.app.json",
      lang: "json",
      startLine: 1,
      intro:
        "Konfiguracija za kod aplikacije (folder `src`). ReformStudio ima više ovakvih fajlova, o tome ispod.",
      code: `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client", "vite-plugin-pwa/vanillajs"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./functions/src/shared/*"]
    }
  },
  "include": ["src", "functions/src/shared"],
  // Service worker ima svoj tsconfig.sw.json (WebWorker umjesto DOM-a).
  "exclude": ["src/sw.ts", "src/sw"]
}
`,
      steps: [
        {
          lines: [4, 5],
          md: "`target` kaže koju verziju JavaScripta kod sme da koristi (ES2022 je moderan JS). `lib` kaže koji ugrađeni tipovi postoje: `DOM` donosi `document`, `window`, `fetch`. Zato bi `document` u Cloud Functions (bez `DOM`) bio greška.",
        },
        {
          lines: [10, 15],
          md: "Kako se rešavaju `import`-i i šta TypeScript proizvodi. Ključno je `noEmit: true`: TypeScript ovde **samo proverava**, a pravi JavaScript pravi Vite. `jsx: react-jsx` uči TypeScript da čita JSX u `.tsx` fajlovima.",
        },
        {
          lines: 17,
          md: "**Najvažnija linija.** `strict: true` uključuje paket provera, među kojima su `noImplicitAny` (parametar bez tipa je greška) i `strictNullChecks` (`null` i `undefined` se ne mogu koristiti kao da su prave vrednosti). Bez nje bi pola grešaka iz ovog modula prošlo tiho.",
        },
        {
          lines: [18, 21],
          md: "Dodatne provere: neiskorišćene promenljive i parametri su greška, kao i `case` u `switch`-u koji „propadne” u sledeći bez `break` ili `return`. Ovo drži kod čistim, posebno kad AI ostavi višak.",
        },
        {
          lines: [23, 26],
          md: "**Alias-i putanja.** `@/*` znači *folder `src`*, pa umesto `import { t } from '../../../i18n'` pišeš `import { t } from '@/i18n'`. `@shared/*` vodi u kod koji dele aplikacija i backend. Isti `@/*` alias imaju i PlazaHome, Pasted, Looply i ovaj bootcamp.",
        },
        {
          lines: [28, 30],
          md: "`include` kaže koje foldere proverava, a `exclude` šta preskače. Primeti komentar `//`: običan JSON ne dozvoljava komentare, ali `tsconfig.json` je izuzetak.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "Zašto više tsconfig fajlova?",
      md: "Glavni `ReformStudio/tsconfig.json` ne proverava ništa sam (`\"files\": []`), nego samo upućuje (`references`) na četiri druga: `tsconfig.app.json` za aplikaciju, `tsconfig.node.json` za Vite konfiguraciju, `tsconfig.tests.json` za testove i `tsconfig.sw.json` za service worker. Svaki deo koda radi u drugom okruženju (browser, Node, worker), pa ima drugačiji `lib` i `types`. Next.js projekti kao PlazaHome imaju jedan `tsconfig.json`.",
    },
    {
      kind: "prose",
      md: `### Provera tipova iz terminala

Editor proverava samo fajlove koje imaš otvorene. Da proveriš **ceo projekat**, koristi kompajler \`tsc\` sa opcijom \`--noEmit\` (*samo proveri, ne pravi fajlove*). U većini projekata postoji i skripta za to:

- PlazaHome: \`npm run typecheck\` (pokreće \`tsc --noEmit\`)
- ReformStudio: \`npm run typecheck\` (pokreće \`tsc -b\`, koji prolazi kroz sve reference)

Ovo vredi pokrenuti **posle svake veće izmene koju napravi AI**, pre nego što commit-uješ.`,
    },
    {
      kind: "terminal",
      id: "ts-greske-terminal",
      title: "Proveri tipove u ReformStudiju",
      intro:
        "Simulacija: zamisli da je AI upravo izmenio jedan fajl. Greška je izmišljena, da vidiš kako izgleda ispis.",
      cwd: "~",
      steps: [
        {
          task: "Uđi u folder `ReformStudio`.",
          accept: ["cd\\s+[\"']?(~/|/Users/toshkee/)?ReformStudio/?[\"']?"],
          output: "",
          cwd: "~/ReformStudio",
          hint: "`cd ReformStudio`",
        },
        {
          task: "Proveri samo kod aplikacije: `npx tsc --noEmit -p tsconfig.app.json` (`-p` znači *project*, tj. koji tsconfig da koristi).",
          accept: [
            "npx\\s+tsc\\s+--noEmit\\s+-p\\s+(\\./)?tsconfig\\.app\\.json",
            "npx\\s+tsc\\s+-p\\s+(\\./)?tsconfig\\.app\\.json\\s+--noEmit",
          ],
          output: `src/lib/primer.ts:12:20 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.

12   return formatDay(membership.paidAt)
                      ~~~~~~~~~~~~~~~~~


Found 1 error in src/lib/primer.ts:12`,
          hint: "`npx tsc --noEmit -p tsconfig.app.json`",
        },
        {
          task: "Greška je popravljena. Sad pokreni proveru celog projekta preko skripte: `npm run typecheck`.",
          accept: ["npm\\s+run\\s+typecheck"],
          output: `
> reform-studio@0.1.0 typecheck
> tsc -b
`,
          hint: "`npm run typecheck`. Kad `tsc` ne ispiše ništa posle komande, to znači **nula grešaka**.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Anatomija poruke o grešci

Poruke izgledaju zastrašujuće, ali uvek imaju isti oblik. Pogledaj grešku iz terminala:`,
    },
    {
      kind: "code",
      lang: "text",
      code: `src/lib/primer.ts:12:20 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.

12   return formatDay(membership.paidAt)
                      ~~~~~~~~~~~~~~~~~`,
      highlight: [1, 2, 5],
      caption:
        "Fajl : linija : kolona, pa kod greške (`TS2345`), pa poruka. Uvučeni red ispod objašnjava **konkretan razlog**. Talasasta linija pokazuje tačno mesto.",
    },
    {
      kind: "prose",
      md: `Kako se čita, korak po korak:

1. **Gde?** \`src/lib/primer.ts\`, linija 12. U editoru klikni na putanju (Cmd+klik) i otvoriće se baš to mesto.
2. **Šta je dato, a šta očekivano?** Skoro svaka poruka ima oblik *„X nije dodeljivo Y”*. Ovde je dato \`string | undefined\`, a funkcija očekuje \`string\`.
3. **Zašto?** Uvučeni red je najprecizniji: problem je deo \`undefined\`. Kad poruka ima više uvučenih redova, **poslednji** je obično srž.
4. **Šta je stvarni problem?** \`cancelledAt\` je opciono polje. Rešenje nije da se TypeScript ućutka, nego da se obradi slučaj kad polja nema.

### Šest grešaka koje ćeš viđati najčešće

| Kod | Poruka (skraćeno) | Šta znači | Tipična popravka |
|---|---|---|---|
| **TS2322** | Type 'X' is not assignable to type 'Y' | Vrednost ne odgovara tipu promenljive ili povratnom tipu | Promeni vrednost, ili popravi pogrešan tip |
| **TS2345** | Argument of type 'X' is not assignable to parameter of type 'Y' | Isto, ali za argument funkcije | Proveri šta funkcija očekuje; obradi \`null\`/\`undefined\` pre poziva |
| **TS2339** | Property 'x' does not exist on type 'Y' | Polje ne postoji (slovna greška, ili je tip širi nego što misliš) | Ispravi ime, ili suzi tip proverom (\`kind\`, \`in\`) |
| **TS7006** | Parameter 'x' implicitly has an 'any' type | Parametar nema tip | Dodaj tip parametru |
| **TS18047** / **TS18048** | 'x' is possibly 'null' / 'undefined' | Vrednost možda ne postoji | \`if (!x) return\`, \`?.\` ili \`??\` |
| **TS2554** | Expected 2 arguments, but got 1 | Pogrešan broj argumenata | Dodaj argument ili izmeni potpis (često posle AI izmene potpisa) |

Varijanta TS2339 je **TS2551** (*Did you mean 'vreme'?*), kad TypeScript prepozna slovnu grešku i predloži ispravno ime.`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Kad greške ima 40",
      md: "Posle velike AI izmene `tsc` ponekad ispiše desetine grešaka. Ne paniči: **popravi prvu, pa pokreni ponovo**. Često je jedan pogrešan tip izazvao lančanu reakciju, i popravkom jednog mesta nestane pola spiska. Kod greške (`TS2345`) možeš i da ukucaš u pretragu, da vidiš primere.",
    },
    {
      kind: "prose",
      md: `### any i unknown

Oba znače *„ne znam šta je ovo”*, ali se ponašaju suprotno:

- **\`any\`** isključuje proveru. Sa \`any\` vrednošću možeš da radiš bilo šta, a TypeScript ćuti. Greška se pojavi tek u runtime-u.
- **\`unknown\`** je bezbedna verzija: ne možeš ništa da uradiš dok **ne proveriš** šta je (narrowing iz lekcije o union tipovima).`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `const a: any = JSON.parse(tekst)
a.studio.toUpperCase()        // nema greške... a u runtime-u: "Cannot read properties of undefined"

const u: unknown = JSON.parse(tekst)
u.studio                      // ❌ 'u' is of type 'unknown'.
if (typeof u === "object" && u !== null && "studio" in u && isStudioId(u.studio)) {
  u.studio                    // ✅ StudioId, provereno
}`,
      highlight: [2, 5, 6],
      caption:
        "Zato tvoji type guard-ovi (`isStudioId`, `isGender`) primaju `unknown`: mogu da prime bilo šta, ali posle provere tačno znaš šta imaš. Podatke spolja (JSON, URL, `localStorage`) uvek tretiraj kao `unknown`.",
    },
    {
      kind: "prose",
      md: `### Izlazi za nuždu: as, !, @ts-ignore

Postoje četiri načina da se TypeScript **ućutka** umesto da se problem reši. Svaki AI asistent ih ponekad posegne kad ne može brzo da popravi grešku:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `const clan = clanovi.find((c) => c.id === id)!   // !  "veruj mi, nije undefined"
const studio = param as StudioId                  // as "veruj mi, ovo je StudioId"
// @ts-ignore                                     //    "ne gledaj sledeću liniju"
posaljiPodsetnik(clan.telefon, 3)
const podaci: any = await res.json()              // any "isključi proveru"`,
      caption:
        "Sva četiri briše **poruku**, a ne **grešku**. Ako je `clan` stvarno `undefined`, aplikacija i dalje pukne, samo bez upozorenja.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Kad AI „popravi” grešku sa as any",
      md: `Ako u predlogu izmene vidiš novi \`as any\`, \`!\` ili \`@ts-ignore\`, zaustavi se i pitaj: *„Koji je pravi uzrok greške? Popravi ga bez as/any/!”*. Skoro uvek postoji pravo rešenje: provera \`null\`-a, ispravan tip, type guard.

Za poređenje: u \`src\` i \`functions/src\` tvog ReformStudija nema nijednog \`any\` ni \`@ts-ignore\`. Postoji nekoliko pažljivo izabranih \`as\` (npr. \`snapshot.data() as T\` u Firestore converter-u, gde TypeScript zaista ne može da zna šta je u bazi). To je dobar standard.`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "as const nije izlaz za nuždu",
      md: "`as const` ne laže TypeScript, nego mu kaže da bude **precizniji** (literal tipovi, `readonly`). Opasno je samo `as NekiTip`, koje tvrdi nešto što TypeScript ne može da proveri.",
    },
    {
      kind: "exercise",
      id: "ts-greske-1",
      title: "Tri greške, tri poruke",
      lang: "ts",
      prompt: `TypeScript prijavljuje **tri** greške. Pređi mišem preko svake crvene linije, pročitaj poruku i popravi uzrok, **bez** \`any\`, \`as\` i \`@ts-ignore\`.

Tražene greške: *implicit any* (TS7006), *property does not exist* (TS2551) i *expected arguments* (TS2554). Parametar \`jezik\` se ionako nigde ne koristi.`,
      starter: `interface Termin {
  vreme: string
  kapacitet: number
  zauzeto: number
}

function slobodnoMesta(t) {
  return t.kapacitet - t.zauzeto
}

function opis(t: Termin, jezik: string): string {
  return t.vrijeme + " · slobodno: " + slobodnoMesta(t)
}

const termin: Termin = { vreme: "18:00", kapacitet: 5, zauzeto: 3 }
console.log(opis(termin))
`,
      solution: `interface Termin {
  vreme: string
  kapacitet: number
  zauzeto: number
}

function slobodnoMesta(t: Termin): number {
  return t.kapacitet - t.zauzeto
}

function opis(t: Termin): string {
  return t.vreme + " · slobodno: " + slobodnoMesta(t)
}

const termin: Termin = { vreme: "18:00", kapacitet: 5, zauzeto: 3 }
console.log(opis(termin))
`,
      tests: [
        { name: "slobodnoMesta(termin) je 2", code: "expect(slobodnoMesta(termin)).toBe(2)" },
        { name: "opis(termin) je \"18:00 · slobodno: 2\"", code: 'expect(opis(termin)).toBe("18:00 · slobodno: 2")' },
        { name: "ispisuje opis termina", code: 'expect(logs).toContain("18:00 · slobodno: 2")' },
      ],
      hints: [
        "TS7006: `slobodnoMesta(t)` ne zna šta je `t`. Kog je tipa ono što joj se prosleđuje?",
        "TS2551: TypeScript ti sam predlaže ispravno ime polja (*Did you mean...?*).",
        "TS2554: `opis` traži dva argumenta, a dobija jedan. Pošto se `jezik` ne koristi, izbaci ga iz potpisa.",
      ],
      explanation:
        "Tri greške, tri različita uzroka, a sve tri bi u JavaScriptu prošle tiho: `t.vrijeme` bi dao `undefined`, pa bi korisnik video *„undefined · slobodno: 2”*. Primeti i da je TS2554 jedna od najčešćih grešaka posle AI izmene: potpis funkcije se promeni, a pozivi ostanu stari (ili obrnuto).",
    },
    {
      kind: "exercise",
      id: "ts-greske-2",
      title: "Možda ne postoji",
      lang: "ts",
      prompt: `\`find\` vraća \`Clan | undefined\` (možda nema člana sa tim ID-jem), a \`vaziDo\` može biti \`null\`. TypeScript zato prijavljuje TS18048 i TS2345.

**Zadatak:** obradi oba slučaja **ranim povratkom**, bez \`!\` i \`as\`:
- nepoznat ID → \`"Nepoznat član"\`
- \`vaziDo\` je \`null\` → \`"Marko: bez članarine"\`
- inače → \`"Ana: važi do 30.11.2026."\``,
      starter: `interface Clan {
  id: string
  ime: string
  vaziDo: string | null
}

const clanovi: Clan[] = [
  { id: "u1", ime: "Ana", vaziDo: "2026-11-30" },
  { id: "u2", ime: "Marko", vaziDo: null },
]

function formatDatum(datum: string): string {
  const [godina, mesec, dan] = datum.split("-")
  return dan + "." + mesec + "." + godina + "."
}

function opisClanarine(id: string): string {
  const clan = clanovi.find((c) => c.id === id)
  return clan.ime + ": važi do " + formatDatum(clan.vaziDo)
}

console.log(opisClanarine("u1"))
`,
      solution: `interface Clan {
  id: string
  ime: string
  vaziDo: string | null
}

const clanovi: Clan[] = [
  { id: "u1", ime: "Ana", vaziDo: "2026-11-30" },
  { id: "u2", ime: "Marko", vaziDo: null },
]

function formatDatum(datum: string): string {
  const [godina, mesec, dan] = datum.split("-")
  return dan + "." + mesec + "." + godina + "."
}

function opisClanarine(id: string): string {
  const clan = clanovi.find((c) => c.id === id)
  if (!clan) return "Nepoznat član"
  if (clan.vaziDo === null) return clan.ime + ": bez članarine"
  return clan.ime + ": važi do " + formatDatum(clan.vaziDo)
}

console.log(opisClanarine("u1"))
`,
      tests: [
        { name: "u1 → \"Ana: važi do 30.11.2026.\"", code: 'expect(opisClanarine("u1")).toBe("Ana: važi do 30.11.2026.")' },
        { name: "u2 → \"Marko: bez članarine\"", code: 'expect(opisClanarine("u2")).toBe("Marko: bez članarine")' },
        { name: "nepoznat ID → \"Nepoznat član\"", code: 'expect(opisClanarine("u99")).toBe("Nepoznat član")' },
      ],
      hints: [
        "Prvo `clan`: posle `find` dodaj `if (!clan) return \"Nepoznat član\"`. Od te linije TypeScript zna da `clan` postoji.",
        "Zatim `vaziDo`: `if (clan.vaziDo === null) return clan.ime + \": bez članarine\"`.",
        "Posle obe provere, `clan.vaziDo` je `string`, pa ga `formatDatum` prihvata bez greške.",
      ],
      explanation:
        "Da je umesto provera stavljen `clan!.vaziDo!`, greške u editoru bi nestale, ali `opisClanarine(\"u99\")` bi pukao sa *Cannot read properties of undefined*. Rani povratak je i bezbedan i čitljiv: svaki „loš” slučaj je obrađen na vrhu, a ostatak funkcije radi sa sigurnim tipovima.",
    },
    {
      kind: "exercise",
      id: "ts-greske-3",
      title: "Od any do unknown",
      lang: "ts",
      prompt: `\`parseTermin\` čita termin iz JSON teksta (recimo odgovor servera). Kod se kompajlira bez greške, ali **laže**: \`any\` dozvoljava da vrati bilo šta kao \`Termin\`, pa i \`{ "vreme": 18 }\`.

**Zadatak:** promeni \`any\` u \`unknown\` i proveri podatke pre nego što ih vratiš. Vrati \`{ vreme, kapacitet }\` samo ako je \`vreme\` tekst i \`kapacitet\` broj. U svakom drugom slučaju vrati \`null\`. Višak polja ne treba da prođe dalje.`,
      starter: `interface Termin {
  vreme: string
  kapacitet: number
}

function parseTermin(json: string): Termin | null {
  const data: any = JSON.parse(json)
  return data
}

console.log(parseTermin('{"vreme": "18:00", "kapacitet": 5}'))
console.log(parseTermin('{"vreme": 18}'))
`,
      solution: `interface Termin {
  vreme: string
  kapacitet: number
}

function parseTermin(json: string): Termin | null {
  const data: unknown = JSON.parse(json)
  if (
    typeof data === "object" &&
    data !== null &&
    "vreme" in data &&
    typeof data.vreme === "string" &&
    "kapacitet" in data &&
    typeof data.kapacitet === "number"
  ) {
    return { vreme: data.vreme, kapacitet: data.kapacitet }
  }
  return null
}

console.log(parseTermin('{"vreme": "18:00", "kapacitet": 5}'))
console.log(parseTermin('{"vreme": 18}'))
`,
      tests: [
        {
          name: "ispravan JSON daje termin",
          code: 'expect(parseTermin(\'{"vreme": "18:00", "kapacitet": 5}\')).toEqual({ vreme: "18:00", kapacitet: 5 })',
        },
        { name: "vreme kao broj daje null", code: 'expect(parseTermin(\'{"vreme": 18, "kapacitet": 5}\')).toBe(null)' },
        { name: "fali kapacitet → null", code: 'expect(parseTermin(\'{"vreme": "18:00"}\')).toBe(null)' },
        { name: "JSON null → null", code: "expect(parseTermin('null')).toBe(null)" },
        {
          name: "višak polja se ne prenosi",
          code: 'expect(parseTermin(\'{"vreme": "08:00", "kapacitet": 3, "trener": "Marko"}\')).toEqual({ vreme: "08:00", kapacitet: 3 })',
        },
      ],
      hints: [
        "Sa `unknown` ne možeš odmah da pišeš `data.vreme`. Prvo proveri da je `data` objekat: `typeof data === \"object\" && data !== null`.",
        "Pa da polje postoji i ima dobar tip: `\"vreme\" in data && typeof data.vreme === \"string\"`. Isto za `kapacitet` sa `\"number\"`.",
        "Sve provere spoji sa `&&` u jedan `if`, i unutra vrati nov objekat `{ vreme: data.vreme, kapacitet: data.kapacitet }`. Inače `return null`.",
      ],
      explanation:
        "Ovo je granica između tvog koda i spoljnog sveta. Unutar aplikacije tipovi garantuju oblik podataka, ali JSON sa servera, iz `localStorage`-a ili iz fajla može biti bilo šta. Looply radi isto u `domain/importData.ts`: uvezeni podaci su `Record<string, unknown>` dok se svako polje ne proveri. U većim projektima se za ovo koriste biblioteke kao *zod*, ali ideja je ista.",
    },
    {
      kind: "quiz",
      id: "ts-greske-quiz",
      questions: [
        {
          q: "Greška glasi: `Argument of type 'StudioId | null' is not assignable to parameter of type 'StudioId'`. Koja popravka je najbolja?",
          options: [
            "`nazivStudija(studio as StudioId)`",
            "`nazivStudija(studio!)`",
            "Pre poziva obraditi `null`: `if (!studio) return ...`",
            "Dodati `// @ts-ignore` iznad linije",
          ],
          answer: 2,
          why: "Ostale tri opcije samo ućutkaju TypeScript. Ako je `studio` zaista `null`, kod pukne ili prikaže pogrešan podatak. Provera rešava stvarni slučaj.",
        },
        {
          q: "Šta uključuje `\"strict\": true` u `tsconfig.json`?",
          options: [
            "Brže kompajliranje",
            "Paket strožih provera, između ostalog zabranu implicitnog `any` i proveru `null`/`undefined`",
            "Zabranu korišćenja JavaScript fajlova",
            "Automatsko popravljanje grešaka",
          ],
          answer: 1,
          why: "`strict` je skup opcija (`noImplicitAny`, `strictNullChecks` i druge). Bez njega bi TS7006 i TS18047 greške tiho prolazile.",
        },
        {
          q: "U `tsconfig`-u piše `\"paths\": { \"@/*\": [\"./src/*\"] }`. Šta znači `import { t } from '@/i18n'`?",
          options: [
            "Uvoz iz npm paketa `@/i18n`",
            "Uvoz iz `src/i18n`",
            "Uvoz iz foldera `@` u korenu projekta",
            "Greška, `@` nije dozvoljen",
          ],
          answer: 1,
          why: "`@/` je alias za `src/`. Isti import radi iz bilo kog fajla, bez `../../..` putanja.",
        },
        {
          q: "Koja je razlika između `any` i `unknown`?",
          options: [
            "Nema razlike",
            "`any` dozvoljava sve bez provere; `unknown` traži da proveriš tip pre upotrebe",
            "`unknown` dozvoljava sve; `any` traži proveru",
            "`unknown` se koristi samo za greške",
          ],
          answer: 1,
          why: "`unknown` je bezbedan „ne znam”: TypeScript te tera na narrowing. `any` je „ne pitaj”, i greške se sele u runtime.",
        },
        {
          q: "Šta znači `error TS2554: Expected 2 arguments, but got 1`?",
          options: [
            "Funkcija vraća pogrešan tip",
            "Funkcija je pozvana sa jednim argumentom, a potpis traži dva",
            "Promenljiva je deklarisana dva puta",
            "Fali `import`",
          ],
          answer: 1,
          why: "Broj argumenata u pozivu ne odgovara potpisu. Česta posledica AI izmene: neko je dodao parametar funkciji, a nije ažurirao sve pozive.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-ts-greske-1",
      front: "Kako proveriti tipove u celom projektu iz terminala?",
      back: "`npx tsc --noEmit` (ili `-p tsconfig.app.json` za određen config), odnosno `npm run typecheck` ako projekat ima tu skriptu. Bez ispisa = nula grešaka.",
    },
    {
      id: "fc-ts-greske-2",
      front: "Kako se čita „Type 'X' is not assignable to type 'Y'”?",
      back: "X je ono što je prosleđeno, Y je ono što se očekuje. Uvučeni red ispod poruke kaže konkretan razlog (npr. deo `undefined`).",
    },
    {
      id: "fc-ts-greske-3",
      front: "TS18047 / TS18048: „'x' is possibly 'null' / 'undefined'”. Šta radiš?",
      back: "Obradiš slučaj kad vrednosti nema: rani povratak (`if (!x) return`), `?.` ili `??`. Ne `!`.",
    },
    {
      id: "fc-ts-greske-4",
      front: "`any` ili `unknown` za podatke spolja (JSON, URL)?",
      back: "`unknown`. Tera te da proveriš oblik pre upotrebe. `any` isključuje proveru i sakriva greške.",
    },
    {
      id: "fc-ts-greske-5",
      front: "Zašto izbegavati `as`, `!` i `@ts-ignore`?",
      back: "Brišu poruku, a ne grešku. Ako je pretpostavka pogrešna, kod pukne u runtime-u bez upozorenja.",
    },
  ],
};

export default lesson;
