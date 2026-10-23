import type { Lesson } from "@/content/types";

const lesson: Lesson = {
  slug: "terminal",
  title: "Terminal: razgovor sa računarom",
  summary:
    "Kako da se snađeš u terminalu: gde se nalaziš, kako se krećeš kroz foldere, kako praviš fajlove i koje prečice štede najviše vremena.",
  minutes: 15,
  projects: ["ReformStudio", "PlazaHome"],
  blocks: [
    {
      kind: "prose",
      md: `Svaki put kad je AI asistent pokrenuo tvoj projekat, instalirao paket ili napravio commit, uradio je to **kucanjem komandi u terminal**. Terminal je najstariji i najdirektniji način da računaru kažeš šta da radi: ti otkucaš rečenicu, on je izvrši i odgovori ti tekstom.

Finder i terminal vide **iste foldere i iste fajlove**. Razlika je samo u tome kako im pristupaš: u Finderu klikćeš, u terminalu pišeš. Kad jednom savladaš desetak komandi, terminal postaje brži od miša.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Terminal je chat sa računarom",
      md: `Zamisli terminal kao chat u kom je sagovornik izuzetno doslovan. Ne razume "otprilike", ne pogađa šta ti je na umu i ne ispravlja slovne greške. Ali kad mu kažeš tačno, uradi to odmah, bez pitanja. Zato su komande kratke i precizne.`,
    },
    {
      kind: "prose",
      md: `### Kako izgleda prompt

Kad otvoriš aplikaciju **Terminal** (Cmd + Space, pa otkucaj "Terminal"), vidiš nešto ovako:`,
    },
    {
      kind: "code",
      lang: "bash",
      code: `toshkee@MacBook-Pro ~ % `,
      caption:
        "`toshkee` je tvoj korisnik, `MacBook-Pro` ime računara, `~` je folder u kom se trenutno nalaziš, a `%` znači \"čekam komandu\". Taj red se zove **prompt**.",
    },
    {
      kind: "prose",
      md: `Terminal se uvek nalazi **u nekom folderu**. To je kao da imaš otvoren jedan prozor Findera: sve komande se odnose na taj folder, dok ne pređeš u drugi.

Znak \`~\` (tilda) je skraćenica za tvoj **home folder**, odnosno \`/Users/toshkee\`. Tu su ti \`Desktop\`, \`Downloads\`, ali i \`ReformStudio\`, \`PlazaHome\`, \`Looply\` i ostali projekti.`,
    },
    {
      kind: "prose",
      md: `### Putanja: adresa fajla

**Putanja** (path) je adresa fajla ili foldera. Delovi su odvojeni kosom crtom \`/\`. Postoje dve vrste:

- **Apsolutna putanja** počinje od korena diska, znakom \`/\`: \`/Users/toshkee/ReformStudio/src/main.tsx\`. Radi isto, ma gde se nalazio terminal.
- **Relativna putanja** počinje od foldera u kom si sad: ako si u \`~/ReformStudio\`, onda je \`src/main.tsx\` dovoljno.

I dve posebne oznake koje ćeš stalno viđati:

- \`.\` (jedna tačka) znači "ovaj folder"
- \`..\` (dve tačke) znači "folder iznad"

A \`~/ReformStudio\` je isto što i \`/Users/toshkee/ReformStudio\`, samo kraće.`,
    },
    {
      kind: "callout",
      tone: "analogy",
      title: "Puna adresa i \"dve kuće niže\"",
      md: `Apsolutna putanja je puna poštanska adresa: "Srbija, Beograd, Knez Mihailova 5". Radi odakle god da je pročitaš. Relativna putanja je "dve kuće niže, pa levo". Kraća je, ali ima smisla samo ako znaš gde stojiš.`,
    },
    {
      kind: "terminal",
      id: "osnove-terminal-orijentacija",
      title: "Gde sam i šta je ovde?",
      intro:
        "Otvoren je nov terminal, u tvom home folderu. Prošetaj do ReformStudija i nazad.",
      cwd: "~",
      steps: [
        {
          task: "Proveri u kom si folderu. Komanda je `pwd` (*print working directory*).",
          accept: ["pwd"],
          output: "/Users/toshkee",
          hint: "Otkucaj samo `pwd` i pritisni Enter.",
        },
        {
          task: "Izlistaj šta se nalazi u ovom folderu komandom `ls` (*list*).",
          accept: ["ls"],
          output: `Applications    Library         Pictures        my-portfolio
Bootcamp        Looply          PlazaHome       vaky-content
Desktop         Movies          Public
Documents       Music           ReformStudio
Downloads       Pasted          milenaspajic`,
          hint: "Dva slova: `ls`.",
        },
        {
          task: "Uđi u folder `ReformStudio` komandom `cd` (*change directory*).",
          accept: [
            "cd\\s+[\"']?(~/|/Users/toshkee/)?ReformStudio/?[\"']?",
          ],
          output: "",
          cwd: "~/ReformStudio",
          hint: "`cd ReformStudio`. Pazi na velika slova: R i S.",
        },
        {
          task: "Izlistaj **sve** fajlove, i skrivene, sa detaljima: `ls -la`.",
          accept: ["ls\\s+(-la|-al|-l\\s+-a|-a\\s+-l)"],
          output: `total 2144
drwxr-xr-x@  43 toshkee  staff    1376 Oct 23 09:16 .
drwxr-xr-x+  98 toshkee  staff    3136 Oct 23 12:54 ..
-rw-r--r--@   1 toshkee  staff    2405 Oct  6 12:33 .env.example
drwxr-xr-x   14 toshkee  staff     448 Oct 23 09:16 .git
-rw-r--r--@   1 toshkee  staff     414 Oct  7 13:45 .gitignore
-rw-r--r--@   1 toshkee  staff   16055 Oct  7 13:45 README.md
-rw-r--r--    1 toshkee  staff    1512 Oct 22 23:54 firebase.json
drwxr-xr-x@  11 toshkee  staff     352 Oct  7 13:36 functions
-rw-r--r--@   1 toshkee  staff    1655 Oct  6 15:32 index.html
drwxr-xr-x@ 724 toshkee  staff   23168 Oct  6 09:43 node_modules
-rw-r--r--@   1 toshkee  staff    2222 Oct  3 22:57 package.json
drwxr-xr-x@  10 toshkee  staff     320 Oct  6 09:55 public
drwxr-xr-x@  21 toshkee  staff     672 Oct  6 18:00 src
-rw-r--r--@   1 toshkee  staff    3166 Oct  5 22:18 vite.config.ts`,
          hint: "`ls`, razmak, pa `-la`. Slova posle crtice su opcije: `l` = detaljno, `a` = sve (all).",
        },
        {
          task: "Vrati se jedan folder iznad, sa `cd ..`.",
          accept: ["cd\\s+\\.\\./?"],
          output: "",
          cwd: "~",
          hint: "`cd`, razmak, dve tačke.",
        },
        {
          task: "Skoči direktno u `src` folder ReformStudija jednom komandom, relativnom putanjom.",
          accept: ["cd\\s+[\"']?(~/|/Users/toshkee/)?ReformStudio/src/?[\"']?"],
          output: "",
          cwd: "~/ReformStudio/src",
          hint: "Putanja može imati više delova: `cd ReformStudio/src`.",
        },
        {
          task: "Vrati se kući, u home folder, gde god da si: `cd ~` (ili samo `cd`).",
          accept: ["cd(\\s+~/?)?", "cd\\s+/Users/toshkee/?"],
          output: "",
          cwd: "~",
          hint: "`cd ~`, ili samo `cd` bez ičega. Oba vode u home folder.",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Šta znači \`ls -la\`

Slova posle crtice zovu se **opcije** (flags). Menjaju ponašanje komande:

- \`-l\` (*long*) prikazuje svaki fajl u svom redu, sa veličinom i datumom izmene
- \`-a\` (*all*) prikazuje i **skrivene** fajlove

Skriven fajl je svaki čije ime počinje tačkom: \`.git\`, \`.gitignore\`, \`.env.example\`. Finder ih ne prikazuje (osim ako pritisneš Cmd + Shift + .), ali oni su često najvažniji fajlovi u projektu. U \`.git\` folderu živi cela istorija tvog koda.

Prvo slovo u redu govori šta je to: \`d\` je folder (*directory*), a \`-\` je običan fajl. Primeti i da \`node_modules\` ima 724 stavke. O tome u sledećoj lekciji.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Razmaci i velika slova",
      md: `Terminal razmak čita kao **kraj reči**. Ako folder ima razmak u imenu, \`cd Moji projekti\` neće raditi, jer terminal misli da su to dve stvari. Stavi ime u navodnike: \`cd "Moji projekti"\`. Zato programeri imena foldera pišu kao \`my-portfolio\` ili \`vaky-content\`, sa crticom umesto razmaka.

Pazi i na velika slova. Mac će ti oprostiti \`cd reformstudio\`, ali server na kom ti radi sajt (Linux) neće. Navikni se da kucaš tačno.`,
    },
    {
      kind: "prose",
      md: `### Pravljenje foldera i fajlova

- \`mkdir ime\` (*make directory*) pravi nov folder
- \`touch ime.txt\` pravi prazan fajl (ili samo osveži datum izmene ako fajl već postoji)
- \`open .\` otvara trenutni folder u Finderu. Tačka je, kao što znaš, "ovaj folder". Ovo postoji samo na macOS-u.
- \`clear\` briše ekran terminala (ništa se ne gubi, samo je čistije)`,
    },
    {
      kind: "terminal",
      id: "osnove-terminal-pravljenje",
      title: "Napravi folder za vežbe",
      intro: "Napravi sebi mesto za vežbanje, pored ostalih projekata.",
      cwd: "~",
      steps: [
        {
          task: "Napravi folder `vezbe`.",
          accept: ["mkdir\\s+[\"']?vezbe/?[\"']?"],
          output: "",
          hint: "`mkdir vezbe`",
        },
        {
          task: "Uđi u njega.",
          accept: ["cd\\s+[\"']?(~/)?vezbe/?[\"']?"],
          output: "",
          cwd: "~/vezbe",
          hint: "`cd vezbe`. Probaj da otkucaš samo `cd ve` pa pritisneš **Tab**: terminal sam dopuni ime.",
        },
        {
          task: "Napravi prazan fajl `beleske.md`.",
          accept: ["touch\\s+[\"']?beleske\\.md[\"']?"],
          output: "",
          hint: "`touch beleske.md`",
        },
        {
          task: "Proveri da je fajl tu.",
          accept: ["ls(\\s+-[la]+)?"],
          output: "beleske.md",
          hint: "Komanda za listanje je `ls`.",
        },
        {
          task: "Otvori ovaj folder u Finderu.",
          accept: ["open\\s+\\./?"],
          output: "",
          hint: "`open .`, sa tačkom na kraju. Tačka znači \"ovaj folder\".",
        },
        {
          task: "Očisti ekran terminala.",
          accept: ["clear"],
          output: "",
          hint: "`clear` (ili prečica Cmd + K).",
        },
      ],
    },
    {
      kind: "prose",
      md: `### Tri prečice koje menjaju sve

1. **Tab** dopunjava imena. Otkucaj \`cd Ref\` i pritisni Tab: terminal dopiše \`ReformStudio/\`. Ako ima više mogućnosti, pritisni Tab dvaput i vidi listu. Osim što štedi kucanje, Tab štiti od slovnih grešaka: ako se ime ne dopuni, verovatno ne postoji.
2. **Strelica gore (↑)** vraća prethodne komande. Ne moraš ponovo da kucaš \`npm run dev\`: pritisni ↑ dok ga ne vidiš, pa Enter.
3. **Ctrl + C** prekida komandu koja trenutno radi. Tako gasiš \`npm run dev\` kad završiš. (Ctrl, ne Cmd!)`,
    },
    {
      kind: "callout",
      tone: "tip",
      title: "Prevuci folder u terminal",
      md: `Ako ne znaš putanju nekog foldera, otkucaj \`cd \` (sa razmakom), pa **prevuci folder iz Findera** u prozor terminala. Terminal sam upiše celu apsolutnu putanju. Isto radi i u VS Code-u: desni klik na folder, pa *Open in Integrated Terminal*.`,
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Terminal nema korpu za otpatke",
      md: `Komanda \`rm\` briše fajl **zauvek**, bez korpe i bez "Da li ste sigurni?". A \`rm -rf ime\` briše ceo folder sa svim unutra. Nikad ne kucaj \`rm -rf\` sa putanjom koju ne razumeš potpuno, i uvek prvo uradi \`pwd\` da proveriš gde si. Ako AI asistent predloži \`rm -rf\`, pročitaj putanju dvaput.`,
    },
    {
      kind: "quiz",
      id: "osnove-terminal-quiz",
      questions: [
        {
          q: "Nalaziš se u `~/ReformStudio/src`. Gde te vodi `cd ..`?",
          options: [
            "U `~/ReformStudio`",
            "U `~` (home folder)",
            "U koren diska `/`",
            "Nigde, `..` nije validna putanja",
          ],
          answer: 0,
          why: "`..` znači \"jedan folder iznad\". Iznad `src` je `ReformStudio`. Za dva nivoa gore piše se `cd ../..`.",
        },
        {
          q: "Koja od ovih putanja je **apsolutna**?",
          options: [
            "`src/main.tsx`",
            "`./package.json`",
            "`/Users/toshkee/Looply/app.json`",
            "`../PlazaHome`",
          ],
          answer: 2,
          why: "Apsolutna putanja počinje kosom crtom `/`, od korena diska. Ostale zavise od toga gde se trenutno nalaziš. (`~/...` je takođe apsolutna, jer `~` uvek znači `/Users/toshkee`.)",
        },
        {
          q: "Zašto `ls` u ReformStudiju ne prikazuje `.gitignore`, a `ls -a` prikazuje?",
          options: [
            "Jer je `.gitignore` prazan fajl",
            "Jer ime počinje tačkom, a takvi fajlovi su skriveni",
            "Jer `ls` prikazuje samo foldere",
            "Jer `.gitignore` pripada git-u, ne projektu",
          ],
          answer: 1,
          why: "Na macOS-u i Linuxu svaki fajl čije ime počinje tačkom je skriven. Opcija `-a` (*all*) ih prikazuje.",
        },
        {
          q: "`npm run dev` radi u terminalu i hoćeš da ga ugasiš. Šta pritiskaš?",
          options: ["Cmd + Q", "Ctrl + C", "Esc", "Cmd + W"],
          answer: 1,
          why: "Ctrl + C šalje signal za prekid trenutnoj komandi. Cmd + Q bi ugasio ceo Terminal, a Cmd + W zatvorio prozor (i server sa njim, ali grublje).",
        },
        {
          q: "Kucaš `cd Pla` i pritisneš Tab, ali se ništa ne dopuni. Šta je najverovatnije?",
          options: [
            "Tab ne radi u zsh-u",
            "U ovom folderu ne postoji ništa što počinje sa `Pla`",
            "Moraš prvo da pokreneš `clear`",
            "Folder je skriven",
          ],
          answer: 1,
          why: "Tab dopunjava samo ono što postoji u folderu u kom si. Proveri sa `pwd` gde si i sa `ls` šta je tu. Verovatno nisi u `~`.",
        },
      ],
    },
  ],
  flashcards: [
    {
      id: "fc-osnove-terminal-1",
      front: "Šta rade `pwd`, `ls` i `cd`?",
      back: "`pwd` ispisuje u kom si folderu, `ls` izlistava šta je u njemu, `cd ime` te premešta u drugi folder.",
    },
    {
      id: "fc-osnove-terminal-2",
      front: "Šta znače `~`, `.` i `..` u putanji?",
      back: "`~` je home folder (`/Users/toshkee`), `.` je trenutni folder, `..` je folder iznad.",
    },
    {
      id: "fc-osnove-terminal-3",
      front: "Razlika između apsolutne i relativne putanje?",
      back: "Apsolutna počinje sa `/` (ili `~`) i radi odakle god. Relativna kreće od foldera u kom se trenutno nalaziš.",
    },
    {
      id: "fc-osnove-terminal-4",
      front: "Čemu služe Tab, strelica gore i Ctrl + C u terminalu?",
      back: "Tab dopunjava imena, ↑ vraća prethodne komande, Ctrl + C prekida komandu koja radi (npr. `npm run dev`).",
    },
    {
      id: "fc-osnove-terminal-5",
      front: "Šta prikazuje `ls -la` što običan `ls` ne prikazuje?",
      back: "Skrivene fajlove (ime počinje tačkom, npr. `.git`, `.gitignore`) i detalje: veličinu, datum, da li je folder (`d`).",
    },
  ],
};

export default lesson;
