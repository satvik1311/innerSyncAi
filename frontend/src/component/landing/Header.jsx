import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      setIsScrolled(true);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#process" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
      <div className="container mx-auto px-6">
        <nav className={`mx-auto max-w-5xl rounded-full transition-all duration-300 border ${
          isScrolled 
            ? "bg-black/40 backdrop-blur-xl border-white/10 px-6 py-2 shadow-2xl" 
            : "bg-transparent border-transparent px-2 py-2"
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate("/")}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-glow-cyan group-hover:scale-110 transition-transform">
                <img src="/logo.png" alt="InnerSync" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                InnerSync <span className="text-zinc-500 font-medium">AI</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Call to Action */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95 px-5 py-2.5 border border-white/10 hover:border-cyan-500/50 rounded-full bg-white/5 backdrop-blur-md"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 border border-white/20 hover:border-purple-500/50 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-glow-purple"
              >
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-zinc-400 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8"
          >
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
              <div className="w-full h-px bg-white/10" />
              <button onClick={() => navigate("/login")} className="text-zinc-400 font-medium">Log in</button>
              <button 
                onClick={() => navigate("/signup")}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold text-center"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
