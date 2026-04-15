from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from services.db import memories_collection
from services.ai_service import generate_memory_tasks
from bson import ObjectId
from services.auth_service import decode_token
import datetime
import uuid

router = APIRouter()


class CreateMemoryRequest(BaseModel):
    title: str
    description: str = ""
    mode: str = "soft"


# POST /memory/create
@router.post("/create")
async def create_memory(req: CreateMemoryRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)
    email = user["email"]

    # Enforce max 3 active memories
    active_count = await memories_collection.count_documents({"user_email": email, "status": "active"})
    if active_count >= 3:
        raise HTTPException(
            status_code=400,
            detail="Maximum of 3 active memories allowed. Complete or delete one first!"
        )

    # AI-generate daily tasks
    tasks_data = await generate_memory_tasks(req.title, req.description)

    processed_tasks = []
    for t in tasks_data:
        processed_tasks.append({
            "id": str(uuid.uuid4()),
            "text": t.get("text", "Task"),
            "completed": False,
            "deadline": t.get(
                "deadline",
                (datetime.datetime.utcnow() + datetime.timedelta(days=1)).isoformat()[:19]
            ),
            "reminder_sent": False
        })

    memory_doc = {
        "user_email": email,
        "title": req.title,
        "description": req.description,
        "mode": req.mode,
        "tasks": processed_tasks,
        "status": "active",
        "created_at": datetime.datetime.utcnow().isoformat()
    }

    result = await memories_collection.insert_one(memory_doc)
    return {"id": str(result.inserted_id), "message": "Memory created successfully"}


# GET /memory/list
@router.get("/list")
async def get_memories(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)

    data = []
    async for mem in memories_collection.find({"user_email": user["email"]}):
        mem["_id"] = str(mem["_id"])
        total = len(mem.get("tasks", []))
        done  = sum(1 for t in mem.get("tasks", []) if t.get("completed", False))
        mem["progress"] = int((done / total * 100)) if total > 0 else 0
        data.append(mem)

    return data


# DELETE /memory/{id}
@router.delete("/{id}")
async def delete_memory(id: str, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)

    result = await memories_collection.delete_one({
        "_id": ObjectId(id),
        "user_email": user["email"]
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Memory not found")

    return {"message": "Deleted"}