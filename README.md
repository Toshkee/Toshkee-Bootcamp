# Bootcamp

Lični bootcamp: TypeScript, React, Next.js i backend, naučeni na primerima iz tvojih projekata.

## Pokretanje

```bash
npm run dev
```

Pa otvori http://localhost:3000. Napredak (završene lekcije, rešene vežbe, kartice) čuva se u browseru (localStorage), pa koristi uvek isti browser.

## Kako je složeno

| Folder | Šta je unutra |
|---|---|
| `src/content/modules/` | Sav sadržaj: jedan folder po modulu, jedan fajl po lekciji |
| `src/content/types.ts` | Format lekcije: tekst, kod, „iz tvog koda", vežbe, kvizovi, terminal |
| `src/content/curriculum.ts` | Spisak modula, uključujući one koji tek dolaze |
| `src/components/lesson/` | Blokovi lekcije: Monaco editor, kviz, simulirani terminal, prolazak kroz kod |
| `src/lib/runner/` | Pokretanje tvog koda (Web Worker za JS/TS, iframe sa živim pregledom za React) i testovi (`expect`, `render`, `screen`, `click`…) |
| `src/lib/progress.ts` | Zustand store sa napretkom |
| `scripts/check-content.ts` | Proverava da svako rešenje prolazi testove, a da početni kod ne prolazi |

## Dodavanje lekcija

1. Napravi fajl u `src/content/modules/<modul>/` po uzoru na postojeće.
2. Dodaj ga u `index.ts` tog modula.
3. Pokreni `npm run check`. Mora da piše „Sve vežbe prolaze ✓".

Novi modul: napravi folder sa `index.ts`, dodaj ga u `modules` u `curriculum.ts` i skloni ga iz `upcoming`.
