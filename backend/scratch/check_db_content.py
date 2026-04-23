from dotenv import load_dotenv
load_dotenv()
import asyncio
from services.db import thoughts_collection

async def test():
    doc = await thoughts_collection.find_one({"embedding": {"$exists": True}})
    if doc:
        print(f"Content: {doc.get('content')}")
        from services.rag_service import vector_search_thoughts
        res = await vector_search_thoughts(doc.get('user_email'), doc.get('content')[:10])
        print("Search result length:", len(res))
        if len(res) > 0:
            print("Result:", res)

if __name__ == "__main__":
    asyncio.run(test())
