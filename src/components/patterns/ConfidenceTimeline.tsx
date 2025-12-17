"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";

type Phase = {
  title: string;
  detail: string;
  ownership: "we" | "you";
};

type Props = {
  phases: Phase[];
};

export function ConfidenceTimeline({ phases }: Props) {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-subtle)]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text)]"
        aria-expanded={open}
      >
        <span>Confidence timeline</span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1, height: "auto" } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
            className="mt-3 space-y-3"
          >
            {phases.map((phase, idx) => (
              <div key={phase.title} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-[color:var(--color-surface)]",
                      phase.ownership === "we"
                        ? "bg-[color:var(--color-text)]"
                        : "bg-[color:var(--color-border-strong)] text-[color:var(--color-text)]",
                    ].join(" ")}
                  >
                    {idx + 1}
                  </span>
                  {idx < phases.length - 1 ? (
                    <span className="block h-8 w-[2px] bg-[color:var(--color-border)]" aria-hidden />
                  ) : null}
                </div>
                <div className="flex-1 space-y-1 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2">
                  <p className="font-semibold text-[color:var(--color-text)]">{phase.title}</p>
                  <p className="text-sm text-[color:var(--color-text-muted)]">{phase.detail}</p>
                  <p className="text-xs text-[color:var(--color-text-muted)]">
                    {phase.ownership === "we" ? "We handle this step" : "You handle this step"}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
