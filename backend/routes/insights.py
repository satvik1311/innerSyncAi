from fastapi import APIRouter, Header, HTTPException
from services.ai_service import generate_insights
from services.db import memories_collection
from services.auth_service import decode_token

router = APIRouter()

@router.get("/")
async def get_insights(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    goals = []
    completed_count = 0
    pending_count = 0
    total_tasks = 0

    async for m in memories_collection.find({"user_email": user["email"]}):
        m["_id"] = str(m["_id"])
        tasks = m.get("tasks", [])
        total_tasks += len(tasks)
        
        mem_done = sum(1 for t in tasks if t.get("completed", False))
        completed_count += mem_done
        pending_count += len(tasks) - mem_done
        
        progress = int((mem_done / len(tasks) * 100)) if len(tasks) > 0 else 0
        goals.append({
            "title": m.get("title", ""),
            "progress": progress
        })

    if not goals:
        return [{"title": "No data yet", "desc": "Start adding goals to unlock AI behavioral insights."}]

    completion_rate = int((completed_count / total_tasks * 100)) if total_tasks > 0 else 0

    behavior_payload = {
        "completion_rate": completion_rate,
        "completed_tasks": completed_count,
        "pending_tasks": pending_count,
        "goals": goals[:5]  # Only pass top 5 active to reduce context size
    }

    insights = await generate_insights(behavior_payload)
    return insights
