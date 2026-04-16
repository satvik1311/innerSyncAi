import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { 
  Sparkles, Map, Target, CheckCircle2, 
  ChevronRight, ArrowLeft, Loader2, Plus 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../lib/api";
import MemorySelector from "./MemorySelector";
import RoadmapCanvas from "./RoadmapCanvas";

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeMemory, setActiveMemory] = useState(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchRoadmapDetails(selectedId);
    }
  }, [selectedId]);

  const fetchMemories = async () => {
    try {
      const res = await API.get("/memory/list");
      const activeOnly = res.data.filter(m => m.status === "active");
      setMemories(activeOnly);
      if (activeOnly.length > 0 && !selectedId) {
        setSelectedId(activeOnly[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch memories", err);
    } finally {
      if (!selectedId) setLoading(false);
    }
  };

  const fetchRoadmapDetails = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/memory/${id}`);
      setActiveMemory(res.data);
    } catch (err) {
      console.error("Failed to fetch roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    if (!activeMemory) return;
    try {
      // Optimistic update locally
      const updatedTasks = activeMemory.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      
      // If we are marking as complete
      const isMarkingComplete = !activeMemory.tasks.find(t => t.id === taskId).completed;
      
      if (isMarkingComplete) {
        await API.post("/task/complete", { 
          memory_id: activeMemory._id, 
          task_id: taskId 
        });
      } else {
        // Here we'd normally have an uncomplete route, but if not we just update local
        // Our current backend /task/complete only marks True.
        // For now let's assume one-way or refresh
      }
      
      // Refresh data to show progression
      fetchRoadmapDetails(activeMemory._id);
    } catch (err) {
      console.error("Task update failed", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl">
        <div className="sticky top-0 h-screen w-full">
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Area */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-1">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30">
                  Visual Systems
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <Map className="text-cyan-500" size={32} /> Journey <span className="text-zinc-600">Roadmap</span>
              </h1>
              <p className="text-zinc-500 max-w-lg">
                Your abstract goals transformed into a visual trajectory. Follow the glow to master your future self.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <MemorySelector 
                memories={memories} 
                selectedId={selectedId} 
                onSelect={setSelectedId} 
              />
              <button
                onClick={() => navigate("/dashboard/new")}
                className="p-3 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                title="Create New Journey"
              >
                <Plus size={20} />
              </button>
            </div>
          </header>

          {/* Roadmap Visualizer Section */}
          <div className="relative min-h-[600px] rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="text-cyan-500 animate-spin" />
                <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px] animate-pulse">Calculating Trajectory...</p>
              </div>
            ) : activeMemory ? (
              <div className="h-full flex flex-col">
                {/* Progress Bar Top */}
                <div className="w-full h-1.5 bg-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-1000"
                    style={{ width: `${activeMemory.progress}%` }}
                  />
                  <div className="absolute top-4 left-6 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-zinc-500">Sync Level:</span>
                    <span className="text-sm font-bold text-white">{activeMemory.progress}% Complete</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <RoadmapCanvas 
                    tasks={activeMemory.tasks} 
                    onToggle={toggleTask}
                  />
                </div>

                {/* Legend / Info Footer */}
                <div className="p-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 text-zinc-500">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" /> Completed
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" /> Current Objective
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-zinc-700" /> Upcoming
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="p-6 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Sparkles size={48} className="text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Journeys</h3>
                <p className="text-zinc-500 max-w-sm text-center mb-8">
                  Create a memory or a high-level goal to visualize your path to the future.
                </p>
                <button 
                  onClick={() => navigate("/dashboard/new")}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-glow"
                >
                  Start new Memory
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default RoadmapPage;
