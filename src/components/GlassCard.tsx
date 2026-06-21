import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "strong";
  className?: string;
}

/** Frosted-glass surface with top-edge highlight + soft drop shadow. */
export default function GlassCard({
  children,
  variant = "default",
  className = "",
  ...rest
}: GlassCardProps) {
  const base = variant === "strong" ? "glass-strong" : "glass";
  return (
    <motion.div className={`${base} ${className}`} {...rest}>
      {children}
    </motion.div>
  );
}
