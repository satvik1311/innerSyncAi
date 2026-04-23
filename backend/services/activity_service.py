import datetime
from services.db import db

activity_logs_col = db["activity_logs"]

async def log_activity(email: str, action_type: str, metadata: dict = {}):
    """
    Call this after any meaningful user action to feed the nudge analyzer.

    action_type options:
        'thought_added'   — user captured a new thought
        'chat_sent'       — user sent a message in Future Self chat
        'task_completed'  — user marked a task as done
        'goal_created'    — user created a new goal/memory
        'login'           — user authenticated (call from auth route if desired)
    """
    await activity_logs_col.insert_one({
        "user_email": email,
        "action_type": action_type,
        "metadata": metadata,
        "created_at": datetime.datetime.utcnow().isoformat()
    })
