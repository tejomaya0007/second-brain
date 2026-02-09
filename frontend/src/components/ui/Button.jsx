import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { tapScale } from "../../lib/animations";

export function Button({ className, variant = "primary", size = "md", children, ...props }) {
  const variants = {
    primary: "bg-accent-1 hover:bg-accent-1/90 text-white shadow-lg shadow-accent-1/25",
    secondary: "bg-surface-elevated hover:bg-surface-elevated/80 text-gray-300 border border-border",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
    outline: "bg-transparent border border-accent-1 text-accent-1 hover:bg-accent-1/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileTap={tapScale}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-1/50 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
