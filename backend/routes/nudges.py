from fastapi import APIRouter, Header, HTTPException
from services.auth_service import decode_token
from services.db import db
from bson import ObjectId
import datetime

router = APIRouter()
nudges_col = db["nudges"]


@router.get("/")
async def get_nudges(authorization: str = Header(None)):
    """Fetch all nudges for the current user (newest first)."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    nudges = []
    async for n in nudges_col.find(
        {"user_email": user["email"]}
    ).sort("created_at", -1).limit(20):
        n["_id"] = str(n["_id"])
        nudges.append(n)
    return nudges


@router.get("/unread-count")
async def get_unread_count(authorization: str = Header(None)):
    """Returns the count of unread nudges — used by the notification bell badge."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    count = await nudges_col.count_documents({
        "user_email": user["email"],
        "is_read": False
    })
    return {"count": count}


@router.patch("/{nudge_id}/read")
async def mark_nudge_read(nudge_id: str, authorization: str = Header(None)):
    """Mark a specific nudge as read."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    result = await nudges_col.update_one(
        {"_id": ObjectId(nudge_id), "user_email": user["email"]},
        {"$set": {
            "is_read": True,
            "read_at": datetime.datetime.utcnow().isoformat()
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Nudge not found")
    return {"status": "ok"}


@router.patch("/read-all")
async def mark_all_read(authorization: str = Header(None)):
    """Mark all nudges for the user as read."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    token = authorization.split(" ")[1]
    user = decode_token(token)

    await nudges_col.update_many(
        {"user_email": user["email"], "is_read": False},
        {"$set": {
            "is_read": True,
            "read_at": datetime.datetime.utcnow().isoformat()
        }}
    )
    return {"status": "ok"}
