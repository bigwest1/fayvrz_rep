import { motion } from "framer-motion";
import { motionTokens } from "@/lib/ux/motion";

type Props = {
  children: React.ReactNode;
  status?: string;
  onClick?: () => void;
  className?: string;
};

export function FocusCard({ children, status, onClick, className }: Props) {
  return (
    <motion.article
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "var(--shadow-subtle)" }}
      transition={{ duration: motionTokens.durations.fast, ease: motionTokens.easings.subtle }}
      className={[
        "relative space-y-2 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-strong)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      tabIndex={0}
    >
      {status ? (
        <span className="absolute right-3 top-3 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
          {status}
        </span>
      ) : null}
      {children}
    </motion.article>
  );
}
