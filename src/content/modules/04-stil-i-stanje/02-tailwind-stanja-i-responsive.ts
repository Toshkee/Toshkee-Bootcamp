import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "tailwind-stanja-i-responsive",
  title: "Stanja, ekrani i uslovne klase",
  summary:
    "Kako klase reaguju na miš, prst i tastaturu (`hover:`, `active:`, `focus-visible:`), kako se raspored menja sa širinom ekrana i tamnom temom, i kako kod bira klase uz `cn()` i mape varijanti.",
  minutes: 20,
  projects: ["ReformStudio", "PlazaHome", "my-portfolio"],
  blocks: [
    {
      kind: "prose",
      md: `U prošloj lekciji svaka klasa je važila **uvek**. Ali dugme treba da promeni boju kad je miš iznad njega, da se malo smanji dok ga pritiskaš i da izbledi kad je onemogućeno. Lista termina treba da bude jedna kolona na telefonu, a tri kolone na laptopu.

Za sve to Tailwind ima **varijante**: prefiks sa dvotačkom ispred obične klase.

\`hover:bg-ink-700\` čitaš ovako: *kad je miš iznad elementa, pozadina je ink-700*. Klasa bez prefiksa važi uvek, a klasa sa prefiksom samo dok je uslov ispunjen. Već ima jedna takva u \`StudioPill\`-u iz prve lekcije: \`active:scale-95\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao uputstvo za oblačenje",
      md: "`bg-white hover:bg-gray-100 active:scale-95` je kao spisak: *obično bela majica; ako pada kiša, jakna; ako je gužva, skupi se*. Klasa bez prefiksa je ono što nosiš uvek, a varijanta je dodatak za posebnu priliku. Kad prilika prođe (miš ode, prst se podigne), dodatak se sam skine.",
    },
    {
      kind: "code",
      lang: "css",
      filename: "dugme.css",
      code: `.dugme { background: #1f1f1f; }
.dugme:hover { background: #3f3f3f; }
.dugme:active { transform: scale(0.98); }
.dugme:disabled { opacity: 0.45; pointer-events: none; }`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Dugme.tsx",
      code: `<button className="bg-ink-900 hover:bg-ink-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45">
  Rezerviši
</button>`,
      caption:
        "Ista pravila, ali u jednoj liniji, tik uz element na koji se odnose. Vrednosti su iz `Button`-a u ReformStudiju. U CSS-u je `:hover` posle imena klase, a u Tailwind-u ide **ispred** klase: `hover:bg-ink-700`.",
    },
    {
      kind: "prose",
      md: `### Stanja: miš, prst i tastatura

| Varijanta | Kada važi | Primer iz tvojih projekata |
|---|---|---|
| \`hover:\` | miš je iznad elementa | \`hover:border-petrol\` (PlazaHome, Kontakt) |
| \`active:\` | element se upravo pritiska, prstom ili klikom | \`active:scale-95\` (StudioPill) |
| \`focus:\` | element ima fokus (kliknuto polje, Tab) | \`focus:ring-4\` (TextField) |
| \`focus-visible:\` | fokus je stigao sa tastature | \`focus-visible:ring-4\` (Avatar) |
| \`disabled:\` | element ima atribut \`disabled\` | \`disabled:opacity-45\` (Button) |
| \`placeholder:\` | uvek, ali za tekst placeholder-a, ne za samo polje | \`placeholder:text-ink-500\` (TextField) |

Varijante mogu da se slažu jedna na drugu: \`dark:hover:bg-white\` važi samo u tamnoj temi **i** dok je miš iznad. Čitaš ih sleva nadesno, kao uslove spojene sa "i".`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "hover: ne radi na telefonu",
      md: "ReformStudio je aplikacija za telefon, a telefon nema miš. U Tailwind-u v4 `hover:` se zato uključuje **samo na uređajima koji imaju pravi hover** (miš, touchpad). Na telefonu ta klasa ne radi ništa. Zato ReformStudio za povratnu informaciju na dodir koristi `active:` (`active:scale-95`, `active:opacity-70`): dugme se oseti pod prstom.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "focus-visible: fokus za tastaturu",
      md: "`focus:` se uključi i kad klikneš mišem, pa bi svako dugme posle klika ostalo sa prstenom oko sebe. `focus-visible:` je pametniji: prsten se vidi samo kad browser proceni da je potreban, najčešće kad neko ide **Tab**-om. Za dugmad i linkove koristi `focus-visible:`, a za polja za unos je `focus:` u redu. Fokus nikad ne briši bez zamene: ReformStudio zato u `src/index.css` ima pravilo za ceo sajt, `:focus-visible { outline: 2px solid var(--ink-900) }`.",
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "PlazaHome · src/app/layout.tsx (isečak)",
      code: `<a
  href="#sadrzaj"
  className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:bg-petrol focus:px-4 focus:py-3 focus:text-white"
>
  Preskoči na sadržaj
</a>`,
      caption:
        "Link koji je nevidljiv (`sr-only`) dok do njega ne stigneš Tab-om. Tada ga desetak `focus:` klasa izvuče u gornji levi ugao, pa neko ko koristi tastaturu može da preskoči meni. Mišem ga nikad ne vidiš.",
    },
    {
      kind: "prose",
      md: `### \`group\`: kad roditelj odlučuje

Ponekad stil deteta zavisi od stanja **roditelja**. Pređeš mišem preko cele kartice, a strelica u uglu promeni boju, iako miš nije baš na strelici.

Za to roditelj dobija klasu \`group\`, a dete \`group-hover:…\`. Sama klasa \`group\` ne menja izgled. Ona samo označi element na koji se odnose \`group-*\` varijante unutar njega. Radi sa svim stanjima: \`group-focus-visible:\`, \`group-active:\`, \`group-disabled:\`…`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "KarticaStudija.tsx",
      code: `<a href="/pilates" className="group flex items-center justify-between rounded-2xl border p-5 hover:border-black">
  <span className="font-bold">Pilates</span>
  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">→</span>
</a>`,
      highlight: [1, 3],
      caption: "Miš je iznad linka (roditelja sa `group`), a pomera se i boji strelica (dete sa `group-hover:`).",
    },
    {
      kind: "playground",
      id: "tw-stanja-peskovnik",
      title: "Probaj stanja",
      tailwind: true,
      prompt:
        "Pređi mišem preko kartice (strelica se pomeri iako miš nije na njoj), klikni i drži, pa klikni u pregled i pritisni **Tab**. Druga kartica je `disabled`. Zatim probaj: obriši `group` sa dugmeta i vidi šta prestaje da radi, promeni `active:scale-[0.98]` u `active:scale-90`, ili `focus-visible:` u `focus:` i klikni mišem.",
      lang: "tsx",
      code: `const termini = [
  { vreme: "07:00", naziv: "Fitness", slobodno: 4 },
  { vreme: "18:00", naziv: "Pilates", slobodno: 0 },
]

function App() {
  return (
    <div className="max-w-sm space-y-3">
      {termini.map((t) => (
        <button
          key={t.vreme}
          type="button"
          disabled={t.slobodno === 0}
          className="group flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black/40 hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          <span>
            <span className="block text-xs font-semibold text-gray-500">{t.vreme}</span>
            <span className="block text-lg font-bold">{t.naziv}</span>
          </span>
          <span className="text-sm text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
            {t.slobodno > 0 ? t.slobodno + " mesta →" : "Popunjeno"}
          </span>
        </button>
      ))}
    </div>
  )
}
`,
    },
    {
      kind: "exercise",
      id: "tw-stanja-1",
      title: "Kartica koja reaguje",
      lang: "tsx",
      tailwind: true,
      prompt: `Kartica studija je dugme, kao na ulaznom ekranu ReformStudija. Trenutno je mrtva: ne reaguje ni na šta. Dodaj joj stanja:

- **hover**: kartica menja pozadinu ili ivicu (\`hover:bg-…\` ili \`hover:border-…\`)
- **fokus sa tastature** se vidi: \`focus-visible:ring-…\` ili \`focus-visible:outline-…\` (npr. \`focus-visible:ring-4 focus-visible:ring-cyan-300\`)
- **pritisak** se oseti: bilo koja \`active:…\` klasa (npr. \`active:scale-[0.98]\`)
- kartica je \`group\`, a **strelica** dobija bar jednu \`group-hover:…\` klasu (npr. da se pomeri udesno ili potamni)

Pređi mišem preko pregleda i pritisni Tab da proveriš.`,
      starter: `export default function App() {
  return (
    <button
      type="button"
      className="flex w-full max-w-sm items-center justify-between rounded-2xl border border-black/10 bg-white p-5 text-left transition"
    >
      <span>
        <span className="block text-xs font-bold tracking-widest text-gray-500 uppercase">Studio</span>
        <span className="block text-2xl font-extrabold">Pilates</span>
      </span>
      <span aria-hidden className="text-xl text-gray-400 transition">
        →
      </span>
    </button>
  )
}
`,
      solution: `export default function App() {
  return (
    <button
      type="button"
      className="group flex w-full max-w-sm items-center justify-between rounded-2xl border border-black/10 bg-white p-5 text-left transition hover:border-black/30 hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:outline-none active:scale-[0.98]"
    >
      <span>
        <span className="block text-xs font-bold tracking-widest text-gray-500 uppercase">Studio</span>
        <span className="block text-2xl font-extrabold">Pilates</span>
      </span>
      <span aria-hidden className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
        →
      </span>
    </button>
  )
}
`,
      tests: [
        {
          name: "kartica reaguje na miš (hover:bg-… ili hover:border-…)",
          code: 'await render(App)\nexpect(screen.getByRole("button", { name: /Pilates/ })).toHaveClass(/^hover:(bg|border)-/)',
        },
        {
          name: "fokus sa tastature se vidi (focus-visible:ring… ili focus-visible:outline…)",
          code: 'await render(App)\nexpect(screen.getByRole("button", { name: /Pilates/ })).toHaveClass(/^focus-visible:(ring|outline)(-\\d+)?$/)',
        },
        {
          name: "pritisak se oseti (active:…)",
          code: 'await render(App)\nexpect(screen.getByRole("button", { name: /Pilates/ })).toHaveClass(/^active:/)',
        },
        {
          name: "kartica ima klasu group",
          code: 'await render(App)\nexpect(screen.getByRole("button", { name: /Pilates/ })).toHaveClass("group")',
        },
        {
          name: "strelica reaguje na hover kartice (group-hover:…)",
          code: 'await render(App)\nexpect(screen.getByText("→")).toHaveClass(/^group-hover:/)',
        },
      ],
      hints: [
        "Sve klase za stanja kartice idu u `className` dugmeta, pored postojećih. Redosled nije bitan.",
        "Na dugme dodaj npr. `group hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-cyan-300 active:scale-[0.98]`.",
        "Na strelicu (`<span aria-hidden …>`) dodaj `group-hover:translate-x-1` ili `group-hover:text-black`. Bez `group` na dugmetu to ne radi.",
      ],
      explanation:
        "`hover:` i `group-hover:` rade samo sa mišem, `active:` i prstom i mišem, a `focus-visible:` je za tastaturu. Dobra kartica ima sva tri, jer ne znaš kako će je korisnik dodirnuti. `focus-visible:outline-none` uz prsten je u redu, jer prsten zamenjuje okvir.",
    },
    {
      kind: "prose",
      md: `### Ekrani: mobile-first

Druga vrsta varijanti ne gleda šta korisnik radi, nego **koliko je ekran širok**:

| Prefiks | Važi od širine | Otprilike |
|---|---|---|
| (bez prefiksa) | 0px, uvek | telefon |
| \`sm:\` | 640px | veći telefon položeno |
| \`md:\` | 768px | tablet |
| \`lg:\` | 1024px | laptop |
| \`xl:\` | 1280px | veliki monitor |

Najvažnije pravilo: **Tailwind je mobile-first**. Klasa bez prefiksa je za telefon i važi na svim širinama. Prefiks dodaje izmenu **od te širine naviše**. \`md:\` ne znači "samo na srednjim ekranima", nego "od 768px pa sve šire".`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ListaTermina.tsx",
      code: `<ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">`,
      caption:
        "Čita se kao stepenice: jedna kolona → od 768px dve → od 1024px četiri. Prvo napišeš izgled za telefon, pa dodaješ izmene za šire ekrane.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: sm: nije „mali ekran”",
      md: "`sm:hidden` **ne** sakriva element na telefonu. Sakriva ga od 640px naviše, dakle svuda **osim** na telefonu. Nešto što treba da se vidi samo na telefonu piše se `md:hidden`, a nešto samo za veće ekrane `hidden lg:block` (tako PlazaHome sakriva strelicu u listi proizvoda na telefonu). Za opseg \"samo ispod\" postoje i `max-md:` varijante, ali retko ti trebaju.",
    },
    {
      kind: "fromYourCode",
      project: "PlazaHome",
      file: "src/app/kontakt/page.tsx",
      lang: "tsx",
      startLine: 38,
      intro:
        "Stranica Kontakt na PlazaHome sajtu. Na telefonu su kanali i forma jedno ispod drugog, a na laptopu stoje jedno pored drugog. Tu je i `group` na svakom kanalu.",
      code: `        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <h2 className="text-xl font-medium tracking-[-0.012em]">Javite nam se direktno</h2>
            <ul className="mt-5 grid grid-cols-1 gap-3">
              {channels.map((channel, i) => (
                <li key={channel.label} data-reveal style={vars({ "--delay": \`\${i * 0.05}s\` })}>
                  <a
                    href={channel.href}
                    className="group flex min-h-18 items-center gap-4 border border-line bg-white px-4 py-3 transition-colors hover:border-petrol sm:px-5"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-petrol">
                      <Icon name={channel.icon} className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm text-muted">{channel.label}</span>
                      <span className="font-semibold wrap-anywhere">{channel.value}</span>
                    </span>
                    <Icon name="arrowUpRight" className="size-5 text-muted transition-colors group-hover:text-petrol" />
                  </a>
                </li>
              ))}
            </ul>
            <p lang="en" className="mt-6 text-muted">
              English-speaking clients are welcome: message us on WhatsApp.
            </p>
          </div>

          <div className="lg:col-span-7" data-reveal>
            <div className="border-t border-line pt-10 sm:border sm:bg-white sm:p-8 lg:p-10">
`,
      steps: [
        {
          lines: [1, 2],
          md: "`grid grid-cols-1` je raspored za telefon: sve jedno ispod drugog. Od 1024px `lg:grid-cols-12` ga pretvara u mrežu od 12 kolona, a `lg:col-span-5` kaže da leva strana zauzme 5 od tih 12. Na telefonu `lg:` klase ne rade ništa, pa se `col-span` ni ne primeti.",
        },
        {
          lines: 6,
          md: "`style={vars({ \"--delay\": … })}` daje svakoj stavci svoje kašnjenje, da bi se kanali pojavljivali jedan za drugim. To je **CSS promenljiva**, tema sledeće lekcije. Isto važi i za `border-line`, `bg-sand` i `text-petrol`: to nisu Tailwind boje, nego PlazaHome-ove.",
        },
        {
          lines: [7, 10],
          md: "Svaki kanal je link sa klasom `group`. `hover:border-petrol` oboji ivicu kad je miš iznad, a `sm:px-5` doda malo više mesta sa strane od 640px naviše. Osnovni `px-4` je za telefon, a `sm:px-5` ga samo pregazi na širim ekranima.",
        },
        {
          lines: 18,
          md: "Strelica ima `group-hover:text-petrol`: postane petrolej plava kad je miš bilo gde iznad **linka**, a ne samo iznad nje. `transition-colors` čini da promena boje traje kratko, umesto da skoči.",
        },
        {
          lines: [28, 29],
          md: "Desna strana zauzima ostatak (`lg:col-span-7`, jer je 5 + 7 = 12). Okvir forme je lep primer mobile-first slojeva: na telefonu samo linija gore (`border-t pt-10`), od 640px pun okvir, bela pozadina i razmak (`sm:border sm:bg-white sm:p-8`), a od 1024px još malo više razmaka (`lg:p-10`).",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "Koliko je širok pregled u vežbama?",
      md: "Pregled ispod vežbe je obično širok između 640 i 768 piksela, pa se u njemu uključi `sm:`, a `md:`, `lg:` i `xl:` ne. Testovi proveravaju klase, ne širinu, pa to ne smeta. Ako želiš da vidiš kako se raspored menja, suzi prozor browsera: kad pregled postane uži od 640px, isključi se i `sm:`.",
    },
    {
      kind: "prose",
      md: `### Tamna tema: \`dark:\`

\`dark:\` radi isto kao \`md:\`, samo što ne pita koliko je ekran širok, nego **da li je uključena tamna tema**. \`bg-white dark:bg-zinc-900\` znači: belo, osim u tamnoj temi.

Šta znači "uključena" određuje projekat. Podrazumevano Tailwind prati podešavanje sistema (svetlo ili tamno na Mac-u). Ali tvoj my-portfolio ima dugme za promenu teme, pa je u \`globals.css\` jednim redom promenio šta \`dark:\` znači:`,
    },
    {
      kind: "code",
      lang: "css",
      filename: "my-portfolio · src/app/globals.css",
      code: `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`,
      caption:
        "Prevod: `dark:` važi na elementu koji ima `data-theme=\"dark\"` i na svemu unutar njega. Dugme za temu samo menja taj atribut na `<html>`.",
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "my-portfolio · src/app/site/ThemeToggle.tsx (isečak)",
      code: `<LuMoon aria-hidden className="size-[18px] dark:hidden" />
<LuSun aria-hidden className="hidden size-[18px] dark:block" />`,
      caption:
        "Ikonica se menja bez ijedne linije React stanja: u svetloj temi se vidi mesec, a u tamnoj sunce. CSS već zna koja je tema, pa React ne mora da je pamti.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "Tamna tema u vežbama",
      md: "Pregled u ovim vežbama koristi isti trik, samo sa klasom: `dark:` važi unutar elementa koji ima klasu `dark`. Zato možeš da napišeš `<div className=\"dark\">…</div>` i da vidiš tamnu verziju odmah pored svetle. Sam pregled je uvek svetao.",
    },
    {
      kind: "exercise",
      id: "tw-stanja-2",
      title: "Mreža za svaki ekran i temu",
      lang: "tsx",
      tailwind: true,
      prompt: `Mreža studija je trenutno **uvek** tri kolone, pa su kartice na telefonu preuske. Prepravi je da bude mobile-first:

- **na telefonu jedna kolona**: bez prefiksa nema \`grid-cols-2\` ni \`grid-cols-3\` (može \`grid-cols-1\` ili ništa)
- **dve kolone** od \`sm:\` ili \`md:\` naviše
- **tri kolone** od \`lg:\` ili \`xl:\` naviše

Zatim pogledaj donju, tamnu verziju: bele kartice na tamnoj pozadini bodu oči. Svakoj kartici (\`<li>\`) dodaj **\`dark:bg-…\`** i **\`dark:text-…\`** (npr. \`dark:bg-zinc-800 dark:text-white\`). Omotač sa klasom \`dark\` ne diraj.`,
      starter: `const studiji = ["Fitness", "Pilates", "Reformer", "Mat", "Joga", "Barre"]

function Mreza() {
  return (
    <ul className="grid grid-cols-3 gap-3">
      {studiji.map((s) => (
        <li key={s} className="rounded-xl border border-black/10 bg-white p-4 font-semibold text-gray-900">
          {s}
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  return (
    <div className="space-y-4">
      <Mreza />
      {/* Ista mreža u tamnoj temi: klasa "dark" uključuje sve dark: klase ispod sebe */}
      <div data-testid="tamno" className="dark rounded-2xl bg-zinc-900 p-4">
        <Mreza />
      </div>
    </div>
  )
}
`,
      solution: `const studiji = ["Fitness", "Pilates", "Reformer", "Mat", "Joga", "Barre"]

function Mreza() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {studiji.map((s) => (
        <li
          key={s}
          className="rounded-xl border border-black/10 bg-white p-4 font-semibold text-gray-900 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
        >
          {s}
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  return (
    <div className="space-y-4">
      <Mreza />
      {/* Ista mreža u tamnoj temi: klasa "dark" uključuje sve dark: klase ispod sebe */}
      <div data-testid="tamno" className="dark rounded-2xl bg-zinc-900 p-4">
        <Mreza />
      </div>
    </div>
  )
}
`,
      tests: [
        {
          name: "na telefonu je jedna kolona (bez grid-cols-2/3 bez prefiksa)",
          code: 'await render(App)\nconst ul = screen.getAllByRole("list")[0]\nexpect(ul).toHaveClass("grid")\nexpect([...ul.classList].filter((k) => /^grid-cols-([2-9]|1[0-2])$/.test(k))).toEqual([])',
        },
        {
          name: "od sm: ili md: dve kolone",
          code: 'await render(App)\nexpect(screen.getAllByRole("list")[0]).toHaveClass(/^(sm|md):grid-cols-2$/)',
        },
        {
          name: "od lg: ili xl: tri kolone",
          code: 'await render(App)\nexpect(screen.getAllByRole("list")[0]).toHaveClass(/^(lg|xl):grid-cols-3$/)',
        },
        {
          name: "svaka kartica ima dark:bg-… i dark:text-…",
          code: 'await render(App)\nfor (const li of screen.getAllByRole("listitem")) {\n  expect(li).toHaveClass(/^dark:bg-/, /^dark:text-/)\n}',
        },
        {
          name: "tamna verzija je i dalje unutar elementa sa klasom dark",
          code: 'await render(App)\nconst tamno = screen.getByTestId("tamno")\nexpect(tamno).toHaveClass("dark")\nexpect(tamno.querySelectorAll("li")).toHaveLength(6)',
        },
      ],
      hints: [
        "Kreni od telefona: `grid-cols-3` bez prefiksa je problem, jer važi i na najužem ekranu. Zameni ga sa `grid-cols-1`.",
        "Pa dodaj stepenice: `grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3`.",
        "Na `<li>` dodaj npr. `dark:bg-zinc-800 dark:text-white` (po želji i `dark:border-white/10`).",
      ],
      explanation:
        "Isti `Mreza` se crta dva puta, a izgleda drugačije samo zato što je drugi primerak unutar `.dark`. Komponenta ne zna za temu i ne prima nikakav prop: odluku donose klase. Tako radi i `ThemeToggle` u my-portfolio-u.",
    },
    {
      kind: "prose",
      md: `### Uslovne klase u kodu

Varijante rešavaju stanja koja browser zna sam: miš, fokus, širinu ekrana, temu. Ali neka stanja zna samo **tvoj kod**: da li je termin izabran, da li je polje pogrešno popunjeno, koji je ton bedža. Tada klasu biraš JavaScript-om.

Prvi pokušaj obično izgleda ovako:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Slot.tsx",
      code: `<button className={\`rounded-xl border px-4 \${izabran && "ring-2"}\`}>`,
      caption:
        "Radi dok je `izabran` tačno. Kad nije, `izabran && \"ring-2\"` je `false`, pa među klasama piše reč **false**. Isto se desi sa `undefined`.",
    },
    {
      kind: "prose",
      md: "Zato tvoji projekti imaju malu pomoćnu funkciju `cn` (od *class names*). Ovo je ceo fajl iz ReformStudija:",
    },
    {
      kind: "code",
      lang: "ts",
      filename: "ReformStudio · src/lib/cn.ts",
      code: `type ClassValue = string | false | null | undefined

/** Spaja CSS klase i preskače prazne vrijednosti. */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ')`,
      highlight: [4],
      caption:
        "`...classes` skupi sve argumente u niz. `filter(Boolean)` izbaci sve što je \"prazno\" (`false`, `null`, `undefined`, `\"\"`), a `join(' ')` spoji ostatak razmacima. Jedna linija, a koristi se u skoro svakoj komponenti.",
    },
    {
      kind: "prose",
      md: "Sa `cn` uslovi idu pravo u poziv, kao argumenti. Evo kako `TextField` bira boju ivice prema tome da li postoji greška:",
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "ReformStudio · src/components/TextField.tsx (isečak)",
      code: `className={cn(
  // 16px sprečava automatsko zumiranje polja na iOS-u.
  // \`appearance-none\` i \`min-w-0\`: polja za datum i vrijeme na iOS-u inače imaju svoju širinu.
  'h-14 w-full min-w-0 appearance-none rounded-2xl border bg-white px-4 text-left text-base font-medium text-ink-900',
  'placeholder:font-normal placeholder:text-ink-500',
  'transition outline-none focus:ring-4',
  // Greška ima svoju boju: boja studija bi u Fitnessu bila zelena.
  error
    ? 'border-danger-500 focus:ring-danger-100'
    : 'border-ink-900/10 focus:border-ink-500 focus:ring-brand-300',
  trailing ? 'pr-12' : undefined,
)}`,
      highlight: [8, 9, 10, 11],
      caption:
        "Tri vrste argumenata u jednom pozivu: obični stringovi (važe uvek), ternarni operator (jedno ili drugo) i `uslov ? 'klasa' : undefined` (klasa ili ništa). Primeti i da varijante (`focus:ring-4`, `placeholder:`) žive u istim stringovima: uslov bira **koje** klase, a varijanta kaže **kada** važe.",
    },
    {
      kind: "callout",
      tone: "tip",
      title: "clsx i tailwind-merge",
      md: "U tuđim projektima videćeš `clsx(...)` ili `twMerge(...)`. To su biblioteke koje rade isto što i `cn`, uz dodatke. `tailwind-merge` još i rešava sukobe: od `px-4` i `px-8` ostavi samo poslednju. Tvoj `cn` to ne radi. Ako komponenti spolja daš `className=\"px-8\"`, a ona već ima `px-6`, element dobije obe klase, i iz koda ne možeš da znaš koja pobeđuje: odlučuje redosled u CSS-u koji Tailwind napravi, a ne redosled u stringu.",
    },
    {
      kind: "prose",
      md: `### Mape varijanti

Kad opcija ima više od dve, ternarni operatori brzo postanu nečitki. Tada pomaže mapa \`Record<Varijanta, string>\`: za svaku vrednost po jedan string klasa. Znaš je iz \`Badge\`-a u lekciji o props-ima (\`tones[tone]\`). \`Button\` iz ReformStudija ide korak dalje: dve mape, sva stanja i \`cn\` na jednom mestu.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/Button.tsx",
      lang: "tsx",
      startLine: 22,
      intro:
        "Srce svakog dugmeta u ReformStudiju. Komponenta `Button` (koja je ispod ovog isečka) samo pozove `buttonClass(...)` i rezultat stavi u `className`.",
      code: `const variants: Record<Variant, string> = {
  // Glavna akcija je u tamnoj boji studija: svijetla (naročito Fitness zelena)
  // na bijeloj pozadini izgleda kao onemogućeno dugme.
  primary: 'bg-ink-900 text-brand-50 hover:bg-ink-700',
  brand: 'bg-brand-300 text-ink-900 hover:bg-brand-400/80',
  light: 'bg-white/70 text-ink-900 hover:bg-white',
  outline: 'border border-ink-900/15 bg-white text-ink-900 hover:border-ink-900/30',
  soft: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
  // Bez boje teksta: nasljeđuje je, pa se može zadati kroz \`className\`.
  ghost: 'hover:bg-ink-900/5',
  // Nepovratna radnja (UX-16): potvrda u sheet-u je crvena, a sigurna opcija uz nju je \`outline\`.
  danger: 'bg-danger-700 text-white hover:bg-danger-700/90',
  // Dugme koje tek otvara potvrdu nepovratne radnje (npr. „Otkaži termin”, „Obriši nalog”).
  dangerOutline: 'border border-danger-500/50 bg-white text-danger-700 hover:border-danger-500',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-base',
}

const buttonClass = ({ variant = 'primary', size = 'md', block }: StyleProps, extra?: string) =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap',
    'transition duration-200 select-none active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-45',
    variants[variant],
    sizes[size],
    block && 'w-full',
    extra,
  )
`,
      steps: [
        {
          lines: [1, 15],
          md: "Mapa varijanti: osam izgleda dugmeta, i svaki zna kako da reaguje na miš. `primary` na hover posvetli u `ink-700`, `brand` prelazi u `brand-400/80`, a `ghost` dobije tek 5% tamne pozadine. Komentari beleže **zašto**, npr. zašto glavna akcija nije u boji studija.",
        },
        {
          lines: [17, 21],
          md: "Mapa veličina. Svaka veličina menja tri stvari zajedno: visinu (`h-10` / `h-12` / `h-14`), razmak sa strane i veličinu teksta. Zato je jedna mapa bolja od tri odvojena propa: ne može da se desi malo dugme sa ogromnim tekstom.",
        },
        {
          lines: [23, 25],
          md: "`buttonClass` vraća jedan string klasa. Prvi argument su osnovne klase koje ima **svako** dugme: oblik pilule, centriran sadržaj, podebljan tekst u jednom redu.",
        },
        {
          lines: [26, 27],
          md: "Stanja koja važe za sve varijante: `active:scale-[0.98]` (pritisak se oseti pod prstom), `disabled:opacity-45` (dugme izbledi) i `disabled:pointer-events-none` (onemogućeno dugme ne reaguje ni na hover). Napisano jednom, a važi za svih osam varijanti.",
        },
        {
          lines: [28, 31],
          md: "Izabrana varijanta i veličina iz mapa, pa `block && 'w-full'`: kad `block` nije prosleđen, to je `undefined`, i `cn` ga preskoči. Na kraju `extra`, tj. `className` koji je prosledio onaj ko koristi dugme, da bi moglo da se namesti spolja (npr. `mt-4`).",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Nikad ne lepi delove imena klase",
      md: "`bg-${boja}-500` **ne radi**. Tailwind ne izvršava tvoj kod: pre pokretanja on samo *čita* fajlove i traži cele nazive klasa. `bg-${boja}-500` nigde ne piše ceo, pa za njega ne nastane CSS. Zato mape uvek sadrže **cele** klase (`'bg-danger-700 text-white'`), a kod samo bira koji string će upotrebiti. Pregled u vežbama pravi CSS u browseru dok crta, pa bi tu možda i proradilo, ali u pravom projektu ne bi.",
    },
    {
      kind: "exercise",
      id: "tw-stanja-3",
      title: "Slotovi termina: cn i mapa statusa",
      lang: "tsx",
      tailwind: true,
      prompt: `Napravi dugmad za izbor termina, kao u ReformStudiju. Svaki termin ima \`status\`, a jedan je izabran.

1. **\`statusi\`**: popuni mapu tako da svaki status ima svoj, **različit** string sa celim klasama (npr. \`slobodno\` belo, \`malo\` žuto, \`popunjeno\` sivo i precrtano).
2. **\`cn\`**: popravi funkciju da preskače \`false\`, \`null\`, \`undefined\` i \`""\`. Sada samo spaja sve, pa u klasama završi reč \`false\`.
3. **\`Slot\`**: \`className\` napravi sa \`cn(...)\` od:
   - osnovnih klasa (već postoje)
   - \`statusi[status]\`
   - \`ring-2\` (i boje prstena po želji, npr. \`ring-black\`) **samo kad je \`izabran\`**
4. Termin sa statusom \`"popunjeno"\` je **onemogućen** (\`disabled\`) i ima bar jednu \`disabled:…\` klasu (npr. \`disabled:opacity-60\`).

\`App\` je gotov: klik bira termin.`,
      starter: `import { useState } from "react"

type Status = "slobodno" | "malo" | "popunjeno"

// 1. Za svaki status po jedan string sa CELIM klasama
const statusi: Record<Status, string> = {
  slobodno: "",
  malo: "",
  popunjeno: "",
}

// 2. Treba da preskoči false, null, undefined i ""
function cn(...klase: (string | false | null | undefined)[]) {
  return klase.join(" ")
}

interface SlotProps {
  vreme: string
  status: Status
  izabran?: boolean
  onIzaberi?: () => void
}

// 3. i 4. Klase iz cn(...) i disabled za popunjen termin
export function Slot({ vreme, status, izabran = false, onIzaberi }: SlotProps) {
  return (
    <button
      type="button"
      onClick={onIzaberi}
      className="rounded-xl border px-4 py-3 text-sm font-semibold transition"
    >
      {vreme}
    </button>
  )
}

const termini: { vreme: string; status: Status }[] = [
  { vreme: "07:00", status: "slobodno" },
  { vreme: "12:15", status: "malo" },
  { vreme: "18:00", status: "slobodno" },
  { vreme: "19:30", status: "popunjeno" },
]

export default function App() {
  const [izabrano, setIzabrano] = useState("07:00")
  return (
    <div className="flex flex-wrap gap-2">
      {termini.map((t) => (
        <Slot
          key={t.vreme}
          vreme={t.vreme}
          status={t.status}
          izabran={izabrano === t.vreme}
          onIzaberi={() => setIzabrano(t.vreme)}
        />
      ))}
    </div>
  )
}
`,
      solution: `import { useState } from "react"

type Status = "slobodno" | "malo" | "popunjeno"

const statusi: Record<Status, string> = {
  slobodno: "border-black/10 bg-white text-gray-900 hover:border-black/30",
  malo: "border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-400",
  popunjeno: "border-transparent bg-gray-100 text-gray-400 line-through",
}

function cn(...klase: (string | false | null | undefined)[]) {
  return klase.filter(Boolean).join(" ")
}

interface SlotProps {
  vreme: string
  status: Status
  izabran?: boolean
  onIzaberi?: () => void
}

export function Slot({ vreme, status, izabran = false, onIzaberi }: SlotProps) {
  return (
    <button
      type="button"
      onClick={onIzaberi}
      disabled={status === "popunjeno"}
      aria-pressed={izabran}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        statusi[status],
        izabran && "ring-2 ring-black",
      )}
    >
      {vreme}
    </button>
  )
}

const termini: { vreme: string; status: Status }[] = [
  { vreme: "07:00", status: "slobodno" },
  { vreme: "12:15", status: "malo" },
  { vreme: "18:00", status: "slobodno" },
  { vreme: "19:30", status: "popunjeno" },
]

export default function App() {
  const [izabrano, setIzabrano] = useState("07:00")
  return (
    <div className="flex flex-wrap gap-2">
      {termini.map((t) => (
        <Slot
          key={t.vreme}
          vreme={t.vreme}
          status={t.status}
          izabran={izabrano === t.vreme}
          onIzaberi={() => setIzabrano(t.vreme)}
        />
      ))}
    </div>
  )
}
`,
      tests: [
        {
          name: "cn preskače false, null, undefined i prazan string",
          code: 'expect(cn("a", false, "b", null, undefined, "")).toBe("a b")\nexpect(cn("px-4")).toBe("px-4")',
        },
        {
          name: "svaki status ima svoje, različite klase",
          code: 'const v = Object.values(statusi)\nexpect(v.every((s) => s.trim().length > 0)).toBe(true)\nexpect(new Set(v).size).toBe(3)',
        },
        {
          name: "Slot dobija klase svog statusa iz mape",
          code: 'const klase = statusi.malo.split(/\\s+/).filter(Boolean)\nexpect(klase.length > 0).toBe(true)\nawait render(Slot, { vreme: "12:15", status: "malo" })\nexpect(screen.getByRole("button", { name: /12:15/ })).toHaveClass(...klase)',
        },
        {
          name: "izabran slot ima prsten (ring-…), a neizabran nema",
          code: 'await render(Slot, { vreme: "07:00", status: "slobodno", izabran: true })\nexpect(screen.getByRole("button", { name: /07:00/ })).toHaveClass(/^ring(-[0-8])?$/)\nawait render(Slot, { vreme: "18:00", status: "slobodno" })\nexpect([...screen.getByRole("button", { name: /18:00/ }).classList].filter((k) => /^ring(-[0-8])?$/.test(k))).toEqual([])',
        },
        {
          name: "u klasama nema reči \"false\" ni \"undefined\"",
          code: 'await render(Slot, { vreme: "07:00", status: "slobodno" })\nconst btn = screen.getByRole("button", { name: /07:00/ })\nexpect(btn.className).not.toContain("false")\nexpect(btn.className).not.toContain("undefined")',
        },
        {
          name: "popunjen termin je onemogućen i ima disabled:… klasu",
          code: 'await render(Slot, { vreme: "19:30", status: "popunjeno" })\nconst btn = screen.getByRole("button", { name: /19:30/ })\nexpect(btn).toBeDisabled()\nexpect(btn).toHaveClass(/^disabled:/)\nawait render(Slot, { vreme: "18:00", status: "slobodno" })\nexpect(screen.getByRole("button", { name: /18:00/ })).not.toBeDisabled()',
        },
        {
          name: "App: klik bira termin, a popunjen ne može da se izabere",
          code: 'await render(App)\nawait click(screen.getByRole("button", { name: /18:00/ }))\nexpect(screen.getByRole("button", { name: /18:00/ })).toHaveClass(/^ring(-[0-8])?$/)\nexpect([...screen.getByRole("button", { name: /07:00/ }).classList].filter((k) => /^ring(-[0-8])?$/.test(k))).toEqual([])\nawait click(screen.getByRole("button", { name: /19:30/ }))\nexpect([...screen.getByRole("button", { name: /19:30/ }).classList].filter((k) => /^ring(-[0-8])?$/.test(k))).toEqual([])',
        },
      ],
      hints: [
        "`cn` je jedna linija: `return klase.filter(Boolean).join(\" \")`. Mapa: npr. `slobodno: \"bg-white text-gray-900\"`, `malo: \"bg-amber-50 text-amber-900\"`, `popunjeno: \"bg-gray-100 text-gray-400 line-through\"`.",
        "U `Slot`: `className={cn(\"rounded-xl border px-4 py-3 …\", statusi[status], izabran && \"ring-2 ring-black\")}`.",
        "Onemogućen termin: `disabled={status === \"popunjeno\"}` na `<button>`, a u osnovne klase dodaj `disabled:opacity-60`. Onemogućeno dugme ni ne poziva `onClick`, pa se ne može izabrati.",
      ],
      explanation:
        "Tri alata, svaki za svoj posao: **mapa** bira između više izgleda (status), **uslov u `cn`** dodaje ili ne dodaje klasu (izabran), a **varijanta** `disabled:` opisuje izgled stanja koje browser već zna. Tačno tako je složen i `Button` u ReformStudiju.",
    },
    {
      kind: "quiz",
      id: "tw-stanja-quiz",
      questions: [
        {
          q: "Šta znači `md:grid-cols-2`?",
          options: [
            "Dve kolone od 768px širine naviše",
            "Dve kolone samo na srednjim ekranima (tablet)",
            "Dve kolone samo na telefonu",
            "Dve kolone kad je miš iznad mreže",
          ],
          answer: 0,
          why: "Tailwind je mobile-first: prefiks znači \"od ove širine pa sve šire\". Na laptopu `md:grid-cols-2` i dalje važi, osim ako ga `lg:` ne pregazi.",
        },
        {
          q: "ReformStudio je aplikacija za telefon. Koja varijanta daje povratnu informaciju kad prst pritisne dugme?",
          options: ["`active:`", "`hover:`", "`focus:`", "`group-hover:`"],
          answer: 0,
          why: "U v4 `hover:` (pa i `group-hover:`) radi samo na uređajima sa mišem. `active:` važi dok je element pritisnut, i prstom i mišem.",
        },
        {
          q: "Strelica ima `group-hover:text-petrol`, ali se ne menja kad pređeš mišem preko kartice. Šta najverovatnije fali?",
          options: [
            "Klasa `group` na kartici (roditelju)",
            "Klasa `hover` na strelici",
            "`transition` na kartici",
            "`focus-visible:` na strelici",
          ],
          answer: 0,
          why: "`group-hover:` traži najbližeg roditelja sa klasom `group`. Bez njega varijanta nema na šta da se odnosi.",
        },
        {
          q: "Koje klase dobije dugme kad je `izabran` jednako `false`?",
          code: '<button className={`px-4 ${izabran && "ring-2"}`}>',
          codeLang: "tsx",
          options: ["`px-4` i `false`", "Samo `px-4`", "`px-4` i `ring-0`", "Nijednu, kod pukne"],
          answer: 0,
          why: "`false && \"ring-2\"` je `false`, a template string ga pretvori u reč \"false\". `cn(...)` sa `filter(Boolean)` takve vrednosti izbaci.",
        },
        {
          q: "Zašto `bg-${boja}-500` ne radi u pravom projektu?",
          options: [
            "Tailwind pre pokretanja traži cele nazive klasa u fajlovima, a ovaj nigde ne piše ceo",
            "Template string ne radi u JSX-u",
            "Boja mora da bude broj",
            "Radi, samo je sporije",
          ],
          answer: 0,
          why: "Tailwind ne izvršava tvoj kod, nego ga čita kao tekst. Zato mape (`Record<Varijanta, string>`) sadrže cele klase, a kod samo bira string.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-tw-stanja-1",
      front: "Kako se čita `hover:bg-ink-700`?",
      back: "Varijanta + klasa: *kad je miš iznad elementa*, pozadina je `ink-700`. Bez prefiksa klasa važi uvek.",
    },
    {
      id: "fc-tw-stanja-2",
      front: "Šta znači mobile-first?",
      back: "Klase bez prefiksa su za telefon i važe na svim širinama. `sm:` / `md:` / `lg:` dodaju izmene **od te širine naviše** (640 / 768 / 1024px).",
    },
    {
      id: "fc-tw-stanja-3",
      front: "Kako rade `group` i `group-hover:`?",
      back: "Roditelj dobije klasu `group`, a dete `group-hover:…`. Dete se menja kad je miš bilo gde iznad roditelja.",
    },
    {
      id: "fc-tw-stanja-4",
      front: "Šta radi `cn(...)` iz ReformStudija?",
      back: "Spaja klase u jedan string i preskače `false`, `null`, `undefined` i `\"\"`: `classes.filter(Boolean).join(' ')`. Zato uslovi mogu da idu pravo u poziv.",
    },
    {
      id: "fc-tw-stanja-5",
      front: "Zašto mapa varijanti sadrži cele klase, a ne delove imena?",
      back: "Tailwind čita fajlove i traži cele nazive klasa. `bg-${boja}-500` nigde ne piše ceo, pa za njega ne nastane CSS.",
    },
  ],
};

export default lesson;
