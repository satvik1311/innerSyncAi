import React from "react";
import { motion } from "framer-motion";
import { Brain, Target, MessageCircle } from "lucide-react";
import GlassCard from "./GlassCard";

const Process = () => {
  const steps = [
    {
      icon: Brain,
      title: "Capture Your Thoughts",
      desc: "Record daily experiences, emotions, and shifts in perspective.",
      accent: "text-cyan-400",
      glow: "bg-cyan-500/10",
    },
    {
      icon: Target,
      title: "Build Goals & Roadmaps",
      desc: "AI breaks your vision into actionable tasks that evolve with you.",
      accent: "text-purple-400",
      glow: "bg-purple-500/10",
    },
    {
      icon: MessageCircle,
      title: "Talk to Your Future Self",
      desc: "Engage with an AI version of you that exists years ahead.",
      accent: "text-blue-400",
      glow: "bg-blue-500/10",
    },
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-black">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">How it <span className="text-gradient-purple">Works.</span></h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">A data-driven evolution system designed to bridge the gap between who you are and who you're becoming.</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connector Lines (Desktop) */}
          <div className="hidden md:block absolute top-[20%] left-[20%] right-[20%] h-px z-0">
             <svg className="w-full" height="40" viewBox="0 0 600 40" fill="none">
                <motion.path 
                  d="M0 20C150 20 150 20 300 20C450 20 450 20 600 20" 
                  stroke="rgba(34, 211, 238, 0.2)" 
                  strokeWidth="2" 
                  strokeDasharray="8 8"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
             </svg>
          </div>

          {steps.map((step, i) => (
            <div key={i} className="relative z-10">
              <GlassCard delay={i * 0.15} className="h-full flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl ${step.glow} border border-white/5`}>
                  <step.icon className={step.accent} size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white leading-tight">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm px-4">{step.desc}</p>
                
                <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-zinc-600 tracking-[0.3em] uppercase">
                  <span className="w-10 h-px bg-zinc-800" /> 0{i + 1}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
