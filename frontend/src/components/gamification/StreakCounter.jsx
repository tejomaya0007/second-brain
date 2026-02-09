import * as React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "../../lib/utils";

export function StreakCounter({ count = 0 }) {
  return (
    <div className="flex items-center gap-3 bg-surface-elevated/50 border border-border px-4 py-2 rounded-2xl group cursor-default">
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
        >
          <Zap size={20} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full -z-10"
        />
      </div>
      <div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
          Daily Streak
        </div>
        <div className="text-lg font-black text-white leading-none">
          {count} <span className="text-xs text-gray-500 font-medium">Days</span>
        </div>
      </div>
    </div>
  );
}
