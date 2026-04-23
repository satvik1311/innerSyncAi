import datetime
from services.db import db

activity_logs_col = db["activity_logs"]
thoughts_col      = db["thoughts"]
goals_col         = db["goals"]
nudges_col        = db["nudges"]

NUDGE_COOLDOWN_HOURS = 24  # Minimum gap between same-pattern nudges per user

NEGATIVE_MOODS = {"anxious", "frustrated", "sad", "overwhelmed", "tired", "lost", "stressed", "angry", "hopeless"}


async def _already_nudged_recently(email: str, trigger: str) -> bool:
    """Returns True if this exact pattern nudge was already sent within the cooldown window."""
    cutoff = (datetime.datetime.utcnow() - datetime.timedelta(hours=NUDGE_COOLDOWN_HOURS)).isoformat()
    existing = await nudges_col.find_one({
        "user_email": email,
        "trigger": trigger,
        "created_at": {"$gte": cutoff}
    })
    return existing is not None


# ── RULE 1: Inactivity Detection ─────────────────────────────────────────────
async def check_inactivity(email: str) -> tuple:
    """Fires when the user has had ZERO logged actions in the last 3 days."""
    cutoff_3d = (datetime.datetime.utcnow() - datetime.timedelta(days=3)).isoformat()
    recent = await activity_logs_col.find_one({
        "user_email": email,
        "created_at": {"$gte": cutoff_3d}
    })
    if not recent:
        return True, "inactivity_3d", {"days": 3}
    return False, None, {}


# ── RULE 2: Negative Sentiment Streak ────────────────────────────────────────
async def check_negative_mood_streak(email: str) -> tuple:
    """Fires when 3 of the last 5 thoughts have a negative mood."""
    cutoff_5d = (datetime.datetime.utcnow() - datetime.timedelta(days=5)).isoformat()

    thoughts = []
    async for t in thoughts_col.find(
        {"user_email": email, "created_at": {"$gte": cutoff_5d}}
    ).sort("created_at", -1).limit(5):
        thoughts.append(t)

    if len(thoughts) < 3:
        return False, None, {}

    negative_count = sum(1 for t in thoughts if t.get("mood", "").lower() in NEGATIVE_MOODS)
    if negative_count >= 3:
        moods = [t.get("mood", "").lower() for t in thoughts[:3]]
        return True, "negative_streak", {"moods": moods, "count": negative_count}
    return False, None, {}


# ── RULE 3: Goal Avoidance Detection ─────────────────────────────────────────
async def check_goal_avoidance(email: str) -> tuple:
    """Fires when the user has active goals but no task completions in 4+ days."""
    cutoff_4d = (datetime.datetime.utcnow() - datetime.timedelta(days=4)).isoformat()

    active_goals_count = await goals_col.count_documents({"email": email, "status": "active"})
    if active_goals_count == 0:
        return False, None, {}

    recent_completions = await activity_logs_col.count_documents({
        "user_email": email,
        "action_type": "task_completed",
        "created_at": {"$gte": cutoff_4d}
    })

    if recent_completions == 0:
        goal = await goals_col.find_one({"email": email, "status": "active"})
        title = goal.get("title", "your goal") if goal else "your goal"
        return True, "goal_avoidance", {"goal_title": title}
    return False, None, {}


# ── Main Orchestrator ─────────────────────────────────────────────────────────
async def analyze_user(email: str) -> list:
    """
    Runs all pattern detection rules for a single user.
    Returns a list of triggered patterns: [{"pattern": str, "context": dict}]
    """
    rules = [
        check_inactivity,
        check_negative_mood_streak,
        check_goal_avoidance,
    ]

    triggered = []
    for rule in rules:
        try:
            hit, pattern, context = await rule(email)
            if hit and not await _already_nudged_recently(email, pattern):
                triggered.append({"pattern": pattern, "context": context})
        except Exception as e:
            print(f"[NudgeAnalyzer] Rule error for {email}: {e}")

    return triggered
