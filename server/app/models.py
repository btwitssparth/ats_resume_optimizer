from datetime import datetime
from .extensions import db
import json

class User(db.Model):
    id = db.Column(db.String(100), primary_key=True) # Clerk User ID
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resumes = db.relationship('Resume', backref='user', lazy=True)

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey('user.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    parsed_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    scans = db.relationship('Scan', backref='resume', lazy=True)

    def to_dict(self):
        latest_scan = Scan.query.filter_by(resume_id=self.id).order_by(Scan.created_at.desc()).first()
        return {
            "id": self.id,
            "file_name": self.file_name,
            "created_at": self.created_at.isoformat(),
            "latest_scan": {
                "id": latest_scan.id,
                "overall_score": latest_scan.overall_score,
                "created_at": latest_scan.created_at.isoformat()
            } if latest_scan else None
        }

class Scan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resume.id'), nullable=False)
    job_title = db.Column(db.String(100), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    job_description = db.Column(db.Text, nullable=False)
    overall_score = db.Column(db.Integer, nullable=False)
    missing_keywords = db.Column(db.Text, nullable=False) # Stored as JSON string
    suggested_edits = db.Column(db.Text, nullable=False)  # Stored as JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "job_title": self.job_title,
            "company": self.company,
            "overall_score": self.overall_score,
            "missing_keywords": json.loads(self.missing_keywords) if self.missing_keywords else [],
            "suggested_edits": json.loads(self.suggested_edits) if self.suggested_edits else [],
            "created_at": self.created_at.isoformat()
        }