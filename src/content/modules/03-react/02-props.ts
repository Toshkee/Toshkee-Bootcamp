import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "props",
  title: "Props: podaci koji ulaze u komponentu",
  summary:
    "Kako komponenta prima podatke spolja, kako se props tipizuju, šta je `children` i kako dete javlja roditelju da se nešto desilo, na primerima `Badge`-a i `Chip`-a iz tvojih projekata.",
  minutes: 20,
  projects: ["ReformStudio", "Looply"],
  blocks: [
    {
      kind: "prose",
      md: `U prošloj lekciji \`Termin\` je bio nacrtan dva puta, ali je oba puta prikazao isto: *Fitness · 18:00*. To nije mnogo korisno. Prava lista termina ima Pilates u 18:00, Fitness u 19:30, Jogu sutra ujutru…

Rešenje su **props** (skraćeno od *properties*). Props su **podaci koje komponenta dobija spolja**, od onoga ko je crta. Ista komponenta, različiti podaci, različit prikaz.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao formular za rezervaciju",
      md: "Recepcija u studiju ima jedan isti formular za svaku rezervaciju. Formular je **komponenta**, a ono što se upiše u polja (ime, termin, datum) su **props**. Formular se ne menja, menja se samo ono što se u njega upiše.",
    },
    {
      kind: "prose",
      md: `### Props su parametri funkcije

Komponenta je funkcija, pa je logično da podatke prima kao **parametar**. Kad napišeš atribute na tagu, React ih spakuje u jedan objekat i prosledi ga tvojoj funkciji:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Termin.tsx",
      code: `function Termin(props: { naziv: string; vreme: string }) {
  return (
    <div className="card">
      <h3>{props.naziv}</h3>
      <p>{props.vreme}</p>
    </div>
  )
}

// Ovo:
<Termin naziv="Pilates" vreme="18:00" />
// React pretvara u poziv:
Termin({ naziv: "Pilates", vreme: "18:00" })`,
      highlight: [1, 11, 13],
      caption:
        "Svi atributi završe u **jednom objektu**, koji se po dogovoru zove `props`. Stringove pišeš pod navodnicima, a sve ostalo (brojeve, `true`, funkcije, objekte) u `{ }`: `kapacitet={6}`.",
    },
    {
      kind: "prose",
      md: `### Destrukturiranje u potpisu

Pisati \`props.\` ispred svega brzo dosadi. Zato skoro svaka komponenta u tvojim projektima **raspakuje props odmah u potpisu funkcije**, istim destrukturiranjem objekta koje znaš iz JavaScript modula:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Termin.tsx",
      code: `interface TerminProps {
  naziv: string
  vreme: string
  kapacitet: number
  napomena?: string        // opciono: ne mora da se prosledi
  ton?: "brand" | "muted"  // opciono, sa podrazumevanom vrednošću ispod
}

function Termin({ naziv, vreme, kapacitet, napomena, ton = "brand" }: TerminProps) {
  return (
    <div className="card">
      <h3>{naziv}</h3>
      <p>{vreme} · {kapacitet} mesta · {ton}</p>
      {napomena && <p className="muted">{napomena}</p>}
    </div>
  )
}`,
      highlight: [1, 5, 6, 9],
      caption:
        "Interfejs opisuje props, a `{ naziv, vreme, … }` ih raspakuje. `ton = \"brand\"` je **podrazumevana vrednost**: ako pozivalac ne prosledi `ton`, biće `\"brand\"`.",
    },
    {
      kind: "prose",
      md: `Tipizovani props su ugovor između komponente i onoga ko je koristi. TypeScript ga proverava na **mestu korišćenja**:

- \`<Termin naziv="Pilates" vreme="18:00" />\` → greška: *Property 'kapacitet' is missing*
- \`<Termin naziv="Pilates" vreme="18:00" kapacitet="6" />\` → greška: string nije \`number\`
- \`<Termin … ton="crvena" />\` → greška: \`"crvena"\` nije \`"brand" | "muted"\`

Za props možeš da koristiš i \`interface\` i \`type\`, rade isto. ReformStudio uglavnom koristi \`interface ImeProps\`, a za komponente sa jednim propom piše tip direktno u potpisu, kao \`StudioPill\`: \`({ studioId }: { studioId: StudioId })\`.`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Opciono ili podrazumevano?",
      md: "`napomena?: string` znači da prop može da izostane, pa je unutar komponente tip `string | undefined`. Kad dodaš podrazumevanu vrednost u destrukturiranju (`ton = \"brand\"`), unutar komponente je uvek definisan i ne moraš da proveravaš `undefined`.",
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: "src/components/Badge.tsx",
      lang: "tsx",
      startLine: 1,
      intro:
        "Ceo `Badge` iz ReformStudija: mali bedž koji vidiš na karticama termina (\"Za 2 dana\", \"Stalni termin\"). Za 33 linije pokazuje skoro sve iz ove lekcije.",
      code: `import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'dark' | 'brand' | 'accent' | 'muted' | 'outline' | 'danger'

const tones: Record<BadgeTone, string> = {
  dark: 'bg-ink-900 text-brand-50',
  brand: 'bg-brand-200 text-ink-900',
  accent: 'bg-brand-100 text-brand-700',
  muted: 'bg-ink-100 text-ink-600',
  outline: 'border border-ink-900/15 text-ink-700',
  danger: 'bg-danger-100 text-danger-700',
}

interface BadgeProps {
  tone?: BadgeTone
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export const Badge = ({ tone = 'brand', icon, className, children }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex min-h-6 shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide whitespace-nowrap',
      tones[tone],
      className,
    )}
  >
    {icon}
    {children}
  </span>
)
`,
      steps: [
        {
          lines: 4,
          md: "Union tip sa šest dozvoljenih tonova. Zbog njega `<Badge tone=\"plava\">` ne prolazi: editor odmah kaže da `\"plava\"` nije `BadgeTone`.",
        },
        {
          lines: [6, 13],
          md: "`Record<BadgeTone, string>` je mapa: za svaki ton po jedan string sa klasama. Ako dodaš novi ton u union, a zaboraviš ga ovde, TypeScript prijavi grešku. Same klase su **Tailwind**, o njemu u modulu o stilovima.",
        },
        {
          lines: [15, 20],
          md: "Ugovor komponente. Tri propa su opciona (`?`), a samo `children` je obavezan: bedž bez teksta nema smisla. `ReactNode` je tip za \"bilo šta što React ume da nacrta\": tekst, broj, JSX, `null`.",
        },
        {
          lines: 22,
          md: "Destrukturiranje u potpisu, sa podrazumevanom vrednošću `tone = 'brand'`. Zato `<Badge>Novo</Badge>` radi i bez tona.",
        },
        {
          lines: [24, 28],
          md: "`tones[tone]` izabere klase za dati ton. `cn(...)` spaja osnovne klase, klase tona i `className` koji je pozivalac eventualno prosledio, pa bedž može da se doradi spolja bez menjanja komponente.",
        },
        {
          lines: [30, 31],
          md: "Ikonica (ako postoji) pa `children`, ono što je pozivalac napisao **između** `<Badge>` i `</Badge>`.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### \`children\`: ono između tagova

Neke props ne pišeš kao atribut, nego **između otvarajućeg i zatvarajućeg taga**. React to automatski prosledi kao prop \`children\`. Evo kako \`BookingCard\` koristi \`Badge\`:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/components/BookingCard.tsx (isečak)",
      code: `<Badge tone="accent" icon={<Clock size={11} strokeWidth={2.5} />}>
  {formatCountdown(start, now)}
</Badge>
{/* Upisao ga je stalni termin (SPEC → D19): sljedeće nedelje opet je tu. */}
{booking.source === 'fixed' && <Badge tone="muted">{t.bookings.fixed}</Badge>}`,
      highlight: [2, 5],
      caption:
        "Sve između `<Badge>` i `</Badge>` stiže kao `children`. Primeti i da `icon` prima ceo JSX element: props mogu da budu bilo koja vrednost, pa i komponenta.",
    },
    {
      kind: "prose",
      md: `Zahvaljujući \`children\`, komponenta postaje **omotač**: ona odredi izgled (okvir, boju, razmak), a sadržaj prepusti pozivaocu. Tako rade kartice, modali, \`BottomSheet\` u ReformStudiju i \`Card\` u Looply-ju.

Tip za \`children\` je skoro uvek \`ReactNode\`, koji uvoziš iz Reacta: \`import type { ReactNode } from "react"\`.`,
    },
    {
      kind: "playground",
      id: "react-props-peskovnik",
      title: "Jedna komponenta, mnogo prikaza",
      prompt:
        "Menjaj props na `<Kartica>` i `<Bedz>` u `App`. Probaj da obrišeš `naziv` sa jedne kartice ili da staviš `kapacitet=\"6\"` (string) i vidi šta TypeScript kaže. Dodaj i treću karticu.",
      lang: "tsx",
      code: `import type { ReactNode } from "react"

interface BedzProps {
  boja?: string
  children: ReactNode
}

function Bedz({ boja = "teal", children }: BedzProps) {
  return <span className="badge" style={{ background: boja }}>{children}</span>
}

interface KarticaProps {
  naziv: string
  vreme: string
  kapacitet: number
  children?: ReactNode
}

function Kartica({ naziv, vreme, kapacitet, children }: KarticaProps) {
  return (
    <div className="card stack">
      <h3>{naziv}</h3>
      <p className="muted">{vreme} · {kapacitet} mesta</p>
      {children}
    </div>
  )
}

function App() {
  return (
    <div className="stack">
      <Kartica naziv="Pilates" vreme="18:00" kapacitet={6}>
        <Bedz>Za 2 dana</Bedz>
      </Kartica>
      <Kartica naziv="Fitness" vreme="19:30" kapacitet={8}>
        <Bedz boja="crimson">Popunjeno</Bedz>
      </Kartica>
    </div>
  )
}
`,
    },
    {
      kind: "prose",
      md: `### Funkcije kao props: dete javlja roditelju

Props nisu samo podaci za prikaz. Kad prosleđuješ **funkciju**, dete može da je pozove kad se nešto desi, na primer kad korisnik klikne. Pogledaj props kartice rezervacije u ReformStudiju:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "src/components/BookingCard.tsx (isečak)",
      code: `interface BookingCardProps {
  booking: Booking
  /** Naziv tipa treninga. */
  title: string
  now: Date
  onCancel: () => void
  onReschedule: () => void
}`,
      highlight: [6, 7],
      caption:
        "`onCancel` i `onReschedule` su funkcije. Kartica ih samo **prosledi** svojim dugmićima: `onClick={onCancel}`. Šta tačno otkazivanje radi (pita za potvrdu, zove server) odlučuje ekran koji crta karticu.",
    },
    {
      kind: "prose",
      md: `Ovo je jedan od najvažnijih obrazaca u Reactu. Kartica **ne zna** šta znači otkazati termin. Ona samo kaže "kliknuto je". Zato je možeš koristiti na ekranu za člana i na ekranu za admina, a svaki ekran prosledi svoju funkciju.

Po dogovoru, takvi props počinju sa **\`on\`**: \`onCancel\`, \`onChange\`, \`onPress\`, \`onClose\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kao zvono na vratima",
      md: "Zvono ne zna ko je u kući ni šta će se desiti kad zazvoni. Ono samo javi \"neko je pritisnuo\". Ko čuje zvono, odluči da li otvara vrata. Dugme je zvono, a funkcija koju mu proslediš kroz props je onaj ko otvara.",
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Česta greška: pozvati umesto proslediti",
      md: "`onClick={onCancel}` prosleđuje funkciju, pa se poziva tek na klik. `onClick={onCancel()}` je poziva **odmah, pri crtanju**, i prosleđuje njen rezultat (`undefined`). Kad treba da pošalješ argument, obmotaj poziv u arrow funkciju: `onClick={() => onCancel(booking.id)}`.",
    },
    {
      kind: "prose",
      md: `### Props su samo za čitanje

Komponenta **nikad ne menja svoje props**. \`naziv = "Novo"\` ili \`props.kapacitet++\` unutar komponente je greška: ti podaci pripadaju roditelju. Ako nešto treba da se promeni, dete pozove funkciju koju je dobilo (\`onCancel\`), a roditelj promeni svoje podatke i ponovo nacrta dete sa novim props.

To se zove **jednosmerni tok podataka**: podaci teku **naniže** kroz props, a događaji idu **naviše** kroz funkcije. Kad nešto na ekranu nije kako treba, uvek znaš u kom smeru da tražiš.`,
    },
    {
      kind: "fromYourCode",
      project: "Looply",
      file: "src/components/ui/Chip.tsx",
      lang: "tsx",
      startLine: 11,
      intro:
        "Looply je React Native, ali props rade potpuno isto. Ovo je `Chip`, dugmence koje biraš u onboardingu (\"Netflix\", \"Spotify\"…). Tagovi su `Pressable` i `AppText` umesto `button` i `span`, a `onPress` je mobilni `onClick`.",
      code: `interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
  /** Custom leading content (e.g. a logo); takes precedence over \`icon\`. */
  leading?: ReactNode;
  accessibilityLabel?: string;
}

export function Chip({ label, selected = false, onPress, icon, leading, accessibilityLabel }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : pressed ? colors.surfacePressed : colors.surfaceMuted,
        },
      ]}
    >
      {leading ?? (icon ? <Icon name={icon} size={16} color={selected ? colors.onPrimary : colors.textSecondary} /> : null)}
      <AppText variant="label" tone={selected ? 'onPrimary' : 'primary'} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}
`,
      steps: [
        {
          lines: [1, 9],
          md: "Ugovor: obavezni su samo `label` i `onPress`. `selected` je `boolean`, `leading` je `ReactNode` (npr. logo servisa), a `onPress` je funkcija koja ništa ne vraća.",
        },
        {
          lines: 11,
          md: "Klasična `function` deklaracija umesto arrow funkcije, isti efekat. `selected = false` je podrazumevana vrednost, pa unutar komponente nikad nije `undefined`.",
        },
        {
          lines: [18, 21],
          md: "Chip na dodir prvo kratko zavibrira (`haptics`), pa pozove **roditeljev** `onPress()`. Šta se dalje dešava (da li se servis dodaje u listu) zna samo onboarding ekran.",
        },
        {
          lines: 26,
          md: "Prop `selected` odlučuje o boji. Chip sam ne pamti da li je izabran: to mu svaki put kaže roditelj. Kako roditelj to pamti, vidiš u lekciji o state-u.",
        },
        {
          lines: [30, 33],
          md: "`leading ?? (…)`: ako je prosleđen `leading`, prikaži njega, inače ikonicu (ako postoji). Ispod je `{label}`, isto kao `{title}` u ReformStudiju.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Prosledi ostatak: \`...rest\`

Ponekad komponenta treba da primi i **sve standardne atribute** elementa koji crta (\`style\`, \`aria-*\`, \`disabled\`, \`type\`…), a da ih ne nabraja jedan po jedan. Za to služi rest destrukturiranje. Looply \`Card\` uzme ono što mu treba, a ostatak prosledi \`View\`-u:`,
    },
    {
      kind: "code",
      lang: "tsx",
      filename: "Looply · src/components/ui/Card.tsx (isečak)",
      code: `interface CardProps extends ViewProps {
  padded?: boolean;
}

/** A raised surface with the theme's soft drop shadow. */
export function Card({ padded = true, style, ...rest }: CardProps) {
  const { colors, shadows } = useTheme();
  return (
    <View
      {...rest}
      style={[`,
      highlight: [1, 6, 10],
      caption:
        "`extends ViewProps` kaže: Card prima sve što prima `View`, plus `padded`. `...rest` skupi sve ostale props, a `{...rest}` ih raširi na `View`. ReformStudio `Button` radi isto sa `extends ButtonHTMLAttributes<HTMLButtonElement>` i `{...props}`.",
    },
    {
      kind: "exercise",
      id: "react-props-1",
      title: "Termin koji prima podatke",
      lang: "tsx",
      prompt: `\`Termin\` uvek prikazuje *Fitness* u *18:00*. Nauči ga da prima podatke:

1. Napiši interfejs \`TerminProps\` sa poljima \`naziv\` i \`vreme\` (oba \`string\`).
2. Neka \`Termin\` destrukturira props u potpisu i prikaže \`naziv\` u \`<h3>\`, a \`vreme\` u \`<p>\`.
3. U \`App\` prikaži dva termina: **Fitness** u **18:00** i **Pilates** u **19:30**.`,
      starter: `// 1. Interfejs TerminProps


function Termin() {
  return (
    <div className="card">
      <h3>Fitness</h3>
      <p className="muted">18:00</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <Termin />
      <Termin />
    </div>
  )
}
`,
      solution: `interface TerminProps {
  naziv: string
  vreme: string
}

function Termin({ naziv, vreme }: TerminProps) {
  return (
    <div className="card">
      <h3>{naziv}</h3>
      <p className="muted">{vreme}</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <Termin naziv="Fitness" vreme="18:00" />
      <Termin naziv="Pilates" vreme="19:30" />
    </div>
  )
}
`,
      tests: [
        {
          name: "Termin prikazuje naziv i vreme koje dobije",
          code: 'await render(Termin, { naziv: "Joga", vreme: "07:00" })\nexpect(screen.getByRole("heading", { name: "Joga" })).toBeInTheDocument()\nexpect(screen.getByText("07:00")).toBeInTheDocument()',
        },
        {
          name: "App prikazuje Fitness u 18:00",
          code: 'await render(App)\nexpect(screen.getByRole("heading", { name: "Fitness" })).toBeInTheDocument()\nexpect(screen.getByText("18:00")).toBeInTheDocument()',
        },
        {
          name: "App prikazuje Pilates u 19:30",
          code: 'await render(App)\nexpect(screen.getByRole("heading", { name: "Pilates" })).toBeInTheDocument()\nexpect(screen.getByText("19:30")).toBeInTheDocument()',
        },
      ],
      hints: [
        "Interfejs: `interface TerminProps { naziv: string; vreme: string }`.",
        "Potpis komponente: `function Termin({ naziv, vreme }: TerminProps)`, a u JSX-u `{naziv}` i `{vreme}` umesto upisanog teksta.",
        "U `App`: `<Termin naziv=\"Fitness\" vreme=\"18:00\" />` i isto za Pilates.",
      ],
      explanation:
        "Komponenta je napisana jednom, a props odluče šta prikazuje. Ovako ReformStudio crta celu listu termina od jedne `BookingCard` komponente.",
    },
    {
      kind: "exercise",
      id: "react-props-2",
      title: "Bedž sa tonom i children",
      lang: "tsx",
      prompt: `Napravi \`Bedz\`, po uzoru na \`Badge\` iz ReformStudija:

- prop \`ton\` je **opcioni**, tipa \`Ton\`, sa podrazumevanom vrednošću \`"brand"\`
- tekst bedža stiže kao \`children\` (tip \`ReactNode\`)
- bedž je \`<span className="badge">\` čija je pozadina boja iz mape: \`style={{ background: boje[ton] }}\`

U \`App\` prikaži **Slobodno** (bez tona) i **Popunjeno** (ton \`"danger"\`).`,
      starter: `import type { ReactNode } from "react"

type Ton = "brand" | "muted" | "danger"

const boje: Record<Ton, string> = {
  brand: "teal",
  muted: "gray",
  danger: "crimson",
}

// Napiši interfejs BedzProps i komponentu Bedz ovde
function Bedz() {
  return <span className="badge">?</span>
}

export default function App() {
  return (
    <div className="row">
      <Bedz />
      <Bedz />
    </div>
  )
}
`,
      solution: `import type { ReactNode } from "react"

type Ton = "brand" | "muted" | "danger"

const boje: Record<Ton, string> = {
  brand: "teal",
  muted: "gray",
  danger: "crimson",
}

interface BedzProps {
  ton?: Ton
  children: ReactNode
}

function Bedz({ ton = "brand", children }: BedzProps) {
  return (
    <span className="badge" style={{ background: boje[ton] }}>
      {children}
    </span>
  )
}

export default function App() {
  return (
    <div className="row">
      <Bedz>Slobodno</Bedz>
      <Bedz ton="danger">Popunjeno</Bedz>
    </div>
  )
}
`,
      tests: [
        {
          name: "Bedz prikazuje children",
          code: 'await render(Bedz, { ton: "muted", children: "Stalni termin" })\nexpect(screen.getByText("Stalni termin")).toBeInTheDocument()',
        },
        {
          name: "ton bira boju iz mape",
          code: 'await render(Bedz, { ton: "danger", children: "Popunjeno" })\nexpect(screen.getByText("Popunjeno").style.backgroundColor).toBe("crimson")',
        },
        {
          name: "bez tona je podrazumevano \"brand\"",
          code: 'await render(Bedz, { children: "Novo" })\nexpect(screen.getByText("Novo").style.backgroundColor).toBe("teal")',
        },
        {
          name: "App prikazuje Slobodno i Popunjeno",
          code: 'await render(App)\nexpect(screen.getByText("Slobodno").style.backgroundColor).toBe("teal")\nexpect(screen.getByText("Popunjeno").style.backgroundColor).toBe("crimson")',
        },
      ],
      hints: [
        "Interfejs: `interface BedzProps { ton?: Ton; children: ReactNode }`.",
        "Podrazumevana vrednost ide u destrukturiranje: `function Bedz({ ton = \"brand\", children }: BedzProps)`.",
        "U JSX-u: `<span className=\"badge\" style={{ background: boje[ton] }}>{children}</span>`, a u `App`: `<Bedz ton=\"danger\">Popunjeno</Bedz>`.",
      ],
      explanation:
        "Isti obrazac kao `Badge` u ReformStudiju: union tip ograniči tonove, `Record` mapa ih prevede u izgled, podrazumevana vrednost pokrije najčešći slučaj, a `children` ostavi sadržaj pozivaocu.",
    },
    {
      kind: "exercise",
      id: "react-props-3",
      title: "Dugme koje javlja roditelju",
      lang: "tsx",
      prompt: `\`KarticaTermina\` ima dugme **Otkaži** koje ništa ne radi. Dodaj joj dva propa:

- \`onOtkazi: () => void\` — funkcija koja se poziva **na klik** dugmeta
- \`mozeOtkazati?: boolean\` — opciono, podrazumevano \`true\`; kad je \`false\`, dugme je onemogućeno (\`disabled\`)

Pa u \`App\`: prva kartica (**Fitness**) na otkazivanje ispiše \`console.log("Otkazujem: Fitness")\`, a druga (**Pilates**) ne može da se otkaže.`,
      starter: `interface KarticaTerminaProps {
  naziv: string
}

function KarticaTermina({ naziv }: KarticaTerminaProps) {
  return (
    <div className="card row">
      <strong>{naziv}</strong>
      <button className="secondary">Otkaži</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <KarticaTermina naziv="Fitness" />
      <KarticaTermina naziv="Pilates" />
    </div>
  )
}
`,
      solution: `interface KarticaTerminaProps {
  naziv: string
  onOtkazi: () => void
  mozeOtkazati?: boolean
}

function KarticaTermina({ naziv, onOtkazi, mozeOtkazati = true }: KarticaTerminaProps) {
  return (
    <div className="card row">
      <strong>{naziv}</strong>
      <button className="secondary" onClick={onOtkazi} disabled={!mozeOtkazati}>
        Otkaži
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div className="stack">
      <KarticaTermina naziv="Fitness" onOtkazi={() => console.log("Otkazujem: Fitness")} />
      <KarticaTermina naziv="Pilates" onOtkazi={() => console.log("Otkazujem: Pilates")} mozeOtkazati={false} />
    </div>
  )
}
`,
      tests: [
        {
          name: "klik na Otkaži poziva onOtkazi tačno jednom",
          code: 'let pozivi = 0\nawait render(KarticaTermina, { naziv: "Joga", onOtkazi: () => { pozivi++ } })\nexpect(pozivi).toBe(0)\nawait click(screen.getByRole("button", { name: "Otkaži" }))\nexpect(pozivi).toBe(1)',
        },
        {
          name: "bez mozeOtkazati dugme je aktivno",
          code: 'await render(KarticaTermina, { naziv: "Joga", onOtkazi: () => {} })\nexpect(screen.getByRole("button", { name: "Otkaži" })).not.toBeDisabled()',
        },
        {
          name: "mozeOtkazati={false} onemogući dugme",
          code: 'await render(KarticaTermina, { naziv: "Joga", onOtkazi: () => {}, mozeOtkazati: false })\nexpect(screen.getByRole("button", { name: "Otkaži" })).toBeDisabled()',
        },
        {
          name: "u App, Fitness ispisuje \"Otkazujem: Fitness\", a Pilates je onemogućen",
          code: 'await render(App)\nconst [fitness, pilates] = screen.getAllByRole("button", { name: "Otkaži" })\nawait click(fitness)\nexpect(logs).toContain("Otkazujem: Fitness")\nexpect(pilates).toBeDisabled()',
        },
      ],
      hints: [
        "Dodaj u interfejs `onOtkazi: () => void` i `mozeOtkazati?: boolean`, pa ih raspakuj u potpisu: `{ naziv, onOtkazi, mozeOtkazati = true }`.",
        "Na dugme: `onClick={onOtkazi}` (bez zagrada!) i `disabled={!mozeOtkazati}`.",
        "U `App`: `onOtkazi={() => console.log(\"Otkazujem: Fitness\")}`, a za Pilates još i `mozeOtkazati={false}`.",
      ],
      explanation:
        "Kartica ne zna šta znači otkazati, samo javi da je kliknuto. Isto radi `BookingCard` u ReformStudiju sa `onCancel` i `disabled={!allowed}`: odluku i posledice drži ekran iznad nje.",
    },
    {
      kind: "quiz",
      id: "react-props-quiz",
      questions: [
        {
          q: "Šta React prosledi komponenti kad napišeš `<Termin naziv=\"Joga\" kapacitet={6} />`?",
          options: [
            "Jedan objekat: `{ naziv: \"Joga\", kapacitet: 6 }`",
            "Dva odvojena argumenta: `\"Joga\"` i `6`",
            "String `\"naziv=Joga kapacitet=6\"`",
            "Ništa, komponenta sama čita atribute iz DOM-a",
          ],
          answer: 0,
          why: "Svi atributi se spakuju u jedan objekat (props), koji je prvi i jedini parametar komponente. Zato ga možeš destrukturirati u potpisu.",
        },
        {
          q: "Kako unutar komponente dobiti tekst iz `<Badge>Novo</Badge>`?",
          options: [
            "Preko propa `children`",
            "Preko propa `text`",
            "Preko propa `label`",
            "Nikako, tekst između tagova se ignoriše",
          ],
          answer: 0,
          why: "Sve između otvarajućeg i zatvarajućeg taga React prosledi kao `children`. Tip mu je obično `ReactNode`.",
        },
        {
          q: "Šta je problem sa ovim kodom?",
          code: `<button onClick={onOtkazi()}>Otkaži</button>`,
          codeLang: "tsx",
          options: [
            "`onOtkazi` se poziva odmah pri crtanju, a ne na klik",
            "Ništa, to je ispravan način",
            "`onClick` mora da primi string",
            "Funkcije ne smeju da se prosleđuju kroz props",
          ],
          answer: 0,
          why: "Zagrade pozivaju funkciju. Treba `onClick={onOtkazi}`, ili `onClick={() => onOtkazi(id)}` kad treba argument.",
        },
        {
          q: "Komponenta `Termin` treba da promeni broj slobodnih mesta koji je dobila kroz props. Šta je ispravno?",
          options: [
            "Pozove funkciju koju je dobila od roditelja, a roditelj promeni podatke",
            "`props.slobodno = props.slobodno - 1`",
            "Promeni promenljivu u destrukturiranju: `slobodno--`",
            "Ponovo nacrta samu sebe sa novim props",
          ],
          answer: 0,
          why: "Props su samo za čitanje i pripadaju roditelju. Podaci teku naniže, a događaji naviše: dete javi, roditelj menja.",
        },
        {
          q: "Šta znači `tone = 'brand'` u `({ tone = 'brand', children }: BadgeProps)`?",
          options: [
            "Ako `tone` nije prosleđen, vrednost je `'brand'`",
            "`tone` uvek mora da bude `'brand'`",
            "Proverava da li je `tone` jednak `'brand'`",
            "Menja prop koji je roditelj prosledio",
          ],
          answer: 0,
          why: "To je podrazumevana vrednost iz destrukturiranja. Važi samo kad je prop izostavljen (ili `undefined`).",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-react-props-1",
      front: "Šta su props?",
      back: "Podaci koje komponenta dobija od onoga ko je crta. Stižu kao **jedan objekat**, prvi parametar funkcije: `function Termin({ naziv }: TerminProps)`.",
    },
    {
      id: "fc-react-props-2",
      front: "Šta je `children` i koji mu je tip?",
      back: "Sadržaj napisan između tagova komponente: `<Badge>Novo</Badge>`. Tip je obično `ReactNode` iz `react`.",
    },
    {
      id: "fc-react-props-3",
      front: "Kako dete javlja roditelju da se nešto desilo?",
      back: "Roditelj prosledi funkciju kroz props (`onCancel`, `onPress`), a dete je pozove: `onClick={onCancel}`.",
    },
    {
      id: "fc-react-props-4",
      front: "Šta je jednosmerni tok podataka?",
      back: "Podaci teku **naniže** kroz props (samo za čitanje), a događaji **naviše** kroz funkcije. Dete nikad ne menja svoje props.",
    },
    {
      id: "fc-react-props-5",
      front: "Čemu služi `...rest` u `({ padded, style, ...rest }: CardProps)`?",
      back: "Skupi sve ostale props u jedan objekat, koji se onda raširi na element: `<View {...rest} />`. Tako komponenta prima sve standardne atribute bez nabrajanja.",
    },
  ],
};

export default lesson;
