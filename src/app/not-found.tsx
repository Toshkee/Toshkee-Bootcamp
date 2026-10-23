import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-[13px] text-faint">404</div>
      <h1 className="mt-3 font-display text-[44px] leading-none">Ova stranica ne postoji.</h1>
      <p className="mt-3 text-muted">Možda je lekcija preimenovana. Probaj pretragu sa ⌘K.</p>
      <Link href="/" className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-[14px] font-medium text-bg">
        Na početnu <ArrowRight size={15} />
      </Link>
    </div>
  );
}
