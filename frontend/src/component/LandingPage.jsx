import { useState } from "react";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Features from "./Features";
import Dashboard from "./Dashboard";

export default function LandingPage() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    // Pass onBack so Dashboard can return to Landing
    return <Dashboard onBack={() => setShowDashboard(false)} preview />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navigation />
      <Hero />
      <Features />

      {/* Demo Dashboard Button */}
      <section className="py-20 text-center bg-gradient-to-b from-purple-900/20 to-neutral-950">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            See how your AI Memory Vault dashboard will look and start connecting
            with your future self today.
          </p>
          <button
            onClick={() => setShowDashboard(true)}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:brightness-110"
          >
            Preview Your Vault
          </button>
        </div>
      </section>
    </div>
  );
}
