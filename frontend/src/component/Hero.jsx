import { Brain, Clock, MessageCircle, Target } from "lucide-react";
import heroImage from "../assets/hero-cosmic.jpg";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-purple-950/20 to-neutral-950 relative overflow-hidden">
      {/* Floating cosmic elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-fuchsia-400 rounded-full animate-bounce opacity-80"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce opacity-70"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Hero Image */}
        <div className="mb-8 relative">
          <img
            src={heroImage}
            alt="InnerSync - Synchronize your present, master your future"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-20 rounded-2xl"></div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent italic">
          InnerSync <span className="text-white not-italic">AI</span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl mb-4 font-semibold text-fuchsia-400 tracking-wider">
          Synchronize Your Future Self
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Journey through time with AI-powered emotional intelligence. Record memories,
          chat with your wiser future self, and track your personal growth.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-lg font-semibold text-white shadow-lg hover:brightness-110 animate-pulse">
            Start Your Journey
          </button>
          <button className="px-6 py-3 rounded-xl border border-neutral-700 text-lg font-semibold text-neutral-200 hover:bg-white/5 inline-flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            See How It Works
          </button>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-md">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-neutral-200">Sync Engine</span>
          </div>

          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-md">
              <MessageCircle className="w-8 h-8 text-fuchsia-400" />
            </div>
            <span className="text-sm font-medium text-neutral-200">Future Self Chat</span>
          </div>

          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-md">
              <Target className="w-8 h-8 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-neutral-200">Goal Tracking</span>
          </div>

          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-md">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-neutral-200">Time Capsules</span>
          </div>
        </div>
      </div>
    </section>
  );
}