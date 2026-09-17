# 🤖 Multi-Agent Student Assistant

An AI-powered student assistance platform designed to provide
personalized support for **Study, Career, and College-related queries**.

The system uses multiple AI agents with a modern React frontend
and FastAPI backend.

---

## 🚀 Features

### 📚 Study Agent
- Subject explanations
- Concept clarification
- Exam preparation
- Study guidance
- Learning assistance

### 💼 Career Agent
- Resume guidance
- Interview preparation
- Job guidance
- Skill recommendations
- Career planning

### 🎓 College Agent
- College-related questions
- Syllabus assistance
- Academic information
- College document queries
- PDF-based knowledge assistance

### 🔐 User Authentication
- User registration
- Secure login
- Logout
- Protected application flow

### 📄 PDF Document Support
- Upload college PDF documents
- Store documents in the project
- Process documents for AI/RAG assistance

### 📊 Student Dashboard
- Total questions
- Study conversations
- Career conversations
- College conversations
- Uploaded documents

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │    Student User     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │    Neon UI          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    FastAPI API      │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │  Study   │   │  Career  │   │ College  │
       │  Agent   │   │  Agent   │   │  Agent   │
       └──────────┘   └──────────┘   └─────┬────┘
                                            │
                                            ▼
                                      ┌────────────┐
                                      │ RAG / PDF  │
                                      │ Knowledge  │
                                      └────────────┘
---

**Paste this below it:**

```markdown
---

## 🛠️ Technologies Used

### Frontend
- React
- TypeScript
- Vite
- HTML5
- CSS3

### Backend
- Python
- FastAPI
- Pydantic
- Uvicorn

### AI Technologies
- Generative AI
- Gemini AI
- Multi-Agent Architecture
- Retrieval-Augmented Generation (RAG)
- Vector Database

### Database & Storage
- SQLite
- ChromaDB
- PDF Document Storage

### Development Tools
- Visual Studio Code
- Git
- GitHub
- npm
- Python Virtual Environment

---

## 📁 Project Structure

```text
multi-agent-student-assistant/
│
├── backend/
│   ├── agents/
│   │   ├── study_agent.py
│   │   ├── career_agent.py
│   │   └── college_agent.py
│   │
│   ├── rag/
│   │   └── vector_store.py
│   │
│   ├── auth.py
│   ├── auth_routes.py
│   └── main.py
│
├── data/
│   └── college_documents/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── screenshots/
│   ├── dashboard.png
│   ├── study-agent.png
│   ├── career-agent.png
│   ├── college-agent.png
│   └── pdf-upload.png
│
├── .gitignore
├── README.md
├── requirements.txt
└── .env