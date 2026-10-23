import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "objekti-i-nizovi",
  title: "Objekti i nizovi",
  summary:
    "Kako se podaci grupišu u objekte i nizove, kako ih raspakuješ destrukturiranjem, kako ih menjaš bez mutacije (spread, kao u Reactu i Zustandu) i čemu služe `?.` i `??`.",
  minutes: 20,
  projects: ["my-portfolio", "ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `Jedan termin u ReformStudiju nije jedna vrednost. Ima vreme, studio, kapacitet, broj zauzetih mesta. Kad bi svaki podatak bio posebna promenljiva, brzo bi nastao haos. Zato JavaScript ima dve strukture koje grupišu vrednosti:

- **objekat**: vrednosti sa **imenima** (\`termin.vreme\`, \`termin.kapacitet\`)
- **niz** (array): vrednosti **po redu** (prvi termin, drugi termin, treći...)

Skoro svi podaci u tvojim aplikacijama su kombinacija ova dva: **niz objekata**. Lista termina, lista rezervacija, lista pretplata u Looply-ju.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Formular i red",
      md: `**Objekat** je popunjen formular: svako polje ima naziv ("Ime:", "Telefon:") i vrednost. Redosled polja nije bitan, bitno je ime.

**Niz** je red ljudi na šalteru: niko nema naziv, svako ima svoje **mesto u redu**. Prvo mesto je broj 0 (programeri broje od nule).`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "objekat.js",
      code: `const termin = {
  id: "s1",
  studioId: "fitness",
  vreme: "18:00",
  kapacitet: 6,
  zauzeto: 4,
}

termin.vreme          // "18:00"     tačka: kad znaš ime polja
termin["studioId"]    // "fitness"   zagrade: kad je ime u promenljivoj
const polje = "kapacitet"
termin[polje]         // 6
termin.trener         // undefined   (polje ne postoji, nije greška)

termin.zauzeto = 5    // menja postojeće polje
termin.napomena = ""  // dodaje novo polje`,
      highlight: [9, 10, 13],
      caption:
        "Svako polje je par **ključ: vrednost**. Vrednost može biti bilo šta: tekst, broj, drugi objekat, niz, pa i funkcija.",
    },
    {
      kind: "prose",
      md: `### Nizovi

Niz se piše u uglastim zagradama. Elementi se čitaju po **indeksu**, koji počinje od \`0\`. \`length\` kaže koliko ih ima.`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "niz.js",
      code: `const vremena = ["08:00", "18:00", "20:00"]

vremena[0]        // "08:00"  prvi
vremena[2]        // "20:00"  treći
vremena.length    // 3
vremena.at(-1)    // "20:00"  poslednji (negativan broj broji od kraja)
vremena[5]        // undefined

const termini = [
  { id: "s1", vreme: "08:00", zauzeto: 6 },
  { id: "s2", vreme: "18:00", zauzeto: 2 },
]
termini[1].vreme  // "18:00"  drugi objekat, pa njegovo polje`,
      highlight: [6, 13],
    },
    {
      kind: "prose",
      md: `### Destrukturiranje: raspakivanje u promenljive

Često ti iz objekta trebaju samo dva-tri polja. Umesto \`const studioId = state.studioId\` u svakom redu, možeš da ih "raspakuješ" odjednom. Imena u \`{ }\` moraju biti **ista kao imena polja** (a drugo ime se daje ovako: \`const { clientX: x } = event\`). Kod nizova se raspakuje **po redu**, pa su imena slobodna.

Ovo je iz tvojih projekata:`,
    },
    {
      kind: "code",
      lang: "js",
      code: `// ReformStudio · src/store/memberStore.ts
const { studioId, status } = get()

// ReformStudio · functions/src/shared/date.ts ("2026-11-15" → 2026, 11, 15)
const [year, month, day] = key.split('-').map(Number)

// Looply · src/app/(tabs)/index.tsx
const { t } = useTranslation();
const { colors } = useTheme();`,
      highlight: [2, 5],
      caption:
        "React-ov `const [count, setCount] = useState(0)` je isto destrukturiranje niza: `useState` vraća niz od dva elementa, a ti im daješ imena.",
    },
    {
      kind: "prose",
      md: `Destrukturiranje radi i **u parametrima funkcije**. Tako rade props u svakoj React komponenti:

\`\`\`js
// umesto: function opis(termin) { return termin.vreme + ... }
function opis({ vreme, kapacitet, zauzeto }) {
  return \`\${vreme}, slobodno \${kapacitet - zauzeto}\`
}
opis(termin)  // prosleđuješ ceo objekat, funkcija uzme šta joj treba
\`\`\``,
    },
    {
      kind: "prose",
      md: `### Spread \`...\`: kopiraj i promeni

Tri tačke ispred objekta ili niza znače *"raspi sve što je unutra"*. Koristi se da se napravi **nova** kopija sa izmenom, umesto da se menja original:

\`\`\`js
const izmenjen = { ...termin, zauzeto: 5 }    // kopija, samo zauzeto je drugačije
const duzaLista = [...termini, noviTermin]     // nov niz, sa jednim više na kraju
\`\`\`

Redosled je bitan: polje napisano **kasnije** pobeđuje. \`{ ...termin, zauzeto: 5 }\` daje 5, a \`{ zauzeto: 5, ...termin }\` vraća staru vrednost iz \`termin\`.

Tri tačke pri destrukturiranju (i u parametrima funkcije) rade obrnuto i zovu se **rest**: skupljaju "sve ostalo" u jedan niz ili objekat, npr. \`const { id, ...ostalo } = termin\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Zašto React i Zustand traže kopiju",
      md: `Zamisli da React proverava da li se nešto promenilo tako što pogleda **da li je to isti list papira**, a ne šta piše na njemu. To je mnogo brže nego čitati sve redom.

Ako izmeniš original (\`termin.zauzeto = 5\`), to je i dalje isti papir. React zaključi "ništa novo" i **ne osveži ekran**. Ako napraviš kopiju (\`{ ...termin, zauzeto: 5 }\`), to je nov papir, i React zna da treba ponovo da crta. Zato se u \`setState\` i Zustand \`set\` uvek šalju nove vrednosti.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`const b = a` ne pravi kopiju",
      md: `\`\`\`js
const a = { zauzeto: 4 }
const b = a
b.zauzeto = 5
console.log(a.zauzeto)  // 5 (!)
\`\`\`

Promenljiva ne drži sam objekat, nego **adresu** gde on živi. \`b = a\` kopira adresu, pa obe pokazuju na isti objekat. Za kopiju treba \`{ ...a }\`. (Pazi: spread kopira samo prvi nivo. Objekat unutar objekta i dalje je zajednički.)`,
    },
    {
      kind: "fromYourCode",
      project: "my-portfolio",
      file: "src/app/site/Chat.tsx",
      lang: "tsx",
      startLine: 61,
      intro:
        "Chat na tvom portfoliju prima odgovor AI-ja u delovima (streaming). Svaki deo (`event`) se dodaje u trenutnu razmenu pitanje-odgovor (`exchange`). Primeti: original se **nikad** ne menja, uvek se vraća nov objekat. Ignoriši `: Exchange` i `: ChatEvent`, to su tipovi.",
      code: `function applyEvent(exchange: Exchange, event: ChatEvent): Exchange {
  if (event.type === "error") return { ...exchange, error: event.message };
  if (event.type === "card") {
    return { ...exchange, parts: [...exchange.parts, event] };
  }
  const last = exchange.parts.at(-1);
  if (last?.type === "text") {
    return {
      ...exchange,
      parts: [
        ...exchange.parts.slice(0, -1),
        { type: "text", text: last.text + event.text },
      ],
    };
  }
  return { ...exchange, parts: [...exchange.parts, event] };
}
`,
      steps: [
        {
          lines: 2,
          md: "Greška: nov objekat sa svim poljima starog (`...exchange`) i jednim poljem više, `error`. Ako je `error` već postojao, ova nova vrednost ga prepisuje, jer je napisana kasnije.",
        },
        {
          lines: [3, 5],
          md: "Kartica (npr. projekat): nov objekat, a u njemu **nov niz** `parts`: svi stari delovi plus `event` na kraju. Ne koristi se `exchange.parts.push(event)`, jer `push` menja originalni niz.",
        },
        {
          lines: 6,
          md: "`.at(-1)` je poslednji deo odgovora. Ako je niz prazan, `last` je `undefined`.",
        },
        {
          lines: 7,
          md: "`last?.type` je **optional chaining**: ako je `last` `undefined`, ceo izraz je `undefined` umesto da program pukne sa *\"Cannot read properties of undefined\"*.",
        },
        {
          lines: [8, 14],
          md: "Ako je poslednji deo tekst, novi komad teksta se lepi na njega. `slice(0, -1)` je kopija niza **bez poslednjeg** elementa, pa se na kraj stavi spojeni tekst. Tako se odgovor u chatu \"kuca\" reč po reč, a ne kao gomila sitnih delova.",
        },
        {
          lines: 16,
          md: "Sve ostalo: dodaj na kraj. Ova funkcija se poziva iz `setExchanges(...)`, i baš zato što uvek vraća **nov** objekat, React zna da treba ponovo da nacrta chat.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### \`?.\` i \`??\`: kad nečega možda nema

Podaci iz baze i sa servera često su nepotpuni: član nema članarinu, pretplata nema napomenu, lista je prazna. Dva operatora to rešavaju elegantno:

- **\`?.\` (optional chaining)**: *"idi dalje samo ako ovo postoji"*. \`korisnik.clanarina?.fitness\` vraća \`undefined\` ako \`clanarina\` ne postoji, umesto da pukne.
- **\`??\` (nullish coalescing)**: *"ako je levo \`null\` ili \`undefined\`, uzmi desno"*. Daje rezervnu vrednost.

Često idu zajedno. Iz Looply-ja:`,
    },
    {
      kind: "code",
      lang: "tsx",
      code: `// Looply · src/app/(tabs)/index.tsx: ako nema nijednog zbira, prikaži nule
const primary = totals[0] ?? { currency, monthlyMinor: 0, annualMinor: 0, activeCount: 0 };

// Looply · src/app/(tabs)/settings.tsx: verzija aplikacije, ili crtica ako je nema
value={Constants.expoConfig?.version ?? '—'}`,
      highlight: [2, 5],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`??` nije isto što i `||`",
      md: `\`||\` uzima desnu stranu za **svaku falsy** vrednost, uključujući \`0\` i \`""\`. \`??\` samo za \`null\` i \`undefined\`.

\`\`\`js
const kapacitet = 0          // admin je namerno zatvorio termin
kapacitet || 6               // 6  ❌ nula je "progutana"
kapacitet ?? 6               // 0  ✅
\`\`\`

Kad je \`0\` ili prazan tekst ispravna vrednost, koristi \`??\`.`,
    },
    {
      kind: "exercise",
      id: "js-objekti-1",
      title: "Raspakuj termin",
      lang: "js",
      prompt: `**Zadatak 1:** dovrši \`opisTermina\` tako da vraća tekst kao \`"Pilates u 18:00 (slobodno: 2)"\`. Koristi destrukturiranje **u parametru**: \`function opisTermina({ naziv, vreme, kapacitet, zauzeto })\`.

**Zadatak 2:** iz niza \`vremena\` destrukturiranjem izvuci prvi element u \`jutarnji\` i treći u \`vecernji\` (drugi preskoči).`,
      starter: `const termin = { naziv: "Pilates", vreme: "18:00", kapacitet: 6, zauzeto: 4 }
const vremena = ["08:00", "12:00", "20:00"]

function opisTermina(termin) {
  return ""
}

const jutarnji = null
const vecernji = null

console.log(opisTermina(termin))
console.log(jutarnji, vecernji)
`,
      solution: `const termin = { naziv: "Pilates", vreme: "18:00", kapacitet: 6, zauzeto: 4 }
const vremena = ["08:00", "12:00", "20:00"]

function opisTermina({ naziv, vreme, kapacitet, zauzeto }) {
  return \`\${naziv} u \${vreme} (slobodno: \${kapacitet - zauzeto})\`
}

const [jutarnji, , vecernji] = vremena

console.log(opisTermina(termin))
console.log(jutarnji, vecernji)
`,
      tests: [
        {
          name: "opisTermina(termin) vraća \"Pilates u 18:00 (slobodno: 2)\"",
          code: 'expect(opisTermina(termin)).toBe("Pilates u 18:00 (slobodno: 2)")',
        },
        {
          name: "radi i za drugi termin",
          code: 'expect(opisTermina({ naziv: "Fitness", vreme: "08:00", kapacitet: 8, zauzeto: 8 })).toBe("Fitness u 08:00 (slobodno: 0)")',
        },
        { name: "jutarnji je \"08:00\"", code: 'expect(jutarnji).toBe("08:00")' },
        { name: "vecernji je \"20:00\"", code: 'expect(vecernji).toBe("20:00")' },
      ],
      hints: [
        "U parametru, umesto `termin` napiši `{ naziv, vreme, kapacitet, zauzeto }`. Unutra ih koristiš direktno, bez `termin.`.",
        "Slobodnih mesta ima `kapacitet - zauzeto`. U template stringu: `${kapacitet - zauzeto}`.",
        "Element se preskače praznim mestom između zareza: `const [jutarnji, , vecernji] = vremena`. Obriši stare `const jutarnji = null` linije.",
      ],
      explanation:
        "Destrukturiranje u parametru jasno kaže koja polja funkciji trebaju. Tako izgleda skoro svaka React komponenta: `function Kartica({ naslov, opis })`.",
    },
    {
      kind: "exercise",
      id: "js-objekti-2",
      title: "Promeni bez mutacije",
      lang: "js",
      prompt: `Obe funkcije trenutno **menjaju original**. U React aplikaciji to znači da se ekran ne bi osvežio.

**Zadatak:** prepravi ih da vraćaju **nove** vrednosti, a da \`termin\` i \`rezervacije\` ostanu netaknuti:
- \`rezervisi(termin)\` vraća kopiju termina sa \`zauzeto\` većim za 1
- \`dodajRezervaciju(lista, nova)\` vraća nov niz sa \`nova\` na kraju`,
      starter: `const termin = { id: "s1", vreme: "18:00", kapacitet: 6, zauzeto: 4 }
const rezervacije = [{ id: "b1", terminId: "s1" }]

function rezervisi(termin) {
  termin.zauzeto = termin.zauzeto + 1
  return termin
}

function dodajRezervaciju(lista, nova) {
  lista.push(nova)
  return lista
}

console.log(rezervisi(termin))
console.log(termin)
`,
      solution: `const termin = { id: "s1", vreme: "18:00", kapacitet: 6, zauzeto: 4 }
const rezervacije = [{ id: "b1", terminId: "s1" }]

function rezervisi(termin) {
  return { ...termin, zauzeto: termin.zauzeto + 1 }
}

function dodajRezervaciju(lista, nova) {
  return [...lista, nova]
}

console.log(rezervisi(termin))
console.log(termin)
`,
      tests: [
        {
          name: "rezervisi vraća termin sa zauzeto: 5 i svim ostalim poljima",
          code: 'expect(rezervisi(termin)).toEqual({ id: "s1", vreme: "18:00", kapacitet: 6, zauzeto: 5 })',
        },
        { name: "originalni termin i dalje ima zauzeto: 4", code: "rezervisi(termin)\nexpect(termin.zauzeto).toBe(4)" },
        { name: "rezervisi vraća nov objekat, ne isti", code: "expect(rezervisi(termin) === termin).toBe(false)" },
        {
          name: "dodajRezervaciju vraća niz sa 2 elementa, a original ostaje sa 1",
          code: `const nova = dodajRezervaciju(rezervacije, { id: "b2", terminId: "s1" })
expect(nova).toHaveLength(2)
expect(nova[1].id).toBe("b2")
expect(rezervacije).toHaveLength(1)`,
        },
      ],
      hints: [
        "Kopija objekta sa izmenom: `{ ...termin, zauzeto: ... }`.",
        "Nov niz sa jednim elementom više: `[...lista, nova]`. `push` menja original, zato ga izbegavaj.",
        "`return { ...termin, zauzeto: termin.zauzeto + 1 }` i `return [...lista, nova]`.",
      ],
      explanation:
        "Ovako izgleda svaka izmena stanja u Zustand store-u i u `setState`. U ReformStudiju, `setRead` u `memberStore.ts` radi baš ovo: `{ ...n, read }` za svako obaveštenje koje treba označiti.",
    },
    {
      kind: "exercise",
      id: "js-objekti-3",
      title: "Kad podataka nema",
      lang: "js",
      prompt: `Marko još nema nijednu članarinu, pa \`vaziDo(marko, "fitness")\` ruši program. A termin sa kapacitetom \`0\` (admin ga je zatvorio) prikazuje se kao da ima 6 mesta.

**Zadatak:**
- \`vaziDo(korisnik, studio)\` vraća datum do kog članarina važi, ili \`"nema članarine"\` ako ne postoji (ni \`clanarina\`, ni članarina za taj studio).
- \`kapacitet(termin)\` vraća \`termin.kapacitet\`, a \`6\` **samo** ako kapacitet nije upisan.`,
      starter: `const ana = { ime: "Ana", clanarina: { fitness: { vaziDo: "2026-12-01" } } }
const marko = { ime: "Marko" }

function vaziDo(korisnik, studio) {
  return korisnik.clanarina[studio].vaziDo
}

function kapacitet(termin) {
  return termin.kapacitet || 6
}

console.log(vaziDo(ana, "fitness"))
console.log(kapacitet({ vreme: "18:00", kapacitet: 0 }))
`,
      solution: `const ana = { ime: "Ana", clanarina: { fitness: { vaziDo: "2026-12-01" } } }
const marko = { ime: "Marko" }

function vaziDo(korisnik, studio) {
  return korisnik.clanarina?.[studio]?.vaziDo ?? "nema članarine"
}

function kapacitet(termin) {
  return termin.kapacitet ?? 6
}

console.log(vaziDo(ana, "fitness"))
console.log(kapacitet({ vreme: "18:00", kapacitet: 0 }))
`,
      tests: [
        { name: "Ana ima fitness do 2026-12-01", code: 'expect(vaziDo(ana, "fitness")).toBe("2026-12-01")' },
        { name: "Ana nema pilates", code: 'expect(vaziDo(ana, "pilates")).toBe("nema članarine")' },
        { name: "Marko nema članarinu (i ne ruši program)", code: 'expect(vaziDo(marko, "fitness")).toBe("nema članarine")' },
        { name: "termin bez kapaciteta dobija 6", code: 'expect(kapacitet({ vreme: "18:00" })).toBe(6)' },
        { name: "zatvoren termin ima kapacitet 0", code: 'expect(kapacitet({ vreme: "18:00", kapacitet: 0 })).toBe(0)' },
      ],
      hints: [
        "`?.` ide na svako mesto gde levo može biti `undefined`: posle `clanarina` i posle `[studio]`. Sa uglastim zagradama piše se `?.[studio]`.",
        "Na kraj dodaj `?? \"nema članarine\"`.",
        "Za kapacitet zameni `||` sa `??`, jer je `0` ispravna vrednost.",
      ],
      explanation:
        "`?.` sprečava pucanje kad deo puta ne postoji, a `??` daje rezervnu vrednost samo za `null`/`undefined`. ReformStudio radi isto u `memberStatus`: `user.membership[studioId]?.validUntil`.",
    },
    {
      kind: "quiz",
      id: "js-objekti-quiz",
      questions: [
        {
          q: "Šta ispisuje ovaj kod?",
          code: `const a = { mesta: 4 }
const b = a
b.mesta = 0
console.log(a.mesta)`,
          codeLang: "js",
          options: ["`4`", "`0`", "`undefined`", "Greška, `a` je `const`"],
          answer: 1,
          why: "`b = a` ne pravi kopiju, obe promenljive pokazuju na isti objekat. A `const` sprečava samo novu dodelu promenljivoj, ne izmenu objekta.",
        },
        {
          q: "Koliko je `x.zauzeto`?",
          code: `const termin = { zauzeto: 4 }
const x = { zauzeto: 5, ...termin }`,
          codeLang: "js",
          options: ["`5`", "`4`", "`9`", "`[5, 4]`"],
          answer: 1,
          why: "Polje napisano kasnije pobeđuje. `...termin` dolazi posle `zauzeto: 5`, pa ga prepiše sa 4. Za izmenu se spread piše **prvi**: `{ ...termin, zauzeto: 5 }`.",
        },
        {
          q: "Šta ispisuje ovaj kod?",
          code: `const popust = 0
console.log(popust || 10, popust ?? 10)`,
          codeLang: "js",
          options: ["`0 0`", "`10 10`", "`10 0`", "`0 10`"],
          answer: 2,
          why: "`||` menja svaku falsy vrednost, pa i `0`. `??` menja samo `null` i `undefined`, pa `0` ostaje.",
        },
        {
          q: "Koliko je `c`?",
          code: `const [a, , c] = ["Pon", "Uto", "Sre", "Čet"]`,
          codeLang: "js",
          options: ["`\"Uto\"`", "`\"Sre\"`", "`\"Čet\"`", "`undefined`"],
          answer: 1,
          why: "Niz se raspakuje po redu. Prazno mesto između zareza preskače `\"Uto\"`, pa je `c` treći element.",
        },
        {
          q: "Šta je rezultat ako je `korisnik = {}`?",
          code: "korisnik.adresa?.grad",
          codeLang: "js",
          options: [
            "`TypeError: Cannot read properties of undefined`",
            "`undefined`",
            "`null`",
            "`\"\"`",
          ],
          answer: 1,
          why: "`korisnik.adresa` je `undefined`, a `?.` tu staje i vraća `undefined` umesto da pokuša da čita `grad`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-js-objekti-1",
      front: "Kako se pravi kopija objekta sa jednim izmenjenim poljem?",
      back: "`{ ...original, polje: novaVrednost }`. Spread prvi, izmena posle.",
    },
    {
      id: "fc-js-objekti-2",
      front: "Zašto React i Zustand traže nove objekte umesto izmenjenih?",
      back: "Proveravaju da li je to **isti objekat** (referenca), a ne sadržaj. Izmenjen original izgleda kao \"ništa novo\", pa se ekran ne osveži.",
    },
    {
      id: "fc-js-objekti-3",
      front: "Šta radi `a?.b`?",
      back: "Čita `b` samo ako `a` postoji. Ako je `a` `null`/`undefined`, vraća `undefined` umesto greške.",
    },
    {
      id: "fc-js-objekti-4",
      front: "Razlika između `a ?? b` i `a || b`?",
      back: "`??` uzima `b` samo kad je `a` `null` ili `undefined`. `||` za svaku falsy vrednost, pa i `0` i `\"\"`.",
    },
    {
      id: "fc-js-objekti-5",
      front: "Šta radi `const { id, ...ostalo } = termin`?",
      back: "Izvuče `id` u svoju promenljivu, a sva ostala polja skupi u nov objekat `ostalo` (rest).",
    },
  ],
};

export default lesson;
