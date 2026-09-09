import json
from flask import jsonify, request
from . import api_bp
from ..services.ai_service import extract_text_from_pdf, analyze_resume_with_gemini

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Flask backend running via Factory Pattern"}), 200

@api_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    # 1. Check if the request contains a file and a job description
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    file = request.files['resume']
    job_description = request.form.get('job_description', '')

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not job_description:
        return jsonify({"error": "Job description is required"}), 400

    try:
        # 2. Extract text from the uploaded PDF
        resume_text = extract_text_from_pdf(file)
        
        # 3. Send to Gemini for ATS analysis
        ai_response_text = analyze_resume_with_gemini(resume_text, job_description)
        
        # 4. Parse the strict JSON returned by Gemini and send it back to the frontend
        result_json = json.loads(ai_response_text)
        return jsonify(result_json), 200

    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({"error": "An error occurred during analysis"}), 500