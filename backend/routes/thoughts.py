from fastapi import APIRouter, Header, HTTPException, BackgroundTasks
from pydantic import BaseModel
from services.db import thoughts_collection
from services.auth_service import decode_token
from services.ai_service import process_thought_insight
from services.resonance_service import generate_resonance_graph
from services.personality_service import analyze_user_patterns, update_behavioral_insights
from services.streak_service import update_streak
from services.embedding_service import embedding_service
from services.activity_service import log_activity
import datetime
from typing import List, Optional

router = APIRouter()

class CreateThoughtRequest(BaseModel):
    content: str
    mood: str
    tags: List[str] = []
    goal_id: Optional[str] = None

@router.get("/resonance")
async def get_resonance(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]
    
    return await generate_resonance_graph(email)

@router.post("/")
async def create_thought(req: CreateThoughtRequest, background_tasks: BackgroundTasks, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        token = authorization.split(" ")[1]
        user = decode_token(token)
        email = user["email"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Trigger AI insight generation
    insight = await process_thought_insight(req.content)
    
    # Generate vector embedding for RAG
    embedding = await embedding_service.get_embedding(req.content)
    
    thought_doc = {
        "user_email": email,
        "content": req.content,
        "mood": req.mood,
        "tags": req.tags,
        "goal_id": req.goal_id,
        "created_at": datetime.datetime.utcnow().isoformat(),
        "ai_insight": insight,
        "embedding": embedding
    }

    result = await thoughts_collection.insert_one(thought_doc)
    background_tasks.add_task(analyze_user_patterns, email)
    background_tasks.add_task(update_behavioral_insights, email)
    background_tasks.add_task(update_streak, email)
    # Track activity for nudge system
    background_tasks.add_task(log_activity, email, "thought_added", {
        "mood": req.mood,
        "content_snippet": req.content[:100]
    })
    return {"id": str(result.inserted_id), "message": "Thought captured"}

@router.get("/")
async def get_thoughts(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        token = authorization.split(" ")[1]
        user = decode_token(token)
        email = user["email"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    data = []
    async for thought in thoughts_collection.find({"user_email": email}).sort("created_at", -1):
        thought["_id"] = str(thought["_id"])
        data.append(thought)

    return data
