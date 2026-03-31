import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Target, Plus } from 'lucide-react';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';
import API from '../../../lib/api';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      const res = await API.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async (goalData) => {
    try {
      if (editingGoal) {
        await API.put(`/goals/${editingGoal._id}`, goalData);
      } else {
        await API.post('/goals', goalData);
      }
      setIsFormOpen(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (err) {
      console.error('Failed to save goal:', err);
      alert('Failed to save goal.');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await API.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const handleStatusToggle = async (goal) => {
    try {
      const newStatus = goal.status === 'completed' ? 'in_progress' : 'completed';
      const newProgress = newStatus === 'completed' ? 100 : goal.progress;
      await API.put(`/goals/${goal._id}`, { status: newStatus, progress: newProgress });
      fetchGoals();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleRoadmapUpdate = async (goalId, newRoadmap) => {
    try {
      // Optimistic update
      setGoals(goals.map(g => g._id === goalId ? { ...g, roadmap: newRoadmap } : g));
      await API.put(`/goals/${goalId}`, { roadmap: newRoadmap });
      
      // Calculate automated progress from roadmap internally if desired, 
      // but the backend API already toggles to completed when all are true.
      fetchGoals(); // Re-sync to get official backend state if backend modified progress
    } catch(err) {
      console.error('Failed to update roadmap:', err);
      fetchGoals();
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans w-full relative">
      {/* Background Decorators */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Sidebar Layout */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-10 z-10 flex flex-col">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center gap-3">
              <Target size={32} className="text-cyan-400" /> Goal Mastery
            </h1>
            <p className="text-zinc-400 mt-2">Track, conquer, and reflect on your highest ambitions.</p>
          </div>
          
          <button 
            onClick={() => {
              setEditingGoal(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] self-start sm:self-auto"
          >
            <Plus size={20} />
            <span>Create Goal</span>
          </button>
        </header>

        {goals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm p-12 text-center h-[50vh]">
            <Target size={64} className="text-zinc-600 mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-2">No active goals</h3>
            <p className="text-zinc-400 max-w-md mb-8">You haven't set any goals yet. Start setting targets and watch your Future Self guide you toward them.</p>
            <button 
              onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors border border-white/10"
            >
              Set your first Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard 
                key={goal._id} 
                goal={goal} 
                onEdit={(g) => { setEditingGoal(g); setIsFormOpen(true); }}
                onDelete={handleDeleteGoal}
                onStatusToggle={handleStatusToggle}
                onRoadmapUpdate={handleRoadmapUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <GoalForm 
          initialData={editingGoal}
          onSave={handleSaveGoal}
          onCancel={() => { setIsFormOpen(false); setEditingGoal(null); }}
        />
      )}
    </div>
  );
};

export default GoalsPage;
