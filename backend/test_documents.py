from backend.rag.document_loader import load_documents


documents = load_documents()

print("\n==============================")
print("DOCUMENT TEST")
print("==============================")

print("Number of documents:", len(documents))

for document in documents:
    print("\nFile:", document["filename"])
    print("Characters:", len(document["text"]))

    print("\nFirst 500 characters:")
    print(document["text"][:500])

print("\n==============================")