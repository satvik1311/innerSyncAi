from fastapi import APIRouter, Header, HTTPException
from models.memory_model import Memory
from services.db import memory_collection, goals_collection
from bson import ObjectId
from services.auth_service import decode_token

router = APIRouter()

# 🔹 CREATE MEMORY
@router.post("/")
async def create_memory(memory: Memory, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)

    data = memory.dict()
    data["email"] = user["email"]

    result = await memory_collection.insert_one(data)

    # Automatically bump goal progress if linked
    if memory.goal_id:
        try:
            goal_object_id = ObjectId(memory.goal_id)
            goal = await goals_collection.find_one({"_id": goal_object_id, "email": user["email"]})
            if goal:
                current_progress = goal.get("progress", 0)
                new_progress = min(100, current_progress + 10)
                
                update_fields = {}
                update_fields["progress"] = new_progress
                if new_progress == 100:
                    update_fields["status"] = "completed"
                    
                await goals_collection.update_one(
                    {"_id": goal_object_id},
                    {"$set": update_fields}
                )
        except Exception as e:
            print(f"Goal update error: {e}")

    return {"id": str(result.inserted_id)}



# 🔹 GET USER MEMORIES (FIXED 🔥)
@router.get("/")
async def get_memories(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)

    data = []
    async for mem in memory_collection.find({"email": user["email"]}):
        mem["_id"] = str(mem["_id"])
        data.append(mem)

    return data


# 🔹 DELETE MEMORY (SECURE 🔥)
@router.delete("/{id}")
async def delete_memory(id: str, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    token = authorization.split(" ")[1]
    user = decode_token(token)

    result = await memory_collection.delete_one({
        "_id": ObjectId(id),
        "email": user["email"]
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Memory not found")

    return {"message": "Deleted"}