from backend.rag.retriever import search_documents
from backend.services.llm_service import generate_response


def college_agent(question: str):

    # 1. Search the uploaded college PDFs
    results = search_documents(
        question,
        top_k=3
    )

    # 2. Check whether information was found
    if not results:
        return (
            "I could not find relevant information "
            "in the uploaded college documents."
        )

    # 3. Build context from retrieved chunks
    context_parts = []

    for result in results:

        context_parts.append(
            f"Source: {result['filename']}\n"
            f"Content:\n{result['text']}"
        )

    context = "\n\n---\n\n".join(
        context_parts
    )

    # 4. Create prompt for Gemini
    prompt = f"""
You are a College Study Assistant.

Answer the student's question using the
provided college document context.

Rules:
1. Use the document context as the primary source.
2. Do not invent information that is not supported
   by the documents.
3. If the answer is not available in the documents,
   clearly say that it was not found.
4. Explain the answer in simple language.
5. Mention the source document when appropriate.

COLLEGE DOCUMENT CONTEXT:
{context}

STUDENT QUESTION:
{question}

Give a clear and useful answer.
"""

    # 5. Send the prompt to Gemini
    answer = generate_response(prompt)

    return answer