from backend.services.llm_service import generate_response

from backend.agents.study_agent import study_agent
from backend.agents.coding_agent import coding_agent
from backend.agents.career_agent import career_agent
from backend.agents.college_agent import college_agent


def classify_question(question: str) -> str:

    prompt = f"""
You are an AI request router for a student assistant.

Choose exactly ONE category:

STUDY
CODING
CAREER
COLLEGE

STUDY:
Academic subjects, concepts, notes and exam preparation.

CODING:
Programming, debugging, algorithms, databases and technical coding.

CAREER:
Jobs, internships, careers, skills, resumes and career planning.

COLLEGE:
College syllabus, academic rules, attendance,
examinations, college documents and regulations.

Student Question:
{question}

Return ONLY one word:
STUDY
CODING
CAREER
or
COLLEGE
"""

    result = generate_response(prompt)

    return result.strip().upper()


def process_question(question: str) -> str:

    category = classify_question(question)

    print(f"\nSelected Agent: {category}")

    if "STUDY" in category:
        return study_agent(question)

    elif "CODING" in category:
        return coding_agent(question)

    elif "CAREER" in category:
        return career_agent(question)

    elif "COLLEGE" in category:
        return college_agent(question)

    else:
        return generate_response(question)