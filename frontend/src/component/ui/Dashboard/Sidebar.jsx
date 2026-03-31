import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Brain,
  FileText,
  MessageSquare,
  Lightbulb,
  Settings,
  Target
} from "lucide-react";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: Brain, path: "/dashboard" },
    { label: "Goals", icon: Target, path: "/dashboard/goals" },
    { label: "Conversations", icon: MessageSquare, path: "/dashboard/conversations" },
    { label: "Notes & Thoughts", icon: FileText, path: "/dashboard/notes" },
  ];

  return (
    <aside className="w-72 h-full p-6 flex flex-col justify-between bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Brain className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Memory Vault</h1>
            <p className="text-xs text-zinc-400 font-medium tracking-wide">AI Future Self</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/new")}
          className="w-full mb-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300"
        >
          + New Entry
        </button>

        <nav className="space-y-3 text-sm font-medium text-zinc-300">
          {navItems.map(({ label, icon: Icon, path }, i) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={i}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-cyan-400 shadow-inner"
                    : "hover:bg-white/5 hover:translate-x-1"
                }`}
              >
                <Icon size={18} className={isActive ? "text-cyan-400" : "text-zinc-400"} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => navigate("/dashboard/settings")}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition duration-200 text-zinc-400 hover:text-white mt-auto"
      >
        <Settings size={18} /> Settings
      </button>
    </aside>
  );
};
