import type { Module } from "@/content/types";
import komponente from "./01-komponente-i-jsx";
import props from "./02-props";
import state from "./03-state";
import forme from "./04-dogadjaji-i-forme";
import liste from "./05-liste-i-uslovi";
import effect from "./06-useeffect";
import hookovi from "./07-custom-hookovi";

const react: Module = {
  slug: "react",
  index: 3,
  title: "React",
  tagline: "Komponente, props, state i hook-ovi",
  description:
    "React je osnova i ReformStudija i Looply-ja. Ovde učiš kako se ekran slaže od komponenti, kako podaci teku kroz props, kako state pamti promene i kako hook-ovi povezuju sve to sa spoljnim svetom. Svaka vežba se crta uživo, dok kucaš.",
  icon: "atom",
  hue: "#22d3ee",
  lessons: [komponente, props, state, forme, liste, effect, hookovi],
};

export default react;
