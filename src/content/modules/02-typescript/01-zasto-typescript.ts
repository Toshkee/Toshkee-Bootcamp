import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "zasto-typescript",
  title: "Zašto TypeScript: tipovi kao ugovor",
  summary:
    "Šta TypeScript zapravo radi, kako se pišu osnovni tipovi i zašto ti hvata greške pre nego što pokreneš kod.",
  minutes: 15,
  projects: ["ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `Svaki tvoj projekat ima fajlove koji se završavaju na \`.ts\` ili \`.tsx\`. To je **TypeScript**: običan JavaScript, plus jedna stvar više, a to su **tipovi**.

Tip govori kakva je neka vrednost: tekst (\`string\`), broj (\`number\`), da/ne (\`boolean\`) i tako dalje. Kad napišeš tipove, TypeScript proverava da li se kod drži onoga što si obećao, i to **pre nego što ga pokreneš**.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao utikač i utičnica",
      md: `Funkcija je utičnica, a vrednost koju joj daješ je utikač. JavaScript ti dozvoli da gurneš bilo šta, pa tek kad pustiš struju saznaš da ne radi. TypeScript pogleda oblik utikača unapred i kaže: *"ovo ne odgovara"*.`,
    },
    {
      kind: "prose",
      md: `### Problem koji TypeScript rešava

Pogledaj ovu funkciju u čistom JavaScriptu. Izgleda sasvim nevino:`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "cena.js",
      code: `function ukupnaCena(cena, kolicina) {
  return cena * kolicina
}

ukupnaCena(1200, 2)        // 2400 ✅
ukupnaCena("1200", 2)      // 2400 😬 radi slučajno
ukupnaCena("1200 RSD", 2)  // NaN ❌ i niko te nije upozorio`,
      highlight: [7],
      caption:
        "JavaScript ne proverava šta prosleđuješ. Greška se vidi tek kad korisnik ugleda `NaN` na ekranu.",
    },
    {
      kind: "prose",
      md: `Ista funkcija u TypeScriptu. Jedina razlika je \`: number\` posle svakog parametra:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "cena.ts",
      code: `function ukupnaCena(cena: number, kolicina: number) {
  return cena * kolicina
}

ukupnaCena(1200, 2)        // ✅
ukupnaCena("1200 RSD", 2)  // ❌ Argument of type 'string' is not
                           //    assignable to parameter of type 'number'.`,
      highlight: [1, 6],
      caption:
        "Editor podvuče grešku crvenom linijom čim je otkucaš. Nema pokretanja, nema `NaN`-a.",
    },
    {
      kind: "prose",
      md: `### Kako se piše tip

Pravilo je uvek isto: **\`ime: tip\`**. Dvotačka znači *"ovo je tipa..."*.

- \`let ime: string = "Reform"\` je tekst
- \`let cena: number = 1500\` je broj (TypeScript ne razlikuje cele i decimalne)
- \`let aktivan: boolean = true\` je \`true\` ili \`false\`

Kod funkcija tipove pišeš za parametre, a opciono i za ono što funkcija vraća, posle zagrade: \`function zbir(a: number, b: number): number\`.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/shared/ids.ts",
      lang: "ts",
      startLine: 36,
      intro:
        "Ovo je iz backend-a ReformStudija. Ove dve funkcije prave ID-jeve dokumenata u Firestore-u. Prođi korak po korak.",
      code: `/** Sedmična blokada: \`uid_studioId_2026-W40_lower\`. Postojanje dokumenta = tip je zauzet. */
export const weekLockId = (
  uid: string,
  studioId: StudioId,
  weekKey: string,
  trainingType: TrainingType,
) => \`\${uid}_\${studioId}_\${weekKey}_\${trainingType}\`

/** Slot šablona iz seed-a: \`1_0800\` (ISO dan, vrijeme). Slotovi iz panela dobijaju auto ID. */
export const templateSlotId = (weekday: number, time: string) =>
  \`\${weekday}_\${time.replace(':', '')}\`
`,
      steps: [
        {
          lines: 1,
          md: "Komentar sa `/** ... */` je **JSDoc**. Kad pređeš mišem preko `weekLockId` bilo gde u projektu, editor ti pokaže baš ovaj tekst.",
        },
        {
          lines: 2,
          md: "`export const weekLockId = (...) => ...` je **arrow funkcija** sačuvana u konstanti. `export` znači da je drugi fajlovi mogu uvesti. O tome više u modulu JavaScript.",
        },
        {
          lines: [3, 6],
          md: "Svaki parametar ima tip. `uid` i `weekKey` su obični `string`-ovi. `StudioId` i `TrainingType` su **tvoji sopstveni tipovi**, definisani u `config.ts`. Oni su stroži od `string`-a: dozvoljavaju samo tačno određene vrednosti, recimo `\"fitness\"`. To radimo u lekciji o union tipovima.",
        },
        {
          lines: 7,
          md: "Povratni tip **nije napisan**, a TypeScript ga ipak zna: template string uvek daje `string`. To se zove **inferencija** (zaključivanje tipa) i štedi ti kucanje.",
        },
        {
          lines: [10, 11],
          md: "`weekday: number` znači da TypeScript neće dozvoliti `templateSlotId(\"ponedeljak\", \"08:00\")`. Na `time` možeš da pozoveš `.replace(...)` jer TypeScript zna da je string, a string ima metodu `replace`. Da je `time` broj, editor bi ti odmah rekao da ta metoda ne postoji.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Najbrži način da učiš tipove",
      md: "U VS Code-u (ili Cursoru) **pređi mišem preko bilo koje promenljive ili funkcije**. Pojaviće se njen tip. Radi to stalno, na svom kodu. Videćeš šta je TypeScript sam zaključio.",
    },
    {
      kind: "prose",
      md: `### Inferencija: ne moraš sve da pišeš

TypeScript je pametan. Ako napišeš \`const cena = 1500\`, on već zna da je \`cena\` tipa \`number\`. Tipove pišeš uglavnom na **ulazima**: parametri funkcija, props komponenti, podaci iz baze. Sve unutra TypeScript izračuna sam.

Hajde sad da probaš. Editor ispod je isti onaj koji koristi VS Code, i greške se pojavljuju dok kucaš.`,
    },
    {
      kind: "exercise",
      id: "ts-zasto-1",
      title: "Dodaj tipove parametrima",
      lang: "ts",
      prompt: `Funkcija \`cenaPaketa\` računa koliko košta paket termina. TypeScript se buni da parametri imaju "implicit any", tj. ne zna šta su.

**Zadatak:** dodaj tip \`number\` oba parametra i tip \`number\` kao povratnu vrednost.`,
      starter: `function cenaPaketa(brojTermina, cenaPoTerminu) {
  return brojTermina * cenaPoTerminu
}

console.log(cenaPaketa(8, 1500))
`,
      solution: `function cenaPaketa(brojTermina: number, cenaPoTerminu: number): number {
  return brojTermina * cenaPoTerminu
}

console.log(cenaPaketa(8, 1500))
`,
      tests: [
        { name: "cenaPaketa(8, 1500) vraća 12000", code: "expect(cenaPaketa(8, 1500)).toBe(12000)" },
        { name: "cenaPaketa(1, 900) vraća 900", code: "expect(cenaPaketa(1, 900)).toBe(900)" },
        { name: "ispisuje 12000 u konzolu", code: 'expect(logs).toContain("12000")' },
      ],
      hints: [
        "Tip se piše posle imena parametra, sa dvotačkom: `brojTermina: number`.",
        "Povratni tip ide posle zatvorene zagrade parametara, pre `{`: `function f(a: number): number {`",
      ],
      explanation:
        "Sa `strict` podešavanjem (koje imaju svi tvoji projekti) TypeScript ne dozvoljava parametre bez tipa, jer bi onda bili `any`, a `any` isključuje svaku proveru.",
    },
    {
      kind: "exercise",
      id: "ts-zasto-2",
      title: "Pronađi i popravi grešku",
      lang: "ts",
      prompt: `TypeScript je pronašao grešku u ovom kodu. Pročitaj crveno podvučenu poruku (pređi mišem preko nje) i popravi **samo tip**, ne i funkciju.`,
      starter: `function opisTermina(dan: string, vreme: string): string {
  return dan + " u " + vreme
}

const poruka: number = opisTermina("ponedeljak", "18:00")
console.log(poruka)
`,
      solution: `function opisTermina(dan: string, vreme: string): string {
  return dan + " u " + vreme
}

const poruka: string = opisTermina("ponedeljak", "18:00")
console.log(poruka)
`,
      tests: [
        { name: "poruka je \"ponedeljak u 18:00\"", code: 'expect(poruka).toBe("ponedeljak u 18:00")' },
        { name: "poruka je tekst", code: 'expect(poruka).toBeTypeOf("string")' },
      ],
      hints: [
        "Poruka greške kaže: `Type 'string' is not assignable to type 'number'`. Šta vraća `opisTermina`?",
        "Promeni `const poruka: number` u `const poruka: string`. Ili samo obriši `: number`, pa neka TypeScript zaključi sam.",
      ],
      explanation:
        "Obe varijante su tačne. Brisanje anotacije je često čistije, jer TypeScript ionako zna da `opisTermina` vraća `string`.",
    },
    {
      kind: "quiz",
      id: "ts-zasto-quiz",
      questions: [
        {
          q: "Kada TypeScript pronalazi greške u tipovima?",
          options: [
            "Dok kucaš kod, pre pokretanja",
            "Tek kad korisnik otvori aplikaciju",
            "Samo kad pokreneš `npm run dev`",
            "Nikad, tipovi su samo komentari",
          ],
          answer: 0,
          why: "TypeScript radi u editoru i prilikom build-a. U browser stiže čist JavaScript, a tipovi se brišu.",
        },
        {
          q: "Šta je tip promenljive `x`?",
          code: "function oznaka(broj: number) {\n  const x = `${broj}_termin`\n}",
          codeLang: "ts",
          options: ["`number`", "`string`", "`any`", "Greška, mora se napisati tip"],
          answer: 1,
          why: "Template string (sa backtick-ovima) uvek pravi tekst. TypeScript to sam zaključi, a to je inferencija.",
        },
        {
          q: "Gde se tipovi **najčešće** pišu ručno?",
          options: [
            "Na svakoj promenljivoj, uvek",
            "Na ulazima: parametri funkcija, props, podaci spolja",
            "Samo u `tsconfig.json`",
            "Samo u testovima",
          ],
          answer: 1,
          why: "Unutar funkcije TypeScript skoro sve zaključi sam. Tamo gde podaci ulaze, ti mu kažeš šta da očekuje.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-ts-zasto-1",
      front: "Kako se piše tip parametra u TypeScriptu?",
      back: "`ime: tip`, na primer `function f(cena: number)`",
    },
    {
      id: "fc-ts-zasto-2",
      front: "Šta je **inferencija** tipova?",
      back: "TypeScript sam zaključuje tip iz vrednosti. `const a = 5` je automatski `number`.",
    },
    {
      id: "fc-ts-zasto-3",
      front: "Šta se dešava sa tipovima kad se kod pokrene u browseru?",
      back: "Ništa, jer su obrisani. TypeScript se kompajlira u čist JavaScript, a tipovi služe samo za proveru pre pokretanja.",
    },
  ],
};

export default lesson;
