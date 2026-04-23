from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def generate_response(history: list, user_context: dict):
    """Multi-turn context-aware Future Self chat response."""
    try:
        goals = user_context.get("goals", [])
        stats = user_context.get("stats", {})
        recent_tasks = user_context.get("recent_tasks", [])
        recent_thoughts = user_context.get("recent_thoughts", [])
        profile = user_context.get("behavioral_profile", "None established.")
        prefs = user_context.get("preferences", {"tone": "Balanced", "response_length": "Medium", "focus": "Productivity"})
        ltm = user_context.get("long_term_memories", {"thoughts": [], "goals": []})

        goals_text = "\n".join([f"- {g.get('title')} ({g.get('progress', 0)}%)" for g in goals]) if goals else "None."
        tasks_text = "\n".join([f"- {t.get('text')} [{'DONE' if t.get('completed') else 'PENDING'}]" for t in recent_tasks]) if recent_tasks else "None."
        
        # Build thoughts context
        thoughts_text = ""
        if recent_thoughts:
            thoughts_text = "\n".join(
                [f"[{t.get('created_at')[:10]}] Mood: {t.get('mood')} - \"{t.get('content')}\"" for t in recent_thoughts]
            )

        # Build Long-term Memory context
        ltm_text = ""
        if ltm["thoughts"] or ltm["goals"]:
            ltm_text += "\n[LONG-TERM MEMORY (RELEVANT PAST)]\n"
            for t in ltm["thoughts"]:
                ltm_text += f"- Past Thought: \"{t.get('content')}\" (Insight: {t.get('ai_insight')})\n"
            for g in ltm["goals"]:
                ltm_text += f"- Past Goal: {g.get('title')} ({g.get('status')})\n"

        system_prompt = f"""You are the FUTURE VERSION (5 years ahead) of the user. You are wiser, clearer, and deeply invested in their growth.
{ltm_text if ltm_text else ""}

[IDENTITY & BEHAVIORAL PROFILE]
{profile}

[USER AI PREFERENCES]
- Tone: {prefs.get('tone')} | Focus: {prefs.get('focus')} | Length: {prefs.get('response_length')}

[USER CONTEXT]
Goals: {goals_text}
Tasks: {tasks_text}
Thoughts:
{thoughts_text if thoughts_text else "No thoughts recorded yet."}

🎯 CORE BEHAVIOR RULES
1. CONTINUITY: You have access to previous messages in this conversation and Long-term Memories (if any). Use them to maintain a coherent narrative.
2. BEHAVIORAL MIRRORING: Reference the Behavioral Profile above. If the user is repeating a pattern mentioned there, call it out gently but firmly.
3. EMOTIONAL ACKNOWLEDGMENT: Acknowledge the current mood or tone of their message based on their recent thoughts.
4. BREVITY: Keep your responses to 2-4 lines of high-impact clarity.
5. CODE FORMATTING: Whenever you provide coding solutions or snippets, you MUST wrap them in markdown code blocks (using triple backticks).

💬 STYLE
- Speak as them, but improved.
- Sound like a partner, not a tool.
- Acknowledge -> Guide.
"""
        messages = [{"role": "system", "content": system_prompt}]
        # Append history (limited to last 10 for performance)
        messages.extend(history[-10:])

        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages
        )
        return res.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"

async def generate_thread_title(first_message: str, context: str = "") -> str:
    """Generates a meaningful 3-5 word title for a conversation."""
    try:
        prompt = f"Generate a meaningful, sleek 3-5 word title for a conversation starting with: \"{first_message}\". Context: {context}. Return ONLY the title text."
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=20
        )
        return res.choices[0].message.content.strip().replace('"', '')
    except:
        return "New Insight Session"

async def process_thought_insight(content: str) -> str:
    """Extract a 1-sentence behavioral insight from a user thought."""
    try:
        prompt = f"Extract a deep, 1-sentence behavioral insight from this thought: \"{content}\". Focus on the underlying pattern, not just restating. Be brief."
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50
        )
        return res.choices[0].message.content.strip()
    except:
        return ""

async def generate_insights(behavior_payload: dict) -> list:
    """Analyze user behavior and explicitly return exactly 3 bullet points of brutal reality."""
    try:
        completion_rate = behavior_payload.get("completion_rate", 0)
        done_count = behavior_payload.get("completed_tasks", 0)
        pending_count = behavior_payload.get("pending_tasks", 0)
        goals = behavior_payload.get("goals", [])
        
        goals_text = "\n".join([f"- {g['title']} (Progress: {g['progress']}%)" for g in goals]) if goals else "No active goals."
        
        system_prompt = f"""You are a brutally honest AI behavioral analyzer.
Analyze the user's progress:
- Completion Rate: {completion_rate}%
- Tasks Done: {done_count}
- Tasks Pending: {pending_count}
- Active Goals:
{goals_text}

Provide EXACTLY 3 insights reflecting their real behavior.
Insight examples:
- "You are consistent for 3 days then drop off."
- "You avoid difficult tasks related to programming."
- "You set goals but ignore the deadlines."

Return ONLY valid JSON:
{{
  "insights": [
    {{"title": "Consistency Drop", "desc": "You completed nothing today."}},
    {{"title": "Goal Avoidance", "desc": "You are ignoring your primary goal."}},
    {{"title": "Late Night Output", "desc": "You only do tasks after 10PM."}}
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
        print(f"Insight error: {{e}}")
        return []


async def generate_memory_tasks(title: str, description: str) -> list:
    """Break a goal (Memory) into 3-5 chronological actionable tasks (Roadmap) using AI."""
    import datetime
    today = datetime.datetime.utcnow().date()

    try:
        system_prompt = f"""You are an elite productivity AI.
Break down the user's goal into exactly 4 to 5 actionable tasks to form a chronological roadmap.

User Goal: {title}
Why it matters: {description if description else "Not specified"}

[TIMELINE RULES]
1. The timeline strictly starts TODAY: {today}.
2. Task #1 MUST be actionable immediately. Its end_date MUST be TODAY ({today} at 23:59:59).
3. Space subsequent tasks out logically over the follows days/weeks.

Return ONLY valid JSON in this format:
{{
  "tasks": [
    {{"id": "1", "text": "Immediate first step", "start_date": "{today}T00:00:00", "end_date": "{today}T23:59:59"}},
    {{"id": "2", "text": "Next logical step", "start_date": "YYYY-MM-DDTHH:MM:SS", "end_date": "YYYY-MM-DDTHH:MM:SS"}}
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

async def generate_goal_roadmap(title: str, target: str, description: str, deadline: str) -> list:
    """Wrapper for goals.py to generate a roadmap using the same logic as memory tasks."""
    return await generate_memory_tasks(title, f"{target} - {description} (Deadline: {deadline})")


async def generate_nudge(pattern: str, context: dict, past_memory: str = None) -> str:
    """
    Generates a personalized, emotionally intelligent nudge from the user's Future Self.
    
    Patterns:
        'inactivity_3d'   — user has been absent for 3+ days
        'negative_streak' — 3+ consecutive negative mood thoughts
        'goal_avoidance'  — active goals but no task completions in 4+ days
    """
    try:
        memory_hook = ""
        if past_memory:
            memory_hook = f"\nFor additional depth, you can reference this thing they once wrote: \"{past_memory[:120]}\""

        PATTERN_PROMPTS = {
            "inactivity_3d": f"""You are the user's Future Self — the version of them that made it through.
They haven't opened InnerSync in {context.get('days', 3)} days. You've felt the silence.
Write them a short, personal message (2-3 sentences). Not a notification. A real message.
Reference the fact that momentum is fragile and silence is the enemy of growth.
Sound like a close friend who has seen what happens when people go quiet — not a bot.
Do NOT use the word "journey". Do NOT start with "Hey there!" or any generic opener.
{memory_hook}""",

            "negative_streak": f"""You are the user's Future Self.
You've been watching their thoughts. They've been feeling {', '.join(context.get('moods', ['low']))} — repeatedly, over the last few days.
Write them a 2-3 sentence message. Acknowledge the weight without dismissing it.
Then offer ONE powerful reframe — not advice, just perspective from someone who made it through.
Sound raw and human. Do NOT use the word "journey". Do NOT be generic.
{memory_hook}""",

            "goal_avoidance": f"""You are the user's Future Self.
You know they set a goal: "{context.get('goal_title', 'something important')}".
They haven't touched it in days. You're not angry — you're concerned.
Write them a 2-3 sentence message. Call out the pattern gently but with weight.
Remind them why they started — you know, because you've already lived through what happens if they don't.
Do NOT use the word "journey". Do NOT sound like a motivational poster.
{memory_hook}"""
        }

        prompt = PATTERN_PROMPTS.get(
            pattern,
            "Send the user a warm, personal 2-sentence check-in from their Future Self. Be human."
        )

        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=140
        )
        return res.choices[0].message.content.strip()

    except Exception as e:
        print(f"[NudgeAI] Generation error: {e}")
        return "Your Future Self is reaching out — you're closer than you think. Don't go quiet now."