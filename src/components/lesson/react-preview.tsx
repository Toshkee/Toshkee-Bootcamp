"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import type { LogLine } from "@/lib/runner/harness";
import { browserReactEnv, PREVIEW_CSS } from "@/lib/runner/react-browser";
import { evaluateComponent } from "@/lib/runner/react-harness";

/**
 * Živi pregled React vežbe: tvoja komponenta se crta u iframe-u (odvojeno od stila aplikacije),
 * kao u pravom browseru, i na nju možeš da klikćeš.
 */
export function ReactPreview({
  js,
  name,
  onLogs,
}: {
  /** Kompajliran kod, ili null dok se editor učitava. */
  js: string | null;
  name: string;
  onLogs?: (logs: LogLine[]) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const rootRef = useRef<{ root: Root; container: HTMLElement } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState(140);
  const [nonce, setNonce] = useState(0);
  const onLogsRef = useRef(onLogs);
  useEffect(() => {
    onLogsRef.current = onLogs;
  }, [onLogs]);

  // Pripremi dokument u iframe-u: stil, tema i #root
  const setup = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc || doc.getElementById("root")) return doc;
    doc.open();
    doc.write(`<!doctype html><html><head><style>${PREVIEW_CSS}</style></head><body><div id="root"></div></body></html>`);
    doc.close();
    doc.documentElement.classList.toggle("dark", document.documentElement.classList.contains("dark"));
    const ro = new ResizeObserver(() => setHeight(Math.min(520, Math.max(120, doc.documentElement.scrollHeight))));
    ro.observe(doc.body);
    return doc;
  };

  // Prati temu aplikacije
  useEffect(() => {
    const sync = () =>
      frameRef.current?.contentDocument?.documentElement.classList.toggle(
        "dark",
        document.documentElement.classList.contains("dark"),
      );
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (js === null) return;
    const doc = setup();
    const win = frameRef.current?.contentWindow;
    if (!doc || !win) return;
    const out = evaluateComponent(browserReactEnv(doc, win), js, name);
    onLogsRef.current?.(out.logs);

    // Jedan root po dokumentu u iframe-u; novi samo ako je iframe ponovo učitan
    const container = doc.getElementById("root")!;
    if (rootRef.current?.container !== container) {
      const old = rootRef.current?.root;
      if (old) setTimeout(() => old.unmount());
      rootRef.current = {
        container,
        root: createRoot(container, {
          onUncaughtError: (e) => setError(e instanceof Error ? e.message : String(e)),
        }),
      };
    }
    const { root } = rootRef.current;
    if (out.error) {
      setError(out.error);
      root.render(null);
      return;
    }
    setError(null);
    // `key` = nonce: dugme za osvežavanje montira komponentu iznova (resetuje state)
    root.render(React.createElement(out.component as React.ComponentType, { key: nonce }));
  }, [js, name, nonce]);

  useEffect(
    () => () => {
      const old = rootRef.current?.root;
      if (old) setTimeout(() => old.unmount());
    },
    [],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-elev">
      <div className="flex h-9 items-center gap-2 border-b border-line bg-subtle/50 px-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <span className="mx-auto rounded-md bg-bg/70 px-3 py-0.5 font-mono text-[11.5px] text-faint">localhost:3000</span>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="grid size-6 place-items-center rounded text-faint hover:bg-subtle hover:text-fg"
          title="Nacrtaj ponovo (resetuje state)"
        >
          <RotateCw size={12.5} />
        </button>
      </div>
      <div className="relative">
        <iframe
          ref={frameRef}
          title="Pregled"
          className="block w-full border-0 bg-transparent"
          style={{ height }}
          onLoad={() => setNonce((n) => n + 1)}
        />
        {error && (
          <div className="absolute inset-0 flex items-start gap-2.5 overflow-auto bg-elev/95 p-4 text-[13.5px] backdrop-blur-sm">
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-danger" />
            <div>
              <div className="font-semibold text-danger">Komponenta ne može da se nacrta</div>
              <div className="mt-1 font-mono text-[12.5px] whitespace-pre-wrap text-muted">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
