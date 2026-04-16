import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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

import PublicProfile from "./component/PublicProfile";

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hideLanding = isHome || 
    location.pathname.startsWith("/dashboard") ||
    ["/login", "/signup"].includes(location.pathname) || 
    location.pathname.startsWith("/user/");

  return (
    <div className="min-h-screen font-inter">
      {!hideLanding && <Navigation />}

      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/signup"        element={<Signup />} />
        <Route path="/user/:username" element={<PublicProfile />} />

        {/* Dashboard routes */}
        <Route path="/dashboard"     element={<UserDashboard />} />
        <Route path="/dashboard/new" element={<NewMemory />} />
        <Route path="/dashboard/tasks" element={<TodayTasks />} />
        <Route path="/dashboard/chat"  element={<ChatPage />} />
        <Route path="/dashboard/profile" element={<ProfileSettings />} />
        <Route path="/dashboard/thoughts" element={<ThoughtsPage />} />
        <Route path="/dashboard/roadmap" element={<RoadmapPage />} />
        <Route path="/dashboard/resonance" element={<ResonancePage />} />
      </Routes>
    </div>
  );
};

export default App;