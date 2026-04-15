from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import memory, chat, auth, task
from services.db import memories_collection
from services.email_service import send_task_reminder_email
import asyncio
import datetime
import copy

app = FastAPI(title="AI Memory Vault API")

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


# ── Background accountability cron ──────────────────────────────────────────
async def check_expired_tasks():
    while True:
        try:
            now = datetime.datetime.utcnow().isoformat()
            async for mem in memories_collection.find({"status": "active"}):
                modified      = False
                updated_tasks = copy.deepcopy(mem.get("tasks", []))

                for t in updated_tasks:
                    if not t.get("completed", False) and not t.get("reminder_sent", False):
                        if t.get("deadline", "") < now:
                            mode    = mem.get("mode", "soft")
                            subject = (
                                f"URGENT — {mem.get('title')}"
                                if mode == "strict"
                                else f"Reminder — {mem.get('title')}"
                            )
                            await send_task_reminder_email(mem["user_email"], subject, t["text"])
                            t["reminder_sent"] = True
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
    return {"message": "AI Memory Vault API running 🚀"}