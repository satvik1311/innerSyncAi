import React from "react";
import { motion } from "framer-motion";
import { Target, Activity, Trophy, Flame } from "lucide-react";

/**
 * A visually simplified, high-fidelity mockup of the app dashboard 
 * to show off the UI styles.
 */
const ProductPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Command your growth.</h2>
        <p className="text-zinc-500 max-w-xl mx-auto">A dashboard that doesn't just list tasks, but shows your trajectory towards your best self.</p>
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-5xl mx-auto rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-4 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header Mockup */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 border border-white/20 shadow-glow-cyan" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Timeline Locked</p>
                <p className="text-white font-bold leading-none">Alex Rivera</p>
              </div>
            </div>
            <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5" />)}
            </div>
          </div>

          {/* Stats Row Mockup */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Active Syncs", value: "3/3", icon: Target, color: "text-cyan-400" },
              { label: "Daily Tasks", value: "8", icon: Flame, color: "text-amber-400" },
              { label: "Avg Progress", value: "64%", icon: Activity, color: "text-purple-400" },
              { label: "Elite Cards", value: "12", icon: Trophy, color: "text-green-400" },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                <stat.icon size={18} className={`${stat.color} mb-2`} />
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Large Area Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-[200px] rounded-2xl bg-white/5 border border-white/5" />
            <div className="h-[200px] rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductPreview;
