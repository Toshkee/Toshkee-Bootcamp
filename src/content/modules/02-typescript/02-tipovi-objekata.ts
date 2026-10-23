import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "tipovi-objekata",
  title: "Oblik podataka: type i interface",
  summary:
    "Kako se opisuje oblik objekta: `interface` i `type`, opciona i `readonly` polja, ugnežđeni tipovi i nizovi objekata.",
  minutes: 18,
  projects: ["ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `U prethodnoj lekciji tipovi su bili jednostavni: \`string\`, \`number\`, \`boolean\`. Ali pravi podaci u tvojim aplikacijama skoro nikad nisu samo jedan broj. Rezervacija ima korisnika, termin, studio, status. Član ima ime, telefon, članarinu.

To su **objekti**, i TypeScript ima način da opiše njihov **oblik**: koja polja postoje i kog je tipa svako od njih. Kad jednom opišeš oblik, TypeScript ti na svakom mestu u projektu kaže ako neko polje fali, ako je pogrešno napisano ili ako ima pogrešan tip.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao prazan formular",
      md: `\`interface\` je kao prazan formular na recepciji teretane: *Ime: ____, Telefon: ____, Datum uplate (ako postoji): ____*. Formular ne sadrži podatke nijednog člana, samo propisuje **koja polja moraju da se popune**. Svaki popunjen formular je jedan objekat. TypeScript je recepcioner koji vrati formular ako je nešto obavezno ostalo prazno.`,
    },
    {
      kind: "prose",
      md: `### Prvi objektni tip

Oblik objekta pišeš u vitičastim zagradama: ime polja, dvotačka, tip. Taj oblik možeš napisati direktno na parametru, ali je mnogo praktičnije da mu daš **ime**, pa da ga koristiš svuda. Za to postoje dve ključne reči: \`interface\` i \`type\`.`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "paket.ts",
      code: `// 1) Oblik napisan direktno na parametru (radi, ali se ne može ponovo koristiti)
function opis(paket: { naziv: string; cena: number }) {
  return paket.naziv + ": " + paket.cena + " RSD"
}

// 2) Isti oblik, ali sa imenom: interface
interface Paket {
  naziv: string
  cena: number
}

// 3) Isti oblik, ali sa imenom: type
type PaketT = {
  naziv: string
  cena: number
}

function opisPaketa(paket: Paket) {
  return paket.naziv + ": " + paket.cena + " RSD"
}`,
      highlight: [7, 13, 18],
      caption:
        "Sve tri varijante opisuju isti oblik. Imenovani tip (`Paket`) pišeš jednom, a koristiš u desetinama fajlova.",
    },
    {
      kind: "prose",
      md: `Konvencija je da imena tipova počinju **velikim slovom** (\`Paket\`, \`BookingDoc\`), a promenljive malim (\`paket\`, \`booking\`). Tako se na prvi pogled vidi šta je tip, a šta vrednost.

Sad pogledaj šta TypeScript radi kad objekat ne odgovara obliku:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `const a: Paket = { naziv: "Mesečna", cena: 3000 }              // ✅
const b: Paket = { naziv: "Mesečna" }                          // ❌ Property 'cena' is missing
const c: Paket = { naziv: "Mesečna", cena: "3000" }            // ❌ Type 'string' is not assignable to type 'number'
const d: Paket = { naziv: "Mesečna", cena: 3000, popust: 10 }  // ❌ Object literal may only specify known properties`,
      highlight: [2, 3, 4],
      caption:
        "Tri najčešće greške sa objektima: polje fali, polje ima pogrešan tip, ili polje ne postoji u obliku (često je to samo slovna greška, recimo `cijena` umesto `cena`).",
    },
    {
      kind: "prose",
      md: `### Opciona polja: znak pitanja

Neka polja ne moraju uvek da postoje. Član je možda uplatio članarinu, a možda nije. Za to služi **\`?\`** posle imena polja: \`paidAt?: string\`.

Važna posledica: kad **čitaš** opciono polje, njegov tip je \`string | undefined\`, a ne samo \`string\`. TypeScript te zato tera da proveriš da li vrednost postoji pre nego što je koristiš. Tu ćeš u sledećoj lekciji naučiti trikove za proveru.

Evo kako to izgleda u tvom ReformStudio backend-u, u fajlu koji opisuje sve dokumente u Firestore bazi:`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/shared/types.ts",
      lang: "ts",
      startLine: 71,
      intro:
        "Dva interfejsa iz `types.ts`. Ovaj fajl dele i aplikacija i Cloud Functions, pa obe strane znaju tačan oblik svakog dokumenta.",
      code: `/** Članarina u jednom studiju (SPEC → D5). Piše je samo admin, iz panela. */
export interface MembershipDoc {
  /** Posljednji dan važenja, zaključno sa tim danom. */
  validUntil: DayKey
  /** Dan uplate. */
  paidAt?: DayKey
  /** Broj uplaćenih termina — evidencija za admina; ništa se po njemu ne ograničava (P8). */
  sessions?: number
}

export interface NutritionPlanDoc {
  /** Putanja u Storage-u, \`nutrition/{uid}/{fajl}\`. */
  path: string
  fileName: string
  uploadedAt: Instant
}
`,
      steps: [
        {
          lines: 2,
          md: "`export interface MembershipDoc` daje ime obliku i izvozi ga, pa ga mogu uvesti i aplikacija i backend. Sufiks `Doc` je tvoja konvencija: znači da je ovo oblik **dokumenta u bazi**.",
        },
        {
          lines: [3, 4],
          md: "`validUntil` je **obavezno** polje. Tip `DayKey` je definisan gore u istom fajlu kao `type DayKey = string`. To je samo drugo ime za `string`, ali kaže čitaocu da se očekuje datum u obliku `YYYY-MM-DD`, a ne bilo kakav tekst.",
        },
        {
          lines: [5, 8],
          md: "`paidAt?` i `sessions?` imaju znak pitanja, pa su **opcioni**. Članarina može postojati bez datuma uplate. Kad negde pročitaš `membership.sessions`, tip će biti `number | undefined`.",
        },
        {
          lines: [11, 16],
          md: "`NutritionPlanDoc` ima polje `uploadedAt: Instant`. `Instant` je **drugi interfejs** iz istog fajla (opisuje Firestore `Timestamp`). Tipovi se slažu jedan u drugi kao kocke: polje može biti bilo koji tip, pa i drugi objekat.",
        },
        {
          lines: [1, 1],
          md: "Komentari `/** ... */` iznad polja nisu ukras: kad u editoru pređeš mišem preko `membership.paidAt`, videćeš baš taj opis. Dobro dokumentovan tip je najbolja dokumentacija baze.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Ugnežđeni tipovi i nizovi objekata

Polje objekta može biti drugi objekat, ili **niz** objekata. Niz se piše kao tip elementa plus uglaste zagrade: \`string[]\` je niz tekstova, \`BookingDoc[]\` je niz rezervacija.

Kad funkcija dobije niz objekata, TypeScript zna tip svakog elementa, pa ti u \`.filter\` i \`.map\` nudi tačna polja:`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `interface Booking {
  id: string
  studioId: string
  status: string
  clan: {               // ugnežđen objekat, opisan na licu mesta
    ime: string
    telefon: string
  }
}

function aktivne(bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.status === "active")
  //                      ^ TypeScript zna da je b tipa Booking
}

function imena(bookings: Booking[]): string[] {
  return bookings.map((b) => b.clan.ime)
}`,
      highlight: [5, 11, 16],
      caption:
        "Parametar tipa `Booking[]` znači: niz u kome je svaki element `Booking`. Povratni tip `string[]` TypeScript bi i sam zaključio iz `.map`.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Ugnežđeno ili posebno?",
      md: "Ako se ugnežđen oblik koristi samo na jednom mestu, slobodno ga napiši na licu mesta (kao `clan` gore). Čim ti zatreba na dva mesta, izvuci ga u poseban `interface`, kao što je urađeno sa `MembershipDoc` i `NutritionPlanDoc`.",
    },
    {
      kind: "prose",
      md: `### readonly: polje koje se ne menja

Ponekad polje ne sme da se menja posle nastanka objekta, na primer \`id\`. Reč **\`readonly\`** ispred polja to obezbeđuje: TypeScript prijavi grešku na svaku dodelu.

U tvom \`config.ts\` postoji \`interface DefaultTemplate\` sa poljem \`times: readonly string[]\`. To je **niz koji se ne može menjati**: nema \`push\`, nema \`sort\` na licu mesta. Početni raspored studija niko ne sme slučajno da izmeni.`,
    },
    {
      kind: "code",
      lang: "ts",
      code: `interface Clan {
  readonly id: string
  ime: string
  termini: readonly string[]
}

const clan: Clan = { id: "u1", ime: "Ana", termini: ["08:00"] }

clan.ime = "Ana M."          // ✅ obično polje
clan.id = "u2"               // ❌ Cannot assign to 'id' because it is a read-only property
clan.termini.push("18:00")   // ❌ Property 'push' does not exist on type 'readonly string[]'

const izmenjen = { ...clan, termini: [...clan.termini, "18:00"] }  // ✅ nov objekat`,
      highlight: [10, 11, 13],
      caption:
        "`readonly` postoji samo za TypeScript. U pokrenutom JavaScriptu objekat i dalje može da se menja. Ali greška u editoru je dovoljna da ne pogrešiš.",
    },
    {
      kind: "prose",
      md: `### interface ili type?

Za opis objekata rade **oba**, i razlike su male. Ovo je praktično pravilo, koje prati i tvoj kod:

- **\`interface\`** za oblik objekata (dokumenti u bazi, props komponenti, stanje store-a). Može da nasledi drugi interfejs sa \`extends\`: \`interface AdminUser extends UserDoc { ... }\`.
- **\`type\`** za sve ostalo: drugo ime za postojeći tip (\`type DayKey = string\`), izbor između vrednosti (\`type BookingStatus = 'active' | 'cancelled'\`), kombinacije tipova. To \`interface\` ne može.

Kad je izbor nejasan, pogledaj kako je urađeno u ostatku projekta i budi dosledan.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/shared/types.ts",
      lang: "ts",
      startLine: 239,
      intro:
        "Ovde se `type` i `interface` vide jedan pored drugog. Ovo je oblik jedne rezervacije u bazi.",
      code: `export type BookingStatus = 'active' | 'cancelled'
/** \`fixed\` — upisao ga je stalni termin (SPEC → D19); premještanjem postaje \`self\`. */
export type BookingSource = 'self' | 'invite' | 'admin' | 'fixed'

/**
 * \`bookings/{autoId}\`. Premještanje mijenja postojeću rezervaciju (\`sessionId\`, \`startsAt\`,
 * \`durationMin\`) umjesto da pravi novu, pa istorija ostaje čista.
 */
export interface BookingDoc {
  uid: string
  sessionId: string
  studioId: StudioId
  trainingType: TrainingType
  weekKey: string
  startsAt: Instant
  durationMin: number
  status: BookingStatus
  source: BookingSource
  createdAt: Instant
  /** Kada je otkazana (član, admin ili otkazan termin). */
  cancelledAt?: Instant
  /** Stalni termin iz kog je rezervacija nastala (\`source: 'fixed'\`, SPEC → D19). */
  fixedSlotId?: string
}
`,
      steps: [
        {
          lines: [1, 3],
          md: "Ovo su `type`, ne `interface`, jer nisu objekti: opisuju **izbor** između nekoliko tačno određenih tekstova. To se zove *union* i detaljno je obrađeno u sledećoj lekciji.",
        },
        {
          lines: [9, 11],
          md: "`interface BookingDoc` opisuje dokument. `uid` i `sessionId` su obični stringovi, jer ID-jevi mogu biti bilo kakav tekst.",
        },
        {
          lines: [12, 13],
          md: "`studioId` nije `string`, nego `StudioId`. To znači da TypeScript prihvata samo postojeće studije (`'fitness'` ili `'pilates'`), a odbija `'fitnes'` sa slovnom greškom.",
        },
        {
          lines: [17, 18],
          md: "Polja koriste tipove definisane malo iznad. Jedan tip se gradi od drugih tipova, i svaka izmena (recimo novi status) automatski važi svuda.",
        },
        {
          lines: [20, 23],
          md: "Na kraju dva opciona polja. `cancelledAt?` postoji samo kad je rezervacija otkazana, a `fixedSlotId?` samo kad je nastala iz stalnog termina. Znak pitanja jasno kaže: *ovo polje ne očekuj uvek*.",
        },
      ],
    },
    {
      kind: "exercise",
      id: "ts-tipovi-1",
      title: "Opiši rezervaciju",
      lang: "ts",
      prompt: `Funkcija \`opisRezervacije\` dobija objekat, ali TypeScript ne zna kakav (parametar \`r\` je *implicit any*).

**Zadatak:**
1. Napiši \`interface Rezervacija\` sa poljima \`termin\` (tekst), \`brojMesta\` (broj) i **opcionim** poljem \`napomena\` (tekst).
2. Daj parametru \`r\` tip \`Rezervacija\`, a funkciji povratni tip \`string\`.
3. Ako napomena postoji, dodaj je na kraj u zagradi, npr. \`"Sre 08:00 · mesta: 1 (prvi put)"\`.`,
      starter: `// TODO: interface Rezervacija

function opisRezervacije(r) {
  return r.termin + " · mesta: " + r.brojMesta
}

console.log(opisRezervacije({ termin: "Pon 18:00", brojMesta: 2 }))
console.log(opisRezervacije({ termin: "Sre 08:00", brojMesta: 1, napomena: "prvi put" }))
`,
      solution: `interface Rezervacija {
  termin: string
  brojMesta: number
  napomena?: string
}

function opisRezervacije(r: Rezervacija): string {
  const osnova = r.termin + " · mesta: " + r.brojMesta
  if (r.napomena) {
    return osnova + " (" + r.napomena + ")"
  }
  return osnova
}

console.log(opisRezervacije({ termin: "Pon 18:00", brojMesta: 2 }))
console.log(opisRezervacije({ termin: "Sre 08:00", brojMesta: 1, napomena: "prvi put" }))
`,
      tests: [
        {
          name: "bez napomene: \"Pon 18:00 · mesta: 2\"",
          code: 'expect(opisRezervacije({ termin: "Pon 18:00", brojMesta: 2 })).toBe("Pon 18:00 · mesta: 2")',
        },
        {
          name: "sa napomenom: \"Sre 08:00 · mesta: 1 (prvi put)\"",
          code: 'expect(opisRezervacije({ termin: "Sre 08:00", brojMesta: 1, napomena: "prvi put" })).toBe("Sre 08:00 · mesta: 1 (prvi put)")',
        },
        {
          name: "ispisuje oba opisa",
          code: 'expect(logs).toHaveLength(2)\nexpect(logs[1]).toBe("Sre 08:00 · mesta: 1 (prvi put)")',
        },
      ],
      hints: [
        "Oblik interfejsa: `interface Rezervacija { termin: string; ... }`. Opciono polje ima `?` posle imena: `napomena?: string`.",
        "Parametar tipizuješ isto kao ranije: `function opisRezervacije(r: Rezervacija): string`.",
        "Za napomenu koristi `if (r.napomena) { ... }`. Unutar tog `if`-a TypeScript zna da `r.napomena` nije `undefined`.",
      ],
      explanation:
        "Bez `?` na `napomena`, prvi poziv bi bio greška (`Property 'napomena' is missing`). Znak pitanja kaže TypeScriptu da polje sme da fali, ali te onda tera da proveriš da li postoji pre nego što ga koristiš.",
    },
    {
      kind: "exercise",
      id: "ts-tipovi-2",
      title: "Niz termina",
      lang: "ts",
      prompt: `Imaš \`interface Termin\` i dve funkcije koje rade sa **listom** termina.

**Zadatak:**
1. TypeScript prijavljuje grešku u \`slobodniTermini\`. Pročitaj je (\`Property 'filter' does not exist...\`) i popravi **tip parametra**.
2. Dovrši \`ukupnoSlobodnihMesta\`: saberi slobodna mesta (\`kapacitet - zauzeto\`) svih termina koji **nisu otkazani**.`,
      starter: `interface Termin {
  id: string
  kapacitet: number
  zauzeto: number
  otkazan: boolean
}

function slobodniTermini(termini: Termin): Termin[] {
  return termini.filter((t) => !t.otkazan && t.zauzeto < t.kapacitet)
}

function ukupnoSlobodnihMesta(termini: Termin[]): number {
  // TODO
  return 0
}

const nedelja: Termin[] = [
  { id: "pon-18", kapacitet: 5, zauzeto: 5, otkazan: false },
  { id: "uto-18", kapacitet: 5, zauzeto: 2, otkazan: false },
  { id: "sre-08", kapacitet: 5, zauzeto: 0, otkazan: true },
]
console.log(slobodniTermini(nedelja).map((t) => t.id))
console.log(ukupnoSlobodnihMesta(nedelja))
`,
      solution: `interface Termin {
  id: string
  kapacitet: number
  zauzeto: number
  otkazan: boolean
}

function slobodniTermini(termini: Termin[]): Termin[] {
  return termini.filter((t) => !t.otkazan && t.zauzeto < t.kapacitet)
}

function ukupnoSlobodnihMesta(termini: Termin[]): number {
  let ukupno = 0
  for (const t of termini) {
    if (!t.otkazan) ukupno += t.kapacitet - t.zauzeto
  }
  return ukupno
}

const nedelja: Termin[] = [
  { id: "pon-18", kapacitet: 5, zauzeto: 5, otkazan: false },
  { id: "uto-18", kapacitet: 5, zauzeto: 2, otkazan: false },
  { id: "sre-08", kapacitet: 5, zauzeto: 0, otkazan: true },
]
console.log(slobodniTermini(nedelja).map((t) => t.id))
console.log(ukupnoSlobodnihMesta(nedelja))
`,
      tests: [
        {
          name: "slobodniTermini vraća samo uto-18",
          code: 'expect(slobodniTermini(nedelja).map((t) => t.id)).toEqual(["uto-18"])',
        },
        {
          name: "ukupnoSlobodnihMesta(nedelja) je 3",
          code: "expect(ukupnoSlobodnihMesta(nedelja)).toBe(3)",
        },
        {
          name: "otkazani termini se ne računaju",
          code: 'expect(ukupnoSlobodnihMesta([{ id: "x", kapacitet: 8, zauzeto: 1, otkazan: true }])).toBe(0)',
        },
        {
          name: "prazna lista daje 0",
          code: "expect(ukupnoSlobodnihMesta([])).toBe(0)",
        },
      ],
      hints: [
        "Funkcija dobija **više** termina, a tip `Termin` opisuje samo jedan. Kako se piše niz nekog tipa?",
        "`termini: Termin[]`. Tek niz ima metodu `.filter`.",
        "Za zbir: `let ukupno = 0`, pa `for (const t of termini)` i unutra `if (!t.otkazan) ukupno += t.kapacitet - t.zauzeto`. Može i sa `.filter(...).reduce(...)`.",
      ],
      explanation:
        "Greška `Property 'filter' does not exist on type 'Termin'` je TypeScriptov način da kaže: *ovo je jedan objekat, a ti se ponašaš kao da je niz*. Ovakve greške su česte kad AI promeni potpis funkcije, a ne i sve pozive.",
    },
    {
      kind: "exercise",
      id: "ts-tipovi-3",
      title: "Produži članarinu bez menjanja originala",
      lang: "ts",
      prompt: `Polje \`vaziDo\` je \`readonly\`, pa ga funkcija ne sme menjati direktno. TypeScript zato prijavljuje grešku.

**Zadatak:** prepiši \`produziClanarinu\` tako da vrati **nov** objekat člana sa novim datumom, a da originalni objekat ostane netaknut. Ostala polja (\`id\`, \`ime\`, \`uplaceno\`) moraju ostati ista.`,
      starter: `interface Clanarina {
  readonly vaziDo: string
  uplaceno?: string
}

interface Clan {
  readonly id: string
  ime: string
  clanarina: Clanarina
}

function produziClanarinu(clan: Clan, noviDatum: string): Clan {
  clan.clanarina.vaziDo = noviDatum
  return clan
}

const ana: Clan = { id: "u1", ime: "Ana", clanarina: { vaziDo: "2026-10-31", uplaceno: "2026-10-01" } }
const produzena = produziClanarinu(ana, "2026-11-30")
console.log(ana.clanarina.vaziDo, produzena.clanarina.vaziDo)
`,
      solution: `interface Clanarina {
  readonly vaziDo: string
  uplaceno?: string
}

interface Clan {
  readonly id: string
  ime: string
  clanarina: Clanarina
}

function produziClanarinu(clan: Clan, noviDatum: string): Clan {
  return {
    ...clan,
    clanarina: { ...clan.clanarina, vaziDo: noviDatum },
  }
}

const ana: Clan = { id: "u1", ime: "Ana", clanarina: { vaziDo: "2026-10-31", uplaceno: "2026-10-01" } }
const produzena = produziClanarinu(ana, "2026-11-30")
console.log(ana.clanarina.vaziDo, produzena.clanarina.vaziDo)
`,
      tests: [
        {
          name: "novi objekat ima novi datum",
          code: 'expect(produzena.clanarina.vaziDo).toBe("2026-11-30")',
        },
        {
          name: "original ostaje netaknut",
          code: 'expect(ana.clanarina.vaziDo).toBe("2026-10-31")',
        },
        {
          name: "id, ime i uplaceno su sačuvani",
          code: 'expect(produzena.id).toBe("u1")\nexpect(produzena.ime).toBe("Ana")\nexpect(produzena.clanarina.uplaceno).toBe("2026-10-01")',
        },
        {
          name: "vraća se nov objekat, a ne isti",
          code: "expect(produzena === ana).toBe(false)\nexpect(produzena.clanarina === ana.clanarina).toBe(false)",
        },
      ],
      hints: [
        "Greška kaže `Cannot assign to 'vaziDo' because it is a read-only property`. Umesto menjanja, napravi kopiju.",
        "Spread operator `{ ...clan }` pravi plitku kopiju. Ali `clanarina` je ugnežđen objekat, pa i njega moraš da kopiraš.",
        "`return { ...clan, clanarina: { ...clan.clanarina, vaziDo: noviDatum } }`",
      ],
      explanation:
        "Ovo je obrazac koji ćeš viđati stalno u React-u i Zustand-u: stanje se ne menja, nego se pravi nova verzija objekta. `readonly` ti pomaže da ga se držiš, jer TypeScript ne dozvoli slučajnu izmenu na licu mesta.",
    },
    {
      kind: "quiz",
      id: "ts-tipovi-quiz",
      questions: [
        {
          q: "Koja linija prijavljuje grešku?",
          code: `interface Termin { vreme: string; kapacitet: number }

const a: Termin = { vreme: "18:00", kapacitet: 5 }
const b: Termin = { vreme: "18:00", kapacitet: 5, trener: "Marko" }
const c = { vreme: "18:00" }`,
          codeLang: "ts",
          options: ["Linija 3", "Linija 4", "Linija 5", "Nijedna"],
          answer: 1,
          why: "Linija 4 ima polje `trener` koje ne postoji u `Termin` (`Object literal may only specify known properties`). Linija 5 je u redu jer `c` nema anotaciju tipa, pa TypeScript ne proverava da li liči na `Termin`.",
        },
        {
          q: "U `MembershipDoc` polje je napisano kao `paidAt?: DayKey`, a `DayKey` je `string`. Koji je tip izraza `membership.paidAt`?",
          options: ["`string`", "`string | undefined`", "`string | null`", "`any`"],
          answer: 1,
          why: "Opciono polje može da fali, a polje koje fali ima vrednost `undefined`. Zato TypeScript dodaje `| undefined` i traži da proveriš pre upotrebe.",
        },
        {
          q: "U `UserDoc` piše `nutritionPlan?: NutritionPlanDoc | null`. Koje vrednosti su dozvoljene?",
          options: [
            "Samo objekat `NutritionPlanDoc`",
            "Objekat ili `null`, ali polje mora postojati",
            "Objekat, `null`, ili polje može potpuno da fali",
            "Bilo šta, jer `?` isključuje proveru",
          ],
          answer: 2,
          why: "`?` znači da polje sme da fali (tj. da bude `undefined`), a `| null` dozvoljava i eksplicitno `null`. Tvoj kod koristi `null` da kaže *plan je obrisan*, a polja nema kad plan nikad nije ni postavljen (registracija pravi dokument bez njega).",
        },
        {
          q: "Šta od ovoga **može** samo `type`, a ne `interface`?",
          options: [
            "Opis objekta sa poljima",
            "Opciono polje sa `?`",
            "`'active' | 'cancelled'` (izbor između vrednosti)",
            "Polje koje je niz, npr. `string[]`",
          ],
          answer: 2,
          why: "`interface` uvek opisuje objekat. Izbor između vrednosti (union) ili drugo ime za `string` mogu se napisati samo sa `type`.",
        },
        {
          q: "Šta je tip parametra `b` u `.filter` pozivu?",
          code: `function aktivne(bookings: BookingDoc[]) {
  return bookings.filter((b) => b.status === "active")
}`,
          codeLang: "ts",
          options: ["`BookingDoc[]`", "`BookingDoc`", "`any`", "`string`"],
          answer: 1,
          why: "`bookings` je niz `BookingDoc` objekata, pa je svaki element koji `.filter` prosleđuje jedan `BookingDoc`. Zato ti editor nudi `b.status`, `b.uid` i ostala polja.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-ts-tipovi-1",
      front: "Kako se piše opciono polje u interfejsu i koji tip ima kad ga čitaš?",
      back: "Sa `?` posle imena: `paidAt?: string`. Kad ga čitaš, tip je `string | undefined`.",
    },
    {
      id: "fc-ts-tipovi-2",
      front: "Kako se piše tip „niz rezervacija”?",
      back: "`BookingDoc[]` (ili ekvivalentno `Array<BookingDoc>`).",
    },
    {
      id: "fc-ts-tipovi-3",
      front: "Šta radi `readonly` ispred polja?",
      back: "TypeScript prijavljuje grešku na svaku dodelu tom polju. Umesto izmene praviš nov objekat (`{ ...obj, polje: nova }`).",
    },
    {
      id: "fc-ts-tipovi-4",
      front: "Kada `interface`, a kada `type`?",
      back: "`interface` za oblik objekata (dokumenti, props, stanje). `type` za union (`'a' | 'b'`), drugo ime za postojeći tip i kombinacije tipova.",
    },
  ],
};

export default lesson;
