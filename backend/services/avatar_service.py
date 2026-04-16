from services.db import db, memories_collection
import datetime

users_collection = db["users"]

async def refresh_avatar_state(email: str):
    """
    Calculates the Future Self Avatar score and state based on:
    score = (avg_completion * 0.6) + (streak * 0.4)
    """
    user = await users_collection.find_one({"email": email})
    if not user:
        return

    # 1. Calculate Average Completion %
    # We look at all memories (active and completed)
    memories = await memories_collection.find({"user_email": email}).to_list(length=100)
    
    total_completion = 0
    if memories:
        for mem in memories:
            tasks = mem.get("tasks", [])
            if not tasks:
                total_completion += 100 # No tasks = goal technically met? Or just ignore.
                continue
            done = sum(1 for t in tasks if t.get("completed", False))
            total_completion += (done / len(tasks)) * 100
        avg_completion = total_completion / len(memories)
    else:
        avg_completion = 0

    # 2. Calculate Normalized Streak (Benchmark of 30 days)
    streak = user.get("streak_count", 0)
    # min(streak, 30) / 30 * 100
    normalized_streak = min(streak, 30) / 30 * 100

    # 3. Hybrid Score
    score = (avg_completion * 0.6) + (normalized_streak * 0.4)
    score = round(score, 1)

    # 4. Determine State
    if score >= 70:
        state = "elite"
    elif score >= 40:
        state = "improving"
    else:
        state = "base"

    # 5. Update User Document
    await users_collection.update_one(
        {"email": email},
        {"$set": {
            "avatar_score": score,
            "avatar_state": state,
            "avatar_last_updated": datetime.datetime.utcnow().isoformat()
        }}
    )

    return {"score": score, "state": state}
