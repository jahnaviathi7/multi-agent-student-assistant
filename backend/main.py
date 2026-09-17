from pathlib import Path
import shutil
import traceback

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.agents.study_agent import study_agent
from backend.agents.career_agent import career_agent
from backend.agents.college_agent import college_agent

from backend.auth import init_auth_database
from backend.auth_routes import router as auth_router


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Multi-Agent Student Assistant",
    description=(
        "AI Student Assistant with Study, Career "
        "and College RAG Agents"
    ),
    version="1.0.0",
)


# ============================================================
# AUTHENTICATION DATABASE
# ============================================================

init_auth_database()

# Add authentication routes
app.include_router(auth_router)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ChatRequest(BaseModel):
    message: str


# ============================================================
# ROOT
# ============================================================

@app.get("/")
async def root():
    return {
        "message": "Multi-Agent Student Assistant API is running",
        "status": "online",
    }


# ============================================================
# STUDY AGENT
# ============================================================

@app.post("/study")
async def study(request: ChatRequest):

    try:

        print("\n================ STUDY AGENT ================")
        print("Question:", request.message)

        result = study_agent(request.message)

        print("Study response generated.")

        return {
            "question": request.message,
            "agent": "study",
            "answer": result,
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "question": request.message,
            "agent": "study",
            "answer": f"Study agent error: {str(e)}",
        }


# ============================================================
# CAREER AGENT
# ============================================================

@app.post("/career")
async def career(request: ChatRequest):

    try:

        print("\n================ CAREER AGENT ================")
        print("Question:", request.message)

        result = career_agent(request.message)

        print("Career response generated.")

        return {
            "question": request.message,
            "agent": "career",
            "answer": result,
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "question": request.message,
            "agent": "career",
            "answer": f"Career agent error: {str(e)}",
        }


# ============================================================
# COLLEGE / RAG AGENT
# ============================================================

@app.post("/college")
async def college(request: ChatRequest):

    try:

        print("\n================ COLLEGE AGENT ================")
        print("Question:", request.message)

        result = college_agent(request.message)

        print("College response generated.")

        return {
            "question": request.message,
            "agent": "college",
            "answer": result,
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "question": request.message,
            "agent": "college",
            "answer": f"College agent error: {str(e)}",
        }


# ============================================================
# CHAT
# ============================================================

@app.post("/chat")
async def chat(request: ChatRequest):

    try:

        message = request.message.lower()

        # ----------------------------------------------------
        # CAREER ROUTING
        # ----------------------------------------------------

        if any(
            word in message
            for word in [
                "career",
                "job",
                "skills",
                "resume",
                "interview",
                "ai engineer",
            ]
        ):

            result = career_agent(request.message)

            return {
                "question": request.message,
                "agent": "career",
                "answer": result,
            }

        # ----------------------------------------------------
        # COLLEGE ROUTING
        # ----------------------------------------------------

        elif any(
            word in message
            for word in [
                "college",
                "chapter",
                "syllabus",
                "notes",
                "subject",
                "document",
                "pdf",
            ]
        ):

            result = college_agent(request.message)

            return {
                "question": request.message,
                "agent": "college",
                "answer": result,
            }

        # ----------------------------------------------------
        # STUDY ROUTING
        # ----------------------------------------------------

        else:

            result = study_agent(request.message)

            return {
                "question": request.message,
                "agent": "study",
                "answer": result,
            }

    except Exception as e:

        traceback.print_exc()

        return {
            "question": request.message,
            "agent": "chat",
            "answer": f"Chat error: {str(e)}",
        }


# ============================================================
# PDF UPLOAD
# ============================================================

@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        # ----------------------------------------------------
        # PROJECT ROOT
        # ----------------------------------------------------

        project_root = (
            Path(__file__).resolve().parent.parent
        )

        # ----------------------------------------------------
        # PDF DIRECTORY
        # ----------------------------------------------------

        documents_dir = (
            project_root
            / "data"
            / "college_documents"
        )

        documents_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ----------------------------------------------------
        # FILE VALIDATION
        # ----------------------------------------------------

        if not file.filename:

            return {
                "success": False,
                "message": "No file selected.",
            }

        if not file.filename.lower().endswith(".pdf"):

            return {
                "success": False,
                "message": "Only PDF files are allowed.",
            }

        # ----------------------------------------------------
        # SAVE PDF
        # ----------------------------------------------------

        file_path = documents_dir / file.filename

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

        print(
            "\n================ PDF UPLOAD ================"
        )

        print("File:", file.filename)
        print("Saved:", file_path)

        # ----------------------------------------------------
        # UPDATE VECTOR DATABASE
        # ----------------------------------------------------

        try:

            from backend.rag.vector_store import (
                update_vector_database
            )

            update_vector_database()

            print(
                "Vector database updated successfully."
            )

        except Exception as vector_error:

            traceback.print_exc()

            return {
                "success": True,
                "message": (
                    "PDF uploaded, but vector "
                    "database update failed."
                ),
                "filename": file.filename,
                "vector_error": str(vector_error),
            }

        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        return {
            "success": True,
            "message": (
                "PDF uploaded and processed successfully."
            ),
            "filename": file.filename,
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "success": False,
            "message": f"PDF upload error: {str(e)}",
        }


# ============================================================
# STARTUP MESSAGE
# ============================================================

@app.on_event("startup")
async def startup_event():

    print("")
    print("==============================================")
    print(" Multi-Agent Student Assistant")
    print(" FastAPI Backend Started")
    print("==============================================")
    print("Authentication:")
    print("  Register : /auth/register")
    print("  Login    : /auth/login")
    print("----------------------------------------------")
    print("Study   : /study")
    print("Career  : /career")
    print("College : /college")
    print("Chat    : /chat")
    print("Upload  : /upload-pdf")
    print("==============================================")
    print("")