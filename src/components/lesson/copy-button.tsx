"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="grid size-7 place-items-center rounded-md text-faint transition-colors hover:bg-subtle hover:text-fg"
      aria-label={copied ? "Kopirano" : "Kopiraj kod"}
      title={copied ? "Kopirano" : "Kopiraj"}
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
    </button>
  );
}
