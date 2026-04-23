import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BrainCircuit, Zap, TrendingDown, Target, CheckCheck, Inbox } from "lucide-react";
import API from "../../../lib/api";

const PATTERN_META = {
  inactivity_3d: {
    label: "Inactivity Detected",
    icon: Zap,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    iconColor: "text-amber-400",
  },
  negative_streak: {
    label: "Mood Pattern Alert",
    icon: TrendingDown,
    color: "from-red-500/20 to-pink-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-300",
    iconColor: "text-red-400",
  },
  goal_avoidance: {
    label: "Goal Drift Warning",
    icon: Target,
    color: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300",
    iconColor: "text-purple-400",
  },
};

const DEFAULT_META = {
  label: "Future Self Signal",
  icon: BrainCircuit,
  color: "from-cyan-500/20 to-blue-500/10",
  border: "border-cyan-500/30",
  badge: "bg-cyan-500/20 text-cyan-300",
  iconColor: "text-cyan-400",
};

const NudgeCard = ({ nudge, onMarkRead }) => {
  const meta = PATTERN_META[nudge.trigger] || DEFAULT_META;
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative rounded-2xl border bg-gradient-to-br ${meta.color} ${meta.border} p-5 backdrop-blur-sm`}
    >
      {/* Unread dot */}
      {!nudge.is_read && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`mt-0.5 p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 ${meta.iconColor}`}>
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge + timestamp */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.badge}`}>
              {meta.label}
            </span>
            <span className="text-zinc-600 text-[11px]">
              {new Date(nudge.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </span>
          </div>

          {/* Nudge Text */}
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {nudge.nudge_text}
          </p>

          {/* Mark as read */}
          {!nudge.is_read && (
            <button
              onClick={() => onMarkRead(nudge._id)}
              className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              <CheckCheck size={13} />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NudgesPage = () => {
  const navigate = useNavigate();
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNudges();
  }, []);

  const fetchNudges = async () => {
    try {
      const res = await API.get("/nudges");
      setNudges(res.data);
    } catch (err) {
      console.error("Failed to fetch nudges", err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await API.patch(`/nudges/${id}/read`);
      setNudges((prev) => prev.map((n) => n._id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.patch("/nudges/read-all");
      setNudges((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = nudges.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/8 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/8 blur-[140px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Vault
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-cyan-400 transition border border-white/10 hover:border-cyan-500/30 px-3 py-1.5 rounded-lg"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BrainCircuit size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Future Self Signals</h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-cyan-500 text-black px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-zinc-500 text-sm ml-[52px]">
            Proactive nudges from your Future Self based on your behavior patterns.
          </p>
        </div>

        {/* Nudge List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : nudges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-zinc-600 mb-4">
              <Inbox size={36} />
            </div>
            <p className="text-zinc-400 font-medium">No signals yet</p>
            <p className="text-zinc-600 text-sm mt-1 max-w-xs">
              Keep logging thoughts and working on goals — your Future Self will reach out when it matters.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {nudges.map((nudge) => (
                <NudgeCard key={nudge._id} nudge={nudge} onMarkRead={markRead} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default NudgesPage;
