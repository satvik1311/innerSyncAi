from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["memory_vault"]

memory_collection = db["memories"]
goals_collection = db["goals"]
conversations_collection = db["conversations"]