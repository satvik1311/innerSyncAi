import React from "react";
import { ChevronDown, Target, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MemorySelector = ({ memories, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedMemory = memories.find((m) => m._id === selectedId) || memories[0];

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all group min-w-[240px]"
      >
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
          <Target size={18} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold leading-none mb-1">Active Journey</p>
          <p className="text-sm font-bold text-white truncate max-w-[180px]">
            {selectedMemory?.title || "No Journeys Found"}
          </p>
        </div>
        <ChevronDown size={18} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]"
          >
            <div className="p-2 space-y-1">
              {memories.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 text-xs italic">
                  Create a memory to start a roadmap.
                </div>
              ) : (
                memories.map((m) => (
                  <button
                    key={m._id}
                    onClick={() => {
                      onSelect(m._id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedId === m._id ? "bg-purple-500/20 text-white" : "text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${selectedId === m._id ? "bg-purple-500/30 text-purple-300" : "bg-zinc-800 text-zinc-600"}`}>
                      <Sparkles size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold truncate">{m.title}</p>
                      <p className="text-[10px] opacity-60 truncate">{m.description || "No description"}</p>
                    </div>
                    {selectedId === m._id && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemorySelector;
