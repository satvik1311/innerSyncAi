import React, { useState, useEffect } from "react";
import { Target, CheckCircle2, Circle, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../../lib/api";

export const GoalsWidget = () => {
  const [goals, setGoals] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const fetchGoals = async () => {
    try {
      const res = await API.get("/goals");
      setGoals(res.data);
    } catch (e) { console.error("Goals error"); }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await API.post("/goals", { title: newTitle });
      setNewTitle("");
      fetchGoals();
    } catch {}
  };

  const toggleGoal = async (g) => {
    try {
      await API.put(`/goals/${g._id}`, { status: g.status === "completed" ? "in_progress" : "completed" });
      fetchGoals();
    } catch {}
  };

  const completedCount = goals.filter(g => g.status === "completed").length;
  const progressPercent = goals.length === 0 ? 0 : Math.round((completedCount / goals.length) * 100);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Target className="text-purple-400" size={18} /> Active Goals
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">{progressPercent}%</span>
          <button onClick={() => navigate('/dashboard/goals')} className="p-1 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition">
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <div className="w-full bg-black/40 h-2 rounded-full mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-hide">
        {goals.map((g) => (
          <div key={g._id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group cursor-pointer" onClick={() => toggleGoal(g)}>
            {g.status === "completed" ? (
              <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            ) : (
              <Circle size={18} className="text-zinc-500 group-hover:text-purple-400 shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${g.status === "completed" ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
              {g.title}
            </span>
          </div>
        ))}
        {goals.length === 0 && (
           <p className="text-sm text-zinc-500 text-center mt-4">No goals yet. Set your first milestone!</p>
        )}
      </div>

      <form onSubmit={addGoal} className="mt-auto relative">
        <input 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New goal..."
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 font-medium text-sm hover:text-purple-300">
          Add
        </button>
      </form>
    </div>
  );
};
