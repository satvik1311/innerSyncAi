import React, { useState, useEffect } from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import API from "../../../lib/api";

export const InsightsWidget = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get("/insights");
        setInsights(res.data);
      } catch (err) {
        console.error("Insights error");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none" />

      <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
        <Sparkles className="text-yellow-400" size={18} /> AI Discoveries
      </h3>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-cyan-400" size={24} />
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {insights.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <h4 className="text-cyan-400 font-medium text-sm mb-1">{item.title}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
          {insights.length === 0 && (
             <p className="text-sm text-zinc-500 text-center">No insights available. Add more memories.</p>
          )}
        </div>
      )}
    </div>
  );
};
