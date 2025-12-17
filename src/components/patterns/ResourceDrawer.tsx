"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type ResourceGroup = {
  label: string;
  items: {
    title: string;
    description?: string;
    url?: string;
    phone?: string;
    type?: string;
  }[];
};

type Props = {
  triggerLabel: string;
  groups: ResourceGroup[];
};

export function ResourceDrawer({ triggerLabel, groups }: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text)]"
      >
        {triggerLabel}
      </button>
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-40">
            <button
              aria-label="Close resources"
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={reduce ? false : { x: 320, opacity: 0 }}
              animate={reduce ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: 320, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)]"
              role="dialog"
              aria-label="Resources"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-[color:var(--color-text)]">Resources</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
                >
                  Close
                </button>
              </div>
              <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                Suggested only. Verify details with official sources.
              </p>
              <div className="mt-4 space-y-3">
                {groups.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <p className="type-meta">{group.label}</p>
                    <div className="grid gap-2">
                      {group.items.map((item, idx) => (
                        <div
                          key={`${group.label}-${idx}`}
                          className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2"
                        >
                          <p className="font-semibold text-[color:var(--color-text)]">{item.title}</p>
                          {item.description ? (
                            <p className="text-sm text-[color:var(--color-text-muted)]">{item.description}</p>
                          ) : null}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-[color:var(--color-border)] px-2 py-1 text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
                              >
                                Open link
                              </a>
                            ) : null}
                            {item.phone ? (
                              <a
                                href={`tel:${item.phone}`}
                                className="rounded-full border border-[color:var(--color-border)] px-2 py-1 text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
                              >
                                Call {item.phone}
                              </a>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
