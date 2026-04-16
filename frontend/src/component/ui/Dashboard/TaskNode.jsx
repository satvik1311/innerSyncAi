import React from "react";
import { Check, Circle, Lock } from "lucide-react";
import { motion } from "framer-motion";

const TaskNode = ({ task, isActive, index, onToggle }) => {
  const isCompleted = task.completed;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="absolute flex flex-col items-center group cursor-pointer"
      style={{ left: `${task.x}px`, top: `${task.y}px`, transform: "translate(-50%, -50%)" }}
      onClick={() => onToggle(task.id)}
    >
      {/* Node Circle */}
      <div className={`
        relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500
        ${isCompleted 
          ? "bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
          : isActive 
            ? "bg-cyan-500 border-white shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-110" 
            : "bg-zinc-900 border-white/10 group-hover:border-white/40"
        }
      `}>
        {isCompleted ? (
          <Check size={18} className="text-green-400" strokeWidth={3} />
        ) : isActive ? (
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-zinc-400" />
        )}

        {/* Status Tooltip/Indicator */}
        {isActive && !isCompleted && (
          <div className="absolute -top-1 -right-1 flex">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
          </div>
        )}
      </div>

      {/* Task Text */}
      <div className="mt-4 text-center max-w-[140px] pointer-events-none">
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 transition-colors ${
          isActive ? "text-cyan-400" : isCompleted ? "text-green-400/60" : "text-zinc-500"
        }`}>
          Step {index + 1}
        </p>
        <p className={`text-sm font-semibold transition-all ${
          isActive ? "text-white" : isCompleted ? "text-zinc-500 line-through" : "text-zinc-400"
        }`}>
          {task.text}
        </p>
      </div>

      {/* Hover Info */}
      <div className="absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-zinc-800 text-[10px] text-zinc-300 px-3 py-1 rounded-full border border-white/5 pointer-events-none z-50">
        {isCompleted ? "Completed" : isActive ? "Current Objective" : "Upcoming Task"}
      </div>
    </motion.div>
  );
};

export default TaskNode;
