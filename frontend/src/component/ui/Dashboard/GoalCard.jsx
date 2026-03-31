import React from 'react';
import { Target, Trash2, Edit3, CheckCircle2, Circle, Calendar, CheckSquare, Square } from 'lucide-react';

const GoalCard = ({ goal, onEdit, onDelete, onStatusToggle, onRoadmapUpdate }) => {
  const isCompleted = goal.status === 'completed';
  const isFailed = goal.status === 'failed';
  const progressPercent = goal.progress || 0;

  const handleTaskToggle = (taskId) => {
    if (!goal.roadmap) return;
    const newRoadmap = goal.roadmap.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onRoadmapUpdate(goal._id, newRoadmap);
  };

  const formatDeadline = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    const diffMs = d - new Date();
    if (diffMs < 0) return `${day}/${month}/${year}`; // Expired
    
    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    if (hoursLeft < 24) {
      return `${day}/${month}/${year} (${hoursLeft} hours left)`;
    } else {
      const daysLeft = Math.floor(hoursLeft / 24);
      return `${day}/${month}/${year} (${daysLeft} days left)`;
    }
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      isFailed 
        ? 'bg-red-500/5 border-red-500/20 opacity-80' 
        : isCompleted 
          ? 'bg-green-500/5 border-green-500/20 opacity-80' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
    }`}>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <button 
            onClick={() => onStatusToggle(goal)}
            className={`mt-1 rounded-full transition-colors ${
              isCompleted ? 'text-green-500' : 'text-zinc-500 hover:text-cyan-400'
            }`}
          >
            {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          <div>
            <h3 className={`text-lg font-bold ${isFailed ? 'text-red-400 line-through' : isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
              {goal.title}
            </h3>
            {goal.target && (
              <p className="text-sm font-medium text-cyan-400 flex items-center gap-1 mt-1">
                <Target size={14} /> Target: {goal.target}
              </p>
            )}
            {goal.deadline && (
              <p className={`text-sm font-medium ${isFailed ? 'text-red-400' : 'text-purple-400'} flex items-center gap-1 mt-1`}>
                <Calendar size={14} /> {isFailed ? 'Expired:' : 'Deadline:'} {formatDeadline(goal.deadline)}
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isCompleted && !isFailed && (
            <button onClick={() => onEdit(goal)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition">
              <Edit3 size={16} />
            </button>
          )}
          <button onClick={() => onDelete(goal._id)} className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          {goal.description}
        </p>
      )}

      {goal.roadmap && goal.roadmap.length > 0 && (
        <div className="mb-6 space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">AI Roadmap</h4>
          {goal.roadmap.map(task => (
             <div key={task.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => handleTaskToggle(task.id)}>
                {task.completed ? <CheckSquare size={16} className="text-cyan-400 mt-1 shrink-0" /> : <Square size={16} className="text-zinc-500 group-hover:text-cyan-400 mt-1 shrink-0" />}
                <div className="flex flex-col">
                  <span className={`text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'} leading-snug`}>
                    {task.text}
                  </span>
                  {task.deadline && (
                    <span className={`text-xs mt-0.5 flex items-center gap-1 ${task.completed ? 'text-zinc-600' : 'text-purple-400/80'}`}>
                      <Calendar size={10} /> {formatDeadline(task.deadline)}
                    </span>
                  )}
                </div>
             </div>
          ))}
        </div>
      )}

      {/* Progress Section */}
      <div className="space-y-2 mt-auto">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-zinc-400">Progress</span>
          <span className="text-cyan-400">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-end mt-2 text-xs text-zinc-500 font-medium">
          {goal.linked_memories_count || 0} memories linked
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
