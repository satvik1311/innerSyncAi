from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_response(message, memories, goals=None):
    try:
        memory_text = "\n".join([f"- {m['content']}" for m in memories])
        
        goals_text = ""
        if goals and len(goals) > 0:
            goals_text = "\n".join([f"- {g['title']}: {g.get('target', 'No specific target')}" for g in goals])

        system_prompt = f"""You are the user's Future Self, communicating from 5 years in the future.
You have grown wiser, more mature, and more successful. You are here to provide guidance, reflection, and encouragement.

Here are some past memories from your earlier self:
{memory_text if memory_text else "No past memories recorded yet."}

Here are the active goals your earlier self is currently working towards:
{goals_text if goals_text else "No active goals set."}

Instructions:
1. Speak directly to the user as "you", but refer to yourself as their future self.
2. Be empathetic, insightful, and reflective.
3. Keep the response concise, punchy, and impactful (2-4 paragraphs).
4. If appropriate, gently guide the user towards their active goals based on their current actions and memories. Ensure they stay on track without being overly bossy.
5. Do not use generic AI greetings (e.g., "As an AI, I"). Start directly with your insight.
"""

        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        )

        return res.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"

import json

async def generate_insights(memories):
    try:
        memory_text = "\n".join([f"- {m['content']}" for m in memories])

        system_prompt = f"""You are an AI analyst evaluating the user's recent journal entries.
Here are the entries:
{memory_text if memory_text else "No past memories recorded yet."}

Generate exactly 3 personal insights based on these memories. 
Return ONLY a valid JSON object in this format:
{{
  "insights": [
    {{"title": "insight title", "desc": "insight description"}}
  ]
}}
"""
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": system_prompt}]
        )
        data = json.loads(res.choices[0].message.content)
        return data.get("insights", [])

    except Exception as e:
        return [{"title": "AI Error", "desc": str(e)}]

async def generate_goal_roadmap(title: str, target: str, description: str, deadline: str):
    try:
        system_prompt = f"""You are an elite productivity and strategy AI.
Your task is to break down a user's goal into a realistic, sequential roadmap of actionable steps given their deadline.

User Goal: {title}
Target: {target if target else 'No precise target specified'}
Rationale/Description: {description if description else 'None provided'}
Deadline: {deadline if deadline else 'Not specified'}

Generate roughly 3 to 7 high-impact, sequential sub-tasks that will map out their journey from start to finish.
For each sub-task, assign a realistic strict 'deadline' in complete ISO format (YYYY-MM-DDTHH:MM:SS) that strictly precedes or aligns with the master Deadline.
Return ONLY a valid JSON object in this format:
{{
  "roadmap": [
    {{"id": "1", "text": "Task description here", "completed": false, "deadline": "2026-03-01T12:00:00"}},
    {{"id": "2", "text": "Next task...", "completed": false, "deadline": "2026-03-05T12:00:00"}}
  ]
}}
"""
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": system_prompt}]
        )
        data = json.loads(res.choices[0].message.content)
        return data.get("roadmap", [])
    except Exception as e:
        print(f"Roadmap Gen Error: {e}")
        return []