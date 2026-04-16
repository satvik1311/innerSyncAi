import React from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, Zap, Award } from "lucide-react";
import AvatarPreview from "./AvatarPreview";
import StreakCalendar from "./StreakCalendar";

const EvolutionCard = ({ profile, streakData }) => {
  const currentStreak = streakData?.current_streak || 0;
  const nickname = streakData?.nickname || "The Newcomer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-6 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Zap size={140} className="text-cyan-400 rotate-12" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-1 shadow-glow ring-4 ring-white/5">
            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={`http://127.0.0.1:8000${profile.avatar_url}`} alt="Identity" className="w-full h-full object-cover" />
              ) : (
                <AvatarPreview 
                  seed={profile?.avatar_seed} 
                  style={profile?.avatar_style || "avataaars"}
                  gender={profile?.gender}
                  className="w-full h-full border-none"
                />
              )}
            </div>
          </div>
          
          {/* Streak Badge Overlay */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
            <Flame size={14} className="text-white fill-white animate-pulse" />
            <span className="text-xs font-black text-white">{currentStreak}</span>
          </div>
        </div>

        {/* Identity Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="space-y-0.5">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] leading-none mb-1 shadow-sm">Identity Sync Established</p>
            <h1 className="text-3xl font-black text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-3">
              {profile?.name || "Explorer"}
              {currentStreak >= 5 && <Award size={24} className="text-amber-400 animate-bounce" />}
            </h1>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent italic">
              "{nickname}"
            </span>
          </div>
          
          <p className="text-xs text-zinc-500 max-w-sm mt-2 font-medium leading-relaxed">
            Your evolution is being monitored. Every meaningful action shapes your future self. 
            <span className="text-cyan-500 ml-1">Stay synchronized.</span>
          </p>
        </div>

        {/* Vertical Divider for Desktop */}
        <div className="hidden md:block w-px h-24 bg-white/5" />

        {/* Weekly Consistency Bar */}
        <div className="space-y-3">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center md:text-left">Weekly Continuity</p>
          <StreakCalendar days={streakData?.last_7_days} />
          <p className="text-[9px] text-zinc-600 font-medium text-center md:text-right italic">
            Longest Streak: {streakData?.longest_streak || 0} days
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default EvolutionCard;
