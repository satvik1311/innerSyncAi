import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import API from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/signup", { email, password });
      if (res.data.token) {
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-zinc-950 overflow-hidden text-white px-4 font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10"
      >
        <div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Join the Vault
          </motion.h2>
          <p className="text-zinc-400 mt-2 text-sm">Secure your AI memories today</p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-zinc-400 mt-8 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold hover:opacity-80 transition-opacity">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;