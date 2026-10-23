import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "anatomija-projekta",
  title: "Anatomija projekta: šta je koji fajl",
  summary:
    "Šta je svaki fajl i folder u korenu Next.js i Vite projekta, koje konfiguracije čitaš, a koje fajlove nikad ne diraš rukom.",
  minutes: 20,
  projects: ["PlazaHome", "ReformStudio", "my-portfolio"],
  blocks: [
    {
      kind: "prose",
      md: `Kad otvoriš koren PlazaHome-a u editoru, dočeka te dvadesetak fajlova i foldera. Na prvi pogled haos. Ali skoro svi spadaju u jednu od pet grupa:

1. **Tvoj kod**: \`src/\`, \`public/\`, \`scripts/\`
2. **Paketi**: \`package.json\`, \`package-lock.json\`, \`node_modules/\`
3. **Podešavanja alata**: \`tsconfig.json\`, \`next.config.ts\`, \`vite.config.ts\`, \`eslint.config.mjs\`
4. **Podešavanja objave** (*deploy*): \`vercel.json\`, \`firebase.json\`, \`wrangler.jsonc\`
5. **Dokumentacija i uputstva**: \`README.md\`, \`AGENTS.md\`, \`CLAUDE.md\`

Plus šesta, posebna grupa: **generisani fajlovi** (\`.next/\`, \`out/\`, \`dist/\`) koje prave alati, a ti ih nikad ne menjaš.`,
    },
    {
      kind: "code",
      lang: "text",
      filename: "PlazaHome/",
      code: `PlazaHome/
├── src/                 ← tvoj kod
│   ├── app/             ← stranice: svaki folder je jedna adresa sajta
│   ├── components/      ← delovi interfejsa (header, footer, forma)
│   ├── content/         ← tekstovi i podaci (proizvodi, radovi, klijenti)
│   └── lib/             ← pomoćne funkcije
├── public/              ← fajlovi koji idu na sajt takvi kakvi jesu
├── scripts/             ← pomoćne skripte (slike, video, font, CSP)
├── functions/           ← serverski kod za kontakt formu (Cloudflare)
├── node_modules/        ← instalirani paketi            (ne diraj)
├── .next/  out/         ← rezultat build-a              (ne diraj)
├── package.json         ← spisak paketa i skripti
├── package-lock.json    ← tačne verzije paketa           (pravi ga npm)
├── tsconfig.json        ← podešavanja TypeScripta
├── next.config.ts       ← podešavanja Next.js-a
├── eslint.config.mjs    ← pravila za proveru koda
├── next-env.d.ts        ← tipovi za Next                 (pravi ga Next)
├── vercel.json          ← kako Vercel pravi i servira sajt
├── .gitignore           ← šta git ne prati
├── .env.local           ← tajne i lokalna podešavanja    (nije u git-u)
├── README.md            ← uputstvo za ljude
└── AGENTS.md            ← uputstvo za AI asistente`,
      caption:
        "Koren PlazaHome-a, grupisan po ulozi. Strelice su komentari, nisu deo imena.",
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Projekat je restoran",
      md: `- \`src/\` je **kuhinja**: tu se pravi sve što gost dobije.
- \`public/\` je **izlog**: stvari koje se pokazuju onakve kakve jesu (logo, slike, favicon).
- \`node_modules/\` je **magacin** sa namirnicama od dobavljača. Ne kuvaš u magacinu.
- Konfiguracioni fajlovi su **kućna pravila**: kako se šta pravi, koja je temperatura rerne.
- \`README.md\` i \`AGENTS.md\` su **uputstvo za novog radnika**: jedno za ljude, drugo za AI.
- \`.next/\` i \`out/\` su **tanjiri spremni za iznošenje**. Niko ne prepravlja tanjir; prepravi se recept i skuva ponovo.`,
    },
    {
      kind: "prose",
      md: `### \`src/\` i \`public/\`

U Next.js-u (App Router) folder **\`src/app/\` je mapa sajta**. Svaki folder sa fajlom \`page.tsx\` postaje jedna adresa:

- \`src/app/page.tsx\` → \`/\` (početna)
- \`src/app/kontakt/page.tsx\` → \`/kontakt\`
- \`src/app/o-nama/page.tsx\` → \`/o-nama\`

\`layout.tsx\` je okvir oko svih stranica (header, footer, fontovi). Ostali folderi u \`src/\` (\`components\`, \`content\`, \`lib\`) su tvoja organizacija, Next za njih ne mari.

**\`public/\`** je drugačiji: fajl \`public/favicon.ico\` se na sajtu servira na adresi \`/favicon.ico\`, bez ikakve obrade. Tu idu ikonice, slike za deljenje (\`og.jpg\`) i video.`,
    },
    {
      kind: "quiz",
      id: "osnove-anatomija-quiz-1",
      title: "Brza provera: gde šta stoji",
      questions: [
        {
          q: "Treba ti nova stranica `/cenovnik` na PlazaHome sajtu. Gde je praviš?",
          options: [
            "`public/cenovnik.html`",
            "`src/app/cenovnik/page.tsx`",
            "`src/components/cenovnik.tsx`",
            "U `next.config.ts`",
          ],
          answer: 1,
          why: "U App Routeru folder unutar `src/app/` sa fajlom `page.tsx` postaje adresa. Komponente iz `components/` se samo koriste na stranicama, ne postaju adrese.",
        },
        {
          q: "Gde ide `logo.svg` koji treba da bude dostupan na adresi `/logo.svg`?",
          options: ["`src/app/`", "`node_modules/`", "`public/`", "`out/`"],
          answer: 2,
          why: "Sve iz `public/` se servira tačno onako kako jeste, sa istom putanjom. `out/` bi radilo samo do sledećeg build-a, koji ga pravi iznova.",
        },
        {
          q: "U koju grupu spada `eslint.config.mjs`?",
          options: [
            "Tvoj kod",
            "Podešavanja alata",
            "Podešavanja objave",
            "Generisani fajlovi",
          ],
          answer: 1,
          why: "ESLint je alat koji proverava kod (nekorišćene promenljive, opasne obrasce). Njegov config kaže koja pravila važe. Na sajtu se ne pojavljuje.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Podešavanja alata

Svaki alat čita svoj fajl iz korena projekta. Ime fajla je dogovor: Next traži baš \`next.config.ts\`, Vite baš \`vite.config.ts\`, TypeScript baš \`tsconfig.json\`. Zato ti fajlovi ne smeju da se preimenuju ili premeste u \`src/\`.

Pogledajmo kako izgleda podešavanje Next-a u PlazaHome-u:`,
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "next.config.ts",
      lang: "ts",
      startLine: 1,
      code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statički sajt bez servera: \`next build\` pravi \`out/\` koji ide na Cloudflare Pages.
  output: "export",
  // Slike se optimizuju unaprijed skriptom \`scripts/media.mjs\`, ne kroz next/image.
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
`,
      steps: [
        {
          lines: [1, 3],
          md: "Config je **običan TypeScript fajl**. `NextConfig` je tip koji Next daje, pa editor zna koja podešavanja postoje i podvuče grešku ako napišeš nešto pogrešno.",
        },
        {
          lines: [4, 5],
          md: "`output: \"export\"` je najvažnija odluka u ovom projektu: build ne pravi server, nego gomilu gotovih HTML fajlova u folderu `out/`. Zato sajt može da stoji na Cloudflare Pages kao statični fajlovi. Komentar iznad objašnjava **zašto**, što je navika koju vredi preuzeti.",
        },
        {
          lines: [6, 8],
          md: "Statički sajt nema server koji bi u letu smanjivao slike, pa je ugrađena optimizacija isključena. Posao radi `scripts/media.mjs`, koji se (sećaš se `prebuild` iz lekcije o npm-u) pokreće pre svakog build-a. `poweredByHeader: false` sklanja zaglavlje koje svetu javlja da sajt radi na Next.js-u.",
        },
        {
          lines: [9, 16],
          md: "**Turbopack** je alat koji Next koristi da spakuje kod. Ovo pravilo mu kaže: svaki `.css` fajl provuci kroz Tailwind pre nego što ga ubaciš u stranicu.",
        },
        {
          lines: 19,
          md: "`export default` predaje objekat Next-u. Bez ovog reda Next ne bi video nijedno podešavanje.",
        },
      ],
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "tsconfig.json",
      lang: "json",
      startLine: 1,
      intro:
        "`tsconfig.json` kaže TypeScriptu koliko strogo da proverava i kako da razume putanje. Ovaj je skoro isti u svim tvojim Next projektima.",
      code: `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
`,
      steps: [
        {
          lines: [3, 8],
          md: "`target` je verzija JavaScripta koju kod sme da koristi, a `lib` kaže koji su ugrađeni API-ji dostupni. `\"dom\"` znači: postoje `document`, `window` i ostalo iz browsera.",
        },
        {
          lines: 11,
          md: "`\"strict\": true` uključuje sve stroge provere, na primer zabranu parametara bez tipa. Svi tvoji projekti ga imaju, i tako treba.",
        },
        {
          lines: 12,
          md: "`\"noEmit\": true`: TypeScript ovde **samo proverava**, ne pravi `.js` fajlove. Pretvaranje u JavaScript radi Next (odnosno Turbopack). Zato skripta `typecheck` pokreće `tsc --noEmit`.",
        },
        {
          lines: 18,
          md: "`\"jsx\": \"react-jsx\"` dozvoljava `<div>` i komponente unutar `.tsx` fajlova.",
        },
        {
          lines: [25, 29],
          md: "**`paths`** pravi prečicu: `@/` znači `./src/`. Zato u kodu piše `import { Cta } from \"@/components/cta\"` umesto `\"../../components/cta\"`. Prečica radi bez obzira koliko je duboko fajl koji uvozi.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Vite projekat: ReformStudio

ReformStudio nije Next, nego **Vite + React**. Koren izgleda slično, uz nekoliko razlika koje vredi znati:

- **\`index.html\` je u korenu** i on je ulazna tačka. Vite kreće od njega, a on učitava \`/src/main.tsx\`. U Next-u \`index.html\` ne postoji, jer Next sam pravi HTML.
- **\`vite.config.ts\`** umesto \`next.config.ts\`.
- **Više \`tsconfig\` fajlova**: \`tsconfig.json\` samo pokazuje na \`tsconfig.app.json\` (aplikacija), \`tsconfig.node.json\` (config fajlovi), \`tsconfig.sw.json\` (service worker) i \`tsconfig.tests.json\`. Svaki deo koda radi u drugačijem okruženju, pa dobija svoja pravila.
- **\`functions/\`** je **zaseban projekat** unutar projekta: ima svoj \`package.json\`, svoj \`node_modules\` i svoj \`tsconfig.json\`. To je backend koji radi na Firebase-u.
- Build ide u **\`dist/\`**, a ne u \`.next/\` ili \`out/\`.`,
    },
    {
      kind: "code",
      lang: "html",
      filename: "ReformStudio/index.html",
      code: `  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>`,
      highlight: [2, 3],
      caption:
        "Linije 33–36 pravog fajla. Prazan `<div id=\"root\">` je mesto u koje `main.tsx` nacrta celu React aplikaciju.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "vite.config.ts",
      lang: "ts",
      startLine: 16,
      code: `export default defineConfig({
  // Verzija za prijavu grešaka (src/lib/errorReport.ts): vrijeme builda, UTC do minuta.
  define: {
    __APP_RELEASE__: JSON.stringify(new Date().toISOString().slice(0, 16)),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Kod koji aplikacija dijeli sa Cloud Functions (config, datumi, pravila, tipovi).
      '@shared': fileURLToPath(new URL('./functions/src/shared', import.meta.url)),
    },
    // functions/ ima svoj node_modules; zajednički kod u aplikaciji uzima pakete iz korijena.
    dedupe: ['date-fns', 'date-fns-tz'],
  },
  build: {
    // Firebase biblioteka je jedan fajl od ~600 kB (179 kB kroz mrežu): bez prijave i baze
    // aplikacija ništa ne prikazuje, pa bi se i podijeljena preuzimala odmah. Ime joj se mijenja
    // samo kad se apdejtuje biblioteka, pa je telefon ne preuzima pri svakoj objavi.
    chunkSizeWarningLimit: 700,
  },
  plugins: [
    react(),
    tailwindcss(),
    splash(),
`,
      steps: [
        {
          lines: 1,
          md: "`defineConfig` je funkcija koja ne radi ništa posebno osim što editoru daje tipove, isto kao `NextConfig` kod Next-a. Objekat unutar nje je ceo config.",
        },
        {
          lines: [2, 5],
          md: "`define` zamenjuje ime u kodu vrednošću **u trenutku build-a**. Svuda gde aplikacija koristi `__APP_RELEASE__`, Vite upiše datum i vreme build-a. Tako prijava greške zna iz koje verzije aplikacije je stigla.",
        },
        {
          lines: [6, 11],
          md: "Isti `@` alias kao u `tsconfig.json`, plus `@shared` koji pokazuje u `functions/src/shared`. Tako frontend i backend dele isti kod za pravila i datume. Alias mora da postoji **na oba mesta**: u `tsconfig` da bi TypeScript razumeo, i ovde da bi Vite znao gde je fajl.",
        },
        {
          lines: [15, 20],
          md: "Vite upozorava kad je neki spakovan fajl veći od 500 kB. Ovde je granica podignuta na 700, a komentar objašnjava zašto je to u redu: Firebase je velik, ali neophodan od prvog ekrana.",
        },
        {
          lines: [21, 24],
          md: "**Plugin-ovi** dodaju Vite-u sposobnosti: `react()` razume JSX, `tailwindcss()` pravi CSS iz klasa, a `splash()` je **tvoj** plugin definisan na vrhu istog fajla, koji ubacuje uvodni ekran u `index.html`.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "ESLint: lektor za kod",
      md: `\`eslint.config.mjs\` (u PlazaHome-u i my-portfolio-u; u Looply-ju \`eslint.config.js\`) podešava **ESLint**, alat koji čita kod i prijavljuje sumnjive stvari: nekorišćene promenljive, zaboravljene \`await\`, pogrešno korišćene React hook-ove. Pokreće se sa \`npm run lint\`. U PlazaHome-u je jedno pravilo namerno isključeno (\`@next/next/no-img-element\`), uz komentar zašto: slike su već optimizovane skriptom.`,
    },
    {
      kind: "prose",
      md: `### Podešavanja objave

Ovi fajlovi ne utiču na to kako kod **radi**, nego **gde i kako se objavljuje**. Svaki hosting ima svoj:

- **\`vercel.json\`** za Vercel (PlazaHome, milenaspajic)
- **\`firebase.json\`** za Firebase (ReformStudio): hosting, baza, funkcije, emulatori
- **\`wrangler.jsonc\`** za Cloudflare Workers (my-portfolio). \`.jsonc\` je JSON koji sme da ima komentare.`,
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "vercel.json",
      lang: "json",
      startLine: 1,
      code: `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "cleanUrls": true
}
`,
      steps: [
        {
          lines: 2,
          md: "`$schema` pokazuje editoru opis svih dozvoljenih polja. Rezultat: dopunjavanje i upozorenja dok kucaš, iako je ovo JSON a ne TypeScript.",
        },
        {
          lines: [3, 5],
          md: "Vercel inače sam prepozna Next i pokrene ga kao server. Ovde mu je rečeno: ne pogađaj (`framework: null`), pokreni `npm run build` i objavi samo folder `out`. To se slaže sa `output: \"export\"` iz `next.config.ts`.",
        },
        {
          lines: 6,
          md: "`cleanUrls` znači da se `/kontakt.html` servira kao `/kontakt`, bez `.html` na kraju.",
        },
      ],
    },
    {
      kind: "code",
      lang: "json",
      filename: "ReformStudio/firebase.json",
      code: `  "hosting": {
    "site": "reformfitness",
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],`,
      highlight: [3, 5],
      caption:
        "Linije 15–19. Ista ideja, drugi hosting: objavi folder `dist` (rezultat `vite build`), a **svaku** adresu (`**`) pošalji na `index.html`, jer React Router u browseru sam odlučuje koji ekran da prikaže.",
    },
    {
      kind: "prose",
      md: `### Uputstva: za ljude i za AI

**\`README.md\`** je prvi fajl koji čovek pročita kad otvori projekat (GitHub ga prikazuje odmah ispod liste fajlova). Dobar README kaže šta je projekat i kako se pokreće. PlazaHome-ov, na primer, ima odeljak "Pokretanje" sa svim npm skriptama i objašnjenjem šta koja radi.

**\`AGENTS.md\`** i **\`CLAUDE.md\`** su isto to, ali **za AI asistente**. Claude Code automatski pročita \`CLAUDE.md\` pre nego što počne da radi u projektu. Tu stoje komande, pravila pisanja koda i stvari koje AI ne bi znao sam. Evo početka \`CLAUDE.md\` iz my-portfolio-a:`,
    },
    {
      kind: "code",
      lang: "text",
      filename: "my-portfolio/CLAUDE.md",
      code: `## Coding Rules

- Think before coding.
- Prefer simple, maintainable solutions.
- Modify existing patterns instead of inventing new architecture.
- Keep files small and readable.`,
      caption:
        "Linije 5–10. Pravila koja AI čita pre svakog zadatka. Kad te AI posluša \"sam od sebe\", često je razlog baš ovaj fajl.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Ovi fajlovi su i za tebe",
      md: `PlazaHome-ov \`AGENTS.md\` je napisao sam Next.js: upozorava AI da je ova verzija Next-a novija od onoga što AI zna, i da pre pisanja koda pročita dokumentaciju iz \`node_modules/next/dist/docs/\`. To je koristan savet i za tebe: kad nešto ne radi kako tutorial kaže, proveri verziju u \`package.json\`.`,
    },
    {
      kind: "prose",
      md: `### Generisani fajlovi: gledaj, ne diraj

Neke fajlove i foldere prave alati. Ako ih menjaš rukom, izmena nestane pri sledećem pokretanju alata:

| Fajl / folder | Ko ga pravi | Kad |
|---|---|---|
| \`node_modules/\` | npm | \`npm install\` |
| \`package-lock.json\` | npm | \`npm install\` (ali **ide** u git) |
| \`.next/\` | Next | \`npm run dev\` i \`build\` |
| \`out/\` | Next (\`output: "export"\`) | \`npm run build\` |
| \`dist/\` | Vite | \`npm run build\` |
| \`tsconfig.tsbuildinfo\` | TypeScript | keš za bržu proveru |
| \`next-env.d.ts\` | Next | piše u njemu: *This file should not be edited* |

Svi osim \`package-lock.json\` stoje u \`.gitignore\`.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Popravka u pogrešnom fajlu",
      md: `Česta zamka: greška u browseru pokazuje na fajl u \`dist/\` ili \`.next/\`, ti ga popraviš tamo i sve radi... do sledećeg build-a. Popravka uvek ide u **izvor** (\`src/\`, config), nikad u rezultat. Isto važi za \`node_modules\`: tuđ paket se ne menja rukom, nego se apdejtuje ili zameni.`,
    },
    {
      kind: "exercise",
      id: "osnove-anatomija-git",
      title: "Ide li u git?",
      lang: "js",
      prompt: `Napiši funkciju \`trebaUGit(ime)\` koja za ime fajla ili foldera iz korena projekta vraća \`true\` ako treba da bude u git-u, a \`false\` ako ne treba.

**Ne idu** u git:
- generisani folderi: \`node_modules\`, \`.next\`, \`out\`, \`dist\`
- \`.DS_Store\`
- sve što se završava na \`.tsbuildinfo\`
- sve što počinje sa \`.env\`, **osim** \`.env.example\`

Sve ostalo ide. Korisno: \`niz.includes(x)\`, \`ime.startsWith("...")\`, \`ime.endsWith("...")\`.`,
      starter: `function trebaUGit(ime) {
  const generisano = ["node_modules", ".next"]
  return !generisano.includes(ime)
}

console.log(trebaUGit("package.json"), trebaUGit("node_modules"))
`,
      solution: `function trebaUGit(ime) {
  const generisano = ["node_modules", ".next", "out", "dist", ".DS_Store"]
  if (generisano.includes(ime)) return false
  if (ime.endsWith(".tsbuildinfo")) return false
  if (ime.startsWith(".env") && ime !== ".env.example") return false
  return true
}

console.log(trebaUGit("package.json"), trebaUGit("node_modules"))
`,
      tests: [
        {
          name: "izvorni i config fajlovi idu u git",
          code: 'for (const f of ["package.json", "package-lock.json", "src", "next.config.ts", "README.md", ".gitignore"]) expect(trebaUGit(f)).toBe(true)',
        },
        {
          name: "generisani folderi ne idu",
          code: 'for (const f of ["node_modules", ".next", "out", "dist"]) expect(trebaUGit(f)).toBe(false)',
        },
        {
          name: ".DS_Store i tsconfig.tsbuildinfo ne idu",
          code: 'expect(trebaUGit(".DS_Store")).toBe(false); expect(trebaUGit("tsconfig.tsbuildinfo")).toBe(false)',
        },
        {
          name: ".env.local i .env.production ne idu, .env.example ide",
          code: 'expect(trebaUGit(".env.local")).toBe(false); expect(trebaUGit(".env.production")).toBe(false); expect(trebaUGit(".env.example")).toBe(true)',
        },
      ],
      hints: [
        "Dopuni niz `generisano` sa `\"out\"`, `\"dist\"` i `\".DS_Store\"`. To rešava prva dva testa.",
        "Za `.tsbuildinfo` dodaj posebnu proveru: `if (ime.endsWith(\".tsbuildinfo\")) return false`.",
        "Za `.env`: `if (ime.startsWith(\".env\") && ime !== \".env.example\") return false`. Na kraju `return true`.",
      ],
      explanation:
        "Ovo je mali `.gitignore` napisan u JavaScriptu: lista tačnih imena, pa obrasci (`*.tsbuildinfo` je `endsWith`, `.env*` je `startsWith`), pa izuzetak (`!.env.example`). Rani `return false` čini kod čitljivim: svako pravilo je jedan red.",
    },
    {
      kind: "quiz",
      id: "osnove-anatomija-quiz-2",
      title: "Završni kviz",
      questions: [
        {
          q: "U ReformStudiju postoje i `package.json` u korenu i `functions/package.json`. Zašto dva?",
          options: [
            "Greška, treba obrisati jedan",
            "`functions/` je zaseban Node projekat (backend) sa svojim paketima",
            "Drugi je rezervna kopija",
            "Vite zahteva dva",
          ],
          answer: 1,
          why: "Firebase Functions se objavljuju odvojeno i trebaju im drugi paketi (`firebase-admin`, `nodemailer`). Zato imaju svoj `package.json` i `node_modules`.",
        },
        {
          q: "Šta je ulazna tačka Vite aplikacije?",
          options: [
            "`vite.config.ts`",
            "`package.json`",
            "`index.html` u korenu, koji učitava `src/main.tsx`",
            "`dist/index.html`",
          ],
          answer: 2,
          why: "Vite kreće od `index.html`, nalazi `<script type=\"module\" src=\"/src/main.tsx\">` i odatle prati sve `import`-e. `dist/index.html` je rezultat build-a, ne izvor.",
        },
        {
          q: "U kodu piše `import { t } from \"@/i18n\"`. Gde je definisano šta znači `@`?",
          options: [
            "U `package.json`",
            "U `tsconfig` (`paths`) i u `vite.config.ts` (`alias`)",
            "U `.gitignore`",
            "`@` je ugrađen u JavaScript",
          ],
          answer: 1,
          why: "`@` je samo dogovorena prečica za `./src`. TypeScript mora da je zna da bi proverio tipove, a Vite (ili Next) da bi zaista našao fajl.",
        },
        {
          q: "Koji fajl kaže Vercelu da objavi folder `out`?",
          options: ["`next.config.ts`", "`vercel.json`", "`tsconfig.json`", "`AGENTS.md`"],
          answer: 1,
          why: "`vercel.json` je config hostinga: komanda za build i folder koji se objavljuje. `next.config.ts` kaže Next-u da **napravi** `out`, a `vercel.json` kaže Vercelu da ga **objavi**.",
        },
        {
          q: "Čemu služi `CLAUDE.md`?",
          options: [
            "Čuva API ključ za Anthropic",
            "Uputstvo koje Claude Code čita pre rada u projektu",
            "Log razgovora sa AI-jem",
            "Config za build",
          ],
          answer: 1,
          why: "To je obična Markdown beleška za AI asistenta: komande, pravila i kontekst projekta. Ključevi nikad ne idu u nju, nego u `.env` fajlove koji nisu u git-u.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-osnove-anatomija-1",
      front: "Razlika između `src/` i `public/`?",
      back: "`src/` je kod koji alati obrađuju i pakuju. `public/` su fajlovi koji se serviraju takvi kakvi jesu, na istoj putanji (`public/og.jpg` → `/og.jpg`).",
    },
    {
      id: "fc-osnove-anatomija-2",
      front: "Kako u Next.js App Routeru nastaje stranica `/kontakt`?",
      back: "Folder `src/app/kontakt/` sa fajlom `page.tsx`. `layout.tsx` je okvir oko svih stranica.",
    },
    {
      id: "fc-osnove-anatomija-3",
      front: "Šta znači `@/` u import-ima i gde se podešava?",
      back: "Prečica za `./src/`. Podešava se u `tsconfig.json` (`paths`) i, kod Vite-a, u `vite.config.ts` (`resolve.alias`).",
    },
    {
      id: "fc-osnove-anatomija-4",
      front: "Navedi tri generisana foldera koje nikad ne menjaš rukom.",
      back: "`node_modules/` (npm), `.next/` ili `out/` (Next), `dist/` (Vite). Izmene u njima nestaju pri sledećem pokretanju alata.",
    },
    {
      id: "fc-osnove-anatomija-5",
      front: "Šta su `vercel.json`, `firebase.json` i `wrangler.jsonc`?",
      back: "Podešavanja objave za Vercel, Firebase i Cloudflare: šta se build-uje, koji folder se objavljuje, pravila za adrese i zaglavlja.",
    },
  ],
};

export default lesson;
