import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  X, Send, BrainCircuit, Target, Sparkles, 
  CheckCircle2, Plus, ArrowRight, Activity, 
  Flame, Trophy, User 
} from "lucide-react";

const VaultDemo = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  const [step, setStep] = useState(0); // 0: dashboard, 1: conversion
  const [memories, setMemories] = useState([]);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Welcome to your future, Alex. I am the reflection of your growth, 5 years from now. What intentional shift are we making today?" }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollChat = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollChat(); }, [messages, isTyping]);

  const handleAddMemory = () => {
    if (memories.length >= 1) {
      setStep(1);
      return;
    }
    const newMem = { id: Date.now(), title: "Mastering Neural Systems", progress: 0 };
    setMemories([newMem]);
  };

  const handleSend = async () => {
    if (!inputMsg.trim() || isTyping) return;
    
    const userMsg = inputMsg;
    setInputMsg("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);

    if (messages.length >= 6) { // ~3 round trips
       setStep(1);
       return;
    }

    setIsTyping(true);
    // Mock AI response
    setTimeout(() => {
      const responses = [
        "Focus on the signal, not the noise. Every small action today is an investment in this version of us.",
        "I remember when we started this. The fear of failure was real, but look where we are now. Persistence was the key.",
        "Your consistency is your greatest asset. Don't break the chain today."
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { sender: "ai", text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
    >
      <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all z-[110]"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-6xl h-full max-h-[850px] rounded-[2.5rem] border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Mobile Header indicator */}
        <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Demo Vault</span>
            <span className="text-[10px] text-zinc-500 italic">Limited Interaction</span>
        </div>

        {/* --- Sidebar Mock --- */}
        <div className="hidden md:flex w-20 lg:w-64 border-r border-white/5 flex-col p-6 gap-8 bg-black/20">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-5 h-5" />
                </div>
                <span className="hidden lg:block font-bold text-white tracking-tight">InnerSync</span>
            </div>
            
            <div className="space-y-2">
                {[Target, Activity, Flame, User].map((Icon, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i === 0 ? "bg-white/10 text-white" : "text-zinc-500"}`}>
                        <Icon size={20} />
                        <span className="hidden lg:block text-sm font-medium">{["Dashboard", "Tasks", "Insights", "Profile"][i]}</span>
                    </div>
                ))}
            </div>

            <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 text-center">
                <p className="hidden lg:block text-[10px] uppercase font-bold text-cyan-400 tracking-widest mb-2">Guest Access</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-cyan-500" />
                </div>
            </div>
        </div>

        {/* --- Main Content Mock --- */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-10 flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mb-1">Timeline Locked</p>
                    <h2 className="text-2xl font-bold text-white">Hey, Alex 👋</h2>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Sync Active</span>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: "Active Syncs", value: `${memories.length}/3`, icon: Target, color: "text-cyan-400" },
                 { label: "Pending Tasks", value: "8", icon: Flame, color: "text-amber-400" },
                 { label: "Growth Rate", value: "12%", icon: Activity, color: "text-purple-400" },
                 { label: "Elite Cards", value: "3", icon: Trophy, color: "text-green-400" },
               ].map((s, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <s.icon size={16} className={`${s.color} mb-2`} />
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider">{s.label}</p>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Memories Section */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Target size={16} className="text-cyan-400" /> Active Memories
                        </h3>
                        <button 
                          onClick={handleAddMemory}
                          disabled={memories.length >= 1}
                          className={`p-1.5 rounded-lg border transition-all ${memories.length >= 1 ? "opacity-50 grayscale cursor-not-allowed border-white/10" : "bg-cyan-500 border-cyan-400 hover:scale-110 active:scale-95 text-black"}`}
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {memories.length === 0 ? (
                            <button 
                                onClick={handleAddMemory}
                                className="w-full h-32 rounded-2xl border-2 border-dashed border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all text-zinc-600 flex flex-col items-center justify-center gap-2"
                            >
                                <Plus size={24} />
                                <span className="text-sm font-medium">Add a Memory to begin</span>
                            </button>
                        ) : (
                            memories.map(m => (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400">0%</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white leading-none">{m.title}</p>
                                        <p className="text-[10px] text-zinc-500 mt-1">Status: Initializing Analysis</p>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase tracking-widest">Awaiting Sync</div>
                                </motion.div>
                            ))
                        )}
                        <div className="p-4 rounded-2xl border border-white/5 opacity-50 select-none grayscale cursor-not-allowed">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5" />
                                <div className="space-y-2">
                                    <div className="w-32 h-2 bg-white/5 rounded-full" />
                                    <div className="w-20 h-2 bg-white/5 rounded-full opacity-50" />
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Chat Section */}
                <section className="flex flex-col rounded-3xl border border-white/10 bg-black/40 overflow-hidden min-h-[400px]">
                    <header className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shadow-glow-cyan">
                            <BrainCircuit size={16} className="text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">Future Self</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-[10px] text-cyan-400 font-medium tracking-tight">Timeline Connected</span>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                               <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${m.sender === "user" ? "bg-white text-black font-semibold rounded-tr-sm shadow-xl" : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm"}`}>
                                   {m.text}
                               </div>
                           </motion.div>
                        ))}
                        {isTyping && (
                             <div className="flex justify-start italic text-[10px] text-zinc-500 animate-pulse ml-2 tracking-widest">
                                Future Self is typing...
                             </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <div className="relative">
                            <input 
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Whisper to your future..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all pr-12"
                            />
                            <button 
                                onClick={handleSend}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        {/* --- Conversion Modal --- */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            >
                <div className="w-full max-w-md p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400" />
                    
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 relative">
                        <Sparkles size={32} className="text-cyan-400 animate-pulse" />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 italic">Wait, Alex Rivera...</h2>
                    <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                        This is a limited preview of your future timeline. To continue recording memories and chatting with your future self, you need to synchronize your identity.
                    </p>

                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate("/signup")}
                            className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-glow hover:scale-105 active:scale-95"
                        >
                            Sync Identity <ArrowRight size={20} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-3 rounded-2xl bg-transparent text-zinc-500 text-xs font-bold hover:text-white transition-all uppercase tracking-widest"
                        >
                            End Preview
                        </button>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default VaultDemo;
