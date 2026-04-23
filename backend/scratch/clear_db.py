from dotenv import load_dotenv
load_dotenv()
import asyncio
from services.db import (
    memories_collection, 
    conversations_collection, 
    thoughts_collection, 
    threads_collection,
    behavior_insights_collection,
    goals_collection,
    users_collection
)

async def clear_data():
    print("Clearing AI memories, thoughts, and chat data...")
    
    # We will NOT delete users_collection so the user doesn't have to re-register
    # We delete everything else to give a fresh start.
    collections = [
        ("memories", memories_collection),
        ("conversations", conversations_collection),
        ("thoughts", thoughts_collection),
        ("threads", threads_collection),
        ("behavior_insights", behavior_insights_collection),
        ("goals", goals_collection)
    ]
    
    for name, col in collections:
        result = await col.delete_many({})
        print(f"Deleted {result.deleted_count} documents from {name}")
        
    # We also might want to reset the user's progress/preferences if needed, but usually just clearing data is enough.
    
    print("Database cleared successfully! You can now start fresh with the AI.")

if __name__ == "__main__":
    asyncio.run(clear_data())
