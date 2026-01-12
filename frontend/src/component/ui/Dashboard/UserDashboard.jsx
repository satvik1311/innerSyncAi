import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Brain,
  FileText,
  MessageSquare,
  Lightbulb,
  Upload,
  Mic,
  Camera,
  Link,
  BookOpen,
  Settings,
  TrendingUp,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen text-gray-200">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 p-5 flex flex-col justify-between glass shadow-glow">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-cyan-500/20 shadow-glow">
              <Brain className="text-cyan-400" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Memory Vault</h1>
              <p className="text-xs text-gray-400">AI-Powered Knowledge</p>
            </div>
          </div>

          {/* Search */}
          <input
            placeholder="Search memories..."
            className="w-full mb-4 px-4 py-2 rounded-lg glass outline-none"
          />

          {/* New Memory */}
          <button
            onClick={() => navigate("/dashboard/new")}
            className="w-full mb-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-medium shadow-glow hover:shadow-glow-strong transition"
          >
            + New Memory
          </button>

          {/* Nav */}
          <nav className="space-y-2 text-sm">
            {[
              ["Notes & Thoughts", FileText, 24, "/dashboard/notes"],
              ["Documents", FileText, 12, "/dashboard/documents"],
              ["Conversations", MessageSquare, 8, "/dashboard/conversations"],
              ["Knowledge Snippets", Lightbulb, 47, "/dashboard/snippets"],
            ].map(([label, Icon, count, path], i) => (
              <button
                key={i}
                onClick={() => navigate(path)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:glass hover:shadow-glow transition"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </div>
                <span className="text-xs bg-white/10 px-2 rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:glass hover:shadow-glow transition"
        >
          <Settings size={16} /> Settings
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-sm text-gray-400">
              Welcome back! Here's your knowledge overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Bell />
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl shadow-glow">
              <div className="w-8 h-8 rounded-full bg-cyan-400 shadow-glow" />
              <div className="text-sm">
                <p>Alex Chen</p>
                <p className="text-xs text-gray-400">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Total Memories", "1,247"],
            ["Notes & Thoughts", "342"],
            ["Conversations", "89"],
            ["Knowledge Snippets", "516"],
          ].map(([title, value], i) => (
            <div
              key={i}
              className="rounded-2xl p-5 glass shadow-glow inner-glow hover:shadow-glow-strong transition"
            >
              <p className="text-sm text-gray-400">{title}</p>
              <h3 className="text-3xl font-semibold text-cyan-400 mt-2">
                {value}
              </h3>
            </div>
          ))}
        </div>

        {/* ================= QUICK CAPTURE ================= */}
        <div className="rounded-2xl p-6 glass shadow-glow">
          <h3 className="font-semibold mb-4">Quick Capture</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              ["New Note", FileText, "/dashboard/new-note"],
              ["Upload", Upload, "/dashboard/upload"],
              ["Voice Memo", Mic, "/dashboard/voice"],
              ["Screenshot", Camera, "/dashboard/screenshot"],
              ["Save Link", Link, "/dashboard/link"],
              ["Quick Read", BookOpen, "/dashboard/read"],
            ].map(([label, Icon, path], i) => (
              <button
                key={i}
                onClick={() => navigate(path)}
                className="glass rounded-xl py-4 flex flex-col items-center gap-2 hover:shadow-glow transition cursor-pointer"
              >
                <Icon className="text-cyan-400" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent */}
          <div className="lg:col-span-2 rounded-2xl p-6 glass shadow-glow">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Recent Memories</h3>
              <span
                onClick={() => navigate("/dashboard/memories")}
                className="text-cyan-400 text-sm cursor-pointer"
              >
                View all →
              </span>
            </div>

            {[
              "AI Architecture Patterns",
              "Q4 Project Roadmap.pdf",
              "Brainstorm: Feature Ideas",
              "React Performance Tips",
              "Meeting Notes: Design Review",
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(`/dashboard/memory/${i}`)}
                className="glass p-4 mb-3 rounded-xl hover:shadow-glow transition cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl p-6 glass shadow-glow">
            <h3 className="font-semibold mb-4">AI Insights</h3>

            <Insight
              title="Connected: AI Patterns + Architecture"
              desc="Found 5 related notes that could be combined."
            />
            <Insight
              title="Trending Topic: React Performance"
              desc="You've saved 12 snippets on this topic."
            />
            <Insight
              title="Quick Capture Suggestion"
              desc="Save key points about API design."
            />

            <button
              onClick={() => navigate("/dashboard/insights")}
              className="mt-6 w-full py-2 rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
            >
              Generate More Insights
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const Insight = ({ title, desc }) => (
  <div className="glass p-4 rounded-xl mb-4 hover:shadow-glow transition">
    <div className="flex items-center gap-2 mb-1">
      <TrendingUp size={16} className="text-cyan-400" />
      <p className="font-medium text-sm">{title}</p>
    </div>
    <p className="text-xs text-gray-400">{desc}</p>
  </div>
);

export default UserDashboard;
