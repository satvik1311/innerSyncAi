from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field
from services.db import goals_collection, memory_collection
from services.auth_service import decode_token
from services.ai_service import generate_goal_roadmap
from services.embedding_service import embedding_service
from bson import ObjectId
import datetime
import uuid

router = APIRouter()


class CreateGoalRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field("", max_length=1000)
    target: str = Field("", max_length=500)
    deadline: str = ""

@router.post("/")
async def create_goal(data: CreateGoalRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    title       = data.title
    deadline    = data.deadline
    target      = data.target
    description = data.description

    # Always generate a roadmap, even if no deadline is strictly given, it's nice to have.
    roadmap = await generate_goal_roadmap(title, target, description, deadline)

    # ensure IDs if AI missed it
    for i, t in enumerate(roadmap):
        if "id" not in t:
            t["id"] = str(uuid.uuid4())
        if "completed" not in t:
            t["completed"] = False

    # Generate semantic embedding for the goal
    embedding = await embedding_service.get_embedding(f"{title}: {description}")

    goal = {
        "email": user["email"],
        "title": title,
        "description": description,
        "target": target,
        "deadline": deadline,
        "roadmap": roadmap,
        "progress": 0,
        "status": "in_progress",
        "created_at": datetime.datetime.utcnow().isoformat(),
        "embedding": embedding
    }

    res = await goals_collection.insert_one(goal)
    return {"message": "Goal created", "id": str(res.inserted_id)}

@router.get("/")
async def get_goals(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    # Single aggregation query — avoids N+1 count_documents calls
    pipeline = [
        {"$match": {"email": user["email"]}},
        {"$lookup": {
            "from": "memories",
            "localField": "_id",
            "foreignField": "goal_id",
            "as": "_linked"
        }},
        {"$addFields": {"linked_memories_count": {"$size": "$_linked"}}},
        {"$project": {"_linked": 0, "embedding": 0}}  # drop heavy/internal fields
    ]
    goals = []
    async for g in goals_collection.aggregate(pipeline):
        g["_id"] = str(g["_id"])
        goals.append(g)
    return goals

@router.put("/{goal_id}")
async def update_goal(goal_id: str, data: dict, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)
    
    update_data = {}
    if "status" in data: update_data["status"] = data["status"]
    if "title" in data: update_data["title"] = data["title"]
    if "description" in data: update_data["description"] = data["description"]
    if "target" in data: update_data["target"] = data["target"]
    if "progress" in data: update_data["progress"] = data["progress"]
    if "deadline" in data: update_data["deadline"] = data["deadline"]
    if "roadmap" in data: update_data["roadmap"] = data["roadmap"]
    
    if not update_data:
        return {"message": "No fields to update"}

    await goals_collection.update_one({"_id": ObjectId(goal_id), "email": user["email"]}, {"$set": update_data})
    
    # Check if all roadmap tasks are done and it has roadmap > 0 length
    if "roadmap" in data and len(data["roadmap"]) > 0:
        all_done = all(t.get("completed", False) for t in data["roadmap"])
        if all_done:
            await goals_collection.update_one({"_id": ObjectId(goal_id), "email": user["email"]}, {"$set": {"status": "completed", "progress": 100}})
            
    return {"message": "Goal updated"}

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    result = await goals_collection.delete_one({"_id": ObjectId(goal_id), "email": user["email"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")

    return {"message": "Goal deleted"}
