"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Cursor-aware button — translates a few pixels toward the cursor on
 * hover, then springs back when the cursor leaves. Subtle but premium.
 *
 * Renders a real <button> by default; pass `as="a"` + `href` to render
 * a link instead.
 */
type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  /** Strength of the magnetic pull (0–1). 0.3 is a tasteful default. */
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit";
  as?: "button" | "a";
  target?: string;
  rel?: string;
};

export function MagneticButton({
  children,
  className = "",
  href,
  strength = 0.28,
  onClick,
  type = "button",
  as,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const Tag = (as ?? (href ? "a" : "button")) as "a" | "button";

  return (
    <motion.div
      animate={pos}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.4 }}
      className="inline-block"
    >
      <Tag
        // @ts-expect-error — ref is valid for both elements but the discriminated type doesn't infer it
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        type={Tag === "button" ? type : undefined}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={className}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
