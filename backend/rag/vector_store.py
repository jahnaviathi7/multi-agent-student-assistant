import chromadb
from sentence_transformers import SentenceTransformer

from backend.rag.document_loader import load_documents
from backend.rag.text_splitter import split_documents


CHROMA_PATH = "data/chroma_db"

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = client.get_or_create_collection(
    name="college_documents"
)

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def create_vector_database():

    documents = load_documents()

    if not documents:
        print("No documents found.")
        return

    chunks = split_documents(documents)

    if not chunks:
        print("No chunks found.")
        return

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    embeddings = embedding_model.encode(
        texts
    ).tolist()

    ids = [
        f"{chunk['filename']}_{chunk['chunk_id']}"
        for chunk in chunks
    ]

    metadatas = [
        {
            "filename": chunk["filename"],
            "chunk_id": chunk["chunk_id"]
        }
        for chunk in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print(
        f"Stored {len(chunks)} chunks in ChromaDB."
    )


def update_vector_database():

    print("\nUpdating vector database...")

    create_vector_database()

    print("Vector database updated successfully.")