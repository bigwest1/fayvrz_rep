import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

type Confidence = "ready" | "needs-info" | "in-progress";

type Props = {
  title: string;
  why: string;
  timeEstimate?: string;
  confidence: Confidence;
  primaryLabel: string;
  primaryHref: string;
  onCopy?: () => Promise<void> | void;
};

const confidenceCopy: Record<Confidence, string> = {
  ready: "Ready",
  "needs-info": "Needs info",
  "in-progress": "In progress",
};

export function ActionCard({
  title,
  why,
  timeEstimate,
  confidence,
  primaryLabel,
  primaryHref,
  onCopy,
}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
      className="card space-y-3 p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-[color:var(--color-text)]">{title}</p>
        <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-2 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
          {confidenceCopy[confidence]}
        </span>
      </div>
      <p className="text-sm text-[color:var(--color-text-muted)]">{why}</p>
      <div className="flex items-center gap-3 text-xs text-[color:var(--color-text-muted)]">
        {timeEstimate ? <span>{timeEstimate}</span> : null}
        <span className="h-px flex-1 bg-[color:var(--color-border)]" />
        <span>We handle + you handle</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text)]"
        >
          {primaryLabel}
        </Link>
        {onCopy ? (
          <button
            type="button"
            onClick={() => void onCopy()}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text)]"
          >
            Copy script
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}
