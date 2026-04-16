import React, { useMemo } from "react";
import TaskNode from "./TaskNode";

const RoadmapCanvas = ({ tasks, onToggle }) => {
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 400;

  // Calculate node positions along a horizontal winding wave
  const positionedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    return tasks.map((task, i) => {
      // Create a horizontal winding effect
      // x increases linearly
      const x = (i + 1) * (CANVAS_WIDTH / (tasks.length + 1));
      
      // y follows a sine wave for the "winding" feel
      // Adjust amplitude and frequency for a natural look
      const amplitude = 80;
      const y = (CANVAS_HEIGHT / 2) + Math.sin(i * 1.2) * amplitude;
      
      return { ...task, x, y };
    });
  }, [tasks]);

  // Generate SVG path string
  const pathData = useMemo(() => {
    if (positionedTasks.length < 2) return "";
    
    let path = `M ${positionedTasks[0].x} ${positionedTasks[0].y}`;
    
    for (let i = 0; i < positionedTasks.length - 1; i++) {
      const curr = positionedTasks[i];
      const next = positionedTasks[i + 1];
      
      // Control points for smooth bezier curvature
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return path;
  }, [positionedTasks]);

  // Find the first non-completed task to mark as active
  const activeIndex = tasks.findIndex(t => !t.completed);

  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden hide-scrollbar py-20 px-10 min-h-[500px] flex items-center">
      <div 
        className="relative shrink-0"
        style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
      >
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        >
          {/* Background Shadow Glow Path */}
          <path
            d={pathData}
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeOpacity="0.03"
            strokeLinecap="round"
          />
          
          {/* Base Connection Path */}
          <path
            d={pathData}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 10"
          />

          {/* Progress Path (Animated) */}
          {/* We calculate how much of the path is "done" */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))"
            }}
          />

          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {positionedTasks.map((task, i) => (
          <TaskNode 
            key={task.id} 
            task={task} 
            index={i}
            isActive={i === activeIndex}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapCanvas;
