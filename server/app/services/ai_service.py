import os
import pdfplumber
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# 1. Define the Strict JSON Schema using Pydantic
class ATSResponse(BaseModel):
    overall_score: int = Field(description="A score from 0 to 100 representing ATS match.")
    missing_keywords: List[str] = Field(description="Important skills or keywords from the job description missing in the resume.")
    suggested_edits: List[str] = Field(description="Actionable bullet points suggesting how to improve the resume.")
    is_hallucinated_metric: bool = Field(description="Set to true if any suggested edit includes a fake metric or percentage.")

def extract_text_from_pdf(file_stream) -> str:
    """Reads a PDF file stream and returns the extracted raw text."""
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def analyze_resume_with_gemini(resume_text: str, job_description: str) -> str:
    """Sends the resume and job description to Gemini using the new SDK."""
    
    # Initialize the new GenAI client
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    prompt = f"""
    You are an expert technical recruiter and ATS software system. 
    Analyze the provided resume against the job description.
    
    CRITICAL INSTRUCTION: You may ONLY use facts, metrics, skills, and experiences explicitly present in the source resume. 
    NEVER invent, hallucinate, or infer experience, degrees, or skills that are not explicitly stated.
    
    Job Description:
    {job_description}
    
    Candidate Resume:
    {resume_text}
    """

    # Call the model using the new config structure
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ATSResponse,
        )
    )
    
    return response.text