import chromadb

from backend.rag.document_loader import load_documents
from backend.rag.text_splitter import split_documents
from backend.rag.embeddings import (
    create_embeddings,
    create_query_embedding,
)


CHROMA_PATH = "data/chroma_db"


# Create ChromaDB client
client = chromadb.PersistentClient(
    path=CHROMA_PATH
)


# Create or load collection
collection = client.get_or_create_collection(
    name="college_documents"
)


def create_vector_database():
    """
    Load college PDFs, split them into chunks,
    create lightweight embeddings and store them
    in ChromaDB.
    """

    print(
        "\n=============================================="
    )
    print(
        "Creating College Document Vector Database"
    )
    print(
        "=============================================="
    )

    documents = load_documents()

    if not documents:

        print("No documents found.")

        return

    chunks = split_documents(
        documents
    )

    if not chunks:

        print("No chunks found.")

        return

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    print(
        f"Creating embeddings for {len(texts)} chunks..."
    )

    embeddings = create_embeddings(
        texts
    )

    if len(embeddings) == 0:

        print("No embeddings created.")

        return

    ids = [
        f"{chunk['filename']}_{chunk['chunk_id']}"
        for chunk in chunks
    ]

    metadatas = [
        {
            "filename": chunk["filename"],
            "chunk_id": chunk["chunk_id"],
        }
        for chunk in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=texts,
        embeddings=embeddings.tolist(),
        metadatas=metadatas,
    )

    print(
        f"Stored {len(chunks)} chunks in ChromaDB."
    )

    print(
        "Vector database creation completed."
    )


def update_vector_database():
    """
    Rebuild/update the college document
    vector database.
    """

    print(
        "\n=============================================="
    )

    print(
        "Updating Vector Database"
    )

    print(
        "=============================================="
    )

    create_vector_database()

    print(
        "Vector database updated successfully."
    )


def get_query_embedding(query: str):
    """
    Create an embedding for the user's query.
    """

    embedding = create_query_embedding(
        query
    )

    return embedding.tolist()