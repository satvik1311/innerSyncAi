from services.db import thoughts_collection
from services.ai_service import client
import json
import datetime

async def generate_resonance_graph(email: str):
    """
    Fetches thoughts and clusters them semantically using AI.
    Returns nodes and links for force-directed graph.
    """
    try:
        thoughts = []
        async for t in thoughts_collection.find({"user_email": email}).sort("created_at", -1).limit(50):
            thoughts.append({
                "id": str(t["_id"]),
                "content": t.get("content", ""),
                "mood": t.get("mood", "neutral"),
                "tags": t.get("tags", []),
                "date": t.get("created_at")[:10]
            })

        if not thoughts:
            return {"nodes": [], "links": []}

        # AI prompt for semantic clustering
        system_prompt = """You are a neural mapping engine. 
        Cluster thoughts into 3-6 distinct "Cognitive Clusters".
        
        [FORMAT]
        Return ONLY valid JSON:
        {
          "clusters": [{"id": "c1", "name": "...", "description": "..."}],
          "assignments": [{"thought_id": "...", "cluster_id": "c1", "resonance_reason": "..."}],
          "links": [{"source": "...", "target": "...", "strength": 0.5}]
        }
        """
        
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Thoughts: {json.dumps(thoughts)}"}
            ],
            timeout=20  # Prevent hanging
        )
        
        map_data = json.loads(res.choices[0].message.content)
        
        # Prepare final structure
        node_ids = {t["id"] for t in thoughts}
        nodes = []
        cluster_map = {c["id"]: c for c in map_data.get("clusters", [])}
        
        for t in thoughts:
            assignment = next((a for a in map_data.get("assignments", []) if a["thought_id"] == t["id"]), None)
            cluster_id = assignment["cluster_id"] if assignment else "unknown"
            reason = assignment["resonance_reason"] if assignment else "Semantic resonance detected in this thought cluster."
            
            nodes.append({
                "id": t["id"],
                "label": t["content"][:30] + "...",
                "full_text": t["content"],
                "mood": t["mood"],
                "cluster": cluster_id,
                "cluster_name": cluster_map.get(cluster_id, {}).get("name", "Subconscious Thread"),
                "resonance_reason": reason,
                "val": 5
            })

        # Sanitize links: ensure both nodes exist
        raw_links = map_data.get("links", [])
        sanitized_links = [
            link for link in raw_links 
            if str(link.get("source")) in node_ids and str(link.get("target")) in node_ids
        ]

        return {
            "nodes": nodes,
            "links": sanitized_links,
            "clusters": map_data.get("clusters", [])
        }

    except Exception as e:
        print(f"Resonance Error: {e}")
        return {"nodes": [], "links": []}
