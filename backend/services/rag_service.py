from services.db import thoughts_collection, goals_collection
from services.embedding_service import embedding_service

async def vector_search_thoughts(email: str, queryText: str, limit: int = 5):
    """
    Performs a vector search on the thoughts collection.
    NOTE: Requires an Atlas Vector Search index named 'vector_index' on the 'thoughts' collection,
    mapping the 'embedding' field to a vector type with 384 dimensions (cosine similarity).
    """
    try:
        query_vector = await embedding_service.get_embedding(queryText)
        if not query_vector:
            return []

        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": query_vector,
                    "numCandidates": 100,
                    "limit": limit,
                    "filter": {"user_email": email}
                }
            },
            {
                "$project": {
                    "content": 1,
                    "mood": 1,
                    "created_at": 1,
                    "ai_insight": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        results = []
        async for doc in thoughts_collection.aggregate(pipeline):
            results.append(doc)
        return results
    except Exception as e:
        print(f"Vector search error (thoughts): {e}")
        return []

async def vector_search_goals(email: str, queryText: str, limit: int = 3):
    """
    Performs a vector search on the goals collection.
    NOTE: Requires an Atlas Vector Search index named 'vector_index' on the 'goals' collection.
    """
    try:
        query_vector = await embedding_service.get_embedding(queryText)
        if not query_vector:
            return []

        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": query_vector,
                    "numCandidates": 50,
                    "limit": limit,
                    "filter": {"email": email}
                }
            },
            {
                "$project": {
                    "title": 1,
                    "description": 1,
                    "target": 1,
                    "status": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        results = []
        async for doc in goals_collection.aggregate(pipeline):
            results.append(doc)
        return results
    except Exception as e:
        print(f"Vector search error (goals): {e}")
        return []
