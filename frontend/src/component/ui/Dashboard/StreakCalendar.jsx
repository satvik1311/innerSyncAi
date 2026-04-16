import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const StreakCalendar = ({ days }) => {
  if (!days || days.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {days.map((day, i) => {
        const dateObj = new Date(day.date);
        const dayLabel = dateObj.toLocaleDateString("en-US", { weekday: "narrow" });
        const isActive = day.active;
        const isToday = i === days.length - 1;

        return (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isToday ? "text-cyan-400" : "text-zinc-600"}`}>
              {dayLabel}
            </span>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                relative w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-500
                ${isActive 
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                  : "bg-zinc-900 border-white/5 text-zinc-700"
                }
                ${isToday && !isActive ? "border-zinc-700 animate-pulse" : ""}
              `}
              title={day.date}
            >
              {isActive ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <X size={12} strokeWidth={2} className="opacity-20" />
              )}
              
              {isToday && isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default StreakCalendar;
