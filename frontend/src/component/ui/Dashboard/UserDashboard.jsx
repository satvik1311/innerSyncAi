import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import AvatarPreview from "./AvatarPreview";
import {
  Sparkles, Target, CheckCircle2, Circle, BrainCircuit,
  Send, Loader2, User, Activity, Trophy, Flame, Plus,
  ArrowUpRight, Bell
} from "lucide-react";
import API from "../../../lib/api";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { InsightsWidget } from "./InsightsWidget";
import FutureYouCard from "./FutureYouCard";
import EvolutionCard from "./EvolutionCard";


/* ─── helpers ─────────────────────────────────────────── */
const getUserName = () => {
  return "Explorer";
};

/* ─── Stat Card ───────────────────────────────────────── */
const STAT_STYLES = {
  cyan:   { wrap: "bg-gradient-to-br from-cyan-500/20 to-cyan-500/0 border-cyan-500/30",   icon: "text-cyan-400",   glow: "bg-cyan-400" },
  purple: { wrap: "bg-gradient-to-br from-purple-500/20 to-purple-500/0 border-purple-500/30", icon: "text-purple-400", glow: "bg-purple-400" },
  amber:  { wrap: "bg-gradient-to-br from-amber-500/20 to-amber-500/0 border-amber-500/30",   icon: "text-amber-400",  glow: "bg-amber-400" },
  green:  { wrap: "bg-gradient-to-br from-green-500/20 to-green-500/0 border-green-500/30",   icon: "text-green-400",  glow: "bg-green-400" },
};
const StatCard = ({ icon: Icon, label, value, accent = "cyan", sub, index = 0 }) => {
  const s = STAT_STYLES[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className={`relative overflow-hidden p-5 rounded-2xl border backdrop-blur-xl flex flex-col gap-1 ${s.wrap}`}
    >
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-40 ${s.glow}`} />
      <Icon size={20} className={`${s.icon} mb-1`} />
      <p className="text-2xl font-bold text-white leading-tight">{value}</p>
      <p className="text-xs text-zinc-400 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-zinc-600 mt-1">{sub}</p>}
    </motion.div>
  );
};

/* ─── Progress Ring ───────────────────────────────────── */
const ProgressRing = ({ pct, size = 80, stroke = 7, accent = "#06b6d4" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={accent} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
        filter={`drop-shadow(0 0 6px ${accent})`}
      />
    </svg>
  );
};

/* ─── Memory Card ─────────────────────────────────────── */
const MemoryCard = ({ mem, index = 0 }) => {
  const pct = mem.progress || 0;
  const isStrict = mem.mode === "strict";
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + (index * 0.05) }}
      className="relative overflow-hidden p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group flex gap-4 items-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative shrink-0">
        <ProgressRing pct={pct} size={60} stroke={5} accent={isStrict ? "#f87171" : "#06b6d4"} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{pct}%</span>
      </div>
      <div className="flex-1 min-w-0 z-10">
        <p className="text-sm font-semibold text-white truncate">{mem.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{mem.description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${isStrict ? "bg-red-500/15 text-red-400" : "bg-cyan-500/15 text-cyan-400"}`}>
            {isStrict ? "⚡ Strict" : "✦ Soft"}
          </span>
          <span className="text-[10px] text-zinc-600 font-medium tracking-wide">Sync: {pct}%</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Task Item ───────────────────────────────────────── */
const TaskItem = ({ task, onComplete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 12, scale: 0.95 }}
    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/20 transition-all group"
  >
    <button
      onClick={() => onComplete(task.memory_id, task.id)}
      className="mt-0.5 shrink-0 text-zinc-500 hover:text-cyan-400 transition-colors"
    >
      <Circle size={18} className="group-hover:scale-110 transition-transform" />
    </button>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-zinc-200 leading-snug">{task.text}</p>
      <p className="text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
        <Target size={10} className="text-purple-400" /> {task.memory_title}
      </p>
    </div>
  </motion.div>
);

/* ─── Main Dashboard ──────────────────────────────────── */
const UserDashboard = () => {
  const navigate = useNavigate();
  const userName = getUserName();
  const [memories, setMemories]   = useState([]);
  const [tasks, setTasks]         = useState([]);
  const [chartData, setChartData] = useState([]);
  const [profile, setProfile]     = useState(null);
  const [streakData, setStreakData] = useState(null);
  const chatEndRef = useRef(null);

  // Chat state
  const [chat, setChat]       = useState([]);
  const [msg, setMsg]         = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  /* fetch memories */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    API.get("/memory/list").then(r => {
      setMemories(r.data || []);

      // Build a simple progress-over-time chart from memories
      const pts = (r.data || []).map((m, i) => ({
        name: `Memory ${i + 1}`,
        progress: m.progress || 0,
        tasks: m.tasks?.length || 0,
      }));
      if (pts.length === 0) pts.push({ name: "Start", progress: 0, tasks: 0 });
      setChartData(pts);
    }).catch(console.error);

    API.get("/user/profile").then(r => setProfile(r.data)).catch(console.error);
    API.get("/user/streak").then(r => setStreakData(r.data)).catch(console.error);
    API.get("/task/today").then(r => setTasks(r.data || [])).catch(console.error);
  }, [navigate]);

  /* scroll chat to bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, chatLoading]);

  const completeTask = async (memId, taskId) => {
    try {
      await API.post("/task/complete", { memory_id: memId, task_id: taskId });
      setTasks(prev => prev.filter(t => t.id !== taskId));
      // Optionally could add top-level feedback here but keeping dashboard focused.
    } catch (e) { console.error(e); }
  };

  const sendChat = async () => {
    if (!msg.trim()) return;
    const text = msg;
    setMsg("");
    setChat(p => [...p, { sender: "user", text }]);
    setChatLoading(true);
    try {
      const r = await API.post("/chat", { message: text });
      setChat(p => [...p, { sender: "ai", text: r.data.reply }]);
    } catch {
      setChat(p => [...p, { sender: "ai", text: "Connection to future timeline lost. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAvatarSync = async (data) => {
    try {
      const res = await API.put("/user/avatar_sync", data);
      // Update local profile state
      setProfile(prev => ({ 
        ...prev, 
        avatar_seed: data.avatar_seed, 
        avatar_style: data.avatar_style,
        avatar_score: res.data.stats.score,
        avatar_state: res.data.stats.state
      }));
    } catch (err) {
      console.error("Failed to sync 2D avatar", err);
    }
  };

  /* — derived stats — */
  const activeMemories   = memories.filter(m => m.status === "active");
  const completedMemories = memories.filter(m => m.status === "completed").length;
  const avgProgress      = activeMemories.length
    ? Math.round(activeMemories.reduce((s, m) => s + (m.progress || 0), 0) / activeMemories.length)
    : 0;
  const pendingTasks = tasks.length;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">
      {/* ── ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />
      </div>

      {/* ── sidebar ── */}
      <div className="hidden lg:flex w-72 shrink-0">
        <div className="sticky top-0 h-screen w-full">
          <Sidebar />
        </div>
      </div>

      {/* ── main ── */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto">

        <header className="mb-10">
          <EvolutionCard profile={profile} streakData={streakData} />
          
          <div className="flex items-center justify-between mt-8">
            <div className="hidden sm:block">
              <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase mb-1">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p className="text-sm text-zinc-400 flex items-center gap-1.5 leading-none">
                <Sparkles size={13} className="text-cyan-400" />
                Synchronize your present, master your future.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition">
                <Bell size={18} className="text-zinc-300" />
                {pendingTasks > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => navigate("/dashboard/new")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
              >
                <Plus size={16} /> New Memory
              </button>
            </div>
          </div>
        </header>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Target}      label="Active Memories"   value={`${activeMemories.length}/3`}   accent="cyan"   sub="Max 3 at once" index={0} />
          <StatCard icon={Flame}       label="Pending Tasks"     value={pendingTasks}                    accent="amber"  sub="Due today"      index={1} />
          <StatCard icon={Activity}    label="Avg Progress"      value={`${avgProgress}%`}               accent="purple" sub="Across goals"    index={2} />
          <StatCard icon={Trophy}      label="Completed"         value={completedMemories}               accent="green"  sub="Finalized"      index={3} />
        </div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ─ LEFT COLUMN: memories + tasks ─ */}
          <div className="xl:col-span-2 flex flex-col gap-5">

            {/* Active Memories */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Target size={17} className="text-cyan-400" /> Active Memories
                </h2>
                <button
                  onClick={() => navigate("/dashboard/new")}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-cyan-400 transition px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              {activeMemories.length === 0 ? (
                <div className="py-10 text-center text-zinc-500 text-sm">
                  No active memories.{" "}
                  <button onClick={() => navigate("/dashboard/new")} className="text-cyan-400 hover:underline">
                    Create your first goal →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeMemories.map((m, i) => <MemoryCard key={m._id} mem={m} index={i} />)}
                </div>
              )}
            </motion.section>

            {/* Today's Tasks */}
            <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-amber-400" /> Today's Action Items
                </h2>
                {pendingTasks > 0 && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                    {pendingTasks} pending
                  </span>
                )}
              </div>

              {tasks.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
                  <CheckCircle2 size={32} className="text-green-400/40" />
                  All done for today! Keep up the momentum.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence>
                    {tasks.map(t => (
                      <TaskItem key={t.id} task={t} onComplete={completeTask} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Progress Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-glow">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-white flex items-center gap-2">
                      <Activity size={17} className="text-purple-400" /> Progress Overview
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Completion % across your memories</p>
                  </div>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="prog" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#3f3f46" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#3f3f46" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
                        itemStyle={{ color: "#a855f7" }}
                      />
                      <Area type="monotone" dataKey="progress" stroke="#a855f7" strokeWidth={2.5} fill="url(#prog)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Insights Widget */}
              <InsightsWidget />
            </div>

          </div>

          {/* ─ RIGHT COLUMN: Future Self Chat ─ */}
          <div className="xl:col-span-1 flex flex-col gap-5">
            
            {/* 2D Future Self Card */}
            <FutureYouCard 
              profile={profile} 
              onSync={handleAvatarSync} 
            />

            <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-glow flex flex-col overflow-hidden"
              style={{ height: "calc(100vh - 580px)", minHeight: 350 }}>

              {/* chat header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/3">
                <div className="p-2 rounded-full bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                  <BrainCircuit size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Future Self</p>
                  <p className="text-[10px] text-cyan-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                    Online · +5 Years
                  </p>
                </div>
                <button
                  onClick={() => navigate("/dashboard/chat")}
                  className="ml-auto text-zinc-500 hover:text-white transition"
                  title="Open full chat"
                >
                  <ArrowUpRight size={16} />
                </button>
              </div>

              {/* chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center gap-3">
                    <Sparkles size={32} className="text-purple-400/40" />
                    <p className="text-xs max-w-[180px]">Talk to the version of you that made it. Ask anything.</p>
                  </div>
                )}
                <AnimatePresence>
                  {chat.map((m, i) => {
                    const isUser = m.sender === "user";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-purple-600" : "bg-cyan-500/20"}`}>
                          {isUser ? <User size={12} /> : <BrainCircuit size={12} className="text-cyan-400" />}
                        </div>
                        <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                          isUser
                            ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-tr-sm"
                            : "bg-white/10 text-zinc-200 border border-white/5 rounded-tl-sm"
                        }`} style={{ whiteSpace: "pre-wrap" }}>
                          {m.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {chatLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <BrainCircuit size={12} className="text-cyan-400" />
                    </div>
                    <div className="px-3 py-2.5 rounded-2xl bg-white/10 border border-white/5 rounded-tl-sm flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* chat input */}
              <div className="p-3 border-t border-white/10 bg-white/3">
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 focus-within:border-cyan-500/50 transition">
                  <input
                    className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                    placeholder="Ask your future self..."
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!msg.trim() || chatLoading}
                    className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition disabled:opacity-40"
                  >
                    {chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </div>

            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;