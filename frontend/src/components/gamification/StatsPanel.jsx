import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen } from "lucide-react";
import { Card } from "../ui/Card";
import { fadeIn, staggerContainer } from "../../lib/animations";

export function StatsPanel({ totalEntries = 0, totalTags = 0 }) {
  const stats = [
    { label: "Insights", value: totalEntries, icon: BookOpen, color: "text-accent-1", bg: "bg-accent-1/10" },
    { label: "AI Tags", value: totalTags, icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-2 lg:w-fit lg:grid-cols-2 gap-4 mb-8"
    >
      {stats.map((stat, i) => (
        <Card key={i} className="p-4 bg-surface-elevated/30 border-white/5 hover:bg-surface-elevated/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
                {stat.label}
              </div>
              <div className="text-xl font-black text-white leading-none">
                {stat.value}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
}
