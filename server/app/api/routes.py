import json
from flask import jsonify, request
from . import api_bp
from ..extensions import db
from ..models import Resume, Scan
from ..utils.auth import login_required
from ..services.ai_service import (
    extract_text_from_pdf, 
    analyze_resume_with_gemini, 
    regenerate_resume_with_gemini
)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend fully operational"}), 200

@api_bp.route('/analyze', methods=['POST'])
@login_required
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    file = request.files['resume']
    job_description = request.form.get('job_description', '')

    if file.filename == '' or not job_description:
        return jsonify({"error": "File and job description are required"}), 400

    try:
        # 1. Extract text and run AI analysis
        resume_text = extract_text_from_pdf(file)
        ai_response_text = analyze_resume_with_gemini(resume_text, job_description)
        result_json = json.loads(ai_response_text)

        # 2. Save Resume and Scan to Neon Database linked to current user
        new_resume = Resume(
            user_id=request.current_user.id,
            file_name=file.filename,
            raw_text=resume_text
        )
        db.session.add(new_resume)
        db.session.commit()

        new_scan = Scan(
            resume_id=new_resume.id,
            overall_score=result_json.get('overall_score', 0),
            missing_keywords=result_json.get('missing_keywords', []),
            suggested_edits=result_json.get('suggested_edits', [])
        )
        db.session.add(new_scan)
        db.session.commit()

        # Return response including the database IDs for frontend tracking
        result_json['resume_id'] = new_resume.id
        result_json['scan_id'] = new_scan.id
        return jsonify(result_json), 200

    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@api_bp.route('/regenerate', methods=['POST'])
@login_required
def regenerate_resume():
    data = request.get_json()
    resume_id = data.get('resume_id')
    accepted_edits = data.get('accepted_edits', [])

    if not resume_id or not accepted_edits:
        return jsonify({"error": "resume_id and accepted_edits are required"}), 400

    try:
        # Fetch original resume from Neon
        resume = Resume.query.filter_by(id=resume_id, user_id=request.current_user.id).first()
        if not resume:
            return jsonify({"error": "Resume not found"}), 404

        # Generate updated resume text using Gemini
        updated_text = regenerate_resume_with_gemini(resume.raw_text, accepted_edits)

        return jsonify({
            "message": "Resume successfully regenerated!",
            "updated_resume_text": updated_text
        }), 200

    except Exception as e:
        print(f"Error during regeneration: {e}")
        return jsonify({"error": f"Regeneration failed: {str(e)}"}), 500

def iso_utc(dt):
    if dt is None:
        return None
    return dt.isoformat().replace("+00:00", "Z") if dt.tzinfo else dt.isoformat() + "Z"

@api_bp.route('/resumes', methods=['GET'])
@login_required
def list_resumes():
    try:
        resumes = Resume.query.filter_by(user_id=request.current_user.id).order_by(Resume.created_at.desc()).all()
        result = []
        for resume in resumes:
            latest_scan = Scan.query.filter_by(resume_id=resume.id).order_by(Scan.created_at.desc()).first()
            scan_obj = None
            if latest_scan:
                scan_obj = {
                    "id": latest_scan.id,
                    "overall_score": latest_scan.overall_score,
                    "created_at": iso_utc(latest_scan.created_at)
                }
            result.append({
                "id": resume.id,
                "file_name": resume.file_name,
                "created_at": iso_utc(resume.created_at),
                "latest_scan": scan_obj
            })
        return jsonify(result), 200
    except Exception as e:
        print(f"Error listing resumes: {e}")
        return jsonify({"error": f"Failed to list resumes: {str(e)}"}), 500

@api_bp.route('/scans', methods=['GET'])
@login_required
def list_scans():
    try:
        resume_id = request.args.get('resume_id', type=int)
        query = Scan.query.join(Resume, Scan.resume_id == Resume.id).filter(Resume.user_id == request.current_user.id)
        if resume_id is not None:
            query = query.filter(Scan.resume_id == resume_id)
        scans = query.order_by(Scan.created_at.desc()).all()
        result = []
        for scan in scans:
            result.append({
                "id": scan.id,
                "resume_id": scan.resume_id,
                "overall_score": scan.overall_score,
                "missing_keywords": scan.missing_keywords,
                "suggested_edits": scan.suggested_edits,
                "created_at": iso_utc(scan.created_at)
            })
        return jsonify(result), 200
    except Exception as e:
        print(f"Error listing scans: {e}")
        return jsonify({"error": f"Failed to list scans: {str(e)}"}), 500

@api_bp.route('/scans/<int:scan_id>', methods=['GET'])
@login_required
def get_scan(scan_id):
    try:
        scan = Scan.query.join(Resume, Scan.resume_id == Resume.id).filter(
            Scan.id == scan_id,
            Resume.user_id == request.current_user.id
        ).first()
        if not scan:
            return jsonify({"error": "Scan not found"}), 404
        return jsonify({
            "id": scan.id,
            "resume_id": scan.resume_id,
            "overall_score": scan.overall_score,
            "missing_keywords": scan.missing_keywords,
            "suggested_edits": scan.suggested_edits,
            "created_at": iso_utc(scan.created_at)
        }), 200
    except Exception as e:
        print(f"Error getting scan: {e}")
        return jsonify({"error": f"Failed to get scan: {str(e)}"}), 500