/**
 * Proverava ceo sadržaj bootcampa:
 *  - ID-jevi vežbi, kvizova, terminala i kartica su jedinstveni
 *  - svako rešenje vežbe se kompajlira bez TS grešaka i prolazi sve testove
 *  - početni kod (starter) NE prolazi (inače vežba nema smisla)
 *  - kviz odgovori i koraci "iz tvog koda" pokazuju na postojeće stvari
 *  - regex-i u terminal vežbama su ispravni
 *
 * Pokretanje: npm run check   (ili: npx tsx scripts/check-content.ts [modul-slug])
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import type { ExerciseBlock, Module } from "../src/content/types";
import { buildProgram, type RunResult } from "../src/lib/runner/harness";

const only = process.argv[2];
let errors = 0;
let warnings = 0;
const err = (where: string, msg: string) => {
  errors++;
  console.log(`  \x1b[31m✗\x1b[0m ${where}: ${msg}`);
};
const warn = (where: string, msg: string) => {
  warnings++;
  console.log(`  \x1b[33m!\x1b[0m ${where}: ${msg}`);
};

const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleDetection: ts.ModuleDetectionKind.Force,
  strict: true,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
  allowJs: true,
  checkJs: false,
  skipLibCheck: true,
  types: [],
  outDir: "/out",
};

function compile(code: string, lang: "ts" | "js") {
  const fileName = lang === "ts" ? "/main.ts" : "/main.js";
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile;
  host.getSourceFile = (name, langVersion, ...rest) =>
    name === fileName
      ? ts.createSourceFile(name, code, langVersion)
      : getSourceFile(name, langVersion, ...rest);
  const fileExists = host.fileExists;
  host.fileExists = (name) => name === fileName || fileExists(name);
  let js = "";
  host.writeFile = (name, text) => {
    if (name.endsWith(".js")) js = text;
  };
  const program = ts.createProgram([fileName], options, host);
  program.emit();
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file?.fileName === fileName)
    .map((d) => {
      const line = d.file && d.start != null ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0;
      return `L${line}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`;
    });
  return { js, diagnostics };
}

async function run(ex: ExerciseBlock, code: string): Promise<RunResult & { diagnostics: string[] }> {
  const { js, diagnostics } = compile(code, ex.lang);
  const fn = new Function(buildProgram(js, ex.tests)) as () => Promise<RunResult>;
  const timeout = new Promise<RunResult>((resolve) =>
    setTimeout(() => resolve({ logs: [], tests: [], timedOut: true }), 3000),
  );
  try {
    return { ...(await Promise.race([fn(), timeout])), diagnostics };
  } catch (e) {
    return { logs: [], tests: [], runtimeError: String(e), diagnostics };
  }
}

const passes = (r: RunResult & { diagnostics: string[] }, ex: ExerciseBlock) => {
  const needNoTypeErrors = ex.requireNoTypeErrors ?? ex.lang === "ts";
  return (
    !r.timedOut &&
    !r.runtimeError &&
    r.tests.length === ex.tests.length &&
    r.tests.every((t) => t.pass) &&
    (!needNoTypeErrors || r.diagnostics.length === 0)
  );
};

/** Moduli se učitavaju pojedinačno, pa pokvaren fajl u jednom modulu ne blokira proveru drugog. */
async function loadModules(): Promise<Module[]> {
  const dir = join(import.meta.dirname, "../src/content/modules");
  const loaded: Module[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (only && !name.endsWith(only)) continue;
    loaded.push((await import(join(dir, name, "index.ts"))).default);
  }
  return loaded;
}

async function main() {
  const modules = await loadModules();
  const ids = new Map<string, string>();
  const claim = (id: string, where: string) => {
    if (ids.has(id)) err(where, `ID "${id}" je već iskorišćen u ${ids.get(id)}`);
    else ids.set(id, where);
  };

  for (const mod of modules) {
    console.log(`\n\x1b[1m${String(mod.index).padStart(2, "0")} ${mod.title}\x1b[0m (${mod.lessons.length} lekcija)`);
    const slugs = new Set<string>();
    for (const lesson of mod.lessons) {
      const where = `${mod.slug}/${lesson.slug}`;
      console.log(` · ${lesson.title}`);
      if (slugs.has(lesson.slug)) err(where, "dupli slug lekcije");
      slugs.add(lesson.slug);
      if (!/^[a-z0-9-]+$/.test(lesson.slug)) err(where, "slug sme da ima samo a-z, 0-9 i -");
      if (lesson.flashcards.length < 2) warn(where, "manje od 2 kartice za ponavljanje");
      for (const card of lesson.flashcards) claim(card.id, where);

      let exercises = 0;
      let quizzes = 0;
      for (const [bi, block] of lesson.blocks.entries()) {
        const at = `${where} [blok ${bi}, ${block.kind}]`;
        switch (block.kind) {
          case "exercise": {
            exercises++;
            claim(block.id, at);
            if (block.tests.length === 0) err(at, "vežba nema testove");
            if (block.hints.length === 0) warn(at, "vežba nema nijedan hint");
            const sol = await run(block, block.solution);
            if (!passes(sol, block)) {
              err(at, `REŠENJE "${block.id}" ne prolazi`);
              if (sol.diagnostics.length) console.log("      TS greške:", sol.diagnostics);
              if (sol.runtimeError) console.log("      runtime:", sol.runtimeError);
              if (sol.timedOut) console.log("      isteklo vreme (beskonačna petlja?)");
              for (const t of sol.tests.filter((t) => !t.pass)) console.log(`      test "${t.name}": ${t.error}`);
            }
            const start = await run(block, block.starter);
            if (passes(start, block)) err(at, `STARTER "${block.id}" već prolazi; vežba nema šta da se reši`);
            break;
          }
          case "quiz":
            quizzes++;
            claim(block.id, at);
            for (const [qi, q] of block.questions.entries()) {
              if (q.answer < 0 || q.answer >= q.options.length) err(at, `pitanje ${qi + 1}: answer ${q.answer} van opsega`);
              if (q.options.length < 2) err(at, `pitanje ${qi + 1}: premalo opcija`);
            }
            break;
          case "terminal":
            claim(block.id, at);
            for (const [si, step] of block.steps.entries()) {
              if (step.accept.length === 0) err(at, `korak ${si + 1}: nema prihvaćenih komandi`);
              for (const src of step.accept) {
                try {
                  new RegExp(`^(?:${src})$`);
                } catch (e) {
                  err(at, `korak ${si + 1}: neispravan regex ${src}: ${e}`);
                }
              }
            }
            break;
          case "fromYourCode": {
            const n = block.code.replace(/\n$/, "").split("\n").length;
            for (const [si, step] of block.steps.entries()) {
              const [a, b] = Array.isArray(step.lines) ? step.lines : [step.lines, step.lines];
              if (a < 1 || b > n || a > b) err(at, `korak ${si + 1}: linije ${a}-${b} van koda (ima ${n} linija)`);
            }
            if (block.steps.length < 2) warn(at, "samo jedan korak objašnjenja");
            break;
          }
          case "code":
            for (const h of block.highlight ?? []) {
              if (h > block.code.split("\n").length) err(at, `highlight linija ${h} van koda`);
            }
            break;
        }
      }
      if (exercises === 0 && !lesson.blocks.some((b) => b.kind === "terminal")) warn(where, "lekcija nema vežbu ni terminal");
      if (quizzes === 0) warn(where, "lekcija nema kviz");
    }
  }

  console.log(
    `\n${errors ? `\x1b[31m${errors} grešaka\x1b[0m` : "\x1b[32mSve vežbe prolaze ✓\x1b[0m"}${warnings ? `, ${warnings} upozorenja` : ""}\n`,
  );
  process.exit(errors ? 1 : 0);
}

main();
