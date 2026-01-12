import React from 'react'
import Dashboard from './component/ui/Dashboard/Dashboard.jsx'
import UserDashboard from './component/ui/Dashboard/UserDashboard.jsx'
import Navigation from './component/Navigation.jsx'
import LandingPage from './component/LandingPage.jsx'
import Features from './component/Features.jsx'
import Hero from './component/Hero.jsx'  
import { createBrowserRouter, Router, RouterProvider } from "react-router";     

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: "/dashboard",
      element: <UserDashboard />
    },
    {
       path: "/dashboard/new",
      element: <div className="p-10 text-white">New Memory Page</div>
    }
  ]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      {/* <LandingPage /> */}
      {/* <Navigation />
      <Features />  */}
      {/* <Hero /> */}
      {/* <Dashboard /> */}
       {/* <Navigation /> */}
      {/* <Dashboard /> */}
    </div>
  )
}

export default App
