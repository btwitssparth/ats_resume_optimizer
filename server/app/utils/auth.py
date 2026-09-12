import os
from functools import wraps
from flask import request, jsonify
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
from ..extensions import db
from ..models import User

# Cache the Clerk SDK client (it internally caches JWKS lookups too)
_clerk_sdk = None


def get_clerk_sdk():
    global _clerk_sdk
    if _clerk_sdk is None:
        secret_key = os.getenv("CLERK_SECRET_KEY")
        if not secret_key:
            raise RuntimeError("CLERK_SECRET_KEY environment variable is not set")
        _clerk_sdk = Clerk(bearer_auth=secret_key)
    return _clerk_sdk


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({"error": "Missing Authorization Token"}), 401

        try:
            token_type, _ = auth_header.split(' ', 1)
            if token_type.lower() != 'bearer':
                return jsonify({"error": "Invalid token type, must be Bearer"}), 401

            # Verify the token's signature against Clerk's public keys. This
            # (unlike decoding with verify_signature=False) guarantees the
            # token was actually issued by Clerk and hasn't been tampered with.
            request_state = get_clerk_sdk().authenticate_request(
                request, AuthenticateRequestOptions()
            )

            if not request_state.is_signed_in:
                return jsonify({"error": f"Authentication failed: {request_state.message}"}), 401

            payload = request_state.payload or {}
            clerk_id = payload.get('sub')
            email = payload.get('email', 'user@example.com')

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
