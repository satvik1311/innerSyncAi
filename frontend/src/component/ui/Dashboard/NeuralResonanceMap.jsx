import React, { useRef, useEffect, useCallback, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Info, X } from "lucide-react";

const NeuralResonanceMap = ({ data, onNodeClick }) => {
  const fgRef = useRef();
  const containerRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Track container dimensions to prevent ForceGraph2D crash on invalid sizes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observeTarget = containerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  // Custom node renderer for "Glowing Spark" effect
  const paintNode = useCallback((node, ctx, globalScale) => {
    // Safety check: ensure coordinates exist before painting
    if (typeof node.x !== 'number' || typeof node.y !== 'number') return;

    const label = node.cluster_name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter`;
    
    // Determine color by mood
    const colorMap = {
      motivated: "#06b6d4",
      stressed: "#ef4444",
      calm: "#22c55e",
      excited: "#f59e0b",
      sad: "#6366f1"
    };
    const color = colorMap[node.mood] || "#a855f7";

    // Draw Glow
    ctx.save();
    ctx.beginPath();
    const radius = node.val || 4;
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.6;
    ctx.arc(node.x, node.y, radius * 3, 0, 2 * Math.PI, false);
    ctx.fill();

    // Draw Core Spark
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 1;
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }, []);

  const handleNodeClick = (node) => {
    if (!node || typeof node.x !== 'number') return;
    
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
    
    // Center and zoom
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(4, 800);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[600px] bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {(!dimensions.width || !dimensions.height) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700"
          >
            Calibrating Space...
          </motion.div>
        </div>
      )}

      {dimensions.width > 0 && dimensions.height > 0 && data.nodes && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={data}
          nodeLabel={(node) => `${node.cluster_name}: ${node.label}`}
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          linkColor={() => "rgba(255, 255, 255, 0.1)"}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={1.5}
          backgroundColor="rgba(0,0,0,0)"
          onNodeClick={handleNodeClick}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      )}

      {/* Legend */}
      <div className="absolute top-6 left-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-none">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Resonance Legend</h3>
        <div className="space-y-2">
          {data.clusters?.map(c => (
            <div key={c.id} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-xs font-bold text-white/80">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Details (Deep Analysis) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-6 right-6 bottom-6 w-80 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <Brain size={24} />
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-500"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Semantic Cluster</h3>
            <h2 className="text-xl font-bold text-white mb-4">{selectedNode.cluster_name}</h2>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                "{selectedNode.full_text}"
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">AI Pattern Analysis</span>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
                    {selectedNode.resonance_reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 bg-white/5 px-3 py-1 w-fit rounded-full">
                <Info size={12} /> Established Sync: {selectedNode.mood}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-bold text-zinc-400 pointer-events-none">
        Drag to navigate • Scroll to zoom • Click a Spark for analysis
      </div>
    </div>
  );
};

export default NeuralResonanceMap;
