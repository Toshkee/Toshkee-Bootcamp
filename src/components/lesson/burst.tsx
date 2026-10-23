"use client";

import { motion } from "motion/react";

const COLORS = ["#34d399", "#facc15", "#4f8ff7", "#f472b6", "#22d3ee", "#fb923c"];

/** Mali vatromet čestica kad nešto rešiš. Menja se `trigger` → nova eksplozija. */
export function Burst({ trigger, count = 16 }: { trigger: number; count?: number }) {
  if (!trigger) return null;
  return (
    <span key={trigger} className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 2) * 0.2;
        const dist = 26 + (i % 3) * 12;
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 size-1.5 rounded-[2px]"
            style={{ background: COLORS[i % COLORS.length] }}
            initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: `calc(-50% + ${Math.cos(angle) * dist}px)`,
              y: `calc(-50% + ${Math.sin(angle) * dist}px)`,
              scale: 0.4,
              opacity: 0,
              rotate: 180,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </span>
  );
}
