import React from "react";
import { Trophy, Star, Target, Crown } from "lucide-react";
import { motion } from "framer-motion";

const AchievementSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 pb-10 border-b border-white/5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-1 md:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(251,191,36,0.1)]"
      >
        <Crown size={32} className="text-amber-400 mb-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
        <p className="text-xs text-amber-500 font-black uppercase tracking-widest mb-1">Current Status</p>
        <h3 className="text-xl font-black text-white">{summary.rank}</h3>
      </motion.div>

      <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Milestones", value: summary.total_milestones, icon: Trophy, color: "text-amber-400" },
          { label: "Tasks Mastered", value: summary.total_tasks, icon: Star, color: "text-cyan-400" },
          { label: "Total Wins", value: summary.total_achievements, icon: Target, color: "text-purple-400" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all"
          >
            <item.icon size={24} className={`${item.color} mb-2 group-hover:scale-110 transition-transform`} />
            <h3 className="text-2xl font-black text-white leading-tight">{item.value}</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementSummary;
