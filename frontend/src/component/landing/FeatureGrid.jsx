import React from "react";
import { motion } from "framer-motion";
import { Zap, Bot, BarChart3, Fingerprint, Calendar, Sparkles } from "lucide-react";
import GlassCard from "./GlassCard";

const FeatureGrid = () => {
  return (
    <section id="features" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16 px-4">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Engineered for <br/>
            <span className="text-gradient-purple">human evolution.</span>
          </h2>
          <p className="text-zinc-500 text-lg">Every feature is designed to turn your data into personal wisdom.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px]">
          
          {/* Main Feature: Future Self Conversation */}
          <GlassCard className="md:col-span-8 flex flex-col justify-end">
            <div className="absolute top-8 right-8 text-cyan-500 opacity-20 group-hover:opacity-40 transition-opacity">
                <Bot size={120} />
            </div>
            <div className="p-2 w-fit rounded-lg bg-cyan-500/10 text-cyan-400 mb-6 font-bold text-[10px] tracking-widest uppercase">
              Core Protocol
            </div>
            <h3 className="text-3xl font-bold mb-3 text-white">Future Self Conversations</h3>
            <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
              Experience the singular thrill of receiving advice from the version of you that already achieved your goals. Our LLM learns your tone and memory context deeply.
            </p>
          </GlassCard>

          {/* Feature: Goal Roadmaps */}
          <GlassCard className="md:col-span-4 flex flex-col justify-end bg-gradient-to-br from-purple-900/10 to-transparent">
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Zap className="text-purple-400" size={20} />
             </div>
             <h3 className="text-xl font-bold mb-2 text-white">AI-Powered Roadmaps</h3>
             <p className="text-zinc-500 text-sm leading-relaxed">
                Break any complex goal into a chronological roadmap that updates as you evolve.
             </p>
          </GlassCard>

          {/* Feature: Daily Focus */}
          <GlassCard className="md:col-span-4 flex flex-col justify-end">
             <Calendar className="text-blue-400 mb-6" size={24} />
             <h3 className="text-xl font-bold mb-2 text-white">Daily Focus Deck</h3>
             <p className="text-zinc-500 text-sm">
                A high-performance command center for your day. Tasks are prioritized by your AI Guide.
             </p>
          </GlassCard>

          {/* Feature: Insights */}
          <GlassCard className="md:col-span-4 flex flex-col justify-end relative overflow-hidden">
             <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 blur-2xl rounded-full" />
             <BarChart3 className="text-green-400 mb-6" size={24} />
             <h3 className="text-xl font-bold mb-2 text-white">Behavior Insights</h3>
             <p className="text-zinc-500 text-sm">
                Understand your underlying habits with automated weekly analysis and reports.
             </p>
          </GlassCard>

          {/* Feature: Security */}
          <GlassCard className="md:col-span-4 flex flex-col justify-end">
             <Fingerprint className="text-zinc-400 mb-6" size={24} />
             <h3 className="text-xl font-bold mb-2 text-white">Neural Cryptography</h3>
             <p className="text-zinc-500 text-sm">
                Your thoughts are yours alone. AES-256 encryption at rest and in transit.
             </p>
          </GlassCard>

        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
