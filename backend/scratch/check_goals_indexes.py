from dotenv import load_dotenv
load_dotenv()
import asyncio
from services.db import goals_collection

async def check_indexes():
    print("Checking indexes on goals_collection...")
    try:
        cursor = goals_collection.list_search_indexes()
        indexes = await cursor.to_list(length=None)
        print("Search Indexes:", indexes)
    except Exception as e:
        print("Error getting search indexes:", e)

if __name__ == "__main__":
    asyncio.run(check_indexes())
