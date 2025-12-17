import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

type MomentBannerProps = {
  label: string;
  title: string;
  nextAction: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
};

export function MomentBanner({
  label,
  title,
  nextAction,
  ctaLabel,
  ctaHref,
  secondaryLabel,
}: MomentBannerProps) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
      className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-subtle)]"
      aria-label={label}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
          {label}
        </span>
        {secondaryLabel ? (
          <span className="text-xs text-[color:var(--color-text-muted)]">{secondaryLabel}</span>
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[color:var(--color-text)]">{title}</p>
        <p className="type-body text-[color:var(--color-text-muted)]">{nextAction}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text)]"
        >
          {ctaLabel}
        </Link>
      </div>
    </motion.section>
  );
}
