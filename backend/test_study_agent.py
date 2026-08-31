from backend.agents.study_agent import study_agent


question = "Explain Operating System and its main functions."

answer = study_agent(question)

print("\n===== STUDY AGENT =====\n")
print("Starting Study Agent...")
print(answer)