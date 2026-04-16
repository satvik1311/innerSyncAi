import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`glass-premium rounded-3xl p-8 relative group overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
