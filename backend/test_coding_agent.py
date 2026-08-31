from backend.agents.coding_agent import coding_agent


print("Starting Coding Agent...")

question = """
Explain the difference between a Python list and a tuple.
Give an example of both.
"""

answer = coding_agent(question)

print("\n===== CODING AGENT =====\n")
print(answer)