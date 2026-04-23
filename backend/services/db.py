from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["memory_vault"]

users_collection       = db["users"]
memories_collection    = db["memories"]
conversations_collection = db["conversations"]
thoughts_collection      = db["thoughts"]
threads_collection       = db["threads"]
behavior_insights_collection = db["behavior_insights"]
goals_collection             = db["goals"]
memory_collection            = db["memories"] # alias for backward compatibility in some routes

async def ensure_indexes():
    """Ensures critical indexes are created for performance."""
    try:
        # Users Collection
        await users_collection.create_index("email", unique=True)
        await users_collection.create_index("username", unique=True)
        
        # Memories Collection
        await memories_collection.create_index("user_email")
        await memories_collection.create_index([("user_email", 1), ("status", 1)])
        
        # Thoughts Collection
        if "thoughts" in db.list_collection_names():
            await thoughts_collection.create_index("email")

        # Activity Logs — compound index for nudge analyzer queries
        activity_logs_col = db["activity_logs"]
        await activity_logs_col.create_index([("user_email", 1), ("created_at", -1)])
        await activity_logs_col.create_index([("user_email", 1), ("action_type", 1), ("created_at", -1)])
            
        print("Database indexes verified.")
    except Exception as e:
        print(f"Index check failed: {e}".encode('utf-8', 'replace').decode('utf-8'))