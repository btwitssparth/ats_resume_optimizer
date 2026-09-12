from flask import request, jsonify
from . import api_bp
from ..models import db, User, Resume, Scan
from ..utils.auth import login_required  # <-- FIXED IMPORT
import json

@api_bp.route('/analyze', methods=['POST'])
@login_required  # <-- FIXED DECORATOR
def analyze():
    # Your auth.py already fetches the user for us!
    user = request.current_user 
    
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
        
    file = request.files['resume']
    job_description = request.form.get('job_description', '')
    job_title = request.form.get('job_title', 'Target Role')
    company = request.form.get('company', '')

    if not job_description:
        return jsonify({"error": "Job description is required"}), 400

    # Extract text (assuming PyPDF2 is installed)
    import PyPDF2
    pdf_reader = PyPDF2.PdfReader(file)
    parsed_text = ""
    for page in pdf_reader.pages:
        parsed_text += page.extract_text() + "\n"

    # Save Resume (Use whichever ID field links to your User model)
    user_identifier = getattr(user, 'clerk_id', getattr(user, 'id'))
    resume = Resume(
        user_id=user_identifier,
        file_name=file.filename,
        parsed_text=parsed_text
    )
    db.session.add(resume)
    db.session.commit()

    # Call AI Service
    from ..services.ai_service import analyze_resume_with_ai
    ai_result = analyze_resume_with_ai(parsed_text, job_description)

    # Save Scan with the new job_title and company fields
    new_scan = Scan(
        resume_id=resume.id,
        job_title=job_title,
        company=company,
        job_description=job_description,
        overall_score=ai_result.get('overall_score', 0),
        missing_keywords=json.dumps(ai_result.get('missing_keywords', [])),
        suggested_edits=json.dumps(ai_result.get('suggested_edits', []))
    )
    db.session.add(new_scan)
    db.session.commit()

    return jsonify({
        "resume_id": resume.id,
        "scan_id": new_scan.id,
        "overall_score": new_scan.overall_score,
        "missing_keywords": json.loads(new_scan.missing_keywords),
        "suggested_edits": json.loads(new_scan.suggested_edits)
    }), 200