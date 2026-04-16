import React, { useState } from "react";
import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Process from "./landing/Process";
import FeatureGrid from "./landing/FeatureGrid";
import ProductPreview from "./landing/ProductPreview";
import Pricing from "./landing/Pricing";
import Footer from "./landing/Footer";
import VaultDemo from "./landing/VaultDemo";
import { AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Premium Noise Overlay */}
      <div className="bg-noise" />

      {/* Main Layout */}
      <div className="relative z-10">
        <Header />
        
        <main>
          <Hero onPreview={() => setShowDemo(true)} />
          <Process />
          <FeatureGrid />
          <ProductPreview />
          <Pricing />
        </main>

        <Footer />
      </div>

      <AnimatePresence>
        {showDemo && <VaultDemo isOpen={showDemo} onClose={() => setShowDemo(false)} />}
      </AnimatePresence>

      {/* Global Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>
    </div>
  );
}
