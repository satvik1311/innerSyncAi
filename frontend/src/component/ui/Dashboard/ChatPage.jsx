import React from "react";
import { Sidebar } from "./Sidebar";
import { ChatInterface } from "./ChatInterface";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ChatPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0">
        <div className="sticky top-0 h-screen w-full"><Sidebar /></div>
      </div>

      <main className="flex-1 p-5 md:p-8 flex flex-col">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-5 transition w-fit"
        >
          <ArrowLeft size={15} /> Dashboard
        </button>

        <div className="flex-1" style={{ minHeight: 0 }}>
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
