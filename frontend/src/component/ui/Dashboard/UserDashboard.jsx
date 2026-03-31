import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ChatInterface } from "./ChatInterface";
import { MemoryTimeline } from "./MemoryTimeline";
import { GoalsWidget } from "./GoalsWidget";
import { InsightsWidget } from "./InsightsWidget";
import { Bell, Sparkles } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Explorer");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const payloadJSON = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadJSON);
        if (payload.email) {
          const namePart = payload.email.split('@')[0];
          setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {
        console.error("Invalid token format");
      }
    }
  }, [navigate]);

  return (
    // 1. Root Container uses min-h-screen to allow proper document scrolling
    // 2. Removed overflow-hidden on the root container to prevent any clipping from the top or bottom
    // 3. Removed absolute positioning so it respects the natural DOM flow
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans w-full relative">
      
      {/* Background Decorators (Fixed behind content) */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Sidebar Layout */}
      {/* 4. Ensures the Sidebar stays fixed on the screen while the main content can scroll naturally */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>
      
      {/* Main Content Area */}
      {/* 5. Main content stretches full width alongside the sidebar */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 z-10 flex flex-col">
        
        {/* Top Navigation / Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome back, {userName}.
            </h2>
            <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400 shrink-0" /> 
              <span>Here is your personalized knowledge overview.</span>
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition">
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950" />
              <Bell size={20} className="text-zinc-300" />
            </button>
            <div 
              onClick={() => navigate('/dashboard/settings')}
              className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-cyan-500/30 transition group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-md flex items-center justify-center text-white font-bold text-sm shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium group-hover:text-cyan-400 transition-colors">{userName}</p>
                <p className="text-xs text-zinc-500">View Profile</p>
              </div>
            </div>
          </div>
        </header>

        {/* BENTO GRID LAYOUT */}
        {/* 5. Uses a 50/50 layout to give Chat Interface exactly half the window */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          
          {/* Left Column: Timeline & Goals & Insights */}
          <div className="flex flex-col gap-6">
            
            <div className="w-full">
              <MemoryTimeline />
            </div>

            <div className="flex flex-col gap-6 w-full flex-1">
              <div className="min-h-[300px] w-full"><GoalsWidget /></div>
              <div className="min-h-[300px] w-full"><InsightsWidget /></div>
            </div>

          </div>

          {/* Right Column: AI Chat */}
          {/* Sandbox style: Takes up the entire right half of the screen */}
          <div className="w-full h-[700px] lg:h-full lg:sticky lg:top-0 lg:max-h-[calc(100vh-140px)]">
            <ChatInterface />
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;