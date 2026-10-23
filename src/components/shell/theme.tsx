"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/use-is-client";

type Theme = "light" | "dark" | "system";
const KEY = "bootcamp-theme";

/** Postavlja temu pre prvog iscrtavanja, da ne bi bljesnula pogrešna boja. */
export const themeScript = `(() => {
  try {
    const t = localStorage.getItem("${KEY}") || "system";
    const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) { document.documentElement.classList.add("dark"); }
})();`;

function apply(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function readSaved(): Theme {
  try {
    return (localStorage.getItem(KEY) as Theme) || "system";
  } catch {
    return "system";
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const ready = useIsClient();
  const [chosen, setTheme] = useState<Theme | null>(null);
  const theme = chosen ?? (ready ? readSaved() : null);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const choose = (t: Theme) => {
    setTheme(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
    apply(t);
  };

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Svetla tema" },
    { value: "dark", icon: Moon, label: "Tamna tema" },
    { value: "system", icon: Monitor, label: "Prati sistem" },
  ];

  return (
    <div className={cn("inline-flex rounded-lg border border-line bg-subtle p-0.5", className)} role="radiogroup" aria-label="Tema">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => choose(value)}
          className={cn(
            "grid h-6 w-7 place-items-center rounded-md text-faint transition-colors hover:text-fg",
            theme === value && "bg-elev text-fg shadow-sm",
          )}
        >
          <Icon size={13} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
