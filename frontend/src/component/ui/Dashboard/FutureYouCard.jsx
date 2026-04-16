import React from "react";
import { Sparkles, Trophy, Activity, RefreshCw } from "lucide-react";

/**
 * DiceBear 2D Avatar Future You Card
 * Replaces the 3D model-viewer with a performant 2D SVG system.
 */
const FutureYouCard = ({ profile, onSync }) => {
  const score = profile?.avatar_score || 0;
  const state = profile?.avatar_state || "base";
  const seed  = profile?.avatar_seed || profile?.username || "default";
  const style = profile?.avatar_style || "adventurer";

  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

  // Visual settings based on state
  const settings = {
    base: {
      label: "Base Identity",
      color: "text-zinc-500",
      glow: "border-white/5",
      imgClass: "scale-100",
      badge: false
    },
    improving: {
      label: "Evolution Sync",
      color: "text-cyan-400",
      glow: "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
      imgClass: "scale-105",
      badge: false
    },
    elite: {
      label: "Ascended State",
      color: "text-purple-400",
      glow: "border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)]",
      imgClass: "scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]",
      badge: true
    }
  }[state] || settings.base;

  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-700 p-6 ${settings.glow}`}>
      
      {/* Header Info */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-black/40 border border-white/10 ${settings.color}`}>
          {settings.label}
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-zinc-400">Biological Sync: {score}%</span>
        </div>
      </div>

      {/* Elite Badge */}
      {settings.badge && (
        <div className="absolute top-4 right-14 z-20 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg shadow-lg animate-bounce">
           <Trophy size={10} className="text-white" />
           <span className="text-[10px] font-black text-white italic">ELITE</span>
        </div>
      )}

      {/* Regenerate Action */}
      <button 
        onClick={() => {
          const newSeed = Math.random().toString(36).substring(7);
          onSync({ avatar_seed: newSeed, avatar_style: style });
        }}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all z-20"
        title="Regenerate Avatar"
      >
        <RefreshCw size={18} />
      </button>

      {/* Avatar Container */}
      <div className="w-full h-[280px] mt-8 mb-4 relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-transparent">
        <img 
          src={avatarUrl}
          alt="Future You"
          className={`w-48 h-48 object-contain transition-transform duration-1000 ease-out ${settings.imgClass}`}
        />
      </div>

      {/* Evolution Progress Mini Bar */}
      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-center text-[10px] font-medium">
          <span className="text-zinc-500 uppercase">Synchronization</span>
          <span className={settings.color}>{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
           <div 
             className={`h-full transition-all duration-1000 bg-gradient-to-r from-transparent to-current ${settings.color}`}
             style={{ width: `${score}%` }}
           />
        </div>
      </div>

    </div>
  );
};

export default FutureYouCard;
