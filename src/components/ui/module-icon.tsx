import {
  Atom,
  Bot,
  Braces,
  FileType2,
  FlaskConical,
  Flame,
  Layers,
  Palette,
  Rocket,
  Smartphone,
  Sparkles,
  SquareTerminal,
  type LucideProps,
} from "lucide-react";
import type { ModuleIcon as IconName } from "@/content/types";

const ICONS: Record<IconName, React.ComponentType<LucideProps>> = {
  terminal: SquareTerminal,
  braces: Braces,
  "file-type": FileType2,
  atom: Atom,
  palette: Palette,
  layers: Layers,
  flame: Flame,
  rocket: Rocket,
  flask: FlaskConical,
  smartphone: Smartphone,
  sparkles: Sparkles,
  bot: Bot,
};

export function ModuleIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon {...props} />;
}

/** Ikona modula u obojenom kvadratiću. */
export function ModuleBadge({
  name,
  hue,
  size = 28,
  dim = false,
}: {
  name: IconName;
  hue: string;
  size?: number;
  dim?: boolean;
}) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-[28%] border"
      style={{
        width: size,
        height: size,
        color: dim ? "var(--fg-faint)" : `color-mix(in oklab, ${hue} 80%, var(--fg))`,
        background: dim ? "var(--bg-subtle)" : `color-mix(in oklab, ${hue} 14%, transparent)`,
        borderColor: dim ? "var(--line)" : `color-mix(in oklab, ${hue} 28%, transparent)`,
      }}
    >
      <ModuleIcon name={name} size={Math.round(size * 0.55)} strokeWidth={1.9} />
    </span>
  );
}
