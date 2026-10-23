import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "git",
  title: "Git: istorija tvog koda",
  summary:
    "Kako git pamti svaku verziju projekta: status, add, commit, log, diff, grane i .gitignore, plus razlika između git-a i GitHub-a.",
  minutes: 20,
  projects: ["ReformStudio", "PlazaHome"],
  blocks: [
    {
      kind: "prose",
      md: `U lekciji o terminalu \`ls -la\` je u ReformStudiju pokazao skriven folder \`.git\`. U njemu živi **cela istorija projekta**: svaka verzija svakog fajla, od prvog dana.

**Git** je program koji tu istoriju vodi. Kad kažeš "zapamti ovo stanje", git napravi **commit**: snimak celog projekta u tom trenutku, sa porukom šta je promenjeno, ko je to uradio i kada. ReformStudio trenutno ima 56 takvih snimaka.

Zašto je to važno? Zato što možeš:

- da vidiš **šta se tačno promenilo** između dve verzije
- da se **vratiš** na verziju koja je radila, ako nešto pokvariš
- da probaš nešto rizično **na strani** (u grani), bez diranja koda koji radi`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Sačuvane pozicije u igrici",
      md: `Commit je kao "save" u video igrici pred teškog bosa. Ako izgubiš, ne krećeš od početka, nego od poslednjeg save-a. Razlika je što git pamti **sve** save-ove zauvek, i uz svaki stoji kratka beleška šta se desilo.`,
    },
    {
      kind: "prose",
      md: `### Tri mesta na kojima fajl može biti

Ovo je ključni koncept git-a, i zbog njega početnicima git deluje zbunjujuće:

1. **Radni folder** (*working directory*): fajlovi koje vidiš i menjaš u editoru.
2. **Staging** (*staging area*): "korpa" sa izmenama izabranim za sledeći commit. U nju ih stavljaš komandom \`git add\`.
3. **Repozitorijum**: istorija commit-ova u \`.git\` folderu. Sadržaj korpe tu ulazi komandom \`git commit\`.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Pakovanje paketa",
      md: `Radni folder je sto pun stvari. \`git add\` je stavljanje izabranih stvari u kutiju. \`git commit -m "..."\` je zatvaranje kutije, lepljenje etikete i slanje u arhivu. Na stolu može ostati još stvari koje ne idu u ovaj paket, i to je u redu.`,
    },
    {
      kind: "code",
      lang: "bash",
      code: `git status                # šta je promenjeno i šta je u korpi?
git add src/App.tsx       # stavi jedan fajl u korpu
git add .                 # stavi SVE promene iz ovog foldera u korpu
git commit -m "poruka"    # napravi commit od onoga što je u korpi
git log --oneline         # istorija, jedan commit po redu`,
      caption:
        "Ciklus koji ćeš ponavljati hiljadu puta. `#` u terminalu počinje komentar: terminal ignoriše sve posle njega.",
    },
    {
      kind: "terminal",
      id: "osnove-git-prvi-commit",
      title: "Prvi commit",
      intro:
        "Vrati se u folder `vezbe` iz lekcije o terminalu. U njemu je fajl `beleske.md`. Pretvori folder u git repozitorijum i napravi prvi commit.",
      cwd: "~/vezbe",
      steps: [
        {
          task: "Napravi nov git repozitorijum u ovom folderu.",
          accept: ["git\\s+init"],
          output: "Initialized empty Git repository in /Users/toshkee/vezbe/.git/",
          hint: "`git init`. Ovo samo napravi skriven folder `.git`.",
        },
        {
          task: "Pitaj git šta vidi.",
          accept: ["git\\s+status"],
          output: `On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	beleske.md

nothing added to commit but untracked files present (use "git add" to track)`,
          hint: "`git status`. Ovu komandu kucaj često, ništa ne menja.",
        },
        {
          task: "Stavi `beleske.md` u korpu (staging).",
          accept: ["git\\s+add\\s+(beleske\\.md|\\.|-A|--all)"],
          output: "",
          hint: "`git add beleske.md` (ili `git add .` za sve).",
        },
        {
          task: 'Napravi commit sa porukom `prve beleske`.',
          accept: ["git\\s+commit\\s+-m\\s*[\"']prve\\s+beleske[\"']"],
          output: `[main (root-commit) a1c3f0e] prve beleske
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 beleske.md`,
          hint: 'Poruka ide u navodnike posle `-m`: `git commit -m "prve beleske"`.',
        },
        {
          task: "Pogledaj istoriju, jedan commit po redu.",
          accept: ["git\\s+log\\s+--oneline"],
          output: "a1c3f0e (HEAD -> main) prve beleske",
          hint: "`git log --oneline`",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "main ili master?",
      md: `Glavna grana se zove \`main\` u svim tvojim projektima. Git bez podešavanja (i verzija 2.51 na tvom Mac-u) novu granu i dalje zove \`master\`, uz dugačku \`hint:\` poruku. Na tvom Mac-u je to već podešeno na \`main\`, ali ako ti na drugom računaru \`git init\` napravi \`master\`, jednom pokreni \`git config --global init.defaultBranch main\` i od tada će svaki nov projekat počinjati sa \`main\`.`,
    },
    {
      kind: "prose",
      md: `### Svakodnevni rad: status, diff, commit

Kad radiš u postojećem projektu, ciklus je isti, samo dobija još jedan korak: **pre** commit-a pogledaj šta se tačno promenilo, komandom \`git diff\`.

Diff se čita ovako: red sa \`-\` je **izbačen**, red sa \`+\` je **dodat**. Izmenjen red se prikazuje kao par: stara verzija sa \`-\`, nova sa \`+\`. Redovi bez znaka su okolni kod, tu samo radi konteksta.`,
    },
    {
      kind: "terminal",
      id: "osnove-git-svakodnevno",
      title: "Izmena u ReformStudiju",
      intro:
        "U `src/screens/BookingsScreen.tsx` je dodat još jedan kod greške posle kog nema smisla ponovo pokušati otkazivanje. Proveri i sačuvaj tu izmenu.",
      cwd: "~/ReformStudio",
      steps: [
        {
          task: "Šta git vidi?",
          accept: ["git\\s+status"],
          output: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   src/screens/BookingsScreen.tsx

no changes added to commit (use "git add" and/or "git commit -a")`,
          hint: "`git status`",
        },
        {
          task: "Pogledaj tačno koji redovi su promenjeni.",
          accept: ["git\\s+diff(\\s+src/screens/BookingsScreen\\.tsx)?"],
          output: `diff --git a/src/screens/BookingsScreen.tsx b/src/screens/BookingsScreen.tsx
index 3f2a9c1..8b7d04e 100644
--- a/src/screens/BookingsScreen.tsx
+++ b/src/screens/BookingsScreen.tsx
@@ -23,7 +23,7 @@ import type { Booking } from '@/types'
 type Tab = 'upcoming' | 'past'

 /** Greške poslije kojih ponovni pokušaj nema smisla: rok je prošao ili termina više nema. */
-const FINAL_CODES = new Set<string>(['CANCELLATION_WINDOW', 'SESSION_STARTED', 'NOT_FOUND'])
+const FINAL_CODES = new Set<string>(['CANCELLATION_WINDOW', 'SESSION_STARTED', 'NOT_FOUND', 'SESSION_CANCELLED'])

 export const BookingsScreen = () => {
   const navigate = useNavigate()`,
          hint: "`git diff`. Bez imena fajla prikazuje sve izmene koje još nisu u korpi.",
        },
        {
          task: "Stavi izmenu u korpu.",
          accept: [
            "git\\s+add\\s+(src/screens/BookingsScreen\\.tsx|\\.|-A|--all)",
          ],
          output: "",
          hint: "`git add src/screens/BookingsScreen.tsx`. Tab dopunjava i putanje!",
        },
        {
          task: 'Napravi commit sa porukom `Otkazivanje: otkazan termin je konačna greška`.',
          accept: [
            "git\\s+commit\\s+-m\\s*[\"']Otkazivanje:\\s*otkazan\\s+termin\\s+je\\s+kona(č|c)na\\s+gre(š|s)ka[\"']",
          ],
          output: `[main 4b1e9a2] Otkazivanje: otkazan termin je konačna greška
 1 file changed, 1 insertion(+), 1 deletion(-)`,
          hint: 'Ceo tekst ide u navodnike: `git commit -m "Otkazivanje: otkazan termin je konačna greška"`',
        },
        {
          task: "Pogledaj poslednje commit-ove, jedan po redu.",
          accept: ["git\\s+log\\s+--oneline(\\s+-n?\\s*\\d+)?", "git\\s+log\\s+-n?\\s*\\d+\\s+--oneline"],
          output: `4b1e9a2 (HEAD -> main) Otkazivanje: otkazan termin je konačna greška
09ee7fe (origin/main, origin/HEAD) Greške: AbortError iz Firebase upisa u IndexedDB se više ne prijavljuje
580632a Utisci: kartica na Početnoj se vraća svakih 7 dana, bez krajnjeg datuma
2678c9e Nova lozinka: bez napomene o ćirilici na „Provjeri email”
0d2b20a Utisci: lozinka za Gmail bez razmaka (Google je prikazuje u grupama)
e423641 Utisci: „Pošalji utisak” — poruka stiže mejlom developeru (D20)`,
          hint: "`git log --oneline`",
        },
      ],
    },
    {
      kind: "prose",
      md: `Pogledaj poruke iz prave istorije ReformStudija. Svaka kaže **šta** je promenjeno, često i **zašto**, sa prefiksom koji kaže koji deo aplikacije je u pitanju ("Utisci:", "Greške:"). Za šest meseci, kad tražiš kad se nešto pokvarilo, ovakve poruke vrede zlata. Poruka "fix" ili "izmene" ne govori ništa.

Svaki commit ima i **hash**: \`09ee7fe\` je skraćeni jedinstveni ID tog snimka. Pomoću njega se git-u kaže "pokaži mi taj commit" (\`git show 09ee7fe\`).`,
    },
    {
      kind: "prose",
      md: `### .gitignore: šta git ne sme da vidi

Neki fajlovi **ne smeju** u istoriju: \`node_modules\` (ogroman, uvek se može ponovo instalirati), build folderi (\`dist\`, \`.next\`, \`out\`) i, najvažnije, **tajne**: \`.env\` fajlovi sa API ključevima. Spisak takvih stvari stoji u fajlu \`.gitignore\` u korenu projekta.`,
    },
    {
      kind: "fromYourCode",
      project: "ReformStudio",
      file: ".gitignore",
      lang: "text",
      startLine: 1,
      intro: "Ovo je ceo `.gitignore` ReformStudija. Svaki red je jedno pravilo.",
      code: `# Odobreni UI koncept — samo referenca, ne ulazi u repo
_concept/

node_modules
dist
dev-dist
*.local
# Lažna tajna samo za Functions emulator (utisci, D20) — mora biti u repo-u zbog testova na GitHub-u
!functions/.secret.local
*.tsbuildinfo
.DS_Store
.vite
.vitest

# Tajne — u repo ide samo primjer
.env*
!.env.example


# Firebase
.firebase/
*-debug.log
firebase-export-*/
.emulator-data/
functions/lib/
`,
      steps: [
        {
          lines: [1, 2],
          md: "Red koji počinje sa `#` je komentar. `_concept/` (sa kosom crtom na kraju) znači ceo folder sa tim imenom.",
        },
        {
          lines: [4, 6],
          md: "Ime bez ikakvih znakova poklapa fajl ili folder sa tim imenom **bilo gde** u projektu. Zato jedan red `node_modules` pokriva i `node_modules` u korenu i onaj u `functions/`. `dist` je rezultat `npm run build`.",
        },
        {
          lines: [7, 9],
          md: "`*` je džoker: `*.local` hvata svaki fajl koji se završava na `.local`. A `!` na početku **poništava** pravilo: `functions/.secret.local` ipak ulazi u git, jer je lažna tajna potrebna testovima (komentar objašnjava zašto, što je odlična praksa).",
        },
        {
          lines: [10, 11],
          md: "`*.tsbuildinfo` je keš TypeScript kompajlera. `.DS_Store` je skriven fajl koji macOS ostavlja u svakom folderu otvorenom u Finderu. Nijedan ne pripada projektu.",
        },
        {
          lines: [15, 17],
          md: "Najvažnija dva reda. `.env*` sakriva **sve** `.env` fajlove (`.env.local`, `.env.production`...), jer u njima mogu biti ključevi. `!.env.example` vraća samo primer, u kom piše **koje** promenljive trebaju, ali bez pravih vrednosti.",
        },
        {
          lines: [20, 25],
          md: "Firebase alati prave svoje privremene fajlove: keš deploy-a, log-ove emulatora, izvoz test baze. `functions/lib/` je kompajliran JavaScript iz `functions/src/`, pa se, kao i `dist`, uvek pravi iznova.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Tajna u commit-u ostaje zauvek",
      md: `Ako \`.env\` sa pravim ključem jednom uđe u commit, brisanje fajla u sledećem commit-u **ne pomaže**: ključ i dalje stoji u istoriji, i svako ko ima repozitorijum može da ga pročita. Jedini pravi lek je da ključ **poništiš i napraviš nov** (u Firebase, Anthropic ili Stripe konzoli). Zato pre svakog \`git add .\` pogledaj \`git status\`.`,
    },
    {
      kind: "prose",
      md: `### Grane: rad na strani

**Grana** (*branch*) je paralelna linija istorije. Glavna grana je \`main\` i u njoj je kod koji radi. Kad počinješ nešto veće, recimo stalne termine u ReformStudiju, napraviš novu granu i radiš u njoj. \`main\` ostaje netaknut. Kad je funkcija gotova i proverena, granu **spojiš** (*merge*) nazad u \`main\`.

- \`git branch\` izlistava grane (zvezdica \`*\` je ona u kojoj si)
- \`git switch -c ime\` pravi novu granu i prelazi u nju (\`-c\` = *create*)
- \`git switch ime\` prelazi u postojeću granu
- \`git merge ime\` uvlači commit-ove iz grane \`ime\` u granu u kojoj si sad`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Kopija dokumenta za probu",
      md: `Grana je kao "Duplicate" na Google dokumentu pre velikih izmena: original ostaje čist, a ti slobodno brljaš po kopiji. Razlika je što git na kraju ume **sam** da prenese izmene iz kopije nazad u original, red po red.`,
    },
    {
      kind: "terminal",
      id: "osnove-git-grane",
      title: "Stalni termini u posebnoj grani",
      cwd: "~/ReformStudio",
      intro:
        "Nova funkcija: član se sam upisuje na stalni termin svake nedelje. Radi je u posebnoj grani, pa je spoji u `main`.",
      steps: [
        {
          task: "Pogledaj koje grane postoje.",
          accept: ["git\\s+branch"],
          output: "* main",
          hint: "`git branch`",
        },
        {
          task: "Napravi granu `stalni-termini` i pređi u nju.",
          accept: [
            "git\\s+switch\\s+(-c|--create)\\s+stalni-termini",
            "git\\s+checkout\\s+-b\\s+stalni-termini",
          ],
          output: "Switched to a new branch 'stalni-termini'",
          hint: "`git switch -c stalni-termini` (starija varijanta: `git checkout -b stalni-termini`).",
        },
        {
          task: "Kod je napisan. Stavi sve izmene u korpu.",
          accept: ["git\\s+add\\s+(\\.|-A|--all)"],
          output: "",
          hint: "`git add .`",
        },
        {
          task: 'Napravi commit sa porukom `Stalni termini`.',
          accept: ["git\\s+commit\\s+-m\\s*[\"']Stalni\\s+termini[\"']"],
          output: `[stalni-termini 6b2d1c4] Stalni termini
 4 files changed, 198 insertions(+), 3 deletions(-)
 create mode 100644 src/lib/fixedSlots.test.ts
 create mode 100644 src/lib/fixedSlots.ts`,
          hint: '`git commit -m "Stalni termini"`',
        },
        {
          task: "Vrati se u granu `main`.",
          accept: ["git\\s+(switch|checkout)\\s+main"],
          output: `Switched to branch 'main'
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)`,
          hint: "`git switch main`. Primeti: fajlovi `fixedSlots.ts` sad nestanu iz editora, jer ih `main` još nema.",
        },
        {
          task: "Spoji granu `stalni-termini` u `main`.",
          accept: ["git\\s+merge\\s+stalni-termini"],
          output: `Updating 4b1e9a2..6b2d1c4
Fast-forward
 src/lib/fixedSlots.test.ts     | 87 +++++++++++++++++++++++
 src/lib/fixedSlots.ts          | 94 +++++++++++++++++++++++++
 src/screens/BookingsScreen.tsx |  2 +
 src/types.ts                   | 18 ++++--
 4 files changed, 198 insertions(+), 3 deletions(-)
 create mode 100644 src/lib/fixedSlots.test.ts
 create mode 100644 src/lib/fixedSlots.ts`,
          hint: "Iz `main` grane: `git merge stalni-termini`.",
        },
      ],
    },
    {
      kind: "callout",
      tone: "info",
      title: "Šta je konflikt?",
      md: `Ako su i \`main\` i tvoja grana promenile **isti red** na različite načine, git ne zna koju verziju da uzme i prijavi **merge conflict**. U fajlu se pojave oznake \`<<<<<<<\`, \`=======\` i \`>>>>>>>\` oko obe verzije. Ti izabereš šta ostaje, obrišeš oznake, pa \`git add\` i \`git commit\`. Zvuči strašno, ali je samo pitanje "koja od ove dve?".`,
    },
    {
      kind: "prose",
      md: `### Git nije GitHub

Ovo dvoje se stalno meša:

- **Git** je program na tvom računaru. Radi potpuno bez interneta. Sve što je gore urađeno (commit, grane, merge) desilo se samo lokalno.
- **GitHub** je sajt koji čuva **kopiju** tvog repozitorijuma na internetu. Služi kao rezervna kopija, za deljenje koda i za automatizaciju.

Lokalni repozitorijum i onaj na GitHub-u se sinhronizuju sa tri komande:

- \`git push\` šalje tvoje nove commit-ove na GitHub
- \`git pull\` preuzima tuđe (ili tvoje sa drugog računara) commit-ove sa GitHub-a
- \`git clone adresa\` preuzima ceo repozitorijum prvi put

Kopija na GitHub-u se u git-u zove **\`origin\`**. Zato je u \`git log\` gore pisalo \`origin/main\`: tu je bio GitHub pri poslednjoj sinhronizaciji. Vercel i Cloudflare mogu da prate tvoj GitHub: kad je projekat povezan sa repozitorijumom, čim uradiš \`git push\` na \`main\`, oni sami naprave build i objave sajt. A fajl \`.github/workflows/testovi.yml\` u ReformStudiju kaže GitHub-u da posle svakog push-a na \`main\` (i za svaki pull request) pokrene testove.`,
    },
    {
      kind: "exercise",
      id: "osnove-git-log",
      title: "Pročitaj git log",
      lang: "js",
      prompt: `Izlaz komande \`git log --oneline\` je običan tekst: svaki red je \`hash\`, razmak, pa poruka. Napiši funkciju \`parsirajLog(tekst)\` koja vraća niz objekata \`{ hash, poruka }\`.

Korisni alati:
- \`tekst.split("\\n")\` deli tekst na niz redova
- \`red.indexOf(" ")\` vraća poziciju **prvog** razmaka
- \`red.slice(od, do)\` vraća deo stringa

Pazi: poruka i sama sadrži razmake, pa ne možeš samo da podeliš ceo red po razmaku.`,
      starter: `function parsirajLog(tekst) {
  return tekst.split("\\n")
}

const log = \`09ee7fe Greške: AbortError se više ne prijavljuje
580632a Utisci: kartica se vraća svakih 7 dana
2ccf738 Vrati termin: otkazan termin se može ponovo otvoriti\`

console.log(parsirajLog(log))
`,
      solution: `function parsirajLog(tekst) {
  return tekst
    .trim()
    .split("\\n")
    .map((red) => {
      const i = red.indexOf(" ")
      return { hash: red.slice(0, i), poruka: red.slice(i + 1) }
    })
}

const log = \`09ee7fe Greške: AbortError se više ne prijavljuje
580632a Utisci: kartica se vraća svakih 7 dana
2ccf738 Vrati termin: otkazan termin se može ponovo otvoriti\`

console.log(parsirajLog(log))
`,
      tests: [
        {
          name: "vraća 3 commit-a",
          code: "expect(parsirajLog(log)).toHaveLength(3)",
        },
        {
          name: "prvi commit ima tačan hash i celu poruku",
          code: 'expect(parsirajLog(log)[0]).toEqual({ hash: "09ee7fe", poruka: "Greške: AbortError se više ne prijavljuje" })',
        },
        {
          name: "poslednji commit je ispravan",
          code: 'expect(parsirajLog(log)[2]).toEqual({ hash: "2ccf738", poruka: "Vrati termin: otkazan termin se može ponovo otvoriti" })',
        },
        {
          name: "prazan red na kraju (kao u pravom terminalu) ne pravi lažan commit",
          code: 'expect(parsirajLog("a1c3f0e prve beleske\\n")).toEqual([{ hash: "a1c3f0e", poruka: "prve beleske" }])',
        },
      ],
      hints: [
        "Prvo podeli tekst na redove, pa na niz primeni `.map(red => ...)` da svaki red pretvoriš u objekat.",
        "U `.map` nađi prvi razmak: `const i = red.indexOf(\" \")`. Hash je `red.slice(0, i)`, a poruka `red.slice(i + 1)`.",
        "Za poslednji test: pre `split`-a pozovi `.trim()`, koji skida razmake i prazne redove sa početka i kraja teksta.",
      ],
      explanation:
        "Ovo je tipičan posao za alate koji rade sa git-om (pa i za AI asistente): tekstualni izlaz komande se pretvara u strukturu sa kojom kod može da radi. `indexOf` + `slice` je sigurniji od `split(\" \")`, jer poruka ostaje cela, sa svim svojim razmacima.",
    },
    {
      kind: "quiz",
      id: "osnove-git-quiz",
      questions: [
        {
          q: "Izmenjen je `App.tsx` i urađen `git commit -m \"nova boja\"`, ali git kaže `no changes added to commit`. Šta nedostaje?",
          options: [
            "`git init`",
            "`git add App.tsx` pre commit-a",
            "`git push`",
            "Ništa, commit je uspeo",
          ],
          answer: 1,
          why: "Commit uzima samo ono što je u korpi (staging). Izmena u radnom folderu ne ulazi sama; prvo ide `git add`.",
        },
        {
          q: "U `git diff` izlazu, šta znači red koji počinje sa `+`?",
          options: [
            "Red je dodat",
            "Red je obrisan",
            "Red je važan",
            "Red ima grešku",
          ],
          answer: 0,
          why: "`+` je dodat red, `-` je uklonjen. Izmenjen red se prikazuje kao par: stara verzija sa `-`, nova sa `+`.",
        },
        {
          q: "U `.gitignore` piše `.env*` pa `!.env.example`. Koji fajl **ulazi** u git?",
          options: [
            "`.env.local`",
            "`.env.production`",
            "`.env.example`",
            "Nijedan",
          ],
          answer: 2,
          why: "`.env*` ignoriše sve što počinje sa `.env`, a `!` poništava pravilo samo za `.env.example`. Primer pokazuje koje promenljive trebaju, bez pravih vrednosti.",
        },
        {
          q: "Šta radi `git push`?",
          options: [
            "Pravi nov commit",
            "Šalje lokalne commit-ove na GitHub (origin)",
            "Prebacuje te u drugu granu",
            "Briše poslednji commit",
          ],
          answer: 1,
          why: "Commit-ovi nastaju lokalno. `push` ih šalje na udaljeni repozitorijum, a Vercel ili Cloudflare tada mogu automatski da objave novu verziju.",
        },
        {
          q: "Zašto se nova funkcija radi u posebnoj grani?",
          options: [
            "Jer git ne dozvoljava commit u `main`",
            "Da `main` ostane ispravan dok funkcija nije gotova",
            "Da bi build bio brži",
            "Jer GitHub to zahteva",
          ],
          answer: 1,
          why: "Grana izoluje nedovršen posao. `main` i dalje radi i može se objaviti u svakom trenutku, a funkcija ulazi tek kad je gotova (`git merge`).",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-osnove-git-1",
      front: "Koja tri \"mesta\" postoje u git-u i koje komande prebacuju fajl između njih?",
      back: "Radni folder → (`git add`) → staging → (`git commit`) → repozitorijum (istorija).",
    },
    {
      id: "fc-osnove-git-2",
      front: "Čemu služi `.gitignore`?",
      back: "Spisak fajlova i foldera koje git ne prati: `node_modules`, build folderi (`dist`, `.next`), `.env` tajne. `!` na početku pravila pravi izuzetak.",
    },
    {
      id: "fc-osnove-git-3",
      front: "Kako se pravi nova grana i prelazi u nju?",
      back: "`git switch -c ime-grane`. Nazad u glavnu: `git switch main`. Spajanje: iz `main` pokreneš `git merge ime-grane`.",
    },
    {
      id: "fc-osnove-git-4",
      front: "Razlika između git-a i GitHub-a?",
      back: "Git je program na tvom računaru koji vodi istoriju. GitHub je sajt koji čuva kopiju repozitorijuma (`origin`). Sinhronizacija: `git push` i `git pull`.",
    },
    {
      id: "fc-osnove-git-5",
      front: "Ključ iz `.env` je slučajno završio u commit-u. Šta sad?",
      back: "Ključ odmah poništi i napravi nov u konzoli servisa. Brisanje fajla ne pomaže, jer stara verzija ostaje u istoriji.",
    },
  ],
};

export default lesson;
