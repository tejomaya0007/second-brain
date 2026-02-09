import { motion } from "framer-motion";

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export const tapScale = {
  scale: 0.95,
  transition: { type: "spring", stiffness: 400, damping: 10 }
};

export const hoverLift = {
  y: -4,
  transition: { type: "spring", stiffness: 400, damping: 10 }
};

export const fadeIn = (direction = "up", type = "spring", delay = 0, duration = 0.75) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});
