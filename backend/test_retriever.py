from backend.rag.retriever import search_documents


query = input(
    "\nEnter your question about the college PDF: "
)

results = search_documents(
    query,
    top_k=3
)

print("\n==============================")
print("RAG SEARCH RESULTS")
print("==============================")

if not results:
    print("No relevant information found.")

else:

    for i, result in enumerate(results, start=1):

        print(f"\n--- Result {i} ---")

        print(
            "File:",
            result["filename"]
        )

        print(
            "Chunk:",
            result["chunk_id"]
        )

        print("\nContent:")

        print(
            result["text"][:1000]
        )

print("\n==============================")