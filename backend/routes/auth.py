from fastapi import APIRouter, HTTPException
from models.user_model import User
from services.db import db
from services.auth_service import hash_password, verify_password, create_token

router = APIRouter()

users_collection = db["users"]

# 🔹 SIGNUP
@router.post("/signup")
async def signup(user: User):
    try:
        email = user.email.lower()  # normalize email

        existing = await users_collection.find_one({"email": email})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed = hash_password(user.password)

        await users_collection.insert_one({
            "email": email,
            "password": hashed
        })

        return {"message": "User created"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 LOGIN
@router.post("/login")
async def login(user: User):
    try:
        email = user.email.lower()  # normalize email

        db_user = await users_collection.find_one({"email": email})

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Wrong password")

        token = create_token({"email": email})

        return {"token": token}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))