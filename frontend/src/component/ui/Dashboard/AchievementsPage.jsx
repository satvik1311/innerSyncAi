import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import AchievementCard from "./AchievementCard";
import AchievementSummary from "./AchievementSummary";
import { ArrowLeft, Trophy, Sparkles, Loader2, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../lib/api";

const AchievementsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ summary: {}, achievements: [] });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await API.get("/achievements");
      setData(res.data);
      // Show celebration if there are achievements
      if (res.data.achievements.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error("Failed to fetch achievements", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0 border-r border-white/5 bg-zinc-950/40 backdrop-blur-3xl">
        <Sidebar threads={[]} /> {/* Threads not needed here or fetch if required */}
      </div>

      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
              <button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-4 transition group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Dashboard
              </button>
              
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <Trophy className="text-amber-400" size={32} />
                 </div>
                 <div>
                    <h1 className="text-4xl font-black tracking-tight text-white">
                      Legacy <span className="text-amber-500">Vault</span>
                    </h1>
                    <p className="text-zinc-500 text-sm">Every step you take is etched into your evolution timeline.</p>
                 </div>
              </div>
            </div>

            {showConfetti && (
               <motion.div 
                 initial={{ scale: 0, rotate: -20 }}
                 animate={{ scale: 1, rotate: 0 }}
                 className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-amber-400 font-bold shadow-[0_0_20px_rgba(251,191,36,0.2)]"
               >
                 <PartyPopper size={20} />
                 <span>Achievement Unlocked!</span>
               </motion.div>
            )}
          </header>

          {loading ? (
             <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="text-amber-500 animate-spin" />
                <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Record Vault...</p>
             </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
              <AchievementSummary summary={data.summary || {}} />

              {data.achievements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.achievements.map((achievement, idx) => (
                    <AchievementCard 
                      key={achievement.id + idx} 
                      achievement={achievement} 
                      index={idx}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-white/5 rounded-[3rem]">
                   <Sparkles size={48} className="text-zinc-800 mb-6" />
                   <h2 className="text-xl font-bold text-zinc-400 mb-2">The Vault is Waiting</h2>
                   <p className="text-zinc-600 max-w-sm mb-8 italic">
                     You haven't mastered any milestones yet. Complete your first memory to claim your place in the legacy.
                   </p>
                   <button 
                     onClick={() => navigate("/dashboard/new")}
                     className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all"
                   >
                     Start Your Journey
                   </button>
                </div>
              )}

              {/* Reward Footer */}
               <div className="mt-20 py-10 text-center border-t border-white/5">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Chronicle of a Future Self · Version 1.0</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AchievementsPage;
