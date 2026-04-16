import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Tag, Target, Send, Loader2 } from "lucide-react";
import axios from "axios";

const ThoughtInput = ({ onSaveSuccess }) => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [tags, setTags] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const moods = [
    { label: "Focused", icon: "🎯", color: "text-cyan-400" },
    { label: "Confused", icon: "🤔", color: "text-zinc-400" },
    { label: "Stressed", icon: "😫", color: "text-red-400" },
    { label: "Anxious", icon: "😰", color: "text-orange-400" },
    { label: "Happy", icon: "😊", color: "text-yellow-400" },
    { label: "Motivated", icon: "⚡", color: "text-purple-400" },
    { label: "Tired", icon: "😴", color: "text-blue-300" },
    { label: "Grateful", icon: "🙏", color: "text-emerald-400" },
    { label: "Neutral", icon: "😐", color: "text-slate-400" },
  ];

  useEffect(() => {
    // Fetch goals for linking
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/memory/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(res.data);
      } catch (err) {
        console.error("Goals fetch error", err);
      }
    };
    fetchGoals();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/thoughts/",
        {
          content,
          mood,
          tags: tags.split(",").map(t => t.trim()).filter(t => t),
          goal_id: selectedGoal || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent("");
      setMood("Neutral");
      setTags("");
      setSelectedGoal("");
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Thought save error", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-premium rounded-3xl p-6 border border-white/10 relative z-30">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-cyan-400" />
        Quick Brain Dump
      </h2>

      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's causing friction or momentum today?"
        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm 
          placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/30 transition-all resize-none mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Mood Selector */}
        <div className="relative">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Current Mood</label>
          <button 
            onClick={() => setShowMoodPicker(!showMoodPicker)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white flex items-center justify-between hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{moods.find(m => m.label === mood)?.icon}</span>
              {mood}
            </span>
            <div className={`w-2 h-2 rounded-full ${moods.find(m => m.label === mood)?.color.replace("text-", "bg-")}`} />
          </button>

          <AnimatePresence>
            {showMoodPicker && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-64 overflow-y-auto custom-scrollbar"
              >
                <div className="grid grid-cols-1 gap-1">
                  {moods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => {
                        setMood(m.label);
                        setShowMoodPicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                        ${mood === m.label ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-125 transition-transform duration-200">{m.icon}</span>
                        <span className="font-medium">{m.label}</span>
                      </div>
                      {mood === m.label && (
                        <div className={`w-1.5 h-1.5 rounded-full ${m.color.replace("text-", "bg-")} shadow-[0_0_8px_currentColor]`} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Tags (commas)</label>
          <div className="relative">
            <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, anxiety, win"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Goal Link */}
      <div className="mb-6">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Link to Active Goal (Optional)</label>
        <div className="relative">
          <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-900">General Reflection (No specific goal)</option>
            {goals.map(g => (
              <option key={g._id} value={g._id} className="bg-zinc-900">{g.title}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        disabled={isSaving || !content.trim()}
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm
          flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
          hover:shadow-glow-cyan/20 hover:scale-[1.01] transition-all duration-300"
      >
        {isSaving ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Send size={16} />
        )}
        {isSaving ? "Syncing with Future Self..." : "Lock in Memory"}
      </button>
    </div>
  );
};

export default ThoughtInput;
