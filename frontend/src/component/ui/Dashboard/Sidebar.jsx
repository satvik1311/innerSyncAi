import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Plus,
  LogOut,
} from "lucide-react";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Today's Tasks", icon: CheckSquare, path: "/dashboard/tasks" },
    { label: "Future Self", icon: MessageSquare, path: "/dashboard/chat" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="relative w-full h-full flex flex-col p-5 overflow-hidden
      bg-white/5 backdrop-blur-2xl border-r border-white/10">

      {/* ambient side glow */}
      <div className="pointer-events-none absolute top-[-10%] left-[-30%] w-[200px] h-[300px]
        rounded-full bg-cyan-500/15 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-[-5%] left-[-20%] w-[180px] h-[200px]
        rounded-full bg-purple-500/10 blur-[70px]" />

      {/* logo */}
      <div className="flex items-center gap-3 mb-10 z-10">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500
          shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <Brain className="text-white" size={22} />
        </div>
        <div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400
            bg-clip-text text-transparent leading-tight">Memory Vault</h1>
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase">AI Future Self</p>
        </div>
      </div>

      {/* new memory CTA */}
      <button
        onClick={() => navigate("/dashboard/new")}
        className="z-10 w-full mb-6 py-3 rounded-xl flex items-center justify-center gap-2
          bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold
          shadow-[0_0_18px_rgba(168,85,247,0.35)]
          hover:shadow-[0_0_28px_rgba(6,182,212,0.55)] hover:scale-[1.02] transition-all duration-300"
      >
        <Plus size={15} /> New Memory
      </button>

      {/* nav */}
      <nav className="z-10 flex flex-col gap-1.5">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white border border-cyan-500/25 shadow-[0_0_14px_rgba(6,182,212,0.2)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                }`}
            >
              <Icon size={17} className={isActive ? "text-cyan-400" : "text-zinc-500"} />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400
                  shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/5 pt-5 z-10">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-2">Older Conversations</h3>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[200px] pr-1">
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors truncate">
            "How to stick to my routine..."
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors truncate">
            "Reviewing my monthly goals"
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors truncate">
            "Ideas for better sleep"
          </button>
        </div>
      </div>

      {/* spacer */}
      <div className="flex-1" />

      {/* logout */}
      <button
        onClick={handleLogout}
        className="z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500
          hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 text-sm"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </aside>
  );
};
