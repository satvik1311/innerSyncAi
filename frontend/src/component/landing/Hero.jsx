import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, BrainCircuit, MessageSquare, ArrowRight, Play } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Hero = ({ onPreview }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-premium text-xs font-semibold text-cyan-400 mb-8 border border-cyan-500/20 shadow-glow-cyan"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>The New Standard for Self-Evolution</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8"
          >
            Sync with your <br />
            <span className="text-gradient-purple">future self.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed"
          >
            InnerSync AI helps you capture your thoughts, track your growth, and 
            get real-time guidance from the person you’re becoming.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 mb-20"
          >
            <button 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
            >
              {isAuthenticated ? "Open Your Vault" : "Get Started for Free"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onPreview}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass-premium text-white font-bold text-lg hover:bg-white/5 transition-all hover:scale-105 active:scale-95 border border-white/10 hover:border-cyan-500/30 hover:shadow-glow-cyan"
            >
              <Play size={18} fill="currentColor" /> Preview Your Vault
            </button>
          </motion.div>

          {/* AI Chat Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-4xl"
          >
            <div className="glass-premium rounded-3xl border border-white/10 shadow-2xl p-4 md:p-8 relative overflow-hidden">
               {/* Grid deco */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
               
               <header className="flex items-center gap-4 mb-8 text-left">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-0.5 shadow-glow-cyan">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                       <BrainCircuit className="text-cyan-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Future Self AI</h3>
                    <p className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Timeline Sync: +5 Years</p>
                  </div>
               </header>

               <div className="space-y-6 text-left max-w-lg">
                  <div className="flex gap-3">
                    <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white font-medium text-black text-sm leading-relaxed shadow-xl">
                      "I see you're struggling with decision paralysis today. Remember, 5 years from now, that big move you were scared of? It was the best thing we ever did."
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="px-5 py-4 rounded-2xl rounded-tr-none bg-white/5 border border-white/10 text-white text-sm leading-relaxed">
                      "How did you handle the fear of failure back then?"
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 text-cyan-50 text-sm leading-relaxed italic animate-pulse">
                      Future Self is typing...
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
