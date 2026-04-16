from typing import List, Dict
from fastapi import WebSocket
import json
import datetime
from services.db import db
from bson import ObjectId

class ConnectionManager:
    def __init__(self):
        # email -> list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, email: str):
        await websocket.accept()
        if email not in self.active_connections:
            self.active_connections[email] = []
        self.active_connections[email].append(websocket)

    def disconnect(self, websocket: WebSocket, email: str):
        if email in self.active_connections:
            self.active_connections[email].remove(websocket)
            if not self.active_connections[email]:
                del self.active_connections[email]

    async def send_personal_message(self, message: dict, email: str):
        if email in self.active_connections:
            for connection in self.active_connections[email]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

async def create_notification(email: str, type: str, message: str, link: str = None):
    """
    Persists a notification and broadcasts it via WebSocket.
    Types: 'task_created', 'task_missed', 'system', 'evolution'
    """
    notifications_collection = db.get_collection("notifications")
    
    notification_doc = {
        "user_email": email,
        "type": type,
        "message": message,
        "link": link,
        "is_read": False,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    result = await notifications_collection.insert_one(notification_doc)
    notification_doc["_id"] = str(result.inserted_id)
    
    # Broadcast to real-time clients
    await manager.send_personal_message({
        "event": "new_notification",
        "data": notification_doc
    }, email)
    
    return notification_doc
