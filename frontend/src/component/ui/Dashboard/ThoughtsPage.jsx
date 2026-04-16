import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import ThoughtInput from "./ThoughtInput";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Brain, Search, Filter } from "lucide-react";

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThoughts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/thoughts/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setThoughts(res.data);
    } catch (err) {
      console.error("Fetch thoughts error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const moodEmoji = {
    "Focused": "🎯",
    "Confused": "🤔",
    "Stressed": "😫",
    "Motivated": "⚡",
    "Neutral": "😐"
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <div className="w-72 flex-shrink-0 border-r border-white/5">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-8 pt-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Memory <span className="text-gradient-cyan">Stream</span></h1>
              <p className="text-zinc-500 font-medium">Capture thoughts to synchronize your evolving identity.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Input */}
            <div className="lg:col-span-12 xl:col-span-5">
              <div className="sticky top-12">
                <ThoughtInput onSaveSuccess={fetchThoughts} />
                
                <div className="mt-8 p-6 glass-premium rounded-3xl border border-white/5 bg-cyan-500/5">
                    <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        <Brain size={14} /> AI Integration
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Every thought you capture here is analyzed to build a higher-fidelity model of your future self. 
                        Your AI guide will use these patterns to provide personalized advice in the Future Self chat.
                    </p>
                </div>
              </div>
            </div>

            {/* Right: History */}
            <div className="lg:col-span-12 xl:col-span-7">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar size={18} className="text-purple-400" />
                      Recent Reflections
                  </h2>
                  <div className="flex items-center gap-3">
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                          <Search size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                          <Filter size={16} />
                      </button>
                  </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                    ))
                  ) : thoughts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-zinc-600 font-medium italic">The stream is quiet. Capture your first thought to begin.</p>
                    </div>
                  ) : (
                    thoughts.map((thought, idx) => (
                        <motion.div
                          key={thought._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="glass-premium p-6 rounded-3xl border border-white/5 group hover:border-cyan-500/30 transition-all shadow-xl"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{moodEmoji[thought.mood] || "😐"}</span>
                              <div>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                                    {new Date(thought.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <span className={`text-[10px] font-bold ${
                                    thought.mood === 'Stressed' ? 'text-red-400' : 
                                    thought.mood === 'Focused' ? 'text-cyan-400' : 'text-zinc-400'
                                }`}>{thought.mood}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {thought.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[9px] font-bold text-zinc-500 border border-white/5">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                            {thought.content}
                          </p>

                          {thought.ai_insight && (
                            <div className="pt-4 border-t border-white/5 flex items-start gap-3">
                                <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-purple-300/80 font-medium italic leading-relaxed">
                                    "{thought.ai_insight}"
                                </p>
                            </div>
                          )}
                        </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Sparkles = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M3 5h4"/><path d="M21 17v4"/><path d="M19 19h4"/>
    </svg>
);
