// Kopira tipove biblioteka u public/monaco-types, da ih Monaco editor učita
// (autocomplete i provera tipova u vežbama). Pravi i manifest.json sa spiskom fajlova.
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const nm = join(root, "node_modules");
const out = join(root, "public/monaco-types");
rmSync(out, { recursive: true, force: true });

/** [putanja u public/monaco-types, putanja koju vidi Monaco (file:///node_modules/...)] */
const manifest = [];
const add = (target, content) => {
  const file = join(out, target);
  mkdirSync(dirname(file), { recursive: true });
  if (content === undefined) throw new Error("prazan sadržaj za " + target);
  writeFileSync(file, content);
  manifest.push([`/monaco-types/${target}`, `file:///node_modules/${target}`]);
};
const copy = (from, target = from) => {
  const file = join(out, target);
  mkdirSync(dirname(file), { recursive: true });
  copyFileSync(join(nm, from), file);
  manifest.push([`/monaco-types/${target}`, `file:///node_modules/${target}`]);
};

// React
for (const f of ["index.d.ts", "global.d.ts", "jsx-runtime.d.ts"]) copy(`@types/react/${f}`);
// Pravi csstype ima ~900 KB; za vežbe je dovoljna lakša verzija.
add(
  "csstype/index.d.ts",
  "export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {\n  [property: string]: string | number | undefined;\n}\n",
);

// Zustand
for (const f of ["index.d.ts", "vanilla.d.ts", "react.d.ts", "middleware.d.ts", "shallow.d.ts", "vanilla/shallow.d.ts", "react/shallow.d.ts"]) {
  copy(`zustand/${f}`);
}
for (const f of readdirSync(join(nm, "zustand/middleware")).filter((f) => f.endsWith(".d.ts"))) {
  copy(`zustand/middleware/${f}`);
}

// React Router (react-router-dom samo prosleđuje react-router)
for (const f of readdirSync(join(nm, "react-router/dist/development")).filter(
  (f) => f.endsWith(".d.ts") && !f.startsWith("index-react-server."),
)) {
  copy(`react-router/dist/development/${f}`);
}
add("react-router/index.d.ts", 'export * from "./dist/development/index";\n');
add("react-router/dom/index.d.ts", 'export * from "../dist/development/dom-export";\n');
copy("react-router-dom/dist/index.d.ts", "react-router-dom/index.d.ts");

writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`monaco-types: ${manifest.length} fajlova`);
