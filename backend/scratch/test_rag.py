from dotenv import load_dotenv
load_dotenv()
import asyncio
from services.rag_service import vector_search_thoughts

async def test():
    print("Testing vector_search_thoughts...")
    res = await vector_search_thoughts('test@example.com', 'testing rag memory')
    print("Result:", res)

if __name__ == "__main__":
    asyncio.run(test())
