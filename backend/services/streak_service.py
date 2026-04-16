from services.db import db, users_collection
import datetime
from services.avatar_service import refresh_avatar_state

async def update_streak(email: str):
    """
    Updates the user's streak and activity log.
    Logic:
    - If last activity was today: do nothing (already active).
    - If last activity was yesterday: increment streak.
    - If last activity was before yesterday: reset streak to 1.
    """
    user = await users_collection.find_one({"email": email})
    if not user:
        return None

    now = datetime.datetime.utcnow()
    today_str = now.date().isoformat()
    yesterday_str = (now.date() - datetime.timedelta(days=1)).isoformat()

    last_active = user.get("last_active_date") # ISO string YYYY-MM-DD
    current_streak = user.get("streak_count", 0)
    longest_streak = user.get("longest_streak", 0)
    activity_log = user.get("activity_log", [])

    # Ensure activity_log is a list
    if not isinstance(activity_log, list):
        activity_log = []

    # If already logged activity today, just return
    if last_active == today_str:
        return {
            "streak_count": current_streak,
            "is_new_day": False
        }

    # Determine new streak
    new_streak = 1
    if last_active == yesterday_str:
        new_streak = current_streak + 1
    
    # Update longest streak
    new_longest = max(longest_streak, new_streak)

    # Update activity log (Keep last 30 days for safety, though UI shows 7)
    activity_log.append(today_str)
    if len(activity_log) > 30:
        activity_log = activity_log[-30:]

    await users_collection.update_one(
        {"email": email},
        {"$set": {
            "streak_count": new_streak,
            "longest_streak": new_longest,
            "last_active_date": today_str,
            "activity_log": activity_log
        }}
    )

    # Because streak changed, refresh avatar state (which depends on streak)
    await refresh_avatar_state(email)

    return {
        "streak_count": new_streak,
        "is_new_day": True
    }

async def get_streak_stats(email: str):
    """Returns streak and last 7 days activity status."""
    user = await users_collection.find_one({"email": email})
    if not user:
        return None

    now = datetime.datetime.utcnow().date()
    activity_log = user.get("activity_log", [])
    
    # Generate last 7 days status
    stats_7_days = []
    for i in range(6, -1, -1):
        day = (now - datetime.timedelta(days=i)).isoformat()
        stats_7_days.append({
            "date": day,
            "active": day in activity_log
        })

    return {
        "current_streak": user.get("streak_count", 0),
        "longest_streak": user.get("longest_streak", 0),
        "last_7_days": stats_7_days,
        "nickname": user.get("ai_nickname", "The Newcomer")
    }
