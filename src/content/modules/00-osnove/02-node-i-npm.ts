import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "node-i-npm",
  title: "Node.js, npm i package.json",
  summary:
    "Šta je Node.js, kako npm instalira pakete, šta piše u package.json i zašto `npm run dev` uopšte radi.",
  minutes: 18,
  projects: ["PlazaHome", "Looply", "ReformStudio"],
  blocks: [
    {
      kind: "prose",
      md: `JavaScript je nastao kao jezik **za browser**: dugmad, forme, animacije na stranici. Dugo je mogao da radi samo tamo.

**Node.js** je program koji JavaScript izvršava **van browsera**, direktno na tvom računaru. Zahvaljujući njemu JavaScript može da čita fajlove, pokreće servere i pravi build tvog sajta.

Zašto je to važno tebi? Zato što su skoro svi alati koje koristiš napisani u JavaScriptu i pokreće ih Node: **Vite** (ReformStudio, milenaspajic), **Next.js** (PlazaHome, Pasted, my-portfolio), **TypeScript** kompajler \`tsc\` (izuzetak je TypeScript 7 u ReformStudiju i vaky-content-u: prepisan je u Go, pa ga Node samo pokrene), **ESLint**, **Expo** (Looply), **Remotion** (vaky-content). Kad otkucaš \`npm run dev\`, zapravo Node pokreće jedan od tih alata.`,
    },
    {
      kind: "callout",
      tone: "info",
      title: "Gde se šta izvršava",
      md: `Kod iz \`src/\` na kraju radi **u browseru** (ili na telefonu, kod Looply-ja). Alati koji taj kod pakuju, proveravaju i serviraju rade **u Node-u**, na tvom računaru. A Firebase Functions u \`ReformStudio/functions\` rade u Node-u **na Google-ovom serveru**. Isti jezik, tri različita mesta.`,
    },
    {
      kind: "prose",
      md: `### npm: prodavnica paketa

Kad instaliraš Node, dobiješ i **npm** (*Node Package Manager*). npm radi dve stvari:

1. **Instalira pakete**: tuđi gotov kod koji koristiš u projektu (React, Firebase, date-fns, zustand...). Paketi se preuzimaju sa sajta npmjs.com.
2. **Pokreće skripte**: kratke komande zapisane u \`package.json\`, kao \`dev\` i \`build\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Spisak za kupovinu, ostava i fiskalni račun",
      md: `- **\`package.json\`** je spisak za kupovinu: "React 19, može i noviji 19.x". Pišeš ga ti (ili AI).
- **\`node_modules/\`** je ostava u koju npm istovari sve što je kupio. Ogromna je i ne diraš je rukom.
- **\`package-lock.json\`** je fiskalni račun: tačno koja verzija svakog paketa je kupljena, do poslednje cifre. Po njemu se ista kupovina može ponoviti na drugom računaru.`,
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "package.json",
      lang: "json",
      startLine: 1,
      intro:
        "Ovo je ceo `package.json` sajta PlazaHome. Mali je, pa je savršen za prvo čitanje.",
      code: `{
  "name": "plaza-home",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint",
    "prebuild": "node scripts/media.mjs",
    "postbuild": "node scripts/csp.mjs",
    "typecheck": "tsc --noEmit",
    "media": "node scripts/media.mjs",
    "video": "sh scripts/video.sh",
    "preview": "npx wrangler@4 pages dev out",
    "predev": "node scripts/media.mjs",
    "font": "sh scripts/font.sh"
  },
  "dependencies": {
    "next": "16.4.0",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.0",
    "sharp": "^0.35.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
`,
      steps: [
        {
          lines: [1, 4],
          md: "Ceo fajl je jedan **JSON objekat**: parovi `\"ključ\": vrednost` u vitičastim zagradama. `name` i `version` opisuju projekat. `\"private\": true` je osigurač: npm odbija da ovaj projekat objavi na npmjs.com, jer je to sajt, a ne biblioteka za druge.",
        },
        {
          lines: [5, 8],
          md: "**`scripts`** su prečice. Levo je ime, desno prava komanda. `npm run dev` pokreće `next dev`, a `npm run build` pokreće `next build`. Prednost je što ne moraš da pamtiš prave komande (kod ReformStudija su dugačke), i što svi u timu kucaju isto.",
        },
        {
          lines: [9, 10],
          md: "Posebna pravila za imena: npm **sam** pokrene `prebuild` pre `build`, i `postbuild` posle njega. Zato `npm run build` ovde zapravo uradi tri stvari: optimizuje slike (`scripts/media.mjs`), napravi sajt i na kraju upiše sigurnosna zaglavlja (`scripts/csp.mjs`). Isto važi za `predev` u liniji 15.",
        },
        {
          lines: 14,
          md: "`npx` pokreće alat iz npm-a **bez trajne instalacije** u projekat. `wrangler@4` znači \"Cloudflare-ov alat wrangler, verzija 4\". npx ga preuzme ako treba, pokrene i ne dira `package.json`.",
        },
        {
          lines: [18, 22],
          md: "**`dependencies`** su paketi koji su potrebni da sajt **radi**: Next.js i React. Njihov kod završi u onome što posetilac preuzme. Primeti da ih ima samo tri.",
        },
        {
          lines: [23, 33],
          md: "**`devDependencies`** su alati potrebni samo **dok razvijaš**: TypeScript, ESLint, Tailwind, `sharp` (koji koristi `media.mjs` za slike) i `@types/*` paketi sa tipovima. Posetilac sajta ne dobija nijedan od njih. Kad instaliraš paket sa `npm install -D ime`, on ode ovde.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "`npm run dev`, ne `npm dev`",
      md: `Skripte se pokreću sa **\`npm run ime\`**. Kucanje \`npm dev\` ili \`npm build\` daje grešku, jer npm misli da tražiš njegovu ugrađenu komandu. Izuzeci su \`npm start\` i \`npm test\` (i retko korišćeni \`npm stop\` i \`npm restart\`), koji rade i bez \`run\`. Looply zato koristi \`npm start\` (to je \`expo start\`).`,
    },
    {
      kind: "prose",
      md: `### Brojevi verzija: šta znače \`^\` i \`~\`

Verzija ima tri broja: **\`MAJOR.MINOR.PATCH\`**, na primer \`5.0.15\`.

- **PATCH** (poslednji broj) raste kad se poprave bagovi. Bezbedno.
- **MINOR** (srednji) raste kad se doda nešto novo, a staro i dalje radi.
- **MAJOR** (prvi) raste kad se nešto **pokvari** unazad: menja se način korišćenja.

Znak ispred broja kaže npm-u koliko slobode ima pri instalaciji. Pogledaj Looply, koji koristi sve tri varijante:`,
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "package.json",
      lang: "json",
      startLine: 20,
      code: `    "i18next": "^26.4.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-i18next": "^17.0.17",
    "react-native": "0.86.3",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@types/jest": "29.5.14",
    "@types/react": "~19.2.2",
    "eslint": "^9.39.5",
    "eslint-config-expo": "~57.0.2",
    "jest": "~29.7.0",
    "jest-expo": "~57.0.6",
    "simple-icons": "^16.35.0",
    "typescript": "~6.0.3"
  },
`,
      steps: [
        {
          lines: 1,
          md: "**`^` (caret)**: \"ova verzija ili bilo koja novija **sa istim prvim brojem**\". `^26.4.6` prihvata `26.5.0` i `26.9.3`, ali ne `27.0.0`. Ovo je npm-ov default kad instaliraš paket.",
        },
        {
          lines: [2, 3],
          md: "**Bez znaka** znači tačno ta verzija i nijedna druga. React (i `react-native` dve linije niže) mora da se poklopi do poslednje cifre sa verzijom Expo-a, pa ga Expo zaključava ovako.",
        },
        {
          lines: [6, 7],
          md: "**`~` (tilda)**: strože od `^`. Prihvata samo nove **PATCH** verzije: `~5.7.0` dozvoljava `5.7.4`, ali ne `5.8.0`. Expo (\`npx expo install\`) ovako zapisuje biblioteke iz svog SDK-a, jer su testirane baš sa tom minor verzijom.",
        },
        {
          lines: [11, 19],
          md: "Isti sistem važi i za `devDependencies`. Pravila su ista, samo je sadržaj drugačiji: alati za testove (`jest`), proveru koda (`eslint`) i tipove (`typescript`, `@types/*`).",
        },
      ],
    },
    {
      kind: "prose",
      md: `### \`node_modules\` i \`package-lock.json\`

ReformStudio u \`package.json\` ima oko 30 paketa, a \`node_modules\` ima preko **700 foldera**. Kako? Svaki paket ima svoje zavisnosti, koje imaju svoje zavisnosti... npm instalira celo drvo.

Zato važe dva pravila:

- **\`node_modules\` nikad ne ide u git.** Ogroman je i uvek se može ponovo napraviti komandom \`npm install\`. Videćeš ga u svakom \`.gitignore\` fajlu.
- **\`package-lock.json\` uvek ide u git.** U njemu su zapisane tačne verzije svih 1100+ paketa. Kad Vercel pravi build tvog sajta ili Firebase instalira pakete za Functions, instaliraju baš te verzije, pa sve radi isto kao kod tebe.`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Kad ništa ne pomaže",
      md: `Ako projekat posle nekog apdejta počne čudno da se ponaša, klasičan lek je: obriši \`node_modules\` i ponovo instaliraj. U terminalu: \`rm -rf node_modules\`, pa \`npm install\`. Ovo je jedno od retkih mesta gde je \`rm -rf\` bezbedan, jer se folder vraća iz \`package.json\` i \`package-lock.json\`.`,
    },
    {
      kind: "terminal",
      id: "osnove-npm-sesija",
      title: "Dan u životu npm-a",
      intro:
        "Upravo je kloniran ReformStudio na nov laptop. Nema još `node_modules`. Dovedi ga do pokrenutog projekta.",
      cwd: "~/ReformStudio",
      steps: [
        {
          task: "Proveri da li je Node instaliran i koja je verzija.",
          accept: ["node\\s+(-v|--version)"],
          output: "v24.16.0",
          hint: "`node -v` (ili `node --version`).",
        },
        {
          task: "Instaliraj sve pakete iz `package.json`.",
          accept: ["npm\\s+(install|i|ci)"],
          output: `added 1156 packages, and audited 1157 packages in 21s

214 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities`,
          hint: "`npm install` (ili kraće `npm i`). Bez imena paketa, instalira sve sa spiska.",
        },
        {
          task: "Pokreni razvojni server.",
          accept: ["npm\\s+run\\s+dev"],
          output: `> reform-studio@0.1.0 dev
> vite

  VITE v8.3.2  ready in 412 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`,
          hint: "`npm run dev`. Primeti da npm prvo ispiše koju komandu zapravo pokreće (`> vite`).",
        },
        {
          task: "Zamisli da je server ugašen sa Ctrl + C. Sad napravi produkcijski build.",
          accept: ["npm\\s+run\\s+build"],
          output: `> reform-studio@0.1.0 build
> tsc -b && vite build

vite v8.3.2 building client environment for production...
✓ 1843 modules transformed.
dist/index.html                   2.31 kB │ gzip:   1.02 kB
dist/assets/index-B7xQ2kLm.css   48.90 kB │ gzip:   9.12 kB
dist/assets/index-Cz81fJqP.js   612.44 kB │ gzip: 179.03 kB
✓ built in 3.84s`,
          hint: "`npm run build`. Rezultat završi u folderu `dist/`, i to je ono što ide na Firebase Hosting.",
        },
        {
          task: "Dodaj u projekat paket `clsx` (mala biblioteka za CSS klase). Treba aplikaciji da radi, pa ide u obične `dependencies`.",
          accept: ["npm\\s+(install|i|add)\\s+clsx"],
          output: `added 1 package, and audited 1158 packages in 2s

214 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities`,
          hint: "`npm install clsx`. npm ga doda i u `package.json`, i u `package-lock.json`, i u `node_modules`.",
        },
        {
          task: "Dodaj alat `prettier` (formatira kod), ali kao **dev** zavisnost.",
          accept: [
            "npm\\s+(install|i|add)\\s+(-D|--save-dev)\\s+prettier",
            "npm\\s+(install|i|add)\\s+prettier\\s+(-D|--save-dev)",
          ],
          output: `added 1 package, and audited 1159 packages in 2s

215 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities`,
          hint: "Opcija `-D` znači *dev*: `npm install -D prettier`.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "A šta je onda `npx`?",
      md: `\`npx\` pokreće komandu iz nekog paketa. Ako je paket već u \`node_modules\` (kao \`tsc\` iz \`typescript\`), \`npx tsc --noEmit\` koristi baš tu verziju. Ako nije, npx ga privremeno preuzme. Zato \`npx create-next-app\` radi i bez ikakve instalacije unapred, a \`npx expo install\` u Looply-ju koristi \`expo\` koji je već u \`node_modules\`.`,
    },
    {
      kind: "prose",
      md: `### Tvoj red

\`package.json\` je obična JSON struktura, a JavaScript je odlično čita: \`dependencies\` je samo objekat čiji su ključevi imena paketa. \`Object.keys(obj)\` vraća niz tih ključeva, pa \`Object.keys(pkg.dependencies).length\` daje broj paketa.`,
    },
    {
      kind: "exercise",
      id: "osnove-npm-1",
      title: "Prebroj zavisnosti",
      lang: "js",
      prompt: `Napiši funkciju \`brojZavisnosti(pkg)\` koja prima objekat sličan \`package.json\`-u i vraća objekat \`{ obicne, dev }\` sa brojem paketa u \`dependencies\` i u \`devDependencies\`.

Pazi: neki projekti uopšte nemaju \`devDependencies\` (ili ni \`dependencies\`). Tada je broj \`0\`, a funkcija ne sme da pukne.`,
      starter: `function brojZavisnosti(pkg) {
  const obicne = Object.keys(pkg.dependencies).length
  const dev = 0 // popravi ovo
  return { obicne, dev }
}

const plaza = {
  name: "plaza-home",
  dependencies: { next: "16.4.0", react: "19.3.0", "react-dom": "19.3.0" },
  devDependencies: { eslint: "^9", typescript: "^5", tailwindcss: "^4" },
}
console.log(brojZavisnosti(plaza))
`,
      solution: `function brojZavisnosti(pkg) {
  const obicne = Object.keys(pkg.dependencies ?? {}).length
  const dev = Object.keys(pkg.devDependencies ?? {}).length
  return { obicne, dev }
}

const plaza = {
  name: "plaza-home",
  dependencies: { next: "16.4.0", react: "19.3.0", "react-dom": "19.3.0" },
  devDependencies: { eslint: "^9", typescript: "^5", tailwindcss: "^4" },
}
console.log(brojZavisnosti(plaza))
`,
      tests: [
        {
          name: "PlazaHome: 3 obične i 3 dev",
          code: "expect(brojZavisnosti(plaza)).toEqual({ obicne: 3, dev: 3 })",
        },
        {
          name: "radi i bez devDependencies",
          code: 'expect(brojZavisnosti({ name: "x", dependencies: { react: "19.3.0", zustand: "^5.0.15" } })).toEqual({ obicne: 2, dev: 0 })',
        },
        {
          name: "radi i za potpuno prazan projekat",
          code: 'expect(brojZavisnosti({ name: "prazan" })).toEqual({ obicne: 0, dev: 0 })',
        },
      ],
      hints: [
        "Za `dev` uradi isto što i za `obicne`, samo sa `pkg.devDependencies`.",
        "`Object.keys(undefined)` baca grešku. Treba ti zamena kad polje ne postoji: `pkg.devDependencies ?? {}`.",
        "Operator `??` vraća desnu stranu ako je leva `undefined` ili `null`. Primeni ga na oba polja.",
      ],
      explanation:
        "`??` (*nullish coalescing*) je standardan način da se kaže \"ako ovo ne postoji, uzmi podrazumevanu vrednost\". Podaci spolja (fajlovi, API, baza) često nemaju sva polja, pa ćeš ga sretati svuda.",
    },
    {
      kind: "exercise",
      id: "osnove-npm-2",
      title: "Svi paketi, po abecedi",
      lang: "js",
      prompt: `Napiši funkciju \`sviPaketi(pkg)\` koja vraća **niz imena** svih paketa, i iz \`dependencies\` i iz \`devDependencies\`, **sortiran po abecedi**.

Spajanje dva niza: \`[...a, ...b]\`. Sortiranje: \`niz.sort()\`.`,
      starter: `function sviPaketi(pkg) {
  return Object.keys(pkg.dependencies ?? {})
}

const reform = {
  dependencies: { zustand: "^5.0.15", firebase: "^12.19.0", "date-fns": "^4.4.0" },
  devDependencies: { vite: "^8.3.1", typescript: "^7.0.2" },
}
console.log(sviPaketi(reform))
`,
      solution: `function sviPaketi(pkg) {
  const obicne = Object.keys(pkg.dependencies ?? {})
  const dev = Object.keys(pkg.devDependencies ?? {})
  return [...obicne, ...dev].sort()
}

const reform = {
  dependencies: { zustand: "^5.0.15", firebase: "^12.19.0", "date-fns": "^4.4.0" },
  devDependencies: { vite: "^8.3.1", typescript: "^7.0.2" },
}
console.log(sviPaketi(reform))
`,
      tests: [
        {
          name: "vraća svih 5 paketa ReformStudija, sortirano",
          code: 'expect(sviPaketi(reform)).toEqual(["date-fns", "firebase", "typescript", "vite", "zustand"])',
        },
        {
          name: "radi i kad postoje samo devDependencies",
          code: 'expect(sviPaketi({ devDependencies: { tsx: "^4", eslint: "^9" } })).toEqual(["eslint", "tsx"])',
        },
        {
          name: "prazan projekat daje prazan niz",
          code: "expect(sviPaketi({})).toEqual([])",
        },
      ],
      hints: [
        "Napravi dva niza: jedan od `dependencies`, drugi od `devDependencies` (ne zaboravi `?? {}`).",
        "Spoji ih sa `[...obicne, ...dev]`, pa na rezultat pozovi `.sort()`.",
      ],
      explanation:
        "`...` (*spread*) \"raspakuje\" niz unutar novog niza. `.sort()` bez argumenata sortira stringove po abecedi, što je ovde baš ono što treba. (Za brojeve ne radi kako očekuješ, ali o tome u modulu JavaScript.)",
    },
    {
      kind: "quiz",
      id: "osnove-npm-quiz",
      questions: [
        {
          q: "Šta je Node.js?",
          options: [
            "Biblioteka za React komponente",
            "Program koji izvršava JavaScript van browsera",
            "Drugi naziv za npm",
            "Baza podataka",
          ],
          answer: 1,
          why: "Node je *runtime*: okruženje u kom JavaScript radi na računaru ili serveru. npm dolazi uz njega kao menadžer paketa.",
        },
        {
          q: "Paket `sharp` u PlazaHome služi samo skripti koja pre build-a optimizuje slike. Gde treba da stoji?",
          options: [
            "`dependencies`",
            "`devDependencies`",
            "`scripts`",
            "Nigde, samo u `node_modules`",
          ],
          answer: 1,
          why: "Posetilac sajta nikad ne pokreće `sharp`; koristi ga samo alat tokom build-a. Takve stvari idu u `devDependencies`.",
        },
        {
          q: "U `package.json` piše `\"zustand\": \"^5.0.15\"`. Koju verziju npm **ne sme** da instalira?",
          options: ["`5.0.15`", "`5.0.20`", "`5.3.0`", "`6.0.0`"],
          answer: 3,
          why: "`^` dozvoljava sve novije verzije sa istim prvim (MAJOR) brojem. `6.0.0` je novi MAJOR i može da pokvari tvoj kod.",
        },
        {
          q: "Ovo je build skripta ReformStudija. Šta se desi ako `tsc -b` pronađe grešku u tipovima?",
          code: `"build": "tsc -b && vite build"`,
          codeLang: "json",
          options: [
            "`vite build` se ipak pokrene",
            "`vite build` se ne pokrene i build ne uspe",
            "TypeScript sam popravi grešku",
            "npm preskoči `tsc` i nastavi",
          ],
          answer: 1,
          why: "`&&` znači \"pokreni sledeće **samo ako je prethodno uspelo**\". Tako pokvaren kod ne može da stigne do produkcije.",
        },
        {
          q: "Šta od ovoga **treba** da bude u git-u?",
          options: [
            "`node_modules/`",
            "`package-lock.json`",
            "Oba",
            "Nijedno",
          ],
          answer: 1,
          why: "Lock fajl čuva tačne verzije, pa svi (i Vercel, i Firebase) instaliraju isto. `node_modules` se uvek može ponovo napraviti sa `npm install`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-osnove-npm-1",
      front: "Razlika između `dependencies` i `devDependencies`?",
      back: "`dependencies` trebaju aplikaciji da radi (React, Firebase). `devDependencies` trebaju samo tokom razvoja (TypeScript, ESLint, Vite). Dev paket se dodaje sa `npm install -D`.",
    },
    {
      id: "fc-osnove-npm-2",
      front: "Šta znače `^5.0.15` i `~5.7.0`?",
      back: "`^` dozvoljava novije MINOR i PATCH verzije (5.x.x). `~` dozvoljava samo nove PATCH verzije (5.7.x).",
    },
    {
      id: "fc-osnove-npm-3",
      front: "Čemu služi `package-lock.json`?",
      back: "Zapisuje tačne verzije svih instaliranih paketa (i njihovih zavisnosti), da bi instalacija bila ista na svakom računaru. Ide u git.",
    },
    {
      id: "fc-osnove-npm-4",
      front: "Šta su `prebuild` i `postbuild` skripte?",
      back: "npm ih sam pokreće pre i posle `npm run build`. Isto važi za bilo koje ime: `predev`, `posttest`...",
    },
    {
      id: "fc-osnove-npm-5",
      front: "Šta radi `npx`?",
      back: "Pokreće komandu iz npm paketa bez dodavanja u projekat. Koristi lokalnu verziju ako postoji, inače je privremeno preuzme.",
    },
  ],
};

export default lesson;
