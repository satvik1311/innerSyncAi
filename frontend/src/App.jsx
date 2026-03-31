import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navigation from "./component/Navigation";
import LandingPage from "./component/LandingPage";
import UserDashboard from "./component/ui/Dashboard/UserDashboard";
import NewMemory from "./component/ui/Dashboard/NewMemory";
import GoalsPage from "./component/ui/Dashboard/GoalsPage";
import Login from "./component/auth/Login";
import Signup from "./component/auth/Signup";

const App = () => {
  const location = useLocation();

  // ❌ Navbar hide on these pages
  const hideNavbarRoutes = ["/login", "/signup", "/dashboard", "/dashboard/new", "/dashboard/goals"];

  // Exact match handling, or just check if it starts with dashboard
  const shouldShowNavbar = !hideNavbarRoutes.some(path => location.pathname === path || location.pathname.startsWith("/dashboard"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#020617]">

      {/* ✅ CONDITIONAL NAVBAR */}
      {shouldShowNavbar && <Navigation />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/new" element={<NewMemory />} />
        <Route path="/dashboard/goals" element={<GoalsPage />} />
      </Routes>

    </div>
  );
};

export default App;