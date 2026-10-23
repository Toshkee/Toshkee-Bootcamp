import type { Module } from "@/content/types";
import tailwindOsnove from "./01-tailwind-osnove";
import tailwindStanja from "./02-tailwind-stanja-i-responsive";
import teme from "./03-teme-i-tokeni";
import zustandOsnove from "./04-zustand-osnove";
import zustandPraksa from "./05-zustand-u-praksi";
import reactRouter from "./06-react-router";

const stilIStanje: Module = {
  slug: "stil-i-stanje",
  index: 4,
  title: "Stil i stanje",
  tagline: "Tailwind CSS, Zustand i rutiranje",
  description:
    "Kako tvoji projekti izgledaju i kako pamte stvari. Tailwind klase iz ReformStudija i PlazaHome-a, teme i dizajn tokeni, Zustand store-ovi koji dele stanje između ekrana i React Router koji vodi sa ekrana na ekran.",
  icon: "palette",
  hue: "#f472b6",
  lessons: [tailwindOsnove, tailwindStanja, teme, zustandOsnove, zustandPraksa, reactRouter],
};

export default stilIStanje;
