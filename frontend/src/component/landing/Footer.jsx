import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative pt-32 pb-16 bg-black border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight text-white">
            Start syncing with your future today.
          </h2>
          <button
            onClick={() => navigate("/signup")}
            className="group relative inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-black font-extrabold text-xl hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
          >
            Get Early Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">InnerSync</span>
          </div>

          <div className="flex items-center gap-10 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-5">
            <a href="#" className="p-2.5 rounded-full glass-premium hover:text-white transition-all text-zinc-400"><Twitter size={18} /></a>
            <a href="#" className="p-2.5 rounded-full glass-premium hover:text-white transition-all text-zinc-400"><Github size={18} /></a>
            <a href="#" className="p-2.5 rounded-full glass-premium hover:text-white transition-all text-zinc-400"><Linkedin size={18} /></a>
          </div>
        </div>

        <p className="mt-16 text-center text-zinc-600 text-xs font-medium uppercase tracking-[0.2em]">
          © 2026 InnerSync (v1.0.4) — All rights reserved. Built for the future version of you.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
