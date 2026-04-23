import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Plus,
  LogOut,
  User,
  PenLine,
  Map,
  Network,
  Trash2,
  XCircle,
  BrainCircuit,
  Trophy
} from "lucide-react";

export const Sidebar = ({
  threads = [],
  onSelectThread,
  activeThreadId,
  onDeleteThread,
  onDeleteAll
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Capture Thoughts", icon: PenLine, path: "/dashboard/thoughts" },
    { label: "Today's Tasks", icon: CheckSquare, path: "/dashboard/tasks" },
    { label: "Future Self", icon: MessageSquare, path: "/dashboard/chat" },
    { label: "Roadmap", icon: Map, path: "/dashboard/roadmap" },
    { label: "Neural Map", icon: Network, path: "/dashboard/resonance" },
    { label: "Future Self Signals", icon: BrainCircuit, path: "/dashboard/nudges" },
    { label: "Achievements", icon: Trophy, path: "/dashboard/achievements" },
    { label: "Identity & Core", icon: User, path: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="relative w-full h-full flex flex-col p-5 overflow-hidden
      bg-zinc-950/40 backdrop-blur-2xl border-r border-white/10 font-sans">

      {/* Ambient backgrounds */}
      <div className="pointer-events-none absolute top-[-10%] left-[-30%] w-[200px] h-[300px]
        rounded-full bg-cyan-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-[10%] left-[-20%] w-[180px] h-[200px]
        rounded-full bg-purple-500/10 blur-[70px]" />

      {/* Header section (fixed) */}
      <div className="shrink-0 mb-8 z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-1 rounded-xl bg-white/5 border border-white/10
            shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400
              bg-clip-text text-transparent leading-tight">InnerSync</h1>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Cognitive Sync Center</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/new")}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2
            bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold
            shadow-[0_0_15px_rgba(168,85,247,0.2)]
            hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all duration-300"
        >
          <Plus size={15} /> New Memory
        </button>
      </div>

      {/* Main Navigation (Scrollable if height is restricted) */}
      <nav className="z-10 flex flex-col gap-1 mb-6 overflow-y-auto custom-scrollbar shrink-0 max-h-[40vh]">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/10 text-white border border-cyan-500/25 shadow-[0_0_14px_rgba(6,182,212,0.15)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 hover:translate-x-1"
                }`}
            >
              <Icon size={17} className={isActive ? "text-cyan-400" : "text-zinc-500"} />
              <span className="truncate">{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400
                  shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Recent Intervals (Expanded Flex) */}
      <div className="border-t border-white/5 pt-6 z-10 flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Recent Intervals</h3>
          {threads.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10"
              title="Clear All History"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1 pb-4">
          {threads.length > 0 ? (
            threads.map((t) => (
              <div key={t.conversation_id} className="group relative flex items-center">
                <button
                  onClick={() => onSelectThread ? onSelectThread(t.conversation_id) : navigate("/dashboard/chat")}
                  className={`w-full text-left pl-3 pr-10 py-3 rounded-xl text-sm transition-all truncate border ${activeThreadId === t.conversation_id
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.08)] font-medium"
                      : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                    }`}
                >
                  {t.title || "Untitled Session"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(t.conversation_id);
                  }}
                  className="absolute right-3 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Session"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          ) : (
            <p className="px-3 text-xs text-zinc-600 italic mt-2">No threads detected.</p>
          )}
          <div className="h-6" /> {/* Scroll margin */}
        </div>
      </div>

      {/* Footer (Fixed) */}
      <div className="mt-4 pt-4 border-t border-white/5 z-10 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500
            hover:text-red-400 hover:bg-red-500/8 transition-all duration-300 text-sm group"
        >
          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
