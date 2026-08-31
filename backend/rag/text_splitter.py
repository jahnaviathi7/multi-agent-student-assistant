def split_text(text, chunk_size=800, overlap=100):
    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


def split_documents(documents):
    all_chunks = []

    for document in documents:
        chunks = split_text(document["text"])

        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "filename": document["filename"],
                "chunk_id": i,
                "text": chunk
            })

    return all_chunks