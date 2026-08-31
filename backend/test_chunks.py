from backend.rag.document_loader import load_documents
from backend.rag.text_splitter import split_documents


documents = load_documents()

chunks = split_documents(documents)

print("\n==============================")
print("CHUNKING TEST")
print("==============================")

print("Documents:", len(documents))
print("Total chunks:", len(chunks))

for chunk in chunks[:3]:
    print("\n------------------------------")
    print("File:", chunk["filename"])
    print("Chunk ID:", chunk["chunk_id"])
    print("Text:")
    print(chunk["text"][:300])

print("\n==============================")