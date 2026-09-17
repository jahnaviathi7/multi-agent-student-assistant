from backend.rag.vector_store import (
    collection,
    get_query_embedding,
)


def search_documents(
    query,
    top_k=3
):
    """
    Search the college document vector
    database and return the most relevant
    document chunks.
    """

    try:

        # Create query embedding
        query_embedding = get_query_embedding(
            query
        )

        # Check collection
        count = collection.count()

        if count == 0:

            print(
                "College document collection is empty."
            )

            return []

        # Search ChromaDB
        results = collection.query(
            query_embeddings=[
                query_embedding
            ],
            n_results=min(
                top_k,
                count
            ),
        )

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        retrieved_documents = []

        for document, metadata in zip(
            documents,
            metadatas
        ):

            metadata = metadata or {}

            retrieved_documents.append(
                {
                    "text": document,
                    "filename": metadata.get(
                        "filename",
                        "Unknown"
                    ),
                    "chunk_id": metadata.get(
                        "chunk_id",
                        -1
                    ),
                }
            )

        return retrieved_documents

    except Exception as error:

        print(
            f"Document search error: {error}"
        )

        return []