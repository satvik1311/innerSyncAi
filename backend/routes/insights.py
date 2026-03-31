from fastapi import APIRouter, Header, HTTPException
from services.ai_service import generate_insights
from services.db import memory_collection
from services.auth_service import decode_token

router = APIRouter()

@router.get("/")
async def get_insights(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    memories = []
    # get last 10 memories
    async for m in memory_collection.find({"email": user["email"]}).sort("_id", -1).limit(10):
        memories.append(m)

    if not memories:
        return [{"title": "No memories yet", "desc": "Start writing to get insights."}]

    insights = await generate_insights(memories)
    return insights
