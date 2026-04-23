from dotenv import load_dotenv
load_dotenv()
import asyncio
from services.db import thoughts_collection

async def test():
    print("Checking database for thoughts with embeddings...")
    count = await thoughts_collection.count_documents({"embedding": {"$exists": True}})
    print(f"Total thoughts with embeddings: {count}")
    
    doc = await thoughts_collection.find_one({"embedding": {"$exists": True}})
    if doc:
        print(f"Sample user_email: {doc.get('user_email')}")
        from services.rag_service import vector_search_thoughts
        res = await vector_search_thoughts(doc.get('user_email'), 'test query')
        print("Search result length:", len(res))

if __name__ == "__main__":
    asyncio.run(test())
