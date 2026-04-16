import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../lib/api";

export const InsightsWidget = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/user/insights")
      .then(res => setInsights(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-glow flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Zap size={17} className="text-amber-400" /> Behavioral Insights
        </h2>
        {loading && <Loader2 size={16} className="text-zinc-500 animate-spin" />}
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {!loading && insights.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm py-4 gap-2">
            <Sparkles size={24} className="text-purple-500/40" />
            <p>Gathering enough data to analyze your behavior.</p>
          </div>
        )}

        <AnimatePresence>
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors"
            >
              <h4 className="text-sm font-semibold text-zinc-200 mb-1 leading-tight">{insight.title}</h4>
              <p className="text-xs text-zinc-400 leading-snug">{insight.desc}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
