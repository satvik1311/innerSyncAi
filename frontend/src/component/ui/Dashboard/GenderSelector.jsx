import React from "react";
import { User, UserPlus, Users, UserX } from "lucide-react";

const GENDERS = [
  { id: "Male", label: "Male", icon: User },
  { id: "Female", label: "Female", icon: UserPlus },
  { id: "Non-binary", label: "Non-binary / Other", icon: Users },
  { id: "Private", label: "Prefer not to say", icon: UserX },
];

const GenderSelector = ({ selected, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
        Biological / Gender Identity
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GENDERS.map((g) => {
          const isActive = selected === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onChange(g.id)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? "bg-purple-500/10 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  : "bg-black/40 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              <g.icon size={20} className={isActive ? "text-purple-400" : "text-zinc-600"} />
              <span className="text-[11px] font-bold text-center leading-tight">{g.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenderSelector;
