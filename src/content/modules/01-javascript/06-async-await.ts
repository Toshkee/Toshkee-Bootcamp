import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "async-await",
  title: "Asinhroni kod: Promise, async i await",
  summary:
    "Zašto pozivi ka serveru i bazi ne vraćaju rezultat odmah, šta je Promise, kako `async`/`await` čini taj kod čitljivim, kako se hvataju greške i kako se više zahteva šalje istovremeno.",
  minutes: 20,
  projects: ["PlazaHome", "ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `Do sada je svaka linija koda završavala posao odmah: sabiranje, filter, template string. Ali tvoje aplikacije stalno pričaju sa nečim **spolja**: Firestore baza, API ruta \`/api/contact\`, Anthropic API u portfoliju. Takav zahtev putuje preko interneta i odgovor stiže za 100 ms, za 2 sekunde, ili nikad.

JavaScript u browseru ima **jednu nit**: radi jednu stvar u isto vreme. Kad bi stao i čekao server, cela stranica bi se zamrzla: ni skrol, ni klik, ni animacija. Zato JavaScript ne čeka. Pošalje zahtev, kaže *"javi mi kad stigne"*, i nastavi dalje. To je **asinhroni** kod.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Restoran sa pejdžerom",
      md: `Naručiš burger, a umesto burgera dobiješ **pejdžer** koji će zapištati kad je hrana gotova. Ne stojiš ispred kuhinje: sedneš, pričaš, gledaš telefon. Kad pejdžer zapišti, odeš po hranu. Ili ti kažu "nestalo je mesa".

Pejdžer je **Promise** (obećanje): nije sama vrednost, nego obećanje da će vrednost stići, ili da će stići objašnjenje zašto nije.`,
    },
    {
      kind: "prose",
      md: `### Promise

Promise je objekat koji je uvek u jednom od tri stanja:

- **pending** (čeka): odgovor još nije stigao
- **fulfilled** (ispunjen): stigla je vrednost
- **rejected** (odbijen): desila se greška

\`fetch(...)\`, Firebase \`getDoc(...)\`, \`signInWithEmailAndPassword(...)\`: sve one odmah vraćaju Promise, a ne podatke. Stariji način da se dođe do vrednosti je \`.then()\` (i \`.catch()\` za grešku):`,
    },
    {
      kind: "code",
      lang: "js",
      code: `// Pomoćna funkcija: Promise koji se ispuni posle ms milisekundi
const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

cekaj(1000).then(() => console.log("Prošla je sekunda"))
console.log("Ovo se ispiše PRVO")`,
      highlight: [2, 4],
      caption:
        "`cekaj` ćeš videti u vežbama: glumi server koji odgovara sa zakašnjenjem. `.then(callback)` znači *kad se ispuni, pozovi ovo*. Opet callback, kao u lekciji o funkcijama.",
    },
    {
      kind: "prose",
      md: `### \`async\` i \`await\`

Lanci \`.then().then().catch()\` brzo postanu nečitljivi. Zato postoje \`async\` i \`await\`, koji asinhroni kod čine da **izgleda** kao običan, red po red:

- \`async\` ispred funkcije znači: unutra smem da koristim \`await\`. Takva funkcija **uvek vraća Promise**, šta god u njoj pisalo posle \`return\`.
- \`await\` ispred Promise-a znači: *pauziraj ovu funkciju dok ne stigne vrednost, pa mi daj samu vrednost*.

Ključno: \`await\` pauzira **samo funkciju u kojoj je**. Ostatak aplikacije radi dalje.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `async function ucitajTermine() {
  await cekaj(500)                       // "server" razmišlja
  return [{ vreme: "18:00" }, { vreme: "20:00" }]
}

async function prikazi() {
  const termini = await ucitajTermine()  // čeka, pa dobije NIZ
  console.log(termini.length)            // 2
}`,
      highlight: [7],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zaboravljen `await`",
      md: `\`\`\`js
const termini = ucitajTermine()     // bez await!
console.log(termini)                // Promise { <pending> }
console.log(termini.length)         // undefined
\`\`\`

Bez \`await\` dobiješ pejdžer, a ne burger. Kad vidiš \`Promise { <pending> }\` u konzoli ili \`undefined\` tamo gde očekuješ podatke, prvo proveri da li fali \`await\`.`,
    },
    {
      kind: "prose",
      md: `### Greške: \`try\` / \`catch\`

Mreža puca, server vrati grešku, korisnik nema internet. Kad Promise bude odbijen, \`await\` **baci grešku**, kao da je na tom mestu pisalo \`throw\`. Hvata se blokom \`try { ... } catch (error) { ... }\`: ako bilo šta u \`try\` pukne, izvršavanje skače u \`catch\`. Opcioni \`finally { ... }\` se izvrši u oba slučaja (npr. da se ugasi spinner).

Evo kompletnog obrasca iz kontakt forme na PlazaHome sajtu:`,
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "src/components/contact-form.tsx",
      lang: "tsx",
      startLine: 26,
      intro:
        "Ovo se izvrši kad posetilac pošalje formu. Ignoriši `: FormEvent<...>`, `as ContactPayload` i `<HTMLElement>`, to su tipovi.",
      code: `  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as ContactPayload;

    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(\`[name="\${first}"]\`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
`,
      steps: [
        {
          lines: 1,
          md: "`async function`: samo unutar ovakve funkcije sme da se koristi `await` (linija 41).",
        },
        {
          lines: 14,
          md: "Pre slanja status postaje `\"sending\"`. Zašto pre? Jer zahtev traje, a korisnik mora odmah da vidi da se nešto dešava (dugme pokaže \"Šaljem…\" i isključi se), inače klikne još pet puta.",
        },
        {
          lines: [16, 20],
          md: "`await fetch(...)` šalje POST zahtev na `/api/contact` i **pauzira** `onSubmit` dok server ne odgovori. Stranica za to vreme radi normalno. `JSON.stringify(data)` pretvara objekat u tekst, jer se preko mreže šalje tekst.",
        },
        {
          lines: 21,
          md: "Važna zamka: `fetch` **ne baca grešku** kad server vrati 400 ili 500. Promise se ispuni, samo je `response.ok` `false`. Zato se ovde greška baca ručno, da bi završila u `catch`.",
        },
        {
          lines: [15, 26],
          md: "Ceo poziv je u `try`. Ako nema interneta (`fetch` baci grešku) ili server vrati grešku (`throw` na liniji 46), izvršavanje skače u `catch`, a korisnik vidi poruku o grešci umesto da forma \"visi\" zauvek.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`fetch` i `response.ok`",
      md: "`fetch` odbija Promise **samo** kad zahtev uopšte ne stigne do servera (nema mreže, pogrešna adresa). Odgovor 404 ili 500 je, iz ugla `fetch`-a, uspešno primljen odgovor. Uvek proveri `response.ok` (ili `response.status`) pre nego što koristiš podatke.",
    },
    {
      kind: "prose",
      md: `Firebase radi isto, samo sa svojim funkcijama umesto \`fetch\`. Ovako ReformStudio čita jedan dokument iz Firestore-a:`,
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio/src/lib/api/firebase/member.ts",
      code: `get: (studioId) =>
  guard(async () => {
    if (!isStudioId(studioId)) throw new ApiError('NOT_FOUND')
    const snapshot = await getDocFromServer(doc(deps.db(), PATHS.studio(studioId)))
    if (!snapshot.exists()) throw new ApiError('NOT_FOUND')
    return toStudio(studioId, snapshot.data() as StudioDoc)
  }),`,
      highlight: [4],
      caption:
        "`await getDocFromServer(...)` čeka dokument sa servera. Ako dokument ne postoji, kod sam baca grešku (`throw`), isto kao `if (!response.ok) throw` u formi.",
    },
    {
      kind: "prose",
      md: `### \`Promise.all\`: više zahteva odjednom

Kad ti treba više nezavisnih stvari (studio, termini, rezervacije), nema razloga da čekaš jednu pa drugu. \`Promise.all([...])\` prima niz Promise-a i čeka da se **svi** ispune. Zahtevi krenu **istovremeno**, čim se u nizu pozovu funkcije, a čeka se samo jednom. Rezultat je niz vrednosti, istim redom.`,
    },
    {
      kind: "code",
      lang: "js",
      code: `// Jedan po jedan: 300 + 300 + 300 = ~900 ms
const studio = await ucitajStudio()
const termini = await ucitajTermine()
const rezervacije = await ucitajRezervacije()

// Istovremeno: ~300 ms (koliko traje najsporiji)
const [studio, termini, rezervacije] = await Promise.all([
  ucitajStudio(),
  ucitajTermine(),
  ucitajRezervacije(),
])`,
      highlight: [7],
      caption:
        "Primeti destrukturiranje niza iz lekcije o objektima. Redosled imena odgovara redosledu poziva.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/store/memberStore.ts",
      lang: "ts",
      startLine: 131,
      intro:
        "Kad član otvori aplikaciju ReformStudio, ova funkcija povuče sve što početnom ekranu treba. Šest zahteva ka Firestore-u, svi odjednom.",
      code: `/** Svaki poziv ide zasebno: jedan koji zakaže ne odnosi sa sobom ostale. */
const fetchAll = async (studioId: StudioId): Promise<Fetched> => {
  const monday = weekStartKey(dayKey(new Date()))
  // Sve sedmice koje server drži napravljenim (tekuća + SCHEDULE_WEEKS_AHEAD): kad je tekuća
  // završena, raspored nudi sljedeće dvije (UX-13, ScheduleScreen).
  const range = {
    studioId,
    from: zonedDate(monday).toISOString(),
    to: zonedDate(addDaysToKey(monday, 7 * (SCHEDULE_WEEKS_AHEAD + 1))).toISOString(),
  }
  const [studio, sessions, bookings, invites, notifications, weights] = await Promise.all([
    settle(() => api().studios.get(studioId)),
    settle(() => api().sessions.list(range)),
    settle(() => api().bookings.list()),
    settle(() => api().invites.list()),
    settle(() => api().notifications.list()),
    settle(() => api().weights.list()),
  ])
`,
      steps: [
        {
          lines: 2,
          md: "`async` arrow funkcija. `Promise<Fetched>` je tip: *vraća obećanje da će stići objekat oblika `Fetched`*. Svaka `async` funkcija vraća Promise.",
        },
        {
          lines: [11, 18],
          md: "Šest zahteva kreće istovremeno (čim se napravi niz), a `Promise.all` čeka sve. Ako svaki traje 300 ms, sve stigne za oko 300 ms, a ne za 1,8 sekundi. Rezultati se destrukturiraju u šest promenljivih, istim redom kao pozivi.",
        },
        {
          lines: [12, 17],
          md: "Svaki poziv je umotan u `settle`. Problem sa `Promise.all` je što **pukne čim jedan** zahtev pukne, i tada se gube i rezultati koji su uspeli. `settle` (definisan malo iznad u istom fajlu) hvata grešku pojedinačnog poziva i vraća `{ ok: false, error }` umesto da je baci.",
        },
        {
          lines: 1,
          md: "Komentar kaže tačno to: *jedan koji zakaže ne odnosi sa sobom ostale*. Ako obaveštenja ne stignu, raspored i rezervacije se i dalje prikazuju.",
        },
      ],
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio/src/store/memberStore.ts",
      code: `const settle = async <T>(run: () => Promise<T>): Promise<Outcome<T>> => {
  try {
    return { ok: true, value: await withTimeout(run, LOAD_TIMEOUT_MS) }
  } catch (error) {
    return { ok: false, error }
  }
}`,
      caption:
        "Ovo je `settle`. Ignoriši `<T>` i tipove: to je `try`/`catch` koji grešku pretvara u običan objekat. Sad znaš da pročitaš svaki red ovoga.",
    },
    {
      kind: "exercise",
      id: "js-async-1",
      title: "Gde je nestao await?",
      lang: "js",
      prompt: `\`brojTermina()\` treba da vrati broj termina koje "server" vrati. Umesto toga vraća \`undefined\`.

**Zadatak:** pronađi i popravi grešku. Dovoljna je jedna reč.`,
      starter: `const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Lažni server: posle 50 ms vrati termine
async function ucitajTermine() {
  await cekaj(50)
  return [
    { id: "s1", vreme: "08:00" },
    { id: "s2", vreme: "18:00" },
    { id: "s3", vreme: "20:00" },
  ]
}

async function brojTermina() {
  const termini = ucitajTermine()
  console.log("termini:", termini)
  return termini.length
}

brojTermina().then((n) => console.log("broj:", n))
`,
      solution: `const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Lažni server: posle 50 ms vrati termine
async function ucitajTermine() {
  await cekaj(50)
  return [
    { id: "s1", vreme: "08:00" },
    { id: "s2", vreme: "18:00" },
    { id: "s3", vreme: "20:00" },
  ]
}

async function brojTermina() {
  const termini = await ucitajTermine()
  console.log("termini:", termini)
  return termini.length
}

brojTermina().then((n) => console.log("broj:", n))
`,
      tests: [
        { name: "await brojTermina() daje 3", code: "expect(await brojTermina()).toBe(3)" },
        { name: "brojTermina() vraća Promise (jer je async)", code: "expect(brojTermina()).toBeInstanceOf(Promise)" },
      ],
      hints: [
        "Pogledaj šta ispiše `console.log(\"termini:\", termini)`. Da li je to niz?",
        "`ucitajTermine()` vraća Promise. Da bi se dobio sam niz, ispred poziva treba `await`.",
      ],
      explanation:
        "Bez `await`, `termini` je Promise, a Promise nema `length`, pa je rezultat `undefined`. Primeti i drugi test: `brojTermina()` vraća Promise čak i kad je ispravna, jer je `async`. Zato se i ona poziva sa `await` (ili `.then`).",
    },
    {
      kind: "exercise",
      id: "js-async-2",
      title: "Uhvati grešku",
      lang: "js",
      prompt: `\`fakeFetch\` se ponaša kao pravi \`fetch\`: za nepoznat studio vrati odgovor sa \`ok: false\` i statusom 404, a za \`"/offline"\` baci grešku (nema mreže).

**Zadatak:** popravi \`ucitajStudio(url)\` tako da:
- kad je odgovor uspešan, vrati podatke iz \`response.json()\`
- kad odgovor **nije** \`ok\` **ili** zahtev pukne, vrati \`{ greska: "Studio nije dostupan" }\``,
      starter: `const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Lažni fetch, ponaša se kao pravi
async function fakeFetch(url) {
  await cekaj(30)
  if (url === "/offline") throw new Error("Failed to fetch")
  if (url === "/api/studio/fitness") {
    return { ok: true, status: 200, json: async () => ({ id: "fitness", naziv: "Reform Fitness" }) }
  }
  return { ok: false, status: 404, json: async () => ({ error: "Not found" }) }
}

async function ucitajStudio(url) {
  const response = await fakeFetch(url)
  return await response.json()
}

ucitajStudio("/api/studio/fitness").then(console.log)
`,
      solution: `const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Lažni fetch, ponaša se kao pravi
async function fakeFetch(url) {
  await cekaj(30)
  if (url === "/offline") throw new Error("Failed to fetch")
  if (url === "/api/studio/fitness") {
    return { ok: true, status: 200, json: async () => ({ id: "fitness", naziv: "Reform Fitness" }) }
  }
  return { ok: false, status: 404, json: async () => ({ error: "Not found" }) }
}

async function ucitajStudio(url) {
  try {
    const response = await fakeFetch(url)
    if (!response.ok) throw new Error("HTTP " + response.status)
    return await response.json()
  } catch (error) {
    return { greska: "Studio nije dostupan" }
  }
}

ucitajStudio("/api/studio/fitness").then(console.log)
`,
      tests: [
        {
          name: "fitness studio se učita",
          code: 'expect(await ucitajStudio("/api/studio/fitness")).toEqual({ id: "fitness", naziv: "Reform Fitness" })',
        },
        {
          name: "nepostojeći studio (404) vraća grešku",
          code: 'expect(await ucitajStudio("/api/studio/boks")).toEqual({ greska: "Studio nije dostupan" })',
        },
        {
          name: "bez mreže vraća grešku, a ne puca",
          code: 'expect(await ucitajStudio("/offline")).toEqual({ greska: "Studio nije dostupan" })',
        },
      ],
      hints: [
        "Umotaj telo funkcije u `try { ... } catch (error) { ... }`. U `catch` vrati objekat sa greškom.",
        "Za 404 `fakeFetch` ne baca grešku. Posle `await fakeFetch(url)` proveri `if (!response.ok)` i baci grešku ručno: `throw new Error(...)`. Ili odmah vrati objekat sa greškom.",
        "Redosled u `try`: `await fakeFetch(url)`, pa provera `response.ok`, pa `return await response.json()`.",
      ],
      explanation:
        "Ovo je isti obrazac kao u PlazaHome formi: `try` oko `fetch`-a, ručna provera `response.ok`, i jedno mesto (`catch`) koje rešava sve vrste grešaka. Primeti i da je `response.json()` takođe asinhrono, pa i ono traži `await`.",
    },
    {
      kind: "exercise",
      id: "js-async-3",
      title: "Učitaj sve odjednom",
      lang: "js",
      prompt: `\`ucitajSve()\` radi, ali je spora: tri zahteva po 150 ms idu jedan za drugim, ukupno ~450 ms. Početni ekran ReformStudija ne sme toliko da čeka.

**Zadatak:** prepravi \`ucitajSve\` da sva tri zahteva idu **istovremeno**, sa \`Promise.all\`. Rezultat mora ostati isti objekat.`,
      starter: `const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function ucitajStudio() {
  await cekaj(150)
  return { naziv: "Reform" }
}
async function ucitajTermine() {
  await cekaj(150)
  return ["08:00", "18:00"]
}
async function ucitajRezervacije() {
  await cekaj(150)
  return ["b1"]
}

async function ucitajSve() {
  const studio = await ucitajStudio()
  const termini = await ucitajTermine()
  const rezervacije = await ucitajRezervacije()
  return { studio, termini, rezervacije }
}

const pocetak = Date.now()
ucitajSve().then((podaci) => {
  console.log(podaci)
  console.log("trajalo:", Date.now() - pocetak, "ms")
})
`,
      solution: `const cekaj = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function ucitajStudio() {
  await cekaj(150)
  return { naziv: "Reform" }
}
async function ucitajTermine() {
  await cekaj(150)
  return ["08:00", "18:00"]
}
async function ucitajRezervacije() {
  await cekaj(150)
  return ["b1"]
}

async function ucitajSve() {
  const [studio, termini, rezervacije] = await Promise.all([
    ucitajStudio(),
    ucitajTermine(),
    ucitajRezervacije(),
  ])
  return { studio, termini, rezervacije }
}

const pocetak = Date.now()
ucitajSve().then((podaci) => {
  console.log(podaci)
  console.log("trajalo:", Date.now() - pocetak, "ms")
})
`,
      tests: [
        {
          name: "vraća studio, termine i rezervacije",
          code: 'expect(await ucitajSve()).toEqual({ studio: { naziv: "Reform" }, termini: ["08:00", "18:00"], rezervacije: ["b1"] })',
        },
        {
          name: "traje manje od 300 ms (zahtevi idu istovremeno)",
          code: "const start = Date.now()\nawait ucitajSve()\nexpect(Date.now() - start).toBeLessThan(300)",
        },
      ],
      hints: [
        "Pozovi sve tri funkcije **bez** `await` i stavi ih u niz: `[ucitajStudio(), ucitajTermine(), ucitajRezervacije()]`. Tako sva tri krenu odmah.",
        "Na taj niz stavi jedan `await Promise.all(...)`.",
        "Rezultat raspakuj destrukturiranjem: `const [studio, termini, rezervacije] = await Promise.all([...])`.",
      ],
      explanation:
        "Zahtev krene u trenutku **poziva** funkcije, a ne kad se na njega sačeka. Sa tri `await` u nizu, drugi poziv se desi tek kad se prvi završi. Sa `Promise.all`, sva tri poziva se dese odmah, a čeka se samo jednom. Koristi ovo kad zahtevi ne zavise jedan od drugog.",
    },
    {
      kind: "quiz",
      id: "js-async-quiz",
      questions: [
        {
          q: "Kojim redom se ispisuju brojevi?",
          code: `console.log("1")
setTimeout(() => console.log("2"), 0)
console.log("3")`,
          codeLang: "js",
          options: ["`1 2 3`", "`1 3 2`", "`2 1 3`", "`3 2 1`"],
          answer: 1,
          why: "`setTimeout` čak i sa `0` ms samo zakaže callback za kasnije, kad se trenutni kod završi. Zato `3` ide pre `2`.",
        },
        {
          q: "Šta ispisuje ovaj kod?",
          code: `async function cena() {
  return 1500
}
console.log(cena())`,
          codeLang: "js",
          options: ["`1500`", "`Promise { 1500 }` (Promise, ne broj)", "`undefined`", "Greška"],
          answer: 1,
          why: "`async` funkcija **uvek** vraća Promise, i kad unutra nema ničeg asinhronog. Do broja se dolazi sa `await cena()` ili `cena().then(...)`.",
        },
        {
          q: "Server vrati status 404. Šta uradi `await fetch(url)`?",
          options: [
            "Baci grešku, pa se ide u `catch`",
            "Vrati odgovor sa `response.ok === false`",
            "Vrati `null`",
            "Čeka zauvek",
          ],
          answer: 1,
          why: "Za `fetch` je svaki odgovor sa servera uspeh. Greška se baca samo kad zahtev uopšte ne stigne (nema mreže). Status se proverava ručno.",
        },
        {
          q: "Šta se desi sa `Promise.all([a, b, c])` ako `b` bude odbijen?",
          options: [
            "Vrati `[a, undefined, c]`",
            "Ceo `Promise.all` bude odbijen, pa `await` baci grešku",
            "Ignoriše `b` i vrati `[a, c]`",
            "Pokuša `b` ponovo",
          ],
          answer: 1,
          why: "`Promise.all` pukne čim jedan pukne. Zato ReformStudio svaki poziv umotava u `settle`, koji grešku pretvara u običnu vrednost.",
        },
        {
          q: "Šta tačno radi `await`?",
          options: [
            "Zamrzne celu aplikaciju dok ne stigne odgovor",
            "Pauzira samo `async` funkciju u kojoj je, a ostatak aplikacije radi dalje",
            "Ubrzava zahtev",
            "Pretvara Promise u callback",
          ],
          answer: 1,
          why: "Upravo zato je asinhroni kod koristan: funkcija čeka, a stranica i dalje reaguje na klikove i skrol.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-js-async-1",
      front: "Šta je **Promise**?",
      back: "Obećanje da će vrednost stići kasnije. Stanja: pending (čeka), fulfilled (stigla vrednost), rejected (greška).",
    },
    {
      id: "fc-js-async-2",
      front: "Šta vraća `async` funkcija?",
      back: "Uvek Promise, šta god pisalo posle `return`. Vrednost se dobija sa `await` ili `.then()`.",
    },
    {
      id: "fc-js-async-3",
      front: "Da li `fetch` baca grešku za status 404 ili 500?",
      back: "Ne. Baca samo kad zahtev ne stigne do servera. Status se proverava sa `response.ok`.",
    },
    {
      id: "fc-js-async-4",
      front: "Kada `Promise.all`?",
      back: "Kad treba više nezavisnih zahteva: krenu istovremeno, čeka se najsporiji. `const [a, b] = await Promise.all([f(), g()])`",
    },
    {
      id: "fc-js-async-5",
      front: "Kako se hvata greška iz `await`?",
      back: "`try { await ... } catch (error) { ... }`. Odbijen Promise se kod `await` ponaša kao `throw`.",
    },
  ],
};

export default lesson;
