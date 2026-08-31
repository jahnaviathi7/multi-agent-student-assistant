
import os
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=API_KEY)

# Current stable Gemini Flash model
MODEL_NAME = "gemini-3.6-flash"


def generate_response(prompt: str) -> str:
    """
    Generate a response using Gemini.

    Automatically retries temporary 503/UNAVAILABLE
    errors before returning a final error message.
    """

    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            if response.text:
                return response.text

            return "AI returned an empty response."

        except Exception as error:
            error_text = str(error)

            print(
                f"Gemini request failed "
                f"(attempt {attempt + 1}/{max_retries}): "
                f"{error_text}"
            )

            # Retry temporary service errors
            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "high demand" in error_text
            ):
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt

                    print(
                        f"Retrying Gemini in "
                        f"{wait_time} seconds..."
                    )

                    time.sleep(wait_time)
                    continue

            # Other errors should not be retried
            return (
                "AI service is temporarily unavailable. "
                "Please try again in a few seconds.\n\n"
                f"Technical error: {error_text}"
            )

    return (
        "AI service is temporarily unavailable. "
        "Please try again later."
    )

