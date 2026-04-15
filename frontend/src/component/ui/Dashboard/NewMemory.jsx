import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CheckSquare, ShieldAlert, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import API from "../../../lib/api";

const NewMemory = () => {
  const navigate = useNavigate();
  const [title, setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode]         = useState("soft");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/memory/create", { title, description, mode });
      if (res.status !== 200 && res.status !== 201) throw new Error(res.data?.detail || "Failed");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0">
        <div className="sticky top-0 h-screen w-full"><Sidebar /></div>
      </div>

      <main className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">

          {/* back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 transition"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create a New Memory</h2>
            <p className="text-zinc-400 text-sm">Define a goal and the AI will generate your daily action plan. Max 3 active at once.</p>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-500/15 border border-red-500/40 text-red-300 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-7 rounded-3xl flex flex-col gap-6 shadow-[0_0_60px_rgba(6,182,212,0.08)]">

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-300">Goal / Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Master React in 30 days"
                required
                className="bg-black/50 border border-white/10 p-4 rounded-xl text-white placeholder-zinc-600
                  outline-none focus:border-cyan-500 focus:shadow-[0_0_16px_rgba(6,182,212,0.2)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-300">Why is this important? <span className="text-zinc-600 font-normal">(optional)</span></label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Be specific — better context = smarter AI tasks..."
                rows={3}
                className="bg-black/50 border border-white/10 p-4 rounded-xl text-white placeholder-zinc-600
                  outline-none focus:border-cyan-500 focus:shadow-[0_0_16px_rgba(6,182,212,0.2)] transition-all resize-none"
              />
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <ShieldAlert size={16} className="text-purple-400" /> Accountability Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Soft */}
                <div
                  onClick={() => setMode("soft")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300
                    ${mode === "soft"
                      ? "bg-cyan-500/12 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      : "bg-black/30 border-white/10 hover:border-white/25"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare size={16} className={mode === "soft" ? "text-cyan-400" : "text-zinc-500"} />
                    <span className={`font-bold text-sm ${mode === "soft" ? "text-white" : "text-zinc-400"}`}>Soft Mode</span>
                  </div>
                  <p className="text-xs text-zinc-500">Gentle reminders. Self-paced accountability.</p>
                </div>
                {/* Strict */}
                <div
                  onClick={() => setMode("strict")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300
                    ${mode === "strict"
                      ? "bg-red-500/12 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                      : "bg-black/30 border-white/10 hover:border-white/25"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={16} className={mode === "strict" ? "text-red-400" : "text-zinc-500"} />
                    <span className={`font-bold text-sm ${mode === "strict" ? "text-white" : "text-zinc-400"}`}>Strict Mode</span>
                  </div>
                  <p className="text-xs text-zinc-500">Aggressive escalation. No excuses mode.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="mt-2 flex items-center justify-center gap-2 py-4 rounded-xl font-bold
                bg-gradient-to-r from-cyan-500 to-purple-600
                shadow-[0_0_24px_rgba(168,85,247,0.35)]
                hover:shadow-[0_0_36px_rgba(6,182,212,0.5)] hover:scale-[1.02]
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Generating AI Tasks...</>
                : <><Sparkles size={20} /> Create Memory &amp; Generate Tasks</>
              }
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewMemory;
