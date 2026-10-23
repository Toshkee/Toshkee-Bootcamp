import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "promenljive-i-vrednosti",
  title: "Promenljive i vrednosti",
  summary:
    "Kada se koristi `const`, a kada `let`, koje vrste vrednosti postoje, kako radi template string i zašto se uvek poredi sa `===`.",
  minutes: 18,
  projects: ["milenaspajic", "ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `Svaki program radi sa **vrednostima**: imenom člana, cenom paketa, brojem slobodnih mesta, informacijom da li je meni otvoren. Da bi mogao da ih koristi više puta, program im daje **ime**. Ime za vrednost zove se **promenljiva**.

U tvojim projektima promenljive se prave na dva načina: sa \`const\` i sa \`let\`. Treći način, \`var\`, postoji, ali ga u modernom kodu skoro nećeš videti, i to s razlogom.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kutija sa etiketom",
      md: `Promenljiva je kutija sa etiketom. Etiketa je ime (\`brojMesta\`), a u kutiji je vrednost (\`6\`).

- \`const\` je kutija koju zatvoriš i zalepiš: ono što staviš unutra ostaje tu zauvek.
- \`let\` je kutija sa poklopcem: kasnije možeš da izvadiš staru vrednost i staviš novu.`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "promenljive.js",
      code: `const studio = "Reform"
let slobodnaMesta = 6

slobodnaMesta = 5        // ✅ let sme da dobije novu vrednost
studio = "Plaza"         // ❌ TypeError: Assignment to constant variable.`,
      highlight: [5],
      caption:
        "`=` znači *dodeli*, a ne *jednako je*. `slobodnaMesta = 5` čita se: stavi 5 u kutiju `slobodnaMesta`.",
    },
    {
      kind: "prose",
      md: `### Pravilo: \`const\` dok ne zatreba \`let\`

Profesionalci pišu \`const\` svuda, a \`let\` samo kad vrednost zaista mora da se promeni (brojač, stanje koje se menja, rezultat koji se gradi korak po korak). Zašto? Kad vidiš \`const\`, odmah znaš da ta vrednost ostaje ista do kraja. Manje stvari moraš da držiš u glavi dok čitaš kod.

A \`var\`? To je stari način iz vremena pre 2015. godine. Ima čudna pravila (vidi se i izvan bloka \`{ }\` u kome je napisan i "postoji" i pre linije na kojoj je deklarisan), pa pravi greške koje se teško nalaze. \`let\` i \`const\` su napravljeni baš da ga zamene.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`const` ne znači da se sadržaj ne menja",
      md: `\`const\` zabranjuje samo da u kutiju staviš **drugu** vrednost. Ako je unutra objekat ili niz, njegov sadržaj i dalje može da se menja:

\`\`\`js
const termin = { mesta: 6 }
termin.mesta = 5      // ✅ radi, menja se unutrašnjost
termin = { mesta: 5 } // ❌ greška, ovo je nova vrednost
\`\`\`

Više o tome u lekciji o objektima.`,
    },
    {
      kind: "prose",
      md: `### Vrste vrednosti

JavaScript ima nekoliko osnovnih (primitivnih) vrsta vrednosti. Ovih pet ćeš sretati stalno:

- **\`string\`** je tekst, uvek pod navodnicima: \`"Pilates"\`, \`'18:00'\`. Jednostruki i dvostruki navodnici rade isto.
- **\`number\`** je broj, i ceo i decimalni: \`6\`, \`72.5\`, \`-1\`. Postoji i specijalna vrednost \`NaN\` ("not a number"), rezultat neuspelog računa, npr. \`"abc" * 2\`.
- **\`boolean\`** je \`true\` ili \`false\`. Odgovor na pitanje sa da/ne: da li je termin pun, da li je meni otvoren.
- **\`undefined\`** znači *"vrednost nije ni postavljena"*. To dobiješ kad čitaš nešto što ne postoji.
- **\`null\`** znači *"namerno prazno"*. Ti (ili server) kažeš: ovde nema ničega.

Razlika između poslednja dva je suptilna: \`undefined\` se obično desi sam od sebe, a \`null\` neko upiše namerno. U ReformStudiju, recimo, \`nutritionPlan: null\` znači "član nema plan ishrane", a ne "zaboravili smo da ga učitamo".`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "typeof.js",
      code: `typeof "Pilates"   // "string"
typeof 1500        // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  ← poznata greška u jeziku iz 1995.

let napomena
console.log(napomena)  // undefined, jer vrednost nije postavljena`,
      highlight: [5],
      caption:
        "`typeof` ti kaže kakva je vrednost, kao tekst. Za `null` vraća `\"object\"`, što je istorijska greška koju niko ne sme da ispravi jer bi pokvarila stare sajtove.",
    },
    {
      kind: "prose",
      md: `### Template string: tekst sa ubačenim vrednostima

Kad praviš tekst od više delova, najčistije je da koristiš **backtick-ove** (znak \`\` \` \`\`, kosi navodnik) umesto navodnika. Unutar njih, \`\${...}\` ubacuje bilo koju vrednost ili izraz:`,
    },
    {
      kind: "code",
      lang: "js",
      code: `const ime = "Ana"
const brojTermina = 8

// Stari način, lako se zaborave razmaci:
const a = ime + " ima " + brojTermina + " termina"

// Template string:
const b = \`\${ime} ima \${brojTermina} termina\`

// U \${ } može ceo izraz:
const c = \`Ukupno: \${brojTermina * 1500} RSD\``,
      highlight: [8, 11],
      caption:
        "Isti mehanizam koristi `weekLockId` u ReformStudiju da sklopi ID dokumenta: `` `${uid}_${studioId}_${weekKey}_${trainingType}` ``.",
    },
    {
      kind: "fromYourCode",
      project: "milenaspajic",
      file: "main.js",
      lang: "js",
      startLine: 516,
      intro:
        "Ovo je mobilni meni sa Milenine stranice, čist JavaScript. Obrati pažnju na to koja promenljiva je `let`, a koje su `const`, i zašto.",
      code: `  function initMenu(lenis) {
    const btn = $(".nav__toggle");
    const menu = $("#menu");
    if (!btn || !menu) return;
    const links = $$(".menu__links a, .menu__foot > *", menu);
    let open = false;

    const set = (v) => {
      open = v;
      btn.setAttribute("aria-expanded", String(v));
      btn.setAttribute("aria-label", v ? "Close menu" : "Open menu");
      if (v) {
        menu.hidden = false;
        if (lenis) lenis.stop();
        document.body.style.overflow = "hidden";
        if (!reduce) {
          gsap.fromTo(menu, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" });
          gsap.fromTo(links, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.05, delay: 0.3 });
        }
        links[0].focus({ preventScroll: true });
      } else {
        document.body.style.overflow = "";
        if (lenis) lenis.start();
        if (reduce) { menu.hidden = true; return; }
        gsap.to(menu, { clipPath: "circle(0% at 100% 0%)", duration: 0.7, ease: "expo.inOut", onComplete: () => (menu.hidden = true) });
      }
    };
    btn.addEventListener("click", () => set(!open));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) { set(false); btn.focus(); } });
  }
`,
      steps: [
        {
          lines: [2, 5],
          md: "Dugme, meni i linkovi se pronađu **jednom** na stranici i posle se nikad ne menjaju, zato su `const`.",
        },
        {
          lines: 4,
          md: "`if (!btn || !menu) return;` znači: ako dugme ili meni ne postoje, prekini. Kad element ne postoji, `$(...)` vrati `null`, a `!null` je `true`. To je **truthy/falsy** logika, o kojoj je reč malo niže.",
        },
        {
          lines: 6,
          md: "Jedina `let` promenljiva. Meni je čas otvoren, čas zatvoren, pa vrednost **mora** da može da se promeni.",
        },
        {
          lines: [9, 11],
          md: "`open = v` je ta promena (sa `const` bi ovde pukao program). `String(v)` pretvara `true` u tekst `\"true\"`, jer HTML atributi su uvek tekst. `v ? \"Close menu\" : \"Open menu\"` je **ternarni operator**: *ako je v tačno, uzmi prvo, inače drugo*.",
        },
        {
          lines: 28,
          md: "`!open` obrće boolean: `!true` je `false` i obrnuto. Klik na dugme tako uvek prebaci meni u suprotno stanje.",
        },
        {
          lines: 30,
          md: "`e.key === \"Escape\" && open`: zatvori meni samo ako je pritisnut Escape **i** meni je otvoren. `===` strogo poredi dva teksta.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Truthy i falsy

U \`if (...)\` JavaScript ne traži baš \`true\` ili \`false\`. Svaku vrednost pretvori u boolean. Vrednosti koje se pretvore u \`false\` zovu se **falsy**. U praksi ćeš sretati ovih šest:

\`false\`, \`0\`, \`""\` (prazan tekst), \`null\`, \`undefined\`, \`NaN\`

(Falsy su još i dve retke vrednosti: \`-0\` i \`0n\`, nula tipa BigInt.) **Sve ostalo je truthy**, uključujući \`"0"\`, \`"false"\`, \`[]\` (prazan niz) i \`{}\` (prazan objekat). Zato je \`if (!btn)\` kratak način da se kaže "ako nema dugmeta".

Kad ti treba pravi boolean od bilo čega, koristi \`Boolean(x)\` (ili \`!!x\`, isto je). A kad ti treba broj od teksta (sve iz forme stiže kao tekst), koristi \`Number("3")\`, što daje \`3\`.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Nula je falsy",
      md: `\`\`\`js
const slobodnaMesta = 0
if (slobodnaMesta) { ... }  // ne ulazi, iako je 0 sasvim ispravan broj
\`\`\`

Ako je \`0\` legitimna vrednost (nula mesta, nula dinara, nulti indeks), ne oslanjaj se na truthy proveru. Napiši tačno šta pitaš: \`if (slobodnaMesta > 0)\`.`,
    },
    {
      kind: "prose",
      md: `### \`===\` umesto \`==\`

JavaScript ima dva poređenja jednakosti:

- \`==\` (labavo) pre poređenja **pokušava da pretvori** vrednosti u isti tip. Zato je \`"5" == 5\` tačno, \`0 == ""\` tačno, \`null == undefined\` tačno.
- \`===\` (strogo) poredi i vrednost **i tip**. \`"5" === 5\` je \`false\`, jer je jedno tekst, a drugo broj.

Pravilo je jednostavno: **uvek \`===\` i \`!==\`**. Labavo poređenje krije greške, na primer kad ti iz forme stigne \`"0"\` umesto \`0\`. U tvojim projektima videćeš skoro isključivo \`===\`. Retki izuzetak je \`x != null\` u portfoliju, namerni idiom koji jednom proverom hvata i \`null\` i \`undefined\`.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "functions/src/shared/rules.ts",
      lang: "ts",
      startLine: 43,
      intro:
        "Server ReformStudija proverava da li je upisana kilaža ispravna. Ovo je TypeScript, ali ignoriši `: unknown` i `kg is number` za sada, to je sledeći modul. Ostalo je čist JavaScript.",
      code: `/** Kilaža: broj od WEIGHT_MIN_KG do WEIGHT_MAX_KG, sa najviše jednom decimalom. */
export const isValidKg = (kg: unknown): kg is number =>
  typeof kg === 'number' &&
  Number.isFinite(kg) &&
  kg >= WEIGHT_MIN_KG &&
  kg <= WEIGHT_MAX_KG &&
  Math.abs(kg * 10 - Math.round(kg * 10)) < 1e-6
`,
      steps: [
        {
          lines: 3,
          md: "Prvo pitanje: da li je ovo uopšte broj? `typeof` vraća tekst, pa se poredi sa tekstom `'number'`, strogo, sa `===`. Ako neko pošalje `\"72\"` (tekst), ovde otpada.",
        },
        {
          lines: 4,
          md: "`Number.isFinite` odbacuje `NaN` i beskonačnost. Zapamti: `typeof NaN` je `\"number\"`, pa sama `typeof` provera nije dovoljna.",
        },
        {
          lines: [5, 7],
          md: "`&&` znači **i**: sve provere moraju biti tačne. Čim jedna nije, ceo izraz je `false` i ostale se ni ne izvršavaju. Imena pisana VELIKIM_SLOVIMA su konstante iz konfiguracije (najmanja i najveća dozvoljena kilaža).",
        },
      ],
    },
    {
      kind: "exercise",
      id: "js-promenljive-1",
      title: "const ili let?",
      lang: "js",
      prompt: `Ovaj kod puca sa greškom \`TypeError: Assignment to constant variable.\` Klikni **Pokreni** i uveri se.

**Zadatak:** popravi deklaraciju tako da kod ispiše \`2\`. Menjaš samo jednu reč.`,
      starter: `const brojRezervacija = 0

// Član je rezervisao dva termina
brojRezervacija = brojRezervacija + 1
brojRezervacija = brojRezervacija + 1

console.log(brojRezervacija)
`,
      solution: `let brojRezervacija = 0

// Član je rezervisao dva termina
brojRezervacija = brojRezervacija + 1
brojRezervacija = brojRezervacija + 1

console.log(brojRezervacija)
`,
      tests: [
        { name: "brojRezervacija je na kraju 2", code: "expect(brojRezervacija).toBe(2)" },
        { name: "u konzoli piše 2", code: 'expect(logs).toContain("2")' },
      ],
      hints: [
        "Vrednost se menja dva puta posle deklaracije. Koja deklaracija to dozvoljava?",
        "Zameni `const` sa `let` u prvoj liniji.",
      ],
      explanation:
        "`const` zabranjuje ponovnu dodelu. Brojač koji raste mora biti `let`. Sve što se ne menja ostavi kao `const`.",
    },
    {
      kind: "exercise",
      id: "js-promenljive-2",
      title: "Poruka za člana",
      lang: "js",
      prompt: `Napravi poruku koja tačno glasi:

\`Ana, tvoj termin je u 18:00. Slobodnih mesta: 3.\`

**Zadatak:** koristi template string (backtick-ove) i ubaci vrednosti iz promenljivih \`ime\`, \`vreme\` i \`slobodno\`. Ne kucaj "Ana", "18:00" i "3" ručno u poruku.`,
      starter: `const ime = "Ana"
const vreme = "18:00"
const slobodno = 3

const poruka = "Ana, tvoj termin je u " + vreme

console.log(poruka)
`,
      solution: `const ime = "Ana"
const vreme = "18:00"
const slobodno = 3

const poruka = \`\${ime}, tvoj termin je u \${vreme}. Slobodnih mesta: \${slobodno}.\`

console.log(poruka)
`,
      tests: [
        {
          name: "poruka je tačno \"Ana, tvoj termin je u 18:00. Slobodnih mesta: 3.\"",
          code: 'expect(poruka).toBe("Ana, tvoj termin je u 18:00. Slobodnih mesta: 3.")',
        },
        {
          name: "poruka je ispisana u konzoli",
          code: 'expect(logs).toContain("Ana, tvoj termin je u 18:00. Slobodnih mesta: 3.")',
        },
      ],
      hints: [
        "Template string počinje i završava se backtick-om: `` `...` ``. Navodnici `\"` tu ne rade.",
        "Vrednost se ubacuje sa `${ime}`. Pazi na zarez, tačke i razmake, test poredi tekst slovo po slovo.",
        "Cela linija: `` const poruka = `${ime}, tvoj termin je u ${vreme}. Slobodnih mesta: ${slobodno}.` ``",
      ],
      explanation:
        "Template string je čitljiviji od lepljenja sa `+` i ne moraš da paziš na razmake oko svakog dela. Broj `3` se sam pretvori u tekst kad ga ubaciš sa `${}`.",
    },
    {
      kind: "exercise",
      id: "js-promenljive-3",
      title: "Tačno ili netačno?",
      lang: "js",
      prompt: `Podaci su stigli iz forme za rezervaciju. Zameni svako \`null\` **izrazom** koji računa vrednost iz promenljivih iznad (ne kucaj \`true\` ili \`false\` ručno):

- \`imaMesta\`: da li ima bar jedno slobodno mesto
- \`imaNapomenu\`: da li napomena nije prazan tekst
- \`brojOsoba\`: \`brojIzForme\` pretvoren u pravi broj
- \`dvojeOsoba\`: da li je \`brojOsoba\` strogo jednak broju \`2\``,
      starter: `const slobodnaMesta = 0
const napomena = ""
const brojIzForme = "2"   // sve iz forme stiže kao tekst

const imaMesta = null
const imaNapomenu = null
const brojOsoba = null
const dvojeOsoba = null

console.log(imaMesta, imaNapomenu, brojOsoba, dvojeOsoba)
`,
      solution: `const slobodnaMesta = 0
const napomena = ""
const brojIzForme = "2"   // sve iz forme stiže kao tekst

const imaMesta = slobodnaMesta > 0
const imaNapomenu = napomena !== ""
const brojOsoba = Number(brojIzForme)
const dvojeOsoba = brojOsoba === 2

console.log(imaMesta, imaNapomenu, brojOsoba, dvojeOsoba)
`,
      tests: [
        { name: "imaMesta je false (nula mesta)", code: "expect(imaMesta).toBe(false)" },
        { name: "imaNapomenu je false (prazan tekst)", code: "expect(imaNapomenu).toBe(false)" },
        { name: "brojOsoba je broj 2, a ne tekst \"2\"", code: "expect(brojOsoba).toBe(2)" },
        { name: "dvojeOsoba je true", code: "expect(dvojeOsoba).toBe(true)" },
      ],
      hints: [
        "Poređenja kao `>` i `!==` uvek vraćaju boolean. To je upravo ono što treba za prva dva.",
        "Tekst se pretvara u broj sa `Number(...)`.",
        "Rešenje: `slobodnaMesta > 0`, `napomena !== \"\"`, `Number(brojIzForme)`, `brojOsoba === 2`.",
      ],
      explanation:
        "Primeti zamku: `\"2\" === 2` je `false`, jer se razlikuju tipovi. Zato se vrednost iz forme prvo pretvori u broj, pa se tek onda poredi. Za `imaNapomenu` bi radilo i `Boolean(napomena)` ili `napomena.length > 0`.",
    },
    {
      kind: "quiz",
      id: "js-promenljive-quiz",
      questions: [
        {
          q: "Šta se desi kad se pokrene ovaj kod?",
          code: `const cena = 1500
cena = 1800
console.log(cena)`,
          codeLang: "js",
          options: [
            "Ispiše `1800`",
            "Ispiše `1500`",
            "Pukne sa `TypeError`",
            "Ispiše `undefined`",
          ],
          answer: 2,
          why: "`const` ne dozvoljava novu dodelu. Program pukne na drugoj liniji i do `console.log` nikad ne stigne.",
        },
        {
          q: "Koja od ovih vrednosti je **falsy**?",
          options: ["`\"0\"`", "`[]`", "`0`", "`\"false\"`"],
          answer: 2,
          why: "Falsy su `false`, `0`, `\"\"`, `null`, `undefined` i `NaN` (i retki `-0` i `0n`). Tekst `\"0\"` nije prazan, pa je truthy. Prazan niz je takođe truthy.",
        },
        {
          q: "Šta ispisuje ovaj kod?",
          code: `console.log("5" == 5, "5" === 5)`,
          codeLang: "js",
          options: ["`true true`", "`true false`", "`false false`", "`false true`"],
          answer: 1,
          why: "`==` pretvara tekst u broj pre poređenja, pa je `\"5\" == 5` tačno. `===` poredi i tip: tekst nije broj, pa je `false`.",
        },
        {
          q: "Šta vraća `typeof null`?",
          options: ["`\"null\"`", "`\"undefined\"`", "`\"object\"`", "`\"boolean\"`"],
          answer: 2,
          why: "Istorijska greška jezika koja je ostala zbog kompatibilnosti. Zato se `null` proverava direktno: `x === null`.",
        },
        {
          q: "Šta je vrednost `poruka`?",
          code: "const n = 3\nconst poruka = `Ostalo je ${n - 1} mesta`",
          codeLang: "js",
          options: [
            "`\"Ostalo je n - 1 mesta\"`",
            "`\"Ostalo je 2 mesta\"`",
            "`\"Ostalo je ${n - 1} mesta\"`",
            "Greška, u `${}` ne sme račun",
          ],
          answer: 1,
          why: "U `${}` može bilo koji izraz. Izračuna se `3 - 1`, a rezultat se ubaci u tekst.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-js-promenljive-1",
      front: "Kada `const`, a kada `let`?",
      back: "`const` uvek, osim kad vrednost mora kasnije da dobije novu dodelu (brojač, stanje). Tada `let`. `var` se ne koristi.",
    },
    {
      id: "fc-js-promenljive-2",
      front: "Koje su **falsy** vrednosti u JavaScriptu?",
      back: "`false`, `0`, `\"\"`, `null`, `undefined`, `NaN` (i retki `-0` i `0n`). Sve ostalo je truthy, i `\"0\"` i `[]`.",
    },
    {
      id: "fc-js-promenljive-3",
      front: "Razlika između `==` i `===`?",
      back: "`==` pretvara tipove pre poređenja (`\"5\" == 5` je `true`). `===` poredi i tip (`\"5\" === 5` je `false`). Koristi uvek `===`.",
    },
    {
      id: "fc-js-promenljive-4",
      front: "Razlika između `null` i `undefined`?",
      back: "`undefined`: vrednost nije ni postavljena (desi se samo). `null`: neko je namerno rekao \"ovde nema ničega\".",
    },
    {
      id: "fc-js-promenljive-5",
      front: "Kako se ubacuje vrednost u tekst?",
      back: "Template string sa backtick-ovima: `` `Zdravo, ${ime}` ``.",
    },
  ],
};

export default lesson;
