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

const App = () => {
  const location = useLocation();
  const hideLanding = location.pathname.startsWith("/dashboard") ||
    ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!hideLanding && <Navigation />}

      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/signup"        element={<Signup />} />

        {/* Dashboard routes */}
        <Route path="/dashboard"     element={<UserDashboard />} />
        <Route path="/dashboard/new" element={<NewMemory />} />
        <Route path="/dashboard/tasks" element={<TodayTasks />} />
        <Route path="/dashboard/chat"  element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;