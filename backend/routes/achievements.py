from fastapi import APIRouter, Header, HTTPException
from services.db import memories_collection, goals_collection
from services.auth_service import decode_token
from bson import ObjectId
import datetime

router = APIRouter()

@router.get("/")
async def get_achievements(authorization: str = Header(None)):
    """Aggregates all completed memories, goals, and tasks for the user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    
    token = authorization.split(" ")[1]
    user = decode_token(token)
    email = user["email"]

    # 1. Fetch Completed Memories
    completed_memories = []
    async for mem in memories_collection.find({"user_email": email, "status": "completed"}):
        mem["_id"] = str(mem["_id"])
        completed_memories.append({
            "id": mem["_id"],
            "title": mem["title"],
            "description": mem.get("description", ""),
            "type": "Memory",
            "date": mem.get("completed_at", mem.get("created_at")), # Fallback if completed_at not set
            "label": "Milestone Reached"
        })

    # 2. Fetch Completed Goals
    completed_goals = []
    async for goal in goals_collection.find({"email": email, "status": "completed"}):
        goal["_id"] = str(goal["_id"])
        completed_goals.append({
            "id": goal["_id"],
            "title": goal["title"],
            "description": goal.get("description", ""),
            "type": "Goal",
            "date": goal.get("created_at"), 
            "label": "Global Objective Secured"
        })

    # 3. Fetch Completed Tasks (from all memories)
    completed_tasks = []
    async for mem in memories_collection.find({"user_email": email}):
        tasks = mem.get("tasks", [])
        for t in tasks:
            if t.get("completed"):
                completed_tasks.append({
                    "id": t.get("id"),
                    "title": t.get("text"),
                    "source": mem["title"],
                    "type": "Task",
                    "date": t.get("completed_at", datetime.datetime.utcnow().isoformat()),
                    "label": "Execution Excellence"
                })

    # Sort tasks by date descending
    completed_tasks.sort(key=lambda x: x["date"], reverse=True)

    # 4. Summary & Logic for Special Labels
    total_memories = len(completed_memories)
    total_goals = len(completed_goals)
    total_tasks = len(completed_tasks)

    # If this is their first ever task
    if total_tasks == 1:
        completed_tasks[0]["label"] = "First Step Completed"
    elif total_tasks >= 10:
        # Give the latest task a "Consistency Win"
        if completed_tasks:
            completed_tasks[0]["label"] = "Consistency Win"

    return {
        "summary": {
            "total_achievements": total_memories + total_goals + total_tasks,
            "total_milestones": total_memories + total_goals,
            "total_tasks": total_tasks,
            "rank": "Initiate" if total_tasks < 5 else "Pathfinder" if total_tasks < 20 else "Architect"
        },
        "achievements": completed_memories + completed_goals + completed_tasks[:20] # Limit to 20 latest for performance
    }
