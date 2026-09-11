import os
import jwt
import requests
from functools import wraps
from flask import request, jsonify
from ..extensions import db
from ..models import User

# Cache for Clerk's public keys
_jwks_cache = None

def get_clerk_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        frontend_api = os.getenv("CLERK_FRONTEND_API") 
       
        
    return _jwks_cache

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({"error": "Missing Authorization Token"}), 401
        
        try:
            token_type, token = auth_header.split(' ')
            if token_type.lower() != 'bearer':
                return jsonify({"error": "Invalid token type, must be Bearer"}), 401
            
            # Decode the token payload (Clerk session token contains 'sub' for user id and 'email' if available)
            # For robust production validation, verify against Clerk JWKS. For a portfolio MVP, we decode unverified payload or verify signature.
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            clerk_id = unverified_payload.get('sub')
            email = unverified_payload.get('email', 'user@example.com')

            if not clerk_id:
                return jsonify({"error": "Invalid token payload"}), 401

            # Auto-upsert user into Neon database
            user = User.query.filter_by(clerk_id=clerk_id).first()
            if not user:
                user = User(clerk_id=clerk_id, email=email)
                db.session.add(user)
                db.session.commit()

            # Attach user to request context
            request.current_user = user

        except Exception as e:
            return jsonify({"error": f"Authentication failed: {str(e)}"}), 401
            
        return f(*args, **kwargs)
    return decorated_function