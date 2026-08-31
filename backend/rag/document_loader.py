from pathlib import Path
from pypdf import PdfReader


# Project root/data/college_documents
DOCUMENTS_DIR = (
    Path(__file__).resolve().parent.parent.parent
    / "data"
    / "college_documents"
)


def load_documents():
    documents = []

    print(f"Looking for PDFs in: {DOCUMENTS_DIR}")

    if not DOCUMENTS_DIR.exists():
        print("ERROR: College documents folder does not exist.")
        return documents

    pdf_files = list(DOCUMENTS_DIR.glob("*.pdf"))

    if not pdf_files:
        print("ERROR: No PDF files found.")
        return documents

    for pdf_file in pdf_files:

        try:
            reader = PdfReader(str(pdf_file))

            text = ""

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

            if text.strip():

                documents.append({
                    "filename": pdf_file.name,
                    "text": text
                })

                print(
                    f"Loaded: {pdf_file.name} "
                    f"({len(text)} characters)"
                )

            else:
                print(
                    f"WARNING: No text extracted from {pdf_file.name}"
                )

        except Exception as e:

            print(
                f"ERROR reading {pdf_file.name}: {e}"
            )

    return documents