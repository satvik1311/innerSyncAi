from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Memory(BaseModel):
    content: str
    mood: str = "neutral"
    tags: List[str] = []
    goal_id: Optional[str] = None
    created_at: datetime = datetime.utcnow()