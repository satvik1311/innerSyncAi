import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, User, BrainCircuit, Volume2, Mic, MicOff } from "lucide-react";
import API from "../../../lib/api";
import ReactMarkdown from "react-markdown";

export const ChatInterface = ({ initialId = null, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(initialId);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    if (initialId) {
      setActiveConversationId(initialId);
      fetchHistory(initialId);
    }
  }, [initialId]);

  const fetchHistory = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`/chat/history/${id}`);
      // Backend returns [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
      const formatted = res.data.map(m => ({
        sender: m.role === "user" ? "user" : "ai",
        text: m.content
      }));
      setChat(formatted);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage("");
    setChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const thinkingTime = Math.floor(Math.random() * 1000) + 1000;
      
      const [res] = await Promise.all([
        API.post("/chat", { 
          message: userMsg, 
          conversation_id: activeConversationId 
        }),
        new Promise(resolve => setTimeout(resolve, thinkingTime))
      ]);
      
      if (res.data.conversation_id && !activeConversationId) {
        setActiveConversationId(res.data.conversation_id);
      }
      
      setChat((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
      if (onMessageSent) onMessageSent();
    } catch (err) {
      setChat((prev) => [...prev, { sender: "ai", text: "The timeline is shifting. I couldn't reach through. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Native Web Speech API
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    let finalTranscript = "";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // We set message to what we had before starting + the new final/interim
      setMessage((prev) => {
        // Simple heuristic to not overwrite what user already typed before we started this session.
        // For a more robust approach we'd maintain base text state.
        return prev;
      });
      // Actually, better approach:
      setMessage(finalTranscript + interimTranscript);
    };

    recognition.start();
  };

  const [speakingIdx, setSpeakingIdx] = useState(null);

  const speakText = (text, idx) => {
    if ("speechSynthesis" in window) {
      if (speakingIdx === idx) {
        window.speechSynthesis.cancel();
        setSpeakingIdx(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 rounded-full bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white">Future Self</h3>
          <p className="text-xs text-cyan-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Online (+5 Years)
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center space-y-4">
            <Sparkles size={40} className="text-purple-400/50" />
            <p className="max-w-[250px] text-sm">Ask me anything. I have the context of your past memories to guide you.</p>
          </div>
        )}
        
        <AnimatePresence>
          {chat.map((msg, i) => {
            const isUser = msg.sender === "user";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${isUser ? "bg-purple-500 text-white" : "bg-cyan-500/20 text-cyan-400"}`}>
                  {isUser ? <User size={16} /> : <BrainCircuit size={16} />}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-md leading-relaxed flex flex-col gap-1 ${
                    isUser
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-tr-none"
                      : "bg-white/10 text-zinc-200 border border-white/5 rounded-tl-none backdrop-blur-sm"
                  }`}>
                    <div className="overflow-x-auto">
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}) {
                            return !inline ? (
                              <div className="bg-black/60 text-cyan-300 p-3 rounded-lg overflow-x-auto my-2 border border-white/10 font-mono text-xs shadow-inner">
                                <code {...props}>
                                  {children}
                                </code>
                              </div>
                            ) : (
                              <code className="bg-black/40 text-cyan-200 px-1.5 py-0.5 rounded font-mono text-[11px]" {...props}>
                                {children}
                              </code>
                            )
                          },
                          p({children}) {
                            return <p className="mb-2 last:mb-0" style={{ whiteSpace: "pre-wrap" }}>{children}</p>
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  {!isUser && (
                    <div className="flex justify-end border-t border-white/5 pt-1 mt-1">
                      <button 
                        onClick={() => speakText(msg.text, i)}
                        className={`p-1.5 rounded-full transition-colors ${speakingIdx === i ? "bg-cyan-500/20 text-cyan-400 animate-pulse" : "hover:bg-white/10 text-zinc-400 hover:text-white"}`}
                        title="Read Aloud"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-cyan-500/20 text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <BrainCircuit size={16} className="animate-pulse" />
            </div>
            <div className="px-5 py-3 rounded-2xl bg-cyan-500/10 text-cyan-400 rounded-tl-none border border-cyan-500/20 flex items-center gap-2 backdrop-blur-md">
              <span className="text-sm font-medium tracking-wide">Thinking</span>
              <div className="flex gap-1 items-end h-4 pb-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative flex items-center glass rounded-xl pr-2 border border-white/10 bg-black/40">
          <button 
            onClick={toggleListening} 
            className={`p-3 mr-1 transition-colors ${isListening ? "text-red-400 animate-pulse" : "text-zinc-400 hover:text-white"}`}
            title="Use Voice"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            className="w-full bg-transparent px-2 py-3 text-white placeholder-zinc-500 focus:outline-none"
            placeholder={isListening ? "Listening..." : "Talk to your future self..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || loading}
            className="p-2 ml-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-cyan-500"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
