import type { Module } from "@/content/types";
import zasto from "./01-zasto-typescript";
import tipoviObjekata from "./02-tipovi-objekata";
import unionINarrowing from "./03-union-i-narrowing";
import generici from "./04-generici";
import utilityTipovi from "./05-utility-tipovi";
import tsconfigIGreske from "./06-tsconfig-i-greske";

const typescript: Module = {
  slug: "typescript",
  index: 2,
  title: "TypeScript",
  tagline: "JavaScript sa tipovima, tvoj glavni jezik",
  description:
    "Svaki tvoj projekat je pisan u TypeScriptu. Ovde učiš da čitaš i pišeš tipove: od osnovnih, preko interfejsa i union tipova, do generika koje koriste React i Zustand.",
  icon: "file-type",
  hue: "#4f8ff7",
  lessons: [zasto, tipoviObjekata, unionINarrowing, generici, utilityTipovi, tsconfigIGreske],
};

export default typescript;
