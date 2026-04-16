import React, { useState, useEffect } from "react";
import { User, Settings, Shield, Edit3, Loader2, Sparkles, LogOut, CheckCircle2, Link2, Camera, ExternalLink, Copy, Activity, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import API from "../../../lib/api";
import GenderSelector from "./GenderSelector";
import AvatarPreview from "./AvatarPreview";
import { useAuth } from "../../../context/AuthContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [profile, setProfile] = useState({ 
    name: "", 
    bio: "", 
    email: "", 
    join_date: "", 
    username: "", 
    gender: "Private",
    avatar_url: "", 
    avatar_seed: "", 
    avatar_style: "avataaars", 
    social_links: { github: "", linkedin: "", twitter: "", website: "" } 
  });
  const [stats, setStats] = useState({ total_goals: 0, completed_goals: 0, tasks_completed: 0, streak_count: 0 });
  const [preferences, setPreferences] = useState({ tone: "Balanced", response_length: "Medium", focus: "Productivity" });
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/profile");
      const data = res.data;
      setProfile({ 
        name: data.name || "", 
        bio: data.bio || "", 
        email: data.email, 
        gender: data.gender || "Private",
        join_date: data.join_date,
        username: data.username || "",
        avatar_url: data.avatar_url || "",
        avatar_seed: data.avatar_seed || data.username || "default",
        avatar_style: data.avatar_style || "avataaars",
        social_links: data.social_links || { github: "", linkedin: "", twitter: "", website: "" } 
      });
      setStats(data.stats || {});
      if (data.preferences) setPreferences(data.preferences);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await API.put("/user/profile", { 
        name: profile.name, 
        bio: profile.bio,
        gender: profile.gender,
        username: profile.username,
        social_links: profile.social_links,
        avatar_seed: profile.avatar_seed,
        avatar_style: profile.avatar_style
      });
      showMessage("Profile updated automatically.");
    } catch (e) {
      showMessage("Error updating profile.");
    } finally { setSaving(false); }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await API.put("/user/preferences", preferences);
      showMessage("AI constraints updated.");
    } catch (e) {
      showMessage("Error updating AI.");
    } finally { setSaving(false); }
  };

  const savePassword = async () => {
    if (!passwords.old_password || !passwords.new_password) return showMessage("Fill all fields.");
    setSaving(true);
    try {
      await API.put("/user/password", passwords);
      showMessage("Password changed securely.");
      setPasswords({ old_password: "", new_password: "" });
    } catch (e) {
      showMessage(e.response?.data?.detail || "Invalid old password.");
    } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setSaving(true);
      const res = await API.post("/user/avatar", formData, { headers: { "Content-Type": "multipart/form-data" }});
      setProfile(prev => ({...prev, avatar_url: res.data.avatar_url}));
      showMessage("Avatar uploaded.");
    } catch {
      showMessage("Failed to upload avatar.");
    } finally { setSaving(false); }
  };

  const copyPublicLink = () => {
    if (!profile.username) return showMessage("Save a username first!");
    navigator.clipboard.writeText(`${window.location.origin}/user/${profile.username}`);
    showMessage("Public Link Copied!");
  };

  const handleAvatarSync = async (overrides = {}) => {
    setSaving(true);
    const payload = {
      avatar_seed: overrides.seed || profile.avatar_seed || profile.username || "default",
      avatar_style: overrides.style || profile.avatar_style || "adventurer"
    };
    try {
      await API.put("/user/avatar_sync", payload);
      setProfile(prev => ({ ...prev, ...payload }));
      showMessage("2D Identity synchronized.");
    } catch {
      showMessage("Sync failed. Check connection.");
    } finally { setSaving(false); }
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* ambient glows sync with dashboard */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />
      </div>

      <div className="hidden lg:flex w-72 shrink-0 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl">
        <div className="sticky top-0 h-screen w-full"><Sidebar /></div>
      </div>

      <main className="flex-1 p-5 md:p-10 flex flex-col items-center relative overflow-y-auto">
        
        {/* Toast */}
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="fixed top-10 left-1/2 z-50 px-5 py-2.5 bg-zinc-900 border border-purple-500/30 text-purple-100 text-sm rounded-full shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-purple-400"/> {message}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative">
               <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
               <Sparkles className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={24} />
             </div>
             <p className="mt-4 text-zinc-500 animate-pulse font-medium text-sm tracking-widest uppercase">Fetching Identity Data...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
          >
          <header className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
             <div className="flex items-center gap-5">
                <div className="relative group w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] border-2 border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={`http://127.0.0.1:8000${profile.avatar_url}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarPreview 
                      seed={profile.avatar_seed} 
                      gender={profile.gender} 
                      className="w-full h-full border-none"
                    />
                  )}
                  
                  {/* Upload Overlay */}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera size={20} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                </div>

                <div>
                   <h1 className="text-3xl font-bold text-white">{profile.name || "User"} <span className="text-purple-400 text-lg font-medium opacity-80">@{profile.username}</span></h1>
                   <p className="text-zinc-400 mt-0.5">{profile.email} • Joined {profile.join_date}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-3 w-full md:w-auto">
               <button onClick={copyPublicLink} className="flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 rounded-xl transition-all font-medium text-sm inline-flex">
                 <Copy size={16}/> Public Link
               </button>
               <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all">
                 <LogOut size={16}/> <span className="hidden sm:inline">Logout</span>
               </button>
             </div>
          </header>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Tabs Sidebar */}
            <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
               {[
                 { id: "profile", icon: User, label: "Identity" },
                 { id: "ai", icon: Sparkles, label: "Future Self AI" },
                 { id: "security", icon: Shield, label: "Security" }
               ].map(t => (
                 <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all whitespace-nowrap ${activeTab === t.id ? "bg-white/10 text-white shadow-glow border border-white/20" : "text-zinc-400 hover:bg-white/5"}`}>
                   <t.icon size={18} className={activeTab === t.id ? "text-purple-400" : ""} />
                   <span className="font-medium">{t.label}</span>
                 </button>
               ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 min-h-[500px]">
              
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  
                  {/* Stats Row */}
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { l: "Streak", v: `${stats.streak_count} Days` },
                      { l: "Total Goals", v: stats.total_goals },
                      { l: "Completed", v: stats.completed_goals },
                      { l: "Tasks Mapped", v: stats.tasks_completed },
                    ].map((s, i) => (
                      <div key={i} className="bg-black/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-white mb-1">{s.v}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">{s.l}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                     <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Edit3 size={16}/> Basic Information</h3>
                     <div className="grid md:grid-cols-2 gap-5">
                       <div>
                         <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Display Name</label>
                         <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Public Username</label>
                         <input type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
                       </div>
                     </div>

                     <GenderSelector 
                        selected={profile.gender} 
                        onChange={(g) => setProfile({...profile, gender: g})}
                     />

                     <div>
                       <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">My Current Bio</label>
                       <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors h-24 resize-none" />
                     </div>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-white/5">
                     <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Link2 size={16}/> Social Handles</h3>
                     <div className="grid md:grid-cols-2 gap-5">
                       {["github", "twitter", "linkedin", "website"].map(platform => (
                         <div key={platform}>
                           <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2 capitalize">{platform}</label>
                           <input type="url" placeholder={`https://${platform === "website" ? "yourdomain.com" : `${platform}.com/username`}`} value={profile.social_links[platform] || ""} onChange={e => setProfile({...profile, social_links: {...profile.social_links, [platform]: e.target.value}})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                         </div>
                       ))}
                     </div>
                  </div>

                  <div className="pt-4">
                     <button onClick={saveProfile} disabled={saving} className="px-6 py-3 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                       {saving ? <Loader2 size={16} className="animate-spin"/> : "Save Identity"}
                     </button>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-white/5">
                     <div>
                       <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Activity size={16}/> 2D Dimensional Sync</h3>
                       <p className="text-zinc-500 text-sm mt-1">Customize your lightweight 2D presence in the InnerSync multiverse.</p>
                     </div>
                     <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/5 p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                           <AvatarPreview 
                              seed={profile.avatar_seed} 
                              style={profile.avatar_style} 
                              gender={profile.gender}
                              className="w-full h-full border-none"
                           />
                        </div>
                        <div className="flex-1 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-[10px] uppercase text-zinc-500 mb-1.5 font-bold">Avatar Style</label>
                                 <select 
                                    value={profile.avatar_style} 
                                    onChange={(e) => setProfile({...profile, avatar_style: e.target.value})}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                                 >
                                    {["avataaars", "bottts", "lorelei", "pixel-art", "adventurer"].map(s => (
                                       <option key={s} value={s} className="bg-zinc-900">{s}</option>
                                    ))}
                                 </select>
                              </div>
                              <div className="flex flex-col justify-end">
                                 <button 
                                    onClick={() => setProfile({...profile, avatar_seed: Math.random().toString(36).substring(7)})}
                                    className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                 >
                                    <RefreshCw size={14} /> Regenerate
                                 </button>
                              </div>
                           </div>
                           <p className="text-[10px] text-zinc-500 italic text-center md:text-left">Your identity dynamically updates based on your gender and synchronization score.</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {/* AI PREFERENCES TAB */}
              {activeTab === "ai" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">AI Constraint Architecture</h2>
                    <p className="text-zinc-400 text-sm">Tune exactly how your simulated Future Self talks to you.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-semibold text-zinc-200 mb-3">Communication Tone</label>
                       <div className="flex flex-wrap gap-3">
                         {["Strict", "Balanced", "Supportive"].map(t => (
                           <button key={t} onClick={() => setPreferences({...preferences, tone: t})} className={`px-4 py-2 rounded-full border text-sm transition-all ${preferences.tone === t ? "bg-purple-500/20 border-purple-500/50 text-purple-300" : "bg-black/50 border-white/10 text-zinc-400 hover:border-white/30"}`}>
                             {t}
                           </button>
                         ))}
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-sm font-semibold text-zinc-200 mb-3">Response Length</label>
                       <div className="flex flex-wrap gap-3">
                         {["Short (1-2 lines)", "Medium (3-4 lines)"].map(t => {
                           const val = t.split(" ")[0];
                           return (
                             <button key={val} onClick={() => setPreferences({...preferences, response_length: val})} className={`px-4 py-2 rounded-full border text-sm transition-all ${preferences.response_length === val ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "bg-black/50 border-white/10 text-zinc-400 hover:border-white/30"}`}>
                               {t}
                             </button>
                           );
                         })}
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-semibold text-zinc-200 mb-3">Current Focus Area</label>
                       <div className="flex flex-wrap gap-3">
                         {["Discipline", "Motivation", "Productivity", "Mental Clarity"].map(t => (
                           <button key={t} onClick={() => setPreferences({...preferences, focus: t})} className={`px-4 py-2 rounded-full border text-sm transition-all ${preferences.focus === t ? "bg-white/20 border-white text-white" : "bg-black/50 border-white/10 text-zinc-400 hover:border-white/30"}`}>
                             {t}
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <button onClick={savePreferences} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-xl flex items-center gap-2 transition-all">
                        {saving ? <Loader2 size={16} className="animate-spin"/> : "Sync AI Profile"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                    <div className="grid gap-5 max-w-sm">
                      <input type="password" placeholder="Current Password" value={passwords.old_password} onChange={e => setPasswords({...passwords, old_password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50" />
                      <input type="password" placeholder="New Password" value={passwords.new_password} onChange={e => setPasswords({...passwords, new_password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50" />
                      <button onClick={savePassword} disabled={saving} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-center">
                         {saving ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-white/5">
                     <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
                     <p className="text-zinc-500 text-sm mb-4">Permanently delete your account, memories, and AI sync history.</p>
                     <button onClick={() => {
                        if(window.confirm("Are you absolutely sure? This cannot be undone.")) {
                          API.delete("/user").then(handleLogout).catch(console.error);
                        }
                     }} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-semibold rounded-xl transition-all">
                       Delete Account
                     </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ProfileSettings;
