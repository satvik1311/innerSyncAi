from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from services.db import memories_collection
from services.auth_service import decode_token
from bson import ObjectId
import datetime
import copy

router = APIRouter()


# GET /task/today  — tasks due today or overdue
@router.get("/today")
async def get_todays_tasks(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user  = decode_token(token)

    today = datetime.datetime.utcnow().date()
    result = []

    async for mem in memories_collection.find({"user_email": user["email"], "status": "active"}):
        for task in mem.get("tasks", []):
            if task.get("completed", False):
                continue
            deadline_str = task.get("deadline", "")
            if not deadline_str:
                continue
            try:
                deadline_date = datetime.datetime.fromisoformat(deadline_str).date()
                if deadline_date <= today:
                    result.append({
                        "memory_id":    str(mem["_id"]),
                        "memory_title": mem.get("title", "Memory"),
                        **task
                    })
            except ValueError:
                pass

    return result


# GET /task/old  — completed tasks
@router.get("/old")
async def get_old_tasks(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user  = decode_token(token)

    result = []
    async for mem in memories_collection.find({"user_email": user["email"]}):
        for task in mem.get("tasks", []):
            if task.get("completed", False):
                result.append({
                    "memory_id":    str(mem["_id"]),
                    "memory_title": mem.get("title", "Memory"),
                    **task
                })
    return result

class CompleteTaskRequest(BaseModel):
    memory_id: str
    task_id:   str


# POST /task/complete
@router.post("/complete")
async def complete_task(req: CompleteTaskRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user  = decode_token(token)

    mem = await memories_collection.find_one({
        "_id": ObjectId(req.memory_id),
        "user_email": user["email"]
    })
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")

    tasks = copy.deepcopy(mem.get("tasks", []))
    found = False
    for task in tasks:
        if task.get("id") == req.task_id:
            task["completed"] = True
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail="Task not found")

    done       = sum(1 for t in tasks if t.get("completed", False))
    new_status = "completed" if done == len(tasks) else "active"

    await memories_collection.update_one(
        {"_id": ObjectId(req.memory_id)},
        {"$set": {"tasks": tasks, "status": new_status}}
    )

    return {"message": "Task completed", "memory_status": new_status}
