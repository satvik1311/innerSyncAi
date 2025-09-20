import React from "react";
import "./Dashboard.css";
import {
  Brain,
  MessageCircle,
  Target,
  Clock,
  Plus,
  TrendingUp,
  Calendar,
  Heart,
  ArrowLeft,
} from "lucide-react";

/**
 * When rendered from LandingPage as a preview, pass:
 *   <Dashboard onBack={() => setShowDashboard(false)} preview />
 */
const Dashboard = ({ onBack, preview = false }) => {
  const recentMemories = [
    {
      id: 1,
      title: "Morning reflection on career goals",
      content: "Feeling optimistic about the new project at work...",
      mood: "Optimistic",
      tags: ["career", "goals", "work"],
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Weekend thoughts about relationships",
      content: "Had a deep conversation with my partner about...",
      mood: "Grateful",
      tags: ["relationships", "gratitude"],
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Learning progress update",
      content: "Finally understanding React patterns better...",
      mood: "Accomplished",
      tags: ["learning", "coding", "progress"],
      date: "3 days ago",
    },
  ];

  const goals = [
    { title: "Learn AI fundamentals", progress: 65, deadline: "Dec 2024" },
    { title: "Read 24 books this year", progress: 80, deadline: "Dec 2024" },
    { title: "Start meditation practice", progress: 45, deadline: "Jan 2025" },
  ];

  return (
    <div className="lp page">
      <div className="lp container">
        {/* Back to Landing (only shows when onBack is provided) */}
        {onBack && (
          <div className="mb-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10 transition"
              aria-label="Back to landing"
            >
              <ArrowLeft size={18} />
              Back to Landing
            </button>
            {preview && (
              <span className="ml-3 text-xs px-2 py-1 rounded-lg border border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-500/10">
                Preview
              </span>
            )}
          </div>
        )}

        {/* Header */}
        <div className="lp header">
          <div>
            <h1 className="lp title">Welcome back, Satvik</h1>
            <p className="lp muted">
              Continue your journey of self-discovery and growth
            </p>
          </div>
        </div>

        {/* Quick Actions (Tailwind-only, matching Landing UI) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-lg hover:brightness-110 transition">
            <Plus size={22} />
            <span>New Memory</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl font-semibold text-neutral-300 bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition">
            <MessageCircle size={22} />
            <span>Chat Future Self</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl font-semibold text-neutral-300 bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition">
            <Target size={22} />
            <span>Add Goal</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl font-semibold text-neutral-300 bg-white/10 backdrop-blur border border-white/10 hover:bg-white/20 transition">
            <Clock size={22} />
            <span>Time Capsule</span>
          </button>
        </div>

        <div className="lp grid">
          {/* Recent Memories */}
          <div className="lp col-main">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain size={22} className="text-emerald-400" />
                  <h2 className="text-lg font-bold">Recent Memories</h2>
                </div>
                <button className="h-auto px-3 py-1.5 rounded-lg text-sm text-neutral-300 hover:bg-white/10 transition">
                  View All
                </button>
              </div>

              <div className="grid gap-4">
                {recentMemories.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold">{m.title}</h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full border border-white/10 bg-white/10 px-2 py-1">
                        <Heart size={14} className="opacity-80" />
                        {m.mood}
                      </span>
                    </div>

                    <p className="text-neutral-300 text-sm line-clamp-2">
                      {m.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {m.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center text-xs rounded-full border border-white/10 px-2 py-0.5 text-neutral-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lp col-side">
            {/* Goals */}
            <div className="lp card">
              <div className="lp card-head">
                <Target size={22} className="lp icon-warm" />
                <h2 className="lp h2">Goal Progress</h2>
              </div>

              <div className="lp stack">
                {goals.map((g, i) => (
                  <div key={i} className="lp goal">
                    <div className="lp goal-top">
                      <span className="lp text-sm">{g.title}</span>
                      <span className="lp text-xs lp muted">{g.progress}%</span>
                    </div>
                    <div className="lp progress">
                      <div
                        className="lp bar"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                    <div className="lp goal-bottom">
                      <span className="lp badge lp badge-outline">
                        <Calendar size={14} className="lp badge-icon" />
                        {g.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Preview */}
            <div className="lp card">
              <div className="lp card-head">
                <MessageCircle size={22} className="lp icon-sec" />
                <h2 className="lp h2">Future Self Says</h2>
              </div>

              <div className="lp chat">
                <p className="lp italic text">
                  "Remember that every small step you take today builds the
                  foundation for who you'll become. Trust the process and stay
                  curious."
                </p>
                <div className="lp chat-foot">
                  <span className="lp glow">Future You (Age 35)</span>
                  <button className="lp btn lp btn-ghost lp btn-sm">
                    Continue Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lp card">
              <div className="lp card-head">
                <TrendingUp size={22} className="lp icon-cool" />
                <h2 className="lp h2">Your Growth</h2>
              </div>

              <div className="lp stats">
                <div className="lp stat">
                  <div className="lp stat-num glow">127</div>
                  <div className="lp stat-label">Memories</div>
                </div>
                <div className="lp stat">
                  <div className="lp stat-num warm">42</div>
                  <div className="lp stat-label">Days Streak</div>
                </div>
                <div className="lp stat">
                  <div className="lp stat-num sec">8</div>
                  <div className="lp stat-label">Goals Active</div>
                </div>
                <div className="lp stat">
                  <div className="lp stat-num cool">3</div>
                  <div className="lp stat-label">Capsules</div>
                </div>
              </div>
            </div>
          </div>
          {/* /sidebar */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
