import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "tailwind-osnove",
  title: "Tailwind: stil kroz klase",
  summary:
    "Kako se čitaju one dugačke `className` linije iz tvojih projekata: razmaci, boje, tipografija, ivice, i raspored sa flex-om i grid-om.",
  minutes: 20,
  projects: ["ReformStudio", "PlazaHome"],
  blocks: [
    {
      kind: "prose",
      md: `U svakom tvom projektu postoje linije poput ove:

\`className="inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[13px] font-bold"\`

Na prvi pogled izgleda kao šifra. Ali to je **Tailwind CSS**: umesto da pišeš CSS u posebnom fajlu, slažeš male, gotove klase direktno u JSX. Svaka klasa radi **tačno jednu stvar**: \`rounded-full\` zaobli ivice, \`px-4\` doda razmak levo i desno, \`font-bold\` podebljava tekst.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao opis u jednoj rečenici",
      md: "`rounded-full border px-4 font-bold` čitaš kao rečenicu: *zaobljeno do kraja, sa ivicom, sa razmakom levo-desno, podebljano*. Kad naučiš dvadesetak \"reči\", možeš da pročitaš izgled bilo kog elementa bez otvaranja CSS fajla.",
    },
    {
      kind: "prose",
      md: `### Isto, na dva načina

Ovako bi izgledalo dugme u klasičnom CSS-u, a ovako u Tailwind-u:`,
    },
    {
      kind: "code",
      lang: "css",
      filename: "dugme.css",
      code: `.dugme {
  padding: 8px 16px;
  border-radius: 9999px;
  background-color: black;
  color: white;
  font-weight: 700;
}`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Dugme.tsx",
      code: `<button className="rounded-full bg-black px-4 py-2 font-bold text-white">
  Rezerviši
</button>`,
      caption:
        "Isti rezultat, bez posebnog fajla i bez izmišljanja imena klasa. Kad obrišeš komponentu, nestane i njen stil, pa nema mrtvog CSS-a koji niko ne sme da dira.",
    },
    {
      kind: "prose",
      md: `### Kako se čita klasa

Skoro svaka klasa ima oblik **\`šta-koliko\`**:

| Klasa | Znači | CSS |
|---|---|---|
| \`p-4\` | padding sa svih strana | \`padding: 16px\` |
| \`px-4\` / \`py-2\` | padding levo-desno / gore-dole | \`padding-inline\` / \`padding-block\` |
| \`mt-2\` | margina gore | \`margin-top: 8px\` |
| \`gap-3\` | razmak između dece (flex/grid) | \`gap: 12px\` |
| \`w-full\` / \`h-11\` | širina / visina | \`width: 100%\` / \`height: 44px\` |
| \`text-sm\` / \`text-2xl\` | veličina teksta | \`font-size\` |
| \`font-bold\` | debljina slova | \`font-weight: 700\` |
| \`text-white\` | boja teksta | \`color\` |
| \`bg-black\` | boja pozadine | \`background-color\` |
| \`rounded-lg\` / \`rounded-full\` | zaobljenje | \`border-radius\` |
| \`border\` | ivica od 1px | \`border-width: 1px\` |
| \`shadow\` | senka | \`box-shadow\` |

**Brojevi su skala, a ne pikseli:** \`1\` = 4px. Znači \`p-4\` = 16px, \`gap-3\` = 12px, \`h-11\` = 44px. Kad ti treba tačna vrednost koje nema na skali, piše se u uglastim zagradama: \`text-[13px]\`, \`rounded-[28px]\`.`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Boje sa providnošću",
      md: "`border-ink-900/10` znači: boja `ink-900`, ali sa **10% neprozirnosti**. Kosa crta posle boje je providnost. Tako ReformStudio pravi suptilne ivice koje se uklapaju u bilo koju pozadinu.",
    },
    {
      kind: "playground",
      id: "tw-osnove-peskovnik",
      title: "Probaj Tailwind",
      tailwind: true,
      prompt:
        "Pregled ispod ima pravi Tailwind. Menjaj klase i gledaj rezultat: probaj `rounded-2xl` umesto `rounded-xl`, `p-8` umesto `p-5`, `bg-cyan-500` umesto `bg-black`, ili dodaj `shadow-lg`.",
      lang: "tsx",
      code: `function App() {
  return (
    <div className="max-w-sm rounded-xl border border-black/10 p-5">
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Danas · 18:00
      </p>
      <h2 className="mt-1 text-2xl font-bold">Pilates</h2>
      <p className="mt-2 text-sm text-gray-600">Slobodna su još 2 mesta od 6.</p>
      <button className="mt-4 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
        Rezerviši
      </button>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Raspored: flex i grid

Boje i razmaci su lakši deo. Pravo pitanje je **gde** stoji koji element. Za to služe dve stvari:

- **\`flex\`** ređa decu u **red** (ili kolonu sa \`flex-col\`). \`items-center\` ih poravna vertikalno, \`justify-between\` gura prvo dete levo, a poslednje desno, a \`gap-2\` doda razmak između njih.
- **\`grid\`** pravi **mrežu**. \`grid-cols-2\` znači dve kolone iste širine, a \`gap-3\` je razmak između polja.`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Raspored.tsx",
      code: `{/* Red: vreme levo, oznaka desno */}
<div className="flex items-center justify-between gap-2">
  <span>18:00 Pilates</span>
  <span className="rounded-full bg-black px-2 text-white">2 mesta</span>
</div>

{/* Mreža: 2 kolone */}
<ul className="grid grid-cols-2 gap-3">
  <li>Fitness</li>
  <li>Pilates</li>
  <li>Reformer</li>
  <li>Mat</li>
</ul>`,
      highlight: [2, 8],
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/StudioPill.tsx",
      lang: "tsx",
      startLine: 10,
      intro:
        "Ovo je \"pilula\" sa imenom studija na Početnoj ReformStudija. Ceo izgled je u jednoj `className` liniji. Pročitaj je klasu po klasu.",
      code: `export const StudioPill = ({ studioId }: { studioId: StudioId }) => {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.entry)}
      aria-label={\`\${t.studios[studioId]} — \${t.entry.changeStudio}\`}
      className="inline-flex h-11 min-w-0 items-center gap-1.5 rounded-full border border-ink-900/10 bg-white px-4 text-[13px] font-bold transition active:scale-95"
    >
      <span className="truncate">{t.studios[studioId]}</span>
      <span aria-hidden className="shrink-0 font-semibold text-ink-500">
        · {t.entry.change}
      </span>
    </button>
  )
}
`,
      steps: [
        {
          lines: 8,
          md: "`inline-flex items-center gap-1.5`: dugme ređa svoju decu (dva `<span>`-a) u red, centrirano po visini, sa razmakom od 6px. `inline-flex` je kao `flex`, ali dugme ne zauzima ceo red.",
        },
        {
          lines: 8,
          md: "`h-11` = 44px visine. To je minimalna veličina koju Apple preporučuje za dodir prstom. `min-w-0` dozvoljava da se dugme suzi, što je potrebno za `truncate` ispod.",
        },
        {
          lines: 8,
          md: "`rounded-full border border-ink-900/10 bg-white px-4`: pilula oblik, tanka ivica u tamnoj boji sa 10% providnosti, bela pozadina i 16px levo-desno. `ink-900` nije Tailwind boja, nego boja koju je ReformStudio sam definisao (o tome u lekciji o temama).",
        },
        {
          lines: 8,
          md: "`text-[13px] font-bold`: tačna veličina teksta (van skale, zato uglaste zagrade) i podebljano. `transition active:scale-95`: dok je dugme pritisnuto, malo se smanji. `active:` je **stanje**, kao `hover:`. To je tema sledeće lekcije.",
        },
        {
          lines: [10, 13],
          md: "`truncate` skrati predugačko ime tri tačke (`…`) umesto da ga prelomi u novi red. `shrink-0` kaže da se reč \"Promeni\" nikad ne skuplja, pa se uvek skraćuje ime studija.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "Odakle dolaze klase kao bg-brand-200?",
      md: "Tailwind ima gotove boje (`gray-500`, `cyan-400`…), ali tvoji projekti dodaju svoje. U ReformStudiju su u `src/index.css`, u bloku `@theme`: tamo `--color-brand-200` postaje klasa `bg-brand-200`. To radimo u trećoj lekciji ovog modula.",
    },
    {
      kind: "exercise",
      id: "tw-osnove-1",
      title: "Ulepšaj dugme",
      lang: "tsx",
      tailwind: true,
      prompt: `Dugme \"Rezerviši\" je trenutno golo. Dodaj mu Tailwind klase tako da:

- ima **zaobljene ivice** (bilo koje \`rounded-…\`)
- ima **razmak** levo-desno (\`px-…\`) i gore-dole (\`py-…\`)
- ima **pozadinu** u boji (\`bg-…\`) i **beli tekst** (\`text-white\`)
- tekst je **podebljan** (\`font-semibold\` ili \`font-bold\`)

Gledaj pregled dok kucaš i biraj vrednosti koje ti se sviđaju.`,
      starter: `export default function App() {
  return <button>Rezerviši</button>
}
`,
      solution: `export default function App() {
  return (
    <button className="rounded-full bg-black px-5 py-2.5 font-semibold text-white">
      Rezerviši
    </button>
  )
}
`,
      tests: [
        {
          name: "ima zaobljene ivice (rounded-…)",
          code: 'await render(App)\nexpect(screen.getByRole("button", { name: "Rezerviši" })).toHaveClass(/^rounded(-.+)?$/)',
        },
        {
          name: "ima razmak px-… i py-…",
          code: 'await render(App)\nexpect(screen.getByRole("button")).toHaveClass(/^px-/, /^py-/)',
        },
        {
          name: "ima pozadinu (bg-…) i beli tekst",
          code: 'await render(App)\nexpect(screen.getByRole("button")).toHaveClass(/^bg-/, "text-white")',
        },
        {
          name: "tekst je podebljan",
          code: 'await render(App)\nexpect(screen.getByRole("button")).toHaveClass(/^font-(semibold|bold|extrabold|black)$/)',
        },
      ],
      hints: [
        "Sve klase idu u jedan string: `<button className=\"…\">`. Redosled klasa nije bitan.",
        "Na primer: `rounded-lg px-4 py-2 bg-cyan-600 text-white font-semibold`.",
      ],
      explanation:
        "Testovi proveravaju samo vrstu klase, ne i tačnu vrednost: `px-4` i `px-6` su oba ispravna. Izgled biraš ti, a Tailwind se stara da sve bude na istoj skali.",
    },
    {
      kind: "exercise",
      id: "tw-osnove-2",
      title: "Red sa flex-om",
      lang: "tsx",
      tailwind: true,
      prompt: `Napravi red termina kao u ReformStudiju: **vreme i naziv levo, oznaka sa brojem mesta desno**.

- Spoljni \`<div>\` (onaj sa \`data-testid="red"\`) treba da bude \`flex\`, sa decom **centriranom po visini** i **razmaknutom do ivica**.
- Oznaka \"2 mesta\" treba da bude **pilula**: \`rounded-full\`, sa razmakom levo-desno.`,
      starter: `export default function App() {
  return (
    <div data-testid="red" className="rounded-xl border border-black/10 p-4">
      <div>
        <p className="font-semibold">18:00</p>
        <p className="text-sm text-gray-500">Pilates</p>
      </div>
      <span className="bg-black text-white text-xs">2 mesta</span>
    </div>
  )
}
`,
      solution: `export default function App() {
  return (
    <div data-testid="red" className="flex items-center justify-between rounded-xl border border-black/10 p-4">
      <div>
        <p className="font-semibold">18:00</p>
        <p className="text-sm text-gray-500">Pilates</p>
      </div>
      <span className="rounded-full bg-black px-2.5 py-0.5 text-xs text-white">2 mesta</span>
    </div>
  )
}
`,
      tests: [
        {
          name: "red je flex",
          code: 'await render(App)\nexpect(screen.getByTestId("red")).toHaveClass("flex")',
        },
        {
          name: "deca su centrirana po visini (items-center)",
          code: 'await render(App)\nexpect(screen.getByTestId("red")).toHaveClass("items-center")',
        },
        {
          name: "deca su razmaknuta do ivica (justify-between)",
          code: 'await render(App)\nexpect(screen.getByTestId("red")).toHaveClass("justify-between")',
        },
        {
          name: "oznaka je pilula sa razmakom",
          code: 'await render(App)\nexpect(screen.getByText("2 mesta")).toHaveClass("rounded-full", /^px-/)',
        },
      ],
      hints: [
        "Tri klase za raspored idu na spoljni `<div>`: `flex`, `items-center`, `justify-between`.",
        "Pilula: na `<span>` dodaj `rounded-full px-2.5` (i po želji `py-0.5`).",
      ],
      explanation:
        "`flex items-center justify-between` je verovatno najčešća kombinacija u tvojim projektima: svaki red u listi, svako zaglavlje sa naslovom levo i dugmetom desno.",
    },
    {
      kind: "exercise",
      id: "tw-osnove-3",
      title: "Mreža studija",
      lang: "tsx",
      tailwind: true,
      prompt: `Prikaži četiri studija u **mreži od dve kolone**.

- Lista (\`<ul>\`) treba da bude \`grid\` sa **dve kolone** i **razmakom** između polja (\`gap-…\`).
- Svaka stavka (\`<li>\`) treba da ima **unutrašnji razmak** (\`p-…\`), **zaobljene ivice** i **ivicu** (\`border\`).

Niz \`studiji\` je već tu. Iskoristi \`.map()\` iz React modula.`,
      starter: `const studiji = ["Fitness", "Pilates", "Reformer", "Mat"]

export default function App() {
  return (
    <ul>
      <li>?</li>
    </ul>
  )
}
`,
      solution: `const studiji = ["Fitness", "Pilates", "Reformer", "Mat"]

export default function App() {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {studiji.map((s) => (
        <li key={s} className="rounded-xl border border-black/10 p-4 font-semibold">
          {s}
        </li>
      ))}
    </ul>
  )
}
`,
      tests: [
        {
          name: "prikazuje sva četiri studija",
          code: 'await render(App)\nexpect(screen.getAllByRole("listitem")).toHaveLength(4)\nexpect(screen.getByText("Reformer")).toBeInTheDocument()',
        },
        {
          name: "lista je grid sa dve kolone",
          code: 'await render(App)\nexpect(screen.getByRole("list")).toHaveClass("grid", "grid-cols-2")',
        },
        {
          name: "između polja ima razmak (gap-…)",
          code: 'await render(App)\nexpect(screen.getByRole("list")).toHaveClass(/^gap-/)',
        },
        {
          name: "svaka stavka ima p-…, rounded-… i border",
          code: 'await render(App)\nfor (const li of screen.getAllByRole("listitem")) {\n  expect(li).toHaveClass(/^p-/, /^rounded(-.+)?$/, "border")\n}',
        },
      ],
      hints: [
        "Na `<ul>`: `className=\"grid grid-cols-2 gap-3\"`.",
        "Unutar `<ul>`: `{studiji.map((s) => <li key={s} className=\"…\">{s}</li>)}`. Ne zaboravi `key`.",
      ],
      explanation:
        "Kad promeniš `grid-cols-2` u `grid-cols-4`, cela mreža se preuredi bez ijedne druge izmene. Sledeća lekcija pokazuje kako se to radi samo na širim ekranima (`md:grid-cols-4`).",
    },
    {
      kind: "quiz",
      id: "tw-osnove-quiz",
      questions: [
        {
          q: "Koliko piksela je `p-4`?",
          options: ["16px", "4px", "40px", "4rem"],
          answer: 0,
          why: "Tailwind-ova skala: 1 = 0.25rem = 4px, pa je 4 × 4 = 16px.",
        },
        {
          q: "Šta znači `border-ink-900/10`?",
          options: [
            "Ivica u boji ink-900 sa 10% neprozirnosti",
            "Ivica debljine 10px",
            "Deset ivica",
            "Ivica samo sa 10% strana",
          ],
          answer: 0,
          why: "Kosa crta posle boje je providnost: `/10` je 10%, `/50` je pola.",
        },
        {
          q: "Kada se koriste uglaste zagrade, kao u `text-[13px]`?",
          options: [
            "Kad tačna vrednost ne postoji na Tailwind skali",
            "Kad je klasa obavezna",
            "Za klase koje rade samo na mobilnom",
            "Za boje iz CSS fajla",
          ],
          answer: 0,
          why: "To je \"arbitrary value\": vrednost koju upisuješ ručno, kad ti treba nešto van skale.",
        },
        {
          q: "Koja kombinacija stavlja naslov levo, a dugme desno, oba centrirana po visini?",
          options: [
            "`flex items-center justify-between`",
            "`grid grid-cols-2`",
            "`flex flex-col`",
            "`text-left text-right`",
          ],
          answer: 0,
          why: "`flex` ređa u red, `items-center` poravnava po visini, a `justify-between` gura decu ka ivicama.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-tw-osnove-1",
      front: "Šta je Tailwind CSS?",
      back: "Skup malih \"utility\" klasa, od kojih svaka radi jednu stvar (`p-4`, `rounded-full`, `font-bold`). Stil se slaže direktno u `className`.",
    },
    {
      id: "fc-tw-osnove-2",
      front: "Kolika je jedinica Tailwind skale?",
      back: "`1` = 0.25rem = **4px**. `p-4` = 16px, `gap-3` = 12px, `h-11` = 44px.",
    },
    {
      id: "fc-tw-osnove-3",
      front: "Šta radi `flex items-center justify-between`?",
      back: "Ređa decu u red, centrira ih po visini i gura prvo dete levo, a poslednje desno.",
    },
    {
      id: "fc-tw-osnove-4",
      front: "Šta znače `text-[13px]` i `bg-black/50`?",
      back: "`[13px]` je tačna vrednost van skale, a `/50` je boja sa 50% neprozirnosti.",
    },
  ],
};

export default lesson;
