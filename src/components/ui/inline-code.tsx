/** Kratki tekst sa `kodom` u backtick-ovima (opisi lekcija), bez celog markdown parsera. */
export function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded-[5px] bg-subtle px-1 py-px font-mono text-[0.88em] text-fg">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
