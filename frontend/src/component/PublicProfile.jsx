import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Brain, Calendar, Link as LinkIcon, Github, Twitter, Linkedin, ExternalLink } from "lucide-react";
import API from "../lib/api";

const PublicProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await API.get(`/user/public/${username}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Profile not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <Brain className="w-16 h-16 text-zinc-800 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Signal Lost</h1>
        <p className="text-zinc-500 mb-6">{error}</p>
        <Link to="/" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  const renderSocialIcon = (platform, url) => {
    if (!url) return null;
    const Icon = { github: Github, twitter: Twitter, linkedin: Linkedin, website: ExternalLink }[platform] || LinkIcon;
    return (
      <a key={platform} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-purple-400/50 hover:text-purple-400 text-zinc-400 transition-all">
        <Icon size={18} />
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Nav */}
      <nav className="w-full p-6 flex justify-between items-center z-10 max-w-4xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-bold text-white tracking-widest uppercase text-xs">InnerSync AI</span>
        </Link>
        <Link to="/login" className="px-4 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          Build Your Own
        </Link>
      </nav>

      {/* Profile Card */}
      <main className="flex-1 w-full max-w-3xl px-6 py-10 z-10 flex flex-col items-center text-center">
        
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full border-4 border-black shadow-[0_0_40px_rgba(168,85,247,0.3)] bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white overflow-hidden mb-6">
          {data.avatar_url ? (
            <img src={`http://127.0.0.1:8000${data.avatar_url}`} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            data.name ? data.name[0] : (data.username?.[0]?.toUpperCase() || "U")
          )}
        </div>

        {/* Identity */}
        <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
        <p className="text-purple-400 font-medium tracking-wide mb-4">@{data.username}</p>
        
        {data.bio && (
          <p className="max-w-xl text-zinc-400 leading-relaxed mb-8">"{data.bio}"</p>
        )}

        {/* Socials */}
        <div className="flex gap-4 justify-center mb-12">
          {Object.entries(data.social_links || {}).map(([platform, url]) => renderSocialIcon(platform, url))}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-white mb-1">{data.stats.total_goals}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Goals Set</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-cyan-400 mb-1">{data.stats.completed_goals}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Accomplished</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center col-span-2 md:col-span-1">
            <span className="text-3xl font-bold text-purple-400 mb-1">{data.stats.streak_count}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1">Day Streak</span>
          </div>
        </div>

        {/* Join Date footer */}
        <div className="mt-16 flex items-center gap-2 text-sm text-zinc-600">
           <Calendar size={14} /> Vault Member since {data.join_date}
        </div>

      </main>
    </div>
  );
};

export default PublicProfile;
