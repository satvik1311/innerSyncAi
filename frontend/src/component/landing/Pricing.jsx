import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Zap, Sparkles, ShieldCheck } from "lucide-react";
import GlassCard from "./GlassCard";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free Plan",
      price: "0",
      desc: "Perfect for exploring your internal landscape.",
      features: [
        "10 Active Memories",
        "3 AI Syncs per day",
        "Basic insights",
        "Demo access",
      ],
      cta: "Start Free",
      color: "text-zinc-400",
      glow: "",
    },
    {
      name: "Pro Plan",
      price: "19",
      desc: "Full synchronization with your future self.",
      features: [
        "Unlimited Memories",
        "Unlimited AI Future Self access",
        "Goal + Roadmap system",
        "Advanced behavioral insights",
        "Priority performance",
      ],
      cta: "Go Pro",
      color: "text-purple-400",
      glow: "shadow-glow-purple border-purple-500/30",
      popular: true,
    },
    {
      name: "Elite",
      price: "49",
      desc: "The ultimate tool for self-mastery.",
      features: [
        "Voice & Video memories",
        "Deep AI Neural Analysis",
        "Personalized Monthly Reports",
        "Early access to beta features",
        "Private Slack community",
      ],
      cta: "Join Elite",
      color: "text-cyan-400",
      glow: "shadow-glow-cyan border-cyan-500/30",
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-black">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Investment in <span className="text-gradient-cyan">You.</span></h2>
          <p className="text-zinc-500 text-lg">Choose a plan that scales with your ambition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <GlassCard key={i} delay={i * 0.1} className={`relative flex flex-col h-full ${plan.glow}`}>
              {plan.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg z-20">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-black mb-2 tracking-tight ${plan.color}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-zinc-500 text-xs font-medium">/mo</span>
                </div>
                <p className="text-zinc-500 text-sm mt-4 leading-relaxed font-medium">
                  {plan.desc}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Check className="text-white" size={10} strokeWidth={4} />
                    </div>
                    <span className="text-zinc-400 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate("/signup")}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${
                    plan.popular 
                      ? "bg-white text-black shadow-glow" 
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                {plan.cta} <ArrowRight size={16} />
              </button>
            </GlassCard>
          ))}
        </div>

        <p className="mt-16 text-center text-zinc-600 text-xs font-medium uppercase tracking-[0.2em]">
            Trusted by 2,000+ individuals on the path to their future self.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
