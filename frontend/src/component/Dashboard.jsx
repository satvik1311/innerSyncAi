import React from "react";
import "./Dashboard.css";
import { Button } from "@/component/ui/button"

import {
  Brain,
  MessageCircle,
  Target,
  Clock,
  Plus,
  TrendingUp,
  Calendar,
  Heart,
} from "lucide-react";
const Dashboard = () => {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
  const recentMemories = [
    {
      id: 1,
      title: "Morning reflection on career goals",
      content: "Feeling optimistic about the new project at work...",
      mood: "Optimistic",
      tags: ["career", "goals", "work"],
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Weekend thoughts about relationships",
      content: "Had a deep conversation with my partner about...",
      mood: "Grateful",
      tags: ["relationships", "gratitude"],
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Learning progress update",
      content: "Finally understanding React patterns better...",
      mood: "Accomplished",
      tags: ["learning", "coding", "progress"],
      date: "3 days ago",
    },
  ];

  const goals = [
    { title: "Learn AI fundamentals", progress: 65, deadline: "Dec 2024" },
    { title: "Read 24 books this year", progress: 80, deadline: "Dec 2024" },
    { title: "Start meditation practice", progress: 45, deadline: "Jan 2025" },
  ];

  return (
    <div className="lp page">
      <div className="lp container">
        {/* Header */}
        <div className="lp header">
          <div>
            <h1 className="lp title">Welcome back, Alex</h1>
            <p className="lp muted">
              Continue your journey of self-discovery and growth
            </p>
          </div>
          <div className="Login">
            <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
          </div>
        </div>

        {/*  Login Modal */}
        {isLoginOpen && (
          <div className="lp modal-overlay">
            <div className="lp modal">
              <div className="signinheader">
                <h2 className="lp h2">Login</h2>
              <Button
                variant="ghost"
                onClick={() => setIsLoginOpen(false)}
              >
                X
              </Button>
              </div>
              
              <form className="lp stack">
                <input type="email" placeholder="Email" className="lp input" />
                <input type="password" placeholder="Password" className="lp input" />
                <Button>Submit</Button>
              </form>
              
              <p>Didn't register yet? <Button
                variant="ghost" style={{padding:0}}
                onClick={() => {setIsSignUpOpen(true);
                setIsLoginOpen(false)
                }}
              >
                Sign Up
              </Button>  </p>
            </div>
          </div>
        )}

        {/* 👇 SignUp Modal */}
        {isSignUpOpen && (
          <div className="lp modal-overlay">
            <div className="lp modal">
              <div className="signinheader">
                <h2 className="lp h2">SignUp</h2>
              <Button
                variant="ghost"
                onClick={() => setIsSignUpOpen(false)}
              >
                X
              </Button>
              </div>
              <form className="lp stack">
                <input type="email" placeholder="Email" className="lp input" />
                <input type="password" placeholder="Password" className="lp input" />
                <input type="password" placeholder="renter password" className="lp input"/>
                <Button>Submit</Button>
              </form>
              <p>Already have an account? <Button
                variant="ghost" style={{padding:0}}
                onClick={() => {setIsLoginOpen(true);
                setIsSignUpOpen(false)
                }}>
                Login
              </Button>  </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="lp quick-actions">
          <button className="lp btn lp btn-cosmic">
            <Plus size={22} />
            <span>New Memory</span>
          </button>
          <button className="lp btn lp btn-outline">
            <MessageCircle size={22} />
            <span>Chat Future Self</span>
          </button>
          <button className="lp btn lp btn-outline">
            <Target size={22} />
            <span>Add Goal</span>
          </button>
          <button className="lp btn lp btn-outline">
            <Clock size={22} />
            <span>Time Capsule</span>
          </button>
        </div>

        <div className="lp grid">
          {/* Recent Memories */}
          <div className="lp col-main">
            <div className="lp card">
              <div className="lp card-head between">
                <div className="lp row gap">
                  <Brain size={22} className="lp icon-vault" />
                  <h2 className="lp h2">Recent Memories</h2>
                </div>
                <button className="lp btn lp btn-ghost lp btn-sm">View All</button>
              </div>

              <div className="lp stack">
                {recentMemories.map((m) => (
                  <div key={m.id} className="lp card lp memory">
                    <div className="lp memory-head">
                      <h3 className="lp h3">{m.title}</h3>
                      <span className="lp badge">
                        <Heart size={14} className="lp badge-icon" />
                        {m.mood}
                      </span>
                    </div>

                    <p className="lp text line-clamp-2">{m.content}</p>

                    <div className="lp memory-foot">
                      <div className="lp tags">
                        {m.tags.map((t) => (
                          <span key={t} className="lp badge lp badge-outline">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="lp date">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lp col-side">
            {/* Goals */}
            <div className="lp card">
              <div className="lp card-head">
                <Target size={22} className="lp icon-warm" />
                <h2 className="lp h2">Goal Progress</h2>
              </div>

              <div className="lp stack">
                {goals.map((g, i) => (
                  <div key={i} className="lp goal">
                    <div className="lp goal-top">
                      <span className="lp text-sm">{g.title}</span>
                      <span className="lp text-xs lp muted">{g.progress}%</span>
                    </div>
                    <div className="lp progress">
                      <div className="lp bar" style={{ width: `${g.progress}%` }} />
                    </div>
                    <div className="lp goal-bottom">
                      <span className="lp badge lp badge-outline">
                        <Calendar size={14} className="lp badge-icon" />
                        {g.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Preview */}
            <div className="lp card">
              <div className="lp card-head">
                <MessageCircle size={22} className="lp icon-sec" />
                <h2 className="lp h2">Future Self Says</h2>
              </div>

              <div className="lp chat">
                <p className="lp italic text">
                  "Remember that every small step you take today builds the foundation for who you'll
                  become. Trust the process and stay curious."
                </p>
                <div className="lp chat-foot">
                  <span className="lp glow">Future You (Age 35)</span>
                  <button className="lp btn lp btn-ghost lp btn-sm">Continue Chat</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lp card">
              <div className="lp card-head">
                <TrendingUp size={22} className="lp icon-cool" />
                <h2 className="lp h2">Your Growth</h2>
              </div>

              <div className="lp stats">
                <div className="lp stat">
                  <div className="lp stat-num glow">127</div>
                  <div className="lp stat-label">Memories</div>
                </div>
                <div className="lp stat">
                  <div className="lp stat-num warm">42</div>
                  <div className="lp stat-label">Days Streak</div>
                </div>
                <div className="lp stat">
                  <div className="lp stat-num sec">8</div>
                  <div className="lp stat-label">Goals Active</div>
                </div>
                <div className="lp stat">
                  <div className="lp stat-num cool">3</div>
                  <div className="lp stat-label">Capsules</div>
                </div>
              </div>
            </div>
          </div>
          {/* /sidebar */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
