from backend.services.llm_service import generate_response

question = "Explain Artificial Intelligence in simple words."

answer = generate_response(question)

print("\nAI Response:")
print(answer)