import os
import chromadb
import ollama

# ✅ absolute path — works regardless of where you run from
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_client = chromadb.PersistentClient(path="../chroma_db")
_collection = _client.get_collection(name="portfolio")
_ollama_client = ollama.Client()

def retrieve(query):

    # ✅ use newer embed() API — faster than embeddings()
    embedding = _ollama_client.embed(
        model="nomic-embed-text",
        input=query
    )["embeddings"][0]

    results = _collection.query(
        query_embeddings=[embedding],
        n_results=3
    )

    return "\n\n".join(results["documents"][0])