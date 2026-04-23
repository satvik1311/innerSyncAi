from fastembed import TextEmbedding
from typing import List
import asyncio

class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        return cls._instance

    async def get_embedding(self, text: str) -> List[float]:
        """
        Generates a 384-dimensional embedding for the given text.
        Uses run_in_executor to avoid blocking the asyncio event loop,
        since fastembed's embed() is a synchronous CPU-bound call.
        """
        if not text:
            return []
        loop = asyncio.get_event_loop()
        embeddings = await loop.run_in_executor(
            None,
            lambda: list(self._model.embed([text]))
        )
        return embeddings[0].tolist()

# Singleton instance
embedding_service = EmbeddingService()
