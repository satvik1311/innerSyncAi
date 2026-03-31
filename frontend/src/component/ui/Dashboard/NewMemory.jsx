import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Sparkles, Loader2, Save, Tag, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from "../../../lib/api";

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/30' },
  { id: 'sad', label: 'Sad', emoji: '😔', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' },
  { id: 'motivated', label: 'Motivated', emoji: '🔥', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30' }
];

const NewMemory = () => {
  const navigate = useNavigate();
  
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user goals on mount
    const fetchGoals = async () => {
      try {
        const res = await API.get("/goals");
        // only allow linking to non-completed goals
        setGoals(res.data.filter(g => g.status !== "completed"));
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      }
    };
    fetchGoals();
  }, []);

  // Natural Web Speech API dictation
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setContent(prev => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + finalTranscript);
      }
    };

    recognition.start();
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(',', '');
      if (val && !tags.includes(val) && tags.length < 5) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return setError("Memory content cannot be empty.");
    
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        content: content.trim(),
        mood: mood,
        tags: tags,
      };
      if (selectedGoal) {
        payload.goal_id = selectedGoal;
      }

      await API.post("/memory", payload);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save memory. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans overflow-y-auto">
      {/* Background Decorators */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
              <Sparkles size={20} className="text-cyan-400" />
              Capture Memory
            </h1>
            <p className="text-sm text-zinc-500">Record your thoughts for your Future Self</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !content.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>Save Entry</span>
        </button>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8 pb-32">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Text Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest">What's on your mind?</label>
            <button 
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Mic size={14} />
              {isListening ? 'Listening...' : 'Dictate'}
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <textarea
              className="relative w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-none glass"
              placeholder="Reflect on your day, log your progress, or just vent. I'm listening..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mood Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-2">How are you feeling?</label>
            <div className="flex flex-wrap gap-3">
              {MOODS.map((m) => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                      isSelected 
                        ? `${m.color} ring-1 ring-current shadow-lg scale-105` 
                        : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span className="font-medium text-sm">{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Goal Linker */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-2">Link to a Goal</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none">
                <Target size={18} />
              </div>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white appearance-none focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
              >
                <option value="" className="bg-zinc-900 text-zinc-400">Not linked to a specific goal</option>
                {goals.map(g => (
                  <option key={g._id} value={g._id} className="bg-zinc-900 text-white">
                    {g.title}
                  </option>
                ))}
              </select>
              {/* Custom arrow for select */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-2">Tags (Max 5)</label>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm"
                >
                  <Tag size={12} />
                  <span>{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-cyan-200 ml-1 scale-125 focus:outline-none">&times;</button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : "Add another tag..."}
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-zinc-600 focus:outline-none min-w-[200px]"
              />
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default NewMemory;
