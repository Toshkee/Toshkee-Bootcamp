import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "metode-nizova",
  title: "Metode nizova: map, filter, find, reduce, sort",
  summary:
    "Kako se nizovi filtriraju, pretvaraju, pretražuju, sabiraju i sortiraju, zašto `sort` menja original i kako se sve to ulančava u jedan čitljiv izraz.",
  minutes: 22,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Skoro sav "pametan" kod u tvojim projektima radi sa listama: slobodni termini, aktivne pretplate, članovi sa isteklom članarinom, zbir svih uplata. Za to JavaScript nizovi imaju ugrađene **metode**.

Sve to može da se napiše i petljom \`for\`, ali metode imaju dve velike prednosti:

1. **Kažu ŠTA radiš, a ne KAKO.** \`termini.filter(jeSlobodan)\` se čita kao rečenica. Petlja sa brojačem \`i\` mora da se prati red po red.
2. **Ne menjaju original** (osim \`sort\`, o tome niže). Vraćaju nov niz, što je baš ono što React i Zustand traže.

Sve metode u ovoj lekciji primaju **callback**: funkciju koju one pozovu za svaki element.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Traka u fabrici",
      md: `Zamisli niz kao proizvode na pokretnoj traci, a metode kao mašine pored nje:

- **\`filter\`** je kontrolor koji propušta samo ispravne proizvode.
- **\`map\`** je mašina koja svaki proizvod prepakuje u nešto drugo.
- **\`find\`** je radnik koji traži **prvi** proizvod koji odgovara i odmah staje.
- **\`reduce\`** je vaga na kraju trake koja sve sabere u jednu vrednost.

Mašine možeš da poređaš jednu za drugom. To je **ulančavanje**.`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "termini.js",
      code: `const termini = [
  { id: "s1", studio: "fitness", vreme: "08:00", kapacitet: 6, zauzeto: 6 },
  { id: "s2", studio: "fitness", vreme: "18:00", kapacitet: 6, zauzeto: 3 },
  { id: "s3", studio: "pilates", vreme: "09:00", kapacitet: 4, zauzeto: 1 },
]`,
      caption: "Ovaj niz koristimo u primerima ispod.",
    },
    {
      kind: "prose",
      md: `### \`map\`: pretvori svaki element

\`map\` pozove callback za svaki element i od onoga što callback **vrati** napravi nov niz. Rezultat uvek ima **isto toliko** elemenata kao original.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `termini.map((t) => t.vreme)
// ["08:00", "18:00", "09:00"]

termini.map((t) => t.kapacitet - t.zauzeto)
// [0, 3, 3]

termini.map((t) => ({ ...t, slobodno: t.kapacitet - t.zauzeto }))
// isti termini, svaki sa jednim poljem više`,
      caption:
        "U Reactu je `map` način da od niza podataka dobiješ niz komponenti: `termini.map((t) => <SessionRow key={t.id} session={t} />)`.",
    },
    {
      kind: "prose",
      md: `### \`filter\`: zadrži samo neke

\`filter\` zadrži element ako callback vrati truthy vrednost, a izbaci ga ako vrati falsy. Rezultat može biti kraći, pa i prazan niz \`[]\`.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `termini.filter((t) => t.zauzeto < t.kapacitet)
// s2 i s3, jer s1 je pun

termini.filter((t) => t.studio === "boks")
// []  (nijedan, ali i dalje niz)`,
    },
    {
      kind: "prose",
      md: `### \`find\`, \`some\`, \`every\`, \`includes\`: pitanja nad nizom

- **\`find\`** vraća **prvi** element za koji callback vrati \`true\`, ili \`undefined\` ako ga nema. Nije niz, nego sam element.
- **\`some\`** vraća \`true\` ako **bar jedan** element odgovara.
- **\`every\`** vraća \`true\` ako **svi** odgovaraju.
- **\`includes\`** proverava da li niz sadrži tačno tu vrednost. Bez callback-a, za proste vrednosti.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `termini.find((t) => t.id === "s2")        // { id: "s2", ... }
termini.find((t) => t.id === "nema")      // undefined

termini.some((t) => t.zauzeto === t.kapacitet)   // true, s1 je pun
termini.every((t) => t.kapacitet >= 4)           // true

const STUDIJI = ["fitness", "pilates"]
STUDIJI.includes("pilates")   // true
STUDIJI.includes("boks")      // false`,
      caption:
        "`find` se skoro uvek kombinuje sa `?.` ili `??`, jer možda neće ništa naći. U ReformStudiju: `active.find((b) => b.sessionId === session.id) ?? null`.",
    },
    {
      kind: "prose",
      md: `### \`reduce\`: svedi ceo niz na jednu vrednost

\`reduce\` je najmoćnija i najteža metoda. Ide kroz niz i nosi jednu vrednost sa sobom, **akumulator** (\`zbir\` u primeru). Callback za svaki element kaže kako se akumulator menja. Drugi argument (\`0\`) je početna vrednost.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `const ukupnoZauzeto = termini.reduce((zbir, t) => zbir + t.zauzeto, 0)

// korak po korak:
// zbir = 0           (početna vrednost)
// zbir = 0 + 6 = 6   (s1)
// zbir = 6 + 3 = 9   (s2)
// zbir = 9 + 1 = 10  (s3)  → rezultat 10`,
      highlight: [1],
      caption:
        "Akumulator ne mora biti broj. Može biti objekat, npr. `{ fitness: 2, pilates: 1 }`, ako brojiš po grupama.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Kad `reduce`, a kad ne",
      md: "Za zbir i brojanje po grupama `reduce` je odličan. Ali ako ti `reduce` izgleda zbunjujuće, često je čitljivije da prvo `filter` pa `map`, ili da se napiše obična `for...of` petlja. Looply u `categoryBreakdown` koristi baš `for...of` petlju za grupisanje, i to je sasvim u redu.",
    },
    {
      kind: "prose",
      md: `### \`sort\`: redosled, i jedna velika zamka

\`sort\` prima callback koji poredi dva elementa \`a\` i \`b\`:

- negativan broj → \`a\` ide pre \`b\`
- pozitivan broj → \`b\` ide pre \`a\`
- \`0\` → svejedno

Za brojeve: \`(a, b) => a - b\` je rastuće, \`(a, b) => b - a\` opadajuće. Za tekst: \`a.localeCompare(b)\`, koji ispravno sortira i "Š" i "Đ".`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`sort` menja originalni niz",
      md: `Za razliku od \`map\` i \`filter\`, \`sort\` **preuređuje sam niz** na kome je pozvan (i vraća taj isti niz). Ako je to niz iz React stanja ili Zustand store-a, upravo je izmenjen original, a to je greška iz prošle lekcije.

\`\`\`js
const sortirani = [...termini].sort((a, b) => a.vreme.localeCompare(b.vreme))  // ✅ kopija pa sort
const sortirani2 = termini.toSorted((a, b) => a.vreme.localeCompare(b.vreme))  // ✅ novija metoda, ne menja original
\`\`\`

Druga zamka: \`sort()\` **bez callback-a** sve poredi kao tekst. \`[10, 9, 1].sort()\` daje \`[1, 10, 9]\`, jer "10" po abecedi ide pre "9".`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/lib/weights.ts",
      lang: "ts",
      startLine: 7,
      intro:
        "Ekran Kilaža u ReformStudiju prikazuje merenja od najnovijeg. Ovo je cela funkcija, kratka ali puna dobrih odluka.",
      code: `/** Najnovije mjerenje prvo (po danu mjerenja); ne mijenja ulaz. */
export const newestFirst = (entries: readonly WeightEntry[]): WeightEntry[] =>
  [...entries].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))
`,
      steps: [
        {
          lines: 1,
          md: "Komentar eksplicitno kaže *ne menja ulaz*. To je obećanje onome ko koristi funkciju: niz koji pošalješ ostaje kakav je bio.",
        },
        {
          lines: 3,
          md: "`[...entries]` prvo napravi kopiju, pa se sortira kopija. Ovo je tačno onaj obrazac iz upozorenja iznad.",
        },
        {
          lines: 3,
          md: "`b.measuredAt.localeCompare(a.measuredAt)`: `b` i `a` su namerno zamenjeni, pa je redosled **opadajući**, najnoviji prvi. Datumi su tekst oblika `2026-11-15`, a takav tekst se sortira isto kao datum.",
        },
        {
          lines: 2,
          md: "`readonly` je TypeScript-ov način da kaže \"ovaj niz se ne sme menjati\". Da je neko napisao `entries.sort(...)` direktno, editor bi to podvukao crvenom bojom. Više u modulu TypeScript.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Ulančavanje

Pošto \`filter\`, \`map\` i \`sort\` vraćaju niz, na rezultat odmah može da se pozove sledeća metoda. Svaki red je jedan korak transformacije. Ovo je najčešći oblik u kome ćeš sretati metode nizova:`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/lib/fixedSlots.ts",
      lang: "ts",
      startLine: 74,
      intro:
        "Kad admin menja raspored, panel ga upozori ako neki članovi na tom terminu imaju **stalni termin**. Ova funkcija pravi spisak njihovih imena. Pet metoda, jedna za drugom.",
      code: `/**
 * Članovi čiji stalni termin pada na slot šablona (isti dan i sat), po imenu: za upozorenje
 * prije izmjene satnice ili brisanja slota. \`fixedSlots\` su stalni termini izabranog studija.
 */
export const fixedHolders = (
  fixedSlots: readonly FixedSlot[],
  members: readonly User[],
  slot: Pick<FixedSlot, 'weekday' | 'time'>,
) =>
  fixedSlots
    .filter((fixed) => fixed.weekday === slot.weekday && fixed.time === slot.time)
    .map((fixed) => members.find((member) => member.id === fixed.uid))
    .filter((member): member is User => Boolean(member))
    .map(fullName)
    .sort((a, b) => a.localeCompare(b, 'sr'))
`,
      steps: [
        {
          lines: [5, 9],
          md: "Ulaz (ignoriši tipove): svi stalni termini studija, svi članovi i jedan slot iz šablona (dan i vreme). Posle `=>` sledi jedan dugačak izraz, pa je return implicitan.",
        },
        {
          lines: 11,
          md: "**filter**: zadrži samo stalne termine koji padaju baš na ovaj dan **i** u ovo vreme.",
        },
        {
          lines: 12,
          md: "**map + find**: svaki stalni termin pretvori u člana kome pripada. `find` traži člana čiji je `id` jednak `uid`-u iz stalnog termina. Ako član ne postoji (npr. obrisan je), `find` vrati `undefined`.",
        },
        {
          lines: 13,
          md: "**filter(Boolean)**: izbaci `undefined`-ove. `Boolean(member)` je `false` za `undefined`, a `true` za objekat. Ignoriši `member is User`, to samo javlja TypeScript-u da posle ovoga sigurno nema `undefined`.",
        },
        {
          lines: 14,
          md: "**map(fullName)**: `fullName` je funkcija iz `members.ts` koja od člana napravi \"Ime Prezime\". Ovde se predaje **po imenu**, bez zagrada, kao callback. Isto je kao `.map((m) => fullName(m))`, samo kraće.",
        },
        {
          lines: 15,
          md: "**sort**: po abecedi, po srpskim pravilima (`'sr'`), pa \"Đurović\" ide posle \"Dragić\". Ovde je `sort` bezbedan, jer sortira niz koji je upravo napravio `map`, a ne nečiji original.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "js-nizovi-1",
      title: "map i filter",
      lang: "js",
      prompt: `Napravi tri niza od \`termini\`:

- \`vremena\`: samo vremena svih termina, npr. \`["08:00", ...]\`
- \`slobodni\`: termini koji **nisu** puni (\`zauzeto < kapacitet\`)
- \`fitnessVremena\`: vremena samo onih termina koji su u studiju \`"fitness"\` (ulančaj dve metode)`,
      starter: `const termini = [
  { id: "s1", studio: "fitness", vreme: "08:00", kapacitet: 6, zauzeto: 6 },
  { id: "s2", studio: "fitness", vreme: "18:00", kapacitet: 6, zauzeto: 3 },
  { id: "s3", studio: "pilates", vreme: "09:00", kapacitet: 4, zauzeto: 1 },
  { id: "s4", studio: "pilates", vreme: "19:00", kapacitet: 4, zauzeto: 4 },
  { id: "s5", studio: "fitness", vreme: "20:00", kapacitet: 6, zauzeto: 0 },
]

const vremena = []
const slobodni = []
const fitnessVremena = []

console.log(vremena)
console.log(fitnessVremena)
`,
      solution: `const termini = [
  { id: "s1", studio: "fitness", vreme: "08:00", kapacitet: 6, zauzeto: 6 },
  { id: "s2", studio: "fitness", vreme: "18:00", kapacitet: 6, zauzeto: 3 },
  { id: "s3", studio: "pilates", vreme: "09:00", kapacitet: 4, zauzeto: 1 },
  { id: "s4", studio: "pilates", vreme: "19:00", kapacitet: 4, zauzeto: 4 },
  { id: "s5", studio: "fitness", vreme: "20:00", kapacitet: 6, zauzeto: 0 },
]

const vremena = termini.map((t) => t.vreme)
const slobodni = termini.filter((t) => t.zauzeto < t.kapacitet)
const fitnessVremena = termini
  .filter((t) => t.studio === "fitness")
  .map((t) => t.vreme)

console.log(vremena)
console.log(fitnessVremena)
`,
      tests: [
        {
          name: "vremena su sva vremena, istim redom",
          code: 'expect(vremena).toEqual(["08:00", "18:00", "09:00", "19:00", "20:00"])',
        },
        {
          name: "slobodni su s2, s3 i s5",
          code: 'expect(slobodni.map((t) => t.id)).toEqual(["s2", "s3", "s5"])',
        },
        {
          name: "fitnessVremena su 08:00, 18:00 i 20:00",
          code: 'expect(fitnessVremena).toEqual(["08:00", "18:00", "20:00"])',
        },
        { name: "originalni niz i dalje ima 5 termina", code: "expect(termini).toHaveLength(5)" },
      ],
      hints: [
        "`termini.map((t) => t.vreme)` vraća niz vremena.",
        "Za slobodne: `termini.filter((t) => t.zauzeto < t.kapacitet)`.",
        "Za fitnessVremena prvo `filter` po studiju, pa na rezultat `map` po vremenu: `termini.filter(...).map(...)`.",
      ],
      explanation:
        "Redosled u lancu je bitan: prvo `filter` (dok još imaš ceo objekat i znaš studio), pa `map`. Obrnuto ne bi išlo, jer posle `map` imaš samo tekst vremena, bez informacije o studiju.",
    },
    {
      kind: "exercise",
      id: "js-nizovi-2",
      title: "find, some, every, includes",
      lang: "js",
      prompt: `Napiši četiri male funkcije. Svaka je jedna linija sa odgovarajućom metodom.

- \`nadjiTermin(termini, id)\` vraća termin sa tim \`id\`, ili \`undefined\`
- \`imaSlobodnih(termini, studio)\` vraća \`true\` ako u tom studiju postoji bar jedan termin koji nije pun
- \`sviPuni(termini)\` vraća \`true\` ako su svi termini puni
- \`dozvoljenStudio(studio)\` vraća \`true\` ako je \`studio\` u nizu \`STUDIJI\``,
      starter: `const STUDIJI = ["fitness", "pilates"]

const termini = [
  { id: "s1", studio: "fitness", vreme: "08:00", kapacitet: 6, zauzeto: 6 },
  { id: "s2", studio: "fitness", vreme: "18:00", kapacitet: 6, zauzeto: 3 },
  { id: "s3", studio: "pilates", vreme: "09:00", kapacitet: 4, zauzeto: 4 },
]

function nadjiTermin(termini, id) {}

function imaSlobodnih(termini, studio) {}

function sviPuni(termini) {}

function dozvoljenStudio(studio) {}

console.log(nadjiTermin(termini, "s2"))
`,
      solution: `const STUDIJI = ["fitness", "pilates"]

const termini = [
  { id: "s1", studio: "fitness", vreme: "08:00", kapacitet: 6, zauzeto: 6 },
  { id: "s2", studio: "fitness", vreme: "18:00", kapacitet: 6, zauzeto: 3 },
  { id: "s3", studio: "pilates", vreme: "09:00", kapacitet: 4, zauzeto: 4 },
]

function nadjiTermin(termini, id) {
  return termini.find((t) => t.id === id)
}

function imaSlobodnih(termini, studio) {
  return termini.some((t) => t.studio === studio && t.zauzeto < t.kapacitet)
}

function sviPuni(termini) {
  return termini.every((t) => t.zauzeto === t.kapacitet)
}

function dozvoljenStudio(studio) {
  return STUDIJI.includes(studio)
}

console.log(nadjiTermin(termini, "s2"))
`,
      tests: [
        { name: "nadjiTermin(termini, \"s2\") vraća termin u 18:00", code: 'expect(nadjiTermin(termini, "s2").vreme).toBe("18:00")' },
        { name: "nadjiTermin za nepostojeći id vraća undefined", code: 'expect(nadjiTermin(termini, "x9")).toBe(undefined)' },
        { name: "fitness ima slobodnih", code: 'expect(imaSlobodnih(termini, "fitness")).toBe(true)' },
        { name: "pilates nema slobodnih", code: 'expect(imaSlobodnih(termini, "pilates")).toBe(false)' },
        { name: "nisu svi termini puni", code: "expect(sviPuni(termini)).toBe(false)" },
        {
          name: "puni termini su svi puni",
          code: "expect(sviPuni(termini.filter((t) => t.zauzeto === t.kapacitet))).toBe(true)",
        },
        { name: "pilates je dozvoljen, boks nije", code: 'expect(dozvoljenStudio("pilates")).toBe(true)\nexpect(dozvoljenStudio("boks")).toBe(false)' },
      ],
      hints: [
        "Sve četiri funkcije treba da imaju `return`. Bez njega vraćaju `undefined`.",
        "`find` i `some` i `every` primaju callback `(t) => uslov`. `includes` prima samu vrednost: `STUDIJI.includes(studio)`.",
        "`imaSlobodnih` ima dva uslova spojena sa `&&`: isti studio **i** `zauzeto < kapacitet`.",
      ],
      explanation:
        "Zanimljivost: `[].every(...)` je uvek `true` (nijedan element ne krši uslov), a `[].some(...)` uvek `false`. Ako ti prazna lista nije \"svi puni\", proveri i `length`.",
    },
    {
      kind: "exercise",
      id: "js-nizovi-3",
      title: "reduce: zarada i brojanje",
      lang: "js",
      prompt: `Vlasnik studija želi dva broja iz rezervacija. Otkazane (\`status: "cancelled"\`) se ne računaju.

- \`ukupnaZarada(rezervacije)\` vraća zbir \`cena\` svih **aktivnih** rezervacija
- \`brojPoStudiju(rezervacije)\` vraća objekat sa brojem aktivnih rezervacija po studiju, npr. \`{ fitness: 2, pilates: 1 }\`

Koristi \`reduce\` (možeš ga ulančati posle \`filter\`).`,
      starter: `const rezervacije = [
  { id: "b1", studio: "fitness", cena: 1500, status: "active" },
  { id: "b2", studio: "pilates", cena: 2000, status: "active" },
  { id: "b3", studio: "fitness", cena: 1500, status: "cancelled" },
  { id: "b4", studio: "fitness", cena: 1500, status: "active" },
]

function ukupnaZarada(rezervacije) {
  return 0
}

function brojPoStudiju(rezervacije) {
  return {}
}

console.log(ukupnaZarada(rezervacije))
console.log(brojPoStudiju(rezervacije))
`,
      solution: `const rezervacije = [
  { id: "b1", studio: "fitness", cena: 1500, status: "active" },
  { id: "b2", studio: "pilates", cena: 2000, status: "active" },
  { id: "b3", studio: "fitness", cena: 1500, status: "cancelled" },
  { id: "b4", studio: "fitness", cena: 1500, status: "active" },
]

function ukupnaZarada(rezervacije) {
  return rezervacije
    .filter((r) => r.status === "active")
    .reduce((zbir, r) => zbir + r.cena, 0)
}

function brojPoStudiju(rezervacije) {
  return rezervacije
    .filter((r) => r.status === "active")
    .reduce((brojevi, r) => {
      brojevi[r.studio] = (brojevi[r.studio] ?? 0) + 1
      return brojevi
    }, {})
}

console.log(ukupnaZarada(rezervacije))
console.log(brojPoStudiju(rezervacije))
`,
      tests: [
        { name: "ukupna zarada je 5000", code: "expect(ukupnaZarada(rezervacije)).toBe(5000)" },
        { name: "bez rezervacija zarada je 0", code: "expect(ukupnaZarada([])).toBe(0)" },
        {
          name: "po studiju: fitness 2, pilates 1",
          code: "expect(brojPoStudiju(rezervacije)).toEqual({ fitness: 2, pilates: 1 })",
        },
        {
          name: "otkazana rezervacija se ne broji",
          code: 'expect(brojPoStudiju([{ id: "x", studio: "boks", cena: 1, status: "cancelled" }])).toEqual({})',
        },
      ],
      hints: [
        "Zarada: prvo `filter` po statusu, pa `.reduce((zbir, r) => zbir + r.cena, 0)`.",
        "Za brojanje akumulator je objekat i počinje kao `{}`. Za svaku rezervaciju: `brojevi[r.studio] = (brojevi[r.studio] ?? 0) + 1`.",
        "Callback u `reduce` mora da **vrati** akumulator. Kad koristiš `{ }` telo, ne zaboravi `return brojevi` na kraju.",
      ],
      explanation:
        "`brojevi[r.studio]` koristi uglaste zagrade jer je ime polja u promenljivoj. Prvi put polje ne postoji (`undefined`), pa `?? 0` daje početnu nulu. Zaboravljen `return` u callback-u je najčešća greška sa `reduce`: sledeći krug tada dobije `undefined`.",
    },
    {
      kind: "exercise",
      id: "js-nizovi-4",
      title: "Sledeći slobodni termini (bez mutacije)",
      lang: "js",
      prompt: `Funkcija \`sledeciSlobodni(termini, odVremena, koliko)\` treba da vrati **vremena** prvih \`koliko\` termina koji:
- nisu puni, i
- počinju u \`odVremena\` ili kasnije,

sortiranih od najranijeg. Trenutna verzija ima dve greške: ne filtrira, i **menja redosled originalnog niza**. Popravi je.

Savet: vremena oblika \`"09:00"\` mogu da se porede direktno kao tekst, \`"09:00" < "18:00"\` je \`true\`.`,
      starter: `const termini = [
  { id: "s1", vreme: "20:00", kapacitet: 6, zauzeto: 2 },
  { id: "s2", vreme: "08:00", kapacitet: 6, zauzeto: 1 },
  { id: "s3", vreme: "18:00", kapacitet: 6, zauzeto: 6 },
  { id: "s4", vreme: "09:00", kapacitet: 4, zauzeto: 0 },
  { id: "s5", vreme: "19:00", kapacitet: 4, zauzeto: 3 },
]

function sledeciSlobodni(termini, odVremena, koliko) {
  return termini
    .sort((a, b) => a.vreme.localeCompare(b.vreme))
    .map((t) => t.vreme)
}

console.log(sledeciSlobodni(termini, "09:00", 2))
console.log(termini.map((t) => t.id))
`,
      solution: `const termini = [
  { id: "s1", vreme: "20:00", kapacitet: 6, zauzeto: 2 },
  { id: "s2", vreme: "08:00", kapacitet: 6, zauzeto: 1 },
  { id: "s3", vreme: "18:00", kapacitet: 6, zauzeto: 6 },
  { id: "s4", vreme: "09:00", kapacitet: 4, zauzeto: 0 },
  { id: "s5", vreme: "19:00", kapacitet: 4, zauzeto: 3 },
]

function sledeciSlobodni(termini, odVremena, koliko) {
  return termini
    .filter((t) => t.zauzeto < t.kapacitet && t.vreme >= odVremena)
    .sort((a, b) => a.vreme.localeCompare(b.vreme))
    .slice(0, koliko)
    .map((t) => t.vreme)
}

console.log(sledeciSlobodni(termini, "09:00", 2))
console.log(termini.map((t) => t.id))
`,
      tests: [
        {
          name: "od 09:00, prva dva: 09:00 i 19:00 (18:00 je pun)",
          code: 'expect(sledeciSlobodni(termini, "09:00", 2)).toEqual(["09:00", "19:00"])',
        },
        {
          name: "od 00:00, prva četiri slobodna, sortirana",
          code: 'expect(sledeciSlobodni(termini, "00:00", 10)).toEqual(["08:00", "09:00", "19:00", "20:00"])',
        },
        {
          name: "od 21:00 nema ničega",
          code: 'expect(sledeciSlobodni(termini, "21:00", 3)).toEqual([])',
        },
        {
          name: "originalni niz ostaje u istom redosledu",
          code: 'sledeciSlobodni(termini, "00:00", 5)\nexpect(termini.map((t) => t.id)).toEqual(["s1", "s2", "s3", "s4", "s5"])',
        },
      ],
      hints: [
        "Dodaj `filter` **pre** `sort`. Posle `filter` imaš nov niz, pa `sort` više ne dira original.",
        "Uslov u filteru: `t.zauzeto < t.kapacitet && t.vreme >= odVremena`.",
        "Prvih N elemenata: `.slice(0, koliko)`. Ceo lanac: `filter` → `sort` → `slice` → `map`.",
      ],
      explanation:
        "Isti trik kao u `fixedHolders`: `sort` je bezbedan kad radi nad nizom koji je upravo napravila prethodna metoda u lancu. Da ti ne treba `filter`, rešenje bi bilo `[...termini].sort(...)` ili `termini.toSorted(...)`.",
    },
    {
      kind: "quiz",
      id: "js-nizovi-quiz",
      questions: [
        {
          q: "Šta ispisuje ovaj kod?",
          code: `console.log([10, 9, 1].sort())`,
          codeLang: "js",
          options: ["`[1, 9, 10]`", "`[10, 9, 1]`", "`[1, 10, 9]`", "`[9, 10, 1]`"],
          answer: 2,
          why: "Bez callback-a `sort` poredi elemente kao tekst, a `\"10\"` po abecedi ide pre `\"9\"`. Za brojeve uvek `sort((a, b) => a - b)`.",
        },
        {
          q: "Šta vraća `filter` kad nijedan element ne odgovara?",
          options: ["`undefined`", "`null`", "`[]`", "`false`"],
          answer: 2,
          why: "`filter` uvek vraća niz, pa makar i prazan. Zato na rezultat smeš da pozoveš `.map` ili `.length` bez provere.",
        },
        {
          q: "Šta vraća `find` kad nijedan element ne odgovara?",
          options: ["`undefined`", "`[]`", "`-1`", "`null`"],
          answer: 0,
          why: "`find` vraća sam element, ne niz, a kad ga nema vraća `undefined`. Zato se uz njega često piše `?.` ili `?? null`.",
        },
        {
          q: "Šta ispisuje ovaj kod?",
          code: `const a = [3, 1, 2]
const b = a.sort((x, y) => x - y)
console.log(a, a === b)`,
          codeLang: "js",
          options: [
            "`[3, 1, 2] false`",
            "`[1, 2, 3] true`",
            "`[1, 2, 3] false`",
            "`[3, 1, 2] true`",
          ],
          answer: 1,
          why: "`sort` preuređuje originalni niz i vraća **taj isti** niz. `a` je sortiran, a `b` je samo drugo ime za njega.",
        },
        {
          q: "Koliko je `x`?",
          code: `const x = [1, 2, 3, 4]
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .reduce((zbir, n) => zbir + n, 0)`,
          codeLang: "js",
          options: ["`100`", "`60`", "`40`", "`[20, 40]`"],
          answer: 1,
          why: "`filter` zadrži parne: `[2, 4]`. `map` ih pomnoži: `[20, 40]`. `reduce` sabere: `60`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-js-nizovi-1",
      front: "`map` vs `filter`?",
      back: "`map` pretvara svaki element (ista dužina). `filter` zadržava samo one za koje callback vrati truthy (može biti kraće).",
    },
    {
      id: "fc-js-nizovi-2",
      front: "Šta vraća `find`, a šta `filter`?",
      back: "`find` vraća prvi element ili `undefined`. `filter` vraća niz svih koji odgovaraju, ili `[]`.",
    },
    {
      id: "fc-js-nizovi-3",
      front: "Koja metoda niza menja original?",
      back: "`sort` (i `push`, `splice`, `reverse`). Za sortiranje bez mutacije: `[...niz].sort(...)` ili `niz.toSorted(...)`.",
    },
    {
      id: "fc-js-nizovi-4",
      front: "Kako izgleda zbir sa `reduce`?",
      back: "`niz.reduce((zbir, x) => zbir + x, 0)`. Drugi argument je početna vrednost akumulatora.",
    },
    {
      id: "fc-js-nizovi-5",
      front: "Kako se sortira tekst, a kako brojevi?",
      back: "Tekst: `(a, b) => a.localeCompare(b)`. Brojevi: `(a, b) => a - b` rastuće, `(a, b) => b - a` opadajuće.",
    },
  ],
};

export default lesson;
