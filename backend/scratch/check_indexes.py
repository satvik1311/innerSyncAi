from dotenv import load_dotenv
load_dotenv()
import asyncio
from services.db import thoughts_collection

async def check_indexes():
    print("Checking indexes on thoughts_collection...")
    try:
        # Atlas vector search indexes are not always shown by list_indexes
        # but let's try listSearchIndexes
        cursor = thoughts_collection.list_search_indexes()
        indexes = await cursor.to_list(length=None)
        print("Search Indexes:", indexes)
    except Exception as e:
        print("Error getting search indexes:", e)
        
    try:
        cursor = thoughts_collection.list_indexes()
        indexes = await cursor.to_list(length=None)
        print("Standard Indexes:", indexes)
    except Exception as e:
        print("Error getting standard indexes:", e)

if __name__ == "__main__":
    asyncio.run(check_indexes())
