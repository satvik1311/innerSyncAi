from fastapi import APIRouter, Header, HTTPException, BackgroundTasks
from models.user_model import ProfileUpdate, PreferencesUpdate, PasswordUpdate
from services.db import db, memories_collection, conversations_collection, behavior_insights_collection
from services.auth_service import decode_token, hash_password, verify_password
from services.avatar_service import refresh_avatar_state
from services.personality_service import update_behavioral_insights, analyze_user_patterns, generate_ai_nickname
from services.streak_service import get_streak_stats, update_streak
from services.notification_service import manager, create_notification
from fastapi import WebSocket, WebSocketDisconnect
from pydantic import BaseModel

router = APIRouter()
users_collection = db["users"]

@router.get("/profile")
async def get_profile(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    
    try:
        token = authorization.split(" ")[1]
        user_payload = decode_token(token)
        email = user_payload["email"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session")

    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # High-Performance Stats Aggregation (Single scan)
    pipeline = [
        {"$match": {"user_email": email}},
        {
            "$group": {
                "_id": None,
                "total_goals": {"$sum": 1},
                "completed_goals": {
                    "$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}
                },
                "tasks_completed": {
                    "$sum": {
                        "$size": {
                            "$filter": {
                                "input": {"$ifNull": ["$tasks", []]},
                                "as": "t",
                                "cond": {"$eq": ["$$t.completed", True]}
                            }
                        }
                    }
                }
            }
        }
    ]
    cursor = memories_collection.aggregate(pipeline)
    agg_result = await cursor.to_list(length=1)
    stats = agg_result[0] if agg_result else {"total_goals": 0, "completed_goals": 0, "tasks_completed": 0}

    # Sanitize for JSON
    db_user.pop("password", None)
    if "_id" in db_user:
        db_user["_id"] = str(db_user["_id"])

    return {
        **db_user,
        "stats": {
            "total_goals": stats.get("total_goals", 0),
            "completed_goals": stats.get("completed_goals", 0),
            "tasks_completed": stats.get("tasks_completed", 0),
            "streak_count": db_user.get("streak_count", 0)
        }
    }

@router.put("/profile")
async def update_profile(data: ProfileUpdate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    update_fields = {}
    if data.name is not None: update_fields["name"] = data.name
    if data.bio is not None: update_fields["bio"] = data.bio
    if data.username is not None:
        # verify username uniqueness
        existing = await users_collection.find_one({"username": data.username})
        if existing and existing["email"] != email:
            raise HTTPException(status_code=400, detail="Username already taken")
        update_fields["username"] = data.username
    if data.social_links is not None: update_fields["social_links"] = data.social_links
    if data.notifications_enabled is not None: update_fields["notifications_enabled"] = data.notifications_enabled
    if data.gender is not None: update_fields["gender"] = data.gender
    if data.avatar_seed is not None: update_fields["avatar_seed"] = data.avatar_seed
    if data.avatar_style is not None: update_fields["avatar_style"] = data.avatar_style

    if update_fields:
        await users_collection.update_one({"email": email}, {"$set": update_fields})
    
    return {"message": "Profile updated successfully"}

import os
import shutil
from fastapi import UploadFile, File
import uuid

os.makedirs("uploads/avatars", exist_ok=True)

@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(...), authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{file_ext}"
    file_path = f"uploads/avatars/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/uploads/avatars/{filename}"
    await users_collection.update_one({"email": email}, {"$set": {"avatar_url": avatar_url}})

    return {"message": "Avatar uploaded", "avatar_url": avatar_url}

@router.get("/public/{username}")
async def get_public_profile(username: str):
    user = await users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Aggregated Stats
    total_goals = await memories_collection.count_documents({"user_email": user["email"]})
    completed_goals = await memories_collection.count_documents({"user_email": user["email"], "status": "completed"})
    
    return {
        "name": user.get("name"),
        "username": user.get("username"),
        "bio": user.get("bio"),
        "avatar_url": user.get("avatar_url"),
        "social_links": user.get("social_links", {}),
        "join_date": user.get("join_date"),
        "stats": {
            "total_goals": total_goals,
            "completed_goals": completed_goals,
            "streak_count": user.get("streak_count", 0)
        }
    }

@router.put("/preferences")
async def update_preferences(data: PreferencesUpdate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    prefs = db_user.get("preferences", {})
    if data.tone: prefs["tone"] = data.tone
    if data.response_length: prefs["response_length"] = data.response_length
    if data.focus: prefs["focus"] = data.focus

    await users_collection.update_one({"email": email}, {"$set": {"preferences": prefs}})
    return {"message": "Preferences updated successfully", "preferences": prefs}

@router.put("/password")
async def update_password(data: PasswordUpdate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    db_user = await users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.old_password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    new_hashed = hash_password(data.new_password)
    await users_collection.update_one({"email": email}, {"$set": {"password": new_hashed}})
    
    return {"message": "Password updated successfully"}

@router.delete("/")
async def delete_account(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    # Delete everything
    await users_collection.delete_one({"email": email})
    await memories_collection.delete_many({"user_email": email})
    await conversations_collection.delete_many({"email": email})

    return {"message": "Account deeply deleted"}

class AvatarSyncUpdate(BaseModel):
    avatar_seed: str
    avatar_style: str = "adventurer"

@router.put("/avatar_sync")
async def sync_avatar_2d(data: AvatarSyncUpdate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    await users_collection.update_one(
        {"email": email},
        {"$set": {
            "avatar_seed": data.avatar_seed,
            "avatar_style": data.avatar_style
        }}
    )
    
    # Refresh state immediately
    stats = await refresh_avatar_state(email)
    
    return {"message": "2D Avatar synced", "stats": stats}

@router.get("/insights")
async def get_behavioral_insights(background_tasks: BackgroundTasks, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    # Fetch latest stored insights
    insight_doc = await behavior_insights_collection.find_one({"email": email})
    if not insight_doc:
        # Trigger an initial analysis if they have thoughts
        background_tasks.add_task(update_behavioral_insights, email)
        background_tasks.add_task(analyze_user_patterns, email)
        return [] # Return empty for "Gathering data" state
    
    return insight_doc.get("insights", [])

@router.get("/streak")
async def get_streak_route(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]
    
    # Optional: Update nickname if it doesn't exist
    stats = await get_streak_stats(email)
    if stats and stats.get("nickname") == "The Newcomer":
        await generate_ai_nickname(email)
        stats = await get_streak_stats(email)

    return stats

# --- Notifications ---

@router.get("/notifications")
async def get_notifications(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]
    
    notifications = []
    async for n in db.get_collection("notifications").find({"user_email": email}).sort("created_at", -1).limit(50):
        n["_id"] = str(n["_id"])
        notifications.append(n)
    return notifications

@router.post("/notifications/read-all")
async def mark_notifications_read(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]
    
    await db.get_collection("notifications").update_many(
        {"user_email": email, "is_read": False},
        {"$set": {"is_read": True}}
    )
    return {"message": "All notifications marked as read"}

@router.websocket("/ws/notifications/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    try:
        payload = decode_token(token)
        email = payload["email"]
    except Exception:
        await websocket.close(code=4001)
        return

    await manager.connect(websocket, email)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, email)

@router.post("/insights/analyze")
async def post_analyze_insights(background_tasks: BackgroundTasks, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    email = decode_token(token)["email"]

    # Trigger analysis in background to keep UI responsive
    background_tasks.add_task(update_behavioral_insights, email)
    background_tasks.add_task(analyze_user_patterns, email)
    
    return {"message": "Behavioral analysis started in background"}
