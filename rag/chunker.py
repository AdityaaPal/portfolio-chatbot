def chunk_text(text, chunk_size=300, overlap=50):
    """
    Smaller chunks for small .md files.
    300 chars fits one topic section cleanly.
    50 char overlap is enough for context continuity.
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end].strip())
        start += chunk_size - overlap

    # ✅ filter out empty/tiny chunks from overlap artifacts
    return [c for c in chunks if len(c) > 30]