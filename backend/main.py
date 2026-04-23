from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

os.makedirs("uploads/avatars", exist_ok=True)
from routes import memory, chat, auth, task, user, thoughts, achievements, goals, insights, nudges
from services.db import memories_collection
from services.email_service import send_task_reminder_email, send_nudge_email
from services.notification_service import create_notification
from services.nudge_analyzer import analyze_user
from services.ai_service import generate_nudge
from services.db import db
import asyncio
import datetime
import copy

app = FastAPI(title="InnerSync Engine")

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
app.include_router(nudges.router, prefix="/nudges", tags=["Nudges"])

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
    from services.db import ensure_indexes
    await ensure_indexes()
    asyncio.create_task(check_expired_tasks())
    asyncio.create_task(run_nudge_pipeline())


# ── Nudge Pipeline Cron ───────────────────────────────────────────────────────
#
# DELIVERY RULES:
#   - ALWAYS:  Store nudge + create in-app notification (user sees it next login)
#   - EMAIL:   Only send email for 'inactivity_3d' — because that's the ONLY
#              pattern where the user is confirmed NOT to be looking at the app.
#              Sending email for mood/goal patterns would be redundant since the
#              user IS active and will see the in-app notification.
#
# SCHEMA: nudge document fields
#   user_email, trigger, nudge_text, is_read, read_at,
#   delivery_type ("notification" | "email" | "both"),
#   sent_notification (bool), sent_email (bool), created_at
#
async def _dispatch_nudge(email: str, pattern: str, nudge_text: str, nudges_col) -> None:
    """
    Core delivery orchestrator. Single nudge text is reused for all channels.
    Decides channels based on the behavioral pattern.
    """
    now = datetime.datetime.utcnow().isoformat()

    # ── Determine delivery channels ──────────────────────────────────────────
    # inactivity = user is NOT online → email is the only guaranteed way to reach them
    # mood/goal  = user IS active → in-app is sufficient, email would be spam
    EMAIL_PATTERNS = {"inactivity_3d"}
    send_email      = pattern in EMAIL_PATTERNS
    delivery_type   = "both" if send_email else "notification"

    # ── 1. Persist nudge with full delivery metadata ─────────────────────────
    preview = nudge_text[:100] + ("..." if len(nudge_text) > 100 else "")
    result = await nudges_col.insert_one({
        "user_email":          email,
        "trigger":             pattern,
        "nudge_text":          nudge_text,
        "is_read":             False,
        "read_at":             None,
        "delivery_type":       delivery_type,
        "sent_notification":   True,   # We always create an in-app notification
        "sent_email":          False,   # Updated below if email is dispatched
        "created_at":          now
    })
    nudge_id = result.inserted_id

    # ── 2. In-app notification (ALWAYS) ──────────────────────────────────────
    await create_notification(
        email=email,
        type="nudge",
        message=preview,
        link="/dashboard/nudges"
    )

    # ── 3. Email (ONLY for inactivity) ───────────────────────────────────────
    if send_email:
        try:
            await send_nudge_email(email, nudge_text)
            # Update sent_email flag to True after successful dispatch
            await nudges_col.update_one(
                {"_id": nudge_id},
                {"$set": {"sent_email": True}}
            )
            print(f"[NUDGE] Email sent  → {email} | pattern: {pattern}")
        except Exception as e:
            print(f"[NUDGE] Email FAILED → {email} | {e}")
    else:
        print(f"[NUDGE] In-app only → {email} | pattern: {pattern} (user is active, skipping email)")


async def run_nudge_pipeline():
    """
    Runs daily. Scans all users active in the last 30 days.
    Rate limit: max 1 nudge per user per day (enforced by nudge_analyzer cooldown).
    """
    activity_logs_col = db["activity_logs"]
    nudges_col        = db["nudges"]

    while True:
        try:
            print("[NUDGE CRON] Starting daily analysis...")
            cutoff_30d = (datetime.datetime.utcnow() - datetime.timedelta(days=30)).isoformat()

            # Fetch all users seen in the last 30 days
            emails = await activity_logs_col.distinct("user_email", {"created_at": {"$gte": cutoff_30d}})
            print(f"[NUDGE CRON] Scanning {len(emails)} users...")

            for email in emails:
                # analyze_user() has built-in NUDGE_COOLDOWN_HOURS = 24 deduplication
                # → max 1 nudge per pattern per day. Multiple patterns can trigger,
                # but in practice only 1-2 will per day since thresholds differ.
                patterns = await analyze_user(email)

                # Global daily cap: if user already received ANY nudge today, skip
                today_start = datetime.datetime.utcnow().replace(
                    hour=0, minute=0, second=0, microsecond=0
                ).isoformat()
                todays_nudges = await nudges_col.count_documents({
                    "user_email": email,
                    "created_at": {"$gte": today_start}
                })

                if todays_nudges > 0:
                    print(f"[NUDGE CRON] Skipping {email} — already nudged today")
                    continue

                # Take only the highest-priority pattern if multiple triggered
                # Priority: inactivity > negative_streak > goal_avoidance
                PRIORITY = ["inactivity_3d", "negative_streak", "goal_avoidance"]
                patterns.sort(key=lambda x: PRIORITY.index(x["pattern"]) if x["pattern"] in PRIORITY else 99)

                if patterns:
                    top = patterns[0]
                    nudge_text = await generate_nudge(top["pattern"], top["context"])
                    await _dispatch_nudge(email, top["pattern"], nudge_text, nudges_col)

        except Exception as e:
            print(f"[NUDGE CRON ERROR] {e}")

        await asyncio.sleep(86400)  # Run once every 24 hours




@app.get("/")
def home():
    return {"message": "InnerSync Engine Online 🚀"}