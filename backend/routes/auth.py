from fastapi import APIRouter, HTTPException, Header
from models.user_model import User
from services.db import db
from services.auth_service import hash_password, verify_password, create_token, decode_token
import datetime
from services.avatar_service import refresh_avatar_state

router = APIRouter()

users_collection = db["users"]

# 🔹 SIGNUP
@router.post("/signup")
async def signup(user: User):
    try:
        email = user.email.lower()

        existing = await users_collection.find_one({"email": email})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed = hash_password(user.password)
        now_iso = datetime.datetime.utcnow().isoformat()[:10]

        import random
        base_username = email.split("@")[0].lower()
        username = base_username
        while await users_collection.find_one({"username": username}):
            username = f"{base_username}{random.randint(10, 9999)}"

        await users_collection.insert_one({
            "email": email,
            "password": hashed,
            "username": username,
            "name": email.split("@")[0].capitalize(),
            "bio": "I'm ready to build my future self.",
            "avatar_url": "",
            "social_links": {"github": "", "twitter": "", "linkedin": "", "website": ""},
            "notifications_enabled": False,
            "join_date": now_iso,
            "last_active_date": now_iso,
            "streak_count": 1,
            "preferences": {
                "tone": "Balanced",
                "response_length": "Medium",
                "focus": "Productivity"
            }
        })

        # Auto-login after signup
        db_user = await users_collection.find_one({"email": email})
        db_user["_id"] = str(db_user["_id"])
        if "password" in db_user:
            del db_user["password"]
            
        token = create_token({"email": email})
        return {"message": "User created", "token": token, "user": db_user}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_me(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")
    
    try:
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        email = payload["email"]
        
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        user["_id"] = str(user["_id"])
        # Remove sensitive data
        if "password" in user:
            del user["password"]
            
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# 🔹 LOGIN
@router.post("/login")
async def login(user: User):
    try:
        email = user.email.lower()
        db_user = await users_collection.find_one({"email": email})

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Wrong password")

        # Update streak logic
        now_date = datetime.datetime.utcnow().date()
        last_active = db_user.get("last_active_date", "")
        streak = db_user.get("streak_count", 0)
        
        try:
            last_dt = datetime.datetime.strptime(last_active, "%Y-%m-%d").date()
            diff = (now_date - last_dt).days
            if diff == 1:
                streak += 1
            elif diff > 1:
                streak = 1
            # if diff == 0, streak remains same
        except:
            streak = 1

        await users_collection.update_one(
            {"_id": db_user["_id"]},
            {"$set": {
                "last_active_date": now_date.isoformat(),
                "streak_count": streak
            }}
        )

        # Refresh Avatar State
        await refresh_avatar_state(email)

        token = create_token({"email": email})
        
        # Prepare user data for frontend session
        db_user["_id"] = str(db_user["_id"])
        if "password" in db_user:
            del db_user["password"]
            
        return {"token": token, "user": db_user}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))