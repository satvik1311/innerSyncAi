from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import memory, chat, auth, goals, insights
from services.db import goals_collection
from services.email_service import send_goal_failure_email, send_task_reminder_email
import asyncio
import datetime
import copy



app = FastAPI()
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(memory.router, prefix="/memory")
app.include_router(chat.router, prefix="/chat")
app.include_router(goals.router, prefix="/goals", tags=["Goals"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

async def check_expired_goals():
    while True:
        try:
            now = datetime.datetime.utcnow().isoformat()
            
            async for goal in goals_collection.find({"status": "in_progress"}):
                modified = False
                updated_roadmap = copy.deepcopy(goal.get("roadmap", []))

                # Check deeply for subtasks
                for task in updated_roadmap:
                    if not task.get("completed", False) and not task.get("reminder_sent", False):
                        t_deadline = task.get("deadline", "")
                        if t_deadline and t_deadline < now:
                            await send_task_reminder_email(goal["email"], goal["title"], task["text"])
                            task["reminder_sent"] = True
                            modified = True
                
                # Check Master Goal
                g_deadline = goal.get("deadline", "")
                if g_deadline and g_deadline < now:
                    await goals_collection.update_one(
                        {"_id": goal["_id"]}, 
                        {"$set": {"status": "failed", "roadmap": updated_roadmap}}
                    )
                    await send_goal_failure_email(goal["email"], goal["title"])
                elif modified:
                    # Update roadmap only
                    await goals_collection.update_one(
                        {"_id": goal["_id"]}, 
                        {"$set": {"roadmap": updated_roadmap}}
                    )
                
        except Exception as e:
            print(f"Cron error checking expired goals: {e}")
            
        # Sleep for 60 seconds before next sweep
        await asyncio.sleep(60)

@app.on_event("startup")
async def startup_event():
    # Trigger the cron job to run indefinitely in the background
    asyncio.create_task(check_expired_goals())

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}