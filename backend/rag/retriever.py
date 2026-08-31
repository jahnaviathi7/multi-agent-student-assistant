from backend.rag.vector_store import collection, embedding_model


def search_documents(query, top_k=3):
    """
    Search the college document vector database
    and return the most relevant chunks.
    """

    # Convert question into an embedding
    query_embedding = embedding_model.encode(
        query
    ).tolist()

    # Search ChromaDB
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    retrieved_documents = []

    for document, metadata in zip(documents, metadatas):
        retrieved_documents.append({
            "text": document,
            "filename": metadata.get("filename", "Unknown"),
            "chunk_id": metadata.get("chunk_id", -1)
        })

    return retrieved_documents