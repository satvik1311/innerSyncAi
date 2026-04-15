import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CheckCircle2, Circle, RefreshCw, Target, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../lib/api";

const TodayTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null); // task id being completed
  const [tab, setTab] = useState("pending");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const r = await API.get(tab === "pending" ? "/task/today" : "/task/old");
      setTasks(r.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchTasks();
  }, [navigate, tab]);

  const markComplete = async (memoryId, taskId) => {
    setCompleting(taskId);
    try {
      await API.post("/task/complete", { memory_id: memoryId, task_id: taskId });
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0">
        <div className="sticky top-0 h-screen w-full"><Sidebar /></div>
      </div>

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-2xl">

          <button onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-1">
                {tab === "pending" ? "Today's Action Items" : "Old Task Collection"}
              </h2>
              <p className="text-zinc-400 text-sm">
                {loading ? "Loading..." : tasks.length === 0
                  ? (tab === "pending" ? "All clear for today 🎉" : "No completed tasks yet.")
                  : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} ${tab === "pending" ? "pending" : "completed"}`}
              </p>
            </div>
            <div className="flex items-center gap-3 border border-white/5 bg-black/20 p-1.5 rounded-2xl">
              <div className="flex bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setTab("pending")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "pending" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-zinc-400 hover:text-white border border-transparent"}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setTab("completed")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "completed" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-zinc-400 hover:text-white border border-transparent"}`}
                >
                  Completed
                </button>
              </div>
              <button onClick={fetchTasks}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition">
                <RefreshCw size={18} className={loading ? "animate-spin text-cyan-400" : "text-zinc-400"} />
              </button>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw size={32} className="animate-spin text-cyan-400 opacity-60" />
            </div>
          ) : tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="p-12 bg-white/5 border border-white/10 rounded-3xl text-center flex flex-col items-center gap-4 mt-10">
              <div className={`p-4 rounded-full ${tab === "pending" ? "bg-green-500/15 border border-green-500/25" : "bg-white/5 border border-white/10"}`}>
                <CheckCircle2 size={36} className={tab === "pending" ? "text-green-400" : "text-zinc-600"} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{tab === "pending" ? "You're all caught up!" : "No tasks completed yet."}</h3>
                <p className="text-zinc-500 text-sm">{tab === "pending" ? "No pending tasks for today. Keep the streak alive." : "Complete some pending tasks to see them here."}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div key={task.id} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    className={`flex items-start gap-4 p-5 backdrop-blur-xl border border-white/10 rounded-2xl transition-all group shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${
                      tab === "completed" ? "bg-white/[0.02] opacity-75" : "bg-white/5 hover:border-amber-500/30"
                    }`}>

                    <button
                      onClick={() => tab === "pending" && markComplete(task.memory_id, task.id)}
                      disabled={completing === task.id || tab === "completed"}
                      className={`mt-0.5 shrink-0 transition-colors disabled:opacity-50 ${tab === "completed" ? "text-green-500 cursor-default" : "text-zinc-500 hover:text-green-400"}`}
                    >
                      {completing === task.id
                        ? <RefreshCw size={22} className="animate-spin text-cyan-400" />
                        : tab === "completed" ? <CheckCircle2 size={22} /> : <Circle size={22} className="group-hover:scale-110 transition-transform" />
                      }
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-base font-medium leading-snug ${tab === "completed" ? "text-zinc-500 line-through" : "text-zinc-100"}`}>{task.text}</p>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Target size={11} className="text-purple-400 shrink-0" />
                        {task.memory_title}
                      </span>
                    </div>

                    {tab === "pending" && (
                      <button
                        onClick={() => markComplete(task.memory_id, task.id)}
                        disabled={completing === task.id}
                        className="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-green-500/15 text-green-400
                          border border-green-500/25 hover:bg-green-500/25 transition disabled:opacity-40"
                      >
                        Done
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodayTasks;
