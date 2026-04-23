# 🧠 InnerSync — Master Your Future Self

**InnerSync** is a state-of-the-art cognitive partner designed to bridge the gap between your present self and the version of you that has already succeeded. It is a high-performance, context-aware productivity ecosystem that uses AI behavioral analysis, long-term vector memory, and proactive nudging to maintain accountability, visualize thought resonance, and gamify your personal evolution.

---

## 🚀 Key Features

### 💬 Future Self Chat (Temporal Bridge)
Talk to a context-aware AI persona that lives 5 years ahead of you.
- **Persona Persistence**: Multi-turn conversation history across sessions with thread management.
- **Behavioral Mirroring**: Calls out your patterns (consistency drops, avoidance, stress cycles) with brutal clarity.
- **Dynamic Context**: Responses adapt based on your Thought Resonance, task completion rates, and AI-built behavioral profile.
- **Code Formatting**: AI responses render markdown with syntax-highlighted code blocks for technical queries.
- **Voice Input**: Speak your thoughts directly into the chat via Web Speech API.
- **Read Aloud**: Every AI response can be read aloud via Text-to-Speech synthesis.

### 🧬 Long-Term Memory (RAG Vector Database)
The AI doesn't just remember — it *retrieves* semantically relevant memories.
- **Vector Embeddings**: Every thought and goal is embedded using `BAAI/bge-small-en-v1.5` (384 dimensions).
- **Semantic Search**: At chat time, the system retrieves the most contextually relevant past thoughts and goals via MongoDB Atlas Vector Search.
- **Persistent Context**: The AI references your actual past words — "I remember when you wrote..." — not generic advice.
- **Dual Collection Search**: Searches both the `thoughts` and `goals` collections independently for maximum relevance.

### 🔮 Predictive Nudge System
The AI becomes proactive — detecting behavioral patterns and reaching out before you slip.
- **3 Pattern Detectors**: Inactivity (3+ days), Negative Mood Streak (3/5 thoughts negative), Goal Avoidance (active goals, no completions in 4+ days).
- **Smart Delivery**: Always in-app notification; email only sent for inactivity (when the user is confirmed offline).
- **Rate Limited**: Max 1 nudge per user per day — global daily cap + per-pattern 24h cooldown.
- **Priority Queue**: When multiple patterns trigger, only the highest-priority nudge fires (inactivity > mood streak > goal avoidance).
- **Emotionally Engineered Prompts**: Each pattern has a distinct AI prompt designed to feel like a real message from someone who knows you.
- **Full Audit Trail**: Every nudge stored with `delivery_type`, `sent_notification`, `sent_email`, `is_read`, `read_at` fields.

### 🗺️ AI-Driven Roadmaps
Transform abstract goals into chronological trajectories.
- **Auto-Decomposition**: AI breaks high-level ambitions into 4-5 actionable, time-bound tasks starting today.
- **Strict/Soft Modes**: Choose your intensity. In "Strict" mode, the AI holds you accountable with urgent deadline reminders.
- **Visual Trajectory**: Track your Sync Score as you move closer to your future self.

### 🏆 Legacy Vault (Achievements)
A premium, celebratory system to record your triumphs.
- **Trophy Cards**: Every major goal completion is etched in golden UI cards.
- **Dynamic Ranks**: Evolve from *Initiate* to *Architect* based on your execution density.
- **Reward Labels**: Earn badges like "Consistency Win" and "Execution Excellence."

### 🕸️ Neural Resonance Map
A semantic visualization of your subconscious patterns.
- **Relational Map**: Uses force-directed graphing to cluster similar thoughts together.
- **Insight Extraction**: AI analyzes each thought to find the underlying behavioral pattern.
- **Cognitive Clusters**: Groups your thoughts into 3-6 named clusters (e.g., "Ambition Signals", "Stress Patterns").

### 📊 Behavioral Intelligence Engine
A persistent psychological model of the user, built from their own data.
- **Behavioral Profile**: AI synthesizes your last 30 thoughts into a dense psychological portrait, updated continuously.
- **AI Nickname**: A dynamically generated identity label based on your streak and behavior (e.g., "The Relentless Architect").
- **Behavioral Insights**: 3-5 specific, honest observations about your patterns, updated after every new thought.
- **Streak Tracking**: Daily activity streaks with a 7-day visual calendar and longest streak record.

### 🔔 Real-Time Notification System
A WebSocket-powered notification center with premium in-app delivery.
- **Live Push**: New notifications appear instantly via persistent WebSocket connection.
- **Toast Alerts**: Real-time popup toasts for incoming nudges and missed deadlines.
- **Nudge Feed**: Dedicated `/dashboard/nudges` page showing all Future Self signals with pattern badges (Inactivity / Mood Alert / Goal Drift).
- **Email Delivery**: HTML-formatted accountability emails for missed tasks and inactivity nudges.

### 👤 Identity & Core (Profile System)
- **DiceBear Avatars**: Dynamic 2D avatar generation with style selection and evolution-based visual enhancement.
- **Public Profiles**: Shareable `/user/:username` pages with stats and achievement showcase.
- **AI Preferences**: Customize tone (Strict/Balanced/Empathetic), response length, and focus area.
- **Social Links**: GitHub, Twitter, LinkedIn, and personal website integration.

---

## 🛠️ Technology Stack

### Frontend
- **React 19 (Vite)**: High-speed, modern component architecture.
- **Tailwind CSS v4**: Ultra-fast utility-first styling with glassmorphism design system.
- **Framer Motion**: Fluid, cinematic transitions and micro-animations.
- **Recharts / Force Graph**: Data-driven progress and semantic visualizations.
- **ReactMarkdown**: Renders AI code responses with syntax-highlighted, scrollable code blocks.
- **Web Speech API**: Native browser voice input and text-to-speech for the chat interface.

### Backend
- **FastAPI**: High-performance async Python web framework.
- **Groq AI (Llama 3.1-8b-instant)**: Blazing-fast LLM inference for real-time coaching, nudge generation, and behavioral analysis.
- **MongoDB Atlas (Motor)**: Asynchronous document storage with Atlas Vector Search for semantic retrieval.
- **fastembed (BAAI/bge-small-en-v1.5)**: Local ONNX-based text embedding model for vector generation.
- **WebSockets**: Real-time notification delivery via persistent connections.
- **SMTP Engine**: Async email delivery for accountability alerts and nudges.
- **AsyncIO Cron**: Dual background jobs — task deadline monitor (every 60s) + nudge pipeline (every 24h).

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB Atlas** (Vector Search requires Atlas M0+)
- **Groq API Key** (free at console.groq.com)

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn motor python-dotenv groq python-multipart \
            pyjwt passlib certifi bcrypt fastembed python-jose aiofiles

# Create .env file (see Environment Variables below)

# Start Engine
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. MongoDB Atlas Vector Search Index (Required for RAG Memory)

After connecting your Atlas cluster, create a Vector Search index named `vector_index` on **both** the `thoughts` and `goals` collections:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "user_email"
    }
  ]
}
```

> Without this index, RAG memory is silently disabled and the AI will have no long-term recall.

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Core
MONGO_URI=your_mongodb_atlas_uri
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_signing_secret

# Email (optional — enables nudge emails and task reminders)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
```

---

## 🗄️ MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | User accounts, preferences, streaks, avatar, behavioral profile |
| `memories` | Goal-tasks (Memories) with roadmap and progress |
| `goals` | Extended goals with deadline, target, and vector embedding |
| `thoughts` | Mood entries with AI insight and vector embedding |
| `conversations` | Individual chat messages per thread |
| `threads` | Chat thread metadata and auto-generated titles |
| `notifications` | In-app notification feed (tasks, nudges, system) |
| `nudges` | Predictive nudge history with delivery metadata |
| `activity_logs` | Behavioral signal feed for the nudge analyzer |
| `behavior_insights` | AI-generated behavioral insight cards |

---

## 🎯 Usage Guide

1. **Establish Sync**: Sign up and log in. Your session and behavioral model persist across all devices.
2. **Capture Thoughts**: Use the "Capture" tool daily to log your state of mind. This feeds mood tracking, RAG memory, behavioral profiling, streaks, and nudges simultaneously.
3. **Set the Trajectory**: Create a "New Memory" (Goal). The AI decomposes it into a chronological roadmap starting today.
4. **Interact**: Chat with your Future Self. The AI retrieves your past thoughts and goals via semantic search to give grounded, personal responses.
5. **Check Your Signals**: Visit "Future Self Signals" to read proactive nudges from your AI — dispatched when behavioral patterns are detected.
6. **Master**: Complete tasks to level up your rank, build your Legacy Vault, and keep your streak alive.

---

## 🔮 Roadmap (Upcoming)

- [ ] Atlas Vector Search index auto-provisioning via API
- [ ] Push notification support (Web Push API)
- [ ] Nudge CTR tracking for personalization feedback loop
- [ ] Mobile app (React Native)
- [ ] ML-based failure prediction (logistic regression on activity signals)
- [ ] Multi-language support

---

**InnerSync** — *Synchronize your present. Master your future.*
