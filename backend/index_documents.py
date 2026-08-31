from backend.rag.document_loader import load_documents
from backend.rag.chunking import split_text
from backend.rag.embeddings import create_embeddings
from backend.rag.vector_store import add_documents


documents = load_documents(
    "data/college_documents"
)

all_chunks = []
metadata = []

for document in documents:

    chunks = split_text(
        document["text"]
    )

    all_chunks.extend(chunks)

    metadata.extend(
        [
            {
                "source": document["filename"]
            }
            for _ in chunks
        ]
    )


print("Total chunks:", len(all_chunks))

embeddings = create_embeddings(
    all_chunks
)

add_documents(
    all_chunks,
    embeddings,
    metadata
)

print("Documents indexed successfully!")