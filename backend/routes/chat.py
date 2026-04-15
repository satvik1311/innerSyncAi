from fastapi import APIRouter, Header, HTTPException
from services.ai_service import generate_response
from services.db import memories_collection, conversations_collection
from services.auth_service import decode_token
import datetime

router = APIRouter()


@router.get("/history")
async def get_history(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user  = decode_token(token)

    history = []
    async for c in conversations_collection.find({"email": user["email"]}).sort("timestamp", -1).limit(50):
        c["_id"] = str(c["_id"])
        history.append(c)
    return history


@router.post("/")
async def chat(data: dict, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user  = decode_token(token)

    message = data.get("message", "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message required")

    # Pull active memories as context for the AI
    goals = []
    async for m in memories_collection.find({"user_email": user["email"], "status": "active"}):
        goals.append(m)

    reply = await generate_response(message, [], goals)

    await conversations_collection.insert_one({
        "email":        user["email"],
        "user_message": message,
        "ai_reply":     reply,
        "timestamp":    datetime.datetime.utcnow().isoformat()
    })

    return {"reply": reply}