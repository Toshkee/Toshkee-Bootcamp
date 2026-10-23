// Kopira React tipove u public/, da ih Monaco editor učita (autocomplete i provera tipova u React vežbama).
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const out = join(root, "public/monaco-types");
mkdirSync(join(out, "react"), { recursive: true });
mkdirSync(join(out, "csstype"), { recursive: true });
for (const f of ["index.d.ts", "global.d.ts", "jsx-runtime.d.ts"]) {
  copyFileSync(join(root, "node_modules/@types/react", f), join(out, "react", f));
}
// Pravi csstype ima ~900 KB; za vežbe je dovoljna lakša verzija.
writeFileSync(
  join(out, "csstype/index.d.ts"),
  "export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {\n  [property: string]: string | number | undefined;\n}\n",
);
