import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "funkcije",
  title: "Funkcije: recepti koje pozivaš",
  summary:
    "Kako se pišu obične i arrow funkcije, šta rade parametri, podrazumevane vrednosti i `return`, zašto se funkcije prosleđuju kao vrednosti i gde se promenljive \"vide\".",
  minutes: 18,
  projects: ["milenaspajic", "ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `Funkcija je komad koda sa imenom, koji možeš da pokreneš kad god ti zatreba. Prima **ulaz** (parametre), nešto uradi i vrati **izlaz** (\`return\`).

Bez funkcija bi isti račun, recimo cenu paketa, trebalo prepisati na svakom mestu gde ti treba. Sa funkcijom ga napišeš jednom, daš mu ime i pozivaš ga. Kad se pravilo promeni, menjaš ga na jednom mestu.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Recept",
      md: `Funkcija je recept. **Parametri** su sastojci koje recept traži ("brašno, jaja"). **Argumenti** su konkretni sastojci koje doneseš kad kuvaš ("500 g brašna, 2 jaja"). \`return\` je gotovo jelo koje recept vrati. Recept napisan na papiru ne radi ništa dok ga neko ne **pozove**, tj. dok ne počne da kuva.`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "cena.js",
      code: `function cenaPaketa(brojTermina, cenaPoTerminu) {
  return brojTermina * cenaPoTerminu
}

const ukupno = cenaPaketa(8, 1500)   // poziv: 8 i 1500 su argumenti
console.log(ukupno)                  // 12000`,
      highlight: [1, 2, 5],
      caption:
        "Linija 1 samo **opisuje** funkciju. Ništa se ne izvršava dok je ne pozoveš sa zagradama, kao na liniji 5.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zaboravljen `return`",
      md: `Funkcija bez \`return\` vraća \`undefined\`. Ovo je jedna od najčešćih grešaka:

\`\`\`js
function cenaPaketa(brojTermina, cena) {
  brojTermina * cena        // izračuna se, pa baci
}
cenaPaketa(8, 1500)         // undefined
\`\`\`

\`console.log\` unutar funkcije **nije** isto što i \`return\`. \`console.log\` samo ispiše vrednost za tebe, a \`return\` je preda onome ko je funkciju pozvao. Takođe: čim se izvrši \`return\`, funkcija se završava, i kod ispod se ne izvršava.`,
    },
    {
      kind: "prose",
      md: `### Arrow funkcije

U tvojim projektima većina funkcija izgleda drugačije: \`const ime = (...) => ...\`. To je **arrow funkcija** (zbog strelice \`=>\`), kraći zapis koji je postao standard. Funkcija se sačuva u \`const\`, kao bilo koja druga vrednost.

Najvažnija stvar: ako posle strelice **nema vitičastih zagrada**, ono što stoji posle strelice se automatski vraća. To se zove **implicitni return**.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `// 1. Implicitni return: bez { }, rezultat se vraća sam
const cenaPaketa = (brojTermina, cena) => brojTermina * cena

// 2. Sa { } return mora da se napiše
const cenaSaPdv = (cena) => {
  const pdv = cena * 0.2
  return cena + pdv
}

// 3. Vraćanje objekta: obavezne obične zagrade oko { }
const noviTermin = (vreme) => ({ vreme, zauzeto: 0 })`,
      highlight: [2, 7, 11],
      caption:
        "Bez zagrada na liniji 11, JavaScript bi `{` shvatio kao početak tela funkcije, a ne kao objekat. Ovde bi to bila `SyntaxError`, a sa samo jednim poljem (`() => { vreme: \"18:00\" }`) funkcija bi tiho vratila `undefined`.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/shared/rules.ts",
      lang: "ts",
      startLine: 13,
      intro:
        "Ovo su pravila otkazivanja u ReformStudiju, koja dele aplikacija i server. Ignoriši `: When` i `: Date` (to su tipovi, sledeći modul). Gledaj kako su male arrow funkcije složene jedna na drugu.",
      code: `const ms = (when: When) => (when instanceof Date ? when.getTime() : new Date(when).getTime())

export const hasStarted = (startsAt: When, now: Date) => ms(startsAt) <= now.getTime()

/** Otkazivanje i premještanje su dozvoljeni dok do početka ima bar CANCEL_DEADLINE_HOURS. */
export const canCancel = (startsAt: When, now: Date) =>
  (ms(startsAt) - now.getTime()) / HOUR_MS >= CANCEL_DEADLINE_HOURS

/**
 * Termin još nije počeo, ali je unutar roka za otkazivanje: može se rezervisati, uz
 * upozorenje da se poslije ne može otkazati ni premjestiti.
 */
export const isWithinCancelWindow = (startsAt: When, now: Date) =>
  !hasStarted(startsAt, now) && !canCancel(startsAt, now)
`,
      steps: [
        {
          lines: 1,
          md: "`ms` je pomoćna funkcija: šta god dobije (datum, tekst, broj), vrati broj milisekundi. Nema `export`, pa je vidljiva samo u ovom fajlu. Implicitni return, a unutra ternarni operator `uslov ? a : b`.",
        },
        {
          lines: 3,
          md: "`hasStarted` vraća boolean: da li je početak termina pre sadašnjeg trenutka. Cela funkcija je jedan izraz posle strelice, pa nema ni `{ }` ni `return`.",
        },
        {
          lines: [6, 7],
          md: "Implicitni return može da pređe u sledeći red. Strelica na kraju linije 18 kaže: *vrati ono što sledi*. Funkcija računa koliko sati ima do početka i poredi to sa rokom za otkazivanje.",
        },
        {
          lines: [13, 14],
          md: "Ovde se vidi prava snaga funkcija: `isWithinCancelWindow` je sklopljena od dve postojeće i čita se kao rečenica: *nije počeo **i** ne može da se otkaže*. Svaki deo se testira posebno.",
        },
        {
          lines: 3,
          md: "Primeti da `now` stiže kao **parametar**, umesto da funkcija sama pozove `new Date()`. Zato test može da kaže \"zamisli da je sad 17:00\" i da proveri pravilo bez čekanja. Funkcija koja zavisi samo od svojih parametara zove se **čista** (pure) funkcija.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Podrazumevane vrednosti parametara

Ako argument ne pošalješ, parametar dobije \`undefined\`. Često je bolje da dobije razumnu **podrazumevanu vrednost** (default), i to se piše direktno u zagradi: \`(valuta = "RSD")\`.

Default se koristi samo kad je argument izostavljen ili je \`undefined\`. Ako pošalješ \`null\`, \`0\` ili \`""\`, parametar dobije baš to.`,
    },
    {
      kind: "fromYourCode",
      project: "milenaspajic",
      file: "main.js",
      lang: "js",
      startLine: 14,
      intro:
        "Početak glavnog fajla na Mileninom sajtu. Dve sitne funkcije koje se posle koriste stotinak puta.",
      code: `  const root = document.documentElement;
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
`,
      steps: [
        {
          lines: 2,
          md: "Funkcija se zove `$` (da, i to je ispravno ime). Prima CSS selektor `s` i opciono `ctx`, element u kome se traži. Ako `ctx` izostane, default je `document`, cela stranica. `$(\".hero\")` traži svuda, `$(\"img\", media)` samo unutar `media`.",
        },
        {
          lines: 3,
          md: "Isto, ali vraća **sve** pronađene elemente. `Array.from(...)` ih pretvara u pravi niz, da bi posle mogle da se koriste metode kao `.map` i `.filter` (lekcija o metodama nizova).",
        },
        {
          lines: [4, 5],
          md: "Ovo **nisu** funkcije, nego vrednosti (boolean) izračunate jednom, pri učitavanju: da li korisnik želi manje animacija i da li ima miš. Nema strelice, nema poziva kasnije.",
        },
        {
          lines: [2, 3],
          md: "Zašto ovo uopšte postoji? Zato što je `document.querySelector(\".hero\")` dugačko, a koristi se na desetine mesta. Mala funkcija sa kratkim imenom čini ostatak fajla čitljivijim. To je najčešći razlog da napraviš funkciju.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Funkcije kao vrednosti (callback)

Funkcija je u JavaScriptu obična vrednost, kao broj ili tekst. Može da se sačuva u promenljivu, i može da se **prosledi drugoj funkciji** kao argument. Funkcija koju prosleđuješ da bi je neko drugi pozvao *kasnije* zove se **callback**.

Na Mileninom sajtu to je svuda:`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "milenaspajic/main.js",
      code: `// "Kad neko klikne dugme, pozovi ovu funkciju."
btn.addEventListener("click", () => set(!open));

// "Za 2400 ms pozovi ovu funkciju."
t = setTimeout(() => (status.textContent = ""), 2400);`,
      caption:
        "Ti ne pozivaš `() => set(!open)`. Predaješ je browseru, a on je pozove svaki put kad se desi klik. Isti princip koriste `.map`, `.filter`, `onClick` u Reactu i `useEffect`.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`sacuvaj` nije isto što i `sacuvaj()`",
      md: `\`sacuvaj\` je sama funkcija (recept). \`sacuvaj()\` je **poziv**, tj. rezultat kuvanja.

\`\`\`jsx
<button onClick={sacuvaj}>      // ✅ predaje funkciju, poziva se na klik
<button onClick={sacuvaj()}>    // ❌ poziva se odmah, pri crtanju dugmeta
<button onClick={() => sacuvaj(id)}>  // ✅ kad treba argument: nova mala funkcija
\`\`\``,
    },
    {
      kind: "prose",
      md: `### Scope: gde se promenljiva vidi

Promenljiva napravljena sa \`const\` ili \`let\` postoji samo unutar bloka \`{ }\` u kome je napisana (funkcija, \`if\`, petlja). To se zove **scope** (doseg).

Pravilo je kao kod jednosmernog ogledala: **unutrašnji kod vidi spoljašnji, spoljašnji ne vidi unutrašnji.**`,
    },
    {
      kind: "code",
      lang: "js",
      code: `const studio = "Reform"

function opis() {
  const sala = "Sala 1"
  return \`\${studio}, \${sala}\`   // ✅ vidi i studio (spolja) i salu
}

console.log(opis())   // "Reform, Sala 1"
console.log(sala)     // ❌ ReferenceError: sala is not defined`,
      highlight: [5, 9],
      caption:
        "Ovo je dobra stvar: dve funkcije mogu imati svoju promenljivu `sala` i neće se pomešati. Svaka funkcija je mali zatvoren svet.",
    },
    {
      kind: "exercise",
      id: "js-funkcije-1",
      title: "Vrati, nemoj samo ispisati",
      lang: "js",
      prompt: `Funkcija \`cenaPaketa\` "radi" (u konzoli se vidi broj), ali testovi padaju. Pokreni kod i pogledaj šta dobija \`ukupno\`.

**Zadatak:** popravi funkciju tako da **vraća** cenu, a ne da je samo ispisuje.`,
      starter: `function cenaPaketa(brojTermina, cenaPoTerminu) {
  console.log(brojTermina * cenaPoTerminu)
}

const ukupno = cenaPaketa(8, 1500)
console.log("ukupno:", ukupno)
`,
      solution: `function cenaPaketa(brojTermina, cenaPoTerminu) {
  return brojTermina * cenaPoTerminu
}

const ukupno = cenaPaketa(8, 1500)
console.log("ukupno:", ukupno)
`,
      tests: [
        { name: "cenaPaketa(8, 1500) vraća 12000", code: "expect(cenaPaketa(8, 1500)).toBe(12000)" },
        { name: "cenaPaketa(1, 900) vraća 900", code: "expect(cenaPaketa(1, 900)).toBe(900)" },
        { name: "ukupno je 12000", code: "expect(ukupno).toBe(12000)" },
      ],
      hints: [
        "Šta piše u konzoli posle `ukupno:`? Ta vrednost je ono što funkcija vraća.",
        "Zameni `console.log(...)` u telu funkcije sa `return ...`.",
      ],
      explanation:
        "`console.log` je za tebe, dok gledaš konzolu. `return` je za kod koji je funkciju pozvao. Funkcija bez `return` uvek vraća `undefined`.",
    },
    {
      kind: "exercise",
      id: "js-funkcije-2",
      title: "Arrow funkcije sa default vrednostima",
      lang: "js",
      prompt: `Dve arrow funkcije ne rade kako treba.

**Zadatak:**
1. \`formatCena(iznos, valuta)\` treba da vrati tekst kao \`"1500 RSD"\`. Ako valuta nije prosleđena, neka bude \`"RSD"\`.
2. \`saPopustom(cena, procenat)\` treba da vrati cenu umanjenu za procenat. Ako procenat nije prosleđen, neka bude \`10\`.`,
      starter: `const formatCena = (iznos, valuta) => {
  \`\${iznos} \${valuta}\`
}

const saPopustom = (cena, procenat) => cena

console.log(formatCena(1500))
console.log(saPopustom(1000))
`,
      solution: `const formatCena = (iznos, valuta = "RSD") => \`\${iznos} \${valuta}\`

const saPopustom = (cena, procenat = 10) => cena - (cena * procenat) / 100

console.log(formatCena(1500))
console.log(saPopustom(1000))
`,
      tests: [
        { name: "formatCena(20, \"EUR\") vraća \"20 EUR\"", code: 'expect(formatCena(20, "EUR")).toBe("20 EUR")' },
        { name: "formatCena(1500) vraća \"1500 RSD\"", code: 'expect(formatCena(1500)).toBe("1500 RSD")' },
        { name: "saPopustom(1000) vraća 900", code: "expect(saPopustom(1000)).toBe(900)" },
        { name: "saPopustom(2000, 25) vraća 1500", code: "expect(saPopustom(2000, 25)).toBe(1500)" },
      ],
      hints: [
        "U `formatCena` postoje `{ }` ali nema `return`. Ili dodaj `return`, ili obriši vitičaste zagrade pa iskoristi implicitni return.",
        "Default vrednost se piše u zagradi parametara: `(iznos, valuta = \"RSD\")`.",
        "Popust: `cena - cena * procenat / 100`. Za 1000 i 10% to je 1000 − 100 = 900.",
      ],
      explanation:
        "Kod arrow funkcije `{ }` posle strelice znači *telo funkcije*, a ne vrednost. Kad je telo samo jedan izraz, izostavi zagrade i rezultat se vraća sam. Default vrednost se primenjuje samo kad argument izostane (ili je `undefined`).",
    },
    {
      kind: "exercise",
      id: "js-funkcije-3",
      title: "Callback: uspeh ili neuspeh",
      lang: "js",
      prompt: `Napiši funkciju \`obradiRezervaciju(slobodnaMesta, uspeh, neuspeh)\`. Parametri \`uspeh\` i \`neuspeh\` su **funkcije** (callback-ovi).

- Ako ima slobodnih mesta (više od 0): pozovi \`uspeh\` i prosledi joj broj mesta koja **ostaju posle** rezervacije.
- Ako nema: pozovi \`neuspeh\` sa tekstom \`"Termin je pun"\`.
- \`obradiRezervaciju\` vraća ono što vrati callback koji je pozvan.`,
      starter: `function obradiRezervaciju(slobodnaMesta, uspeh, neuspeh) {
  // tvoj kod
}

const rezultat = obradiRezervaciju(
  3,
  (ostalo) => \`Rezervisano! Ostalo mesta: \${ostalo}\`,
  (poruka) => \`Greška: \${poruka}\`,
)
console.log(rezultat)
`,
      solution: `function obradiRezervaciju(slobodnaMesta, uspeh, neuspeh) {
  if (slobodnaMesta > 0) {
    return uspeh(slobodnaMesta - 1)
  }
  return neuspeh("Termin je pun")
}

const rezultat = obradiRezervaciju(
  3,
  (ostalo) => \`Rezervisano! Ostalo mesta: \${ostalo}\`,
  (poruka) => \`Greška: \${poruka}\`,
)
console.log(rezultat)
`,
      tests: [
        {
          name: "sa 3 mesta vraća \"Rezervisano! Ostalo mesta: 2\"",
          code: 'expect(rezultat).toBe("Rezervisano! Ostalo mesta: 2")',
        },
        {
          name: "sa 1 mestom uspeh dobija 0",
          code: 'expect(obradiRezervaciju(1, (n) => n, () => "pun")).toBe(0)',
        },
        {
          name: "sa 0 mesta neuspeh dobija \"Termin je pun\"",
          code: 'expect(obradiRezervaciju(0, () => "ok", (p) => p)).toBe("Termin je pun")',
        },
        {
          name: "kad je termin pun, uspeh se ne poziva",
          code: `let pozvanUspeh = false
obradiRezervaciju(0, () => { pozvanUspeh = true }, () => "pun")
expect(pozvanUspeh).toBe(false)`,
        },
      ],
      hints: [
        "Callback se poziva kao svaka funkcija: `uspeh(nesto)`.",
        "Treba ti `if (slobodnaMesta > 0) { ... }`, a u svakoj grani `return` poziva odgovarajućeg callback-a.",
        "`return uspeh(slobodnaMesta - 1)` u if-u, a posle njega `return neuspeh(\"Termin je pun\")`.",
      ],
      explanation:
        "`obradiRezervaciju` ne zna šta će se desiti posle uspeha: da li će se prikazati poruka, otvoriti ekran ili poslati notifikacija. To odlučuje onaj ko je poziva, kroz callback. Isti obrazac imaju `then`/`catch` kod Promise-a, o kojima je reč u lekciji o asinhronom kodu.",
    },
    {
      kind: "quiz",
      id: "js-funkcije-quiz",
      questions: [
        {
          q: "Šta vraća `dupla(3)`?",
          code: `const dupla = (x) => { x * 2 }`,
          codeLang: "js",
          options: ["`6`", "`undefined`", "`\"x * 2\"`", "Greška"],
          answer: 1,
          why: "Vitičaste zagrade posle strelice prave telo funkcije, a u telu nema `return`. Treba `(x) => x * 2` ili `(x) => { return x * 2 }`.",
        },
        {
          q: "Šta ispisuje ovaj kod?",
          code: `function ukupno(cena, kolicina = 1) {
  return cena * kolicina
}
console.log(ukupno(500, null))`,
          codeLang: "js",
          options: ["`500`", "`0`", "`NaN`", "`null`"],
          answer: 1,
          why: "Default se koristi samo kad je argument `undefined`. `null` je prosleđena vrednost, pa je `kolicina` baš `null`, a `500 * null` je `0` (null se u računu ponaša kao 0).",
        },
        {
          q: "Koje dugme poziva `sacuvaj` tek kad se klikne?",
          options: [
            "`<button onClick={sacuvaj()}>`",
            "`<button onClick={sacuvaj}>`",
            "`<button onClick=\"sacuvaj\">`",
            "Sva tri isto",
          ],
          answer: 1,
          why: "`sacuvaj` predaje samu funkciju, a React je pozove na klik. `sacuvaj()` je poziva odmah, dok se dugme crta, i predaje njen rezultat.",
        },
        {
          q: "Šta se desi na poslednjoj liniji?",
          code: `function napravi() {
  const poruka = "Zdravo"
  return poruka.length
}
napravi()
console.log(poruka)`,
          codeLang: "js",
          options: [
            "Ispiše `Zdravo`",
            "Ispiše `6`",
            "`ReferenceError`, jer `poruka` postoji samo u funkciji",
            "Ispiše `undefined`",
          ],
          answer: 2,
          why: "`poruka` je deklarisana unutar funkcije, pa se izvan nje ne vidi. Spolja se dobija samo ono što funkcija vrati.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-js-funkcije-1",
      front: "Šta je **implicitni return**?",
      back: "Kod arrow funkcije bez `{ }`, izraz posle `=>` se vraća automatski: `const f = (a) => a * 2`.",
    },
    {
      id: "fc-js-funkcije-2",
      front: "Kako arrow funkcija vraća objekat?",
      back: "Objekat se umota u obične zagrade: `() => ({ vreme: \"18:00\" })`. Bez njih `{` znači telo funkcije.",
    },
    {
      id: "fc-js-funkcije-3",
      front: "Šta je **callback**?",
      back: "Funkcija koju predaješ drugoj funkciji da je ona pozove kasnije, npr. `addEventListener(\"click\", () => ...)` ili `.map((x) => ...)`.",
    },
    {
      id: "fc-js-funkcije-4",
      front: "Kada se koristi default vrednost parametra?",
      back: "Samo kad je argument izostavljen ili je `undefined`. Za `null`, `0` i `\"\"` ne.",
    },
    {
      id: "fc-js-funkcije-5",
      front: "Šta je **scope**?",
      back: "Deo koda u kome promenljiva postoji: blok `{ }` u kome je napisana. Unutrašnji kod vidi spoljašnji, obrnuto ne važi.",
    },
  ],
};

export default lesson;
