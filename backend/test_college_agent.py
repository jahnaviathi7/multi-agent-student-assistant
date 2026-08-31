from backend.agents.college_agent import college_agent


print("===== COLLEGE KNOWLEDGE AGENT =====")

question = input("\nAsk a question about your college documents: ")

answer = college_agent(question)

print("\n===== ANSWER =====\n")
print(answer)