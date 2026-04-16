from fastapi import APIRouter, Header, HTTPException
from services.ai_service import generate_response
from services.db import memories_collection, conversations_collection, users_collection, thoughts_collection, threads_collection
from services.auth_service import decode_token
from services.chat_history_service import get_formatted_history, get_or_create_thread
from services.personality_service import get_user_profile
import datetime

router = APIRouter()

@router.get("/threads")
async def get_threads(authorization: str = Header(None)):
    """Fetches all conversation threads for the user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user  = decode_token(token)

    threads = []
    async for t in threads_collection.find({"email": user["email"]}).sort("last_message_at", -1):
        t["_id"] = str(t["_id"])
        threads.append(t)
    return threads

@router.get("/history/{conversation_id}")
async def get_history(conversation_id: str, authorization: str = Header(None)):
    """Fetches full history for a specific thread."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user  = decode_token(token)

    # Reusing the service logic for consistency
    history = await get_formatted_history(user["email"], conversation_id, limit=50)
    return history

@router.post("/")
async def chat(data: dict, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user  = decode_token(token)

    message = data.get("message", "").strip()
    id_provided = data.get("conversation_id")
    
    if not message:
        raise HTTPException(status_code=400, detail="Message required")

    # 1. Manage Thread & Title
    thread = await get_or_create_thread(user["email"], id_provided, message)
    conv_id = thread["conversation_id"]

    # 2. Fetch Continuity History
    history = await get_formatted_history(user["email"], conv_id)

    # 3. Build Behavioral & Data Context
    goals = []
    async for m in memories_collection.find({"user_email": user["email"], "status": "active"}):
        goals.append(m)

    recent_tasks = []
    completed_count = 0
    total_tasks = 0
    for g in goals:
        tasks = g.get("tasks", [])
        total_tasks += len(tasks)
        for t in tasks:
            recent_tasks.append(t)
            if t.get("completed"): completed_count += 1

    completion_rate = int((completed_count / total_tasks * 100)) if total_tasks > 0 else 0
    
    db_user = await users_collection.find_one({"email": user["email"]})
    prefs = (db_user or {}).get("preferences", {"tone": "Strict", "response_length": "Medium", "focus": "Self-Improvement"})
    
    recent_thoughts = []
    async for t in thoughts_collection.find({"user_email": user["email"]}).sort("created_at", -1).limit(10):
        recent_thoughts.append(t)

    # NEW: Fetch Behavioral Profile
    profile = await get_user_profile(user["email"])

    user_context = {
        "goals": goals,
        "recent_tasks": recent_tasks[:10],
        "recent_thoughts": recent_thoughts,
        "behavioral_profile": profile,
        "stats": {"completion_rate": completion_rate, "total_done": completed_count},
        "preferences": prefs
    }

    # 4. Generate & Append
    # Actually add the current message to history for the AI to see it
    history.append({"role": "user", "content": message})
    
    reply = await generate_response(history, user_context)

    # 5. Store Persistent Context
    await conversations_collection.insert_one({
        "email":        user["email"],
        "conversation_id": conv_id,
        "user_message": message,
        "ai_reply":     reply,
        "timestamp":    datetime.datetime.utcnow().isoformat()
    })

    return {
        "reply": reply, 
        "conversation_id": conv_id, 
        "title": thread.get("title")
    }

@router.delete("/threads/{conversation_id}")
async def delete_thread(conversation_id: str, authorization: str = Header(None)):
    """Deletes a specific thread and its associated messages."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    # Delete both thread meta and messages
    await threads_collection.delete_one({"conversation_id": conversation_id, "email": user["email"]})
    await conversations_collection.delete_many({"conversation_id": conversation_id, "email": user["email"]})
    
    return {"status": "success", "message": "Thread deleted"}

@router.delete("/threads")
async def delete_all_threads(authorization: str = Header(None)):
    """Wipes all conversation data for the user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    await threads_collection.delete_many({"email": user["email"]})
    await conversations_collection.delete_many({"email": user["email"]})
    
    return {"status": "success", "message": "History cleared"}