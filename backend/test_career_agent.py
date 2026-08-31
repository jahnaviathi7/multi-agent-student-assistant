from backend.agents.career_agent import career_agent


print("Starting Career Agent...")

question = """
I know Python, SQL and basic machine learning.
I am interested in AI.
What career should I choose and what skills should I learn?
"""

answer = career_agent(question)

print("\n===== CAREER AGENT =====\n")
print(answer)