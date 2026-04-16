import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./component/auth/ProtectedRoute";

import Navigation  from "./component/Navigation";
import LandingPage from "./component/LandingPage";
import Login       from "./component/auth/Login";
import Signup      from "./component/auth/Signup";

import UserDashboard from "./component/ui/Dashboard/UserDashboard";
import NewMemory     from "./component/ui/Dashboard/NewMemory";
import TodayTasks    from "./component/ui/Dashboard/TodayTasks";
import ChatPage      from "./component/ui/Dashboard/ChatPage";
import ProfileSettings from "./component/ui/Dashboard/ProfileSettings";
import ThoughtsPage from "./component/ui/Dashboard/ThoughtsPage";
import RoadmapPage from "./component/ui/Dashboard/RoadmapPage";
import ResonancePage from "./component/ui/Dashboard/ResonancePage";
import AchievementsPage from "./component/ui/Dashboard/AchievementsPage";

import PublicProfile from "./component/PublicProfile";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideLanding = isHome || 
    location.pathname.startsWith("/dashboard") ||
    ["/login", "/signup"].includes(location.pathname) || 
    location.pathname.startsWith("/user/");

  return (
    <div className="min-h-screen font-inter bg-black">
      {!hideLanding && <Navigation />}

      <Routes>
        <Route path="/"              element={<LandingPage />} />
        
        {/* Auth routes with smart redirect */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} 
        />
        
        <Route path="/user/:username" element={<PublicProfile />} />

        {/* Dashboard routes - Protected */}
        <Route path="/dashboard"     element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/new" element={<ProtectedRoute><NewMemory /></ProtectedRoute>} />
        <Route path="/dashboard/tasks" element={<ProtectedRoute><TodayTasks /></ProtectedRoute>} />
        <Route path="/dashboard/chat"  element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="/dashboard/thoughts" element={<ProtectedRoute><ThoughtsPage /></ProtectedRoute>} />
        <Route path="/dashboard/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/dashboard/resonance" element={<ProtectedRoute><ResonancePage /></ProtectedRoute>} />
        <Route path="/dashboard/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;