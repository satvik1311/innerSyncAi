import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle2, AlertCircle, Info, Sparkles, BrainCircuit } from "lucide-react";
import API from "../../../lib/api";

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    fetchNotifications();
    connectWebSocket();
    return () => ws.current?.close();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/user/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Use absolute URL for WS
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//127.0.0.1:8000/user/ws/notifications/${token}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);
      if (eventType === "new_notification") {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(data);
      }
    };

    ws.current.onclose = () => {
      setTimeout(connectWebSocket, 5000); // Reconnect
    };
  };

  const showToast = (notification) => {
    setToast(notification);
    setTimeout(() => setToast(null), 5000);
  };

  const markAllAsRead = async () => {
    try {
      await API.post("/user/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "task_missed": return { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      case "task_created": return { icon: CheckCircle2, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
      case "evolution": return { icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
      case "nudge": return { icon: BrainCircuit, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" };
      default: return { icon: Info, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" };
    }
  };

  return (
    <>
      {/* Trigger Bell */}
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
      >
        <Bell size={20} className="text-zinc-300 group-hover:text-white" />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-zinc-950 shadow-lg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-zinc-900/95 backdrop-blur-3xl border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Sync Updates</h2>
                  <p className="text-xs text-zinc-500 font-medium">{unreadCount} unread transmissions</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-zinc-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Bell size={48} className="mb-4 text-zinc-600" />
                    <p className="text-sm font-bold">No transmissions yet.</p>
                    <p className="text-xs">Your sync is quiet for now.</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const styles = getTypeStyles(n.type);
                    const Icon = styles.icon;
                    return (
                      <motion.div 
                        key={n._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border ${styles.border} ${styles.bg} transition-all relative group overflow-hidden`}
                      >
                         {!n.is_read && <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />}
                         <div className="flex gap-4">
                            <div className={`shrink-0 w-10 h-10 rounded-xl ${styles.bg} ${styles.color} flex items-center justify-center border ${styles.border}`}>
                               <Icon size={20} />
                            </div>
                            <div className="flex-1">
                               <p className={`text-sm font-bold leading-snug mb-1 ${n.is_read ? 'text-zinc-400' : 'text-white'}`}>
                                 {n.message}
                               </p>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                 {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </p>
                            </div>
                         </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-white/[0.01]">
                   <button 
                    onClick={markAllAsRead}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all border border-white/5"
                   >
                     <CheckCircle2 size={16} /> Mark all as Read
                   </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Real-time Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm"
          >
            <div className="mx-4 p-4 rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                  <Sparkles size={24} className="animate-pulse" />
               </div>
               <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-0.5">Incoming Sync</p>
                  <p className="text-sm font-bold text-white leading-tight line-clamp-2">{toast.message}</p>
               </div>
               <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white p-2">
                  <X size={18} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
