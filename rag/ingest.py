import os
import chromadb
import ollama

from chunker import chunk_text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

client = chromadb.PersistentClient(
    path=os.path.join(BASE_DIR, "chroma_db")
)

collection = client.get_or_create_collection(
    name="portfolio"
)

KNOWLEDGE_FOLDER = os.path.join(BASE_DIR, "knowledge")

for filename in os.listdir(KNOWLEDGE_FOLDER):

    filepath = os.path.join(KNOWLEDGE_FOLDER, filename)

    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text)

    for i, chunk in enumerate(chunks):

        response = ollama.embed(
            model="nomic-embed-text",
            input=chunk
        )

        embedding = response["embeddings"][0]

        collection.add(
            ids=[f"{filename}_{i}"],
            embeddings=[embedding],
            documents=[chunk]
        )

print("Knowledge Base Created Successfully")