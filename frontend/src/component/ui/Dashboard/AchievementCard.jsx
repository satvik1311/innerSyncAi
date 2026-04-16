import React from "react";
import { Trophy, CheckCircle, Calendar, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const AchievementCard = ({ achievement, index }) => {
  const isMemory = achievement.type === "Memory" || achievement.type === "Goal";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/5 group-hover:border-amber-500/30 p-6 rounded-3xl flex flex-col items-center text-center h-full transition-all">
        
        {/* Icon / Trophy */}
        <div className={`mb-4 p-4 rounded-full ${isMemory ? 'bg-amber-500/10' : 'bg-cyan-500/10'} relative`}>
            {isMemory ? (
                <Trophy size={32} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            ) : (
                <Star size={32} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            )}
            
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute -top-1 -right-1 text-white/40"
            >
               <Sparkles size={12} />
            </motion.div>
        </div>

        {/* Labels */}
        <div className="mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                achievement.label === "First Step Completed" ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' :
                achievement.label === "Consistency Win" ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                'bg-amber-500/10 border-amber-500/20 text-amber-500'
            }`}>
                {achievement.label}
            </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
          {achievement.title}
        </h3>
        
        <p className="text-xs text-zinc-500 mb-6 flex-1 line-clamp-2">
          {achievement.description || `Successfully Mastered in ${achievement.source || 'the Vault'}.`}
        </p>

        {/* Footer info */}
        <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between text-zinc-600">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase truncate">
              {isMemory ? <Trophy size={10} /> : <CheckCircle size={10} />}
              {achievement.type}
           </div>
           <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
              <Calendar size={10} />
              {new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
