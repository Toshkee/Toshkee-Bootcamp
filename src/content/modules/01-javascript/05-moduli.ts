import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "moduli",
  title: "Moduli: import i export",
  summary:
    "Zašto je kod podeljen u mnogo fajlova, kako fajlovi dele funkcije preko `export` i `import`, razlika između named i default exporta, `import type` i šta znači `@/` na početku putanje.",
  minutes: 15,
  projects: ["milenaspajic", "ReformStudio", "my-portfolio"],
  blocks: [
    {
      kind: "prose",
      md: `Otvori bilo koji fajl u svojim projektima i prvih desetak linija su \`import\`. To nije ukras. Svaki fajl je zaseban **modul**: mali zatvoren svet sa svojim promenljivama i funkcijama. Ništa iz njega ne "curi" napolje, osim onoga što fajl namerno **izveze** (\`export\`). Drugi fajl to onda **uveze** (\`import\`).

Zašto kod nije u jednom velikom fajlu?

- **Snalaženje.** \`src/lib/date.ts\` sadrži datume, \`src/lib/members.ts\` članove. Znaš gde da tražiš.
- **Ponovna upotreba.** Jedna funkcija, napisana jednom, koristi se na dvadeset mesta.
- **Bez sudara imena.** Dva fajla mogu imati svoju promenljivu \`data\` i neće se pomešati.
- **Deljenje između delova sistema.** U ReformStudiju i aplikacija i server uvoze **isti** fajl sa pravilima. O tome malo niže.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Radnja sa izlogom",
      md: `Svaki fajl je radnja. Unutra ima svašta: alat, pomoćne stvari, nedovršene poslove. \`export\` je **izlog**: samo ono što staviš u izlog drugi mogu da "kupe" sa \`import\`. Sve ostalo ostaje u magacinu, privatno.

Funkcija \`ms\` u \`shared/rules.ts\` iz lekcije o funkcijama nema \`export\`. To je alat iz magacina, a \`hasStarted\` i \`canCancel\` su u izlogu.`,
    },
    {
      kind: "prose",
      md: `### Named export: po imenu

Najčešći oblik. Staviš \`export\` ispred \`const\` ili \`function\`, i drugi fajl uvozi **tačno to ime** u vitičastim zagradama:`,
    },
    {
      kind: "code",
      lang: "js",
      filename: "lib/cena.js",
      code: `export const PDV = 0.2

export function cenaSaPdv(cena) {
  return cena + cena * PDV
}

const zaokruzi = (n) => Math.round(n)   // bez export: privatna`,
      highlight: [1, 3, 7],
    },
    {
      kind: "code",
      lang: "js",
      filename: "screens/Korpa.js",
      code: `import { cenaSaPdv, PDV } from "../lib/cena"

cenaSaPdv(1000)   // 1200
zaokruzi(3.7)     // ❌ ReferenceError: zaokruzi nije izvezena`,
      highlight: [1],
      caption:
        "Ime u zagradama mora da se poklapa sa imenom pri izvozu. Ako ti treba drugo ime: `import { cenaSaPdv as saPdv } from ...`.",
    },
    {
      kind: "prose",
      md: `### Default export: jedan glavni

Fajl može imati **jedan** \`export default\`, svoju "glavnu" stvar. Najčešće je to React komponenta, jer jedan fajl obično ima jednu komponentu. Uvozi se **bez vitičastih zagrada**, a ime biraš slobodno, pri uvozu.

U tvom portfoliju, \`Chat.tsx\` izvozi \`export default function Chat(...)\`, a ostale komponente iz istog foldera se uvoze ovako (\`my-portfolio/src/app/site/Chat.tsx\`):

\`\`\`tsx
import AskBar from "./AskBar";
import Avatar from "./Avatar";
import Markdown from "./Markdown";
import { FollowUps, QuickPills } from "./QuickQuestions";
\`\`\`

Prve tri su default (bez zagrada), poslednja uvozi dva named exporta iz jednog fajla.`,
    },
    {
      kind: "fromYourCode",
      project: "milenaspajic",
      file: "main.js",
      lang: "js",
      startLine: 6,
      intro: "Prve linije Mileninog sajta. Četiri importa iz dva paketa (`gsap` i `lenis`), oba oblika importa.",
      code: `import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
`,
      steps: [
        {
          lines: 1,
          md: "**Default import**: paket `gsap` ima jednu glavnu stvar, a ovde je nazvana `gsap`. Moglo je i `import animacije from \"gsap\"`, radilo bi isto.",
        },
        {
          lines: [2, 3],
          md: "**Named import**: `ScrollTrigger` i `SplitText` su izvezeni pod tačno tim imenima, pa ih tako i uvoziš, u zagradama. `\"gsap/ScrollTrigger\"` je fajl unutar paketa `gsap`.",
        },
        {
          lines: 4,
          md: "Opet default. Kako znaš koji je koji? Dokumentacija biblioteke ti kaže, a editor će podvući grešku ako pogrešiš.",
        },
        {
          lines: [1, 4],
          md: "Nijedna putanja ne počinje sa `./` ili `../`. To znači: ovo nije tvoj fajl, nego **paket** iz `node_modules`, koji je stigao sa `npm install` (i piše u `package.json`).",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Zagrade ili ne?",
      md: `Najčešća greška sa importima je pomešan oblik:

\`\`\`js
import { Lenis } from "lenis"       // ❌ Lenis je default, a ovo traži named
import create from "zustand"        // ❌ obrnuto: create je named, a ovo traži default
\`\`\`

Poruka greške je tipa *"does not provide an export named 'Lenis'"* ili *"has no default export"*. Kad je vidiš, prvo proveri zagrade.`,
    },
    {
      kind: "prose",
      md: `### Putanje: \`./\`, \`../\` i \`@/\`

- \`"./date"\` znači fajl \`date\` **u istom folderu**. Ekstenzija (\`.ts\`, \`.js\`) se ne piše.
- \`"../types"\` znači jedan folder **iznad**.
- \`"@/config"\` je **alias** (prečica). Kad bi fajl bio duboko u folderima, relativna putanja bi bila \`"../../../config"\`, što je ružno i puca čim se fajl premesti. Zato se u \`tsconfig.json\` definiše da \`@/\` znači "koren foldera \`src\`".
- Putanja do foldera (\`"@/config"\`) učitava \`index.ts\` iz tog foldera.

Ovako su prečice definisane u ReformStudiju (\`tsconfig.app.json\`; Vite ima istu stvar u \`vite.config.ts\`):`,
    },
    {
      kind: "code",
      lang: "json",
      filename: "ReformStudio/tsconfig.app.json",
      code: `    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./functions/src/shared/*"]
    }`,
      caption:
        "`@/lib/date` → `src/lib/date.ts`, a `@shared/rules` → `functions/src/shared/rules.ts`. Ostali tvoji projekti (portfolio, PlazaHome, Pasted, Looply) imaju samo `@/*`.",
    },
    {
      kind: "prose",
      md: `### \`import type\`

U TypeScript projektima videćeš i \`import type { Booking } from '@/types'\`. To uvozi **samo tip**, opis oblika podatka, a ne pravu vrednost. Prilikom build-a TypeScript ovakve linije **potpuno briše**, jer tipovi ne postoje u JavaScriptu koji ide u browser. Kad se piše \`type\`, i alat i čitalac odmah znaju da ovaj import ne donosi nikakav kod. Može i unutar običnog importa: \`import { api, ApiError, type WeightInput } from '@/lib/api'\`.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/lib/rules.ts",
      lang: "ts",
      startLine: 1,
      intro:
        "Početak fajla sa pravilima treninga u aplikaciji ReformStudio. Ovde se vidi skoro sve iz ove lekcije na jednom mestu.",
      code: `import { MEMBERSHIP_WARNING_DAYS } from '@/config'
import type { Booking, Invite, Session } from '@/types'
import { canCancel, hasStarted, isFull, membershipValidOn } from '@shared/rules'
import { dayKey, diffInDays, weekKey } from './date'

/**
 * Pravila treninga kako ih UI prikazuje. Server (Cloud Functions) primjenjuje ista
 * pravila i jedini ih stvarno sprovodi — ovo ovdje je samo ogledalo, da dugmad i
 * objašnjenja budu tačni prije nego što zahtjev uopšte ode. Pravila koja koriste obje
 * strane su u zajedničkom modulu (functions/src/shared/rules.ts) i ovdje su ponovo izvezena.
 */
export {
  canCancel,
  hasStarted,
  isFull,
  isValidWeight,
  membershipValidOn,
  spotsLeft,
} from '@shared/rules'
`,
      steps: [
        {
          lines: 1,
          md: "Named import iz `@/config`, tj. iz `src/config/index.ts`. `MEMBERSHIP_WARNING_DAYS` je konstanta (koliko dana pre isteka članarine se prikazuje upozorenje).",
        },
        {
          lines: 2,
          md: "`import type`: `Booking`, `Invite` i `Session` su samo opisi oblika podataka. Ova linija nestaje pri build-u.",
        },
        {
          lines: 3,
          md: "`@shared/rules` vodi u `functions/src/shared/rules.ts`, **isti fajl koji koristi server**. Pravilo \"otkazivanje najkasnije X sati pre termina\" napisano je jednom, pa aplikacija i server ne mogu da se raziđu. To je najjači razlog za module.",
        },
        {
          lines: 4,
          md: "Relativna putanja: `date.ts` iz istog foldera (`src/lib/`).",
        },
        {
          lines: [12, 19],
          md: "**Re-export**: ovaj fajl uzima funkcije iz `@shared/rules` i izvozi ih dalje, kao da su njegove. Ekrani zato uvoze sve iz jednog mesta, `@/lib/rules`, i ne moraju da znaju da neka pravila zapravo žive na serveru.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Skoči na definiciju",
      md: "U VS Code-u ili Cursoru drži **Cmd** i klikni na bilo koje uvezeno ime (ili pritisni **F12**). Editor te odvede u fajl gde je izvezeno. Najbrži način da razumeš tuđ (ili AI-jev) kod je da tako pratiš importe.",
    },
    {
      kind: "prose",
      md: `### Pre modula: IIFE

Milenin \`main.js\` ceo kod drži unutar ovoga:

\`\`\`js
(function () {
  "use strict";
  // ... 650 linija ...
})();
\`\`\`

To je **IIFE** (*immediately invoked function expression*): funkcija koja se odmah pozove. Pre nego što je JavaScript dobio \`import\`/\`export\`, ovo je bio način da se promenljive sakriju od ostatka stranice. Sve što je napravljeno unutar funkcije, ostaje u njenom scope-u (lekcija o funkcijama). Danas su moduli to rešili, ali ideja je ista: **privatno unutra, javno samo ono što izložiš.**

Pošto vežbe ovde ne mogu da koriste \`import\`, isprobaj tu ideju na IIFE.`,
    },
    {
      kind: "exercise",
      id: "js-moduli-1",
      title: "Napravi mini-modul",
      lang: "js",
      prompt: `Korpa paketa trenutno izlaže sve, i niz \`stavke\` je dostupan svakome ko želi da ga pokvari.

**Zadatak:** umotaj kod u IIFE tako da:
- \`korpa\` ima **samo** \`dodaj\` i \`ukupno\` (to je njen "export")
- \`stavke\` ne postoji izvan korpe

Kostur: \`const korpa = (() => { ... return { dodaj, ukupno } })()\``,
      starter: `const stavke = []

function dodaj(naziv, cena) {
  stavke.push({ naziv, cena })
}

function ukupno() {
  return stavke.reduce((zbir, s) => zbir + s.cena, 0)
}

const korpa = { dodaj, ukupno, stavke }

korpa.dodaj("Paket 8 termina", 12000)
console.log(korpa.ukupno())
`,
      solution: `const korpa = (() => {
  const stavke = []

  function dodaj(naziv, cena) {
    stavke.push({ naziv, cena })
  }

  function ukupno() {
    return stavke.reduce((zbir, s) => zbir + s.cena, 0)
  }

  return { dodaj, ukupno }
})()

korpa.dodaj("Paket 8 termina", 12000)
console.log(korpa.ukupno())
`,
      tests: [
        {
          name: "korpa.dodaj i korpa.ukupno rade",
          code: 'korpa.dodaj("Pojedinačni termin", 1500)\nexpect(korpa.ukupno()).toBe(13500)',
        },
        { name: "stavke se ne vide izvan korpe", code: 'expect(typeof stavke).toBe("undefined")' },
        { name: "korpa ne izlaže stavke", code: "expect(korpa.stavke).toBe(undefined)" },
        {
          name: "korpa izlaže tačno dodaj i ukupno",
          code: 'expect(Object.keys(korpa).sort()).toEqual(["dodaj", "ukupno"])',
        },
      ],
      hints: [
        "Premesti `stavke`, `dodaj` i `ukupno` **unutar** arrow funkcije `(() => { ... })`, a na kraj dodaj `()` da se odmah pozove.",
        "Funkcija na kraju vraća objekat sa onim što treba da bude javno: `return { dodaj, ukupno }`. To je skraćeno od `{ dodaj: dodaj, ukupno: ukupno }`.",
        "Obriši staru liniju `const korpa = { dodaj, ukupno, stavke }`, jer sad `korpa` dobija ono što IIFE vrati.",
      ],
      explanation:
        "`dodaj` i `ukupno` i dalje vide `stavke`, jer su napravljene unutar iste funkcije (unutrašnje vidi spoljašnje). Spolja se do `stavke` ne može. Fajl sa `export` radi isto, samo bez umotavanja: sve bez `export` je automatski privatno.",
    },
    {
      kind: "quiz",
      id: "js-moduli-quiz",
      questions: [
        {
          q: "Fajl `Chat.tsx` ima `export default function Chat(...)`. Kako se ispravno uvozi?",
          options: [
            "`import { Chat } from \"./Chat\"`",
            "`import Chat from \"./Chat\"`",
            "`import default Chat from \"./Chat\"`",
            "`import * from \"./Chat\"`",
          ],
          answer: 1,
          why: "Default export se uvozi bez vitičastih zagrada, a ime je proizvoljno. Zagrade bi značile da se traži named export koji se zove `Chat`, a takvog nema.",
        },
        {
          q: "U `date.ts` piše `export const formatTime = ...`. Šta je ispravno?",
          options: [
            "`import formatTime from \"./date\"`",
            "`import { formatTime } from \"./date\"`",
            "`import { formatTime } from \"./date.ts.js\"`",
            "`require formatTime from \"./date\"`",
          ],
          answer: 1,
          why: "Named export se uvozi u vitičastim zagradama, tačno pod istim imenom. Ekstenzija fajla se ne piše.",
        },
        {
          q: "Šta znači `@/` u `import { api } from '@/lib/api'`?",
          options: [
            "Paket sa npm-a koji se zove `@`",
            "Prečica za folder `src`, definisana u `tsconfig.json`",
            "Folder iznad trenutnog",
            "Fajl na serveru",
          ],
          answer: 1,
          why: "To je alias iz `paths` u `tsconfig.json` (i u konfiguraciji alata za build). Štedi te od `../../../` putanja.",
        },
        {
          q: "Šta se desi sa `import type { Booking } from '@/types'` kad se projekat build-uje?",
          options: [
            "Uvozi se kao i svaki drugi kod",
            "Linija se briše, jer tipovi ne postoje u JavaScriptu",
            "Pravi grešku u browseru",
            "Pretvara se u `require`",
          ],
          answer: 1,
          why: "Tipovi služe samo za proveru pre pokretanja. U JavaScript koji ide u browser ne ulazi ništa od toga.",
        },
        {
          q: "Odakle dolazi `import { create } from 'zustand'`?",
          options: [
            "Iz fajla `zustand.ts` u istom folderu",
            "Iz paketa u `node_modules`, instaliranog preko npm-a",
            "Iz browsera, ugrađeno je",
            "Iz `src/zustand/index.ts`",
          ],
          answer: 1,
          why: "Putanja bez `./`, `../` ili aliasa znači paket. Instaliran je sa `npm install zustand` i upisan u `package.json`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-js-moduli-1",
      front: "Named vs default export: kako se uvoze?",
      back: "Named: `import { ime } from \"./fajl\"` (tačno ime, u zagradama). Default: `import BiloKoje from \"./fajl\"` (bez zagrada, ime biraš).",
    },
    {
      id: "fc-js-moduli-2",
      front: "Šta se dešava sa svim što u fajlu nema `export`?",
      back: "Ostaje privatno za taj fajl. Drugi fajlovi ne mogu da ga koriste.",
    },
    {
      id: "fc-js-moduli-3",
      front: "Šta znači `@/` u putanji importa?",
      back: "Alias za `src/`, definisan u `tsconfig.json` pod `paths`. `@/lib/date` je `src/lib/date.ts`.",
    },
    {
      id: "fc-js-moduli-4",
      front: "Čemu služi `import type`?",
      back: "Uvozi samo tip. Pri build-u se briše, jer tipovi ne postoje u JavaScriptu.",
    },
    {
      id: "fc-js-moduli-5",
      front: "Kako razlikuješ import tvog fajla od paketa?",
      back: "Tvoj fajl: putanja počinje sa `./`, `../` ili aliasom kao `@/`. Paket: samo ime (`\"react\"`, `\"zustand\"`), dolazi iz `node_modules`.",
    },
  ],
};

export default lesson;
