import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { cardVariant, hoverLift } from "../../lib/animations";

export function Card({ className, children, ...props }) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={hoverLift}
      className={cn(
        "glass-card p-6 relative overflow-hidden group",
        // The decorative before-layer should not block clicks on content
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
