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

def regenerate_resume_with_gemini(original_text: str, accepted_edits: list[str]) -> str:
    """Rewrites the resume text cleanly incorporating the user's accepted suggestions."""
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    edits_bullet_points = "\n".join([f"- {edit}" for edit in accepted_edits])
    
    prompt = f"""
    You are an expert professional resume writer. 
    Take the original resume text and rewrite/update it to seamlessly incorporate the following accepted improvements and bullet point suggestions. Maintain a professional, results-oriented tone, correct grammar, and output the clean, complete text of the updated resume. Do not include markdown meta-commentary, just return the final resume text.
    
    Accepted Improvements to Integrate:
    {edits_bullet_points}
    
    Original Resume Text:
    {original_text}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    return response.text