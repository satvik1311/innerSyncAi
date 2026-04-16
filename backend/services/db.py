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