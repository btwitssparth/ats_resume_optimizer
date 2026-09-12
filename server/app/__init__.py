import os
from flask import Flask
from flask_cors import CORS
from .extensions import db
from .models import User, Resume, Scan

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Database Configuration
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is not set")
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with this app
    db.init_app(app)

    # Register Blueprints
    from .api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Create tables automatically inside the application context
    with app.app_context():
        db.create_all()

    return app