from fastapi import APIRouter, Header, HTTPException
from services.ai_service import generate_response
from services.db import memory_collection, conversations_collection, goals_collection
from services.auth_service import decode_token
import datetime

router = APIRouter()

# 🔹 GET CHAT HISTORY
@router.get("/history")
async def get_history(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    history = []
    async for c in conversations_collection.find({"email": user["email"]}).sort("timestamp", -1):
        c["_id"] = str(c["_id"])
        history.append(c)
    return history

# 🔹 FILTER LOGIC
def filter_memories(user_message, memories):
    keywords = user_message.lower().split()

    relevant = []
    for mem in memories:
        for word in keywords:
            if word in mem["content"].lower():
                relevant.append(mem)
                break

    return relevant[:5]


# 🔹 CHAT API
@router.post("/")
async def chat(data: dict, authorization: str = Header(None)):

    # 🔐 TOKEN CHECK
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)

    # 🧠 MESSAGE CHECK
    message = data.get("message")
    if not message:
        raise HTTPException(status_code=400, detail="Message required")

    # 📦 FETCH USER MEMORIES
    memories = []
    async for m in memory_collection.find({"email": user["email"]}):
        memories.append(m)

    # 🔍 FILTER
    relevant_memories = filter_memories(message, memories)

    # 🔁 FALLBACK (IMPORTANT 🔥)
    if len(relevant_memories) == 0:
        relevant_memories = memories[:3]

    # 🎯 FETCH ACTIVE GOALS FOR AI
    goals = []
    async for g in goals_collection.find({"email": user["email"], "status": {"$ne": "completed"}}):
        goals.append(g)

    # 🤖 AI RESPONSE
    reply = await generate_response(message, relevant_memories, goals)

    # 💾 SAVE CONVERSATION
    await conversations_collection.insert_one({
        "email": user["email"],
        "user_message": message,
        "ai_reply": reply,
        "timestamp": datetime.datetime.utcnow().isoformat()
    })

    return {"reply": reply}