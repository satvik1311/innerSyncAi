import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ChatInterface } from "./ChatInterface";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Plus } from "lucide-react";
import API from "../../../lib/api";

const ChatPage = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await API.get("/chat/threads");
      setThreads(res.data);
    } catch (err) {
      console.error("Failed to load threads", err);
    }
  };

  const startNewChat = () => {
    setActiveId(null);
  };

  const deleteThread = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interval?")) return;
    try {
      await API.delete(`/chat/threads/${id}`);
      if (activeId === id) setActiveId(null);
      fetchThreads();
    } catch (err) {
      console.error("Failed to delete thread", err);
    }
  };

  const deleteAllThreads = async () => {
    if (!window.confirm("WARNING: This will permanently wipe your entire chat history. Continue?")) return;
    try {
      await API.delete("/chat/threads");
      setActiveId(null);
      fetchThreads();
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0 h-full">
        <Sidebar 
          threads={threads} 
          onSelectThread={(id) => setActiveId(id)} 
          activeThreadId={activeId}
          onDeleteThread={deleteThread}
          onDeleteAll={deleteAllThreads}
        />
      </div>

      <main className="flex-1 flex flex-col p-5 md:p-8 overflow-hidden h-full">
        <header className="flex items-center justify-between mb-6 shrink-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Vault
          </button>
          
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
          >
            <Plus size={16} /> New Interval
          </button>
        </header>

        <div className="flex-1 min-h-0 relative">
          <ChatInterface initialId={activeId} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
