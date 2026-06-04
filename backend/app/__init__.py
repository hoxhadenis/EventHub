from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder='static')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///eventhub.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'segreto_jwt_fallback')

    # Aumentiamo la dimensione massima del payload (es. 16MB) per le immagini
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Importiamo i modelli
    from app.models import user, event
    
    # Registrazione Blueprints
    from app.api.auth import auth_bp
    from app.api.events import events_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)

    return app
