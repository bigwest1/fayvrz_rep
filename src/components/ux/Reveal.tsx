"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { motionTokens } from "@/lib/ux/motion";

type Variant = "fadeUp" | "fade" | "scaleIn" | "slideRight";

const variants: Record<
  Variant,
  {
    hidden: Record<string, number>;
    visible: Record<string, number>;
  }
> = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0 },
  },
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
};

export function Reveal({ children, variant = "fadeUp", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration: motionTokens.durations.base,
        ease: motionTokens.easings.entrance as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
