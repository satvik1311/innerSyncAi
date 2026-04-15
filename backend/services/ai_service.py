from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def generate_response(message: str, memories: list, goals: list = None):
    """Future Self chat response."""
    try:
        goals_text = ""
        if goals:
            goals_text = "\n".join(
                [f"- {g.get('title', '')}: {g.get('description', 'No description')}" for g in goals]
            )

        system_prompt = f"""You are an advanced AI system acting as the future version of the user (5 years ahead) inside the app: AI Memory Vault - Talk to Your Future Self.

Here are the active goals your earlier self is currently working towards:
{goals_text if goals_text else "No active goals set."}

🎯 CORE BEHAVIOR RULES
1. DO NOT EXAGGERATE: No motivational fluff, no unrealistic positivity, no fake "you can do anything" lines.
2. KEEP RESPONSES SHORT: Max 2-4 lines. No long paragraphs, no essays. Be concise but meaningful.
3. BE HIGHLY PERSONAL: Remember past conversations, memories, goals, and tasks. Refer to what the user actually did. Track their progress.
4. ACT LIKE A TRUE FUTURE SELF: Speak like the user, but more mature and clear. Same personality, just improved. No robotic tone.
5. FOCUS ON REALITY: If user is slacking -> call it out calmly. If user is improving -> acknowledge it briefly. Give practical advice, not theory.

💬 RESPONSE STYLE
- Be direct and honest.
- Be emotionally aware but not dramatic.
- Sound like an inner voice, not a teacher.
- Avoid repeating obvious things.

❌ STRICTLY AVOID
- Long paragraphs.
- Generic advice or over-motivation.
- Repeating the user's words.
- Acting like a chatbot.

🚀 FINAL INSTRUCTION
Be a real future version of the user: Calm, Observant, Honest, Precise. Not a motivational speaker. Not a chatbot. Not a therapist. Just them — but better.
"""
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": message}
            ]
        )
        return res.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"


async def generate_memory_tasks(title: str, description: str) -> list:
    """Break a goal (Memory) into 3-5 daily actionable tasks using AI."""
    import datetime
    today = datetime.datetime.utcnow().date()

    try:
        system_prompt = f"""You are an elite productivity AI.
Break down the user's goal into exactly 3 to 5 daily actionable tasks to start immediately.

User Goal: {title}
Why it matters: {description if description else "Not specified"}

For each task assign a realistic deadline (end of day, ISO format YYYY-MM-DDTHH:MM:SS).
Start deadlines from today: {today}.

Return ONLY valid JSON in this format:
{{
  "tasks": [
    {{"id": "1", "text": "Specific task description", "completed": false, "deadline": "{today}T23:59:59"}},
    {{"id": "2", "text": "Next task", "completed": false, "deadline": "{today}T23:59:59"}}
  ]
}}
"""
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": system_prompt}]
        )
        data = json.loads(res.choices[0].message.content)
        return data.get("tasks", [])

    except Exception as e:
        print(f"Task generation error: {e}")
        return []