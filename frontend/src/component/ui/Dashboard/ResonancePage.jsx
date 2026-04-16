import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Network, Sparkles, Loader2, RefreshCw, Layers } from "lucide-react";
import API from "../../../lib/api";
import NeuralResonanceMap from "./NeuralResonanceMap";

const ResonancePage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchResonanceData();
  }, []);

  const fetchResonanceData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/thoughts/resonance");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch resonance map", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResonanceData();
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl">
        <div className="sticky top-0 h-screen w-full">
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 relative flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 w-fit">
                Cognitive Architecture
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Network className="text-purple-500" size={28} /> Neural <span className="text-zinc-600">Resonance Map</span>
            </h1>
            <p className="text-zinc-500 text-sm max-w-xl">
              A semantic visualization of your subconscious patterns. Thoughts with similar resonance naturally cluster together in the vault.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2 text-right">
              <span className="text-[10px] font-black uppercase text-zinc-500">Sync Quality</span>
              <span className="text-xs font-bold text-cyan-400">High Resolution</span>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-sm font-bold disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Recalculate Resonance
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative rounded-3xl overflow-hidden shadow-edge">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-zinc-950/50 backdrop-blur-sm z-50">
              <div className="relative">
                <Loader2 size={48} className="text-purple-500 animate-spin" />
                <Sparkles size={20} className="absolute -top-2 -right-2 text-cyan-400 animate-pulse" />
              </div>
              <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">Mapping Neural Connections...</p>
            </div>
          ) : (
            <div className="h-full">
              {data.nodes?.length > 0 ? (
                <NeuralResonanceMap data={data} onNodeClick={(node) => console.log("Focused Node:", node)} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                   <div className="p-8 rounded-full bg-white/5 border border-white/10">
                      <Layers size={64} className="text-zinc-800" />
                   </div>
                   <div>
                      <h2 className="text-xl font-bold mb-2">The Vault is Still Priming</h2>
                      <p className="text-zinc-500 max-w-md">
                        We need at least a few thoughts to generate semantic resonance. Keep capturing your mind and this map will ignite.
                      </p>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResonancePage;
