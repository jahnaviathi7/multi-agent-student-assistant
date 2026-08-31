from backend.agents.orchestrator import process_question


print("===== MULTI-AGENT STUDENT ASSISTANT =====")

question = input("\nAsk your question: ")

answer = process_question(question)

print("\n===== AI RESPONSE =====\n")
print(answer)
