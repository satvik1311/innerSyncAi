from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

os.makedirs("uploads/avatars", exist_ok=True)
from routes import memory, chat, auth, task, user, thoughts, achievements, goals, insights
from services.db import memories_collection
from services.email_service import send_task_reminder_email
from services.notification_service import create_notification
import asyncio
import datetime
import copy

app = FastAPI(title="InnerSync AI Engine")

# ── CORS (must be added before routes) ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,   prefix="/auth",   tags=["Auth"])
app.include_router(memory.router, prefix="/memory", tags=["Memory"])
app.include_router(task.router,   prefix="/task",   tags=["Tasks"])
app.include_router(chat.router,   prefix="/chat",   tags=["Chat"])
app.include_router(user.router,   prefix="/user",   tags=["User"])
app.include_router(thoughts.router, prefix="/thoughts", tags=["Thoughts"])
app.include_router(achievements.router, prefix="/achievements", tags=["Achievements"])
app.include_router(goals.router, prefix="/goals", tags=["Goals"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ── Background accountability cron ──────────────────────────────────────────
async def check_expired_tasks():
    while True:
        try:
            now_dt = datetime.datetime.utcnow()
            now_str = now_dt.isoformat()

            async for mem in memories_collection.find({"status": "active"}):
                modified = False
                updated_tasks = copy.deepcopy(mem.get("tasks", []))

                for t in updated_tasks:
                    # Skip if completed
                    if t.get("completed", False):
                        continue

                    deadline = t.get("deadline", "")
                    if deadline and deadline < now_str:
                        last_notified = t.get("last_notified_at") # ISO String
                        
                        should_notify = False
                        if not last_notified:
                            should_notify = True
                        else:
                            last_notified_dt = datetime.datetime.fromisoformat(last_notified)
                            if (now_dt - last_notified_dt).total_seconds() >= 86400: # 24 hours
                                should_notify = True

                        if should_notify:
                            mode = mem.get("mode", "soft")
                            subject = f"URGENT — {mem.get('title')}" if mode == "strict" else f"Reminder — {mem.get('title')}"
                            
                            # 1. Send Email
                            await send_task_reminder_email(mem["user_email"], mem.get("title", "Goal"), t["text"])
                            
                            # 2. Trigger UI Notification
                            await create_notification(
                                email=mem["user_email"],
                                type="task_missed",
                                message=f"Missed deadline: {t['text']} (Goal: {mem['title']})",
                                link=f"/dashboard/roadmap"
                            )
                            
                            # 3. Update Timestamp
                            t["last_notified_at"] = now_str
                            t["reminder_sent"] = True # Backward compatibility
                            modified = True

                if modified:
                    await memories_collection.update_one(
                        {"_id": mem["_id"]},
                        {"$set": {"tasks": updated_tasks}}
                    )
        except Exception as e:
            print(f"Cron error: {e}")

        await asyncio.sleep(60)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(check_expired_tasks())


@app.get("/")
def home():
    return {"message": "InnerSync AI Engine Online 🚀"}