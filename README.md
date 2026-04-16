# 🧠 InnerSync AI — Master Your Future Self

**InnerSync AI** is a state-of-the-art cognitive partner designed to bridge the gap between your present self and the version of you that has already succeeded. It is a high-performance, context-aware productivity ecosystem that uses AI behavioral analysis to maintain accountability, visualize thought resonance, and gamify your personal evolution.

---

## 🚀 Key Features

### 💬 Future Self Chat (Temporal Bridge)
Talk to a context-aware AI persona that lives 5 years ahead of you. 
- **Persona Persistence**: The AI remembers your goals, tasks, and past conversations.
- **Behavioral Mirros**: It calls out your patterns (consistency drops, avoidance) with brutal clarity.
- **Dynamic Context**: Responses adapt based on your recent "Thought Resonance" and task completion rates.

### 🗺️ AI-Driven Roadmaps
Transform abstract goals into chronological trajectories.
- **Auto-Decomposition**: AI breaks high-level ambitions into actionable, daily tasks.
- **Strict/Soft Modes**: Choose your intensity. In "Strict" mode, the AI holds you accountable with urgent reminders.
- **Visual Trajectory**: Track your "Sync Score" as you move closer to your future self.

### 🏆 Legacy Vault (Achievements)
A premium, celebratory system to record your triumphs.
- **Trophy Cards**: Every major goal completion is etched in golden UI cards.
- **Dynamic Ranks**: Evolve from *Initiate* to *Architect* based on your execution density.
- **Reward Labels**: Earn badges like "Consistency Win" and "Execution Excellence."

### 🕸️ Neural Resonance Map
A semantic visualization of your subconscious patterns.
- **Relational Map**: Uses force-directed graphing to cluster similar thoughts together.
- **Insight Extraction**: AI analyzes each thought to find the underlying behavioral pattern.

---

## 🛠️ Technology Stack

### Frontend
- **React 19 (Vite)**: High-speed, modern component architecture.
- **Tailwind CSS v4**: Ultra-fast utility-first styling.
- **Framer Motion**: Fluid, cinematic transitions and micro-animations.
- **Recharts / Force Graph**: Data-driven progress and semantic visualizations.

### Backend
- **FastAPI**: High-performance Python web framework.
- **Groq AI (Llama 3.1)**: Blazing-fast LLM inference for real-time coaching.
- **MongoDB (Motor)**: Asynchronous document storage for threads, tasks, and insights.
- **SMTP Engine**: Background cron for accountability alerts and notifications.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** (Atlas or Local Instance)
- **Groq API Key**

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate # windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn motor python-dotenv groq python-multipart pyjwt passlib certifi

# Create .env file
# (See Environment Variables section below)

# Start Engine
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Dev Server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:

```env
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_signing_key

# Optional: For Accountability Notifications
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

---

## 🎯 Usage Guide

1. **Establish Sync**: Start by logging in. Your session will persist across refreshes.
2. **Capture Thoughts**: Use the "Capture" tool to log your state of mind. The Neural Resonance Map will update instantly.
3. **Set the Trajectory**: Create a "New Memory" (Goal). The AI will generate a roadmap TODAY.
4. **Interact**: Chat with your Future Self to get feedback on your current focus.
5. **Master**: Complete tasks to level up your rank and build your Legacy Vault.

---

**InnerSync AI** — *Synchronize your present. Master your future.*
