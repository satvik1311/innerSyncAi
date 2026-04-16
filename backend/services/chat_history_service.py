from services.db import conversations_collection, threads_collection
import datetime
import uuid

async def get_formatted_history(email: str, conversation_id: str, limit: int = 10):
    """Fetches and formats history for a specific conversation thread."""
    if not conversation_id:
        return []

    history = []
    # Find messages for this specific conversation_id
    cursor = conversations_collection.find({
        "email": email,
        "conversation_id": conversation_id
    }).sort("timestamp", 1).limit(limit)

    async for msg in cursor:
        history.append({"role": "user", "content": msg["user_message"]})
        history.append({"role": "assistant", "content": msg["ai_reply"]})
    
    return history

async def get_or_create_thread(email: str, conversation_id: str = None, first_message: str = None):
    """Ensures a thread exists and returns its metadata. Generates title if new."""
    from services.ai_service import generate_thread_title

    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        title = await generate_thread_title(first_message[:200]) if first_message else "New Session"
        
        thread_meta = {
            "conversation_id": conversation_id,
            "email": email,
            "title": title,
            "created_at": datetime.datetime.utcnow().isoformat(),
            "last_message_at": datetime.datetime.utcnow().isoformat()
        }
        await threads_collection.insert_one(thread_meta)
        return thread_meta

    # If it exists, update last_message_at
    thread = await threads_collection.find_one({"conversation_id": conversation_id, "email": email})
    if thread:
        await threads_collection.update_one(
            {"_id": thread["_id"]},
            {"$set": {"last_message_at": datetime.datetime.utcnow().isoformat()}}
        )
        return thread
    
    return None
