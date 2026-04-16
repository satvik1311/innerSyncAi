from services.db import thoughts_collection, users_collection, behavior_insights_collection, memories_collection
from groq import Groq
import os
import json
import datetime
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def update_behavioral_insights(email: str):
    """Generates specific behavioral insights based on thoughts, moods, and goal performance."""
    try:
        # Aggregated Data for context
        thoughts = []
        async for t in thoughts_collection.find({"user_email": email}).sort("created_at", -1).limit(20):
            thoughts.append(f"Mood: {t.get('mood')} | Content: {t.get('content')}")
        
        memories = []
        async for m in memories_collection.find({"user_email": email, "status": "active"}):
            memories.append({
                "title": m.get("title"),
                "progress": m.get("progress", 0),
                "tasks_total": len(m.get("tasks", [])),
                "tasks_done": len([t for t in m.get("tasks", []) if t.get("completed")])
            })

        if not thoughts and not memories:
            return None

        # Prepare AI prompt
        context_text = f"RECENT THOUGHTS:\n{chr(10).join(thoughts)}\n\nACTIVE GOALS:\n{json.dumps(memories, indent=2)}"
        
        system_prompt = """You are an expert AI behavioral analyst for InnerSync AI.
Analyze the provided user data (thoughts, moods, goal progress) and generate exactly 3-5 specific behavioral insights.

[RULES]
1. HONESTY: Don't just be positive. If the user is procrastinating or stressed, call it out.
2. SPECIFICITY: Connect thoughts to goals if possible (e.g., "Mood drops when working on [Goal]").
3. FORMAT: Return ONLY valid JSON in the following format:
{
  "insights": [
    {"title": "Pattern Title", "desc": "1-sentence specific observation."},
    ...
  ]
}
4. BREVITY: Title should be 2-3 words. Description should be 1-2 lines.
"""
        
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this data:\n\n{context_text}"}
            ]
        )
        
        data = json.loads(res.choices[0].message.content)
        insights = data.get("insights", [])

        if insights:
            await behavior_insights_collection.update_one(
                {"email": email},
                {"$set": {
                    "insights": insights,
                    "last_updated": datetime.datetime.utcnow().isoformat()
                }},
                upsert=True
            )
        return insights

    except Exception as e:
        print(f"Behavioral Insight Error: {e}")
        return []

async def analyze_user_patterns(email: str):
    """Aggregates user thoughts and generates/updates a behavioral profile."""
    try:
        # Fetch last 30 thoughts to detect patterns
        thoughts = []
        async for t in thoughts_collection.find({"user_email": email}).sort("created_at", -1).limit(30):
            thoughts.append({
                "content": t.get("content"),
                "mood": t.get("mood"),
                "insight": t.get("ai_insight"),
                "date": t.get("created_at")[:10]
            })

        if not thoughts:
            return

        thoughts_summary = "\n".join([
            f"[{t['date']}] Mood: {t['mood']} | Thought: {t['content']} | Insight: {t['insight']}" 
            for t in thoughts
        ])

        system_prompt = """You are an elite behavioral psychologist and data analyst.
Analyze the user's thoughts and insights to build a concise 1-paragraph "Behavioral Profile".
Identify:
1. Reoccurring emotional triggers or mood trends.
2. Consistency patterns in their work/goals.
3. Common cognitive biases or blocks they face.

Format: One dense, insightful paragraph. Speak in the third person about the "user".
"""
        
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze these thoughts:\n\n{thoughts_summary}"}
            ]
        )
        
        profile = res.choices[0].message.content.strip()

        # Update user profile in DB
        await users_collection.update_one(
            {"email": email},
            {"$set": {"behavioral_profile": profile}}
        )
        return profile

    except Exception as e:
        print(f"Profile analysis error: {e}")
        return None

async def get_user_profile(email: str):
    """Fetches the pre-calculated behavioral profile for a user."""
    user = await users_collection.find_one({"email": email})
    return (user or {}).get("behavioral_profile", "No behavioral profile established yet. Continue capturing thoughts to synchronize.")

async def generate_ai_nickname(email: str):
    """Generates a pithy, expressive, and slightly honest nickname for the user."""
    try:
        user = await users_collection.find_one({"email": email})
        if not user: return "The Ghost"
        
        profile = user.get("behavioral_profile", "New user")
        streak = user.get("streak_count", 0)
        
        system_prompt = """You are a witty AI identity designer. 
        Create a 2-3 word "Evolution Nickname" for the user based on their behavior.
        
        [STREAK CONTEXT]
        - High streak (5+): Rewarding, powerful, momentum-based.
        - Low streak (0-2): Honest, encouraging but slightly "calling them out" if they broke a streak.
        - Behavioral Profile: Use it to add flavor (e.g., if they are stressed, "The Calm Seeker").
        
        [STYLE]
        - Expressive and Honest.
        - Slightly edgy or cool (not cringe).
        - Examples: "The Relentless Architect", "The Inconsistent Visionary", "Midnight Grind Queen", "The Chaos Tamer".
        
        Return ONLY the nickname text. No quotes.
        """
        
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Streak: {streak} days. Behavioral Profile: {profile}"}
            ],
            max_tokens=20
        )
        
        nickname = res.choices[0].message.content.strip().replace('"', '')
        await users_collection.update_one({"email": email}, {"$set": {"ai_nickname": nickname}})
        return nickname
    except Exception as e:
        print(f"Nickname error: {e}")
        return "The Voyager"
